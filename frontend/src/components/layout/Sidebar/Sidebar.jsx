import './Sidebar.css';
import { useNavigate, useLocation } from "react-router-dom"

function Sidebar() {
  // const navItems = [
  //   { id: 'dashboard', icon: '⊞', label: 'Dashboard', badge: null, target: 's2' },
  //   // { id: 'search', icon: '🔍', label: 'Tìm việc', target: 's3'},
  //   { id: 'applications', icon: '📋', label: 'Đơn ứng tuyển', badge: null, target: 's7' },
  //   // { id: 'cv', icon: '📄', label: 'CV của tôi', badge: null, target: 's6'},
  // ];

  const navItems = [
    // { id: 'dashboard', icon: '⊞', label: 'Dashboard', path: '/dashboard' },
    // { id: 'applications', icon: '📋', label: 'Đơn ứng tuyển', path: '/applications' },
    { id: 'profile', icon: '👤', label: 'Hồ sơ của tôi', path: '/profile' },
    { id: 'save-jobs', icon: '⭐', label: 'Việc đã lưu', path: '/saved-jobs' },
    { id: 'cv', icon: '📄', label: 'CV của tôi', path: '/mycv'},
    // { id: 'applications', icon: '📋', label: 'Đơn ứng tuyển', path: '/applications' },
  ]

  const toolItems = [
    { id: 'ai', icon: '🤖', label: 'AI Assistant', path: '/ai-assistant' },
    { id: 'notifications', icon: '🔔', label: 'Thông báo', path: '/notifications' },
    { id: 'services', icon: '💳', label: 'Gói dịch vụ', path: '/services' },
    { id: 'settings', icon: '⚙️', label: 'Cài đặt tài khoản', path: '/settings' },
    { id: 'logout', icon: '🚪', label: 'Đăng xuất' }

  ]
  // const toolItems = [
  //   { id: 'ai', icon: '🤖', label: 'AI Assistant', badge: null },
  //   // { id: 'auto', icon: '⚡', label: 'Auto Apply', badge: null, target:'s5' },
  //   { id: 'notifications', icon: '🔔', label: 'Thông báo', target:'s9' },
  // ];

  // const handleFeatureClick = (target) => {
  //   if (target && onNavigate) {
  //     onNavigate(target)
  //   }
  // }

  const navigate = useNavigate()
  const location = useLocation()

  const activeItem = [...navItems, ...toolItems].find(i =>
    location.pathname.startsWith(i.path)
  )?.id

  return (
    <div className="sidebar">
      <div className="sb-logo">
        <span>GZCONNECT</span>
      </div>

      {navItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => item.path && navigate(item.path)}
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
          onClick={() => item.path && navigate(item.path)}
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