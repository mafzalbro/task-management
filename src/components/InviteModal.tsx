import React, { useState } from "react";
import type { TeamMember } from "../types";
import { X, Mail } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (member: TeamMember) => void;
}

const ROLES = [
  "Product Designer",
  "Full-stack Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "QA Engineer",
  "Digital Marketer",
  "Project Manager",
];

const COLORS = ["var(--primary)", "var(--success)", "var(--warning)", "var(--danger)", "#06B6D4", "#EC4899"];

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    onInvite({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      status: "offline",
      statusLabel: "Invited",
      tasks: 0,
      initials,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    setName("");
    setEmail("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center" style={{ marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Invite Team Member
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
              Expand your workspace by adding new collaborators.
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jane Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                style={{ paddingLeft: "44px" }}
              />
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)"
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Workspace Role</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3" style={{ paddingTop: "20px", borderTop: "1px solid var(--border-light)" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Send Invitation</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
