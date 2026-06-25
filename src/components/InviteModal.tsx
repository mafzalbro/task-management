import React, { useState } from "react";
import { X, Mail, User } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (member: { email: string; name: string }) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite({ email, name });
    setEmail("");
    setName("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center" style={{ marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }}>Invite Team Member</h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
              Add a new collaborator to your enterprise workspace.
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                className="form-input"
                style={{ paddingLeft: '40px' }}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sarah Connor"
                />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                className="form-input"
                style={{ paddingLeft: '40px' }}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                />
            </div>
          </div>

          <div className="flex justify-end gap-3" style={{ paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Send Invitation</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
