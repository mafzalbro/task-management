import React, { useState } from "react";
import type { Post } from "../../shared/types";
import { FolderOpen, MoreHorizontal, Users, CheckCircle2, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROJECTS, CREATE_PROJECT, DELETE_PROJECT } from "../../shared/graphql";
import ProjectModal from "./ProjectModal";
import { useToast } from "../../shared/providers";

interface ProjectsViewProps {
  tasks: Post[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "var(--success-bg)", text: "var(--success)" },
  "In Review": { bg: "var(--primary-light)", text: "var(--primary)" },
  Planned: { bg: "var(--warning-bg)", text: "var(--warning)" },
};

const ProjectsView: React.FC<ProjectsViewProps> = () => {
  const { showToast } = useToast();
  const { data, loading, refetch } = useQuery(GET_PROJECTS);
  const [createProject] = useMutation(CREATE_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const projects = data?.projects || [];

  const handleSaveProject = async (project: { name: string; description: string }) => {
    await createProject({ variables: { name: project.name, description: project.description } });
    refetch();
    showToast('Project created successfully', 'success');
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will remain but the project link will be lost.')) {
      await deleteProject({ variables: { id } });
      refetch();
      showToast('Project deleted successfully', 'success');
    }
  };

  if (loading) return <div className="main-content">Loading projects...</div>;

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
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
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
        {projects.map((project: any) => {
          const pTasks = project.tasks || [];
          const done = pTasks.filter((t: any) => t.status === "COMPLETED").length;
          const total = pTasks.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const status = total > 0 ? (pct === 100 ? "Completed" : "Active") : "Planned";
          const color = "var(--primary)";
          const sc = statusColors[status === "Completed" ? "Active" : status] || statusColors.Planned;

          return (
            <div
              key={project.id}
              className="stat-card"
              style={{
                padding: "32px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div className="flex justify-between items-center">
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "var(--radius-md)",
                    background: color + "15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: color,
                  }}
                >
                  <FolderOpen size={24} />
                </div>
                <div style={{ position: 'relative' }}>
                  <button
                    className="icon-btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === project.id ? null : project.id);
                    }}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {activeMenu === project.id && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        background: 'white',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 10,
                        width: '160px',
                        marginTop: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <button
                        className="flex items-center gap-2"
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#EF4444',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                          setActiveMenu(null);
                        }}
                      >
                        <Trash2 size={16} /> Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                    {status}
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
                      background: color,
                      borderRadius: "10px",
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>

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
                  <Users size={15} /> {project.members?.length || 0} members
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
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default ProjectsView;
