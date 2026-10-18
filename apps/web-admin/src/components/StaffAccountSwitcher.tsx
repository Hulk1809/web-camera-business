import React, { useState, useEffect } from 'react';
import { AdvisorStaff, PRESET_STAFF_ACCOUNTS } from '../types/chat';
import { chatSyncService } from '../services/chatSyncService';
import { ChevronDown, Check, UserCheck, Shield } from 'lucide-react';

interface StaffAccountSwitcherProps {
  onStaffChange?: (staff: AdvisorStaff) => void;
}

export const StaffAccountSwitcher: React.FC<StaffAccountSwitcherProps> = ({ onStaffChange }) => {
  const [currentStaff, setCurrentStaff] = useState<AdvisorStaff>(chatSyncService.getActiveStaff());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleStaffEvent = (e: any) => {
      if (e.detail) {
        setCurrentStaff(e.detail);
      }
    };
    window.addEventListener('PROGEAR_STAFF_CHANGED', handleStaffEvent);
    return () => window.removeEventListener('PROGEAR_STAFF_CHANGED', handleStaffEvent);
  }, []);

  const selectStaff = (staff: AdvisorStaff) => {
    chatSyncService.setActiveStaff(staff);
    setCurrentStaff(staff);
    setIsOpen(false);
    if (onStaffChange) onStaffChange(staff);
  };

  return (
    <div data-testid="staff-account-switcher" className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="btn-toggle-staff-switcher"
        className="flex items-center space-x-2 py-1 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition shadow-2xs text-left"
      >
        <img
          src={currentStaff.avatar}
          alt={currentStaff.name}
          className="w-7 h-7 rounded-full object-cover border border-indigo-200"
        />
        <div className="hidden sm:block">
          <div className="font-bold text-xs text-slate-900 leading-tight flex items-center gap-1">
            <span>{currentStaff.name}</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-semibold border border-indigo-200">
              {currentStaff.role}
            </span>
          </div>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Đang trực tuyến</span>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-lg border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-1 text-xs">
          <div className="px-2 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>CHUYỂN TÀI KHOẢN TƯ VẤN VIÊN</span>
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          </div>

          <div className="space-y-1 mt-1.5">
            {PRESET_STAFF_ACCOUNTS.map((staff) => {
              const isSelected = staff.id === currentStaff.id;
              return (
                <button
                  key={staff.id}
                  onClick={() => selectStaff(staff)}
                  className={`w-full flex items-center justify-between p-2 rounded-md transition text-left ${
                    isSelected ? 'bg-indigo-50/80 border border-indigo-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <span>{staff.name}</span>
                        <span className="text-[9.5px] text-indigo-700 font-mono">({staff.role})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{staff.specialty}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 px-2">
            Mỗi tư vấn viên tiếp nhận riêng từng khách để tránh nhầm lẫn.
          </div>
        </div>
      )}
    </div>
  );
};
