import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { DevshreeLogo } from '../common/DevshreeLogo';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC<{ onCancel?: () => void }> = ({ onCancel }) => {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Access denied.');
      }
    } catch {
      setError('Connection failure. Please check server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#083B82] flex items-center justify-center p-4">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-radial from-transparent to-black/40 pointer-events-none" />

      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-blue-200">
        <div className="text-center space-y-3 mb-6">
          <DevshreeLogo size="lg" className="mx-auto" />
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#124DA6] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Portal</span>
            </span>
            <h1 className="text-xl font-black text-gray-900 mt-2">
              Store Control & CMS
            </h1>
            <p className="text-xs text-gray-500">
              Authorized personnel only. Sessions are monitored.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Admin Email / Username
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter admin email address"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full text-xs pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#083B82] focus:ring-2 focus:ring-[#083B82]/15 focus:bg-white shadow-xs transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Secret Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter secret password"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className={`w-full text-xs pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#083B82] focus:ring-2 focus:ring-[#083B82]/15 focus:bg-white shadow-xs transition-all ${
                  showPassword ? 'tracking-normal' : 'tracking-widest'
                }`}
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Devshree Security v2.4</span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-[#124DA6] hover:underline font-bold"
            >
              Back to Storefront
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
