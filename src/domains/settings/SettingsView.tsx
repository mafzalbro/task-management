import React, { useState } from "react";
import { Save, Check } from "lucide-react";
import { useToast } from "../../shared/providers";

interface SettingsViewProps {
  settings: any;
  onUpdateSettings: (s: any) => void;
}

const COLORS = [
  { name: "Indigo", value: "#4F46E5" },
  { name: "Red", value: "#EF4444" },
  { name: "Green", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Emerald", value: "#059669" },
];

const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const { showToast } = useToast();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    showToast('Settings saved successfully', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (key: string, val: any) => {
    const newSettings = { ...localSettings, [key]: val };
    setLocalSettings(newSettings);
    if (key === 'primaryColor') {
      onUpdateSettings(newSettings);
    }
  };

  return (
    <div className="main-content">
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Settings
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-muted)",
            marginTop: "4px",
            fontWeight: 500,
          }}
        >
          Manage your account and visual preferences.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "32px",
        }}
      >
        <div className="flex-col gap-6">
          {/* Profile Section */}
          <div className="stat-card" style={{ padding: "32px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
            >
              General Profile
            </h3>
            <div className="flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input
                  className="form-input"
                  value={localSettings.userName}
                  onChange={(e) => update("userName", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={localSettings.userEmail}
                  onChange={(e) => update("userEmail", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input
                  className="form-input"
                  value={localSettings.userRole}
                  onChange={(e) => update("userRole", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Customization */}
          <div className="stat-card" style={{ padding: "32px" }}>
            <h3
              style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}
            >
              Appearance
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "24px",
              }}
            >
              Customize the primary brand color for the workspace.
            </p>

            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <div
                  key={c.value}
                  onClick={() => update("primaryColor", c.value)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: c.value,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border:
                      localSettings.primaryColor === c.value
                        ? "3px solid #fff"
                        : "none",
                    boxShadow:
                      localSettings.primaryColor === c.value
                        ? "0 0 0 2px " + c.value
                        : "none",
                    transition: "0.2s",
                  }}
                >
                  {localSettings.primaryColor === c.value && (
                    <Check size={20} color="white" strokeWidth={3} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div style={{ position: "sticky", top: "100px" }}>
          <div
            className="stat-card"
            style={{
              padding: "24px",
              background: "var(--primary)",
              color: "white",
              border: "none",
            }}
          >
            <h4
              style={{ fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}
            >
              Save Changes
            </h4>
            <p
              style={{
                fontSize: "13px",
                opacity: 0.9,
                lineHeight: 1.5,
                marginBottom: "20px",
              }}
            >
              Update your workspace settings. These changes are saved in your
              local storage.
            </p>
            <button
              className="btn-primary"
              onClick={handleSave}
              style={{
                background: "white",
                color: "var(--primary)",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Save size={18} /> {saved ? "Settings Saved!" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
