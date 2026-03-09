import './ProfileScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import Badge from '../../common/Badge/Badge'

function ProfileScreen() {
  const aiInsights = [
    { icon: '👁', text: 'Bạn thường xem kỹ JD có "React", "TypeScript" và lương >25tr', source: 'Từ 47 lần xem' },
    { icon: '🔖', text: '80% tin bạn lưu là Hybrid hoặc Remote', source: 'Từ 23 lần lưu' },
    { icon: '⚡', text: 'Bạn apply trong 24h đầu khi lương >30tr', source: 'Từ 14 lần apply' },
    { icon: '🏢', text: 'Ưu tiên Fintech và E-commerce hơn 60%', source: 'Phân tích toàn lịch sử' }
  ]

  const preferences = [
    { key: 'Ngành ưu tiên', value: 'Fintech, E-commerce, SaaS' },
    { key: 'Quy mô công ty', value: '100 – 1,000 người' },
    { key: 'Ngôn ngữ làm việc', value: 'Việt / English' }
  ]

  const toggles = [
    { key: 'Thông báo việc mới', active: true },
    { key: 'Auto apply khi match >90%', active: false }
  ]

  const connectedAccounts = [
    { name: 'TopCV', code: 'T', color: '#00B14F', connected: true },
    { name: 'CareerLink', code: 'C', color: '#D0392A', connected: true },
    { name: 'CareerViet', code: 'CV', color: 'var(--bg3)', connected: false }
  ]

  return (
    <div id="s8" className="screen active">
      <div className="app-layout">
        <Sidebar activeItem="profile" />
        
        <div className="main-content">
          <Topbar title="👤 Hồ sơ & Cài đặt AI">
            <button className="btn btn-rust btn-sm">💾 Lưu</button>
          </Topbar>

          <div className="main-scroll">
            <div className="profile-wrap">
              <div className="profile-main">
                {/* Header Card */}
                <div className="card p-header">
                  <div className="p-avatar">
                    TN
                    <div className="p-status"></div>
                  </div>
                  <div className="p-info">
                    <div className="p-name">Trần Văn Ngọc</div>
                    <div className="p-role">Senior Frontend Developer • 4 năm KN</div>
                    <div className="p-tags">
                      <Badge variant="rust">💻 IT/Tech</Badge>
                      <Badge variant="sage">🏠 Open Remote</Badge>
                      <Badge variant="amber">⭐ Tìm việc gấp</Badge>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm">✏️ Sửa ảnh</button>
                </div>

                {/* Personal Info */}
                <div className="card profile-card">
                  <div className="profile-section-title">Thông tin cá nhân</div>
                  <div className="form-grid profile-grid">
                    <div className="form-group">
                      <div className="form-label">Họ và tên</div>
                      <input className="inp" defaultValue="Trần Văn Ngọc" />
                    </div>
                    <div className="form-group">
                      <div className="form-label">Ngày sinh</div>
                      <input className="inp" defaultValue="15/03/1995" />
                    </div>
                    <div className="form-group">
                      <div className="form-label">Giới tính</div>
                      <select className="inp">
                        <option selected>Nam</option>
                        <option>Nữ</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <div className="form-label">Địa chỉ</div>
                      <input className="inp" defaultValue="Bình Thạnh, TP.HCM" />
                    </div>
                    <div className="form-group">
                      <div className="form-label">Mức lương kỳ vọng</div>
                      <input className="inp" defaultValue="25 – 35 triệu/tháng" />
                    </div>
                    <div className="form-group">
                      <div className="form-label">Hình thức ưa thích</div>
                      <select className="inp">
                        <option selected>Hybrid (Ưu tiên)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Preferences */}
                <div className="card profile-card">
                  <div className="profile-section-title">Tùy chỉnh AI đề xuất</div>
                  {preferences.map((pref, idx) => (
                    <div key={idx} className="pref-row">
                      <span className="pref-k">{pref.key}</span>
                      <span className="pref-v">{pref.value}</span>
                    </div>
                  ))}
                  {toggles.map((toggle, idx) => (
                    <div key={idx} className="pref-row">
                      <span className="pref-k">{toggle.key}</span>
                      <div className="toggle-wrap">
                        <div className={`toggle ${toggle.active ? 'on' : 'off'}`}>
                          <div className="toggle-dot"></div>
                        </div>
                        <span className={`toggle-label ${toggle.active ? 'on' : 'off'}`}>
                          {toggle.active ? 'Bật' : 'Tắt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-right">
                {/* AI Insights */}
                <div className="card profile-card">
                  <div className="profile-section-title">🧠 AI đã học gì từ bạn</div>
                  {aiInsights.map((insight, idx) => (
                    <div key={idx} className="act-item">
                      <div className="act-icon">{insight.icon}</div>
                      <div className="act-content">
                        <div className="act-text">{insight.text}</div>
                        <div className="act-time">{insight.source}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connected Accounts */}
                <div className="card profile-card">
                  <div className="profile-section-title">🔗 Tài khoản kết nối</div>
                  <div className="account-list">
                    {connectedAccounts.map((acc, idx) => (
                      <div key={idx} className="account-row">
                        <div className="account-icon" style={{ 
                          background: acc.color, 
                          color: acc.connected ? '#FFF' : 'var(--ink3)',
                          border: acc.connected ? 'none' : '1px solid var(--border)'
                        }}>
                          {acc.code}
                        </div>
                        <div className="account-info">
                          <div className="account-name">{acc.name}</div>
                          <div className={`account-status ${acc.connected ? 'connected' : ''}`}>
                            {acc.connected ? '✓ Đã kết nối' : 'Chưa kết nối'}
                          </div>
                        </div>
                        <button className={`btn btn-${acc.connected ? 'outline' : 'rust'} btn-sm`}>
                          {acc.connected ? 'Ngắt' : '+ Kết nối'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileScreen