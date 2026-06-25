import React, { useEffect } from "react";
import type { Post, Stat } from "../../shared/types";
import {
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
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
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@apollo/client";
import { SYNC_USER, GET_TEAM } from "../../shared/graphql";

interface DashboardProps {
  tasks: Post[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const { user, isAuthenticated } = useAuth0();
  const [syncUser] = useMutation(SYNC_USER);
  const { data: teamData } = useQuery(GET_TEAM);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncUser({
        variables: {
          email: user.email,
          name: user.name || user.nickname,
          avatarUrl: user.picture
        }
      }).catch(console.error);
    }
  }, [isAuthenticated, user, syncUser]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const overdue = tasks.filter(
    (t) => t.status === "To Do" && t.dueDate && new Date(t.dueDate) < new Date(),
  ).length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats: Stat[] = [
    { title: "Total Tasks", value: total, diff: "Live", isPositive: true },
    { title: "Completed", value: completed, diff: `${progressPct}%`, isPositive: true },
    { title: "In Progress", value: inProgress, diff: "Active", isPositive: true },
    { title: "Overdue", value: overdue, diff: "Attention", isPositive: false },
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

  // Generate dynamic chart data based on tasks
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = days.map(day => ({
    name: day,
    completed: tasks.filter(t => t.status === "Completed" && t.dueDate && days[new Date(t.dueDate).getDay()] === day).length,
    added: tasks.filter(t => t.dueDate && days[new Date(t.dueDate).getDay()] === day).length
  }));

  return (
    <div className="main-content">
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}
        >
          Good morning, {user?.name || "Alex"} 👋
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "32px",
          marginBottom: "40px",
        }}
      >
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
                Tasks distribution across the week
              </p>
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
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
      <div className="stat-card" style={{ padding: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>Recent Tasks</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              {["Task", "Assignee", "Due Date", "Priority", "Status"].map((h) => (
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
                <td style={{ padding: "14px 0", fontWeight: 600, fontSize: "14px" }}>{task.title}</td>
                <td style={{ padding: "14px 0" }}>{task.assignee}</td>
                <td style={{ padding: "14px 0", fontSize: "14px", color: "var(--text-muted)" }}>{task.dueDate}</td>
                <td style={{ padding: "14px 0" }}>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>
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
                      background: task.status === "Completed" ? "var(--success-bg)" : "var(--bg-subtle)",
                      color: task.status === "Completed" ? "var(--success)" : "var(--text-muted)",
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

      <div className="stat-card" style={{ padding: '32px' }}>
         <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Team Overview</h3>
         <div className="flex-col gap-4">
            {teamData?.users?.slice(0, 5).map((member: any) => {
               const memberTasks = tasks.filter(t => t.assigneeId === member.id);
               const done = memberTasks.filter(t => t.status === 'Completed').length;
               const total = memberTasks.length;
               const pct = total > 0 ? Math.round((done / total) * 100) : 0;

               return (
                 <div key={member.id} className="flex items-center gap-4">
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>
                       {member.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                       <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{member.name}</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{pct}%</span>
                       </div>
                       <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: '10px' }} />
                       </div>
                    </div>
                 </div>
               );
            })}
            <button className="btn-secondary" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
               View Full Team <ChevronRight size={16} />
            </button>
         </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
