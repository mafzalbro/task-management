import React, { useState } from "react";
import { Mail, MoreHorizontal } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_TEAM } from "../graphql/operations";
import InviteModal from "./InviteModal";

const STATUS_COLORS: Record<string, string> = {
  online: "var(--success)",
  away: "var(--warning)",
  busy: "var(--danger)",
  offline: "#CBD5E1",
};

const TeamView: React.FC = () => {
  const { data, loading } = useQuery(GET_TEAM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const users = data?.users || [];

  const handleInvite = (member: { email: string; name: string }) => {
    console.log("Inviting member:", member);
    // In a real app, call a mutation here
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {users.map((m: any) => (
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
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
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
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: STATUS_COLORS.online,
                  border: "2px solid white",
                }}
              />
            </div>

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
                {m.email}
              </p>
            </div>

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

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default TeamView;
