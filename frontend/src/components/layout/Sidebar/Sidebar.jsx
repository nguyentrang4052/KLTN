import { useState, useEffect } from 'react';
import './Sidebar.css';
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, fetchMe, getToken, logoutRequest } from '../../../utils/auth';

const BASE_URL = 'http://localhost:3000';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUser());

  const navItems = [
    { id: 'profile', icon: '👤', label: 'Hồ sơ của tôi', path: '/profile' },
    { id: 'save-jobs', icon: '⭐', label: 'Việc đã lưu', path: '/saved-jobs' },
    { id: 'cv', icon: '📄', label: 'CV của tôi', path: '/mycv' },
  ];

  const toolItems = [
    { id: 'ai', icon: '🤖', label: 'AI Assistant', path: '/ai-assistant' },
    { id: 'notifications', icon: '🔔', label: 'Thông báo', path: '/notifications' },
    { id: 'services', icon: '💳', label: 'Gói dịch vụ', path: '/services' },
    { id: 'settings', icon: '⚙️', label: 'Cài đặt tài khoản', path: '/settings' },
    { id: 'logout', icon: '🚪', label: 'Đăng xuất', action: 'logout' }
  ];

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchMe(token)
        .then(setUser)
        .catch(() => {
          const cached = getUser();
          if (cached) setUser(cached);
        });
    }
  }, []);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUser(event.detail);
      }
    };
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = async () => {
    await logoutRequest();
    navigate('/login', { replace: true });
  };

  const handleItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const activeItem = [...navItems, ...toolItems].find(i =>
    location.pathname.startsWith(i.path)
  )?.id;
  const initials = user?.fullName
    ? user.fullName.trim().split(' ').slice(-1)[0].charAt(0).toUpperCase()
    : '?';

  const avatarSrc = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}/api${user.avatar}`)
    : null;

  return (
    <div className="sidebar">
      <div className="sb-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
        <span>GZCONNECT</span>
      </div>

      <div className="sb-menu-scroll">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div className="sb-section">Công cụ</div>

        {toolItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="sb-user" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
        <div className="av">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avt" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: 'rgb(189, 114, 71)' }} />
          ) : (
            initials
          )}
        </div>
        <div className="av-info">
          <div className="av-name">{user?.fullName ?? 'Người dùng'}</div>
          <div className="av-role">{user?.jobTitle ?? 'Thành viên'}</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;