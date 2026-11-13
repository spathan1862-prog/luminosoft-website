import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/ui/Logo';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowLeft,
  Phone
} from 'lucide-react';

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
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid administrator credentials. Access denied.');
    }
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
            Administrator Sign In
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Secure access portal for authorized Luminosoft personnel.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-modal rounded-2xl space-y-6">
          
          {/* Error Banner */}
          {error && !showForgotNotice && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!showForgotNotice ? (
            /* =============================================================== */
            /* STANDARD SECURE ADMIN LOGIN FORM                                */
            /* =============================================================== */
            <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
              {/* Admin Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    placeholder="spathan2604@gmail.com"
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
                      setShowForgotNotice(true);
                      setError(null);
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
                    placeholder="Enter your admin password"
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
          ) : (
            /* =============================================================== */
            /* ADMINISTRATOR RECOVERY / ASSISTANCE NOTICE                      */
            /* =============================================================== */
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-white">Administrator Access Verification</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Administrator credentials require elevated clearance and direct verification.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-3">
                <p className="leading-relaxed">
                  To reset your administrator credentials, please contact Luminosoft Technical Administration directly:
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href="mailto:contact@luminosoft.in"
                    className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    <span>contact@luminosoft.in</span>
                  </a>
                  <a
                    href="tel:+917822886909"
                    className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 7822886909</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Administrator Sign In</span>
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
