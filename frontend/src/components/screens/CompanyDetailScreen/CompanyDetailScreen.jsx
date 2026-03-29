// src/components/screens/CompanyDetailScreen/CompanyDetailScreen.jsx
import { useState } from 'react'
import './CompanyDetailScreen.css'

/* ── Rich detail data ────────────────────────────────────── */
const DETAIL_DATA = {
  1: {
    tagline: 'Kiến tạo tương lai số cùng FPT Software',
    founded: '1999', website: 'fpt-software.com', followers: '48,200',
    about: 'FPT Software là công ty thành viên của Tập đoàn FPT — tập đoàn công nghệ hàng đầu Việt Nam. Với hơn 25 năm kinh nghiệm, chúng tôi cung cấp dịch vụ IT toàn diện cho khách hàng tại 30+ quốc gia.\n\nChúng tôi đặc biệt mạnh trong Digital Transformation, AI/ML Solutions, Cloud Services và Embedded Software — phục vụ các tập đoàn Fortune 500 từ Mỹ, Nhật Bản và Châu Âu.',
    mission: 'Trở thành công ty dịch vụ CNTT hàng đầu thế giới, góp phần thay đổi cuộc sống con người bằng công nghệ.',
    stats: [
      { n: '10,000+', l: 'Nhân sự toàn cầu' },
      { n: '30+',     l: 'Quốc gia hoạt động' },
      { n: '1,000+',  l: 'Khách hàng lớn' },
      { n: '$1.2B',   l: 'Doanh thu 2024' },
    ],
    benefits: [
      { icon: '💰', title: 'Lương & Thưởng',         desc: 'Lương tháng 13, thưởng dự án, review 2 lần/năm.' },
      { icon: '🏥', title: 'Bảo hiểm PTI cao cấp',   desc: 'Bảo hiểm sức khỏe cho nhân viên và người thân.' },
      { icon: '📚', title: 'Budget học tập 10tr/năm', desc: 'Chứng chỉ AWS/Google/Microsoft được hỗ trợ 100%.' },
      { icon: '🏠', title: 'Remote 2 ngày/tuần',      desc: 'Giờ làm linh hoạt 7AM–10AM, ra về sau 8 tiếng.' },
      { icon: '🎯', title: 'Lộ trình thăng tiến',     desc: 'Framework rõ ràng từ Junior → Principal/Architect.' },
      { icon: '🌏', title: 'Onsite quốc tế',          desc: 'Cơ hội onsite Nhật, Mỹ, Châu Âu thường xuyên.' },
    ],
    offices: [
      { city: 'Hà Nội (HQ)',  addr: 'Tầng 23–25, FPT Tower, 10 Phạm Văn Bạch, Cầu Giấy' },
      { city: 'TP.HCM',       addr: 'Tầng 8–12, Saigon Centre, 65 Lê Lợi, Q.1' },
      { city: 'Đà Nẵng',      addr: 'Tầng 6, FPT Building, 72 Hùng Vương' },
    ],
    reviews: [
      { name: 'Nguyễn Văn An', role: 'Senior Developer', rating: 5, time: '2 tháng trước',
        pros: 'Môi trường chuyên nghiệp, đồng nghiệp giỏi. Cơ hội làm việc với khách Nhật rất tốt cho career.',
        cons: 'Deadline dự án đôi khi gấp, cần quản lý stress tốt.' },
      { name: 'Trần Thị Bình', role: 'QA Engineer', rating: 4, time: '1 tháng trước',
        pros: 'Phúc lợi tốt, đặc biệt bảo hiểm. WFH linh hoạt, sếp hiểu và thoải mái.',
        cons: 'Quy trình dự án đôi khi nhiều giấy tờ, hơi cứng nhắc.' },
      { name: 'Lê Văn Cường', role: 'Tech Lead', rating: 4, time: '3 tuần trước',
        pros: 'Lộ trình thăng tiến rõ, có mentor từ đầu. Lương review đúng hẹn.',
        cons: 'Văn phòng HN đôi khi ồn ào, khu ăn trưa hơi xa.' },
    ],
    jobList: [
      { id: 101, title: 'Senior React Developer',    type: 'Hybrid',  salary: '35–50tr', exp: '3–5 năm', deadline: '3 ngày',  match: 94, isNew: true  },
      { id: 102, title: 'Java Spring Boot Engineer', type: 'Onsite',  salary: '28–40tr', exp: '2–4 năm', deadline: '7 ngày',  match: 78, isNew: false },
      { id: 103, title: 'Cloud/DevOps Engineer',     type: 'Hybrid',  salary: '40–60tr', exp: '3+ năm',  deadline: '5 ngày',  match: 82, isNew: true  },
      { id: 104, title: 'AI/ML Engineer',            type: 'Remote',  salary: '50–80tr', exp: '2+ năm',  deadline: '14 ngày', match: 71, isNew: false },
      { id: 105, title: 'Business Analyst (IT)',     type: 'Onsite',  salary: '20–32tr', exp: '1–3 năm', deadline: '10 ngày', match: 65, isNew: false },
    ],
    culture: [
      { emoji: '🚀', title: 'Innovation First',  desc: 'Khuyến khích thử nghiệm ý tưởng mới. 20% thời gian cho side-projects.' },
      { emoji: '🤝', title: 'Teamwork',          desc: 'Agile, daily standup, sprint review. Đồng nghiệp như gia đình.' },
      { emoji: '🌱', title: 'Grow Together',     desc: 'Công ty phát triển, bạn phát triển. Mỗi nhân viên có OKR riêng.' },
      { emoji: '🌍', title: 'Global Mindset',    desc: 'Tiếng Anh là ngôn ngữ chính. Giao lưu văn hóa quốc tế liên tục.' },
    ],
    ratingBreakdown: [
      ['Môi trường làm việc', 4.4],
      ['Lương & Thưởng',      4.0],
      ['Ban lãnh đạo',        4.1],
      ['Cân bằng cuộc sống',  3.9],
      ['Cơ hội thăng tiến',   4.3],
    ],
  },
  2: {
    tagline: 'Kết nối người Việt — Vươn tầm thế giới',
    founded: '2004', website: 'vng.com.vn', followers: '31,500',
    about: 'VNG Corporation là công ty Internet hàng đầu Việt Nam, nổi tiếng với Zalo (74M người dùng), ZingMP3 và nhiều game online.\n\nVNG xây dựng hệ sinh thái số từ nhắn tin, giải trí đến thanh toán, phục vụ hàng chục triệu người dùng mỗi ngày.',
    mission: 'Kết nối con người, truyền cảm hứng và làm phong phú cuộc sống qua công nghệ.',
    stats: [
      { n: '74M+',   l: 'Người dùng Zalo' },
      { n: '3,000+', l: 'Nhân sự' },
      { n: '20+',    l: 'Năm hoạt động' },
      { n: 'NASDAQ', l: 'Niêm yết 2023' },
    ],
    benefits: [
      { icon: '💰', title: 'Lương cạnh tranh',    desc: 'Top market, review hằng năm theo performance.' },
      { icon: '🎮', title: 'Gaming Perks',         desc: 'Chơi game miễn phí, event gaming nội bộ hằng tháng.' },
      { icon: '📚', title: 'Tech Learning',        desc: 'Tech talk mỗi tuần. Budget conference 20tr/năm.' },
      { icon: '🏃', title: 'Wellness',             desc: 'Gym membership, yoga, running club. Phòng game thư giãn.' },
      { icon: '🏠', title: 'Flexible Work',        desc: 'WFH linh hoạt. Core hours 10AM–4PM.' },
      { icon: '📈', title: 'Stock Options (ESOP)', desc: 'Cơ hội sở hữu cổ phần cho nhân viên kỳ cựu.' },
    ],
    offices: [
      { city: 'TP.HCM (HQ)', addr: '182 Lê Đại Hành, Phường 15, Quận 11' },
    ],
    reviews: [
      { name: 'Phạm Thanh Duy', role: 'Backend Engineer', rating: 4, time: '1 tháng trước',
        pros: 'Scale thực sự ấn tượng. Làm hệ thống 74M users khác hẳn các nơi khác.',
        cons: 'Work-life balance có thể tốt hơn ở một số team.' },
      { name: 'Hoàng Minh Em', role: 'Data Engineer', rating: 4, time: '2 tuần trước',
        pros: 'Data infrastructure world-class. Học được nhiều kỹ thuật big data thực tế.',
        cons: 'Quy trình phê duyệt hơi nhiều tầng nấc.' },
    ],
    jobList: [
      { id: 201, title: 'Frontend Engineer (Vue 3)', type: 'Onsite', salary: '30–45tr', exp: '2–4 năm', deadline: '7 ngày',  match: 88, isNew: true  },
      { id: 202, title: 'Backend Engineer (Go)',     type: 'Hybrid', salary: '35–55tr', exp: '3+ năm',  deadline: '5 ngày',  match: 75, isNew: false },
      { id: 203, title: 'Data Engineer',             type: 'Onsite', salary: '28–42tr', exp: '2–3 năm', deadline: '12 ngày', match: 70, isNew: false },
    ],
    culture: [
      { emoji: '⚡', title: 'Move Fast',    desc: 'Ship nhanh, iterate nhanh. Tư duy startup dù quy mô lớn.' },
      { emoji: '🔬', title: 'Data-driven', desc: 'Mọi quyết định đều dựa trên data. A/B test trước, kết luận sau.' },
      { emoji: '🎯', title: 'User First',  desc: 'Mọi tính năng đều hướng đến trải nghiệm người dùng tốt nhất.' },
      { emoji: '🏆', title: 'Excellence',  desc: 'Tiêu chuẩn cao. Tự hào về chất lượng sản phẩm.' },
    ],
    ratingBreakdown: [
      ['Môi trường làm việc', 4.0],
      ['Lương & Thưởng',      4.1],
      ['Ban lãnh đạo',        3.8],
      ['Cân bằng cuộc sống',  3.7],
      ['Cơ hội thăng tiến',   4.0],
    ],
  },
}

const DEFAULT_DETAIL = (c) => ({
  tagline: `Xây dựng tương lai cùng ${c?.name}`,
  founded: 'N/A', website: '#', followers: '0',
  about: `${c?.name} là một trong những công ty hàng đầu trong lĩnh vực ${c?.industry}.`,
  mission: 'Tạo ra giá trị bền vững cho khách hàng, nhân viên và cộng đồng.',
  stats: [
    { n: c?.size,  l: 'Nhân sự' },
    { n: c?.jobs,  l: 'Việc tuyển' },
    { n: c?.rating,l: 'Đánh giá trung bình' },
    { n: c?.reviewCount, l: 'Reviews' },
  ],
  benefits: [
    { icon: '💰', title: 'Lương cạnh tranh',   desc: 'Mức lương hấp dẫn, review định kỳ theo hiệu suất.' },
    { icon: '🏥', title: 'Bảo hiểm sức khỏe',  desc: 'Bảo hiểm toàn diện cho nhân viên.' },
    { icon: '📚', title: 'Đào tạo & phát triển',desc: 'Budget học tập hằng năm, khóa học online miễn phí.' },
    { icon: '🏠', title: 'Làm việc linh hoạt',  desc: 'Giờ làm linh hoạt và chính sách remote thân thiện.' },
  ],
  offices: [{ city: c?.location, addr: 'Xem website chính thức để biết địa chỉ chi tiết.' }],
  reviews: [],
  jobList: [],
  culture: [
    { emoji: '🤝', title: 'Teamwork',   desc: 'Đề cao tinh thần hợp tác và hỗ trợ lẫn nhau.' },
    { emoji: '🌱', title: 'Phát triển', desc: 'Môi trường học hỏi và phát triển liên tục.' },
    { emoji: '💡', title: 'Đổi mới',    desc: 'Khuyến khích sáng tạo và tư duy đột phá.' },
    { emoji: '🎯', title: 'Kết quả',    desc: 'Tập trung vào kết quả, không chỉ nỗ lực.' },
  ],
  ratingBreakdown: [
    ['Môi trường', 4.0], ['Lương & Thưởng', 3.8],
    ['Lãnh đạo', 4.0],   ['Cân bằng', 3.9], ['Thăng tiến', 4.0],
  ],
})

const BADGE_MAP = {
  hot:  ['cb-hot', '🔥 Hot'],
  top:  ['cb-top', '⭐ Top'],
  new:  ['cb-new', '✦ Mới'],
  rem:  ['cb-rem', '🏠 Remote'],
  feat: ['cb-feat','✦ Nổi bật'],
}

function Stars({ n }) {
  const full = Math.floor(n), half = n % 1 >= 0.5
  return <span className="cd-stars">{'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}</span>
}

function matchCls(n) { return n >= 85 ? 'mc-hi' : n >= 70 ? 'mc-md' : 'mc-lo' }

/* ── Main ────────────────────────────────────────────────── */
export default function CompanyDetailScreen({ company, onBack }) {
  const [tab, setTab]         = useState('overview')
  const [following, setFol]   = useState(false)
  const [saved, setSaved]     = useState(new Set())

  if (!company) return null
  const extra  = DETAIL_DATA[company.id] ?? DEFAULT_DETAIL(company)
  const detail = { ...company, ...extra }

  const TABS = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'jobs',     label: `Việc làm (${detail.jobList?.length ?? 0})` },
    { key: 'reviews',  label: `Đánh giá (${detail.reviews?.length ?? 0})` },
    { key: 'culture',  label: 'Văn hoá' },
  ]

  const toggleSave = (id) =>
    setSaved(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="cd-page">

      {/* ── Breadcrumb ───────────────────────────────────── */}
      <div className="cd-breadcrumb">
        <div className="cd-bc-inner">
          <button className="cd-back" onClick={onBack}>← Quay lại</button>
          <span className="cd-bc-sep">›</span>
          <span>Công ty</span>
          <span className="cd-bc-sep">›</span>
          <span className="cd-bc-cur">{detail.name}</span>
        </div>
      </div>

      {/* ── Hero: cover + logo ───────────────────────────── */}
      <div className="cd-hero">
        <div className="cd-cover" style={{ background: detail.cover }}>
          <div className="cd-cover-dim" />
          <div className="cd-cover-noise" />
        </div>

        <div className="cd-hero-body">
          <div className="cd-hero-inner">
            <div className="cd-logo-wrap">
              <div className="cd-logo" style={{ background: detail.logoColor }}>{detail.logo}</div>
            </div>

            <div className="cd-hero-info">
              {/* Top row */}
              <div className="cd-hero-row1">
                <div>
                  <div className="cd-badge-row">
                    {(detail.badges || []).map(b => {
                      const [cls, txt] = BADGE_MAP[b] || []; return cls
                        ? <span key={b} className={`cd-badge ${cls}`}>{txt}</span> : null
                    })}
                    {detail.featured && <span className="cd-badge cb-feat">✦ Nổi bật</span>}
                  </div>
                  <h1 className="cd-name">{detail.name}</h1>
                  <div className="cd-sub">
                    <span>{detail.industry}</span><span className="cd-dot">·</span>
                    <span>📍 {detail.location}</span><span className="cd-dot">·</span>
                    <span>🏢 {detail.size} nhân sự</span><span className="cd-dot">·</span>
                    <span>📅 Thành lập {detail.founded}</span>
                  </div>
                </div>

                <div className="cd-hero-actions">
                  <button className={`cd-follow-btn${following ? ' on' : ''}`} onClick={() => setFol(v => !v)}>
                    {following ? '✓ Đang theo dõi' : '+ Theo dõi'}
                  </button>
                  <a className="cd-web-btn" href={`https://${detail.website}`} target="_blank" rel="noreferrer">
                    🌐 Website
                  </a>
                </div>
              </div>

              {/* KPI strip */}
              <div className="cd-kpi-strip">
                <div className="cd-kpi">
                  <Stars n={detail.rating} />
                  <span className="cd-kpi-n">{detail.rating}</span>
                  <span className="cd-kpi-l">{detail.reviewCount?.toLocaleString()} đánh giá</span>
                </div>
                <div className="cd-kpi-div" />
                <div className="cd-kpi">
                  <span className="cd-kpi-n cd-rust">{detail.jobList?.length ?? detail.jobs}</span>
                  <span className="cd-kpi-l">việc đang tuyển</span>
                </div>
                <div className="cd-kpi-div" />
                <div className="cd-kpi">
                  <span className="cd-kpi-n">{detail.followers}</span>
                  <span className="cd-kpi-l">người theo dõi</span>
                </div>
              </div>

              {/* Tags */}
              <div className="cd-tag-row">
                {(detail.tags || []).map(t => <span key={t} className="cd-tag">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="cd-tabs-bar">
        <div className="cd-tabs-inner">
          {TABS.map(t => (
            <button key={t.key} className={`cd-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="cd-body">
        <div className="cd-body-inner">

          {/* ══ OVERVIEW ════════════════════════════════════ */}
          {tab === 'overview' && (
            <div className="cd-2col">

              {/* Left */}
              <div className="cd-col-main">
                <section className="cd-sec">
                  <div className="cd-sec-title">📋 Giới thiệu</div>
                  <div className="cd-tagline">"{detail.tagline}"</div>
                  <div className="cd-about">
                    {(detail.about || '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </section>

                <section className="cd-sec">
                  <div className="cd-sec-title">🎯 Sứ mệnh</div>
                  <div className="cd-mission-box">
                    <div className="cd-mission-q">"</div>
                    <div className="cd-mission-txt">{detail.mission}</div>
                  </div>
                </section>

                <section className="cd-sec">
                  <div className="cd-sec-title">🎁 Phúc lợi & Chính sách</div>
                  <div className="cd-benefits-grid">
                    {(detail.benefits || []).map((b, i) => (
                      <div key={i} className="cd-benefit">
                        <div className="cd-benefit-ico">{b.icon}</div>
                        <div>
                          <div className="cd-benefit-t">{b.title}</div>
                          <div className="cd-benefit-d">{b.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="cd-sec">
                  <div className="cd-sec-title">📍 Địa điểm làm việc</div>
                  <div className="cd-offices">
                    {(detail.offices || []).map((o, i) => (
                      <div key={i} className="cd-office">
                        <div className="cd-office-dot" />
                        <div>
                          <div className="cd-office-city">{o.city}</div>
                          <div className="cd-office-addr">{o.addr}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right sidebar */}
              <div className="cd-col-side">
                {/* Stats */}
                <div className="cd-card">
                  <div className="cd-card-title">📊 Số liệu nổi bật</div>
                  <div className="cd-stats-grid">
                    {(detail.stats || []).map((s, i) => (
                      <div key={i} className="cd-stat">
                        <div className="cd-stat-n">{s.n}</div>
                        <div className="cd-stat-l">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick jobs */}
                <div className="cd-card">
                  <div className="cd-card-hd">
                    <span className="cd-card-title">💼 Việc đang tuyển</span>
                    <button className="cd-see-all" onClick={() => setTab('jobs')}>Xem tất cả →</button>
                  </div>
                  {(detail.jobList || []).length > 0
                    ? (detail.jobList || []).slice(0, 3).map(j => (
                      <div key={j.id} className="cd-qjob">
                        <div className="cd-qjob-info">
                          <div className="cd-qjob-title">
                            {j.title}
                            {j.isNew && <span className="cd-qjob-new">Mới</span>}
                          </div>
                          <div className="cd-qjob-meta">{j.type} · {j.salary}</div>
                        </div>
                        <span className={`cd-qjob-match ${matchCls(j.match)}`}>{j.match}%</span>
                      </div>
                    ))
                    : <div className="cd-empty-sm">Chưa có dữ liệu.</div>
                  }
                </div>

                {/* Rating breakdown */}
                <div className="cd-card">
                  <div className="cd-card-title">⭐ Đánh giá chi tiết</div>
                  <div className="cd-rating-top">
                    <span className="cd-rating-big">{detail.rating}</span>
                    <div>
                      <Stars n={detail.rating} />
                      <div className="cd-rating-ct">{detail.reviewCount?.toLocaleString()} đánh giá</div>
                    </div>
                  </div>
                  {(detail.ratingBreakdown || []).map(([lbl, val]) => (
                    <div key={lbl} className="cd-rb-row">
                      <span className="cd-rb-lbl">{lbl}</span>
                      <div className="cd-rb-bg">
                        <div className="cd-rb-bar" style={{ width: `${(val / 5) * 100}%` }} />
                      </div>
                      <span className="cd-rb-val">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ JOBS ════════════════════════════════════════ */}
          {tab === 'jobs' && (
            <div className="cd-tab-pane">
              <div className="cd-jobs-hd">
                <span className="cd-jobs-ct">{detail.jobList?.length ?? 0} việc làm đang tuyển tại {detail.name}</span>
              </div>
              {(detail.jobList || []).length > 0 ? (
                <div className="cd-jobs-list">
                  {(detail.jobList || []).map(j => (
                    <div key={j.id} className="cd-job-card">
                      <div className="cd-job-top">
                        <div className="cd-job-logo" style={{ background: detail.logoColor }}>{detail.logo}</div>
                        <div className="cd-job-info">
                          <div className="cd-job-title">
                            {j.title}
                            {j.isNew && <span className="cd-job-new-tag">Mới</span>}
                          </div>
                          <div className="cd-job-chips">
                            <span className="cd-chip">📍 {detail.location}</span>
                            <span className="cd-chip">🕐 {j.type}</span>
                            <span className="cd-chip">🎓 {j.exp}</span>
                          </div>
                        </div>
                        <div className={`cd-job-match ${matchCls(j.match)}`}>
                          <span className="cd-jm-n">{j.match}%</span>
                          <span className="cd-jm-l">phù hợp</span>
                        </div>
                      </div>
                      <div className="cd-job-foot">
                        <span className="cd-job-salary">💰 {j.salary}/tháng</span>
                        <span className="cd-job-dl">⏰ Còn {j.deadline}</span>
                        <div className="cd-job-acts">
                          <button className={`cd-save-btn${saved.has(j.id) ? ' on' : ''}`} onClick={() => toggleSave(j.id)}>🔖</button>
                          <button className="cd-apply-btn">⚡ Ứng tuyển</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cd-empty">
                  <div className="cd-empty-ico">💼</div>
                  <div className="cd-empty-t">Chưa có việc làm nào</div>
                  <div className="cd-empty-s">Theo dõi công ty để nhận thông báo khi có vị trí mới.</div>
                </div>
              )}
            </div>
          )}

          {/* ══ REVIEWS ═════════════════════════════════════ */}
          {tab === 'reviews' && (
            <div className="cd-tab-pane">
              {(detail.reviews || []).length > 0 ? (
                <div className="cd-reviews">
                  {(detail.reviews || []).map((r, i) => (
                    <div key={i} className="cd-review">
                      <div className="cd-review-hd">
                        <div className="cd-review-av">{r.name.split(' ').pop()[0]}</div>
                        <div className="cd-review-meta">
                          <div className="cd-review-name">{r.name}</div>
                          <div className="cd-review-sub">{r.role} · {r.time}</div>
                        </div>
                        <div className="cd-review-stars-row">
                          <Stars n={r.rating} />
                          <span className="cd-review-rv">{r.rating}.0</span>
                        </div>
                      </div>
                      <div className="cd-review-body">
                        <div className="cd-review-block pros">
                          <span className="cd-review-lbl pros">👍 Ưu điểm</span>
                          <p>{r.pros}</p>
                        </div>
                        <div className="cd-review-block cons">
                          <span className="cd-review-lbl cons">👎 Nhược điểm</span>
                          <p>{r.cons}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cd-empty">
                  <div className="cd-empty-ico">💬</div>
                  <div className="cd-empty-t">Chưa có đánh giá nào</div>
                  <div className="cd-empty-s">Hãy là người đầu tiên chia sẻ trải nghiệm.</div>
                  <button className="cd-write-btn">✍️ Viết đánh giá</button>
                </div>
              )}
            </div>
          )}

          {/* ══ CULTURE ═════════════════════════════════════ */}
          {tab === 'culture' && (
            <div className="cd-tab-pane">
              <div className="cd-culture-grid">
                {(detail.culture || []).map((c, i) => (
                  <div key={i} className="cd-culture-card">
                    <div className="cd-culture-emoji">{c.emoji}</div>
                    <div className="cd-culture-title">{c.title}</div>
                    <div className="cd-culture-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
              <div className="cd-culture-cta">
                <div>
                  <div className="cd-culture-cta-t">Muốn trở thành một phần của {detail.name}?</div>
                  <div className="cd-culture-cta-s">Xem các vị trí đang tuyển và ứng tuyển ngay.</div>
                </div>
                <button className="cd-culture-cta-btn" onClick={() => setTab('jobs')}>Xem việc làm →</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}