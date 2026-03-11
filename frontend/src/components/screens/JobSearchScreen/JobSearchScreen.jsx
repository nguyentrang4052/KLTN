import './JobSearchScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import JobCard from '../../common/JobCard/JobCard'
import Badge from '../../common/Badge/Badge'
import { jobData } from '../../../data/mockData'

function JobSearchScreen({onNavigate}) {
  const chips = [
    { label: '🤖 AI Đề xuất', active: true },
    { label: '💰 >20tr', active: true },
    { label: '🏠 Remote', active: false },
    { label: '📌 TopCV', active: true },
    { label: '📌 CareerLink', active: false },
    { label: '📌 CareerViet', active: false },
    { label: '⚡ Mới nhất', active: false },
    { label: '🎓 Không cần bằng', active: false }
  ]

  const filters = [
    {
      title: 'Mức lương (triệu/tháng)',
      type: 'range',
      min: 0,
      max: 50,
      value: 25
    },
    {
      title: 'Loại hình',
      options: [
        { label: 'Full-time', count: 1240, checked: true },
        { label: 'Remote / Hybrid', count: 456, checked: true },
        { label: 'Part-time', count: 234, checked: false },
        { label: 'Freelance', count: 87, checked: false }
      ]
    },
    {
      title: 'Kinh nghiệm',
      options: [
        { label: 'Dưới 1 năm', count: 320, checked: false },
        { label: '1–3 năm', count: 780, checked: true },
        { label: '3–5 năm', count: 540, checked: true },
        { label: 'Trên 5 năm', count: 210, checked: false }
      ]
    },
    {
      title: 'Nguồn tuyển dụng',
      options: [
        { label: 'TopCV', count: 890, checked: true },
        { label: 'CareerLink', count: 567, checked: true },
        { label: 'CareerViet', count: 423, checked: true },
        { label: 'VietnamWorks', count: 312, checked: false }
      ]
    }
  ]

  return (
    <div id="s3">
      <div className="app-layout">
        <Sidebar activeItem="search" onNavigate={onNavigate} />
        
        <div className="main-content">
          <div className="search-hero">
            <div className="search-title">Khám phá việc làm phù hợp</div>
            <div className="search-row">
              <div className="search-wrap">
                <span className="search-ico">🔍</span>
                <input className="inp" placeholder="Tên công việc, kỹ năng..." defaultValue="React Developer" />
              </div>
              <div className="search-wrap location">
                <span className="search-ico">📍</span>
                <input className="inp" placeholder="Địa điểm..." defaultValue="TP.HCM" />
              </div>
              <button className="btn btn-rust">Tìm kiếm</button>
            </div>
            <div className="chip-row">
              {chips.map((chip, idx) => (
                <span key={idx} className={`chip ${chip.active ? 'on' : ''}`}>{chip.label}</span>
              ))}
            </div>
          </div>

          <div className="search-layout">
            <div className="filter-col">
              {filters.map((filter, idx) => (
                <div key={idx} className="fg">
                  <div className="fg-title">{filter.title}</div>
                  {filter.type === 'range' ? (
                    <>
                      <input type="range" style={{ width: '100%', marginBottom: '5px' }} defaultValue={filter.value} />
                      <div className="range-labels">
                        <span>0</span>
                        <span>25tr</span>
                        <span>50tr+</span>
                      </div>
                    </>
                  ) : (
                    filter.options.map((opt, optIdx) => (
                      <div key={optIdx} className="ck-row">
                        <div className={`ck ${opt.checked ? 'on' : ''}`}>{opt.checked ? '✓' : ''}</div>
                        <span className="ck-label">{opt.label}</span>
                        <span className="ck-count">{opt.count}</span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>

            <div className="results-col">
              <div className="res-header">
                <div className="res-count">Tìm thấy <strong>247 việc</strong> phù hợp</div>
                <select className="inp sort-select">
                  <option>Phù hợp nhất</option>
                  <option>Mới nhất</option>
                  <option>Lương cao nhất</option>
                </select>
              </div>

              <div className="job-card-highlight">
                <div className="highlight-badge">⭐ AI đánh dấu đặc biệt — Rất phù hợp lịch sử bạn</div>
                <JobCard job={{ ...jobData[2], match: 91 }} />
              </div>

              {jobData.map(job => (
                <JobCard key={job.id} job={job} />
              ))}

              <div className="card jcard">
                <div className="jcard-top">
                  <div className="co-logo l-tiki">Ti</div>
                  <div className="jcard-info">
                    <div className="jcard-title">React Native Developer</div>
                    <div className="jcard-co">Tiki Corp • Remote 100%</div>
                    <div className="jcard-tags">
                      <span className="jtag">React Native</span>
                      <span className="jtag">iOS/Android</span>
                      <Badge variant="teal" className="platform-badge">VietnamWorks</Badge>
                    </div>
                  </div>
                  <div className="jcard-match">
                    <div className="match-n" style={{ color: 'var(--amber)' }}>82%</div>
                    <div className="match-l">phù hợp</div>
                  </div>
                </div>
                <div className="jcard-foot">
                  <span className="salary">22–32 triệu/tháng</span>
                  <div className="jcard-actions">
                    <button className="btn btn-outline btn-sm">🔖</button>
                    <button className="btn btn-rust btn-sm">⚡ Apply</button>
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

export default JobSearchScreen