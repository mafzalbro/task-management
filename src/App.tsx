import { useState, useEffect } from "react";
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
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_TASKS, CREATE_TASK, UPDATE_TASK, TASK_CREATED_SUBSCRIPTION } from "./graphql/operations";

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
  const { data, loading, refetch } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);

  useSubscription(TASK_CREATED_SUBSCRIPTION, {
    onData: () => { refetch(); }
  });

  const [settings, setSettings] = useLocalStorage(
    "tm_settings_v3",
    initialSettings,
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Post | null>(null);

  const tasks: Post[] = data?.tasks?.map((t: any) => ({
    ...t,
    assignee: t.assigneeId || 'Unassigned',
    status: t.status === 'TODO' ? 'To Do' : t.status === 'IN_PROGRESS' ? 'In Progress' : t.status === 'REVIEW' ? 'Review' : 'Completed',
    priority: t.priority.charAt(0) + t.priority.slice(1).toLowerCase()
  })) || [];

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
  const handleDelete = () => {
    // Implement delete mutation
  };

  const handleSave = async (task: Post) => {
    if (editTask) {
      await updateTask({
        variables: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status.replace(' ', '_').toUpperCase(),
          priority: task.priority.toUpperCase()
        }
      });
    } else {
      await createTask({
        variables: {
          title: task.title,
          description: task.description,
          projectId: task.projectId || 'PJ1',
          status: task.status.replace(' ', '_').toUpperCase(),
          priority: task.priority.toUpperCase()
        }
      });
    }
    refetch();
    setIsModalOpen(false);
  };

  const updateTaskStatus = async (id: string, status: Post["status"]) => {
    await updateTask({
      variables: {
        id,
        status: status.replace(' ', '_').toUpperCase()
      }
    });
    refetch();
  };

  const renderPage = () => {
    const commonProps = {
      tasks: filteredTasks,
      onEdit: openEdit,
      onDelete: handleDelete,
    };

    if (loading) return <div>Loading tasks...</div>;

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
