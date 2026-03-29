import { useState } from 'react'
import './HomeScreen.css'
import JobCard from '../../common/JobCard/JobCard'
import { jobData } from '../../../data/mockData'
import { useNavigate } from "react-router-dom"

const QUICK_TAGS = [
  '⚛️ React', '🏠 Remote', '📈 Senior', '🌱 Fresher', '🤖 AI/ML', '💰 Lương cao',
]

const TOTAL_PAGES = 24

const CATEGORIES = [
  { icon: '💻', label: 'IT / Phần mềm',      count: '15,240', color: '#1565C0', bg: '#E3EEF9', trend: '+12%' },
  { icon: '📣', label: 'Marketing',           count: '6,480',  color: '#C0412A', bg: '#FDE8E4', trend: '+8%'  },
  { icon: '💰', label: 'Tài chính / Kế toán', count: '4,820',  color: '#2E6040', bg: '#E0F0E6', trend: '+5%'  },
  { icon: '🤝', label: 'Kinh doanh / Sales',  count: '7,610',  color: '#D4820A', bg: '#FEF0D0', trend: '+18%' },
  { icon: '🎨', label: 'Thiết kế / UI/UX',    count: '3,190',  color: '#880E4F', bg: '#FDE8F3', trend: '+14%' },
  { icon: '🏗️', label: 'Xây dựng / Kỹ thuật', count: '5,340',  color: '#1A3A6A', bg: '#E3EEF9', trend: '+3%'  },
  { icon: '🏥', label: 'Y tế / Dược',         count: '2,870',  color: '#1B5E20', bg: '#E8F5E9', trend: '+9%'  },
  { icon: '📚', label: 'Giáo dục / Đào tạo',  count: '3,450',  color: '#4A148C', bg: '#EDE7F6', trend: '+6%'  },
  { icon: '🚚', label: 'Logistics / Vận tải', count: '4,120',  color: '#BF360C', bg: '#FBE9E7', trend: '+22%' },
  { icon: '🍜', label: 'Nhà hàng / Khách sạn',count: '5,890',  color: '#006064', bg: '#E0F7FA', trend: '+11%' },
  { icon: '🏠', label: 'Bất động sản',        count: '2,640',  color: '#37474F', bg: '#ECEFF1', trend: '+4%'  },
  { icon: '🤖', label: 'AI / Data Science',   count: '1,830',  color: '#C0412A', bg: '#FDE8E4', trend: '+41%' },
]

function HomeScreen({ onNavigate }) {
  const [activeTag, setActiveTag]   = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const navigate = useNavigate()

  return (
    <div className="hs-page">

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <div className="hs-hero">
        <div className="hs-hero-noise" />
        <div className="hs-hero-glow1" />
        <div className="hs-hero-glow2" />

        <div className="hs-hero-inner">

          {/* Left */}
          <div className="hs-hero-left">
            {/* <div className="hs-hero-pill">
              <span className="hs-hero-pill-dot" />
              50,847 việc làm mới hôm nay
            </div> */}

            <h1 className="hs-hero-title">
              Khám phá <em>cơ hội</em><br />dành riêng cho bạn
            </h1>

            <p className="hs-hero-sub">
              AI tổng hợp từ TopCV, CareerLink, CareerViet, VietnamWorks. 
            </p>

            <div className="hs-hero-search">
              <div className="hs-sf">
                <span className="hs-sf-ico">🔍</span>
                <input className="hs-sf-inp" placeholder="Tên công việc, kỹ năng..." defaultValue="React Developer" />
              </div>
              <div className="hs-sf hs-sf-loc">
                <span className="hs-sf-ico">📍</span>
                <input className="hs-sf-inp" placeholder="Địa điểm..." defaultValue="TP.HCM" />
              </div>
              <button className="hs-search-btn">Tìm kiếm</button>
            </div>
          </div>

          <div className="hs-hero-right">
            <div className="hs-stat hs-stat-accent">
              <div className="hs-stat-ico">🎯</div>
              <div className="hs-stat-n">247</div>
              <div className="hs-stat-l">Việc phù hợp hôm nay</div>
              <div className="hs-stat-s">↑ 38 so với hôm qua</div>
            </div>
            <div className="hs-stat">
              <div className="hs-stat-ico">📨</div>
              <div className="hs-stat-n" style={{color:'#2E6040'}}>14</div>
              <div className="hs-stat-l">Đã nộp tháng này</div>
              <div className="hs-stat-s">3 chờ phản hồi</div>
            </div>
            {/* <div className="hs-stat">
              <div className="hs-stat-ico">📊</div>
              <div className="hs-stat-n" style={{color:'#D4820A'}}>64%</div>
              <div className="hs-stat-l">Tỷ lệ phản hồi</div>
              <div className="hs-stat-s">↑ 20% hơn trung bình</div>
            </div>
            <div className="hs-stat">
              <div className="hs-stat-ico">🗓️</div>
              <div className="hs-stat-n">2</div>
              <div className="hs-stat-l">Phỏng vấn sắp tới</div>
              <div className="hs-stat-s">Tiki: 14:00 ngày mai</div>
            </div> */}
          </div>
        </div>
      </div>

      {/* ══ AI STRIP ════════════════════════════════════════════ */}
      {/* <div className="hs-ai-strip">
        <div className="hs-ai-strip-inner">
          <span className="hs-ai-ico">🤖</span>
          <span className="hs-ai-text">
            <strong>AI nhận thấy:</strong> Bạn thường click React + TypeScript · lương 25tr+.
            <span className="hs-ai-hl"> AWS đang được tuyển nhiều — thêm vào CV để tăng 15% match.</span>
          </span>
          <button className="hs-ai-cta">Cập nhật CV →</button>
          <span className="hs-ai-time">Cập nhật 2 phút trước</span>
        </div>
      </div> */}

      {/* ══ MAIN CONTENT ════════════════════════════════════════ */}
      <div className="hs-body">
         <div className="hs-cats-wrap">
        <div className="hs-cats-inner">

          <div className="hs-cats-header">
            <div className="hs-cats-titles">
              <div className="hs-cats-label">Danh mục nghề nghiệp</div>
              <h2 className="hs-cats-title">Khám phá theo <em>lĩnh vực</em></h2>
            </div>
            <button className="hs-cats-see-all">Xem tất cả ngành nghề →</button>
          </div>

          <div className="hs-cats-grid">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="hs-cat-card" style={{'--cat-color': cat.color, '--cat-bg': cat.bg}}>
                <div className="hs-cat-icon-wrap">
                  <span className="hs-cat-icon">{cat.icon}</span>
                </div>
                <div className="hs-cat-body">
                  <div className="hs-cat-name">{cat.label}</div>
                  <div className="hs-cat-count">{cat.count} việc làm</div>
                </div>
                <div className="hs-cat-trend">
                  <span className="hs-cat-trend-val">{cat.trend}</span>
                  <span className="hs-cat-trend-lbl">tháng này</span>
                </div>
                <div className="hs-cat-arrow">→</div>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          {/* <div className="hs-cats-cta">
            <div className="hs-cats-cta-left">
              <div className="hs-cats-cta-title">Không tìm thấy ngành phù hợp?</div>
              <div className="hs-cats-cta-sub">Để AI phân tích hồ sơ và gợi ý lĩnh vực bạn có thể thành công nhất.</div>
            </div>
            <button className="hs-cats-cta-btn">🤖 Phân tích bằng AI</button>
          </div> */}

        </div>
      </div>

        {/* Toolbar */}
        <div className="hs-toolbar">
          {/* <span className="hs-count">Tìm thấy <strong>15,247 việc làm</strong> phù hợp</span> */}
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <select className="hs-sort">
              <option>Phù hợp nhất</option>
              <option>Mới nhất</option>
              <option>Lương cao nhất</option>
              <option>Sắp hết hạn</option>
            </select>
          </div>
        </div>

        {/* AI highlight — full-width single card */}
        <div className="hs-highlight-wrap">
          {/* <div className="hs-highlight-label">⭐ AI đề xuất đặc biệt — Rất phù hợp lịch sử của bạn</div>
          <div className="hs-highlight-card">
            <JobCard job={{ ...jobData[2], match: 91 }} />
          </div> */}
        </div>

        {/* Section header */}
        <div className="hs-sec-hd">
          <span className="hs-sec-title">💼 Việc làm phù hợp</span>
          <div className="hs-sec-line" />
          <span className="hs-sec-ct">{jobData.length + 1} kết quả</span>
        </div>

        {/* 3-column grid */}
        <div className="hs-grid">
          {jobData.map(job => (
            <JobCard key={job.id} job={job} />
          ))}

          {/* <div className="card jcard">
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
          </div> */}
        </div>

        {/* ── Pagination ──────────────────────────────────── */}
        <div className="hs-pagination">
          {/* Prev */}
          <button
            className="hs-pg-btn hs-pg-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >‹</button>

          {/* Page numbers */}
          {(() => {
            const pages = []
            const total = TOTAL_PAGES
            const cur   = currentPage

            const addBtn = (n) => pages.push(
              <button
                key={n}
                className={`hs-pg-btn${cur === n ? ' hs-pg-active' : ''}`}
                onClick={() => setCurrentPage(n)}
              >{n}</button>
            )
            const addDots = (k) => pages.push(
              <span key={k} className="hs-pg-dots">…</span>
            )

            if (total <= 7) {
              for (let i = 1; i <= total; i++) addBtn(i)
            } else {
              addBtn(1)
              if (cur > 3) addDots('d1')
              const start = Math.max(2, cur - 1)
              const end   = Math.min(total - 1, cur + 1)
              for (let i = start; i <= end; i++) addBtn(i)
              if (cur < total - 2) addDots('d2')
              addBtn(total)
            }
            return pages
          })()}

          {/* Next */}
          <button
            className="hs-pg-btn hs-pg-arrow"
            disabled={currentPage === TOTAL_PAGES}
            onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
          >›</button>

          {/* Jump to page */}
          <div className="hs-pg-jump">
            <span className="hs-pg-jump-lbl">Đến trang</span>
            <input
              className="hs-pg-jump-inp"
              type="number" min={1} max={TOTAL_PAGES}
              defaultValue={currentPage}
              key={currentPage}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const v = Math.max(1, Math.min(TOTAL_PAGES, +e.target.value))
                  setCurrentPage(v)
                }
              }}
            />
          </div>
        </div>

      </div>{/* end hs-body */}

      {/* ══ CATEGORIES SECTION ══════════════════════════════════ */}
     

    </div>
  )
}

export default HomeScreen