import React from "react";
import {
  LayoutDashboard,
  CheckCircle,
  FolderOpen,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  userEmail: string;
}

const MAIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "My Tasks", icon: CheckCircle },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userName,
  userEmail,
}) => {
  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        height: "100%",
        background: "#fff",
        borderRight: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.35)",
            }}
          >
            <Zap size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "-0.02em",
                color: "var(--text-main)",
                lineHeight: 1.2,
              }}
            >
              TaskMaster
            </div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Pro Workspace
            </div>
          </div>
        </div>
      </div>

      {/* Workspace pill - Dynamic User */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "12px",
            background: "var(--bg-subtle)",
            cursor: "pointer",
            transition: "background 0.15s ease",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 800,
              color: "white",
              flexShrink: 0,
            }}
          >
            {userName[0]}
          </div>
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--text-main)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userEmail}
            </div>
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--success)",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ padding: "8px 16px", flex: 1 }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            padding: "8px 12px 8px",
            marginBottom: "4px",
          }}
        >
          Menu
        </p>
        {MAIN_NAV.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <div
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "2px",
                transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "#fff" : "var(--text-muted)",
                boxShadow: isActive
                  ? "0 4px 12px rgba(79, 70, 229, 0.25)"
                  : "none",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 600,
                  flex: 1,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            borderRadius: "14px",
            background: "var(--primary)",
            padding: "18px",
            color: "white",
            boxShadow: "0 8px 24px rgba(79, 70, 229, 0.25)",
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 800, marginBottom: "4px" }}>
            Upgrade to Teams
          </p>
          <p
            style={{
              fontSize: "11px",
              opacity: 0.8,
              marginBottom: "12px",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            Get unlimited private boards & custom fields.
          </p>
          <button
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Explore Pro →
          </button>
        </div>
      </div>

      {/* Footer Nav */}
      <div
        style={{
          padding: "0 16px 24px",
          borderTop: "1px solid var(--border-light)",
          paddingTop: "16px",
        }}
      >
        <div
          onClick={() => setActiveTab("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "2px",
            background:
              activeTab === "settings" ? "var(--primary)" : "transparent",
            color: activeTab === "settings" ? "#fff" : "var(--text-muted)",
          }}
        >
          <Settings size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Settings</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            color: "var(--danger)",
          }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
