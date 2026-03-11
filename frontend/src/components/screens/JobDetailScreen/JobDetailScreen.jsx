import './JobDetailScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Badge from '../../common/Badge/Badge'

function JobDetailScreen({onNavigate}) {
  const matchData = [
    { label: 'Kỹ năng kỹ thuật', value: 95, color: 'f-sage' },
    { label: 'Kinh nghiệm', value: 80, color: 'f-rust' },
    { label: 'Mức lương', value: 90, color: 'f-amber' },
    { label: 'Địa điểm', value: 70, color: 'f-teal' }
  ]

  const requirements = [
    'Tối thiểu 3 năm kinh nghiệm React.js, thành thạo Hooks, Context API',
    'Thành thạo TypeScript, Git, RESTful API, GraphQL',
    'Hiểu về performance optimization, lazy loading, code splitting',
    'Kinh nghiệm với Redux Toolkit hoặc Zustand',
    'Tiếng Anh đọc/viết tài liệu kỹ thuật tốt'
  ]

  const platforms = [
    { name: 'TopCV', code: 'T', color: '#00B14F', status: 'Sẵn sàng', ready: true },
    { name: 'CareerLink', code: 'C', color: '#D0392A', status: 'Sẵn sàng', ready: true },
    { name: 'VietnamWorks', code: 'V', color: '#1565C0', status: 'Kết nối TK', ready: false }
  ]

  return (
    <div id="s4">
      <div className="app-layout">
        <Sidebar activeItem="search" onNavigate={onNavigate}/>
        
        <div className="main-content">
          <div className="jd-wrap">
            <div className="jd-main">
              <div className="jd-head">
                <div className="jd-logo-big l-fpt">F</div>
                <h1 className="jd-title">Senior React Developer</h1>
                <div className="jd-co">
                  FPT Software
                  <Badge variant="sage">✓ Đã xác minh</Badge>
                  <Badge variant="indigo">1000+ nhân viên</Badge>
                </div>
                <div className="jd-meta-row">
                  <span className="jd-meta-pill">📍 Cầu Giấy, Hà Nội</span>
                  <span className="jd-meta-pill">🏠 Hybrid (3 ngày remote)</span>
                  <span className="jd-meta-pill">⏰ Full-time</span>
                  <span className="jd-meta-pill">📅 Hạn: 30/03/2026</span>
                  <span className="jd-meta-pill">👁 2,341 lượt xem</span>
                </div>
                <div className="jd-actions">
                  <button className="btn btn-rust btn-lg">⚡ Apply tự động</button>
                  <button className="btn btn-outline btn-lg">🔖 Lưu</button>
                  <button className="btn btn-outline btn-lg">↗ Chia sẻ</button>
                </div>
              </div>

              <div className="ai-box">
                <div className="ai-box-header">
                  <div className="ai-box-title">🤖 Phân tích AI — Mức độ phù hợp</div>
                </div>
                <div className="ai-box-content">
                  <div className="ai-ring">
                    <div className="ai-ring-in">
                      <div className="ai-ring-n">87%</div>
                      <div className="ai-ring-s">Match</div>
                    </div>
                  </div>
                  <div className="match-breakdown">
                    {matchData.map((item, idx) => (
                      <div key={idx} className="mbar-row">
                        <span className="mbar-label">{item.label}</span>
                        <div className="mbar-bg">
                          <div className={`mbar-fill ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                        <span className="mbar-pct">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="ai-tip">
                    💡 Thêm Docker vào CV để tăng 8% điểm phù hợp
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="jd-sec-title">Mô tả công việc</div>
              <ul className="jd-list">
                <li>Phát triển ứng dụng web phức tạp với React.js và TypeScript</li>
                <li>Tối ưu hóa hiệu suất, đảm bảo trải nghiệm người dùng tốt nhất</li>
                <li>Phối hợp với Backend và Designer xây dựng sản phẩm hoàn chỉnh</li>
                <li>Review code và mentoring Junior Developer trong team</li>
                <li>Tham gia lập kế hoạch sprint và ước tính task</li>
              </ul>

              <div className="divider"></div>

              <div className="jd-sec-title">Yêu cầu ứng viên</div>
              <ul className="jd-list">
                {requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="jd-side">
              <div className="apply-box">
                <div className="apply-salary">25 – 35 triệu/tháng</div>
                <div className="apply-dl">⏰ Hạn nộp: 30/03/2026 (còn 26 ngày)</div>
                <button className="btn btn-rust w100 btn-lg">⚡ Apply tự động (1-click)</button>
                <div className="auto-badge">🤖 Tự động nộp đến 3 nền tảng</div>
                
                <div className="platforms-list">
                  <div className="plat-list-title">SẼ NỘP ĐẾN:</div>
                  {platforms.map((plat, idx) => (
                    <div key={idx} className="plat-row-side">
                      <div className="plat-ic" style={{ background: plat.color, color: '#FFF' }}>{plat.code}</div>
                      <span className="plat-name">{plat.name}</span>
                      <span className={`plat-status ${plat.ready ? 'ready' : ''}`}>
                        {plat.ready ? '✓ ' : ''}{plat.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card company-card">
                <div className="company-title">Về công ty</div>
                <div className="company-desc">
                  FPT Software — công ty phần mềm hàng đầu VN, 30,000+ nhân viên, hiện diện 29 quốc gia.
                </div>
                <div className="company-badges">
                  <Badge variant="rust">🏆 Top 10 IT VN</Badge>
                  <Badge variant="teal">🌍 Toàn cầu</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailScreen