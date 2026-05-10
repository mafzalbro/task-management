import React from "react";
import type { Post } from "../../shared/types";
import { Download, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ReportsViewProps {
  tasks: Post[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ tasks }) => {
  const statusData = [
    {
      name: "To Do",
      value: tasks.filter((t) => t.status === "To Do").length,
      color: "#94A3B8",
    },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
      color: "var(--warning)",
    },
    {
      name: "Review",
      value: tasks.filter((t) => t.status === "Review").length,
      color: "var(--primary)",
    },
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "Completed").length,
      color: "var(--success)",
    },
  ];

  const priorityData = [
    {
      name: "High",
      value: tasks.filter((t) => t.priority === "High").length,
      color: "var(--danger)",
    },
    {
      name: "Medium",
      value: tasks.filter((t) => t.priority === "Medium").length,
      color: "var(--warning)",
    },
    {
      name: "Low",
      value: tasks.filter((t) => t.priority === "Low").length,
      color: "var(--success)",
    },
  ];

  const completionRate =
    tasks.length > 0
      ? Math.round(
          (tasks.filter((t) => t.status === "Completed").length /
            tasks.length) *
            100,
        )
      : 0;

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
            Reports & Analytics
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "4px",
              fontWeight: 500,
            }}
          >
            Real-time insights driven by Nexus Core.
          </p>
        </div>
        <button className="btn-secondary" onClick={() => window.print()}>
          <Download size={16} /> Print Report
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: "32px" }}>
        {[
          {
            label: "Completion Rate",
            value: `${completionRate}%`,
            trend: "Live",
            good: true,
          },
          {
            label: "Total Tasks",
            value: tasks.length,
            trend: "Updated",
            good: true,
          },
          {
            label: "Active Projects",
            value: Array.from(new Set(tasks.map(t => t.projectId))).length,
            trend: "Global",
            good: true,
          },
          { label: "High Priority", value: priorityData[0].value, trend: "Urgent", good: false },
        ].map((k, i) => (
          <div key={i} className="stat-card" style={{ padding: "24px" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "12px",
              }}
            >
              {k.label}
            </p>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "4px",
              }}
            >
              {k.value}
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: k.good ? "var(--success)" : "var(--danger)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <TrendingUp size={13} /> {k.trend} status
            </p>
          </div>
        ))}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <div className="stat-card" style={{ padding: "32px" }}>
          <h3
            style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}
          >
            Tasks by Status
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              fontWeight: 500,
              marginBottom: "28px",
            }}
          >
            Live distribution across workflow stages
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData} margin={{ left: -20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-light)"
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
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card" style={{ padding: "32px" }}>
          <h3
            style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}
          >
            Priority Breakdown
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              fontWeight: 500,
              marginBottom: "28px",
            }}
          >
            Task distribution by urgency level
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`c-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: "13px", fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
