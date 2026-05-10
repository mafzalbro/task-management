import React, { useState } from "react";
import type { Post } from "../types";
import { Plus, Search, LayoutGrid, List, Calendar as CalendarIcon, Filter, X, CheckCircle, Trash, Check } from "lucide-react";
import TaskCard from "./TaskCard";
import { motion, AnimatePresence } from "framer-motion";

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
  const [localSearch, setLocalSearch] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Post; direction: 'asc' | 'desc' } | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ priority: string; assignee: string; projectId: string }>({
    priority: 'all',
    assignee: 'all',
    projectId: 'all'
  });

  const columns: Post["status"][] = [
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("board-column-drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("board-column-drag-over");
  };

  const handleDrop = (e: React.DragEvent, status: Post["status"]) => {
    e.preventDefault();
    e.currentTarget.classList.remove("board-column-drag-over");
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onMove(taskId, status);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(localSearch.toLowerCase()) ||
                         t.description.toLowerCase().includes(localSearch.toLowerCase());
    const matchesPriority = filters.priority === 'all' || t.priority === filters.priority;
    const matchesAssignee = filters.assignee === 'all' || t.assignee === filters.assignee;
    const matchesProject = filters.projectId === 'all' || t.projectId === filters.projectId;

    return matchesSearch && matchesPriority && matchesAssignee && matchesProject;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Post) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee)));
  const uniqueProjects = Array.from(new Set(tasks.map(t => t.projectId)));

  const toggleSelect = (id: string) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    selectedTasks.forEach(id => onMove(id, 'Completed'));
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTasks.length} tasks?`)) {
      selectedTasks.forEach(id => onDelete(id));
      setSelectedTasks([]);
    }
  };

  return (
    <div className="main-content">
      <div className="filter-toolbar">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <Filter size={14} className="text-muted" />
               <span className="filter-label">Filters</span>
            </div>

            <select
              className="filter-select"
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
               <option value="all">All Priorities</option>
               <option value="High">High</option>
               <option value="Medium">Medium</option>
               <option value="Low">Low</option>
            </select>

            <select
              className="filter-select"
              value={filters.assignee}
              onChange={(e) => setFilters({...filters, assignee: e.target.value})}
            >
               <option value="all">All Assignees</option>
               {uniqueAssignees.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <select
              className="filter-select"
              value={filters.projectId}
              onChange={(e) => setFilters({...filters, projectId: e.target.value})}
            >
               <option value="all">All Projects</option>
               {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {(filters.priority !== 'all' || filters.assignee !== 'all' || filters.projectId !== 'all') && (
              <button
                className="flex items-center gap-1"
                style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 700, color: 'var(--danger)', cursor: 'pointer' }}
                onClick={() => setFilters({ priority: 'all', assignee: 'all', projectId: 'all' })}
              >
                <X size={14} /> Clear
              </button>
            )}
         </div>
      </div>

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
            Tasks
          </h2>
          <div className="flex items-center gap-4" style={{ marginTop: "4px" }}>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>
              {filteredTasks.length} tasks matching your criteria.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === "board" ? "active" : ""}`}
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} /> List
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Quick search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                padding: "10px 12px 10px 36px",
                fontSize: "14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                background: "white",
                width: "240px",
                outline: "none",
                fontWeight: 500,
              }}
            />
          </div>
          <button className="btn-primary" onClick={onAdd}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "board" ? (
          <motion.div
            key="board"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="board-grid"
          >
            {columns.map((status) => {
              const colTasks = filteredTasks.filter((t) => t.status === status);
              return (
                <div
                  key={status}
                  className="board-column"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
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
                        <p>No tasks here</p>
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
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="list-view-container"
          >
            <table className="list-view-table">
              <thead>
                <tr>
                  <th className="list-view-th" style={{ width: '40px' }}>
                     <div
                        className={`task-checkbox ${selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 ? 'selected' : ''}`}
                        onClick={() => setSelectedTasks(selectedTasks.length === filteredTasks.length ? [] : filteredTasks.map(t => t.id))}
                     >
                        {selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 && <Check size={12} color="white" />}
                     </div>
                  </th>
                  <th className="list-view-th" style={{ width: "40%", cursor: 'pointer' }} onClick={() => handleSort('title')}>
                    Task Name {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="list-view-th" style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                    Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="list-view-th" style={{ cursor: 'pointer' }} onClick={() => handleSort('priority')}>
                    Priority {sortConfig?.key === 'priority' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="list-view-th" style={{ cursor: 'pointer' }} onClick={() => handleSort('assignee')}>
                    Assignee {sortConfig?.key === 'assignee' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="list-view-th" style={{ cursor: 'pointer' }} onClick={() => handleSort('dueDate')}>
                    Due Date {sortConfig?.key === 'dueDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                      No tasks found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="list-view-tr" onClick={() => onEdit(task)}>
                      <td className="list-view-td" onClick={(e) => { e.stopPropagation(); toggleSelect(task.id); }}>
                         <div className={`task-checkbox ${selectedTasks.includes(task.id) ? 'selected' : ''}`}>
                            {selectedTasks.includes(task.id) && <Check size={12} color="white" />}
                         </div>
                      </td>
                      <td className="list-view-td">
                        <div style={{ fontWeight: 700 }}>{task.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {task.description.length > 60 ? task.description.slice(0, 60) + "..." : task.description}
                        </div>
                      </td>
                      <td className="list-view-td">
                        <span style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          background: "var(--bg-subtle)",
                          color: "var(--text-main)"
                        }}>
                          {task.status}
                        </span>
                      </td>
                      <td className="list-view-td">
                        <span className={`badge badge-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="list-view-td">
                        <div className="flex items-center gap-2">
                           <div style={{
                             width: 24, height: 24, borderRadius: "6px", background: "var(--primary-light)",
                             color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
                             fontSize: "10px", fontWeight: 800
                           }}>
                             {task.assignee[0]}
                           </div>
                           <span style={{ fontWeight: 600 }}>{task.assignee}</span>
                        </div>
                      </td>
                      <td className="list-view-td">
                        <div className="flex items-center gap-2" style={{ color: "var(--text-muted)", fontWeight: 500 }}>
                          <CalendarIcon size={14} />
                          {task.dueDate}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTasks.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="batch-action-bar"
          >
            <div className="batch-count">{selectedTasks.length} Selected</div>
            <button className="batch-btn" onClick={handleBulkComplete}>
              <CheckCircle size={16} /> Mark Completed
            </button>
            <button className="batch-btn danger" onClick={handleBulkDelete}>
              <Trash size={16} /> Delete
            </button>
            <button className="batch-btn" onClick={() => setSelectedTasks([])} style={{ marginLeft: '12px', opacity: 0.5 }}>
              <X size={16} /> Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskBoard;
