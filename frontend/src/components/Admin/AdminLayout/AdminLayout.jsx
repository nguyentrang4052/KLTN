import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { clearAuth, getUser } from '../../../utils/auth'
import './AdminLayout.css'

const NAV = [
  { id: 'dashboard', icon: '◈', label: 'Tổng quan', path: '/admin' },
  { id: 'users', icon: '◉', label: 'Người dùng', path: '/admin/users' },
  { id: 'categories', icon: '◫', label: 'Danh mục dữ liệu', path: '/admin/categories' },
  { id: 'packages', icon: '◪', label: 'Gói dịch vụ', path: '/admin/packages' },
  { id: 'refunds', icon: '↩', label: 'Xử lý hoàn tiền', path: '/admin/refunds' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

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

        <div className="adm-side__bottom">
          {!collapsed && (
            <div className="adm-side__user-info">
              <div className="adm-side__user-av">{initials}</div>
              <div className="adm-side__user-text">
                <div className="adm-side__user-name">{displayName}</div>
                <div className="adm-side__user-role">Quản trị viên</div>
              </div>
            </div>
          )}
          <button
            className="adm-side__logout"
            onClick={handleLogout}
            title={collapsed ? 'Đăng xuất' : ''}
          >
            <span className="adm-side__logout-ico">↪</span>
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
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
          {/* <div className="adm-topbar__right">
            <div className="adm-user-wrap">
              <div className="adm-topbar__av">{initials}</div>
              <span className="adm-topbar__name">{displayName}</span>
            </div>
          </div> */}
        </div>
        <div className="adm-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}