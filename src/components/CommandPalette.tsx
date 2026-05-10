import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, CheckCircle, Folder, Users, Settings, Plus, Calendar, ArrowRight } from "lucide-react";
import type { Post, Project, TeamMember } from "../types";

interface PaletteItem {
  id: string;
  label: string;
  icon: any;
  category: string;
  action?: () => void;
  task?: Post;
  project?: Project;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Post[];
  projects: Project[];
  members: TeamMember[];
  onNavigate: (tab: string) => void;
  onAddTask: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  members,
  onNavigate,
  onAddTask,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const navigationItems: PaletteItem[] = [
    { id: "dashboard", label: "Go to Dashboard", icon: Command, category: "Navigation" },
    { id: "tasks", label: "View Task Board", icon: CheckCircle, category: "Navigation" },
    { id: "projects", label: "View Projects", icon: Folder, category: "Navigation" },
    { id: "calendar", label: "View Calendar", icon: Calendar, category: "Navigation" },
    { id: "team", label: "Manage Team", icon: Users, category: "Navigation" },
    { id: "settings", label: "Open Settings", icon: Settings, category: "Navigation" },
  ];

  const actions: PaletteItem[] = [
    { id: "add-task", label: "Create New Task", icon: Plus, category: "Actions", action: onAddTask },
  ];

  const filteredTasks = query.length > 1
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const filteredProjects = query.length > 1
    ? projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2)
    : [];

  const allResults: PaletteItem[] = [
    ...navigationItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
    ...actions.filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
    ...filteredTasks.map(t => ({ id: `task-${t.id}`, label: t.title, icon: CheckCircle, category: "Tasks", task: t })),
    ...filteredProjects.map(p => ({ id: `project-${p.id}`, label: p.name, icon: Folder, category: "Projects", project: p })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (allResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allResults.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
    }
    if (e.key === "Enter") {
      const selected = allResults[selectedIndex];
      if (selected) handleSelect(selected);
    }
  };

  const handleSelect = (item: PaletteItem) => {
    if (item.action) {
      item.action();
    } else if (item.category === "Navigation") {
      onNavigate(item.id);
    } else if (item.category === "Tasks") {
      onNavigate("tasks");
    } else if (item.category === "Projects") {
      onNavigate("projects");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-overlay"
            style={{ zIndex: 1000 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="command-palette"
            style={{
              position: "fixed",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "640px",
              background: "var(--bg-card)",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "12px" }}>
              <Search size={20} color="var(--text-muted)" strokeWidth={2.5} />
              <input
                ref={inputRef}
                className="command-input"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "var(--text-main)",
                }}
              />
              <kbd style={{ fontSize: "12px", fontWeight: 700, padding: "4px 8px", background: "var(--bg-subtle)", borderRadius: "6px", color: "var(--text-muted)" }}>ESC</kbd>
            </div>

            <div style={{ maxHeight: "400px", overflowY: "auto", padding: "8px" }}>
              {allResults.length > 0 ? (
                <div className="flex-col">
                  {allResults.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    const showCategory = index === 0 || allResults[index - 1].category !== item.category;

                    return (
                      <React.Fragment key={item.id}>
                        {showCategory && (
                          <div style={{ padding: "12px 12px 6px", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {item.category}
                          </div>
                        )}
                        <div
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            background: isSelected ? "var(--primary-light)" : "transparent",
                            transition: "all 0.1s ease",
                          }}
                        >
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: isSelected ? "var(--bg-card)" : "var(--bg-subtle)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isSelected ? "var(--primary)" : "var(--text-muted)",
                            boxShadow: isSelected ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                          }}>
                            <item.icon size={18} />
                          </div>
                          <span style={{ flex: 1, fontSize: "15px", fontWeight: 600, color: isSelected ? "var(--primary)" : "var(--text-main)" }}>
                            {item.label}
                          </span>
                          {isSelected && <ArrowRight size={16} color="var(--primary)" />}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: "15px", fontWeight: 500 }}>No results found for "{query}"</p>
                </div>
              )}
            </div>

            <div style={{ padding: "12px 20px", background: "var(--bg-subtle)", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><kbd style={{ background: "var(--bg-card)", padding: "2px 4px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd style={{ background: "var(--bg-card)", padding: "2px 4px", borderRadius: "4px", border: "1px solid var(--border-light)" }}>Enter</kbd> Select</span>
              </div>
              <span>Zenith Pro v1.0</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
