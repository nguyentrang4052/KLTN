// src/components/layout/Header/Header.jsx
import { useState } from 'react'
import './Header.css'
import { useNavigate, useLocation } from "react-router-dom"

// const NAV_ITEMS = [
//   { id: 'home', label: 'Tổng quan', screen: 's3' },
//   { id: 'jobs',      label: 'Tìm việc',  screen: 's10'},
//   { id: 'companies', label: 'Công ty',  screen: 's11' },
//   { id: 'cv',        label: 'Tạo CV',  screen: 's6' },
//   { id: 'about', label: 'Về chúng tôi',  screen: 's12' }
// ]

const NAV_ITEMS = [
  { id: 'home', label: 'Tổng quan', path: '/home' },
  { id: 'jobs', label: 'Tìm việc', path: '/jobs' },
  { id: 'companies', label: 'Công ty', path: '/companies' },
  { id: 'cv', label: 'Tạo CV', path: '/cv-builder' },
  { id: 'about', label: 'Về chúng tôi', path: '/about' }
]

/* ── Dropdown sections ──────────────────────────────────────── */
// const DD_MENU = [
//   {
//     label: 'Tài khoản',
//     items: [
//       { ico: '👤', label: 'Hồ sơ của tôi', path: '/profile' },
//       { ico: '📋', label: 'Đơn ứng tuyển', path: '/applications', tag: '14' },
//       { ico: '📄', label: 'CV của tôi', path: '/cv-builder' },
//       { ico: '🤖', label: 'AI Assistant', screen: 's8' },
//     ],
//   },
//   {
//     label: 'Cài đặt',
//     items: [
//       { ico: '⚙️', label: 'Cài đặt tài khoản' },
//       { ico: '🔔', label: 'Thông báo', path: '/notifications' },
//       { ico: '🔒', label: 'Bảo mật & Mật khẩu', screen: null },
//       { ico: '💳', label: 'Gói dịch vụ', screen: null, tag: 'Pro' },
//     ],
//   },
//   {
//     label: '',
//     items: [
//       { ico: '❓', label: 'Trung tâm hỗ trợ', screen: null },
//       { ico: '📣', label: 'Gửi phản hồi', screen: null },
//       { ico: '🚪', label: 'Đăng xuất', screen: null, danger: true },
//     ],
//   },
// ]

const DD_MENU = [
  {
    label: 'Tài khoản',
    items: [
      { ico: '👤', label: 'Hồ sơ của tôi', path: '/profile' },
      { ico: '📋', label: 'Đơn ứng tuyển', path: '/applications', tag: '14' },
      { ico: '📄', label: 'CV của tôi', path: '/cv-builder' },
      { ico: '🤖', label: 'AI Assistant', path: '/profile' }
    ],
  },
  {
    label: 'Cài đặt',
    items: [
      { ico: '⚙️', label: 'Cài đặt tài khoản', path: '/profile' },
      { ico: '🔔', label: 'Thông báo', path: '/notifications' },
      { ico: '🔒', label: 'Bảo mật & Mật khẩu' },
      { ico: '💳', label: 'Gói dịch vụ', tag: 'Pro' },
      { ico: '🚪', label: 'Đăng xuất'}
    ],
  }
]

// const SCREEN_TO_NAV = {
//     s3: 'home', s10: 'jobs', s11: 'companies', s6: 'cv', s12: 'about'
// }

export default function Header({ notifCount = 5 }) {
  const [ddOpen, setDdOpen] = useState(false)
  // const activeNav = SCREEN_TO_NAV[activeScreen] ?? null
  const location = useLocation()
  const navigate = useNavigate()

  const activeNav = NAV_ITEMS.find(i => location.pathname.startsWith(i.path))?.id

  const go = (path) => {
    if (path) navigate(path)
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">

        {/* Logo */}
        <div className="app-header__logo" onClick={() => navigate("/home")}>
          GZ<em>CONNECT</em>
        </div>

        {/* Nav links */}
        <nav className="app-header__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`app-header__nav-btn${activeNav === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="app-header__nav-icon">{item.icon}</span>
              {item.label}
              {item.badge != null && (
                <span className="app-header__nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="app-header__right">

          {/* Quick search */}
          <button className="app-header__quick-search" onClick={() => navigate("/jobs")}>
            🔍 <span>Tìm kiếm nhanh...</span>
          </button>

          {/* Notifications */}
          <button
            className={`app-header__icon-btn${location.pathname === "/notifications" ? ' active' : ''}`}
            title="Thông báo"
            onClick={() => navigate("/notifications")}
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
              <div className="app-header__av-circle">T</div>
              <div className="app-header__av-meta">
                <span className="app-header__av-name">Trần Văn A</span>
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

                  {/* User hero */}
                  <div className="app-header__dd-hero">
                    <div className="app-header__dd-av">T</div>
                    <div>
                      <div className="app-header__dd-name">Trần Văn A</div>
                      <div className="app-header__dd-email">tranvana@email.com</div>
                      <div className="app-header__dd-badge">⚡ AI Pro</div>
                    </div>
                  </div>

                  {DD_MENU.map((section, si) => (
                    <div className="app-header__dd-sec" key={si}>
                      {section.label && (
                        <div className="app-header__dd-sec-label">{section.label}</div>
                      )}
                      {section.items.map(item => (
                        <button
                          key={item.label}
                          className={`app-header__dd-item${item.danger ? ' danger' : ''}`}
                          onClick={() => {
                            setDdOpen(false)
                            if (item.path) navigate(item.path)
                          }}
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