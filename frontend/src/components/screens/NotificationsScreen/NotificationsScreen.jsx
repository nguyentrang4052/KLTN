import './NotificationsScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../..//layout/Topbar/Topbar'

function NotificationsScreen() {
  const tabs = [
    { id: 'all', label: 'Tất cả', count: 12, active: true },
    { id: 'jobs', label: 'Việc mới', count: 5, active: false },
    { id: 'applications', label: 'Ứng tuyển', count: 4, active: false },
    { id: 'system', label: 'Hệ thống', count: 3, active: false }
  ]

  const notifications = [
    {
      id: 1,
      icon: '🎉',
      bg: '#E0F0E6',
      title: 'VNPay đã gửi Offer Letter!',
      desc: 'Chúc mừng! VNPay offer vị trí Frontend Tech Lead, mức 45-55tr/tháng. Hạn phản hồi 10/03/2026.',
      time: '5 phút trước',
      unread: true
    },
    {
      id: 2,
      icon: '📅',
      bg: '#FEF0D0',
      title: 'Nhắc phỏng vấn — Tiki Corporation',
      desc: 'Lịch phỏng vấn lúc 14:00 ngày mai (06/03). AI đã chuẩn bị danh sách câu hỏi thường gặp.',
      time: '1 giờ trước',
      unread: true
    },
    {
      id: 3,
      icon: '⚡',
      bg: '#FDE8E4',
      title: 'Auto Apply thành công — CareerLink',
      desc: 'Đã tự động nộp CV vào "Frontend Lead" tại Shopee trên CareerLink. Mã: #CL20260302.',
      time: '3 giờ trước',
      unread: true
    },
    {
      id: 4,
      icon: '🤖',
      bg: '#E4E5F8',
      title: 'AI tìm thấy 12 việc mới phù hợp',
      desc: 'Dựa trên hành vi hôm nay, AI tìm 12 tin React Developer mới, trong đó 3 tin có match >90%.',
      time: '5 giờ trước',
      unread: true
    },
    {
      id: 5,
      icon: '⏰',
      bg: '#FDE8E4',
      title: 'Sắp hết hạn — 3 tin tuyển dụng',
      desc: 'Grab (còn 6h), Sea Group (còn 18h), Lazada (còn 23h) — nộp ngay!',
      time: '8 giờ trước',
      unread: true
    },
    {
      id: 6,
      icon: '📊',
      bg: 'var(--bg2)',
      title: 'Báo cáo tuần — Hoạt động tìm việc',
      desc: 'Xem 47 tin, lưu 8 tin, apply 3 tin. Tỷ lệ phản hồi 66% — cao hơn TB 21%.',
      time: '1 ngày trước',
      unread: false
    },
    {
      id: 7,
      icon: '✅',
      bg: '#E0F0E6',
      title: 'Zalo xem CV của bạn 3 lần',
      desc: 'Nhà tuyển dụng Zalo đã xem CV 3 lần trong 2 ngày qua — tín hiệu tích cực!',
      time: '2 ngày trước',
      unread: false
    }
  ]

  return (
    <div id="s9" className="screen active">
      <div className="app-layout">
        <Sidebar activeItem="notifications" badgeCounts={{ notifications: 5 }} />
        
        <div className="main-content">
          <Topbar title="🔔 Thông báo">
            <button className="btn btn-outline btn-sm">Đọc tất cả</button>
          </Topbar>

          <div className="notif-wrap">
            <div className="notif-tabs">
              {tabs.map(tab => (
                <div key={tab.id} className={`ntab ${tab.active ? 'on' : ''}`}>
                  {tab.label} ({tab.count})
                </div>
              ))}
            </div>

            {notifications.map(notif => (
              <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                <div className="n-ico" style={{ background: notif.bg }}>{notif.icon}</div>
                <div className="n-content">
                  <div className="n-title">{notif.title}</div>
                  <div className="n-desc">{notif.desc}</div>
                  <div className="n-time">{notif.time}</div>
                </div>
                {notif.unread && <div className="n-unread-dot"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsScreen