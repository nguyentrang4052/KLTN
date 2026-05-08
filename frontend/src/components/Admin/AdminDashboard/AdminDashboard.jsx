import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../../../utils/auth'
import { Chart, registerables } from 'chart.js'
import './AdminDashboard.css'

Chart.register(...registerables)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [detail, setDetail] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [monthlyReg, setMonthlyReg] = useState([])
  const [weeklyStatus, setWeeklyStatus] = useState([])
  const [planDist, setPlanDist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const c1 = useRef(null), c2 = useRef(null), c3 = useRef(null)
  const chart1 = useRef(null), chart2 = useRef(null), chart3 = useRef(null)

  useEffect(() => {
    Promise.all([
      adminFetch('/admin/stats'),
      adminFetch('/admin/recent-users'),
      adminFetch('/admin/stats/monthly-registrations'),
      adminFetch('/admin/stats/weekly-status'),
      adminFetch('/admin/stats/plan-distribution'),
    ]).then(([s, u, mr, ws, pd]) => {
      setStats(s); setRecentUsers(u)
      setMonthlyReg(mr); setWeeklyStatus(ws); setPlanDist(pd)
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!monthlyReg.length && !weeklyStatus.length && !planDist.length) return
    buildCharts()
    return () => {
      chart1.current?.destroy()
      chart2.current?.destroy()
      chart3.current?.destroy()
    }
  }, [stats, monthlyReg, weeklyStatus, planDist])

  const buildCharts = () => {
    const gridC = 'rgba(0,0,0,.05)', txtC = 'rgba(0,0,0,.4)'
    const tooltipDefaults = {
      backgroundColor: '#fff',
      titleColor: '#1C1510',
      bodyColor: '#6B5E50',
      borderColor: 'rgba(0,0,0,.1)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    }

    chart1.current?.destroy()
    chart1.current = new Chart(c1.current, {
      type: 'bar',
      data: {
        labels: monthlyReg.map(m => m.label),
        datasets: [{
          label: 'Người dùng mới',
          data: monthlyReg.map(m => m.count),
          backgroundColor: monthlyReg.map((_, i) =>
            i === monthlyReg.length - 1 ? 'rgba(46,96,64,.85)' : 'rgba(46,96,64,.28)'),
          hoverBackgroundColor: monthlyReg.map(() => 'rgba(46,96,64,.75)'),
          borderRadius: 6, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: tooltipDefaults },
        scales: {
          x: { grid: { display: false }, ticks: { color: txtC, font: { size: 11 } }, border: { display: false } },
          y: { grid: { color: gridC }, ticks: { color: txtC, font: { size: 11 }, stepSize: 1 }, border: { display: false }, beginAtZero: true }
        },
        onClick: (e, els) => {
          if (!els.length) return
          const m = monthlyReg[els[0].index]
          setDetail({
            title: `Đăng ký ${m.label}`,
            items: [
              { lbl: 'Người dùng mới', val: m.count },
              {
                lbl: 'So với tháng trước', val: (() => {
                  const prev = monthlyReg[els[0].index - 1]
                  if (!prev) return '—'
                  const diff = m.count - prev.count
                  return diff > 0 ? `+${diff}` : `${diff}`
                })()
              },
              {
                lbl: 'Tỷ lệ tháng này', val: (() => {
                  const total = monthlyReg.reduce((s, x) => s + x.count, 0)
                  return total > 0 ? `${Math.round(m.count / total * 100)}%` : '0%'
                })()
              },
            ],
            action: { label: 'Xem danh sách người dùng →', path: '/admin/users' }
          })
        }
      }
    })

    chart2.current?.destroy()
    chart2.current = new Chart(c2.current, {
      type: 'doughnut',
      data: {
        labels: planDist.map(p => p.label),
        datasets: [{
          data: planDist.map(p => p.count),
          backgroundColor: ['#D3C9B8', '#F0A020', '#C0412A'],
          borderWidth: 0, hoverOffset: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '72%',
        plugins: { legend: { display: false }, tooltip: tooltipDefaults },
        onClick: (e, els) => {
          if (!els.length) return
          const p = planDist[els[0].index]
          setDetail({
            title: `Gói ${p.label}`,
            items: [{ lbl: 'Người dùng đang dùng', val: p.count }],
            action: { label: 'Xem danh sách người dùng →', path: '/admin/users' }
          })
        }
      }
    })

    chart3.current?.destroy()
    chart3.current = new Chart(c3.current, {
      type: 'line',
      data: {
        labels: weeklyStatus.map(w => w.label),
        datasets: [
          {
            label: 'Hoạt động',
            data: weeklyStatus.map(w => w.active),
            borderColor: '#2E6040',
            backgroundColor: 'rgba(46,96,64,.08)',
            tension: .4, fill: true,
            pointRadius: 5, pointHoverRadius: 7,
            pointBackgroundColor: '#2E6040',
            pointBorderColor: '#fff', pointBorderWidth: 2,
          },
          // Chỉ render dataset "Bị khóa" nếu có ít nhất 1 giá trị > 0
          ...(weeklyStatus.some(w => w.locked > 0) ? [{
            label: 'Bị khóa',
            data: weeklyStatus.map(w => w.locked),
            borderColor: '#C0412A',
            backgroundColor: 'rgba(192,65,42,.05)',
            tension: .4, fill: true,
            pointRadius: 5, pointHoverRadius: 7,
            pointBackgroundColor: '#C0412A',
            pointBorderColor: '#fff', pointBorderWidth: 2,
            borderDash: [5, 4],
          }] : []),
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { ...tooltipDefaults, mode: 'index', intersect: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: txtC, font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { color: gridC },
            ticks: { color: txtC, font: { size: 11 }, stepSize: 1, precision: 0 },
            border: { display: false },
            beginAtZero: true,
            grace: '15%',
          }
        },
        onClick: (e, els) => {
          if (!els.length) return
          const w = weeklyStatus[els[0].index]
          setDetail({
            title: w.label,
            items: [
              { lbl: 'Hoạt động', val: w.active },
              { lbl: 'Bị khóa', val: w.locked },
              { lbl: 'Tỷ lệ khóa', val: w.active + w.locked > 0 ? `${Math.round(w.locked / (w.active + w.locked) * 100)}%` : '0%' },
            ],
            action: w.locked > 0 ? { label: 'Xem tài khoản bị khóa →', path: '/admin/users' } : null
          })
        }
      }
    })
  }

  if (loading) return <div className="adm-db__loading">Đang tải...</div>
  if (error) return <div className="adm-db__error">⚠ {error}</div>

  const statCards = [
    { label: 'Tổng tài khoản', value: stats?.total, icon: '◉', color: '#342893', bg: '#ECEAF8', path: '/admin/users' },
    { label: 'Đang hoạt động', value: stats?.active, icon: '✓', color: '#2E6040', bg: '#E8F2EC', path: '/admin/users' },
    { label: 'Bị khóa', value: stats?.locked, icon: '⊘', color: '#C0412A', bg: '#FAEAE6', path: '/admin/users' },
    { label: 'Đang dùng gói trả phí', value: stats?.notFree, icon: '★', color: '#B07A10', bg: '#FBF3E0', path: '/admin/packages' },
  ]

  return (
    <div className="adm-db">
      <div className="adm-db__header">
        <h1 className="adm-db__title">Tổng quan hệ thống</h1>
        <p className="adm-db__sub">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
      </div>

      <div className="adm-db__stats">
        {statCards.map(card => (
          <button key={card.label} className="adm-db__stat-card"
            style={{ '--stat-color': card.color, '--stat-bg': card.bg }}
            onClick={() => navigate(card.path)}>
            <div className="adm-db__stat-icon">{card.icon}</div>
            <div className="adm-db__stat-body">
              <div className="adm-db__stat-label">{card.label}</div>
              <div className="adm-db__stat-value">{card.value?.toLocaleString?.() ?? '—'}</div>
            </div>
            <div className="adm-db__stat-arrow">→</div>
          </button>
        ))}
      </div>

      {detail && (
        <div className="adm-db__detail">
          <div className="adm-db__detail-head">
            <span>{detail.title}</span>
            <button onClick={() => setDetail(null)}>✕</button>
          </div>
          <div className="adm-db__detail-grid">
            {detail.items?.map((item, i) => (
              <div key={i} className="adm-db__detail-item">
                <div className="adm-db__detail-lbl">{item.lbl}</div>
                <div className="adm-db__detail-val">{item.val}</div>
              </div>
            ))}
          </div>
          {detail.action && (
            <button className="adm-db__detail-action" onClick={() => navigate(detail.action.path)}>
              {detail.action.label}
            </button>
          )}
        </div>
      )}

      <div className="adm-db__charts">
        <div className="adm-card">
          <div className="adm-card__head">
            <div>
              <span className="adm-card__title">Đăng ký theo tháng</span>
              <p className="adm-db__chart-hint">Nhấn vào cột để xem chi tiết</p>
            </div>
            <span className="adm-db__badge adm-db__badge--purple">6 tháng gần nhất</span>
          </div>
          <div className="adm-db__chart-wrap" style={{ height: 200 }}>
            <canvas ref={c1} />
          </div>
          <div className="adm-db__legend">
            <span className="adm-db__leg">
              <span className="adm-db__leg-dot" style={{ background: '#2E6040' }} />
              Người dùng mới · Tổng: <strong>{stats?.total ?? '—'}</strong>
            </span>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card__head">
            <div>
              <span className="adm-card__title">Phân bố gói dịch vụ</span>
              <p className="adm-db__chart-hint">Nhấn vào phần để xem chi tiết</p>
            </div>
            <span className="adm-db__badge adm-db__badge--green">Hiện tại</span>
          </div>
          <div className="adm-db__donut-wrap">
            <div className="adm-db__chart-wrap" style={{ height: 160 }}>
              <canvas ref={c2} />
            </div>
            <div className="adm-db__donut-legend">
              {planDist.map((p, i) => (
                <div key={p.label} className="adm-db__donut-item">
                  <span className="adm-db__leg-dot" style={{ background: ['#D3C9B8', '#F0A020', '#C0412A'][i] }} />
                  <span className="adm-db__donut-label">{p.label}</span>
                  <span className="adm-db__donut-count">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div className="adm-card__head">
          <div>
            <span className="adm-card__title">Trạng thái tài khoản theo tuần</span>
            <p className="adm-db__chart-hint">Nhấn vào điểm để xem chi tiết tuần</p>
          </div>
          <span className="adm-db__badge adm-db__badge--red">Live</span>
        </div>
        <div className="adm-db__chart-wrap" style={{ height: 180 }}>
          <canvas ref={c3} />
        </div>
        <div className="adm-db__legend">
          <span className="adm-db__leg">
            <span className="adm-db__leg-dot" style={{ background: '#2E6040' }} />
            Hoạt động · <strong>{stats?.active ?? '—'}</strong>
          </span>
          {stats?.locked > 0 && (
            <span className="adm-db__leg">
              <span className="adm-db__leg-dot" style={{ background: '#C0412A' }} />
              Bị khóa · <strong>{stats.locked}</strong>
            </span>
          )}
          {stats?.locked === 0 && (
            <span className="adm-db__leg" style={{ color: '#B8AC9F', fontStyle: 'italic' }}>
              Không có tài khoản bị khóa
            </span>
          )}
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card__head">
          <span className="adm-card__title">Người dùng mới đăng ký</span>
          <button className="adm-card__more-btn" onClick={() => navigate('/admin/users')}>
            Xem tất cả →
          </button>
        </div>
        <table className="adm-table">
          <thead>
            <tr><th>Họ tên</th><th>Email</th><th>Gói</th><th>Trạng thái</th><th>Ngày đăng ký</th></tr>
          </thead>
          <tbody>
            {recentUsers.map((u, i) => (
              <tr key={i}>
                <td>
                  <div className="adm-db__user-row">
                    <div className="adm-db__user-av">{u.name?.[0] ?? '?'}</div>
                    <span className="adm-table__name">{u.name}</span>
                  </div>
                </td>
                <td className="adm-table__muted">{u.email}</td>
                <td><span className={`adm-badge adm-badge--${u.plan.toLowerCase()}`}>{u.plan}</span></td>
                <td><span className={`adm-status adm-status--${u.status}`}>{u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span></td>
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
  )
}