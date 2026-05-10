import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Zap, CheckCircle, Folder, Users, Settings as SettingsIcon, Plus, Calendar, PieChart, Target, Map } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_TASKS, GET_PROJECTS } from '../../shared/graphql';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (action: string, metadata?: any) => void;
}

interface PaletteItem {
    id: string;
    label: string;
    icon: any;
    shortcut?: string;
    category: 'Commands' | 'Tasks' | 'Projects' | 'Navigation';
    metadata?: any;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: tasksData } = useQuery(GET_TASKS);
  const { data: projectsData } = useQuery(GET_PROJECTS);

  const staticActions: PaletteItem[] = [
    { id: 'new-task', label: 'Create New Task', icon: Plus, shortcut: 'N', category: 'Commands' },
    { id: 'focus-mode', label: 'Enter Focus Mode', icon: Target, shortcut: 'F', category: 'Commands' },
    { id: 'dashboard', label: 'Overview', icon: Zap, shortcut: 'D', category: 'Navigation' },
    { id: 'tasks', label: 'Task Board', icon: CheckCircle, shortcut: 'T', category: 'Navigation' },
    { id: 'projects-view', label: 'Projects', icon: Folder, shortcut: 'P', category: 'Navigation' },
    { id: 'roadmap', label: 'Roadmap', icon: Map, shortcut: 'Shift+R', category: 'Navigation' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, shortcut: 'C', category: 'Navigation' },
    { id: 'team', label: 'Team', icon: Users, shortcut: 'M', category: 'Navigation' },
    { id: 'reports', label: 'Reports & Analytics', icon: PieChart, shortcut: 'R', category: 'Navigation' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, shortcut: ',', category: 'Navigation' },
  ];

  const dynamicTasks: PaletteItem[] = (tasksData?.tasks || []).map((t: any) => ({
      id: `task-${t.id}`,
      label: t.title,
      icon: CheckCircle,
      category: 'Tasks',
      metadata: t
  }));

  const dynamicProjects: PaletteItem[] = (projectsData?.projects || []).map((p: any) => ({
      id: `project-${p.id}`,
      label: p.name,
      icon: Folder,
      category: 'Projects',
      metadata: p
  }));

  const allItems = [...staticActions, ...dynamicProjects, ...dynamicTasks];

  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    if (!isOpen) {
        setQuery('');
        setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
      setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
            onSelect(selected.id, selected.metadata);
            onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '12vh', zIndex: 1000 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            width: '640px',
            borderRadius: '20px',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Search size={22} color="var(--primary)" strokeWidth={2.5} />
            <input
              autoFocus
              placeholder="Search tasks, projects, or commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-main)',
                background: 'transparent'
              }}
            />
            <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>
              ESC
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            style={{ maxHeight: '480px', overflowY: 'auto', padding: '12px' }}
          >
            {filteredItems.length > 0 ? (
              <div className="flex-col gap-1">
                {filteredItems.map((item, index) => (
                    <div key={`${item.category}-${item.id}`}>
                        {/* Category Header */}
                        {(index === 0 || filteredItems[index - 1].category !== item.category) && (
                            <div style={{
                                padding: '12px 12px 6px',
                                fontSize: '11px',
                                fontWeight: 800,
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {item.category}
                            </div>
                        )}
                        <div
                            onClick={() => {
                                onSelect(item.id, item.metadata);
                                onClose();
                            }}
                            className="flex items-center justify-between"
                            style={{
                                padding: '10px 14px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background: selectedIndex === index ? 'var(--primary)' : 'transparent',
                                color: selectedIndex === index ? 'white' : 'var(--text-main)',
                                transition: 'all 0.1s ease',
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div style={{
                                    color: selectedIndex === index ? 'white' : 'var(--primary)',
                                    opacity: selectedIndex === index ? 1 : 0.8
                                }}>
                                    <item.icon size={18} />
                                </div>
                                <div className="flex-col">
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
                                    {item.metadata?.description && (
                                        <span style={{
                                            fontSize: '12px',
                                            opacity: 0.7,
                                            color: selectedIndex === index ? 'white' : 'var(--text-muted)',
                                            fontWeight: 500
                                        }}>
                                            {item.metadata.description.slice(0, 50)}...
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {item.shortcut && (
                                    <div style={{
                                        background: selectedIndex === index ? 'rgba(255,255,255,0.2)' : 'var(--bg-subtle)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        color: selectedIndex === index ? 'white' : 'var(--text-muted)'
                                    }}>
                                        <Command size={10} style={{ marginRight: '3px' }} />
                                        {item.shortcut}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>Empty</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    No results found for "<span style={{ fontWeight: 700 }}>{query}</span>"
                </p>
              </div>
            )}
          </div>

          <div style={{ padding: '14px 24px', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div className="flex gap-6">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-light)', fontWeight: 800 }}>↑↓</div> Navigate
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-light)', fontWeight: 800 }}>↵</div> Select
                </div>
             </div>
             <div className="flex items-center gap-2" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                 <Zap size={14} /> Quick Actions
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
