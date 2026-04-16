import { useState, useEffect } from 'react'
import './Header.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken, getUser, fetchMe, logoutRequest } from '../../../utils/auth'

const BASE_URL = 'http://localhost:3000'
const API = 'http://localhost:3000/api'

function Avatar({ avatar, initials, className }) {
  const [imgError, setImgError] = useState(false)
  const src = avatar?.startsWith('http') ? avatar : `${BASE_URL}/api${avatar}`

  if (avatar && !imgError) {
    return (
      <div className={className}>
        <img src={src} alt="avatar" onError={() => setImgError(true)} />
      </div>
    )
  }
  return <div className={className}>{initials}</div>
}

export default function Header({ notifCount: propNotifCount }) {
  const [ddOpen, setDdOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [user, setUser] = useState(getUser)
  const [savedCount, setSavedCount] = useState(0)

  // State cho notifications popup
  const [notifications, setNotifications] = useState([])
  const [tick, setTick] = useState(0)

  // State cho email notification toggle
  const [emailNotifEnabled, setEmailNotifEnabled] = useState(false)
  const [isLoadingEmailPref, setIsLoadingEmailPref] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const token = getToken()

  const planName = user?.plan?.name ?? 'free'
  const planDisplay = user?.plan?.displayName ?? 'Free'

  const PLAN_DOT_COLOR = {
    free: '#9A8D80',
    pro: '#D4820A',
    premium: '#2E6040',
  }

  const getDD_MENU = (savedCount, unreadCount) => [
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
        { ico: '🔔', label: 'Thông báo', path: '/notifications', tag: unreadCount > 0 ? `${unreadCount}` : null },
        { ico: '💳', label: 'Gói dịch vụ', tag: planDisplay, path: '/services' },
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

  // Format thời gian
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (minutes < 1) return 'Vừa xong'
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(diff / 86400000)
    return `${days} ngày trước`
  }

  const loadNotifications = async () => {
    if (!token) return

    try {
      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load notifications failed:', err)
    }
  }

  const markAsRead = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!token) return

    fetchMe(token)
      .then(setUser)
      .catch(() => {
        const cached = getUser()
        if (cached) setUser(cached)
      })
  }, [])


  useEffect(() => {
    if (!token) return

    const loadPref = async () => {
      const res = await fetch(`${API}/notifications/email-preference`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setEmailNotifEnabled(data.emailNotificationsEnabled)
      }
    }

    loadPref()
  }, [token])

  const toggleEmail = async () => {
    if (!token || isLoadingEmailPref) return

    setIsLoadingEmailPref(true)

    try {
      const res = await fetch(`${API}/notifications/email-preference`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emailNotificationsEnabled: !emailNotifEnabled,
        }),
      })

      if (res.ok) {
        setEmailNotifEnabled(prev => !prev)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingEmailPref(false)
    }
  }


  // Tick để cập nhật "time ago"
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])


  // Load user và saved count
  useEffect(() => {
    if (!token) return

    fetchMe(token)
      .then(setUser)
      .catch(() => {
        const cached = getUser()
        if (cached) setUser(cached)
      })

    fetch(`${API}/jobs/saved`, {
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

  // Xử lý click notification
  const handleClickNotif = (e, id) => {
    e.stopPropagation()

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )

    const map = JSON.parse(localStorage.getItem('readNotifs') || '{}')
    map[id] = true
    localStorage.setItem('readNotifs', JSON.stringify(map))
  }

  // Đọc tất cả
  const handleReadAll = (e) => {
    e.stopPropagation()

    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    )

    const map = JSON.parse(localStorage.getItem('readNotifs') || '{}')
    notifications.forEach(n => {
      map[n.id] = true
    })
    localStorage.setItem('readNotifs', JSON.stringify(map))
  }

  // Navigate đến job detail
  const handleJobClick = (e, jobID) => {
    e.stopPropagation()
    navigate(`/home/job/${jobID}`)
    setNotifOpen(false)
  }

  // Đóng tất cả dropdown khi click outside
  const handleOverlayClick = () => {
    setDdOpen(false)
    setNotifOpen(false)
  }

  const activeNav = NAV_ITEMS.find(i => location.pathname.startsWith(i.path))?.id
  const initials = user?.fullName ? user.fullName.trim().split(' ').slice(-1)[0].charAt(0).toUpperCase() : '?';

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotifIcon = (type, emailSent) => {
    if (type === 'expired') return '❌';
    if (type === 'deadline') return '⏰';
    return '🔔';
  };

  const getNotifBg = (type) => {
    if (type === 'expired') return '#FEE2E2';
    if (type === 'deadline') return '#FDE8E4';
    return '#E0F2FE';
  };

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

          {/* Notification Button với Popup */}
          <div className="app-header__notif-wrap">
            <button
              className={`app-header__icon-btn${notifOpen ? ' active' : ''}`}
              title="Thông báo"
              onClick={() => {
                setNotifOpen(o => !o)
                setDdOpen(false)
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span className="app-header__notif-bubble">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="app-header__dd-overlay" onClick={handleOverlayClick} />
                <div className="app-header__notif-dropdown">
                  <div className="app-header__notif-header">
                    <span className="app-header__notif-title">🔔 Thông báo</span>
                    {notifications.length > 0 && (
                      <button
                        className="app-header__notif-readall"
                        onClick={handleReadAll}
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="app-header__notif-list">
                    {notifications.length === 0 ? (
                      <div className="app-header__notif-empty">
                        Không có thông báo nào
                      </div>
                    ) : (
                      // Trong phần render notifications:
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`app-header__notif-item ${!notif.isRead ? 'unread' : ''}`}
                          onClick={(e) => {
                            handleClickNotif(e, notif.id);
                            if (!notif.isRead) markAsRead(notif.id);
                          }}
                        >
                          <div
                            className="app-header__notif-ico"
                            style={{ background: notif.type === 'expired' ? '#FEE2E2' : '#FDE8E4' }}
                          >
                            {notif.type === 'expired' ? '❌' : '⏰'}
                          </div>

                          <div className="app-header__notif-content">
                            <div className="app-header__notif-item-title">
                              {notif.title}
                              {notif.emailSent && (
                                <span title="Đã gửi email" style={{ marginLeft: 6, fontSize: 12 }}>
                                  ✉️
                                </span>
                              )}
                            </div>

                            {/* Hiển thị tên công ty nếu có */}
                            {notif.job?.company?.companyName && (
                              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                                🏢 {notif.job.company.companyName}
                              </div>
                            )}

                            <div className="app-header__notif-job">
                              {notif.content}
                            </div>

                            {/* Hiển thị deadline nếu có */}
                            {notif.job?.deadline && (
                              <div style={{ fontSize: 11, color: '#D4820A', marginTop: 4 }}>
                                ⏰ {new Date(notif.job.deadline).toLocaleDateString('vi-VN')}
                              </div>
                            )}

                            <div className="app-header__notif-time">
                              {formatTimeAgo(notif.createdAt)}
                            </div>
                          </div>

                          {!notif.isRead && <div className="app-header__notif-dot" />}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Email Notification Toggle */}
                  <div className="app-header__notif-email-toggle">
                    <div className="app-header__notif-email-info">
                      <span className="app-header__notif-email-icon">📧</span>
                      <div className="app-header__notif-email-text">
                        <div className="app-header__notif-email-label">Thông báo qua email</div>
                        <div className="app-header__notif-email-desc">
                          Nhận thông báo về việc làm sắp hết hạn
                        </div>
                      </div>
                    </div>
                    <button
                      className={`app-header__toggle-switch ${emailNotifEnabled ? 'on' : ''} ${isLoadingEmailPref ? 'loading' : ''}`}
                      onClick={toggleEmail}
                      disabled={isLoadingEmailPref}
                      aria-pressed={emailNotifEnabled}
                    >
                      <span className="app-header__toggle-slider" />
                    </button>
                  </div>

                  {/* <div 
                    className="app-header__notif-footer"
                    onClick={() => {
                      navigate('/notifications')
                      setNotifOpen(false)
                    }}
                  >
                    Xem tất cả thông báo
                  </div> */}
                </div>
              </>
            )}
          </div>

          <div className="app-header__divider" />

          <div className="app-header__avatar-wrap">
            <button
              className={`app-header__avatar-btn${ddOpen ? ' open' : ''}`}
              onClick={() => {
                setDdOpen(o => !o)
                setNotifOpen(false)
              }}
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
                  <span
                    className="app-header__av-plan-dot"
                    style={{ background: PLAN_DOT_COLOR[planName] ?? '#9A8D80' }}
                  />
                  {planDisplay}
                </span>
              </div>
              <span className="app-header__av-caret">▾</span>
            </button>

            {ddOpen && (
              <>
                <div className="app-header__dd-overlay" onClick={handleOverlayClick} />
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
                      <div className="app-header__dd-badge">⚡ {planDisplay}</div>
                    </div>
                  </div>

                  {getDD_MENU(savedCount, unreadCount).map((section, si) => (
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