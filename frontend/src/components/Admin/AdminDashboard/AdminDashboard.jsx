import './AdminDashboard.css'

const STATS = [
  { label: 'Tổng người dùng',    value: '12,481', delta: '+234 tuần này',  color: '#E8C97A', ico: '◉' },
  { label: 'Tài khoản hoạt động',value: '9,302',  delta: '74.5% tổng số', color: '#4E8E62', ico: '◈' },
  { label: 'Tài khoản bị khóa',  value: '38',     delta: '+3 hôm nay',    color: '#C0412A', ico: '◎' },
  { label: 'Gói dịch vụ Pro',    value: '1,204',  delta: '+18 tuần này',  color: '#7B9FD4', ico: '◪' },
]

const RECENT_USERS = [
  { name: 'Nguyễn Văn A',  email: 'vana@gmail.com',     plan: 'Free', status: 'active',   joined: '18/03/2026' },
  { name: 'Trần Thị B',    email: 'thib@yahoo.com',     plan: 'Pro',  status: 'active',   joined: '17/03/2026' },
  { name: 'Lê Hoàng C',    email: 'hoangc@outlook.com', plan: 'Free', status: 'inactive', joined: '16/03/2026' },
  { name: 'Phạm Minh D',   email: 'minhd@gmail.com',    plan: 'Pro',  status: 'active',   joined: '15/03/2026' },
  { name: 'Đỗ Quốc E',     email: 'quoce@gmail.com',    plan: 'Free', status: 'locked',   joined: '14/03/2026' },
]

const ACTIVITY = [
  { time: '09:41',   text: 'Tài khoản quoce@gmail.com bị vô hiệu hóa',   type: 'warn' },
  { time: '08:22',   text: 'Thêm kỹ năng mới: "Prompt Engineering"',      type: 'info' },
  { time: '07:55',   text: 'Gói Pro được mua bởi thib@yahoo.com',         type: 'ok'   },
  { time: '01:30',   text: 'Cập nhật giới hạn gói Free: 5 đề xuất/ngày', type: 'info' },
  { time: 'Hôm qua', text: 'Thêm lĩnh vực mới: "Trí tuệ nhân tạo"',      type: 'info' },
]

export default function AdminDashboard() {
  return (
    <div className="adm-db">
      <div className="adm-db__header">
        <div>
          <h1 className="adm-db__title">Tổng quan hệ thống</h1>
          <p className="adm-db__sub">Cập nhật lần cuối: 18/03/2026 — 09:45</p>
        </div>
      </div>

      <div className="adm-db__stats">
        {STATS.map((s, i) => (
          <div className="adm-stat" key={i}>
            <div className="adm-stat__ico" style={{ color: s.color }}>{s.ico}</div>
            <div className="adm-stat__val" style={{ color: s.color }}>{s.value}</div>
            <div className="adm-stat__label">{s.label}</div>
            <div className="adm-stat__delta">{s.delta}</div>
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
              {RECENT_USERS.map((u, i) => (
                <tr key={i}>
                  <td className="adm-table__name">{u.name}</td>
                  <td className="adm-table__muted">{u.email}</td>
                  <td><span className={`adm-badge adm-badge--${u.plan.toLowerCase()}`}>{u.plan}</span></td>
                  <td>
                    <span className={`adm-status adm-status--${u.status}`}>
                      {u.status === 'active' ? 'Hoạt động' : u.status === 'inactive' ? 'Không hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="adm-table__muted">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="adm-card">
          <div className="adm-card__head">
            <span className="adm-card__title">Nhật ký hoạt động</span>
          </div>
          <div className="adm-log">
            {ACTIVITY.map((a, i) => (
              <div className="adm-log__item" key={i}>
                <span className={`adm-log__dot adm-log__dot--${a.type}`} />
                <div className="adm-log__body">
                  <span className="adm-log__text">{a.text}</span>
                  <span className="adm-log__time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}