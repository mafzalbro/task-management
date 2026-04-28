import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddTask: () => void;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  searchQuery,
  setSearchQuery,
  onAddTask,
  userName,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFocus = () => inputRef.current?.focus();
    window.addEventListener("focus-search", handleFocus);
    return () => window.removeEventListener("focus-search", handleFocus);
  }, []);

  const notifications = [
    {
      id: 1,
      icon: "🎯",
      text: "API Documentation moved to Review",
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      icon: "👥",
      text: "Sam assigned a task to you",
      time: "15m ago",
      unread: true,
    },
    {
      id: 3,
      icon: "✅",
      text: "Marketing Research marked complete",
      time: "1h ago",
      unread: false,
    },
    {
      id: 4,
      icon: "📅",
      text: "Landing Page deadline is tomorrow",
      time: "3h ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      style={{
        height: "75px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 48px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        gap: "24px",
      }}
    >
      {/* ── Left: Page Title ── */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-main)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          Zenith Workspace &rsaquo;{" "}
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            {title}
          </span>
        </div>
      </div>

      {/* ── Center: Search ── */}
      <div
        style={{
          flex: 1,
          maxWidth: "460px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "var(--bg-subtle)",
          border: "1.5px solid var(--border-light)",
          borderRadius: "14px",
          padding: "10px 18px",
          transition: "all 0.25s ease",
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--primary)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 0 4px var(--primary-light)";
          (e.currentTarget as HTMLDivElement).style.background = "#fff";
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "var(--border-light)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.background =
            "var(--bg-subtle)";
        }}
      >
        <Search
          size={16}
          strokeWidth={2.5}
          style={{ color: "var(--text-muted)", flexShrink: 0 }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search everywhere..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "14px",
            color: "var(--text-main)",
            fontWeight: 500,
            fontFamily: "inherit",
          }}
        />
        <kbd
          style={{
            fontSize: "10px",
            fontWeight: 800,
            padding: "3px 7px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "6px",
            color: "var(--text-muted)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* ── Right: Actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onAddTask}
          className="btn-primary"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "12px",
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          New Task
        </button>

        <div
          style={{
            width: 1,
            height: 32,
            background: "var(--border-light)",
            margin: "0 6px",
          }}
        />

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className="icon-btn"
            style={{
              background: showNotif
                ? "var(--primary-light)"
                : "var(--bg-subtle)",
              borderColor: showNotif ? "var(--primary)" : "transparent",
              color: showNotif ? "var(--primary)" : "inherit",
            }}
          >
            <Bell size={18} strokeWidth={2} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--danger)",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #fff",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              className="stat-card"
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                width: 340,
                padding: 0,
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 800, fontSize: "15px" }}>
                  Notifications
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Mark all as read
                </span>
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "14px 20px",
                      alignItems: "flex-start",
                      background: n.unread ? "var(--primary-light)" : "#fff",
                      borderBottom: "1px solid var(--border-light)",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      !n.unread &&
                      (e.currentTarget.style.background = "var(--bg-subtle)")
                    }
                    onMouseLeave={(e) =>
                      !n.unread && (e.currentTarget.style.background = "#fff")
                    }
                  >
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>
                      {n.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: n.unread ? 700 : 500,
                          color: "var(--text-main)",
                          lineHeight: 1.4,
                          marginBottom: "2px",
                        }}
                      >
                        {n.text}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {n.time}
                      </p>
                    </div>
                    {n.unread && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--primary)",
                          flexShrink: 0,
                          marginTop: "4px",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 14px 6px 6px",
              background: showProfile
                ? "var(--primary-light)"
                : "var(--bg-subtle)",
              border: `1.5px solid ${showProfile ? "var(--primary)" : "transparent"}`,
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {userName[0]}
            </div>
            <div style={{ textAlign: "left", display: "none" }}>
              {/* Responsive label option */}
            </div>
            <ChevronDown
              size={14}
              style={{
                opacity: 0.5,
                transform: showProfile ? "rotate(180deg)" : "none",
                transition: "0.2s",
              }}
            />
          </button>

          {showProfile && (
            <div
              className="stat-card"
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: 0,
                width: 240,
                padding: 8,
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid var(--border-light)",
                  marginBottom: "8px",
                }}
              >
                <p style={{ fontWeight: 800, fontSize: "14px" }}>{userName}</p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  Workspace Admin
                </p>
              </div>
              <div className="flex-col gap-1">
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Profile Settings
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--danger)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--danger-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Sign Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
