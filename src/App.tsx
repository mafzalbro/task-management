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
import CommandPalette from "./components/modals/CommandPalette";
import UpgradeModal from "./components/modals/UpgradeModal";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import useLocalStorage from "./hooks/useLocalStorage";
import type { Post } from "./types";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_TASKS, CREATE_TASK, UPDATE_TASK, DELETE_TASK, TASK_CREATED_SUBSCRIPTION } from "./graphql/operations";
import { useToast } from "./contexts/ToastContext";
import confetti from "canvas-confetti";

const initialSettings = {
  userName: "Alex Rivera",
  userRole: "Product Designer",
  userEmail: "alex@zenith.pro",
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
  const { showToast } = useToast();
  const { data, loading, refetch, error: queryError } = useQuery(GET_TASKS, {
    onError: (err) => showToast(`Failed to load tasks: ${err.message}`, 'error')
  });
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => showToast('Task created successfully', 'success'),
    onError: (err) => showToast(`Failed to create task: ${err.message}`, 'error')
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => showToast('Task updated successfully', 'success'),
    onError: (err) => showToast(`Failed to update task: ${err.message}`, 'error')
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => showToast('Task deleted successfully', 'success'),
    onError: (err) => showToast(`Failed to delete task: ${err.message}`, 'error')
  });

  useSubscription(TASK_CREATED_SUBSCRIPTION, {
    onData: () => {
      showToast('New task detected!', 'info');
      refetch();
    }
  });

  const [settings, setSettings] = useLocalStorage(
    "tm_settings_v3",
    initialSettings,
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Post | null>(null);

  const mapStatusToUI = (status: string): Post["status"] => {
    switch (status) {
      case "TODO": return "To Do";
      case "IN_PROGRESS": return "In Progress";
      case "REVIEW": return "Review";
      case "COMPLETED": return "Completed";
      default: return "To Do";
    }
  };

  const mapUIToStatus = (uiStatus: Post["status"]): string => {
    switch (uiStatus) {
      case "To Do": return "TODO";
      case "In Progress": return "IN_PROGRESS";
      case "Review": return "REVIEW";
      case "Completed": return "COMPLETED";
      default: return "TODO";
    }
  };

  const tasks: Post[] = data?.tasks?.map((t: any) => ({
    ...t,
    assignee: t.assignee?.name || t.assigneeId || 'Unassigned',
    status: mapStatusToUI(t.status),
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
        setIsCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
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
  const handleDelete = async (id: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await deleteTask({ variables: { id } });
        refetch();
      }
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const handleSave = async (task: Post) => {
    try {
      if (editTask) {
        await updateTask({
          variables: {
            id: task.id,
            title: task.title,
            description: task.description,
            status: mapUIToStatus(task.status),
            priority: task.priority.toUpperCase()
          }
        });
      } else {
        await createTask({
          variables: {
            title: task.title,
            description: task.description,
            projectId: task.projectId || 'PJ1',
            status: mapUIToStatus(task.status),
            priority: task.priority.toUpperCase()
          }
        });
      }
      refetch();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const updateTaskStatus = async (id: string, status: Post["status"]) => {
    await updateTask({
      variables: {
        id,
        status: mapUIToStatus(status)
      }
    });
    if (status === "Completed") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#10B981", "#F59E0B"]
      });
    }
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

  const handleCommandSelect = (id: string) => {
    switch (id) {
      case 'new-task': openAdd(); break;
      case 'dashboard': setActiveTab('dashboard'); break;
      case 'tasks': setActiveTab('tasks'); break;
      case 'projects': setActiveTab('projects'); break;
      case 'team': setActiveTab('team'); break;
      case 'settings': setActiveTab('settings'); break;
    }
  };

  const openUpgrade = () => setIsUpgradeModalOpen(true);

  return (
    <div className="layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUpgrade={openUpgrade}
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

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={handleCommandSelect}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}

export default App;
