import React, { useState, useEffect } from "react";
import type { Post, TaskStatus, TaskPriority } from "../types";
import { X } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS, GET_TEAM } from "../graphql/operations";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Post) => void;
  editTask?: Post | null;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editTask,
}) => {
  const { data: projectsData } = useQuery(GET_PROJECTS);
  const { data: teamData } = useQuery(GET_TEAM);

  const projects = projectsData?.projects || [];
  const team = teamData?.users || [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [projectId, setProjectId] = useState("");

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
      setAssignee(team[0]?.name || "");
      setProjectId(projects[0]?.id || "");
    }
  }, [editTask, isOpen, projects, team]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editTask?.id || "",
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center" style={{ marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
              Enterprise workflow integration.
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              className="form-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Implement OAuth2 flow"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specs..."
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Priority</label>
              <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Project</label>
              <select className="form-input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="" disabled>Select Project</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assignee</label>
            <select className="form-input" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
               <option value="" disabled>Select Assignee</option>
               {team.map((m: any) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
               ))}
            </select>
          </div>

          <div className="flex justify-end gap-3" style={{ paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{editTask ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
