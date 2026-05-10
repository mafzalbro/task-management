import React, { useState, useEffect } from "react";
import type { Post, TaskStatus, TaskPriority, Project, TeamMember } from "../types";
import { X, ListTodo, History, MessageSquare, Paperclip } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Post) => void;
  editTask?: Post | null;
  projects: Project[];
  members: TeamMember[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTask,
  projects,
  members,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("Alex");
  const [projectId, setProjectId] = useState("PJ1");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status);
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate);
      setAssignee(editTask.assignee);
      setProjectId(editTask.projectId);
    } else {
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setPriority("Medium");
      setDueDate(new Date().toISOString().split("T")[0]);
      setAssignee("Alex");
      setProjectId("PJ1");
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editTask?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assignee,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-subtle)",
    border: "1px solid transparent",
    fontSize: "15px",
    color: "var(--text-main)",
    width: "100%",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: "32px" }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text-main)",
              }}
            >
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginTop: "4px",
                fontWeight: 500,
              }}
            >
              {editTask
                ? "Update the task details below."
                : "Fill in the details to add a new task."}
            </p>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            style={{ flexShrink: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-6" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", alignItems: "start" }}>
          <div className="flex-col gap-6">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className="form-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Redesign the onboarding flow"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context and key requirements..."
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Row: Status + Priority */}
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Row: Due Date + Project */}
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Due Date</label>
              <input
                className="form-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Project</label>
              <select
                className="form-input"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label className="form-label">Assignee</label>
            <select
              className="form-input"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          </div>

          {/* Right Panel: Functional Extensions (UI Only) */}
          <div className="flex-col gap-6" style={{ borderLeft: "1px solid var(--border-light)", paddingLeft: "32px" }}>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
                <ListTodo size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Checklist</h3>
              </div>
              <div className="flex-col gap-2">
                {[1, 2].map(i => (
                   <div key={i} className="flex items-center gap-3" style={{ padding: "8px 12px", background: "var(--bg-subtle)", borderRadius: "8px", opacity: 0.7 }}>
                     <div style={{ width: 16, height: 16, borderRadius: "4px", border: "2px solid var(--text-muted)" }} />
                     <span style={{ fontSize: "13px", fontWeight: 500 }}>Sub-task item {i}...</span>
                   </div>
                ))}
                <button type="button" style={{ background: "none", border: "1px dashed var(--border-light)", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginTop: "4px" }}>
                  + Add item
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: "16px" }}>
                <History size={18} color="var(--primary)" />
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Activity</h3>
              </div>
              <div className="flex-col gap-4">
                <div className="flex gap-3">
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800 }}>AR</div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600 }}>Alex Rivera <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>created this task</span></p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
               <button type="button" className="icon-btn-ghost" style={{ flex: 1, border: "1px solid var(--border-light)", fontSize: "13px", fontWeight: 600 }}>
                 <MessageSquare size={14} /> Comment
               </button>
               <button type="button" className="icon-btn-ghost" style={{ flex: 1, border: "1px solid var(--border-light)", fontSize: "13px", fontWeight: 600 }}>
                 <Paperclip size={14} /> Attach
               </button>
            </div>

            <div
              className="flex justify-end gap-3"
              style={{
                paddingTop: "24px",
                borderTop: "1px solid var(--border-light)",
                marginTop: "12px",
              }}
            >
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
