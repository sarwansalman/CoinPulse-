import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginUser } = useApp();
  const [email, setEmail] = useState('alex@coinpulse.demo');
  const [password, setPassword] = useState('demopass123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setLoading(true);
    const success = await loginUser(email);
    setLoading(false);
    if (success) {
      onNavigate('/dashboard');
    } else {
      setError('Account not found with this email. Please check your credentials or create an account.');
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setLoading(true);
    const success = await loginUser(userEmail);
    setLoading(false);
    if (success) {
      onNavigate(userEmail.includes('admin') ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#080D16] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl bg-[#101927] border border-[#233147] shadow-2xl overflow-hidden">
        {/* Left Side: Branded Illustration Panel (Desktop only) */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-[#0C1320] border-r border-[#1A2637] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#28D7E5]/10 blur-[90px] rounded-full pointer-events-none" />

          <div>
            <BrandLogo />
            <h2 className="mt-8 text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] leading-snug">
              Master Binary Crypto Predictions with Zero Risk
            </h2>
            <p className="mt-3 text-xs text-[#9AA8BB] leading-relaxed">
              Real-time volatility simulation, instant 15-second round settlements, and an auditable demo wallet ledger.
            </p>
          </div>

          {/* Central Emblem Illustration */}
          <div className="my-8 flex justify-center items-center">
            <div className="p-4 rounded-full bg-[#141F30]/80 border border-[#28D7E5]/30 shadow-xl shadow-[#28D7E5]/5">
              <CoinPulseCoin size={96} animated />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A2637] flex items-center justify-between text-[11px] text-[#6E7D92]">
            <span className="flex items-center gap-1.5 text-[#20D997]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Demo Environment Active
            </span>
            <span>200 Coins = $1 USD</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 lg:hidden flex justify-center">
            <BrandLogo />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
              Sign in to CoinPulse
            </h3>
            <p className="text-xs text-[#9AA8BB] mt-1">
              Enter your credentials to access your demo portfolio.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF5C72]/10 border border-[#FF5C72]/20 text-xs text-[#FF5C72]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9AA8BB] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7D92]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#9AA8BB]">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Demo mode: you can use any password with your registered email.')}
                  className="text-[11px] text-[#28D7E5] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7D92]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-11 pl-9 pr-10 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6E7D92] hover:text-[#F1F5FB] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#9AA8BB]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#233147] bg-[#0C1320] text-[#28D7E5] focus:ring-0 focus:outline-none"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-sets for fast evaluation */}
          <div className="mt-6 pt-5 border-t border-[#1A2637]">
            <p className="text-[11px] font-mono text-[#6E7D92] uppercase mb-2">
              Quick 1-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex@coinpulse.demo')}
                className="p-2 rounded-lg bg-[#0C1320] hover:bg-[#141F30] border border-[#233147] text-left transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#28D7E5] shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-semibold text-[#F1F5FB] truncate">Alex Vance</div>
                  <div className="text-[9px] text-[#6E7D92] truncate">Trader (200k)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@coinpulse.demo')}
                className="p-2 rounded-lg bg-[#0C1320] hover:bg-[#141F30] border border-[#233147] text-left transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F5B942] shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-semibold text-[#F1F5FB] truncate">Admin User</div>
                  <div className="text-[9px] text-[#6E7D92] truncate">Full Access</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#9AA8BB]">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="text-[#28D7E5] hover:underline font-semibold"
            >
              Create Account (+200,000 Coins)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
