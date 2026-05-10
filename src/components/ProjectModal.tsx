import React, { useState, useEffect } from "react";
import type { Project } from "../types";
import { X } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  editProject?: Project | null;
}

const COLORS = [
  { name: "Indigo", value: "var(--primary)" },
  { name: "Emerald", value: "var(--success)" },
  { name: "Amber", value: "var(--warning)" },
  { name: "Rose", value: "var(--danger)" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Slate", value: "#64748B" },
];

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editProject,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Active");
  const [color, setColor] = useState(COLORS[0].value);

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setStatus(editProject.status);
      setColor(editProject.color);
    } else {
      setName("");
      setDescription("");
      setStatus("Planned");
      setColor(COLORS[0].value);
    }
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editProject?.id || Math.random().toString(36).substr(2, 9),
      name,
      description,
      status,
      color,
      members: editProject?.members || 1,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center" style={{ marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {editProject ? "Edit Project" : "Create New Project"}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
              Define your project goals and workspace.
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              className="form-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Q3 Product Launch"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Accent Color</label>
              <div className="flex gap-2" style={{ marginTop: "8px" }}>
                {COLORS.map((c) => (
                  <div
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c.value,
                      cursor: "pointer",
                      border: color === c.value ? "2px solid var(--text-main)" : "2px solid transparent",
                      boxShadow: color === c.value ? "0 0 0 2px #fff inset" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3" style={{ paddingTop: "20px", borderTop: "1px solid var(--border-light)" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              {editProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
