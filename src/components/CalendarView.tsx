import React, { useState } from "react";
import type { Post } from "../types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

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
            All your deadlines in a single view.
          </p>
        </div>
        <div className="flex gap-3">
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
          }}
        >
          {MONTHS[month]} {year}
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
                minHeight: "120px",
                padding: "12px",
                borderRight:
                  i % 7 < 6 ? "1px solid var(--border-light)" : "none",
                borderBottom: "1px solid var(--border-light)",
                background:
                  day && isToday(day) ? "var(--primary-light)" : "transparent",
                transition: "background 0.15s ease",
                cursor: day ? "pointer" : "default",
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
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      fontSize: "14px",
                      fontWeight: 700,
                      background: isToday(day)
                        ? "var(--primary)"
                        : "transparent",
                      color: isToday(day) ? "white" : "var(--text-main)",
                      marginBottom: "8px",
                    }}
                  >
                    {day}
                  </span>
                  <div>
                    {getTasksForDay(day).map((t) => (
                      <div
                        key={t.id}
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          background: priorityColor(t.priority) + "20",
                          color: priorityColor(t.priority),
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
    </div>
  );
};

export default CalendarView;
