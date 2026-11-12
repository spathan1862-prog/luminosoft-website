import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/ui/Logo';
import { 
  requestAdminPasswordResetOtp, 
  verifyAdminPasswordResetOtp, 
  completeAdminPasswordReset 
} from '../../lib/adminAuth';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';

type RecoveryStep = 'login' | 'request_otp' | 'verify_otp' | 'set_password' | 'success';

export const AdminLoginPage: React.FC = () => {
  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication & Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Recovery Workflow States
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('login');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState<number>(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  // New Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for 6-digit OTP input boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  // 60-Second Cooldown Timer Countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Mask email for security display (e.g. s***4@gmail.com)
  const maskEmail = (str: string) => {
    const parts = str.split('@');
    if (parts.length !== 2) return str;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name.charAt(0)}*@${domain}`;
    return `${name.charAt(0)}${'*'.repeat(Math.min(name.length - 2, 4))}${name.charAt(name.length - 1)}@${domain}`;
  };

  // ---------------------------------------------------------------------------
  // STEP 1: LOGIN SUBMISSION
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setError('Please enter your administrator ID or email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials. Access denied.');
    }
  };

  // ---------------------------------------------------------------------------
  // STEP 2: REQUEST 6-DIGIT OTP
  // ---------------------------------------------------------------------------
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!email.trim()) {
      setError('Please enter your registered administrator email address.');
      return;
    }

    if (cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting a new code.`);
      return;
    }

    setLoading(true);
    const res = await requestAdminPasswordResetOtp(email.trim());
    setLoading(false);

    if (res.success) {
      setRecoveryStep('verify_otp');
      setCooldown(res.cooldownRemaining || 60);
      setOtpDigits(['', '', '', '', '', '']);
      setRemainingAttempts(null);
      setInfoMessage(`A 6-digit verification code has been dispatched to ${maskEmail(email)}. Valid for 5 minutes.`);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } else {
      if (res.cooldownRemaining) {
        setCooldown(res.cooldownRemaining);
      }
      setError(res.error || 'Failed to dispatch verification code. Please try again.');
    }
  };

  // ---------------------------------------------------------------------------
  // 6-DIGIT OTP INPUT HANDLERS
  // ---------------------------------------------------------------------------
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError(null);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);
    setError(null);

    const nextIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[nextIdx]?.focus();
  };

  // ---------------------------------------------------------------------------
  // STEP 3: VERIFY OTP
  // ---------------------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyAdminPasswordResetOtp(email.trim(), fullOtp);
    setLoading(false);

    if (res.success && res.resetToken) {
      setResetToken(res.resetToken);
      setRecoveryStep('set_password');
      setInfoMessage('Verification code confirmed. You may now set your new password.');
    } else {
      if (res.attemptsRemaining !== undefined) {
        setRemainingAttempts(res.attemptsRemaining);
      }
      setError(res.error || 'Invalid or expired verification code.');
    }
  };

  // ---------------------------------------------------------------------------
  // STEP 4: SET NEW PASSWORD
  // ---------------------------------------------------------------------------
  const isPasswordValid = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    if (!resetToken) {
      setError('Verification authorization missing. Please verify your OTP again.');
      setRecoveryStep('request_otp');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!passwordsMatch) {
      setError('New passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    const res = await completeAdminPasswordReset(email.trim(), resetToken, newPassword);
    setLoading(false);

    if (res.success) {
      setRecoveryStep('success');
      setResetToken(null);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(res.error || 'Failed to update password. Please try again.');
    }
  };

  // Cancel and reset back to Login
  const handleCancel = () => {
    setRecoveryStep('login');
    setError(null);
    setInfoMessage(null);
    setResetToken(null);
    setOtpDigits(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Subtle geometric dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        <div className="flex justify-center">
          <Logo size="lg" light />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {recoveryStep === 'login' && 'Administrator Sign In'}
            {recoveryStep === 'request_otp' && 'Password Recovery'}
            {recoveryStep === 'verify_otp' && 'Verify 6-Digit Code'}
            {recoveryStep === 'set_password' && 'Set New Password'}
            {recoveryStep === 'success' && 'Password Updated'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {recoveryStep === 'login' && 'Secure access portal for authorized Luminosoft personnel.'}
            {recoveryStep === 'request_otp' && 'Enter your registered administrator email to receive a 6-digit OTP.'}
            {recoveryStep === 'verify_otp' && `Enter the 6-digit code dispatched to ${maskEmail(email)}.`}
            {recoveryStep === 'set_password' && 'Choose a strong, unique password for your administrator account.'}
            {recoveryStep === 'success' && 'Your administrator credentials have been securely updated.'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-modal rounded-2xl space-y-6">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <span className="block text-[11px] text-amber-400 font-semibold">
                    Attempts remaining: {remainingAttempts} / 5
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Informational Message Banner */}
          {infoMessage && !error && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* STEP 1: STANDARD ADMIN SIGN IN                                     */}
          {/* ================================================================= */}
          {recoveryStep === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
              {/* Admin ID / Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin ID / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    placeholder="Enter your admin ID or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryStep('request_otp');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP 2: FORGOT PASSWORD – REQUEST 6-DIGIT OTP                     */}
          {/* ================================================================= */}
          {recoveryStep === 'request_otp' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registered Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder="Enter registered admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  A 6-digit numeric verification code will be dispatched to this address.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching 6-Digit OTP...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <span>Wait {cooldown}s to Resend</span>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <KeyRound className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel and Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP 3: OTP VERIFICATION (6 Individual Numeric Input Boxes)       */}
          {/* ================================================================= */}
          {recoveryStep === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 text-center mb-3">
                  Enter 6-Digit Numeric Code
                </label>

                {/* 6 Digit Grid */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-slate-800/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4">
                  <span className="text-[11px]">Valid for 5 minutes</span>
                  {cooldown > 0 ? (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Resend in {cooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="submit"
                  disabled={loading || otpDigits.join('').length !== 6}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryStep('request_otp');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP 4: SET NEW PASSWORD (Strictly Hidden until Verified!)        */}
          {/* ================================================================= */}
          {recoveryStep === 'set_password' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter strong new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] space-y-1.5">
                <div className="flex items-center gap-2">
                  {isPasswordValid ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={isPasswordValid ? 'text-emerald-300' : 'text-slate-400'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUpper && hasLower ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={hasUpper && hasLower ? 'text-emerald-300' : 'text-slate-400'}>
                    Uppercase &amp; lowercase letters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={hasNumber ? 'text-emerald-300' : 'text-slate-400'}>
                    At least one number (0-9)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordsMatch ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={passwordsMatch ? 'text-emerald-300' : 'text-slate-400'}>
                    Passwords match
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid || !passwordsMatch}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Administrator Password</span>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* STEP 5: SUCCESS SCREEN                                            */}
          {/* ================================================================= */}
          {recoveryStep === 'success' && (
            <div className="text-center space-y-5 py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">
                  Password Updated Successfully
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Your administrator password has been updated. You can now sign in using your new credentials.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryStep('login');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Sign In with New Password</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
