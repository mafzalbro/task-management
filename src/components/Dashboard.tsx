import React from "react";
import type { Post, Stat } from "../types";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DashboardProps {
  tasks: Post[];
}

const chartData = [
  { name: "Mon", completed: 4, added: 6 },
  { name: "Tue", completed: 7, added: 5 },
  { name: "Wed", completed: 5, added: 8 },
  { name: "Thu", completed: 10, added: 7 },
  { name: "Fri", completed: 8, added: 4 },
  { name: "Sat", completed: 3, added: 2 },
  { name: "Sun", completed: 6, added: 3 },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const overdue = tasks.filter(
    (t) => t.status === "To Do" && new Date(t.dueDate) < new Date(),
  ).length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats: Stat[] = [
    { title: "Total Tasks", value: total, diff: "+12%", isPositive: true },
    { title: "Completed", value: completed, diff: "+8%", isPositive: true },
    { title: "In Progress", value: inProgress, diff: "-4%", isPositive: false },
    { title: "Overdue", value: overdue, diff: "+2", isPositive: false },
  ];

  const statIcons = [TrendingUp, CheckCircle2, Clock, AlertTriangle];
  const statColors = [
    "var(--primary)",
    "var(--success)",
    "var(--warning)",
    "var(--danger)",
  ];
  const statBgs = [
    "var(--primary-light)",
    "var(--success-bg)",
    "var(--warning-bg)",
    "var(--danger-bg)",
  ];

  const recentTasks = [...tasks]
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="main-content">
      {/* Welcome Banner */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}
        >
          Good morning, Alex 👋
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          You have{" "}
          <strong
            style={{
              color: inProgress > 0 ? "var(--warning)" : "var(--success)",
            }}
          >
            {inProgress} tasks in progress
          </strong>{" "}
          and {overdue} overdue. Let's make today count.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => {
          const Icon = statIcons[i];
          return (
            <div key={i} className="stat-card">
              <div
                className="flex justify-between items-center"
                style={{ marginBottom: "20px" }}
              >
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "var(--radius-md)",
                    background: statBgs[i],
                    color: statColors[i],
                  }}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: stat.isPositive ? "var(--success)" : "var(--danger)",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.diff}
                </span>
              </div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {stat.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "32px",
          marginBottom: "40px",
        }}
      >
        {/* Chart */}
        <div className="stat-card" style={{ padding: "32px" }}>
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "32px" }}
          >
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Task Velocity
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                Tasks completed vs added this week
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    display: "inline-block",
                  }}
                />{" "}
                Completed
              </span>
              <span className="flex items-center gap-2">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--warning)",
                    display: "inline-block",
                  }}
                />{" "}
                Added
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.12}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gradWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--warning)"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--warning)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-light)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 13,
                  fill: "var(--text-muted)",
                  fontWeight: 600,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  boxShadow: "var(--shadow-lg)",
                  fontSize: "13px",
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill="url(#gradPrimary)"
              />
              <Area
                type="monotone"
                dataKey="added"
                stroke="var(--warning)"
                strokeWidth={2}
                strokeDasharray="4 2"
                fill="url(#gradWarning)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Progress Panel */}
        <div className="stat-card flex-col gap-6" style={{ padding: "32px" }}>
          <div>
            <h3
              style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}
            >
              Overall Progress
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {progressPct}% of tasks completed
            </p>
          </div>

          {/* Radial-style Progress */}
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <svg
              viewBox="0 0 120 120"
              width={160}
              height={160}
              style={{ margin: "0 auto", display: "block" }}
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--bg-subtle)"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{
                  transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              <text
                x="60"
                y="58"
                textAnchor="middle"
                fill="var(--text-main)"
                fontSize="22"
                fontWeight="800"
                dominantBaseline="middle"
              >
                {progressPct}%
              </text>
              <text
                x="60"
                y="78"
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontWeight="600"
              >
                Completed
              </text>
            </svg>
          </div>

          {/* Status Breakdown */}
          <div className="flex-col gap-3">
            {(["To Do", "In Progress", "Review", "Completed"] as const).map(
              (s) => {
                const count = tasks.filter((t) => t.status === s).length;
                const pct = total > 0 ? (count / total) * 100 : 0;
                const colors: Record<string, string> = {
                  "To Do": "#CBD5E1",
                  "In Progress": "var(--warning)",
                  Review: "var(--primary)",
                  Completed: "var(--success)",
                };
                return (
                  <div key={s}>
                    <div
                      className="flex justify-between items-center"
                      style={{ fontSize: "13px", marginBottom: "4px" }}
                    >
                      <span
                        style={{ fontWeight: 600, color: "var(--text-muted)" }}
                      >
                        {s}
                      </span>
                      <span style={{ fontWeight: 700 }}>{count}</span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "var(--bg-subtle)",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: colors[s],
                          borderRadius: "10px",
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="stat-card" style={{ padding: "32px" }}>
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: "24px" }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Recent Tasks</h3>
          <button
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All →
          </button>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              {[
                "Task",
                "Project",
                "Assignee",
                "Due Date",
                "Priority",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-muted)",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTasks.map((task, i) => (
              <tr
                key={task.id}
                style={{
                  borderBottom:
                    i < recentTasks.length - 1
                      ? "1px solid var(--border-light)"
                      : "none",
                }}
              >
                <td
                  style={{
                    padding: "14px 0",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {task.title}
                </td>
                <td
                  style={{
                    padding: "14px 0",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                  }}
                >
                  {task.projectId}
                </td>
                <td style={{ padding: "14px 0" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "6px",
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                      }}
                    >
                      {task.assignee[0]}
                    </span>
                    {task.assignee}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 0",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                  }}
                >
                  {task.dueDate}
                </td>
                <td style={{ padding: "14px 0" }}>
                  <span
                    className={`badge badge-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: "14px 0" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: "20px",
                      background:
                        task.status === "Completed"
                          ? "var(--success-bg)"
                          : task.status === "In Progress"
                            ? "var(--warning-bg)"
                            : task.status === "Review"
                              ? "var(--primary-light)"
                              : "var(--bg-subtle)",
                      color:
                        task.status === "Completed"
                          ? "var(--success)"
                          : task.status === "In Progress"
                            ? "var(--warning)"
                            : task.status === "Review"
                              ? "var(--primary)"
                              : "var(--text-muted)",
                    }}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
