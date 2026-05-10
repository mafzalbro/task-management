import React, { useState } from "react";
import type { Post, TaskStatus } from "../types";
import TaskCard from "./TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";

interface TaskBoardProps {
  tasks: Post[];
  onEdit: (task: Post) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onMove: (id: string, status: Post["status"]) => void;
}

const COLUMNS: { status: TaskStatus; color: string }[] = [
  { status: "To Do", color: "#94A3B8" },
  { status: "In Progress", color: "var(--warning)" },
  { status: "Review", color: "var(--primary)" },
  { status: "Completed", color: "var(--success)" },
];

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onAdd,
  onMove,
}) => {
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setActiveColumn(status);
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onMove(taskId, status);
    }
    setActiveColumn(null);
  };

  return (
    <div className="main-content">
      {/* Header with quick stats */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "32px" }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            Kanban Board
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "4px",
              fontWeight: 500,
            }}
          >
            Drag and drop tasks to manage your project workflow.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex -space-x-2" style={{ marginRight: "16px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--bg-main)", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800 }}>U{i}</div>
            ))}
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--bg-main)", background: "var(--bg-subtle)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>+4</div>
          </div>
          <button className="btn-secondary">
            <MoreHorizontal size={18} />
          </button>
          <button className="btn-primary" onClick={onAdd}>
            <Plus size={18} strokeWidth={2.5} /> New Task
          </button>
        </div>
      </div>

      <div
        className="board-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          minWidth: "1000px",
          paddingBottom: "20px",
        }}
      >
        {COLUMNS.map(({ status, color }) => {
          const colTasks = tasks.filter((t) => t.status === status);
          const isActive = activeColumn === status;

          return (
            <div
              key={status}
              className={`board-column ${isActive ? "board-column-drag-over" : ""}`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
              style={{
                background: "var(--bg-subtle)",
                borderRadius: "16px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                minHeight: "calc(100vh - 240px)",
                border: "2px dashed transparent",
              }}
            >
              {/* Column Header */}
              <div
                className="flex items-center justify-between"
                style={{
                  padding: "4px 8px 12px",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  marginBottom: "4px",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                      boxShadow: `0 0 10px ${color}50`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "var(--text-main)",
                    }}
                  >
                    {status}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      background: "var(--bg-subtle)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>
                <button
                  className="icon-btn-ghost"
                  style={{ width: 28, height: 28 }}
                  onClick={onAdd}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Tasks Area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed var(--border-light)",
                      borderRadius: "12px",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                      fontWeight: 500,
                      padding: "40px 20px",
                      textAlign: "center",
                    }}
                  >
                    Drop tasks here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onMove={onMove}
                    />
                  ))
                )}
              </div>

              {/* Add Task Button at bottom */}
              {colTasks.length > 0 && (
                <button
                  onClick={onAdd}
                  className="icon-btn-ghost"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    padding: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    gap: "8px",
                  }}
                >
                  <Plus size={14} /> Add new task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
