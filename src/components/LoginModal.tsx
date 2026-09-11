import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { UserRole } from '../types';
import { ShieldCheck, Camera, Palette, User, ArrowRight, Lock, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
  inline?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  canDismiss = false,
  inline = false,
}) => {
  const { loginWithCredentials, currentUser } = useWorkflow();
  const [activeTab, setActiveTab] = useState<UserRole>('it_admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginWithCredentials(username, password);
    if (success) {
      setErrorMsg(null);
      if (onClose) onClose();
    } else {
      setErrorMsg('Invalid department credentials. Please enter your username and password.');
    }
  };

  const cardContent = (
    <div
      id="login-dialog-card"
      className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden"
    >
      {/* Top Header */}
      <div className="px-6 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Department Portal</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sign in to access your Department Google Sheets</p>
            </div>
          </div>
          {canDismiss && onClose && (
            <button
              id="close-login-btn"
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>
          )}
        </div>

        {/* Department Selectors */}
        <div className="grid grid-cols-3 gap-1.5 mt-6 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
          <button
            id="tab-it-admin"
            type="button"
            onClick={() => handleTabChange('it_admin')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'it_admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>IT Dept</span>
            {currentUser?.role === 'it_admin' && <Check className="w-3 h-3 ml-0.5 text-emerald-300" />}
          </button>

          <button
            id="tab-photo-team"
            type="button"
            onClick={() => handleTabChange('photo_team')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'photo_team'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>Photo Team</span>
            {currentUser?.role === 'photo_team' && <Check className="w-3 h-3 ml-0.5 text-emerald-300" />}
          </button>

          <button
            id="tab-creative-team"
            type="button"
            onClick={() => handleTabChange('creative_team')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'creative_team'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span>Creative Dept</span>
            {currentUser?.role === 'creative_team' && <Check className="w-3 h-3 ml-0.5 text-emerald-300" />}
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-6 sm:p-7">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <button
            id="submit-login-btn"
            type="submit"
            className={`w-full mt-2 py-3 px-4 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
              activeTab === 'it_admin'
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
                : activeTab === 'photo_team'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
            }`}
          >
            <span>
              Sign In to {activeTab === 'it_admin' ? 'IT Department' : activeTab === 'photo_team' ? 'Photo Team' : 'Creative Department'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Professional Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Department Access Control</span>
          <span>Encrypted Portal Session</span>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div id="login-portal-inline" className="w-full max-w-lg mx-auto py-6 sm:py-10 animate-in fade-in zoom-in-95 duration-200">
        {cardContent}
      </div>
    );
  }

  return (
    <div
      id="login-portal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      {cardContent}
    </div>
  );
};
