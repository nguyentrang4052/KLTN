import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import './HomeScreen.css'
import JobCard from '../../common/JobCard/JobCard'
import { getToken } from '../../../utils/auth'
import TrendDashboard from './TrendDashboard'
import { API } from '../../../config/api'


const PLATFORMS = [
  { value: 'Tất cả', label: 'Tất cả', color: '#efa85c' },
  { value: 'CareerViet', label: 'CareerViet', color: '#1565C0' },
  { value: 'TopCV', label: 'TopCV', color: '#00B14F' },
  { value: 'CareerLink', label: 'CareerLink', color: '#D0392A' },
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
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const resultsRef = useRef(null)
  const [token, setToken] = useState(() => getToken())
  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '')
  const [locationFilter, setLocationFilter] = useState(() => {
    const loc = searchParams.get('location')
    return loc ? loc.split(',').filter(Boolean) : []
  })

  const [locOpen, setLocOpen] = useState(false)
  const locRef = useRef(null)
  const [locPos, setLocPos] = useState({ top: 0, left: 0, width: 0 })
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'))
  const [industryFilter, setIndustryFilter] = useState(() => {
    const ind = searchParams.get('industry')
    return ind ? parseInt(ind) : null
  })
  const [activePlatform, setActivePlatform] = useState(() =>
    searchParams.get('platform') || 'Tất cả'
  )

  const [jobs, setJobs] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [industries, setIndustries] = useState([])
  const [catPage, setCatPage] = useState(0)
  const [loadingIndustries, setLoadingIndustries] = useState(false)

  const [stats, setStats] = useState(null)
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [recPage, setRecPage] = useState(1)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const [refreshingRecs, setRefreshingRecs] = useState(false)

  const [crawlStatus, setCrawlStatus] = useState(null)
  const eventSourceRef = useRef(null)
  const [locations, setLocations] = useState([])

  const pageRef = useRef(page)
  const sortRef = useRef(sort)
  const keywordRef = useRef(keyword)
  const industryFilterRef = useRef(industryFilter)
  const activePlatformRef = useRef(activePlatform)
  const locationFilterRef = useRef(locationFilter)
  const tokenRef = useRef(token)
  const [recQuota, setRecQuota] = useState(null)

  const [suggestions, setSuggestions] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchInputRef = useRef(null)
  const [searchPos, setSearchPos] = useState({ top: 0, left: 0, width: 0 })
  const debounceRef = useRef(null)
  const [refreshMessage, setRefreshMessage] = useState(null)

  useEffect(() => { pageRef.current = page }, [page])
  useEffect(() => { sortRef.current = sort }, [sort])
  useEffect(() => { keywordRef.current = keyword }, [keyword])
  useEffect(() => { industryFilterRef.current = industryFilter }, [industryFilter])
  useEffect(() => { activePlatformRef.current = activePlatform }, [activePlatform])
  useEffect(() => { locationFilterRef.current = locationFilter }, [locationFilter])
  useEffect(() => { tokenRef.current = token }, [token])

  const searchParamsRef = useRef(searchParams)
  useEffect(() => { searchParamsRef.current = searchParams }, [searchParams])

  useEffect(() => {
    const handler = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLocOpen = () => {
    if (locRef.current) {
      const rect = locRef.current.getBoundingClientRect()
      setLocPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 220),
      })
    }
    setLocOpen(o => !o)
  }

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect()
      setSearchPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
    setShowDropdown(true)
  }

  useEffect(() => {
    fetch(`${API}/common/locations`)
      .then(r => r.json())
      .then(data => setLocations(data))
      .catch(console.error)
  }, [])

  const updateURLParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParamsRef.current)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'Tất cả') {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    setSearchParams(newParams, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    updateURLParams({
      keyword: keyword || null,
      page: page > 1 ? page : null,
      sort: sort !== 'newest' ? sort : null,
      industry: industryFilter || null,
      platform: activePlatform !== 'Tất cả' ? activePlatform : null,
      location: locationFilter.length > 0 ? locationFilter.join(',') : null,
    })
  }, [keyword, page, sort, industryFilter, activePlatform, locationFilter, updateURLParams])

  useEffect(() => {
    if (location.state?.scrollY) {
      const timer = setTimeout(() => {
        window.scrollTo(0, location.state.scrollY)
        navigate(location.pathname + location.search, { replace: true, state: {} })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [location, navigate])

  useEffect(() => {
    const sync = () => setToken(getToken())
    window.addEventListener('focus', sync)
    sync()
    return () => window.removeEventListener('focus', sync)
  }, [])

  useEffect(() => {
    if (!token) {
      setSort('newest')
      setPage(1)
    }
  }, [token])

  useEffect(() => {
    setLoadingIndustries(true)
    setCatPage(0)
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

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages && newPage !== page) {
      setPage(newPage)
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [page, meta.totalPages])

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true)
    try {
      const params = new URLSearchParams({
        page: String(pageRef.current),
        limit: '9',
        sort: sortRef.current,
      })
      if (keywordRef.current) params.set('keyword', keywordRef.current)
      const locs = locationFilterRef.current
      if (locs.length > 0) locs.forEach(loc => params.append('locations', loc))
      if (industryFilterRef.current) params.set('industryId', String(industryFilterRef.current))
      if (activePlatformRef.current && activePlatformRef.current !== 'Tất cả')
        params.set('source', activePlatformRef.current)

      const headers = tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}
      const res = await fetch(`${API}/jobs?${params}`, { headers })
      const data = await res.json()
      setJobs(data.data ?? [])
      setMeta(data.meta ?? { total: 0, totalPages: 1 })
    } catch (err) {
      console.error('Fetch jobs error:', err)
    } finally {
      setLoadingJobs(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [page, sort, keyword, industryFilter, activePlatform, token, fetchJobs])

  const prevLocationFilterRef = useRef(locationFilter)
  useEffect(() => {
    const prev = prevLocationFilterRef.current
    const curr = locationFilter
    if (JSON.stringify(prev) !== JSON.stringify(curr)) {
      prevLocationFilterRef.current = curr
      fetchJobs()
    }
  }, [locationFilter, fetchJobs])

  useEffect(() => {
    if (!token) { setRecommendations([]); setRecQuota(null); return }
    setLoadingRecs(true)
    fetch(`${API}/jobs/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => {
        setRecommendations(Array.isArray(res) ? res : (res.data ?? []))
        setRecQuota(Array.isArray(res) ? null : (res.quota ?? null))
        setRecPage(1)
      })
      .catch(console.error)
      .finally(() => setLoadingRecs(false))
  }, [token])

  const handleRefreshRecommendations = async () => {
    if (!token || refreshingRecs) return
    setRefreshingRecs(true)
    try {
      const res = await fetch(`${API}/jobs/recommendations/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setRecommendations(Array.isArray(data) ? data : (data.data ?? []))
      setRecQuota(Array.isArray(data) ? null : (data.quota ?? null))
      setRecPage(1)

      if (data.message) {
        setRefreshMessage({ text: data.message, isNew: data.hasChanged })
      }
    } catch (err) {
      console.error('Refresh recs error:', err)
    } finally {
      setRefreshingRecs(false)
    }
  }

  useEffect(() => {
    if (!token) { setStats(null); return }
    setLoadingStats(true)
    fetch(`${API}/jobs/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoadingStats(false))
  }, [token, recommendations.length])

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

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close()
    }
  }, [])

  useEffect(() => {
    if (!token) { setSearchHistory([]); return }
    fetch(`${API}/jobs/search-history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setSearchHistory(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [token])

  const handleKeywordChange = (e) => {
    const val = e.target.value
    setKeyword(val)
    keywordRef.current = val
    setShowDropdown(true)
    clearTimeout(debounceRef.current)
    if (!val.trim()) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/jobs/search-suggestions?q=${encodeURIComponent(val)}`)
        const data = await res.json()
        setSuggestions(Array.isArray(data) ? data : [])
      } catch { setSuggestions([]) }
    }, 250)
  }

  const trackBehavior = useCallback((jobID, action) => {
    if (!token) return
    fetch(`${API}/jobs/${jobID}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    }).catch(console.error)
  }, [token])

  const handleJobClick = (job) => {
    const currentScrollY = window.scrollY
    if (!job.jobID || typeof job.jobID !== 'number') {
      console.error('Lỗi: jobID không hợp lệ!', job)
      alert('Lỗi: Không tìm thấy ID công việc.')
      return
    }
    trackBehavior(job.jobID, 'view')
    navigate(`/home/job/${job.jobID}`, {
      state: { scrollY: currentScrollY, fromPath: location.pathname + location.search }
    })
  }

  const handleSearch = async () => {
    setPage(1)
    pageRef.current = 1
    updateURLParams({
      keyword: keywordRef.current || null,
      location: locationFilter.length > 0 ? locationFilter.join(',') : null,
      page: null,
    })
    if (keywordRef.current?.trim() && token) {
      try {
        await fetch(`${API}/jobs/search-history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ keyword: keywordRef.current.trim() }),
        })
        const res = await fetch(`${API}/jobs/search-history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setSearchHistory(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
    }
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleQuickSearch = useCallback((kw) => {
    const trimmed = kw.trim()
    keywordRef.current = trimmed
    setKeyword(trimmed)
    setPage(1)
    pageRef.current = 1
    setSuggestions([])
    setShowDropdown(false)
    updateURLParams({ keyword: trimmed || null, page: null })
  }, [updateURLParams])

  const handleIndustryClick = (indId) => {
    const newIndustry = industryFilter === indId ? null : indId
    setIndustryFilter(newIndustry)
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
    <div key={job.jobID} style={{ cursor: 'pointer', position: 'relative' }}
      onClick={(e) => {
        if (e.defaultPrevented) return
        handleJobClick(job)
      }}>
      {job.isNewJob && (
        <span style={{
          position: 'absolute', top: '-8px', right: '-8px',
          background: '#FF4757', color: 'white',
          padding: '4px 8px', borderRadius: '12px',
          fontSize: '11px', fontWeight: 'bold', zIndex: 10,
        }}>MỚI</span>
      )}
      <JobCard
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

  const pagedRecs = recommendations.slice((recPage - 1) * REC_LIMIT, recPage * REC_LIMIT)
  const recTotalPages = Math.ceil(recommendations.length / REC_LIMIT)
  const catTotalPages = Math.ceil(industries.length / CAT_PAGE_SIZE)
  const pagedIndustries = industries.slice(catPage * CAT_PAGE_SIZE, (catPage + 1) * CAT_PAGE_SIZE)

  const showSearchDropdown = showDropdown && (
    (keyword.trim() && suggestions.length > 0) ||
    (!keyword.trim() && searchHistory.length > 0)
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
              <div className="hs-sf" ref={searchInputRef}>
                <span className="hs-sf-ico">🔍</span>
                <input
                  className="hs-sf-inp"
                  placeholder="Tên công việc, kỹ năng..."
                  value={keyword}
                  onChange={handleKeywordChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { setShowDropdown(false); handleSearch() }
                    if (e.key === 'Escape') setShowDropdown(false)
                  }}
                />
                {keyword && (
                  <button className="hs-loc-clear" onClick={() => {
                    keywordRef.current = ''
                    setKeyword('')
                    setSuggestions([])
                    setShowDropdown(false)
                    updateURLParams({ keyword: null, page: null })
                  }}>×</button>
                )}
              </div>

              {showSearchDropdown && createPortal(
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9996 }}
                    onMouseDown={(e) => { e.preventDefault(); setShowDropdown(false) }}
                  />
                  <div className="hs-search-dropdown" style={{
                    position: 'absolute',
                    top: searchPos.top,
                    left: searchPos.left,
                    width: Math.max(searchPos.width, 320),
                    zIndex: 9997,
                  }}>
                    {!keyword.trim() && searchHistory.length > 0 && (
                      <>
                        <div className="hs-sd-section-hd">
                          <span>Tìm kiếm gần đây</span>
                        </div>
                        {searchHistory.map((h, i) => (
                          <div key={i} className="hs-sd-item"
                            onMouseDown={(e) => { e.preventDefault(); handleQuickSearch(h) }}>
                            <span className="hs-sd-ico">🕐</span>
                            <span className="hs-sd-item-text">{h}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {keyword.trim() && suggestions.length > 0 && (
                      <>
                        <div className="hs-sd-section-hd"><span>Gợi ý</span></div>
                        {suggestions.map((s, i) => (
                          <div key={i} className="hs-sd-item"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              const selectedKeyword = typeof s === 'object' ? s.display : s
                              setKeyword(selectedKeyword)
                              setShowDropdown(false)
                              navigate(`?keyword=${encodeURIComponent(selectedKeyword)}&page=1`)
                            }}>
                            <span className="hs-sd-ico">🔍</span>
                            <span className="hs-sd-item-text">
                              {typeof s === 'object' ? s.display : s}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </>,
                document.body
              )}

              <div className="hs-sf hs-sf-loc" ref={locRef}>
                <span className="hs-sf-ico">📍</span>
                <div
                  className="hs-loc-display"
                  style={{ color: locationFilter.length > 0 ? '#1C1510' : '#9A8D80' }}
                  onClick={handleLocOpen}
                >
                  {locationFilter.length === 0 ? 'Địa điểm...'
                    : locationFilter.length === 1 ? locationFilter[0]
                      : `${locationFilter.length} địa điểm`}
                </div>
                {locationFilter.length > 0 && (
                  <button className="hs-loc-clear" onClick={() => setLocationFilter([])}>×</button>
                )}
              </div>

              {locOpen && createPortal(
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                    onClick={() => setLocOpen(false)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: locPos.top, left: locPos.left, width: locPos.width,
                    zIndex: 9999, background: '#FEFCF7',
                    border: '1.5px solid #DDD6C6', borderRadius: 10,
                    boxShadow: '0 8px 32px rgba(0,0,0,.15)',
                    maxHeight: 280, overflowY: 'auto',
                  }}>
                    {locations.map(loc => {
                      const selected = locationFilter.includes(loc.value)
                      return (
                        <div key={loc.value}
                          className={`hs-loc-item${selected ? ' selected' : ''}`}
                          onClick={() => setLocationFilter(prev =>
                            selected ? prev.filter(l => l !== loc.value) : [...prev, loc.value]
                          )}>
                          <span className="hs-loc-checkbox">{selected ? '✓' : ''}</span>
                          {loc.label}
                        </div>
                      )
                    })}
                  </div>
                </>,
                document.body
              )}

              <button className="hs-search-btn" onClick={handleSearch}>Tìm kiếm</button>
            </div>

            {locationFilter.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {locationFilter.map(loc => (
                  <span key={loc} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: 'rgba(255,255,255,.15)', color: '#F5EED8',
                    border: '1px solid rgba(255,255,255,.25)',
                  }}>
                    📍 {loc}
                    <span style={{ cursor: 'pointer', opacity: .7 }}
                      onClick={() => setLocationFilter(prev => prev.filter(l => l !== loc))}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hs-body">
        <div style={{ marginBottom: 40 }}>
          <TrendDashboard onIndustryClick={(indId) => {
            setIndustryFilter(indId)
            setPage(1)
            setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
          }} />
        </div>

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
                onClick={() => { setActivePlatform(p.value); setPage(1) }}
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
                        fontSize: 20, fontWeight: 800, color: cat.color,
                        fontFamily: 'Roboto, sans-serif', lineHeight: 1, userSelect: 'none',
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
              <Pagination curPage={page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        )}

        {token && (
          <div ref={resultsRef} style={{ marginTop: 32 }}>
            <div className="hs-sec-hd">
              <span className="hs-sec-title">🎯 Việc làm phù hợp với bạn</span>
              <div className="hs-sec-line" />
              <span className="hs-sec-ct">{recommendations.length} kết quả</span>
              {!recQuota?.quotaExceeded && (
                <button
                  onClick={handleRefreshRecommendations}
                  disabled={refreshingRecs}
                  style={{
                    padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    background: refreshingRecs ? '#EDE8DF' : 'linear-gradient(135deg,#232AA2,#1565C0)',
                    color: refreshingRecs ? '#9A8D80' : '#fff',
                    border: 'none', cursor: refreshingRecs ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all .18s', flexShrink: 0,
                  }}
                >
                  {refreshingRecs ? '⟳ Đang tải...' : '✨ Nhận đề xuất'}
                </button>
              )}
            </div>

            {refreshMessage && (
              <div style={{
                padding: '10px 16px', marginBottom: 12, borderRadius: 10, fontSize: 13,
                background: refreshMessage.isNew ? '#E8F5E9' : '#FFF8E1',
                border: `1px solid ${refreshMessage.isNew ? '#C3E6CB' : '#FFE082'}`,
                color: refreshMessage.isNew ? '#2E6040' : '#7B5800',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>{refreshMessage.isNew ? '✅' : '💡'}</span>
                <span>{refreshMessage.text}</span>
                <button onClick={() => setRefreshMessage(null)} style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 14, color: 'inherit', opacity: 0.6,
                }}>✕</button>
              </div>
            )}

            {recQuota && !recQuota.isUnlimited && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 18px', marginBottom: 14, borderRadius: 10,
                background: recQuota.quotaExceeded ? '#FDE8E4' : '#F0F7FF',
                border: `1px solid ${recQuota.quotaExceeded ? '#F5C0B0' : '#C8DFF8'}`,
                fontSize: 13,
              }}>
                <span style={{ fontWeight: 600, color: recQuota.quotaExceeded ? '#C0412A' : '#1565C0' }}>
                  💡 Lượt đề xuất hôm nay: {recQuota.usedToday}/{recQuota.limit}
                  {recQuota.quotaExceeded
                    ? ' · Đã hết lượt'
                    : ` · Còn ${recQuota.remaining} lượt`}
                </span>
                {recQuota.quotaExceeded && (
                  <button onClick={() => navigate('/services')} style={{
                    padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                    background: 'linear-gradient(135deg,#C0412A,#E05A40)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                  }}>
                    ⚡ Nâng cấp →
                  </button>
                )}
              </div>
            )}

            {loadingRecs || refreshingRecs ? (
              <div className="hs-loading">⟳ Đang tải việc làm...</div>
            ) : recommendations.length === 0 ? (
              <div className="hs-empty">
                Nhấn <strong>✨ Nhận đề xuất</strong> để AI tìm việc phù hợp với bạn
              </div>
            ) : (
              <>
                <div className="hs-grid">
                  {pagedRecs.map(job => renderJobCard(job))}
                  {recQuota?.quotaExceeded && recPage === recTotalPages && (
                    <div onClick={() => navigate('/services')} style={{
                      cursor: 'pointer', borderRadius: 14, border: '2px dashed #F5C0B0',
                      background: 'linear-gradient(135deg,#FFF5F3,#FDE8E4)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: '28px 20px', gap: 10, textAlign: 'center', minHeight: 160,
                    }}>
                      <div style={{ fontSize: 28 }}>🔒</div>
                      <div style={{ fontWeight: 700, color: '#C0412A', fontSize: 14 }}>Còn nhiều việc phù hợp với bạn</div>
                      <div style={{ color: '#9A8D80', fontSize: 12 }}>Nâng cấp Pro để xem thêm · Reset quota vào ngày mai</div>
                      <div style={{ padding: '6px 16px', borderRadius: 8, fontWeight: 700, fontSize: 12, background: 'linear-gradient(135deg,#C0412A,#E05A40)', color: '#fff' }}>Nâng cấp ngay →</div>
                    </div>
                  )}
                </div>
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

            {crawlStatus && (
              <div style={{
                padding: '16px 24px', margin: '20px 0',
                background: crawlStatus.type === 'deep' ? '#D1ECF1' : crawlStatus.type === 'error' ? '#F8D7DA' : '#D4EDDA',
                border: `1px solid ${crawlStatus.type === 'deep' ? '#74B9FF' : crawlStatus.type === 'error' ? '#F5C6CB' : '#C3E6CB'}`,
                borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '20px' }}>
                  {crawlStatus.type === 'searching' && '🔍'}
                  {crawlStatus.type === 'streaming' && '📥'}
                  {crawlStatus.type === 'deep' && '🔍'}
                  {crawlStatus.type === 'done' && '✅'}
                  {crawlStatus.type === 'error' && '❌'}
                </span>
                <span style={{ flex: 1, fontWeight: 600, color: crawlStatus.type === 'error' ? '#721C24' : '#333' }}>
                  {crawlStatus.message}
                </span>
                {['searching', 'streaming', 'deep'].includes(crawlStatus.type) && (
                  <span style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                )}
              </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
              <Pagination curPage={page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}