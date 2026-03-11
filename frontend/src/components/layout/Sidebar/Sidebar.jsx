import './Sidebar.css';

function Sidebar({ activeItem = 'dashboard', onNavigate }) {
  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', badge: null, target: 's2' },
    { id: 'search', icon: '🔍', label: 'Tìm việc', badge: '247', target: 's3'},
    { id: 'applications', icon: '📋', label: 'Đơn ứng tuyển', badge: null, target: 's7' },
    { id: 'cv', icon: '📄', label: 'CV của tôi', badge: null, target: 's6'},
  ];

  const toolItems = [
    { id: 'ai', icon: '🤖', label: 'AI Assistant', badge: null },
    { id: 'auto', icon: '⚡', label: 'Auto Apply', badge: null, target:'s5' },
    { id: 'notifications', icon: '🔔', label: 'Thông báo', badge: '5',target:'s9' },
  ];

  const handleFeatureClick = (target) => {
    if (target && onNavigate) {
      onNavigate(target)
    }
  }


  return (
    <div className="sidebar">
      <div className="sb-logo">
        <span>GZCONNECT</span>
      </div>

      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => handleFeatureClick(item.target)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sb-section">Công cụ</div>

      {toolItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => handleFeatureClick(item.target)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sb-user">
        <div className="av">TN</div>
        <div>
          <div className="av-name">Trần Ngọc</div>
          <div className="av-role">Senior Dev</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;