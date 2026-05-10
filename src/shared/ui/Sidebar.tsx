import React from 'react';
import {
    LayoutGrid,
    List,
    Calendar,
    Users,
    PieChart,
    Settings,
    Zap,
    Crown,
    Layers
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpgrade: () => void;
  userName: string;
  userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onUpgrade, userName, userEmail }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Zap },
    { id: 'tasks', label: 'Task Board', icon: LayoutGrid },
    { id: 'sprints', label: 'Sprints', icon: Layers },
    { id: 'projects', label: 'Projects', icon: List },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'reports', label: 'Analytics', icon: PieChart },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
         <div style={{
            width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
         }}>
            <Crown size={20} fill="white" />
         </div>
         Zenith
      </div>

      <div className="nav-links">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} />
            {item.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          className="nav-link"
          style={{ marginBottom: '16px', background: 'var(--primary-light)', color: 'var(--primary)' }}
          onClick={onUpgrade}
        >
            <Crown size={20} />
            Upgrade to Pro
        </div>

        <div className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={20} />
          Settings
        </div>

        <div className="user-profile-mini" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)', paddingLeft: 0, borderLeft: 'none' }}>
           <div className="avatar">
              {userName[0]}
           </div>
           <div className="info" style={{ textAlign: 'left' }}>
              <div className="name">{userName}</div>
              <div className="role">{userEmail}</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
