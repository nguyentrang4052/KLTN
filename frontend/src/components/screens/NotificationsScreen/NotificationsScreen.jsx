import './NotificationsScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import { useState, useEffect } from 'react'
import { getToken } from '../../../utils/auth'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api'

function NotificationsScreen({ onNavigate }) {
  const token = getToken()
  const navigate = useNavigate()

  const tabs = [
    { id: 'all', label: 'Tất cả', count: 0, active: true },
    { id: 'jobs', label: 'Việc mới', count: 0, active: false }
  ]

  const [notifications, setNotifications] = useState([])
  const [tick, setTick] = useState(0)

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

  useEffect(() => {
    if (!token) return

    const load = async () => {
      try {
        const res = await fetch(`${API}/jobs/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const data = await res.json()
        const jobs = Array.isArray(data?.data) ? data.data : []
        const now = new Date()
        const readMap = JSON.parse(localStorage.getItem('readNotifs') || '{}')

        // lọc job sắp hết hạn (<= 3 ngày)
        const filtered = jobs.filter(item => {
          if (!item.job?.deadline) return false
          const deadline = new Date(item.job.deadline)
          const diffDays = (deadline - now) / (1000 * 60 * 60 * 24)
          return diffDays > 0 && diffDays <= 3
        })

        const dynamicNotifs = filtered.map(item => {
          const job = item.job
          const deadline = new Date(job.deadline)

          // Kiểm tra và lấy createdAt đã lưu hoặc tạo mới
          // const key = `createdAt-deadline-${job.jobID}`
          // let createdAt = localStorage.getItem(key)
          // if (!createdAt) {
          //   // Giả định thời điểm thông báo tạo = deadline - 3 ngày
          //   const createdDate = new Date(deadline.getTime() - 3 * 24 * 60 * 60 * 1000)
          //   createdAt = createdDate.toISOString()
          //   localStorage.setItem(key, createdAt)
          // }

          const savedAt = new Date(item.savedAt)

          return {
            id: `deadline-${job.jobID}`,
            icon: '⏰',
            bg: '#FDE8E4',
            title: 'Việc làm đã lưu sắp hết hạn',
            createdAt: savedAt.toISOString(),
            unread: !readMap[`deadline-${job.jobID}`],
            jobInfo: {
              jobID: job.jobID,
              title: job.title,
              // Tính giờ còn lại như bạn làm
              hoursLeft: Math.max(0, Math.floor((deadline - new Date()) / (1000 * 60 * 60))),
            }
          }
        })



        setNotifications(dynamicNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

      } catch (err) {
        console.error(err)
      }
    }

    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [token])

  const handleClickNotif = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )
    const map = JSON.parse(localStorage.getItem('readNotifs') || '{}')
    map[id] = true
    localStorage.setItem('readNotifs', JSON.stringify(map))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div id="s9">
      <div className="app-layout">
        <Sidebar
          activeItem="notifications"
          badgeCounts={{ notifications: unreadCount }}
          onNavigate={onNavigate}
        />

        <div className="main-content">
          <Topbar title="🔔 Thông báo">
            <button className="btn btn-outline btn-sm">Đọc tất cả</button>
          </Topbar>

          <div className="notif-wrap">
            <div className="notif-tabs">
              {tabs.map(tab => (
                <div key={tab.id} className={`ntab ${tab.active ? 'on' : ''}`}>
                  {tab.label} ({notifications.length})
                </div>
              ))}
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                Không có thông báo nào
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.unread ? 'unread' : ''}`}
                  onClick={() => handleClickNotif(notif.id)}
                >
                  <div className="n-ico" style={{ background: notif.bg }}>
                    {notif.icon}
                  </div>

                  <div className="n-content">
                    <div className="n-title">{notif.title}</div>

                    {notif.jobInfo && (
                      <div className="job-table">
                        <div
                          className="job-row"
                          onClick={() => navigate(`/home/job/${notif.jobInfo.jobID}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="job-left clickable-title">{notif.jobInfo.title}</div>
                        </div>
                      </div>
                    )}

                    <div className="n-time">{formatTimeAgo(notif.createdAt)}</div>
                  </div>

                  {notif.unread && <div className="n-unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsScreen