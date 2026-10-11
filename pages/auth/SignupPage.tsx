import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { CoinPulseCoin } from '../../components/brand/CoinPulseCoin';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (route: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { signupUser } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError('Please provide your name or trading handle.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedTerms) {
      setError('Please accept the CoinPulse demo terms to proceed.');
      return;
    }

    setLoading(true);
    const success = await signupUser(displayName.trim(), email.trim());
    setLoading(false);

    if (success) {
      onNavigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#080D16] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl bg-[#101927] border border-[#233147] shadow-2xl overflow-hidden">
        {/* Left Side: Branded Illustration Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-[#0C1320] border-r border-[#1A2637] relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#28D7E5]/10 blur-[90px] rounded-full pointer-events-none" />

          <div>
            <BrandLogo />
            <h2 className="mt-8 text-2xl font-bold font-['Space_Grotesk'] text-[#F1F5FB] leading-snug">
              Instant 200,000 Virtual Coins Welcome Bonus
            </h2>
            <p className="mt-3 text-xs text-[#9AA8BB] leading-relaxed">
              Every new CoinPulse demo account is instantly credited with 200,000 virtual coins ($1,000 USD demo equivalent) with zero deposit required.
            </p>
          </div>

          <div className="my-8 p-5 rounded-xl bg-[#101927] border border-[#28D7E5]/30 flex items-center gap-4">
            <CoinPulseCoin size={54} animated />
            <div>
              <span className="text-[10px] font-mono font-semibold text-[#28D7E5] uppercase">
                AUTOMATIC SIGNUP BONUS
              </span>
              <div className="text-xl font-bold font-mono text-[#F1F5FB] tabular-nums">
                200,000 COINS
              </div>
              <span className="text-[11px] text-[#20D997] font-medium">
                $1,000 demo equivalent credited
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A2637] space-y-2 text-xs text-[#9AA8BB]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#20D997]" />
              <span>Full access to BTC, ETH, and SOL prediction rounds</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#20D997]" />
              <span>Realistic Brownian motion simulated chart engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#20D997]" />
              <span>Zero financial risk • Reset balance anytime</span>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 lg:hidden flex justify-center">
            <BrandLogo />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#F1F5FB]">
              Create Demo Account
            </h3>
            <p className="text-xs text-[#9AA8BB] mt-1">
              Start trading in under 30 seconds with 200,000 virtual coins.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF5C72]/10 border border-[#FF5C72]/20 text-xs text-[#FF5C72]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#9AA8BB] mb-1">
                Display Name / Trader Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7D92]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Satoshi_Pulse"
                  required
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9AA8BB] mb-1">
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
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#9AA8BB] mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7D92]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9AA8BB] mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E7D92]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0C1320] border border-[#233147] focus:border-[#28D7E5] focus:outline-none text-xs text-[#F1F5FB] placeholder-[#526176] transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-[#9AA8BB] leading-snug">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-[#233147] bg-[#0C1320] text-[#28D7E5] focus:ring-0 focus:outline-none"
                />
                <span>
                  I understand that CoinPulse is a practice demo platform. Demo coins have no cash value and cannot be exchanged for fiat currency or real cryptocurrency.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#28D7E5] to-[#14B8A6] text-[#06131A] font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-[#28D7E5]/15 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Claim 200,000 Coins & Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#9AA8BB]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-[#28D7E5] hover:underline font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
