import React from "react";
import { Mail, Github, MoreHorizontal } from "lucide-react";

const MEMBERS = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Product Designer",
    status: "online",
    statusLabel: "Online",
    tasks: 12,
    initials: "AR",
    color: "var(--primary)",
  },
  {
    id: 2,
    name: "Samantha Smith",
    role: "Full-stack Engineer",
    status: "away",
    statusLabel: "Away",
    tasks: 8,
    initials: "SS",
    color: "var(--success)",
  },
  {
    id: 3,
    name: "Jamie Chen",
    role: "Digital Marketer",
    status: "busy",
    statusLabel: "Busy",
    tasks: 5,
    initials: "JC",
    color: "var(--warning)",
  },
  {
    id: 4,
    name: "Taylor Wilson",
    role: "QA Engineer",
    status: "offline",
    statusLabel: "Offline",
    tasks: 4,
    initials: "TW",
    color: "#94A3B8",
  },
  {
    id: 5,
    name: "Jordan Lee",
    role: "Backend Engineer",
    status: "online",
    statusLabel: "Online",
    tasks: 9,
    initials: "JL",
    color: "var(--danger)",
  },
];

const STATUS_COLORS: Record<string, string> = {
  online: "var(--success)",
  away: "var(--warning)",
  busy: "var(--danger)",
  offline: "#CBD5E1",
};

const TeamView: React.FC = () => {
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
        <button className="btn-primary">+ Invite Member</button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: "40px" }}>
        {[
          {
            label: "Total Members",
            value: MEMBERS.length,
            sub: "2 joined this month",
          },
          {
            label: "Currently Online",
            value: MEMBERS.filter((m) => m.status === "online").length,
            sub: "Out of 5 members",
          },
          {
            label: "Active Tasks",
            value: MEMBERS.reduce((s, m) => s + m.tasks, 0),
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
        {MEMBERS.map((m) => (
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
              <button className="icon-btn-ghost" title="More">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
