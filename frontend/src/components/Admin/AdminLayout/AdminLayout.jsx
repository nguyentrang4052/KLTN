import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { clearAuth, getUser } from '../../../utils/auth'
import './AdminLayout.css'

const NAV = [
  { id: 'dashboard',  icon: '◈', label: 'Tổng quan',        path: '/admin' },
  { id: 'users',      icon: '◉', label: 'Người dùng',       path: '/admin/users' },
  { id: 'categories', icon: '◫', label: 'Danh mục dữ liệu', path: '/admin/categories' },
  { id: 'packages',   icon: '◪', label: 'Gói dịch vụ',      path: '/admin/packages' },
]

export default function AdminLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [userMenu, setUserMenu]   = useState(false)

  const user = getUser()
  const displayName = user?.fullName || 'Quản trị viên'
  const initials = displayName.split(' ').slice(-1)[0]?.[0]?.toUpperCase() || 'A'

  const active = NAV.find(n =>
    n.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(n.path)
  )?.id

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <div className={`adm-root${collapsed ? ' collapsed' : ''}`}>
      <aside className="adm-side">
        <div className="adm-side__top">
          <div className="adm-side__logo" onClick={() => navigate('/admin')}>
            {collapsed ? 'GZ' : <><span>GZ</span>CONNECT</>}
          </div>
          <button className="adm-side__collapse" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        <div className="adm-side__label">{!collapsed && 'QUẢN TRỊ'}</div>

        <nav className="adm-side__nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`adm-side__item${active === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ''}
            >
              <span className="adm-side__ico">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active === item.id && <span className="adm-side__pip" />}
            </button>
          ))}
        </nav>

      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar__breadcrumb">
            <span>Admin</span>
            {active && active !== 'dashboard' && (
              <><span className="adm-topbar__sep">›</span>
              <span>{NAV.find(n => n.id === active)?.label}</span></>
            )}
          </div>

          <div className="adm-topbar__right">
            <div className="adm-user-wrap">
              <button
                className={`adm-user-btn${userMenu ? ' open' : ''}`}
                onClick={() => setUserMenu(v => !v)}
              >
                <div className="adm-topbar__av">{initials}</div>
                <span className="adm-topbar__name">{displayName}</span>
                <span className="adm-user-caret">▾</span>
              </button>

              {userMenu && (
                <>
                  <div className="adm-user-overlay" onClick={() => setUserMenu(false)} />
                  <div className="adm-user-dd">
                    <div className="adm-user-dd__hero">
                      <div className="adm-user-dd__av">{initials}</div>
                      <div>
                        <div className="adm-user-dd__name">{displayName}</div>
                        <div className="adm-user-dd__role">Quản trị viên hệ thống</div>
                      </div>
                    </div>
                    <div className="adm-user-dd__divider" />
                    <button className="adm-user-dd__item" onClick={() => { setUserMenu(false); navigate('/home') }}>
                      <span>🏠</span> Về trang chủ
                    </button>
                    <button className="adm-user-dd__item" onClick={() => { setUserMenu(false); navigate('/profile') }}>
                      <span>👤</span> Hồ sơ cá nhân
                    </button>
                    <div className="adm-user-dd__divider" />
                    <button className="adm-user-dd__item adm-user-dd__item--logout" onClick={handleLogout}>
                      <span>🚪</span> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="adm-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}