import React, { useState } from "react";
import {
  Calendar,
  MoreVertical,
  Trash2,
  Edit3,
  ArrowRightLeft,
} from "lucide-react";
import type { Post } from "../types";

interface TaskCardProps {
  task: Post;
  onEdit: (task: Post) => void;
  onDelete: (id: string) => void;
  onMove?: (id: string, status: Post["status"]) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMove,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const statusOptions: Post["status"][] = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.effectAllowed = "move";
    // Small delay to allow the "ghost" image to be created before we change opacity
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`task-card ${isDragging ? "task-card-dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ position: "relative" }}
    >
      <div
        className="flex justify-between items-start"
        style={{ marginBottom: "12px" }}
      >
        <span className={`badge badge-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <div style={{ position: "relative" }}>
          <button
            className="icon-btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            style={{ height: "30px", width: "30px" }}
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                width: "160px",
                background: "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 10,
                padding: "6px",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-subtle)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Edit3 size={14} /> Edit
              </div>
              <div
                onClick={() => {
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2"
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--danger)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--danger-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Trash2 size={14} /> Delete
              </div>

              {onMove && (
                <>
                  <div
                    style={{
                      padding: "8px 10px",
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginTop: "4px",
                    }}
                  >
                    Move to
                  </div>
                  {statusOptions
                    .filter((s) => s !== task.status)
                    .map((status) => (
                      <div
                        key={status}
                        onClick={() => {
                          onMove(task.id, status);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2"
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--primary)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--primary-light)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <ArrowRightLeft size={14} /> {status}
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <h4
        style={{
          fontSize: "15px",
          fontWeight: 700,
          marginBottom: "8px",
          color: "var(--text-main)",
          lineHeight: 1.4,
        }}
      >
        {task.title}
      </h4>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-muted)",
          marginBottom: "16px",
          lineHeight: 1.5,
        }}
      >
        {task.description}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "6px",
              background: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            {task.assignee[0]}
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            {task.assignee}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--text-muted)",
          }}
        >
          <Calendar size={13} />
          <span style={{ fontSize: "12px", fontWeight: 600 }}>
            {task.dueDate.split("-").slice(1).reverse().join("/")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
