// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code runs in a Supabase Edge Function (Deno runtime)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.109.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestPayload {
  action: "request_otp" | "verify_otp" | "reset_password";
  email: string;
  otp?: string;
  reset_token?: string;
  new_password?: string;
}

// Generate cryptographically secure random 6-digit number
function generateNumericOTP(): string {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  const code = (buffer[0] % 900000) + 100000;
  return code.toString();
}

// Compute SHA-256 hex digest
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate cryptographically secure random reset authorization token
function generateResetToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// HTML Email Template for LUMINOSOFT Admin Password Reset OTP
function generateOTPEmailHtml(otp: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMINOSOFT Admin Password Reset OTP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #ffffff;">
                LUMINO<span style="color: #2563eb;">SOFT</span>
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 600;">
                Administrator Security Verification
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 36px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: #ffffff;">
                Password Reset Verification Code
              </h2>
              <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                We received a request to reset the password for your LUMINOSOFT Administrator account. Please enter the following 6-digit verification code on the admin login screen to continue:
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 28px;">
                <tr>
                  <td align="center" style="background-color: #1e293b; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; display: inline-block; padding-left: 10px;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Security Advice -->
              <div style="background-color: #1e1b4b; border-left: 4px solid #6366f1; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #cbd5e1;">
                  ⏳ <strong>This code is strictly valid for 5 minutes</strong> and can only be used once.
                </p>
                <p style="margin: 6px 0 0; font-size: 11px; line-height: 1.5; color: #94a3b8;">
                  For security, entering an incorrect code more than 5 times will automatically invalidate this request.
                </p>
              </div>

              <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #64748b;">
                <strong>Did not request this code?</strong> If you did not make this request, your account credentials may have been entered in error. No changes have been made to your password. You can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0b1120; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; ${new Date().getFullYear()} Luminosoft Technologies. All rights reserved.
              </p>
              <p style="margin: 4px 0 0; font-size: 10px; color: #334155;">
                Official Security Notification &bull; https://luminosoft.in
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
    const senderEmail = Deno.env.get("SENDER_EMAIL") || "Luminosoft Security <security@luminosoft.in>";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration missing SUPABASE credentials." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    const body: RequestPayload = await req.json();
    const { action, email } = body;

    if (!email || !email.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Email address is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // =========================================================================
    // ACTION 1: REQUEST OTP
    // =========================================================================
    if (action === "request_otp") {
      // 1. Verify that email is registered as an admin
      const { data: adminProfile, error: profileErr } = await supabaseAdmin
        .from("admin_profiles")
        .select("id, email, role")
        .eq("email", normalizedEmail)
        .in("role", ["admin", "super_admin"])
        .maybeSingle();

      if (profileErr) {
        console.error("Profile check error:", profileErr);
      }

      // Safe response if email not registered (anti-enumeration)
      if (!adminProfile) {
        return new Response(
          JSON.stringify({
            success: true,
            is_registered: false,
            message: "If this email belongs to a registered administrator, a verification code has been dispatched.",
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 2. Check 60-second cooldown
      const { data: lastOtp } = await supabaseAdmin
        .from("admin_password_reset_otps")
        .select("created_at")
        .eq("email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastOtp && lastOtp.created_at) {
        const diffSeconds = (Date.now() - new Date(lastOtp.created_at).getTime()) / 1000;
        if (diffSeconds < 60) {
          const waitTime = Math.ceil(60 - diffSeconds);
          return new Response(
            JSON.stringify({
              success: false,
              error: "COOLDOWN_ACTIVE",
              message: `Please wait ${waitTime} seconds before requesting a new code.`,
              cooldown_remaining: waitTime,
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // 3. Invalidate prior active OTPs
      await supabaseAdmin
        .from("admin_password_reset_otps")
        .update({ expires_at: new Date().toISOString() })
        .eq("email", normalizedEmail)
        .is("used_at", null);

      // 4. Generate random 6-digit numeric OTP and hash it
      const plainOtp = generateNumericOTP();
      const otpHash = await sha256(plainOtp);

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

      const { error: insertErr } = await supabaseAdmin
        .from("admin_password_reset_otps")
        .insert({
          admin_id: adminProfile.id,
          email: normalizedEmail,
          otp_hash: otpHash,
          attempts: 0,
          max_attempts: 5,
          expires_at: expiresAt,
        });

      if (insertErr) {
        console.error("Failed to store OTP:", insertErr);
        return new Response(
          JSON.stringify({ success: false, error: "Database error storing verification code." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 5. Send Email via Resend API
      let emailDispatched = false;
      let emailError: string | null = null;

      if (resendApiKey) {
        try {
          const emailHtml = generateOTPEmailHtml(plainOtp);
          const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: senderEmail,
              to: [normalizedEmail],
              subject: "LUMINOSOFT Admin Password Reset OTP",
              html: emailHtml,
            }),
          });

          if (resendRes.ok) {
            emailDispatched = true;
          } else {
            const errBody = await resendRes.text();
            emailError = `Resend API error (${resendRes.status}): ${errBody}`;
            console.error(emailError);
          }
        } catch (e: any) {
          emailError = `Resend network error: ${e.message}`;
          console.error(emailError);
        }
      } else {
        emailError = "RESEND_API_KEY is not configured in Edge Function secrets.";
        console.warn(emailError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          is_registered: true,
          cooldown_seconds: 60,
          expires_in_seconds: 300,
          email_dispatched: emailDispatched,
          email_error: emailError ? "EMAIL_PENDING_CONFIG" : undefined,
          message: emailDispatched
            ? "A 6-digit verification code has been dispatched to your email."
            : "Verification code generated. Please configure email provider secrets.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // =========================================================================
    // ACTION 2: VERIFY OTP
    // =========================================================================
    if (action === "verify_otp") {
      const { otp } = body;
      if (!otp || otp.trim().length !== 6) {
        return new Response(
          JSON.stringify({ success: false, error: "Please enter the complete 6-digit verification code." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const inputHash = await sha256(otp.trim());

      // Get latest OTP record
      const { data: record, error: fetchErr } = await supabaseAdmin
        .from("admin_password_reset_otps")
        .select("*")
        .eq("email", normalizedEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchErr || !record) {
        return new Response(
          JSON.stringify({ success: false, error: "No active verification request found. Please request a new code." }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already used
      if (record.used_at) {
        return new Response(
          JSON.stringify({ success: false, error: "This code has already been used. Please request a new one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check expiration
      if (new Date() > new Date(record.expires_at)) {
        return new Response(
          JSON.stringify({ success: false, error: "Verification code has expired (5-minute limit). Please request a new one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check max attempts
      if (record.attempts >= record.max_attempts) {
        return new Response(
          JSON.stringify({ success: false, error: "Maximum verification attempts exceeded. Code has been invalidated." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Compare hashes
      if (record.otp_hash !== inputHash) {
        const newAttempts = record.attempts + 1;
        await supabaseAdmin
          .from("admin_password_reset_otps")
          .update({ attempts: newAttempts })
          .eq("id", record.id);

        const remaining = Math.max(0, record.max_attempts - newAttempts);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Incorrect verification code.",
            attempts_remaining: remaining,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Match found! Issue single-use reset authorization token
      const rawResetToken = generateResetToken();
      const resetTokenHash = await sha256(rawResetToken);

      await supabaseAdmin
        .from("admin_password_reset_otps")
        .update({
          verified_at: new Date().toISOString(),
          reset_token_hash: resetTokenHash,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        })
        .eq("id", record.id);

      return new Response(
        JSON.stringify({
          success: true,
          reset_token: rawResetToken,
          message: "Code verified successfully. You may now set a new password.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // =========================================================================
    // ACTION 3: SET NEW PASSWORD
    // =========================================================================
    if (action === "reset_password") {
      const { reset_token, new_password } = body;

      if (!reset_token || !new_password) {
        return new Response(
          JSON.stringify({ success: false, error: "Reset token and new password are required." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (new_password.length < 8) {
        return new Response(
          JSON.stringify({ success: false, error: "Password must be at least 8 characters long." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const inputTokenHash = await sha256(reset_token);

      // Verify token
      const { data: record, error: verifyErr } = await supabaseAdmin
        .from("admin_password_reset_otps")
        .select("*")
        .eq("email", normalizedEmail)
        .eq("reset_token_hash", inputTokenHash)
        .not("verified_at", "is", null)
        .is("used_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (verifyErr || !record) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid or expired authorization. Please verify code again." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (new Date() > new Date(record.expires_at)) {
        return new Response(
          JSON.stringify({ success: false, error: "Password reset session has expired. Please restart the request." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update password in Supabase Auth using Admin API
      const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
        record.admin_id,
        { password: new_password }
      );

      if (updateAuthErr) {
        console.error("Supabase Admin password update failed:", updateAuthErr);
        return new Response(
          JSON.stringify({ success: false, error: updateAuthErr.message || "Failed to update password." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Invalidate token immediately
      await supabaseAdmin
        .from("admin_password_reset_otps")
        .update({
          used_at: new Date().toISOString(),
          expires_at: new Date().toISOString(),
        })
        .eq("id", record.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Your password has been updated successfully.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Unhandled Edge Function error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || "An unexpected server error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

