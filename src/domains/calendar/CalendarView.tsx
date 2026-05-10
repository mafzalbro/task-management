import React, { useState } from "react";
import type { Post } from "../../shared/types";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, List } from "lucide-react";

interface CalendarViewProps {
  tasks: Post[];
  onAddTask: () => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onAddTask }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1,
  );

  const prev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  const isToday = (d: number) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getTasksForDay = (d: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const priorityColor = (p: string) =>
    p === "High"
      ? "var(--danger)"
      : p === "Medium"
        ? "var(--warning)"
        : "var(--primary)";

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
            Calendar
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "4px",
              fontWeight: 500,
            }}
          >
            Manage your timeline and schedule.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === "month" ? "active" : ""}`}
              onClick={() => setViewMode("month")}
            >
              <CalendarIcon size={16} /> Month
            </button>
            <button
              className={`view-toggle-btn ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >
              <List size={16} /> Week
            </button>
          </div>

          <div className="flex gap-2">
            <button
              className="btn-secondary"
              style={{ padding: "10px 14px" }}
              onClick={prev}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="btn-secondary"
              style={{ padding: "10px 14px" }}
              onClick={next}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="btn-primary" onClick={onAddTask}>
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <div className="stat-card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Month Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-light)",
            fontWeight: 800,
            fontSize: "18px",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{MONTHS[month]} {year}</span>
          <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{tasks.length} Deadlines</span>
          </div>
        </div>

        {/* Day Labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            background: "var(--bg-subtle)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          {DAYS.map((d) => (
            <div
              key={d}
              style={{
                padding: "12px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {cells.map((day, i) => (
            <div
              key={i}
              style={{
                minHeight: "140px",
                padding: "12px",
                borderRight:
                  i % 7 < 6 ? "1px solid var(--border-light)" : "none",
                borderBottom: "1px solid var(--border-light)",
                background:
                  day && isToday(day) ? "var(--primary-light)" : "transparent",
                transition: "background 0.15s ease",
                cursor: day ? "pointer" : "default",
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (day && !isToday(day))
                  (e.currentTarget as HTMLDivElement).style.background =
                    "var(--bg-subtle)";
              }}
              onMouseLeave={(e) => {
                if (day && !isToday(day))
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
              }}
            >
              {day && (
                <>
                  <div className="flex justify-between items-center mb-3">
                      <span
                        style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        fontSize: "13px",
                        fontWeight: 700,
                        background: isToday(day)
                            ? "var(--primary)"
                            : "transparent",
                        color: isToday(day) ? "white" : "var(--text-main)",
                        }}
                    >
                        {day}
                    </span>
                    {getTasksForDay(day).length > 0 && (
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>
                            {getTasksForDay(day).length} TASKS
                        </div>
                    )}
                  </div>
                  <div className="flex-col gap-1">
                    {getTasksForDay(day).map((t) => (
                      <div
                        key={t.id}
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 8px",
                          borderRadius: "6px",
                          background: priorityColor(t.priority) + "15",
                          color: priorityColor(t.priority),
                          borderLeft: `3px solid ${priorityColor(t.priority)}`,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Scheduling Sidebar / Time blocking placeholder */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div className="stat-card">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Upcoming Deadlines</h3>
              <div className="flex-col gap-3">
                  {tasks.filter(t => t.dueDate).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5).map(t => (
                      <div key={t.id} className="flex justify-between items-center p-3 bg-subtle rounded-lg border border-light">
                          <span style={{ fontSize: '14px', fontWeight: 600 }}>{t.title}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{t.dueDate}</span>
                      </div>
                  ))}
              </div>
          </div>
          <div className="stat-card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Calendar Sync</h3>
              <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '24px' }}>
                  Connect your Google or Outlook calendar to see all your meetings and tasks in one place.
              </p>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                  Enable Sync
              </button>
          </div>
      </div>
    </div>
  );
};

export default CalendarView;
