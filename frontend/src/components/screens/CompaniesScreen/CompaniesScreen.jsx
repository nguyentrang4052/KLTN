// src/components/screens/CompaniesScreen/CompaniesScreen.jsx
import { useState } from 'react'
import './CompaniesScreen.css'

/* ── Data ───────────────────────────────────────────────────── */
const COMPANIES = [
  {
    id: 1, name: 'FPT Software', industry: 'IT / Phần mềm', size: '10,000+', location: 'HCM / HN', logo: 'F',
    cover: 'linear-gradient(135deg,#1a3a6a,#2e6da8)',
    logoColor: 'linear-gradient(135deg,#D0392A,#E05A40)',
    rating: 4.2, reviewCount: 1240, jobs: 84,
    tags: ['React', 'Java', 'Cloud', 'AI/ML', 'Remote-friendly'],
    badges: ['hot', 'top'],
    desc: 'Tập đoàn công nghệ hàng đầu Việt Nam với hơn 10,000 nhân sự tại 20+ quốc gia.',
    featured: true,
  },
  {
    id: 2, name: 'VNG Corporation', industry: 'Internet / Gaming', size: '3,000+', location: 'TP.HCM', logo: 'V',
    cover: 'linear-gradient(135deg,#1565C0,#1E88E5)',
    logoColor: 'linear-gradient(135deg,#1565C0,#1E88E5)',
    rating: 4.0, reviewCount: 680, jobs: 52,
    tags: ['Go', 'Kubernetes', 'Game Dev', 'Data'],
    badges: ['top'],
    desc: 'Công ty Internet hàng đầu Việt Nam, chủ sở hữu Zalo, ZingMP3 và nhiều sản phẩm nổi tiếng.',
    featured: true,
  },
  {
    id: 3, name: 'Shopee Vietnam', industry: 'E-commerce', size: '5,000+', location: 'TP.HCM', logo: 'S',
    cover: 'linear-gradient(135deg,#D84315,#F4511E)',
    logoColor: 'linear-gradient(135deg,#D84315,#F4511E)',
    rating: 3.9, reviewCount: 920, jobs: 68,
    tags: ['Python', 'React', 'BigData', 'Logistics'],
    badges: ['hot'],
    desc: 'Nền tảng thương mại điện tử lớn nhất Đông Nam Á, tuyển dụng nhiều vị trí tech.',
    featured: false,
  },
  {
    id: 4, name: 'MoMo', industry: 'Fintech', size: '1,500+', location: 'TP.HCM', logo: 'M',
    cover: 'linear-gradient(135deg,#880E4F,#C2185B)',
    logoColor: 'linear-gradient(135deg,#880E4F,#C2185B)',
    rating: 4.1, reviewCount: 430, jobs: 38,
    tags: ['Mobile', 'Fintech', 'Payment', 'Security'],
    badges: ['new'],
    desc: 'Ví điện tử số 1 Việt Nam với hơn 31 triệu người dùng.',
    featured: false,
  },
  {
    id: 5, name: 'Tiki Corporation', industry: 'E-commerce / Tech', size: '2,000+', location: 'HCM / Remote', logo: 'T',
    cover: 'linear-gradient(135deg,#1A73E8,#4285F4)',
    logoColor: 'linear-gradient(135deg,#1A73E8,#4285F4)',
    rating: 3.8, reviewCount: 510, jobs: 45,
    tags: ['Vue.js', 'Go', 'Microservices', 'Remote'],
    badges: ['rem'],
    desc: 'Nền tảng thương mại điện tử và công nghệ với văn hóa startup năng động.',
    featured: false,
  },
  {
    id: 6, name: 'Grab Vietnam', industry: 'Super App', size: '2,000+', location: 'TP.HCM', logo: 'G',
    cover: 'linear-gradient(135deg,#1B5E20,#388E3C)',
    logoColor: 'linear-gradient(135deg,#1B5E20,#388E3C)',
    rating: 4.3, reviewCount: 750, jobs: 29,
    tags: ['Android', 'iOS', 'Maps', 'Logistics'],
    badges: [],
    desc: 'Siêu ứng dụng hàng đầu Đông Nam Á với đội ngũ kỹ thuật đẳng cấp thế giới.',
    featured: false,
  },
  {
    id: 7, name: 'KMS Technology', industry: 'IT Services / US Market', size: '800+', location: 'TP.HCM', logo: 'K',
    cover: 'linear-gradient(135deg,#1A3A6A,#2E6DA8)',
    logoColor: 'linear-gradient(135deg,#1A3A6A,#2E6DA8)',
    rating: 4.5, reviewCount: 620, jobs: 32,
    tags: ['QA/QC', '.NET', 'React', 'US Projects'],
    badges: ['top'],
    desc: 'Công ty outsource IT với thị trường chủ yếu ở Mỹ, môi trường quốc tế, lương cao.',
    featured: true,
  },
  {
    id: 8, name: 'Zalo (VNG)', industry: 'Social / Chat App', size: '400+', location: 'TP.HCM', logo: 'Z',
    cover: 'linear-gradient(135deg,#0D47A1,#1565C0)',
    logoColor: 'linear-gradient(135deg,#0D47A1,#1565C0)',
    rating: 4.0, reviewCount: 280, jobs: 18,
    tags: ['C++', 'Mobile', 'Socket', 'Scale'],
    badges: ['new'],
    desc: 'Team kỹ thuật core của Zalo – ứng dụng nhắn tin với 74+ triệu người dùng Việt Nam.',
    featured: false,
  },
  {
    id: 9, name: 'VNPAY', industry: 'Fintech / Ngân hàng', size: '1,200+', location: 'HCM / HN', logo: 'V',
    cover: 'linear-gradient(135deg,#00695C,#00897B)',
    logoColor: 'linear-gradient(135deg,#00695C,#00897B)',
    rating: 3.7, reviewCount: 380, jobs: 22,
    tags: ['Java', 'Payment', 'Banking', 'Spring'],
    badges: [],
    desc: 'Công ty thanh toán điện tử lớn nhất Việt Nam với mạng lưới ngân hàng toàn quốc.',
    featured: false,
  },
]

const FEATURED_COMPANIES = COMPANIES.filter(c => c.featured).slice(0, 5)

const INDUSTRIES = [
  '💻 IT / Phần mềm', '🛒 E-commerce', '💰 Fintech', '🎮 Gaming',
  '🏥 Y tế', '📚 Giáo dục', '🚚 Logistics', '🏗️ Sản xuất',
]

const SIZES = [
  { label: 'Startup (< 100)',   count: '248', key: 'startup' },
  { label: 'SME (100 – 999)',   count: '612', key: 'sme'     },
  { label: 'Lớn (1K – 9,999)', count: '290', key: 'large'   },
  { label: 'Tập đoàn (10K+)',  count: '68',  key: 'corp'    },
]

const LOCATIONS = [
  { label: 'TP. Hồ Chí Minh', count: '1,480' },
  { label: 'Hà Nội',          count: '820'   },
  { label: 'Đà Nẵng',         count: '240'   },
  { label: 'Remote / Toàn quốc', count: '310' },
]

/* ── Helpers ────────────────────────────────────────────────── */
function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="cs-card__stars">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  )
}

function Badge({ type }) {
  const map = {
    hot: ['cb-hot', '🔥 Hot'],
    top: ['cb-top', '⭐ Top'],
    new: ['cb-new', '✦ Mới'],
    rem: ['cb-rem', '🏠 Remote'],
  }
  if (!map[type]) return null
  const [cls, text] = map[type]
  return <span className={`cs-card__badge ${cls}`}>{text}</span>
}

/* ── Company card (grid) ────────────────────────────────────── */
function CompanyCard({ company, listView, onFollow, following }) {
  return (
    <div className={`cs-card${company.featured ? ' feat' : ''}${listView ? ' list-card' : ''}`}>
      {/* Cover */}
      <div className="cs-card__cover" style={{ background: company.cover }} />

      {/* Logo row */}
      <div className="cs-card__lr">
        <div className="cs-card__logo" style={{ background: company.logoColor }}>
          {company.logo}
        </div>
        <div className="cs-card__badges">
          {company.badges.map(b => <Badge key={b} type={b} />)}
        </div>
      </div>

      {/* Body */}
      <div className="cs-card__body">
        <div className="cs-card__name">{company.name}</div>
        <div className="cs-card__ind">
          {company.industry}
          <span className="cs-card__verified">✓</span>
        </div>

        <div className="cs-card__meta">
          <span className="cs-card__meta-item">👥 {company.size} nhân sự</span>
          <span className="cs-card__meta-item">📍 {company.location}</span>
        </div>

        <div className="cs-card__rating">
          <Stars rating={company.rating} />
          <span className="cs-card__rv">{company.rating}</span>
          <span className="cs-card__rcount">({company.reviewCount.toLocaleString()} đánh giá)</span>
        </div>

        <div className="cs-card__tags">
          {company.tags.slice(0, 4).map(t => (
            <span className="cs-card__tag" key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="cs-card__foot">
        <div className="cs-card__jobs-cta">
          {company.jobs} việc làm <span>đang tuyển</span>
        </div>
        <button
          className={`cs-card__follow-btn${following ? ' following' : ''}`}
          onClick={e => { e.stopPropagation(); onFollow(company.id) }}
        >
          {following ? '✓ Đang theo dõi' : '+ Theo dõi'}
        </button>
      </div>
    </div>
  )
}

/* ── Main screen ────────────────────────────────────────────── */
export default function CompaniesScreen() {
  const [listView, setListView]         = useState(false)
  const [following, setFollowing]       = useState(new Set())
  const [activeInds, setActiveInds]     = useState(new Set())
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery]   = useState('')

  const [checkedSize, setCheckedSize]   = useState({})
  const [checkedLoc, setCheckedLoc]     = useState({})

  const toggleFollow = (id) => {
    setFollowing(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleInd = (ind) => {
    setActiveInds(prev => {
      const next = new Set(prev)
      next.has(ind) ? next.delete(ind) : next.add(ind)
      return next
    })
  }
  const toggleCk = (map, setMap, key) => {
    setMap(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const FILTER_CHIPS = [
    { key: 'all', label: '🗂️ Tất cả' },
    { key: 'top', label: '⭐ Top công ty' },
    { key: 'hot', label: '🔥 Đang hot' },
    { key: 'new', label: '✦ Mới lên sàn' },
    { key: 'rem', label: '🏠 Remote-friendly' },
    { key: 'startup', label: '🚀 Startup' },
  ]

  const filtered = COMPANIES.filter(c => {
    if (activeFilter === 'top'     && !c.badges.includes('top')) return false
    if (activeFilter === 'hot'     && !c.badges.includes('hot')) return false
    if (activeFilter === 'new'     && !c.badges.includes('new')) return false
    if (activeFilter === 'rem'     && !c.badges.includes('rem')) return false
    if (activeFilter === 'startup' && !c.size.includes('<')) return false
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="cs-screen">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="cs-hero">
        <div className="cs-hero__glow" />
        <div className="cs-hero__glow2" />
        <div className="cs-hero__inner">
          {/* <div className="cs-hero__tag">
            <span className="cs-hero__dot" />
            3,200+ công ty đang tuyển dụng
          </div> */}
          <h1 className="cs-hero__title">
            Khám phá <em>công ty</em><br />dành cho sự nghiệp của bạn
          </h1>
          <p className="cs-hero__sub">
            Tìm kiếm nơi làm việc lý tưởng từ các công ty hàng đầu Việt Nam và quốc tế.
            Xem văn hóa, mức lương, đánh giá nhân viên và việc làm đang tuyển.
          </p>

          {/* Search */}
          <div className="cs-hero__search">
            <div className="cs-hero__field">
              <span className="cs-hero__field-ico">🔍</span>
              <input
                type="text"
                placeholder="Tên công ty, ngành nghề..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="cs-hero__field-divider" />
              <span className="cs-hero__field-ico">📍</span>
              <input type="text" placeholder="Địa điểm..." style={{ maxWidth: 140 }} />
            </div>
            <button className="cs-hero__search-btn">🔍 Tìm kiếm</button>
          </div>

          {/* Stats */}
          {/* <div className="cs-hero__stats">
            <div><div className="cs-hero__stat-n">3,200+</div><div className="cs-hero__stat-l">Công ty tuyển dụng</div></div>
            <div><div className="cs-hero__stat-n">50K+</div><div className="cs-hero__stat-l">Việc làm hôm nay</div></div>
            <div><div className="cs-hero__stat-n">92%</div><div className="cs-hero__stat-l">Hài lòng về môi trường</div></div>
            <div><div className="cs-hero__stat-n">28K+</div><div className="cs-hero__stat-l">Đánh giá từ nhân viên</div></div>
          </div> */}
        </div>
      </section>

      <div className="cs-body">

        <aside className="cs-sidebar">
          <div className="cs-sidebar__head">
            <div className="cs-sidebar__title">Bộ lọc</div>
            <span
              className="cs-sidebar__clear"
              onClick={() => { setActiveInds(new Set()); setCheckedSize({}); setCheckedLoc({}) }}
            >
              Xoá tất cả
            </span>
          </div>

          <div className="cs-sb-section">
            <div className="cs-sb-sec-title">Ngành nghề</div>
            <div className="cs-ind-pills">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  className={`cs-ind-pill${activeInds.has(ind) ? ' on' : ''}`}
                  onClick={() => toggleInd(ind)}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Company size */}
          <div className="cs-sb-section">
            <div className="cs-sb-sec-title">Quy mô công ty</div>
            {SIZES.map(s => (
              <div key={s.key} className="cs-ck-row" onClick={() => toggleCk(checkedSize, setCheckedSize, s.key)}>
                <div className={`cs-ck${checkedSize[s.key] ? ' on' : ''}`}>{checkedSize[s.key] ? '✓' : ''}</div>
                <span className="cs-ck-label">{s.label}</span>
                <span className="cs-ck-count">{s.count}</span>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="cs-sb-section">
            <div className="cs-sb-sec-title">Địa điểm</div>
            {LOCATIONS.map(l => (
              <div key={l.label} className="cs-ck-row" onClick={() => toggleCk(checkedLoc, setCheckedLoc, l.label)}>
                <div className={`cs-ck${checkedLoc[l.label] ? ' on' : ''}`}>{checkedLoc[l.label] ? '✓' : ''}</div>
                <span className="cs-ck-label">{l.label}</span>
                <span className="cs-ck-count">{l.count}</span>
              </div>
            ))}
          </div>

          {/* Rating filter */}
          <div className="cs-sb-section">
            <div className="cs-sb-sec-title">Đánh giá từ nhân viên</div>
            {[4.5, 4.0, 3.5].map(r => (
              <div key={r} className="cs-ck-row" onClick={() => {}}>
                <div className="cs-ck" />
                <span className="cs-ck-label" style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:'#D4820A', fontSize:12 }}>{'★'.repeat(Math.floor(r))}</span>
                  {r}+ trở lên
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="cs-main">

          {/* Featured strip */}
          <div className="cs-featured">
            <div className="cs-featured__hd">
              <div className="cs-featured__title">⭐ Công ty nổi bật</div>
              <span className="cs-featured__see">Xem tất cả →</span>
            </div>
            <div className="cs-feat-row">
              {FEATURED_COMPANIES.map(c => (
                <div key={c.id} className="cs-feat-card">
                  <div className="cs-feat-logo" style={{ background: c.logoColor }}>{c.logo}</div>
                  <div className="cs-feat-name">{c.name}</div>
                  <div className="cs-feat-ind">{c.industry}</div>
                  <div className="cs-feat-jobs">{c.jobs} <span>việc làm</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="cs-toolbar">
            <div className="cs-result-count">
              Tìm thấy <strong>{filtered.length} công ty</strong> phù hợp
            </div>
            <div className="cs-toolbar-right">
              <select className="cs-sort-sel">
                <option>Phù hợp nhất</option>
                <option>Đánh giá cao nhất</option>
                <option>Nhiều việc làm nhất</option>
                <option>Mới nhất</option>
              </select>
              <div className="cs-view-btns">
                <button className={`cs-view-btn${!listView ? ' on' : ''}`} onClick={() => setListView(false)}>⊞</button>
                <button className={`cs-view-btn${listView ? ' on' : ''}`} onClick={() => setListView(true)}>☰</button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className={`cs-grid${listView ? ' list' : ''}`}>
            {filtered.map(c => (
              <CompanyCard
                key={c.id}
                company={c}
                listView={listView}
                following={following.has(c.id)}
                onFollow={toggleFollow}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="cs-pagination">
            <button className="cs-pg-btn">‹</button>
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`cs-pg-btn${n === 1 ? ' on' : ''}`}>{n}</button>
            ))}
            <button className="cs-pg-btn">…</button>
            <button className="cs-pg-btn">12</button>
            <button className="cs-pg-btn wide">Tiếp →</button>
          </div>

        </main>
      </div>
    </div>
  )
}