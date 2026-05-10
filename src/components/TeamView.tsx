import React, { useState } from "react";
import { Mail, MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import type { TeamMember } from "../types";
import InviteModal from "./InviteModal";

interface TeamViewProps {
  members: TeamMember[];
  onUpdateMembers: (members: TeamMember[]) => void;
}

const STATUS_COLORS: Record<string, string> = {
  online: "var(--success)",
  away: "var(--warning)",
  busy: "var(--danger)",
  offline: "#CBD5E1",
};

const TeamView: React.FC<TeamViewProps> = ({ members, onUpdateMembers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = (member: TeamMember) => {
    onUpdateMembers([...members, member]);
  };

  const handleRemove = (id: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      onUpdateMembers(members.filter((m) => m.id !== id));
    }
  };

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
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: "40px" }}>
        {[
          {
            label: "Total Members",
            value: members.length,
            sub: "Active in Zenith Workspace",
          },
          {
            label: "Currently Online",
            value: members.filter((m) => m.status === "online").length,
            sub: `Out of ${members.length} members`,
          },
          {
            label: "Active Tasks",
            value: members.reduce((s, m) => s + m.tasks, 0),
            sub: "Across all members",
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

      {/* Member Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {members.map((m) => (
          <div
            key={m.id}
            className="stat-card"
            style={{
              padding: "24px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "var(--radius-md)",
                  background: m.color + "15",
                  color: m.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 800,
                }}
              >
                {m.initials}
              </div>
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: STATUS_COLORS[m.status],
                  border: "2px solid white",
                }}
              />
            </div>

            {/* Info */}
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 800,
                  fontSize: "16px",
                  color: "var(--text-main)",
                  marginBottom: "2px",
                }}
              >
                {m.name}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                {m.role}
              </p>
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: STATUS_COLORS[m.status],
                  }}
                >
                  ● {m.statusLabel}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {m.tasks} active tasks
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1" style={{ flexShrink: 0 }}>
              <button className="icon-btn-ghost" title="Email">
                <Mail size={16} />
              </button>
              <button
                className="icon-btn-ghost"
                title="Remove"
                onClick={() => handleRemove(m.id)}
              >
                <Trash2 size={16} className="text-danger" />
              </button>
            </div>
          </div>
        ))}
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
