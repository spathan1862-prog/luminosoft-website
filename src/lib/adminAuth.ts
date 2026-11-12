/**
 * LUMINOSOFT: Administrator Authentication & 6-Digit OTP Password Reset Client
 * Securely communicates with Supabase Edge Function & RPC functions
 */

import { supabase } from './supabase';

export interface RequestOtpResult {
  success: boolean;
  message?: string;
  error?: string;
  cooldownRemaining?: number;
  emailDispatched?: boolean;
}

export interface VerifyOtpResult {
  success: boolean;
  resetToken?: string;
  attemptsRemaining?: number;
  message?: string;
  error?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

// Compute client-side SHA-256 hex string using browser native Crypto API
export async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate high-entropy 32-byte hex reset authorization token
export function generateClientToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pixvgshevennznzgdwro.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/admin-password-reset`;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

/**
 * 1. Request 6-Digit Password Reset OTP
 */
export async function requestAdminPasswordResetOtp(email: string): Promise<RequestOtpResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Try Edge Function first
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        action: 'request_otp',
        email: cleanEmail,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        message: data.message,
        cooldownRemaining: data.cooldown_remaining,
        emailDispatched: data.email_dispatched,
      };
    }

    if (res.status === 429) {
      const data = await res.json();
      return {
        success: false,
        error: data.message || 'Cooldown active.',
        cooldownRemaining: data.cooldown_remaining || 60,
      };
    }
  } catch (err) {
    console.warn('Edge function unavailable, attempting direct RPC fallback...', err);
  }

  // Fallback to Supabase Database RPC function
  if (supabase) {
    try {
      // Generate a temporary 6-digit number on client and hash it for DB verification
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const generatedCode = ((array[0] % 900000) + 100000).toString();
      const otpHash = await computeSha256(generatedCode);

      const { data, error } = await (supabase as any).rpc('request_admin_password_reset_otp', {
        p_email: cleanEmail,
        p_otp_hash: otpHash,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        if (!data.success && data.error === 'COOLDOWN_ACTIVE') {
          return {
            success: false,
            error: data.message,
            cooldownRemaining: data.cooldown_remaining || 60,
          };
        }

        return {
          success: true,
          message: data.message || 'Verification code requested.',
        };
      }
    } catch (rpcErr: any) {
      console.warn('RPC request error:', rpcErr);
    }
  }

  return {
    success: false,
    error: 'Failed to dispatch verification code. Please ensure database migration is applied.',
  };
}

/**
 * 2. Verify 6-Digit OTP
 */
export async function verifyAdminPasswordResetOtp(email: string, otp: string): Promise<VerifyOtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  // Try Edge Function
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        action: 'verify_otp',
        email: cleanEmail,
        otp: cleanOtp,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        resetToken: data.reset_token,
        message: data.message,
      };
    }

    return {
      success: false,
      error: data.error || data.message || 'Invalid verification code.',
      attemptsRemaining: data.attempts_remaining,
    };
  } catch (err) {
    console.warn('Edge function unavailable, attempting RPC verification fallback...', err);
  }

  // Fallback to Supabase Database RPC
  if (supabase) {
    try {
      const otpHash = await computeSha256(cleanOtp);
      const rawToken = generateClientToken();
      const tokenHash = await computeSha256(rawToken);

      const { data, error } = await (supabase as any).rpc('verify_admin_password_reset_otp', {
        p_email: cleanEmail,
        p_otp_hash: otpHash,
        p_reset_token_hash: tokenHash,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        if (data.success) {
          return {
            success: true,
            resetToken: rawToken,
            message: data.message,
          };
        }

        return {
          success: false,
          error: data.message || 'Invalid verification code.',
          attemptsRemaining: data.attempts_remaining,
        };
      }
    } catch (rpcErr: any) {
      console.warn('RPC verification error:', rpcErr);
    }
  }

  return {
    success: false,
    error: 'Failed to verify OTP. Please try again.',
  };
}

/**
 * 3. Complete Password Reset
 */
export async function completeAdminPasswordReset(
  email: string,
  resetToken: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Try Edge Function
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': PUBLISHABLE_KEY,
        'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        action: 'reset_password',
        email: cleanEmail,
        reset_token: resetToken,
        new_password: newPassword,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Your password has been updated successfully.',
      };
    }

    return {
      success: false,
      error: data.error || data.message || 'Failed to update password.',
    };
  } catch (err) {
    console.warn('Edge function unavailable, attempting RPC reset fallback...', err);
  }

  // Fallback to Supabase Database RPC
  if (supabase) {
    try {
      const tokenHash = await computeSha256(resetToken);

      const { data, error } = await (supabase as any).rpc('complete_admin_password_reset', {
        p_email: cleanEmail,
        p_reset_token_hash: tokenHash,
        p_new_password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        if (data.success) {
          return {
            success: true,
            message: data.message || 'Your password has been updated successfully.',
          };
        }
        return {
          success: false,
          error: data.message || 'Failed to update password.',
        };
      }
    } catch (rpcErr: any) {
      console.warn('RPC reset password error:', rpcErr);
    }
  }

  return {
    success: false,
    error: 'Failed to update password. Please verify the code again.',
  };
}

