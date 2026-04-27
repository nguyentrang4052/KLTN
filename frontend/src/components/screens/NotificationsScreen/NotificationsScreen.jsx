import './NotificationsScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const TYPE_META = {
  job_alert: { icon: '💼', cls: 'n-ico-job_alert' },
  job_deadline: { icon: '⏰', cls: 'n-ico-job_deadline' },
  subscription_expiry: { icon: '⚠️', cls: 'n-ico-subscription_expiry' },
  // payment_success: { icon: '✅', cls: 'n-ico-payment_success' },
}

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'job_alert', label: '💼 Việc mới' },
  { id: 'job_deadline', label: '⏰ Sắp hết hạn' },
  { id: 'subscription_expiry', label: '⚠️ Gói dịch vụ' },
  // { id: 'payment_success', label: '✅ Thanh toán' },
]

const PAGE_SIZE = 10

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const groupByDate = (notifications) => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const groups = {}
  notifications.forEach(n => {
    const d = new Date(n.createdAt); d.setHours(0, 0, 0, 0)
    let label
    if (d.getTime() === today.getTime()) label = 'Hôm nay'
    else if (d.getTime() === yesterday.getTime()) label = 'Hôm qua'
    else label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  })
  return groups
}

function NotificationsScreen({ notifContext }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteOne } = notifContext
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (activeTab === 'all') return notifications
    return notifications.filter(n => n.type === activeTab)
  }, [notifications, activeTab])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const groups = groupByDate(paginated)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
  }

  const unreadByType = useMemo(() => {
    const map = {}
    notifications.forEach(n => {
      if (!n.isRead) map[n.type] = (map[n.type] ?? 0) + 1
    })
    return map
  }, [notifications])

  return (
    <div id="s9">
      <div className="app-layout">
        <Sidebar
          activeItem="notifications"
          badgeCounts={{ notifications: unreadCount }}
          onNavigate={(path) => navigate(path)}
        />

        <div className="main-content">
          <Topbar title="🔔 Thông báo">
            {unreadCount > 0 && (
              <button className="notif-readall-btn" onClick={markAllAsRead}>
                Đọc tất cả ({unreadCount})
              </button>
            )}
          </Topbar>

          <div className="notif-wrap">

            <div className="notif-tabs">
              {TABS.map(tab => {
                const badge = tab.id === 'all' ? unreadCount : (unreadByType[tab.id] ?? 0)
                return (
                  <button
                    key={tab.id}
                    className={`ntab${activeTab === tab.id ? ' on' : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.label}
                    {badge > 0 && (
                      <span className="ntab-badge">{badge}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {filtered.length > 0 && (
              <div className="notif-result-meta">
                {filtered.length} thông báo
                {activeTab !== 'all' && (
                  <button className="notif-clear-filter" onClick={() => handleTabChange('all')}>
                    ✕ Bỏ lọc
                  </button>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="notif-empty">
                <div className="notif-empty-icon">🔔</div>
                <div className="notif-empty-title">
                  {activeTab === 'all' ? 'Chưa có thông báo nào' : 'Không có thông báo loại này'}
                </div>
                <div className="notif-empty-sub">
                  {activeTab === 'all'
                    ? 'Các thông báo về việc làm và gói dịch vụ sẽ xuất hiện ở đây'
                    : 'Thử xem tất cả thông báo hoặc chờ cập nhật mới'}
                </div>
                {activeTab !== 'all' && (
                  <button className="notif-readall-btn" style={{ marginTop: 16 }} onClick={() => handleTabChange('all')}>
                    Xem tất cả
                  </button>
                )}
              </div>
            ) : (
              <>
                {Object.entries(groups).map(([dateLabel, items]) => (
                  <div key={dateLabel}>
                    <div className="notif-date-label">{dateLabel}</div>
                    {items.map((notif) => {
                      const meta = TYPE_META[notif.type] ?? { icon: '🔔', cls: '' }
                      return (
                        <div
                          key={notif.id}
                          className={`notif-item${!notif.isRead ? ' unread' : ''}`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className={`n-ico ${meta.cls}`}>{meta.icon}</div>

                          <div className="n-content">
                            <div className="n-title">{notif.title}</div>
                            <div className="n-body">{notif.body}</div>

                            {notif.type === 'job_alert' && notif.metadata?.keyword && (
                              <div className="n-link" onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/jobs?keyword=${encodeURIComponent(notif.metadata.keyword)}`)
                              }}>
                                Tìm việc "{notif.metadata.keyword}" →
                              </div>
                            )}
                            {notif.type === 'job_deadline' && notif.metadata?.jobIDs?.length > 0 && (
                              <div className="n-link" onClick={(e) => { e.stopPropagation(); navigate('/saved-jobs') }}>
                                Xem việc làm đã lưu →
                              </div>
                            )}
                            {notif.type === 'subscription_expiry' && (
                              <div className="n-link" onClick={(e) => { e.stopPropagation(); navigate('/services') }}>
                                Xem gói dịch vụ →
                              </div>
                            )}

                            <div className="n-time">{formatTimeAgo(notif.createdAt)}</div>
                          </div>

                          <div className="n-actions">
                            {!notif.isRead && <div className="n-unread-dot" />}
                            <button
                              className="n-delete-btn"
                              onClick={(e) => { e.stopPropagation(); deleteOne(notif.id) }}
                              title="Xoá thông báo"
                            >✕</button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="notif-pagination">
                    <button
                      className="npag-btn"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >← Trước</button>

                    <div className="npag-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                          acc.push(p)
                          return acc
                        }, [])
                        .map((p, idx) =>
                          p === '...'
                            ? <span key={`ellipsis-${idx}`} className="npag-ellipsis">…</span>
                            : <button
                              key={p}
                              className={`npag-num${p === page ? ' active' : ''}`}
                              onClick={() => setPage(p)}
                            >{p}</button>
                        )
                      }
                    </div>

                    <button
                      className="npag-btn"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >Sau →</button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="notif-page-summary">
                    Trang {page}/{totalPages} · {filtered.length} thông báo
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsScreen