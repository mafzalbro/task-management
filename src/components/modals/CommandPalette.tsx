import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Zap, CheckCircle, Folder, Users, Settings as SettingsIcon, Plus } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (action: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');

  const actions = [
    { id: 'new-task', label: 'Create New Task', icon: Plus, shortcut: 'N' },
    { id: 'dashboard', label: 'Go to Dashboard', icon: Zap, shortcut: 'D' },
    { id: 'tasks', label: 'View My Tasks', icon: CheckCircle, shortcut: 'T' },
    { id: 'projects', label: 'Browse Projects', icon: Folder, shortcut: 'P' },
    { id: 'team', label: 'Manage Team', icon: Users, shortcut: 'M' },
    { id: 'settings', label: 'Open Settings', icon: SettingsIcon, shortcut: ',' },
  ];

  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '15vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            width: '600px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input
              autoFocus
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            />
            <div style={{ background: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>
              ESC
            </div>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
            {filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => {
                    onSelect(action.id);
                    onClose();
                  }}
                  className="flex items-center justify-between"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ color: 'var(--primary)' }}>
                      <action.icon size={18} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{action.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>
                      <Command size={10} style={{ marginRight: '2px' }} />
                      {action.shortcut}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No commands found matching "{query}"
              </div>
            )}
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '16px' }}>
             <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span style={{ fontWeight: 800 }}>↑↓</span> to navigate
             </div>
             <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <span style={{ fontWeight: 800 }}>ENTER</span> to select
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
