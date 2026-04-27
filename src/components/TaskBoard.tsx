import React from "react";
import type { Post } from "../types";
import { Plus, Search } from "lucide-react";
import TaskCard from "./TaskCard";

interface TaskBoardProps {
  tasks: Post[];
  onAdd: () => void;
  onEdit: (task: Post) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Post["status"]) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onMove,
}) => {
  const columns: Post["status"][] = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ];

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
            Task Board
          </h2>
          <div
            className="flex items-center gap-4"
            style={{ marginTop: "4px" }}
          >
             <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>
              Manage your technical workflow with drag-and-drop precision.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Quick search..."
                    style={{
                        padding: '8px 12px 8px 36px',
                        fontSize: '13px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        background: 'white',
                        width: '200px'
                    }}
                />
            </div>
            <button className="btn-primary" onClick={onAdd}>
                <Plus size={18} /> New Task
            </button>
        </div>
      </div>

      <div className="board-container">
        {columns.map((status) => {
          const colTasks = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="board-column">
              <div className="column-header">
                <div className="flex items-center gap-2">
                  <span className="column-title">{status}</span>
                  <span className="column-count">{colTasks.length}</span>
                </div>
                <button className="icon-btn-ghost" onClick={onAdd}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="column-content">
                {colTasks.length === 0 ? (
                  <div className="empty-column-state">
                     <p>No tasks in this stage</p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
