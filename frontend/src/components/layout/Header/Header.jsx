import { useState, useEffect } from 'react'
import './Header.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken, getUser, fetchMe, logoutRequest } from '../../../utils/auth'

const BASE_URL = 'http://localhost:3000'


function Avatar({ avatar, initials, className }) {
  const [imgError, setImgError] = useState(false)

  console.log('Avatar URL from DB:', avatar)

  const src = avatar?.startsWith('http') ? avatar : `${BASE_URL}/api${avatar}`

  console.log('Final src:', src)

  if (avatar && !imgError) {
    return (
      <div className={className}>
        <img
          src={src}
          alt="avatar"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }
  return <div className={className}>{initials}</div>
}

export default function Header({ notifCount }) {
  const [ddOpen, setDdOpen] = useState(false)
  const [user, setUser] = useState(getUser)
  const location = useLocation()
  const navigate = useNavigate()
  const [savedCount, setSavedCount] = useState(0)

  const getDD_MENU = (savedCount,  notifCount ) => [
    {
      label: 'Tài khoản',
      items: [
        { ico: '👤', label: 'Hồ sơ của tôi', path: '/profile' },
        { ico: '⭐', label: 'Việc đã lưu', path: '/saved-jobs', tag: savedCount > 0 ? `${savedCount}` : null },
        { ico: '📄', label: 'CV của tôi', path: '/my-cv' },
        { ico: '🤖', label: 'AI Assistant', path: '/ai-assistant' },
      ],
    },
    {
      label: 'Cài đặt',
      items: [
        { ico: '🔔', label: 'Thông báo', path: '/notifications', tag: notifCount > 0 ? `${notifCount}` : null },
        { ico: '💳', label: 'Gói dịch vụ', tag: 'Pro', path: '/services' },
        { ico: '⚙️', label: 'Cài đặt tài khoản', path: '/settings' },
        { ico: '🚪', label: 'Đăng xuất', action: 'logout', danger: true },
      ],
    },
  ]

  const NAV_ITEMS = [
    { id: 'home', label: 'Tổng quan', path: '/home' },
    { id: 'jobs', label: 'Tìm việc', path: '/jobs' },
    { id: 'companies', label: 'Công ty', path: '/companies' },
    { id: 'cv', label: 'Tạo CV', path: '/cv-templates' },
    { id: 'about', label: 'Về chúng tôi', path: '/about' },
  ]

  useEffect(() => {
    const token = getToken()
    if (!token) return

    fetchMe(token)
      .then(setUser)
      .catch(() => {
        const cached = getUser()
        if (cached) setUser(cached)
      })
    fetch('http://localhost:3000/api/jobs/saved', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setSavedCount(Array.isArray(data) ? data.length : 0))
      .catch(() => { })
  }, [])

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUser(event.detail);
      }
    };
    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLogout = async () => {
    setDdOpen(false)
    await logoutRequest()
    navigate('/login', { replace: true })
  }

  const handleDdItem = (item) => {
    setDdOpen(false)
    if (item.action === 'logout') { handleLogout(); return }
    if (item.path) navigate(item.path)
  }

  const activeNav = NAV_ITEMS.find(i => location.pathname.startsWith(i.path))?.id
  const initials = user?.fullName ? user.fullName.trim().split(' ').slice(-1)[0].charAt(0).toUpperCase() : '?';

  return (
    <header className="app-header">
      <div className="app-header__inner">

        <div className="app-header__logo" onClick={() => navigate('/home')}>
          GZ<em>CONNECT</em>
        </div>

        <nav className="app-header__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`app-header__nav-btn${activeNav === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app-header__right">
          <button className="app-header__quick-search" onClick={() => navigate('/jobs')}>
            🔍 <span>Tìm kiếm nhanh...</span>
          </button>

          <button
            className={`app-header__icon-btn${location.pathname === '/notifications' ? ' active' : ''}`}
            title="Thông báo"
            onClick={() => navigate('/notifications')}
          >
            🔔
            {notifCount > 0 && (
              <span className="app-header__notif-bubble">
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            )}
          </button>

          <div className="app-header__divider" />

          <div className="app-header__avatar-wrap">
            <button
              className={`app-header__avatar-btn${ddOpen ? ' open' : ''}`}
              onClick={() => setDdOpen(o => !o)}
            >
              <Avatar
                avatar={user?.avatar}
                initials={initials}
                className="app-header__av-circle"
              />
              <div className="app-header__av-meta">
                <span className="app-header__av-name">
                  {user?.fullName ?? 'Người dùng'}
                </span>
                <span className="app-header__av-plan">
                  <span className="app-header__av-plan-dot" />
                  AI Pro
                </span>
              </div>
              <span className="app-header__av-caret">▾</span>
            </button>

            {ddOpen && (
              <>
                <div className="app-header__dd-overlay" onClick={() => setDdOpen(false)} />
                <div className="app-header__dropdown">

                  <div className="app-header__dd-hero">
                    <Avatar
                      avatar={user?.avatar}
                      initials={initials}
                      className="app-header__dd-av"
                    />
                    <div>
                      <div className="app-header__dd-name">
                        {user?.fullName ?? 'Người dùng'}
                      </div>
                      {/* <div className="app-header__dd-email">
                        {user?.email ?? ''}
                      </div> */}
                      <div className="app-header__dd-badge">⚡ AI Pro</div>
                    </div>
                  </div>

                  {getDD_MENU(savedCount, notifCount).map((section, si) => (
                    <div className="app-header__dd-sec" key={si}>
                      {section.label && (
                        <div className="app-header__dd-sec-label">{section.label}</div>
                      )}
                      {section.items.map(item => (
                        <button
                          key={item.label}
                          className={`app-header__dd-item${item.danger ? ' danger' : ''}`}
                          onClick={() => handleDdItem(item)}
                        >
                          <span className="app-header__dd-item-ico">{item.ico}</span>
                          <span>{item.label}</span>
                          {item.tag && (
                            <span className="app-header__dd-item-tag">{item.tag}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}

                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}