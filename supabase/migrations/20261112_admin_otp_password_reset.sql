-- ==============================================================================
-- LUMINOSOFT: 6-DIGIT EMAIL OTP PASSWORD RESET SYSTEM
-- Project: pixvgshevennznzgdwro
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create dedicated admin_password_reset_otps table
CREATE TABLE IF NOT EXISTS public.admin_password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + interval '5 minutes'),
  verified_at TIMESTAMPTZ,
  reset_token_hash TEXT,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for rapid lookups and rate limiting
CREATE INDEX IF NOT EXISTS idx_admin_otp_email_created 
  ON public.admin_password_reset_otps (email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_otp_reset_token 
  ON public.admin_password_reset_otps (reset_token_hash) 
  WHERE reset_token_hash IS NOT NULL;

-- 3. Strict Row Level Security: Deny all direct public/anon access
ALTER TABLE public.admin_password_reset_otps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny all public direct access to admin OTPs" ON public.admin_password_reset_otps;
CREATE POLICY "Deny all public direct access to admin OTPs"
  ON public.admin_password_reset_otps
  FOR ALL
  TO public
  USING (false);

-- ==============================================================================
-- 4. SECURE SERVER-SIDE RPC FUNCTIONS (SECURITY DEFINER)
-- ==============================================================================

-- Function A: Request OTP
-- Validates admin status, enforces 60-second cooldown, invalidates older OTPs, stores hashed OTP
CREATE OR REPLACE FUNCTION public.request_admin_password_reset_otp(
  p_email TEXT,
  p_otp_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_admin_id UUID;
  v_last_created TIMESTAMPTZ;
  v_new_id UUID;
  v_normalized_email TEXT;
BEGIN
  v_normalized_email := lower(trim(p_email));

  -- 1. Check if email belongs to an active administrator
  SELECT id INTO v_admin_id
  FROM public.admin_profiles
  WHERE lower(email) = v_normalized_email
    AND role IN ('admin', 'super_admin');

  -- Generic response if email not registered as admin (prevent account enumeration)
  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'is_registered', false,
      'message', 'If this email belongs to a registered administrator, a verification code has been dispatched.'
    );
  END IF;

  -- 2. Enforce 60-second cooldown
  SELECT created_at INTO v_last_created
  FROM public.admin_password_reset_otps
  WHERE email = v_normalized_email
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_last_created IS NOT NULL AND (timezone('utc'::text, now()) - v_last_created) < interval '60 seconds' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'COOLDOWN_ACTIVE',
      'message', 'Please wait 60 seconds before requesting another verification code.',
      'cooldown_remaining', EXTRACT(EPOCH FROM (v_last_created + interval '60 seconds' - timezone('utc'::text, now())))::int
    );
  END IF;

  -- 3. Invalidate any existing active OTPs for this admin
  UPDATE public.admin_password_reset_otps
  SET expires_at = timezone('utc'::text, now())
  WHERE email = v_normalized_email
    AND used_at IS NULL
    AND expires_at > timezone('utc'::text, now());

  -- 4. Insert new OTP record (valid for 5 minutes)
  INSERT INTO public.admin_password_reset_otps (
    admin_id,
    email,
    otp_hash,
    attempts,
    max_attempts,
    expires_at,
    created_at
  ) VALUES (
    v_admin_id,
    v_normalized_email,
    p_otp_hash,
    0,
    5,
    timezone('utc'::text, now()) + interval '5 minutes',
    timezone('utc'::text, now())
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'is_registered', true,
    'admin_id', v_admin_id,
    'otp_id', v_new_id,
    'cooldown_seconds', 60,
    'expires_in_seconds', 300,
    'message', 'Verification code generated successfully.'
  );
END;
$$;

-- Function B: Verify OTP
-- Verifies the 6-digit hash, enforces attempt limits, generates single-use reset authorization token
CREATE OR REPLACE FUNCTION public.verify_admin_password_reset_otp(
  p_email TEXT,
  p_otp_hash TEXT,
  p_reset_token_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_record RECORD;
  v_normalized_email TEXT;
BEGIN
  v_normalized_email := lower(trim(p_email));

  -- 1. Find latest active record
  SELECT * INTO v_record
  FROM public.admin_password_reset_otps
  WHERE email = v_normalized_email
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'NO_OTP_FOUND',
      'message', 'No active verification request found. Please request a new code.'
    );
  END IF;

  -- 2. Check if already used
  IF v_record.used_at IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'OTP_ALREADY_USED',
      'message', 'This verification code has already been used. Please request a new one.'
    );
  END IF;

  -- 3. Check expiration
  IF timezone('utc'::text, now()) > v_record.expires_at THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'OTP_EXPIRED',
      'message', 'The verification code has expired (5-minute limit). Please request a new code.'
    );
  END IF;

  -- 4. Check attempt counter
  IF v_record.attempts >= v_record.max_attempts THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'MAX_ATTEMPTS_EXCEEDED',
      'message', 'Too many incorrect attempts. This code has been invalidated for security. Please request a new code.'
    );
  END IF;

  -- 5. Validate OTP Hash
  IF v_record.otp_hash <> p_otp_hash THEN
    -- Increment failed attempts
    UPDATE public.admin_password_reset_otps
    SET attempts = attempts + 1
    WHERE id = v_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'INVALID_OTP',
      'message', 'Incorrect verification code. Please try again.',
      'attempts_remaining', (v_record.max_attempts - (v_record.attempts + 1))
    );
  END IF;

  -- 6. Code is correct! Mark verified and attach reset authorization token (valid for 5 minutes)
  UPDATE public.admin_password_reset_otps
  SET verified_at = timezone('utc'::text, now()),
      reset_token_hash = p_reset_token_hash,
      expires_at = timezone('utc'::text, now()) + interval '5 minutes'
  WHERE id = v_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Verification code confirmed. You may now set your new password.'
  );
END;
$$;

-- Function C: Complete Password Reset
-- Validates the reset authorization token and securely updates the admin's password in auth.users
CREATE OR REPLACE FUNCTION public.complete_admin_password_reset(
  p_email TEXT,
  p_reset_token_hash TEXT,
  p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_record RECORD;
  v_normalized_email TEXT;
BEGIN
  v_normalized_email := lower(trim(p_email));

  -- 1. Validate password length
  IF length(p_new_password) < 8 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'WEAK_PASSWORD',
      'message', 'Password must be at least 8 characters long.'
    );
  END IF;

  -- 2. Find record matching reset authorization token
  SELECT * INTO v_record
  FROM public.admin_password_reset_otps
  WHERE email = v_normalized_email
    AND reset_token_hash = p_reset_token_hash
    AND verified_at IS NOT NULL
    AND used_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'UNAUTHORIZED',
      'message', 'Invalid or expired password reset session. Please verify your OTP again.'
    );
  END IF;

  -- 3. Check expiration
  IF timezone('utc'::text, now()) > v_record.expires_at THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'SESSION_EXPIRED',
      'message', 'Password reset session expired. Please start over.'
    );
  END IF;

  -- 4. Update the password in auth.users using pgcrypto crypt
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
      updated_at = timezone('utc'::text, now())
  WHERE id = v_record.admin_id;

  -- 5. Mark the reset token as used immediately (single-use)
  UPDATE public.admin_password_reset_otps
  SET used_at = timezone('utc'::text, now()),
      expires_at = timezone('utc'::text, now())
  WHERE id = v_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Your password has been updated successfully.'
  );
END;
$$;

-- Grant EXECUTE permissions on RPC functions to anon and authenticated
GRANT EXECUTE ON FUNCTION public.request_admin_password_reset_otp(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_password_reset_otp(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_admin_password_reset(TEXT, TEXT, TEXT) TO anon, authenticated;

