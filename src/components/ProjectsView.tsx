import React from "react";
import type { Post } from "../types";
import { FolderOpen, MoreHorizontal, Users, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROJECTS, CREATE_PROJECT } from "../graphql/operations";

interface ProjectsViewProps {
  tasks: Post[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "var(--success-bg)", text: "var(--success)" },
  "In Review": { bg: "var(--primary-light)", text: "var(--primary)" },
  Planned: { bg: "var(--warning-bg)", text: "var(--warning)" },
};

const ProjectsView: React.FC<ProjectsViewProps> = () => {
  const { data, loading, refetch } = useQuery(GET_PROJECTS);
  const [createProject] = useMutation(CREATE_PROJECT);

  const projects = data?.projects || [];

  const handleCreateProject = async () => {
    const name = prompt("Project Name:");
    const description = prompt("Description:");
    if (name) {
      await createProject({ variables: { name, description } });
      refetch();
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
        <button className="btn-primary" onClick={handleCreateProject}>
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
                <button className="icon-btn-ghost">
                  <MoreHorizontal size={20} />
                </button>
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
    </div>
  );
};

export default ProjectsView;
