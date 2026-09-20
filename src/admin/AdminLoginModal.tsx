import React, { useState } from 'react';
import { Shield, Lock, User, KeyRound, AlertCircle, ArrowRight, Eye, EyeOff, Database, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from '../components/BrandLogo';

interface AdminLoginModalProps {
  onLoginSuccess: (adminData: { id: string; username: string; name: string; role: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLoginSuccess }) => {
  const { isLight } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulation de validation (sera branché à l'API PostgreSQL auth plus tard)
    setTimeout(() => {
      setIsLoading(false);
      const cleanUsername = username.trim();
      const cleanPassword = password.trim();

      if (cleanUsername === 'admin' && cleanPassword === '1234567') {
        onLoginSuccess({
          id: 'admin_master_1',
          username: 'admin',
          name: 'Directeur des Opérations FIBB',
          role: 'SUPER_ADMIN'
        });
      } else {
        setError("Identifiants incorrects.");
      }
    }, 450);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#090b10] text-white'
    }`}>
      {/* Background Decorative Rings / Basketball Aura */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] -top-32 -right-32 pointer-events-none" />
        <div className="w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px] -bottom-32 -left-32 pointer-events-none" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Top Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <BrandLogo size="md" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider mb-2 bg-orange-500/10 border-orange-500/30 text-orange-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Portail Restreint • Administration FIBB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Console de Gestion
          </h1>
          <p className={`text-xs mt-1 max-w-xs mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Gestion des rencontres, validation des scores, effectifs clubs et attribution des accès scouts.
          </p>
        </div>

        {/* Login Form Box */}
        <div className={`rounded-2xl border p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border-slate-200 shadow-slate-300/50'
            : 'bg-slate-900/90 border-white/10 shadow-black/80'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label 
                htmlFor="admin-username" 
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                Identifiant Administrateur
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
                      : 'bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus:border-orange-500'
                  }`}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password" 
                  className={`block text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isLight ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-orange-500/40 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-orange-500'
                      : 'bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition hover:opacity-100 ${
                    isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-black text-sm tracking-wide bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Se connecter à la console</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick preset credentials helper */}
          <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] ${
            isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'
          }`}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Accès réservé officiel
            </span>
          </div>
        </div>

        {/* Security watermark */}
        <p className={`text-center text-[10px] font-mono mt-4 uppercase tracking-widest ${
          isLight ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Fédération Ivoirienne de Basketball • Administration Système v2.4
        </p>
      </div>
    </div>
  );
};
