import React, { useState } from "react";
import { Mail, Shield, User as UserIcon, Users, Star, ChevronRight, Settings } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TEAM, INVITE_USER, UPDATE_USER_ROLE, ASSIGN_MANAGER } from "../graphql/operations";
import InviteModal from "./InviteModal";
import { useToast } from "../contexts/ToastContext";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "var(--danger)",
  MANAGER: "var(--primary)",
  TEAM_LEAD: "var(--warning)",
  EMPLOYEE: "var(--success)",
};

const STATUS_COLORS: Record<string, string> = {
  online: "var(--success)",
  away: "var(--warning)",
  busy: "var(--danger)",
  offline: "#CBD5E1",
};

const TeamView: React.FC = () => {
  const { showToast } = useToast();
  const { data, loading, refetch } = useQuery(GET_TEAM);
  const [inviteUser] = useMutation(INVITE_USER);
  const [updateRole] = useMutation(UPDATE_USER_ROLE);
  const [assignManager] = useMutation(ASSIGN_MANAGER);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const users = data?.users || [];

  const handleInvite = async (member: { email: string; name: string; role: string }) => {
    try {
      await inviteUser({ variables: { email: member.email, name: member.name, role: member.role } });
      showToast(`${member.name} has been invited as ${member.role}!`, 'success');
      refetch();
    } catch (err: any) {
      showToast(`Failed to invite: ${err.message}`, 'error');
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateRole({ variables: { id: userId, role } });
      showToast("Role updated", "success");
      refetch();
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  const handleManagerChange = async (userId: string, managerId: string) => {
     try {
       await assignManager({ variables: { userId, managerId } });
       showToast("Reporting hierarchy updated", "success");
       refetch();
     } catch (e: any) {
       showToast(e.message, "error");
     }
  };

  if (loading) return <div className="main-content">Loading team...</div>;

  return (
    <div className="main-content">
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "32px" }}
      >
        <div>
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Team
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "4px",
              fontWeight: 500,
            }}
          >
            Collaborate with your project team members.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Invite Member</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: "40px" }}>
        {[
          {
            label: "Total Members",
            value: users.length,
            sub: "Synced from Auth0",
          },
          {
            label: "Active Projects",
            value: "Live",
            sub: "Enterprise Scale",
          },
        ].map((item, i) => (
          <div key={i} className="stat-card" style={{ padding: "24px" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "12px",
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "4px",
              }}
            >
              {item.value}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Grouped by Role for better UX */}
          {['ADMIN', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE'].map(role => {
            const roleUsers = users.filter((u: any) => u.role === role);
            if (roleUsers.length === 0) return null;

            return (
              <div key={role} style={{ marginBottom: '24px' }}>
                <h4 className="filter-label" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {role === 'ADMIN' && <Shield size={14} />}
                   {role === 'MANAGER' && <Users size={14} />}
                   {role === 'TEAM_LEAD' && <Star size={14} />}
                   {role === 'EMPLOYEE' && <UserIcon size={14} />}
                   {role} ({roleUsers.length})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                  {roleUsers.map((m: any) => (
                    <div
                      key={m.id}
                      className={`stat-card ${selectedUser?.id === m.id ? 'active' : ''}`}
                      onClick={() => setSelectedUser(m)}
                      style={{
                        padding: "24px",
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        cursor: 'pointer',
                        borderColor: selectedUser?.id === m.id ? 'var(--primary)' : 'var(--border-light)',
                        boxShadow: selectedUser?.id === m.id ? 'var(--shadow-glow)' : 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "var(--radius-md)",
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: 800,
                            overflow: "hidden"
                          }}
                        >
                          {m.avatarUrl ? <img src={m.avatarUrl} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : m.name[0]}
                        </div>
                        <span
                          style={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: STATUS_COLORS.online,
                            border: "2px solid white",
                          }}
                        />
                      </div>

                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-main)", marginBottom: "2px" }}>
                          {m.name}
                        </p>
                        <div className="flex items-center gap-2">
                           <span style={{
                             fontSize: '10px', fontWeight: 800, background: ROLE_COLORS[m.role] + '15',
                             color: ROLE_COLORS[m.role], padding: '2px 8px', borderRadius: '4px'
                           }}>
                              {m.role}
                           </span>
                           {m.manager && (
                             <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                               reports to {m.manager.name.split(' ')[0]}
                             </span>
                           )}
                        </div>
                      </div>

                      <ChevronRight size={18} className="text-muted" style={{ opacity: 0.5 }} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Detail & Management Side Panel */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
           {selectedUser ? (
             <div className="stat-card" style={{ padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                   <div style={{
                     width: 80, height: 80, borderRadius: '24px', background: 'var(--primary-light)',
                     color: 'var(--primary)', margin: '0 auto 16px', display: 'flex', alignItems: 'center',
                     justifyContent: 'center', fontSize: '32px', fontWeight: 800
                   }}>
                      {selectedUser.name[0]}
                   </div>
                   <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedUser.name}</h3>
                   <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{selectedUser.email}</p>
                </div>

                <div className="flex-col gap-6" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                   <div className="form-group">
                      <label className="filter-label">Change Role</label>
                      <select
                        className="filter-select"
                        value={selectedUser.role}
                        onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                        style={{ width: '100%' }}
                      >
                         <option value="ADMIN">Admin</option>
                         <option value="MANAGER">Manager</option>
                         <option value="TEAM_LEAD">Team Lead</option>
                         <option value="EMPLOYEE">Employee</option>
                      </select>
                   </div>

                   <div className="form-group">
                      <label className="filter-label">Assign Manager (Reporting)</label>
                      <select
                        className="filter-select"
                        value={selectedUser.managerId || ""}
                        onChange={(e) => handleManagerChange(selectedUser.id, e.target.value)}
                        style={{ width: '100%' }}
                      >
                         <option value="">No Manager</option>
                         {users.filter((u: any) => u.id !== selectedUser.id && (u.role === 'ADMIN' || u.role === 'MANAGER')).map((u: any) => (
                           <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                         ))}
                      </select>
                   </div>

                   {selectedUser.reports?.length > 0 && (
                     <div style={{ marginTop: '12px' }}>
                        <label className="filter-label">Direct Reports</label>
                        <div className="flex-col gap-2" style={{ marginTop: '8px' }}>
                           {selectedUser.reports.map((r: any) => (
                             <div key={r.id} className="flex items-center gap-2" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                                {r.name}
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   <div className="flex gap-2" style={{ marginTop: '12px' }}>
                      <button className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                         <Mail size={16} /> Email
                      </button>
                      <button className="icon-btn" title="Full Settings">
                         <Settings size={18} />
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="stat-card" style={{ padding: '48px 32px', textAlign: 'center', opacity: 0.6 }}>
                <Users size={48} style={{ margin: '0 auto 20px', color: 'var(--text-muted)' }} />
                <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Manage Hierarchy</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                   Select a team member to manage their role and reporting relationships.
                </p>
             </div>
           )}
        </div>
      </div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default TeamView;
