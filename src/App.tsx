import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import TaskBoard from "./components/TaskBoard";
import TaskModal from "./components/TaskModal";
import ProjectsView from "./components/ProjectsView";
import CalendarView from "./components/CalendarView";
import TeamView from "./components/TeamView";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import useLocalStorage from "./hooks/useLocalStorage";
import type { Post } from "./types";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const initialTasks: Post[] = [
  {
    id: "1",
    title: "Redesign Landing Page",
    description: "Modernize the hero section with better CTA buttons.",
    status: "To Do",
    priority: "High",
    dueDate: "2025-03-20",
    projectId: "PJ1",
    assignee: "Alex",
  },
  {
    id: "2",
    title: "Fix Auth Redirect Bug",
    description: "Investigate the redirect loop after OAuth login.",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-03-15",
    projectId: "PJ1",
    assignee: "Sam",
  },
  {
    id: "3",
    title: "Write API Documentation",
    description: "Document all REST endpoints for the task service.",
    status: "Review",
    priority: "Medium",
    dueDate: "2025-03-25",
    projectId: "PJ1",
    assignee: "Alex",
  },
  {
    id: "4",
    title: "Q2 Marketing Research",
    description: "Gather competitor data for the product launch.",
    status: "Completed",
    priority: "Low",
    dueDate: "2025-03-10",
    projectId: "PJ2",
    assignee: "Jamie",
  },
  {
    id: "5",
    title: "Email Template Design",
    description: "Create responsive onboarding email templates.",
    status: "To Do",
    priority: "Medium",
    dueDate: "2025-03-18",
    projectId: "PJ2",
    assignee: "Taylor",
  },
  {
    id: "6",
    title: "Set Up CI/CD Pipeline",
    description: "Configure GitHub Actions for automated deployments.",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-03-22",
    projectId: "PJ3",
    assignee: "Jordan",
  },
];

const initialSettings = {
  userName: "Alex Rivera",
  userRole: "Product Designer",
  userEmail: "alex@taskmaster.pro",
  primaryColor: "#4F46E5",
  density: "Comfortable",
};

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Overview",
  tasks: "Task Board",
  projects: "Projects",
  calendar: "Calendar",
  team: "Team",
  reports: "Reports & Analytics",
  settings: "Settings",
};

const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.99, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 1.01, y: -5, transition: { duration: 0.2 } },
};

function App() {
  const [tasks, setTasks] = useLocalStorage<Post[]>(
    "tm_tasks_v3",
    initialTasks,
  );
  const [settings, setSettings] = useLocalStorage(
    "tm_settings_v3",
    initialSettings,
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Post | null>(null);

  // Apply Theme Color to CSS Variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      settings.primaryColor,
    );
    const hoverColor = shadeColor(settings.primaryColor, -15);
    const lightColor = settings.primaryColor + "15"; // 15% opacity hex variant
    document.documentElement.style.setProperty("--primary-hover", hoverColor);
    document.documentElement.style.setProperty("--primary-light", lightColor);
  }, [settings.primaryColor]);

  // Keyboard Shortcuts (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("focus-search"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = Math.floor((R * (100 + percent)) / 100);
    G = Math.floor((G * (100 + percent)) / 100);
    B = Math.floor((B * (100 + percent)) / 100);
    R = Math.min(255, R);
    G = Math.min(255, G);
    B = Math.min(255, B);
    const getHex = (n: number) => n.toString(16).padStart(2, "0");
    return "#" + getHex(R) + getHex(G) + getHex(B);
  }

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAdd = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };
  const openEdit = (task: Post) => {
    setEditTask(task);
    setIsModalOpen(true);
  };
  const handleDelete = (id: string) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const handleSave = (task: Post) => {
    if (editTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      setTasks([
        { ...task, id: Math.random().toString(36).substr(2, 9) },
        ...tasks,
      ]);
    }
    setIsModalOpen(false);
  };

  const updateTaskStatus = (id: string, status: Post["status"]) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const renderPage = () => {
    const commonProps = {
      tasks: filteredTasks,
      onEdit: openEdit,
      onDelete: handleDelete,
    };

    if (filteredTasks.length === 0 && searchQuery !== "") {
      return (
        <div
          className="main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            opacity: 0.6,
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔍</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700 }}>
            No results found
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            We couldn't find anything matching "{searchQuery}"
          </p>
          <button
            className="btn-secondary"
            style={{ marginTop: "20px" }}
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard tasks={filteredTasks} />;
      case "tasks":
        return (
          <TaskBoard
            {...commonProps}
            onAdd={openAdd}
            onMove={updateTaskStatus}
          />
        );
      case "projects":
        return <ProjectsView tasks={filteredTasks} />;
      case "calendar":
        return <CalendarView tasks={filteredTasks} onAddTask={openAdd} />;
      case "team":
        return <TeamView />;
      case "reports":
        return <ReportsView tasks={filteredTasks} />;
      case "settings":
        return (
          <SettingsView settings={settings} onUpdateSettings={setSettings} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={settings.userName}
        userEmail={settings.userEmail}
      />
      <div className="main-area">
        <Header
          title={PAGE_TITLES[activeTab] ?? activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddTask={openAdd}
          userName={settings.userName}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ flexGrow: 1 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editTask={editTask}
      />
    </div>
  );
}

export default App;
