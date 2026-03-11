import './DashboardScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import JobCard from '../../common/JobCard/JobCard'
import Badge from '../../common/Badge/Badge'
import Button from '../../common/Button/Button'
import { jobData } from '../../../data/mockData'

function DashboardScreen({onNavigate}) {
  const metrics = [
    { label: 'Việc phù hợp hôm nay', value: 247, color: 'var(--rust)', trend: '↑ +38', trendLabel: 'so với hôm qua' },
    { label: 'Đã nộp tháng này', value: 14, color: 'var(--sage)', trend: '3', trendLabel: 'chờ phản hồi' },
    { label: 'Tỷ lệ phản hồi', value: '64%', color: 'var(--amber)', trend: '↑ 20%', trendLabel: 'hơn trung bình' },
    { label: 'Phỏng vấn sắp tới', value: 2, color: 'var(--teal)', trend: 'Tiki: 14:00 ngày mai', trendLabel: '' }
  ]

  return (
    <div id="s2">
      <div className="app-layout">
        <Sidebar activeItem="dashboard" badgeCounts={{ search: 247, notifications: 5 }} onNavigate={onNavigate}/>
        
        <div className="main-content">
          <Topbar title="Tổng quan hôm nay">
            <Button className="btn btn-rust btn-sm" onClick={() => onNavigate?.('s6')}>+ Tạo CV </Button>
          </Topbar>

          <div className="main-scroll">
            <div className="dash-grid">
              {metrics.map((m, idx) => (
                <div key={idx} className="card metric">
                  <div className="m-label">{m.label}</div>
                  <div className="m-val" style={{ color: m.color }}>{m.value}</div>
                  <div className="m-sub">
                    <span className={m.trend.includes('↑') ? 'trend-up' : m.trend.includes('↓') ? 'trend-dn' : ''}>{m.trend}</span>
                    {' '}{m.trendLabel}
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-body">
              <div className="jobs-section">
                <div className="section-head">
                  <div className="section-title">🤖 AI đề xuất hôm nay</div>
                  <div className="ai-pill">
                    <div className="ai-dot"></div>
                    Cập nhật 2 phút trước
                  </div>
                </div>
                
                {jobData.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              <div className="rpanel">
                <div className="card rcard">
                  <div className="rcard-title">
                    🧠 AI Insights <span style={{ fontSize: '11px', color: 'var(--ink4)', fontWeight: 400 }}>hôm nay</span>
                  </div>
                  <div className="ai-insight-item">
                    <div className="ai-item-label">💡 Hành vi của bạn</div>
                    <div className="ai-item-text">Bạn thường click vào React + TypeScript lương 25tr. AI đã ưu tiên 40+ việc tương tự.</div>
                  </div>
                  <div className="ai-insight-item">
                    <div className="ai-item-label">📈 Xu hướng tuần này</div>
                    <div className="ai-item-text">AWS đang được tuyển nhiều. Thêm vào CV để tăng 15% match score.</div>
                  </div>
                  <div className="ai-insight-item">
                    <div className="ai-item-label">⏰ Sắp hết hạn</div>
                    <div className="ai-item-text">3 tin phù hợp hết hạn trong 24h. Nộp ngay!</div>
                  </div>
                </div>

                <div className="card rcard">
                  <div className="rcard-title">
                    Hồ sơ của bạn <span style={{ fontSize: '12px', color: 'var(--ink4)', fontWeight: 400 }}>78%</span>
                  </div>
                  <div className="prog-wrap">
                    <div className="prog-bg">
                      <div className="prog-fill" style={{ width: '78%' }}></div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink4)', marginTop: '5px' }}>Hoàn thiện để tăng cơ hội được tuyển</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink3)', marginBottom: '7px', fontWeight: 600 }}>Kỹ năng bạn có</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    <Badge variant="sage">React</Badge>
                    <Badge variant="sage">Node.js</Badge>
                    <Badge variant="sage">SQL</Badge>
                    <Badge variant="gray">+ AWS</Badge>
                    <Badge variant="gray">+ Docker</Badge>
                  </div>
                </div>

                <div className="card rcard">
                  <div className="rcard-title">Nguồn dữ liệu</div>
                  <div className="platform-list">
                    <div className="plat-row">
                      <div className="platform-tag pt-top" style={{ width: '28px', height: '28px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>T</div>
                      <span style={{ fontSize: '13px', flex: 1 }}>TopCV</span>
                      <span style={{ fontSize: '12px', color: 'var(--sage)', fontWeight: 600 }}>● Sync</span>
                    </div>
                    <div className="plat-row">
                      <div className="platform-tag pt-car" style={{ width: '28px', height: '28px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>C</div>
                      <span style={{ fontSize: '13px', flex: 1 }}>CareerLink</span>
                      <span style={{ fontSize: '12px', color: 'var(--sage)', fontWeight: 600 }}>● Sync</span>
                    </div>
                    <div className="plat-row">
                      <div className="platform-tag pt-viet" style={{ width: '28px', height: '28px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>V</div>
                      <span style={{ fontSize: '13px', flex: 1 }}>VietnamWorks</span>
                      <span style={{ fontSize: '12px', color: 'var(--sage)', fontWeight: 600 }}>● Sync</span>
                    </div>
                    <div className="plat-row">
                      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#FFF' }}>in</div>
                      <span style={{ fontSize: '13px', flex: 1 }}>LinkedIn</span>
                      <span style={{ fontSize: '12px', color: 'var(--ink4)' }}>+ Kết nối</span>
                    </div>
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

export default DashboardScreen