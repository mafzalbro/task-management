import React, { useState, useEffect } from "react";
import type { Post, TaskStatus, TaskPriority, EnergyLevel } from "../../shared/types";
import { X } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS, GET_TEAM } from "../../shared/graphql";

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
  const [assigneeId, setAssigneeId] = useState("");
  const [projectId, setProjectId] = useState("");

  // Enterprise Enhancements
  const [estimate, setEstimate] = useState<number>(0);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>("Medium");
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status);
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate || "");
      setAssigneeId(editTask.assigneeId || "");
      setProjectId(editTask.projectId || "");
      setEstimate(editTask.estimate || 0);
      setEnergyLevel(editTask.energyLevel || "Medium");
      setTags(editTask.tags?.join(", ") || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setPriority("Medium");
      setDueDate(new Date().toISOString().split("T")[0]);
      setAssigneeId(team[0]?.id || "");
      setProjectId(projects[0]?.id || "");
      setEstimate(0);
      setEnergyLevel("Medium");
      setTags("");
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
      assigneeId,
      assignee: team.find((u: any) => u.id === assigneeId)?.name || 'Unassigned',
      estimate,
      energyLevel,
      tags: tags.split(",").map(t => t.trim()).filter(t => t !== "")
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '800px', maxWidth: '95%' }} onClick={(e) => e.stopPropagation()}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="flex-col gap-6">
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
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Technical specs..."
                    style={{ resize: "vertical" }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                        className="form-input"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="frontend, api, critical"
                    />
                </div>
              </div>

              <div className="flex-col gap-6">
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
                        <label className="form-label">Estimate (pts)</label>
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            value={estimate}
                            onChange={(e) => setEstimate(parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Project</label>
                        <select className="form-input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                            <option value="" disabled>Select Project</option>
                            {projects.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Energy Level</label>
                        <select className="form-input" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <select className="form-input" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                    <option value="" disabled>Select Assignee</option>
                    {team.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    </select>
                </div>
              </div>
          </div>

          <div className="flex justify-end gap-3" style={{ paddingTop: "24px", borderTop: "1px solid var(--border-light)" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>{editTask ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
