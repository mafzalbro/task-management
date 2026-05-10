import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, CheckCircle2, ChevronRight, Plus, Hash, Zap } from 'lucide-react';
import type { Post } from '../../shared/types';
import TaskActivityFeed from './TaskActivityFeed';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  task: Post | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Post["status"]) => void;
  onSave?: (task: Post) => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  isOpen,
  task,
  onClose,
  onDelete,
  onStatusChange,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'activity'>('details');

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.3)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '600px',
              maxWidth: '95%',
              background: 'white',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--border-light)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-3">
                 <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                 <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{task.id}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="icon-btn-ghost"
                  onClick={() => {
                    if (window.confirm('Delete this task?')) {
                        onDelete(task.id);
                        onClose();
                    }
                  }}
                  style={{ color: 'var(--danger)' }}
                >
                  <Trash2 size={18} />
                </button>
                <button className="icon-btn-ghost" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-6" style={{ padding: '0 32px', borderBottom: '1px solid var(--border-light)' }}>
                {['details', 'subtasks', 'activity'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        style={{
                            padding: '16px 4px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              {activeTab === 'details' && (
                <>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {task.title}
                  </h2>

                  <div className="flex-col gap-6" style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="flex-col gap-1">
                            <span className="filter-label" style={{ fontSize: '11px' }}>Status</span>
                            <select
                                className="filter-select"
                                value={task.status}
                                onChange={(e) => onStatusChange(task.id, e.target.value as any)}
                                style={{ padding: '8px 12px', width: '100%' }}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                                <option value="Backlog">Backlog</option>
                            </select>
                        </div>
                        <div className="flex-col gap-1">
                            <span className="filter-label" style={{ fontSize: '11px' }}>Assignee</span>
                            <div className="flex items-center gap-2" style={{ padding: '8px 0' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                                    {task.assignee[0]}
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{task.assignee}</span>
                            </div>
                        </div>
                        <div className="flex-col gap-1">
                            <span className="filter-label" style={{ fontSize: '11px' }}>Due Date</span>
                            <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '8px 0' }}>
                                <Calendar size={16} className="text-muted" />
                                {task.dueDate}
                            </div>
                        </div>
                        <div className="flex-col gap-1">
                            <span className="filter-label" style={{ fontSize: '11px' }}>Estimate</span>
                            <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '8px 0' }}>
                                <Hash size={16} className="text-muted" />
                                {task.estimate || 0} pts
                            </div>
                        </div>
                        <div className="flex-col gap-1">
                            <span className="filter-label" style={{ fontSize: '11px' }}>Energy Level</span>
                            <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '8px 0' }}>
                                <Zap size={16} className="text-muted" />
                                {task.energyLevel || 'Medium'}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                      <span className="filter-label" style={{ display: 'block', marginBottom: '12px' }}>Description</span>
                      <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.6, background: 'var(--bg-subtle)', padding: '20px', borderRadius: '12px', minHeight: '100px' }}>
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <span className="filter-label" style={{ display: 'block', marginBottom: '12px' }}>Tags</span>
                            <div className="flex gap-2 flex-wrap">
                                {task.tags.map(tag => (
                                    <span key={tag} style={{ padding: '4px 10px', background: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'subtasks' && (
                  <div>
                      <div className="flex justify-between items-center mb-6">
                          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Subtasks</h3>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                              <Plus size={14} /> Add Subtask
                          </button>
                      </div>
                      <div className="flex-col gap-3">
                          {task.subtasks && task.subtasks.length > 0 ? (
                              task.subtasks.map(sub => (
                                  <div key={sub.id} className="flex items-center justify-between p-4 bg-subtle rounded-lg border border-light hover-border-primary transition-all cursor-pointer">
                                      <div className="flex items-center gap-3">
                                          <div style={{ width: 18, height: 18, borderRadius: '4px', border: '2px solid var(--border-light)' }} />
                                          <span style={{ fontSize: '14px', fontWeight: 600 }}>{sub.title}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className="badge" style={{ background: 'var(--bg-card)', fontSize: '10px' }}>{sub.status}</span>
                                          <ChevronRight size={14} className="text-muted" />
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-subtle)', borderRadius: '12px', border: '1px dashed var(--border-light)' }}>
                                  <p className="text-muted" style={{ fontSize: '14px' }}>No subtasks yet.</p>
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {activeTab === 'activity' && (
                <div style={{ paddingTop: '8px' }}>
                   <TaskActivityFeed taskId={task.id} />
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-subtle)', display: 'flex', gap: '12px' }}>
               <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => onSave?.(task)}
               >
                  Edit Task
               </button>
               <button
                className="btn-primary"
                style={{ flex: 2, justifyContent: 'center' }}
                onClick={() => onStatusChange(task.id, 'Completed')}
                disabled={task.status === 'Completed'}
               >
                  <CheckCircle2 size={18} /> {task.status === 'Completed' ? 'Task Completed' : 'Mark as Complete'}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailDrawer;
