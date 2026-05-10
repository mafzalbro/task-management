import React, { useState } from "react";
import type { Post, Project } from "../types";
import { FolderOpen, MoreHorizontal, Users, CheckCircle2, Trash2 } from "lucide-react";
import ProjectModal from "./ProjectModal";

interface ProjectsViewProps {
  tasks: Post[];
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "var(--success-bg)", text: "var(--success)" },
  "In Review": { bg: "var(--primary-light)", text: "var(--primary)" },
  Planned: { bg: "var(--warning-bg)", text: "var(--warning)" },
};

const ProjectsView: React.FC<ProjectsViewProps> = ({ tasks, projects, onUpdateProjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleSave = (project: Project) => {
    if (editingProject) {
      onUpdateProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      onUpdateProjects([...projects, project]);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      onUpdateProjects(projects.filter(p => p.id !== id));
    }
  };

  const getProjectData = (id: string) => {
    const pTasks = tasks.filter((t) => t.projectId === id);
    const done = pTasks.filter((t) => t.status === "Completed").length;
    const pct =
      pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
    return { total: pTasks.length, done, pct };
  };

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
            Projects
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "4px",
              fontWeight: 500,
            }}
          >
            Track and manage your active project portfolio.
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingProject(null); setIsModalOpen(true); }}>
          <FolderOpen size={18} /> New Project
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "24px",
        }}
      >
        {projects.map((project) => {
          const { total, done, pct } = getProjectData(project.id);
          const sc = statusColors[project.status];

          return (
            <div
              key={project.id}
              className="stat-card"
              onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
              style={{
                padding: "32px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Top Row */}
              <div className="flex justify-between items-center">
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "var(--radius-md)",
                    background: project.color + "15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: project.color,
                  }}
                >
                  <FolderOpen size={24} />
                </div>
                <div className="flex gap-1">
                  <button className="icon-btn-ghost" onClick={(e) => handleDelete(project.id, e)}>
                    <Trash2 size={18} className="text-danger" />
                  </button>
                </div>
              </div>

              {/* Title + Status */}
              <div>
                <div
                  className="flex items-center gap-2"
                  style={{ marginBottom: "8px" }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: 800 }}>
                    {project.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      background: sc.bg,
                      color: sc.text,
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {project.description}
                </p>
              </div>

              {/* Progress */}
              <div>
                <div
                  className="flex justify-between items-center"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "var(--bg-subtle)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: project.color,
                      borderRadius: "10px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex justify-between items-center"
                style={{
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-light)",
                }}
              >
                <span
                  className="flex items-center gap-2"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  <Users size={15} /> {project.members} members
                </span>
                <span
                  className="flex items-center gap-2"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: "var(--success)" }} />
                  {done}/{total} tasks done
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editProject={editingProject}
      />
    </div>
  );
};

export default ProjectsView;
