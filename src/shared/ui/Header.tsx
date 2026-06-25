import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Plus, ChevronDown, Clock } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ, NOTIFICATION_CREATED_SUBSCRIPTION } from "../../shared/graphql";
import { motion, AnimatePresence } from "framer-motion";

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
  const { logout } = useAuth0();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notifData, refetch: refetchNotifs } = useQuery(GET_NOTIFICATIONS);
  const [markRead] = useMutation(MARK_NOTIFICATION_READ);
  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

  useSubscription(NOTIFICATION_CREATED_SUBSCRIPTION, {
    onData: () => refetchNotifs()
  });

  useEffect(() => {
    const handleFocus = () => inputRef.current?.focus();
    window.addEventListener("focus-search", handleFocus);
    return () => window.removeEventListener("focus-search", handleFocus);
  }, []);

  const notifications = notifData?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    await markRead({ variables: { id } });
    refetchNotifs();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    refetchNotifs();
  };

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
              position: 'relative'
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

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
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
                    background: 'var(--bg-subtle)'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: "15px" }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      onClick={handleMarkAllRead}
                      style={{
                        fontSize: "12px",
                        color: "var(--primary)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Mark all as read
                    </span>
                  )}
                </div>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                       <Bell size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                       <p style={{ fontSize: '13px', fontWeight: 500 }}>All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((n: any) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        style={{
                          padding: "14px 20px",
                          alignItems: "flex-start",
                          background: n.read ? "#fff" : "var(--primary-light)",
                          borderBottom: "1px solid var(--border-light)",
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div className="flex justify-between items-start" style={{ marginBottom: '4px' }}>
                            <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-main)" }}>{n.title}</p>
                            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: '4px' }} />}
                          </div>
                          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: "8px" }}>{n.message}</p>
                          <div className="flex items-center gap-1" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                            <Clock size={12} />
                            {new Date(parseInt(n.createdAt)).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
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
