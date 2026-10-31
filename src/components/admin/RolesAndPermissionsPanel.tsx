import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Key,
  Share2,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  ArrowRightLeft,
  X,
  Eye,
  Check,
  CornerDownRight,
  UserCheck,
  UserX,
  History,
  Info
} from 'lucide-react';
import { AdminRole, AdminStaffUser, AdminPanelTabId, TabTransferRecord } from '../../types';
import { ALL_ADMIN_TABS } from '../../data/initialRolesData';

export const RolesAndPermissionsPanel: React.FC = () => {
  const {
    adminRoles,
    addAdminRole,
    updateAdminRole,
    deleteAdminRole,
    adminStaffUsers,
    createAdminStaffUser,
    updateAdminStaffUser,
    deleteAdminStaffUser,
    tabTransfers,
    transferOrShareTab,
    revokeTransferredTab,
    currentStaffSession,
    setCurrentStaffSession,
    activeRoleOverride,
    setActiveRoleOverride,
    showToast,
  } = useApp();

  // Active sub-tab
  const [subTab, setSubTab] = useState<'staff' | 'roles' | 'transfers' | 'preview'>('staff');

  // Modals state
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaffUser | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Staff Form State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRoleId, setStaffRoleId] = useState('role-fulfillment');
  const [staffPassword, setStaffPassword] = useState('pass123');
  const [staffAccessPin, setStaffAccessPin] = useState('1234');
  const [staffIsActive, setStaffIsActive] = useState(true);
  const [staffNotes, setStaffNotes] = useState('');

  // Role Form State
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleColor, setRoleColor] = useState<'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'indigo'>('blue');
  const [roleTabs, setRoleTabs] = useState<AdminPanelTabId[]>(['orders', 'inventory']);

  // Transfer Form State
  const [transferTabId, setTransferTabId] = useState<AdminPanelTabId>('ads');
  const [transferTargetId, setTransferTargetId] = useState<string>('');
  const [transferPermType, setTransferPermType] = useState<'full_edit' | 'view_only'>('full_edit');
  const [transferNote, setTransferNote] = useState('');

  // Open Staff Modal
  const handleOpenStaffCreate = () => {
    setEditingStaff(null);
    setStaffName('');
    setStaffEmail('');
    setStaffPhone('+91 ');
    setStaffRoleId(adminRoles[1]?.id || 'role-fulfillment');
    setStaffPassword('staff2026');
    setStaffAccessPin(Math.floor(1000 + Math.random() * 9000).toString());
    setStaffIsActive(true);
    setStaffNotes('');
    setIsStaffModalOpen(true);
  };

  const handleOpenStaffEdit = (staff: AdminStaffUser) => {
    setEditingStaff(staff);
    setStaffName(staff.fullName);
    setStaffEmail(staff.email);
    setStaffPhone(staff.phone || '');
    setStaffRoleId(staff.roleId);
    setStaffPassword(staff.password || '');
    setStaffAccessPin(staff.accessPin || '1234');
    setStaffIsActive(staff.isActive);
    setStaffNotes(staff.notes || '');
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) {
      showToast('Please provide full name and email address.', 'error');
      return;
    }

    if (editingStaff) {
      updateAdminStaffUser(editingStaff.id, {
        fullName: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        roleId: staffRoleId,
        password: staffPassword.trim(),
        accessPin: staffAccessPin.trim(),
        isActive: staffIsActive,
        notes: staffNotes.trim(),
      });
    } else {
      createAdminStaffUser({
        fullName: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim(),
        roleId: staffRoleId,
        password: staffPassword.trim(),
        accessPin: staffAccessPin.trim(),
        isActive: staffIsActive,
        notes: staffNotes.trim(),
      });
    }

    setIsStaffModalOpen(false);
  };

  // Open Role Modal
  const handleOpenRoleCreate = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setRoleColor('emerald');
    setRoleTabs(['orders', 'products']);
    setIsRoleModalOpen(true);
  };

  const handleOpenRoleEdit = (role: AdminRole) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setRoleColor(role.color);
    setRoleTabs([...role.accessibleTabs]);
    setIsRoleModalOpen(true);
  };

  const handleToggleTabInRole = (tabId: AdminPanelTabId) => {
    if (roleTabs.includes(tabId)) {
      setRoleTabs(roleTabs.filter((t) => t !== tabId));
    } else {
      setRoleTabs([...roleTabs, tabId]);
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      showToast('Please provide a role name.', 'error');
      return;
    }
    if (roleTabs.length === 0) {
      showToast('Please authorize at least one panel tab for this role.', 'error');
      return;
    }

    if (editingRole) {
      updateAdminRole(editingRole.id, {
        name: roleName.trim(),
        description: roleDescription.trim(),
        color: roleColor,
        accessibleTabs: roleTabs,
      });
    } else {
      addAdminRole({
        name: roleName.trim(),
        description: roleDescription.trim(),
        color: roleColor,
        accessibleTabs: roleTabs,
      });
    }

    setIsRoleModalOpen(false);
  };

  // Open Transfer Modal
  const handleOpenTransfer = (preselectedTab?: AdminPanelTabId) => {
    setTransferTabId(preselectedTab || 'ads');
    setTransferTargetId(adminStaffUsers[1]?.id || adminStaffUsers[0]?.id || '');
    setTransferPermType('full_edit');
    setTransferNote('');
    setIsTransferModalOpen(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetId) {
      showToast('Please select a recipient appointed staff or role.', 'error');
      return;
    }

    transferOrShareTab(transferTabId, transferTargetId, transferPermType, transferNote.trim());
    setIsTransferModalOpen(false);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'blue':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'rose':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Role Impersonator / Preview Switcher */}
      <div className="p-6 bg-gradient-to-r from-[#171717] via-[#141414] to-[#101010] rounded-2xl border border-[#C59B27]/30 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-royal font-bold text-white tracking-wide">
                Staff Authentication, Role Creation &amp; Panel Tab Authorization
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic">
              Appoint staff managers, establish roles with granular panel authorization, and transfer/share individual dashboard tabs directly into appointed dashboards.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleOpenTransfer()}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-royal text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-300" />
              <span>Transfer Panel Tab</span>
            </button>

            <button
              onClick={handleOpenStaffCreate}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C59B27] via-[#D8AD34] to-[#B08920] hover:from-[#D8AD34] hover:to-[#C59B27] text-black font-royal text-xs font-black tracking-wide flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Staff Auth</span>
            </button>
          </div>
        </div>

        {/* Live Role Simulation / Active View Switcher */}
        <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Sliders className="w-4 h-4 text-[#E5C158]" />
            <span className="font-royal font-bold text-white">Live Dashboard View Simulator:</span>
            <span className="text-gray-400">
              {activeRoleOverride
                ? `Simulating appointed role: "${adminRoles.find((r) => r.id === activeRoleOverride)?.name}"`
                : 'Active as Master Root Admin (Full Store Access)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeRoleOverride || 'root'}
              onChange={(e) => setActiveRoleOverride(e.target.value === 'root' ? null : e.target.value)}
              className="px-3 py-1.5 bg-[#171717] border border-[#C59B27]/40 rounded-lg text-xs font-royal text-[#E5C158] focus:outline-none"
            >
              <option value="root">👑 Master Super Admin (All Tabs Unlocked)</option>
              {adminRoles
                .filter((r) => !r.isSystemDefault)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    🔒 {r.name} ({r.accessibleTabs.length} Authorized Tabs)
                  </option>
                ))}
            </select>

            {activeRoleOverride && (
              <button
                onClick={() => setActiveRoleOverride(null)}
                className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-royal font-bold"
              >
                Reset to Root View
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-royal font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'staff'
              ? 'bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Appointed Staff &amp; Authentications ({adminStaffUsers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-royal font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'roles'
              ? 'bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role Definitions &amp; Authorizations ({adminRoles.length})</span>
        </button>

        <button
          onClick={() => setSubTab('transfers')}
          className={`px-4 py-2 rounded-xl text-xs font-royal font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'transfers'
              ? 'bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Transferred &amp; Shared Tabs ({tabTransfers.length})</span>
        </button>

        <button
          onClick={() => setSubTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-royal font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            subTab === 'preview'
              ? 'bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Appointed Dashboard Matrix</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. APPOINTED STAFF & AUTHENTICATIONS */}
      {/* ========================================================= */}
      {subTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-royal font-bold text-white flex items-center gap-2">
              <span>Appointed Staff Directory</span>
              <span className="text-xs text-gray-400 font-sans">• Staff can sign in with Email/Password or 4-digit PIN</span>
            </h3>

            <button
              onClick={handleOpenStaffCreate}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-royal text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Appoint New Staff Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminStaffUsers.map((staff) => {
              const assignedRole = adminRoles.find((r) => r.id === staff.roleId);
              const isMaster = staff.id === 'staff-master-1';
              const delegatedCount = staff.delegatedTabs?.length || 0;

              return (
                <div
                  key={staff.id}
                  className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#C59B27]/40 p-4 space-y-3.5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-royal font-bold text-white text-sm">{staff.fullName}</h4>
                          {isMaster && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-royal bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              ROOT OWNER
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-sans">{staff.email}</p>
                        {staff.phone && <p className="text-[11px] text-gray-500 font-sans">{staff.phone}</p>}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-royal border ${
                          staff.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {staff.isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </div>

                    {/* Assigned Role & PIN info */}
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Appointed Role:</span>
                        <span className={`px-2 py-0.5 rounded-full font-royal font-bold text-[10px] border ${getColorClasses(assignedRole?.color || 'blue')}`}>
                          {assignedRole?.name || 'Staff'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between font-mono">
                        <span className="text-gray-400">Quick Login PIN:</span>
                        <span className="text-[#E5C158] font-bold tracking-widest">{staff.accessPin || '8888'}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Password:</span>
                        <span className="text-gray-300 font-mono">••••••••</span>
                      </div>
                    </div>

                    {/* Authorized Tabs Pills */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Accessible Panel Tabs:</span>
                        <span className="text-[#E5C158] font-bold">
                          {isMaster ? 'All 13 Tabs' : `${(assignedRole?.accessibleTabs.length || 0) + delegatedCount} Tabs`}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {isMaster ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#C59B27]/20 text-[#E5C158] font-royal font-bold">
                            Full Unrestricted Access
                          </span>
                        ) : (
                          <>
                            {assignedRole?.accessibleTabs.slice(0, 4).map((tId) => (
                              <span
                                key={tId}
                                className="px-2 py-0.5 rounded text-[9px] bg-white/5 text-gray-300 font-royal"
                              >
                                {tId}
                              </span>
                            ))}
                            {(assignedRole?.accessibleTabs.length || 0) > 4 && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-gray-400">
                                +{(assignedRole?.accessibleTabs.length || 0) - 4} more
                              </span>
                            )}
                          </>
                        )}

                        {delegatedCount > 0 && (
                          <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-royal font-bold">
                            +{delegatedCount} Transferred Tab{delegatedCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        // Fast simulate as this staff user
                        if (staff.roleId) {
                          setActiveRoleOverride(staff.roleId);
                          setCurrentStaffSession(staff);
                          showToast(`Switched active view to ${staff.fullName}'s appointed dashboard!`, 'success');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#C59B27]/15 hover:bg-[#C59B27]/30 text-[#E5C158] font-royal text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Simulate this staff member's view"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview Panel</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenStaffEdit(staff)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300"
                        title="Edit credentials & role"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {!isMaster && (
                        <button
                          onClick={() => deleteAdminStaffUser(staff.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Remove staff member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ROLE DEFINITIONS & AUTHORIZATIONS */}
      {/* ========================================================= */}
      {subTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-royal font-bold text-white flex items-center gap-2">
              <span>Appointed Roles &amp; Tab Permissions</span>
              <span className="text-xs text-gray-400 font-sans">• Define roles and authorize specific tabs</span>
            </h3>

            <button
              onClick={handleOpenRoleCreate}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-royal text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Create New Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminRoles.map((role) => {
              const staffCount = adminStaffUsers.filter((u) => u.roleId === role.id).length;

              return (
                <div
                  key={role.id}
                  className="bg-[#141414] rounded-2xl border border-white/10 hover:border-[#C59B27]/30 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-royal font-bold text-white text-base">{role.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-royal border ${getColorClasses(role.color)}`}>
                            {staffCount} Staff Appointed
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-serif-luxury italic">{role.description}</p>
                      </div>

                      {role.isSystemDefault && (
                        <span className="p-1 rounded-lg bg-amber-500/10 text-amber-300" title="System Master Role">
                          <Lock className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Authorized Tabs List */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-royal text-gray-400 font-bold">
                        Authorized Dashboard Tabs ({role.accessibleTabs.length} of {ALL_ADMIN_TABS.length}):
                      </span>

                      <div className="flex flex-wrap gap-1.5">
                        {ALL_ADMIN_TABS.map((tab) => {
                          const isAuthorized = role.accessibleTabs.includes(tab.id);
                          return (
                            <span
                              key={tab.id}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-royal flex items-center gap-1 transition-all ${
                                isAuthorized
                                  ? 'bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40 font-bold'
                                  : 'bg-white/5 text-gray-500 line-through opacity-50'
                              }`}
                            >
                              {isAuthorized ? <Check className="w-3 h-3 text-[#E5C158]" /> : <Lock className="w-3 h-3 text-gray-500" />}
                              <span>{tab.label}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenTransfer()}
                      className="text-xs font-royal text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Transfer a Tab to this Role</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenRoleEdit(role)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300"
                        title="Edit Role & Tab Authorizations"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {!role.isSystemDefault && (
                        <button
                          onClick={() => deleteAdminRole(role.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete Role"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TRANSFERRED & SHARED TABS */}
      {/* ========================================================= */}
      {subTab === 'transfers' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-200 space-y-1">
              <p className="font-royal font-bold text-sm text-purple-300">
                Dynamic Tab Transfer &amp; Panel Delegation Engine
              </p>
              <p>
                As Super Admin, you can delegate or transfer any panel tab (e.g. Advertisement Videos, Customer CRM, AI Chatbot, Live Orders) directly to an appointed staff manager or custom role.
                When transferred, the tab instantly unlocks on that recipient&rsquo;s appointed dashboard. You can revoke access at any time.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-royal font-bold text-white flex items-center gap-2">
              <span>Active Tab Delegation Logs ({tabTransfers.length})</span>
            </h3>

            <button
              onClick={() => handleOpenTransfer()}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-royal text-xs font-bold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Transfer New Panel Tab</span>
            </button>
          </div>

          {tabTransfers.length === 0 ? (
            <div className="p-12 text-center bg-[#141414] rounded-2xl border border-dashed border-white/15 space-y-2">
              <Share2 className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-gray-400 text-xs font-royal">No active tab delegations. All tabs managed under default roles.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tabTransfers.map((xfer) => {
                const tabInfo = ALL_ADMIN_TABS.find((t) => t.id === xfer.tabId);

                return (
                  <div
                    key={xfer.id}
                    className="p-4 bg-[#141414] rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0 mt-0.5">
                        <Share2 className="w-4 h-4" />
                      </span>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-royal font-bold bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40">
                            TAB: {tabInfo?.label || xfer.tabId}
                          </span>
                          <span className="text-gray-400 text-xs">➔ Transferred to</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-royal font-bold bg-white/10 text-white">
                            {xfer.targetName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-royal font-bold">
                            {xfer.permissionType === 'full_edit' ? 'FULL CONTROL' : 'VIEW ONLY'}
                          </span>
                        </div>

                        {xfer.note && (
                          <p className="text-xs text-gray-300 font-serif-luxury italic">{xfer.note}</p>
                        )}

                        <p className="text-[11px] text-gray-500 font-sans">
                          Delegated by {xfer.sourceRoleOrAdmin} • {new Date(xfer.transferredAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => revokeTransferredTab(xfer.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-royal text-xs font-bold flex items-center gap-1 self-start md:self-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke Access</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. APPOINTED DASHBOARD MATRIX */}
      {/* ========================================================= */}
      {subTab === 'preview' && (
        <div className="p-5 bg-[#141414] rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C59B27]" />
            <span>Master Authorization Matrix Across Roles</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-royal">
                  <th className="py-2.5 px-3">Dashboard Panel Tab</th>
                  {adminRoles.map((r) => (
                    <th key={r.id} className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getColorClasses(r.color)}`}>
                        {r.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ALL_ADMIN_TABS.map((tab) => (
                  <tr key={tab.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-royal font-bold text-white flex items-center gap-2">
                      <span>{tab.label}</span>
                      <span className="text-[10px] text-gray-500 font-normal">({tab.id})</span>
                    </td>
                    {adminRoles.map((role) => {
                      const hasAccess = role.accessibleTabs.includes(tab.id);
                      return (
                        <td key={role.id} className="py-2.5 px-3 text-center">
                          {hasAccess ? (
                            <span className="inline-flex p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="inline-flex p-1 rounded-md bg-white/5 text-gray-600">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CREATE / EDIT STAFF AUTH */}
      {/* ========================================================= */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#141414] rounded-2xl border border-[#C59B27]/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E5C158]">
                  <Key className="w-5 h-5" />
                </span>
                <h3 className="font-royal text-base font-bold text-white">
                  {editingStaff ? 'Edit Staff Credentials & Authorizations' : 'Create Staff Authentication & Appoint Role'}
                </h3>
              </div>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5">
              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Email / Username *</label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="vikram.orders@qualitypaan.com"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="+91 98123 45678"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Appoint Role *</label>
                <select
                  value={staffRoleId}
                  onChange={(e) => setStaffRoleId(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                >
                  {adminRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.accessibleTabs.length} Authorized Tabs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Portal Password</label>
                  <input
                    type="text"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="staff2026"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white font-mono focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Quick Access PIN (4-Digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={staffAccessPin}
                    onChange={(e) => setStaffAccessPin(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-[#E5C158] font-mono font-bold tracking-widest focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Staff Notes / Assignment</label>
                <input
                  type="text"
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="e.g. Warehouse & Dispatch Lead"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 pt-1">
                <input
                  type="checkbox"
                  checked={staffIsActive}
                  onChange={(e) => setStaffIsActive(e.target.checked)}
                  className="accent-[#C59B27] rounded"
                />
                <span>Account is Active (Can sign in to appointed dashboard)</span>
              </label>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-royal text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black font-royal text-xs font-black shadow-lg"
                >
                  {editingStaff ? 'Save Changes' : 'Appoint & Authorize Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE / EDIT ROLE */}
      {/* ========================================================= */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#141414] rounded-2xl border border-[#C59B27]/50 p-6 shadow-2xl space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E5C158]">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <h3 className="font-royal text-base font-bold text-white">
                  {editingRole ? 'Edit Role & Authorized Tabs' : 'Create New Appointed Role'}
                </h3>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Media & Promotion Manager"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Role Responsibilities Description</label>
                <textarea
                  rows={2}
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="e.g. Responsible for uploading advertisement video reels, managing flash coupons & review analytics"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Badge Color</label>
                <select
                  value={roleColor}
                  onChange={(e) => setRoleColor(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                >
                  <option value="emerald">Emerald (Operations &amp; Fulfillment)</option>
                  <option value="blue">Blue (Inventory &amp; Catalog)</option>
                  <option value="rose">Rose (Marketing &amp; Video Ads)</option>
                  <option value="purple">Purple (AI Bot &amp; Support)</option>
                  <option value="amber">Amber (Finance &amp; Executive)</option>
                  <option value="indigo">Indigo (Custom Specialist)</option>
                </select>
              </div>

              {/* Panel Tabs Checkboxes */}
              <div className="space-y-2">
                <label className="block text-xs font-royal text-[#E5C158] font-bold">
                  Select Authorized Panel Tabs for this Role:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-black/50 rounded-xl border border-white/10 max-h-56 overflow-y-auto">
                  {ALL_ADMIN_TABS.map((tab) => {
                    const isSelected = roleTabs.includes(tab.id);
                    return (
                      <label
                        key={tab.id}
                        className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#C59B27]/20 border-[#C59B27]/50 text-white font-bold'
                            : 'bg-transparent border-white/5 text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleTabInRole(tab.id)}
                          className="accent-[#C59B27]"
                        />
                        <span className="text-xs font-royal">{tab.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-royal text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black font-royal text-xs font-black shadow-lg"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: TRANSFER / SHARE PANEL TAB */}
      {/* ========================================================= */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#141414] rounded-2xl border border-purple-500/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                  <Share2 className="w-5 h-5" />
                </span>
                <h3 className="font-royal text-base font-bold text-white">
                  Transfer / Share Panel Tab to Appointed Dashboard
                </h3>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Select Panel Tab to Transfer *</label>
                <select
                  value={transferTabId}
                  onChange={(e) => setTransferTabId(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  {ALL_ADMIN_TABS.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label} ({tab.description})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">
                  Recipient Appointed Staff or Role *
                </label>
                <select
                  value={transferTargetId}
                  onChange={(e) => setTransferTargetId(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <optgroup label="Appointed Staff Members:">
                    {adminStaffUsers
                      .filter((u) => u.id !== 'staff-master-1')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          👤 {u.fullName} ({adminRoles.find((r) => r.id === u.roleId)?.name || 'Staff'})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Entire Appointed Role:">
                    {adminRoles
                      .filter((r) => !r.isSystemDefault)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          🛡️ Role: {r.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Authorization Privilege Level</label>
                <select
                  value={transferPermType}
                  onChange={(e) => setTransferPermType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="full_edit">Full Control &amp; Management (Read &amp; Write Changes)</option>
                  <option value="view_only">Read-Only Observation (View Data Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Delegation Note / Justification</label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  placeholder="e.g. Delegating video reels and advertisements for festive campaign launch"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-royal text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-royal text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Execute Tab Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
