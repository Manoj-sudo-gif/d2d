import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import {
  ShieldCheck,
  Camera,
  Palette,
  LogOut,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  onOpenLoginModal: () => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLoginModal, onOpenSettings }) => {
  const { currentUser, logout } = useWorkflow();

  const currentRoleBadge =
    currentUser?.role === 'it_admin'
      ? {
          label: 'IT Department',
          icon: ShieldCheck,
        }
      : currentUser?.role === 'photo_team'
      ? {
          label: 'Photo Team',
          icon: Camera,
        }
      : {
          label: 'Creative Department',
          icon: Palette,
        };

  const IconComp = currentRoleBadge?.icon;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 shadow-2xs"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Side: Clean minimal D2D text without logo icon */}
        <div className="w-24 sm:w-44 flex items-center">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 select-none">
            D2D
          </span>
        </div>

        {/* Center: Currently Logged In Department */}
        <div className="flex-1 sm:flex-none flex items-center justify-center">
          {currentUser ? (
            <div
              id="active-department-center-badge"
              className="flex items-center gap-2.5 px-4 sm:px-6 py-2 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f9d58] animate-pulse shrink-0" />
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-800 tracking-tight">
                {IconComp && <IconComp className="w-4 h-4 text-slate-700 shrink-0" />}
                <span className="uppercase tracking-wider">{currentRoleBadge.label}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Department Portal
            </span>
          )}
        </div>

        {/* Right Side: Settings (for IT admin) + Logout Button */}
        <div className="w-auto sm:w-44 flex items-center justify-end gap-2 sm:gap-2.5">
          {currentUser ? (
            <>
              {/* Settings button on top right for IT admin */}
              {currentUser.role === 'it_admin' && onOpenSettings && (
                <button
                  id="top-right-settings-btn"
                  type="button"
                  onClick={onOpenSettings}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition shadow-2xs cursor-pointer active:scale-95"
                  title="Configure Google Sheet links"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              )}

              {/* Logout button */}
              <button
                id="top-logout-btn"
                type="button"
                onClick={() => {
                  logout();
                  onOpenLoginModal();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 rounded-xl transition shadow-2xs cursor-pointer active:scale-95"
                title="Logout of current department"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              id="open-login-btn"
              type="button"
              onClick={onOpenLoginModal}
              className="px-4 py-1.5 text-xs font-bold bg-[#0f9d58] hover:bg-[#0b8043] text-white rounded-xl transition shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
