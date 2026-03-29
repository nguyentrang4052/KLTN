import { useState, useEffect, useRef, useCallback } from 'react'
import './CompaniesScreen.css'

const API = 'http://localhost:3000/api'

const LOGO_COLORS = [
  'linear-gradient(135deg,#D0392A,#E05A40)',
  'linear-gradient(135deg,#1565C0,#1E88E5)',
  'linear-gradient(135deg,#880E4F,#C2185B)',
  'linear-gradient(135deg,#1B5E20,#388E3C)',
  'linear-gradient(135deg,#1A3A6A,#2E6DA8)',
  'linear-gradient(135deg,#00695C,#00897B)',
  'linear-gradient(135deg,#4A148C,#7B1FA2)',
  'linear-gradient(135deg,#E65100,#F57C00)',
  'linear-gradient(135deg,#0D47A1,#1565C0)',
  'linear-gradient(135deg,#006064,#00838F)',
]
const getLogoColor = (name) => {
  const code = (name?.charCodeAt(0) ?? 0) % LOGO_COLORS.length
  return LOGO_COLORS[code]
}

function CompanyLogo({ company }) {
  const [imgError, setImgError] = useState(false)
  if (company.logo && !imgError) {
    return (
      <img
        className="cs-card__logo"
        src={company.logo}
        alt={company.name}
        onError={() => setImgError(true)}
        style={{ objectFit: 'contain', background: '#fff', padding: '4px' }}
      />
    )
  }
  return (
    <div className="cs-card__logo" style={{ background: getLogoColor(company.name) }}>
      {company.name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function CompanyCard({ company, listView, onFollow, following }) {
  return (
    <div className={`cs-card${listView ? ' list-card' : ''}`}>
      <div className="cs-card__cover"
        style={{ background: getLogoColor(company.name) + ', linear-gradient(135deg,#1a3a6a,#2e6da8)' }} />

      <div className="cs-card__lr">
        <CompanyLogo company={company} />
      </div>

      <div className="cs-card__body">
        <div className="cs-card__name">{company.name}</div>
        <div className="cs-card__meta">
          {company.size && <span className="cs-card__meta-item">👥 {company.size}</span>}
          {company.location && <span className="cs-card__meta-item">📍 {company.location}</span>}
        </div>
      </div>

      <div className="cs-card__foot">
        <div className="cs-card__jobs-cta">
          {company.jobCount} việc làm <span>đang tuyển</span>
        </div>
        {/* <button
          className={`cs-card__follow-btn${following ? ' following' : ''}`}
          onClick={e => { e.stopPropagation(); onFollow(company.companyID) }}>
          {following ? '✓ Đang theo dõi' : '+ Theo dõi'}
        </button> */}
      </div>
    </div>
  )
}

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState([])
  const [topCompanies, setTopCompanies] = useState([])
  const [sizes, setSizes] = useState([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [provinces, setProvinces] = useState([])
  const [provinceSearch, setProvinceSearch] = useState('')
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const provinceInputRef = useRef(null)

  const [keyword, setKeyword] = useState('')
  const [selectedLocations, setSelectedLocations] = useState([])
  const [checkedSize, setCheckedSize] = useState({})
  const [sort, setSort] = useState('jobs')
  const [page, setPage] = useState(1)
  const [listView, setListView] = useState(false)
  const [following, setFollowing] = useState(new Set())
  const [loadingCompanies, setLoadingCompanies] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/companies/top`).then(r => r.json()),
      fetch(`${API}/companies/sizes`).then(r => r.json()),
      fetch(`${API}/common/locations`).then(r => r.json()),
    ])
      .then(([top, szData, provs]) => {
        setTopCompanies(Array.isArray(top) ? top : [])
        setSizes(Array.isArray(szData) ? szData : [])
        setProvinces(Array.isArray(provs) ? provs : [])
      })
      .catch(console.error)
  }, [])

  const fetchCompanies = useCallback(() => {
    setLoadingCompanies(true)

    const params = new URLSearchParams({
      page: String(page),
      limit: '9',
      sort
    })

    if (keyword) params.set('keyword', keyword)
    if (selectedLocations.length > 0) params.set('location', selectedLocations[0])

    const activeSize = Object.entries(checkedSize).find(([, v]) => v)?.[0]
    if (activeSize) params.set('size', activeSize)

    fetch(`${API}/companies?${params}`)
      .then(r => r.json())
      .then(data => {
        setCompanies(data.data ?? [])
        setMeta(data.meta ?? { total: 0, totalPages: 1 })
      })
      .catch(console.error)
      .finally(() => setLoadingCompanies(false))

  }, [page, sort, keyword, selectedLocations, checkedSize])


  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])


  const toggleFollow = (companyID) => {
    setFollowing(prev => {
      const next = new Set(prev)
      next.has(companyID) ? next.delete(companyID) : next.add(companyID)
      return next
    })
  }


  const toggleLocation = (loc) => {
    setSelectedLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    )
  }

  const toggleSize = (key) => {
    setCheckedSize(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setPage(1)
    fetchCompanies()
  }, [selectedLocations, checkedSize, keyword, sort])

  const clearFilters = () => {
    setSelectedLocations([])
    setCheckedSize({})
  }

  const openProvinceDropdown = () => {
    if (provinceInputRef.current) {
      const rect = provinceInputRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setProvinceDropdownOpen(true)
  }

  const filteredProvinces = provinces.filter(p =>
    p.label.toLowerCase().includes(provinceSearch.toLowerCase())
  )

  const renderPages = () => {
    const pages = []
    const total = meta.totalPages
    const cur = page
    const addBtn = (n) => pages.push(
      <button key={n} className={`cs-pg-btn${cur === n ? ' on' : ''}`}
        onClick={() => setPage(n)}>{n}</button>
    )
    const addDots = (k) => pages.push(
      <button key={k} className="cs-pg-btn" disabled>…</button>
    )
    if (total <= 7) {
      for (let i = 1; i <= total; i++) addBtn(i)
    } else {
      addBtn(1)
      if (cur > 3) addDots('d1')
      const start = Math.max(2, cur - 1)
      const end = Math.min(total - 1, cur + 1)
      for (let i = start; i <= end; i++) addBtn(i)
      if (cur < total - 2) addDots('d2')
      addBtn(total)
    }
    return pages
  }

  return (
    <div className="cs-screen">

      {provinceDropdownOpen && filteredProvinces.length > 0 && (
        <div style={{
          position: 'fixed',
          top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width,
          zIndex: 9999, background: '#FEFCF7', border: '1px solid #DDD6C6',
          borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,.15)',
          maxHeight: '220px', overflowY: 'auto',
        }}>
          {filteredProvinces.map(p => (
            <div key={p.value} style={{
              padding: '8px 12px', fontSize: '12.5px', cursor: 'pointer',
              background: selectedLocations.includes(p.value) ? 'rgba(192,65,42,0.08)' : 'transparent',
              color: selectedLocations.includes(p.value) ? '#C0412A' : '#1C1510',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }} onMouseDown={e => {
              e.preventDefault()
              toggleLocation(p.value)
              setProvinceSearch('')
            }}>
              <span>{p.label}</span>
              {selectedLocations.includes(p.value) && (
                <span style={{ color: '#C0412A', fontWeight: 700 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}

      <section className="cs-hero">
        <div className="cs-hero__glow" />
        <div className="cs-hero__glow2" />
        <div className="cs-hero__inner">
          <h1 className="cs-hero__title">
            Khám phá <em>công ty</em><br />dành cho sự nghiệp của bạn
          </h1>
          <p className="cs-hero__sub">
            Tìm kiếm nơi làm việc lý tưởng từ các công ty hàng đầu Việt Nam và quốc tế.
          </p>
          <div className="cs-hero__search">
            <div className="cs-hero__field">
              <span className="cs-hero__field-ico">🔍</span>
              <input type="text" placeholder="Tên công ty"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setPage(1)
                    fetchCompanies()
                  }
                }} />
            </div>
            <button
              className="cs-hero__search-btn"
              onClick={() => {
                setPage(1)
                fetchCompanies()
              }}>
              🔍 Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      <div className="cs-body">
        <aside className="cs-sidebar">
          <div className="cs-sidebar__head">
            <div className="cs-sidebar__title">Bộ lọc</div>
            <span className="cs-sidebar__clear" onClick={clearFilters}>Xoá tất cả</span>
          </div>

          <div className="cs-sb-section">
            <div className="cs-sb-sec-title">Quy mô công ty</div>
            {sizes.length === 0
              ? <div style={{ fontSize: '12px', color: '#9A8D80' }}>Đang tải...</div>
              : sizes.map(s => (
                <div key={s.value} className="cs-ck-row" onClick={() => toggleSize(s.value)}>
                  <div className={`cs-ck${checkedSize[s.value] ? ' on' : ''}`}>
                    {checkedSize[s.value] ? '✓' : ''}
                  </div>
                  <span className="cs-ck-label">{s.value}</span>
                  <span className="cs-ck-count">{s.count}</span>
                </div>
              ))}
          </div>

          <div className="cs-sb-section">
            <div className="cs-sb-sec-title">Địa điểm</div>
            {selectedLocations.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                {selectedLocations.map(loc => (
                  <span key={loc} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                    background: 'rgba(192,65,42,0.1)', border: '1px solid rgba(192,65,42,0.25)',
                    color: '#C0412A', cursor: 'pointer',
                  }} onClick={() => toggleLocation(loc)}>
                    {loc} <span style={{ fontSize: '13px' }}>×</span>
                  </span>
                ))}
              </div>
            )}
            <input
              ref={provinceInputRef}
              type="text"
              placeholder="Tìm tỉnh thành..."
              value={provinceSearch}
              onChange={e => { setProvinceSearch(e.target.value); openProvinceDropdown() }}
              onFocus={openProvinceDropdown}
              onBlur={() => setTimeout(() => setProvinceDropdownOpen(false), 200)}
              style={{
                width: '100%', padding: '7px 10px', borderRadius: '7px',
                border: '1.5px solid #CBC1AE', fontSize: '12.5px',
                background: '#F7F2EA', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
        </aside>

        <main className="cs-main">
          {topCompanies.length > 0 && (
            <div className="cs-featured">
              <div className="cs-featured__hd">
                <div className="cs-featured__title">⭐ Công ty tuyển nhiều nhất</div>
              </div>
              <div className="cs-feat-row">
                {topCompanies.map(c => (
                  <div key={c.companyID} className="cs-feat-card">
                    <div className="cs-feat-logo" style={{ background: getLogoColor(c.name) }}>
                      {c.logo
                        ? <img src={c.logo} alt={c.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }}
                          onError={e => { e.target.style.display = 'none' }} />
                        : c.name?.[0]?.toUpperCase() ?? '?'
                      }
                    </div>
                    <div className="cs-feat-name">{c.name}</div>
                    <div className="cs-feat-jobs">{c.jobCount} <span>việc làm</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cs-toolbar">
            <div className="cs-result-count">
              Tìm thấy <strong>{meta.total} công ty</strong> phù hợp
            </div>
            <div className="cs-toolbar-right">
              <select className="cs-sort-sel" value={sort}
                onChange={e => setSort(e.target.value)}>
                <option value="jobs">Nhiều việc làm nhất</option>
                <option value="name">Tên A–Z</option>
              </select>
              <div className="cs-view-btns">
                <button className={`cs-view-btn${!listView ? ' on' : ''}`}
                  onClick={() => setListView(false)}>⊞</button>
                <button className={`cs-view-btn${listView ? ' on' : ''}`}
                  onClick={() => setListView(true)}>☰</button>
              </div>
            </div>
          </div>

          {loadingCompanies ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9A8D80' }}>
              ⟳ Đang tải công ty...
            </div>
          ) : companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#9A8D80' }}>
              Không tìm thấy công ty phù hợp
            </div>
          ) : (
            <div className={`cs-grid${listView ? ' list' : ''}`}>
              {companies.map(c => (
                <CompanyCard
                  key={c.companyID}
                  company={c}
                  listView={listView}
                  following={following.has(c.companyID)}
                  onFollow={toggleFollow}
                />
              ))}
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="cs-pagination">
              <button className="cs-pg-btn"
                disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {renderPages()}
              <button className="cs-pg-btn"
                disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}