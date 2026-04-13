import { useState, useEffect, useCallback, useRef } from 'react'
import './HomeScreen.css'
import JobCard from '../../common/JobCard/JobCard'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../../utils/auth'

const API = 'http://localhost:3000/api'

const PLATFORMS = [
  { value: 'Tất cả', label: 'Tất cả', color: '#efa85c' },
  { value: 'CareerViet', label: 'CareerViet', color: '#1565C0' },
  { value: 'TopCV', label: 'TopCV', color: '#00B14F' },
  { value: 'CareerLink', label: 'CareerLink', color: '#D0392A' },
  // { value: 'VietnamWorks', label: 'VietnamWorks', color: '#F47820' },
]

const COLOR_POOL = [
  { color: '#1565C0', bg: '#E3EEF9' },
  { color: '#2E6040', bg: '#E0F0E6' },
  { color: '#C0412A', bg: '#FDE8E4' },
  { color: '#880E4F', bg: '#FDE8F3' },
  { color: '#4A148C', bg: '#EDE7F6' },
  { color: '#1B5E20', bg: '#E8F5E9' },
  { color: '#7B1FA2', bg: '#F3E5F5' },
  { color: '#1A3A6A', bg: '#E3EEF9' },
  { color: '#BF360C', bg: '#FBE9E7' },
  { color: '#006064', bg: '#E0F7FA' },
  { color: '#37474F', bg: '#ECEFF1' },
  { color: '#D4820A', bg: '#FEF0D0' },
  { color: '#0277BD', bg: '#E1F5FE' },
  { color: '#6A1B9A', bg: '#EDE7F6' },
  { color: '#2E7D32', bg: '#E8F5E9' },
  { color: '#4E342E', bg: '#EFEBE9' },
  { color: '#AD1457', bg: '#FCE4EC' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'deadline', label: 'Sắp hết hạn' },
  { value: 'salary', label: 'Lương cao nhất' },
]

const REC_LIMIT = 6
const CAT_PAGE_SIZE = 8

export default function HomeScreen() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => getToken())
  const resultsRef = useRef(null)

  const [jobs, setJobs] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [industries, setIndustries] = useState([])
  const [catPage, setCatPage] = useState(0)
  const [activePlatform, setActivePlatform] = useState('Tất cả')
  const [loadingIndustries, setLoadingIndustries] = useState(false)

  const [stats, setStats] = useState(null)
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [recPage, setRecPage] = useState(1)
  const [industryFilter, setIndustryFilter] = useState(null)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState(new Set())

  const pagedRecs = recommendations.slice((recPage - 1) * REC_LIMIT, recPage * REC_LIMIT)
  const recTotalPages = Math.ceil(recommendations.length / REC_LIMIT)
  const catTotalPages = Math.ceil(industries.length / CAT_PAGE_SIZE)
  const pagedIndustries = industries.slice(catPage * CAT_PAGE_SIZE, (catPage + 1) * CAT_PAGE_SIZE)

  useEffect(() => {
    const sync = () => setToken(getToken())
    window.addEventListener('focus', sync)
    sync()
    return () => window.removeEventListener('focus', sync)
  }, [])

  useEffect(() => { setSort('newest'); setPage(1) }, [token])

  useEffect(() => {
    setLoadingIndustries(true)
    setCatPage(0)
    setIndustryFilter(null)
    fetch(`${API}/jobs/filter-by-source?source=${encodeURIComponent(activePlatform)}`)
      .then(r => r.json())
      .then(data => {
        const raw = data?.industries ?? []
        const enriched = raw.map((ind, i) => {
          const palette = COLOR_POOL[i % COLOR_POOL.length]
          const letter = ind.name?.trim()?.[0]?.toUpperCase() ?? '?'
          return { ...ind, ...palette, letter }
        })
        setIndustries(enriched)
      })
      .catch(console.error)
      .finally(() => setLoadingIndustries(false))
  }, [activePlatform])

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '9', sort })
      if (keyword) params.set('keyword', keyword)
      if (location) params.append('locations', location)
      if (industryFilter) params.set('industryId', String(industryFilter))
      if (activePlatform && activePlatform !== 'Tất cả') params.set('source', activePlatform)
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`${API}/jobs?${params}`, { headers })
      const data = await res.json()
      setJobs(data.data ?? [])
      setMeta(data.meta ?? { total: 0, totalPages: 1 })
    } catch (err) {
      console.error('Fetch jobs error:', err)
    } finally {
      setLoadingJobs(false)
    }
  }, [page, sort, keyword, location, industryFilter, token, activePlatform])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  useEffect(() => {
    if (!token) { setRecommendations([]); return }
    setLoadingRecs(true)
    fetch(`${API}/jobs/recommendations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setRecommendations(Array.isArray(data) ? data : []); setRecPage(1) })
      .catch(console.error)
      .finally(() => setLoadingRecs(false))
  }, [token])

  useEffect(() => {
    if (!token) { setStats(null); return }
    setLoadingStats(true)
    fetch(`${API}/jobs/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoadingStats(false))
  }, [token])

  useEffect(() => {
    if (!token) { setSavedJobIds(new Set()); return }
    fetch(`${API}/jobs/saved`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const ids = new Set((Array.isArray(data) ? data : []).map(s => s.job.jobID))
        setSavedJobIds(ids)
      })
      .catch(console.error)
  }, [token])

  const trackBehavior = useCallback((jobID, action) => {
    if (!token) return
    fetch(`${API}/jobs/${jobID}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    }).catch(console.error)
  }, [token])

  const handleJobClick = (job) => {
    trackBehavior(job.jobID, 'click')
    navigate(`/home/job/${job.jobID}`)
  }

  const handleSearch = () => {
    setPage(1)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleIndustryClick = (indId) => {
    setIndustryFilter(prev => prev === indId ? null : indId)
    setPage(1)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const renderPages = (curPage, totalPages, onPageChange) => {
    const pages = []
    const addBtn = (n) => pages.push(
      <button key={n} className={`hs-pg-btn${curPage === n ? ' hs-pg-active' : ''}`}
        onClick={() => onPageChange(n)}>{n}</button>
    )
    const addDots = (k) => pages.push(<span key={k} className="hs-pg-dots">…</span>)
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) addBtn(i)
    } else {
      addBtn(1)
      if (curPage > 3) addDots('d1')
      const start = Math.max(2, curPage - 1)
      const end = Math.min(totalPages - 1, curPage + 1)
      for (let i = start; i <= end; i++) addBtn(i)
      if (curPage < totalPages - 2) addDots('d2')
      addBtn(totalPages)
    }
    return pages
  }

  const Pagination = ({ curPage, totalPages, onPageChange }) => (
    <div className="hs-pagination">
      <button className="hs-pg-btn hs-pg-arrow" disabled={curPage === 1}
        onClick={() => onPageChange(curPage - 1)}>‹</button>
      {renderPages(curPage, totalPages, onPageChange)}
      <button className="hs-pg-btn hs-pg-arrow" disabled={curPage === totalPages}
        onClick={() => onPageChange(curPage + 1)}>›</button>
      <div className="hs-pg-jump">
        <span className="hs-pg-jump-lbl">Đến trang</span>
        <input className="hs-pg-jump-inp" type="number" min={1} max={totalPages}
          defaultValue={curPage} key={curPage}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const v = Math.max(1, Math.min(totalPages, +e.target.value))
              onPageChange(v)
            }
          }} />
      </div>
    </div>
  )

  const renderJobCard = (job) => (
    <div key={job.jobID} style={{ cursor: 'pointer' }}
      onClick={() => handleJobClick(job)}>
      <JobCard
        key={`${job.jobID}-${savedJobIds.has(job.jobID)}`}
        token={token}
        job={{
          id: job.jobID,
          title: job.title,
          company: job.companyName,
          companyID: job.companyID,
          companyLogo: job.companyLogo,
          location: job.location,
          shortLocation: job.shortLocation,
          experienceYear: job.experienceYear,
          salary: job.salary,
          tags: job.skills ?? [],
          platform: job.sourcePlatform,
          sourceLink: job.sourceLink,
          type: job.jobType,
          match: job.matchPercent != null ? Math.round(job.matchPercent) : null,
          isSaved: savedJobIds.has(job.jobID),
        }}
        onSave={(jobID) => { if (!savedJobIds.has(jobID)) trackBehavior(jobID, 'save') }}
        onCompanyClick={(companyID) => navigate(`/home/companies/${companyID}`)}
      />
    </div>
  )

  return (
    <div className="hs-page">

      <div className="hs-hero">
        <div className="hs-hero-noise" />
        <div className="hs-hero-glow1" />
        <div className="hs-hero-glow2" />
        <div className="hs-hero-inner">
          <div className="hs-hero-left">
            <h1 className="hs-hero-title">
              Khám phá <em>cơ hội</em><br />dành riêng cho bạn
            </h1>
            <p className="hs-hero-sub">
              AI tổng hợp từ TopCV, CareerLink, CareerViet.
            </p>
            <div className="hs-hero-search">
              <div className="hs-sf">
                <span className="hs-sf-ico">🔍</span>
                <input className="hs-sf-inp" placeholder="Tên công việc, kỹ năng..."
                  value={keyword} onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <div className="hs-sf hs-sf-loc">
                <span className="hs-sf-ico">📍</span>
                <input className="hs-sf-inp" placeholder="Địa điểm..."
                  value={location} onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <button className="hs-search-btn" onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </div>

          <div className="hs-hero-right">
            <div className="hs-stat hs-stat-accent">
              <div className="hs-stat-ico">🎯</div>
              <div className="hs-stat-n">{loadingStats ? '…' : (stats?.jobMatch.count ?? '—')}</div>
              <div className="hs-stat-l">Việc phù hợp hôm nay</div>
              <div className="hs-stat-s">
                {stats ? `${stats.jobMatch.delta} so với hôm qua` : token ? 'Đang tải...' : 'Đăng nhập để xem'}
              </div>
            </div>
            {/* <div className="hs-stat">
              <div className="hs-stat-ico">📨</div>
              <div className="hs-stat-n" style={{ color: '#2E6040' }}>{loadingStats ? '…' : (stats?.applied.count ?? '—')}</div>
              <div className="hs-stat-l">Đã nộp tháng này</div>
              <div className="hs-stat-s">
                {stats ? `${stats.applied.pending} chờ phản hồi` : token ? 'Đang tải...' : 'Đăng nhập để xem'}
              </div>
            </div> */}
            {/* <div className="hs-stat">
              <div className="hs-stat-ico">📊</div>
              <div className="hs-stat-n" style={{ color: '#D4820A' }}>{loadingStats ? '…' : stats ? `${stats.replyRate.percent}%` : '—'}</div>
              <div className="hs-stat-l">Tỷ lệ phản hồi</div>
              <div className="hs-stat-s">{!token && 'Đăng nhập để xem'}</div>
            </div> */}
            {/* <div className="hs-stat">
              <div className="hs-stat-ico">🗓️</div>
              <div className="hs-stat-n">{loadingStats ? '…' : (stats?.interviews.count ?? '—')}</div>
              <div className="hs-stat-l">Phỏng vấn sắp tới</div>
              <div className="hs-stat-s">
                {stats?.interviews.next ?? (token ? 'Chưa có lịch' : 'Đăng nhập để xem')}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="hs-body">

        <div className="hs-cats-wrap" style={{ margin: '0 -32px', padding: '40px 32px 48px' }}>
          <div className="hs-cats-header">
            <div className="hs-cats-titles">
              <div className="hs-cats-label">Danh mục nghề nghiệp</div>
              <h2 className="hs-cats-title">Khám phá theo <em>lĩnh vực</em></h2>
            </div>
            {industryFilter && (
              <button className="hs-cats-see-all"
                onClick={() => { setIndustryFilter(null); setPage(1) }}>
                ✕ Bỏ lọc lĩnh vực
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => (
              <button key={p.value}
                onClick={() => setActivePlatform(p.value)}
                style={{
                  padding: '7px 18px', borderRadius: 9,
                  border: `2px solid ${activePlatform === p.value ? p.color : '#DDD6C6'}`,
                  background: activePlatform === p.value ? p.color : '#FEFCF7',
                  color: activePlatform === p.value ? '#fff' : '#6B5E50',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'all .15s', fontFamily: 'Roboto, sans-serif',
                }}>
                {p.label}
              </button>
            ))}
          </div>

          {loadingIndustries ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9A8D80', fontSize: 14 }}>
              ⟳ Đang tải ngành nghề...
            </div>
          ) : industries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9A8D80', fontSize: 14 }}>
              Không có dữ liệu
            </div>
          ) : (
            <>
              <div className="hs-cats-grid">
                {pagedIndustries.map(cat => (
                  <div key={cat.id}
                    className={`hs-cat-card${industryFilter === cat.id ? ' hs-cat-card--active' : ''}`}
                    style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
                    onClick={() => handleIndustryClick(cat.id)}>
                    <div className="hs-cat-icon-wrap">
                      <span style={{
                        fontSize: 20, fontWeight: 800,
                        color: cat.color,
                        fontFamily: 'Roboto, sans-serif',
                        lineHeight: 1,
                        userSelect: 'none',
                      }}>
                        {cat.letter}
                      </span>
                    </div>
                    <div className="hs-cat-body">
                      <div className="hs-cat-name">{cat.name}</div>
                      <div className="hs-cat-count">{cat.count?.toLocaleString()} việc làm</div>
                    </div>
                    <div className="hs-cat-arrow">→</div>
                  </div>
                ))}
              </div>

              {catTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <button className="hs-pg-btn hs-pg-arrow" disabled={catPage === 0}
                    onClick={() => setCatPage(p => p - 1)}>‹</button>
                  {Array.from({ length: catTotalPages }, (_, i) => (
                    <button key={i}
                      className={`hs-pg-btn${catPage === i ? ' hs-pg-active' : ''}`}
                      onClick={() => setCatPage(i)}>{i + 1}</button>
                  ))}
                  <button className="hs-pg-btn hs-pg-arrow" disabled={catPage === catTotalPages - 1}
                    onClick={() => setCatPage(p => p + 1)}>›</button>
                  <span style={{ fontSize: 12, color: '#9A8D80', marginLeft: 4 }}>
                    {industries.length} ngành · trang {catPage + 1}/{catTotalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {!token && (
          <div ref={resultsRef} style={{ marginTop: 32 }}>
            <div className="hs-sec-hd">
              <span className="hs-sec-title">📋 Danh sách việc làm</span>
              <div className="hs-sec-line" />
              <span className="hs-sec-ct">{meta.total} kết quả</span>
            </div>
            <div className="hs-toolbar">
              <span className="hs-count">
                Tìm thấy <strong>{meta.total.toLocaleString()} việc làm</strong>
                {industryFilter ? ' trong lĩnh vực đã chọn' : ''}
                {keyword ? ` cho "${keyword}"` : ''}
              </span>
              <select className="hs-sort" value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {loadingJobs ? (
              <div className="hs-loading">⟳ Đang tải việc làm...</div>
            ) : jobs.length === 0 ? (
              <div className="hs-empty">Không tìm thấy việc làm</div>
            ) : (
              <div className="hs-grid">{jobs.map(job => renderJobCard(job))}</div>
            )}
            {meta.totalPages > 1 && (
              <Pagination curPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}
          </div>
        )}

        {token && (
          <div ref={resultsRef} style={{ marginTop: 32 }}>
            <div className="hs-sec-hd">
              <span className="hs-sec-title">🎯 Việc làm phù hợp với bạn</span>
              <div className="hs-sec-line" />
              <span className="hs-sec-ct">{recommendations.length} kết quả</span>
            </div>
            {loadingRecs ? (
              <div className="hs-loading">⟳ Đang tải việc làm...</div>
            ) : recommendations.length === 0 ? (
              <div className="hs-empty">Chưa có gợi ý — hãy cập nhật kỹ năng trong hồ sơ</div>
            ) : (
              <>
                <div className="hs-grid">{pagedRecs.map(job => renderJobCard(job))}</div>
                {recTotalPages > 1 && (
                  <Pagination curPage={recPage} totalPages={recTotalPages} onPageChange={setRecPage} />
                )}
              </>
            )}

            <div className="hs-toolbar" style={{ marginTop: 32 }}>
              <span className="hs-count">
                Tìm thấy <strong>{meta.total.toLocaleString()} việc làm</strong>
                {industryFilter ? ' trong lĩnh vực đã chọn' : ''}
                {keyword ? ` cho "${keyword}"` : ''}
              </span>
              <select className="hs-sort" value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="hs-sec-hd">
              <span className="hs-sec-title">💼 Tất cả việc làm</span>
              <div className="hs-sec-line" />
              <span className="hs-sec-ct">{meta.total} kết quả</span>
            </div>
            {loadingJobs ? (
              <div className="hs-loading">⟳ Đang tải...</div>
            ) : jobs.length === 0 ? (
              <div className="hs-empty">Không tìm thấy việc làm</div>
            ) : (
              <div className="hs-grid">{jobs.map(job => renderJobCard(job))}</div>
            )}
            {meta.totalPages > 1 && (
              <Pagination curPage={page} totalPages={meta.totalPages} onPageChange={setPage} />
            )}
          </div>
        )}

      </div>
    </div>
  )
}