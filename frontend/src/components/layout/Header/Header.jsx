// src/components/layout/Header/Header.jsx
import { useState } from 'react'
import './Header.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Tổng quan', screen: 's3' },
  { id: 'jobs',      label: 'Tìm việc',  screen: 's10'},
  { id: 'companies', label: 'Công ty',  screen: 's11' },
  { id: 'cv',        label: 'Tạo CV',  screen: 's6' },
  { id: 'about', label: 'Về chúng tôi',  screen: 's12' }
]

/* ── Dropdown sections ──────────────────────────────────────── */
const DD_MENU = [
  {
    label: 'Tài khoản',
    items: [
      { ico: '👤', label: 'Hồ sơ của tôi',      screen: 's8'  },
      { ico: '📋', label: 'Đơn ứng tuyển',       screen: 's7', tag: '14' },
      { ico: '📄', label: 'CV của tôi',           screen: 's6'  },
      { ico: '🤖', label: 'AI Assistant',         screen: 's8'  },
    ],
  },
  {
    label: 'Cài đặt',
    items: [
      { ico: '⚙️', label: 'Cài đặt tài khoản',  screen: 's8'  },
      { ico: '🔔', label: 'Thông báo',            screen: 's9'  },
      { ico: '🔒', label: 'Bảo mật & Mật khẩu',  screen: null  },
      { ico: '💳', label: 'Gói dịch vụ',          screen: null, tag: 'Pro' },
    ],
  },
  {
    label: '',
    items: [
      { ico: '❓', label: 'Trung tâm hỗ trợ',    screen: null  },
      { ico: '📣', label: 'Gửi phản hồi',         screen: null  },
      { ico: '🚪', label: 'Đăng xuất',            screen: null, danger: true },
    ],
  },
]

/* ── Map screen → nav id ────────────────────────────────────── */
const SCREEN_TO_NAV = {
    s3: 'home', s10: 'jobs', s11: 'companies', s6: 'cv', s12: 'about'
}

export default function Header({ activeScreen, onNavigate, notifCount = 5 }) {
  const [ddOpen, setDdOpen] = useState(false)
  const activeNav = SCREEN_TO_NAV[activeScreen] ?? null

  const go = (screen) => {
    if (screen) onNavigate(screen)
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">

        {/* Logo */}
        <div className="app-header__logo" onClick={() => go('s2')}>
          GZ<em>CONNECT</em>
        </div>

        {/* Nav links */}
        <nav className="app-header__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`app-header__nav-btn${activeNav === item.id ? ' active' : ''}`}
              onClick={() => go(item.screen)}
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
          <button className="app-header__quick-search" onClick={() => go('s3')}>
            🔍 <span>Tìm kiếm nhanh...</span>
          </button>

          {/* Notifications */}
          <button
            className={`app-header__icon-btn${activeScreen === 's9' ? ' active' : ''}`}
            title="Thông báo"
            onClick={() => go('s9')}
          >
            🔔
            {notifCount > 0 && (
              <span className="app-header__notif-bubble">
                {notifCount > 99 ? '99+' : notifCount}
              </span>
            )}
          </button>

          {/* Saved jobs */}
          {/* <button
            className="app-header__icon-btn"
            title="Việc làm đã lưu"
          >
            🔖
          </button> */}

{/*         
          <button
            className={`app-header__icon-btn${activeScreen === 's7' ? ' active' : ''}`}
            title="Đơn ứng tuyển"
            onClick={() => go('s7')}
          >
            📋
          </button> */}

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
                          onClick={() => { setDdOpen(false); go(item.screen) }}
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