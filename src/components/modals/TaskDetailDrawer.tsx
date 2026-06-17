import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import type { Post } from '../../types';
import TaskActivityFeed from '../TaskActivityFeed';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  task: Post | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Post["status"]) => void;
}

const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  isOpen,
  task,
  onClose,
  onDelete,
  onStatusChange
}) => {
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
              width: '500px',
              maxWidth: '90%',
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

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)', lineHeight: 1.3 }}>
                {task.title}
              </h2>

              <div className="flex-col gap-6" style={{ marginBottom: '40px' }}>
                <div className="flex items-center" style={{ gap: '40px' }}>
                   <div className="flex-col gap-1">
                      <span className="filter-label" style={{ fontSize: '11px' }}>Status</span>
                      <select
                        className="filter-select"
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value as any)}
                        style={{ padding: '4px 8px' }}
                      >
                         <option value="To Do">To Do</option>
                         <option value="In Progress">In Progress</option>
                         <option value="Review">Review</option>
                         <option value="Completed">Completed</option>
                      </select>
                   </div>
                   <div className="flex-col gap-1">
                      <span className="filter-label" style={{ fontSize: '11px' }}>Assignee</span>
                      <div className="flex items-center gap-2">
                         <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                            {task.assignee[0]}
                         </div>
                         <span style={{ fontSize: '14px', fontWeight: 600 }}>{task.assignee}</span>
                      </div>
                   </div>
                   <div className="flex-col gap-1">
                      <span className="filter-label" style={{ fontSize: '11px' }}>Due Date</span>
                      <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                         <Calendar size={16} />
                         {task.dueDate}
                      </div>
                   </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <span className="filter-label" style={{ display: 'block', marginBottom: '12px' }}>Description</span>
                  <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.6, background: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px' }}>
                    {task.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Activity Feed Integration */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px' }}>
                 <TaskActivityFeed taskId={task.id} />
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
               <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
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
