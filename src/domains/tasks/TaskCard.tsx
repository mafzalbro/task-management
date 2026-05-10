import React from "react";
import type { Post } from "../../shared/types";
import {
  Clock,
  MoreHorizontal,
  Zap,
  Hash
} from "lucide-react";

interface TaskCardProps {
  task: Post;
  onEdit: (task: Post) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Post["status"]) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
    e.currentTarget.classList.add("task-card-dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("task-card-dragging");
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(task)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
            <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
            </span>
            {task.energyLevel && (
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Zap size={10} fill="currentColor" /> {task.energyLevel}
                </span>
            )}
        </div>
        <button className="icon-btn-ghost" style={{ padding: 0, width: 'auto', height: 'auto' }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px", lineHeight: 1.4, color: 'var(--text-main)' }}>
        {task.title}
      </h4>

      {task.description && (
        <p style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5
        }}>
          {task.description}
        </p>
      )}

      {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-4">
              {task.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      #{tag}
                  </span>
              ))}
          </div>
      )}

      <div className="flex justify-between items-center" style={{ paddingTop: '12px', borderTop: '1px solid var(--bg-subtle)' }}>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted" style={{ fontSize: "11px", fontWeight: 700 }}>
                <Clock size={12} />
                {task.dueDate ? task.dueDate.split('-').slice(1).join('/') : 'No date'}
            </div>
            {task.estimate && (
                <div className="flex items-center gap-1 text-muted" style={{ fontSize: "11px", fontWeight: 700 }}>
                    <Hash size={12} />
                    {task.estimate}
                </div>
            )}
        </div>

        <div className="flex items-center -space-x-2">
            <div style={{
                width: 24, height: 24, borderRadius: "6px", background: "var(--primary-light)",
                color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 800, border: '2px solid white', position: 'relative', zIndex: 1
            }}>
                {task.assignee[0]}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
