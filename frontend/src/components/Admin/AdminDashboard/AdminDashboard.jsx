import { useState, useEffect } from 'react'
import { adminFetch } from '../../../utils/auth'
import './AdminDashboard.css'

const STAT_CONFIG = [
  { key: 'total', label: 'Tổng người dùng', color: '#E8C97A', ico: '◉', deltaKey: null },
  { key: 'active', label: 'Tài khoản hoạt động', color: '#4E8E62', ico: '◈', deltaKey: null },
  { key: 'locked', label: 'Tài khoản bị khóa', color: '#C0412A', ico: '◎', deltaKey: null },
  { key: 'pro', label: 'Gói dịch vụ Pro', color: '#7B9FD4', ico: '◪', deltaKey: null },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      adminFetch('/admin/stats'),
      adminFetch('/admin/recent-users'),
    ])
      .then(([s, u]) => { setStats(s); setRecentUsers(u) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="adm-db__loading">Đang tải...</div>
  if (error) return <div className="adm-db__error">⚠ {error}</div>

  return (
    <div className="adm-db">
      <div className="adm-db__header">
        <div>
          <h1 className="adm-db__title">Tổng quan hệ thống</h1>
          <p className="adm-db__sub">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
        </div>
      </div>

      <div className="adm-db__stats">
        {STAT_CONFIG.map((s, i) => (
          <div className="adm-stat" key={i}>
            <div className="adm-stat__ico" style={{ color: s.color }}>{s.ico}</div>
            <div className="adm-stat__val" style={{ color: s.color }}>
              {stats?.[s.key]?.toLocaleString() ?? '—'}
            </div>
            <div className="adm-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="adm-db__grid">
        <div className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__title">Người dùng mới đăng ký</span>
            <a className="adm-card__more" href="/admin/users">Xem tất cả →</a>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Họ tên</th><th>Email</th><th>Gói</th><th>Trạng thái</th><th>Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i}>
                  <td className="adm-table__name">{u.name}</td>
                  <td className="adm-table__muted">{u.email}</td>
                  <td><span className={`adm-badge adm-badge--${u.plan.toLowerCase()}`}>{u.plan}</span></td>
                  <td>
                    <span className={`adm-status adm-status--${u.status}`}>
                      {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="adm-table__muted">{u.joined}</td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr><td colSpan={5} className="adm-table__empty">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}