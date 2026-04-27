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
    const gridC = 'rgba(0,0,0,.06)', txtC = 'rgba(0,0,0,.45)'

    chart1.current?.destroy()
    chart1.current = new Chart(c1.current, {
      type: 'bar',
      data: {
        labels: monthlyReg.map(m => m.label),
        datasets: [{
          label: 'Người dùng mới',
          data: monthlyReg.map(m => m.count),
          backgroundColor: monthlyReg.map(() => 'rgba(52,40,147,.65)'),
          hoverBackgroundColor: monthlyReg.map(() => 'rgba(52,40,147,.9)'),
          borderRadius: 4, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
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

    const pieColors = ['#CBC1AE', 'rgba(240,160,32,.7)', 'rgba(192,65,42,.7)']
    chart2.current?.destroy()
    chart2.current = new Chart(c2.current, {
      type: 'doughnut',
      data: {
        labels: planDist.map(p => p.label),
        datasets: [{ data: planDist.map(p => p.count), backgroundColor: pieColors, borderWidth: 2, hoverOffset: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '60%',
        plugins: { legend: { display: false } },
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
          { label: 'Hoạt động', data: weeklyStatus.map(w => w.active), borderColor: '#4E8E62', backgroundColor: 'rgba(78,142,98,.1)', tension: .4, fill: true, pointRadius: 5, pointHoverRadius: 8, pointBackgroundColor: '#4E8E62' },
          { label: 'Bị khóa', data: weeklyStatus.map(w => w.locked), borderColor: '#C0412A', backgroundColor: 'rgba(192,65,42,.08)', tension: .4, fill: true, pointRadius: 5, pointHoverRadius: 8, pointBackgroundColor: '#C0412A', borderDash: [4, 4] },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: txtC, font: { size: 11 } }, border: { display: false } },
          y: { grid: { color: gridC }, ticks: { color: txtC, font: { size: 11 }, stepSize: 1 }, border: { display: false }, beginAtZero: true }
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
            action: w.locked > 0
              ? { label: 'Xem tài khoản bị khóa →', path: '/admin/users' }
              : null
          })
        }
      }
    })
  }

  if (loading) return <div className="adm-db__loading">Đang tải...</div>
  if (error) return <div className="adm-db__error">⚠ {error}</div>

  return (
    <div className="adm-db">
      <div className="adm-db__header">
        <h1 className="adm-db__title">Tổng quan hệ thống</h1>
        <p className="adm-db__sub">Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}</p>
      </div>

      {/* Detail panel — chỉ hiện khi click biểu đồ */}
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

      {/* Charts */}
      <div className="adm-db__charts">
        <div className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__title">Người dùng đăng ký theo tháng</span>
            <span className="adm-db__badge adm-db__badge--purple">6 tháng gần nhất</span>
          </div>
          <div className="adm-db__chart-body">
            <p className="adm-db__chart-hint">Nhấn vào cột để xem chi tiết</p>
            <div className="adm-db__chart-wrap" style={{ height: 220 }}>
              <canvas ref={c1} />
            </div>
          </div>
          <div className="adm-db__legend">
            <span className="adm-db__leg"><span className="adm-db__leg-dot" style={{ background: '#342893' }} />Người dùng mới · Tổng: {stats?.total ?? '—'}</span>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__title">Phân bố theo gói dịch vụ</span>
            <span className="adm-db__badge adm-db__badge--green">Hiện tại</span>
          </div>
          <div className="adm-db__chart-body">
            <p className="adm-db__chart-hint">Nhấn vào phần để xem chi tiết</p>
            <div className="adm-db__chart-wrap" style={{ height: 220 }}>
              <canvas ref={c2} />
            </div>
          </div>
          <div className="adm-db__legend">
            {planDist.map((p, i) => (
              <span key={p.label} className="adm-db__leg">
                <span className="adm-db__leg-dot" style={{ background: ['#CBC1AE', 'rgba(240,160,32,.7)', 'rgba(192,65,42,.7)'][i] }} />
                {p.label} ({p.count})
              </span>
            ))}
          </div>
        </div>

        <div className="adm-card adm-db__full">
          <div className="adm-card__head">
            <span className="adm-card__title">Trạng thái tài khoản theo tuần (4 tuần gần nhất)</span>
            <span className="adm-db__badge adm-db__badge--red">Live</span>
          </div>
          <div className="adm-db__chart-body">
            <p className="adm-db__chart-hint">Nhấn vào điểm để xem chi tiết tuần</p>
            <div className="adm-db__chart-wrap" style={{ height: 180 }}>
              <canvas ref={c3} />
            </div>
          </div>
          <div className="adm-db__legend">
            <span className="adm-db__leg"><span className="adm-db__leg-dot" style={{ background: '#4E8E62' }} />Hoạt động · {stats?.active ?? '—'}</span>
            <span className="adm-db__leg"><span className="adm-db__leg-dot" style={{ background: '#C0412A' }} />Bị khóa · {stats?.locked ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* Recent users */}
      <div className="adm-card">
        <div className="adm-card__head">
          <span className="adm-card__title">Người dùng mới đăng ký</span>
          <a className="adm-card__more" onClick={() => navigate('/admin/users')}>Xem tất cả →</a>
        </div>
        <table className="adm-table">
          <thead>
            <tr><th>Họ tên</th><th>Email</th><th>Gói</th><th>Trạng thái</th><th>Ngày đăng ký</th></tr>
          </thead>
          <tbody>
            {recentUsers.map((u, i) => (
              <tr key={i}>
                <td className="adm-table__name">{u.name}</td>
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