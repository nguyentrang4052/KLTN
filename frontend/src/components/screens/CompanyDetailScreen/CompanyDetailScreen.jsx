import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './CompanyDetailScreen.css'

const API = 'http://localhost:3000/api'
const JOBS_PER_PAGE = 10

function matchCls(n) { return n >= 85 ? 'mc-hi' : n >= 70 ? 'mc-md' : 'mc-lo' }

function daysLeft(deadline) {
  if (!deadline) return 'Chưa cập nhật'
  const days = Math.max(0, Math.ceil((new Date(deadline) - Date.now()) / 86400000))
  const formatted = new Date(deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  if (days === 0) return `Hết hạn hôm nay (${formatted})`
  return `Còn ${days} ngày (${formatted})`
}

function buildJobList(apiJobs = []) {
  return apiJobs.map((j) => ({
    id: j.jobID,
    title: j.title,
    type: j.jobType ?? 'Onsite',
    salary: j.salary ?? 'Thỏa thuận',
    exp: j.experienceYear ?? 'Chưa cập nhật',
    deadline: daysLeft(j.deadline),
    match: j.matchPercent ?? null,
    isNew: j.postedAt ? Date.now() - new Date(j.postedAt).getTime() < 3 * 86400000 : false,
    skills: j.skills ?? [],
    sourceLink: j.sourceLink ?? null,
    sourcePlatform: j.sourcePlatform ?? null,
  }))
}

function CompanyLogo({ logo, name, logoColor, size = 'lg' }) {
  const [imgError, setImgError] = useState(false)
  const letter = name?.[0]?.toUpperCase() ?? '?'
  useEffect(() => { setImgError(false) }, [logo])
  if (logo && !imgError) {
    return (
      <img
        className={`cd-logo cd-logo-img cd-logo-${size}`}
        src={logo} alt={name}
        onError={() => setImgError(true)}
      />
    )
  }
  return (
    <div className={`cd-logo cd-logo-${size}`} style={{ background: logoColor }}>
      {letter}
    </div>
  )
}

function ApplyModal({ job, onClose }) {
  if (!job) return null
  return (
    <div style={{
      display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
      zIndex: 6000, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surf)', borderRadius: '16px', padding: '32px',
        maxWidth: '480px', width: '90%', boxShadow: '0 24px 80px rgba(0,0,0,.3)', position: 'relative',
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', fontSize: '20px', color: 'var(--ink4)', cursor: 'pointer',
        }}>✕</button>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔗</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Chuyển đến trang ứng tuyển
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.65 }}>
            Khi nhấn <b>Đi đến trang ứng tuyển</b>, bạn sẽ được chuyển đến trang gốc để hoàn tất nộp hồ sơ.
          </div>
        </div>
        {[
          { icon: '🌐', title: 'Trang tuyển dụng gốc', desc: job.sourcePlatform ?? '' },
          { icon: '📄', title: 'Nộp hồ sơ trực tiếp', desc: 'Ứng tuyển bằng CV của bạn trên nền tảng đó' },
          { icon: '🔒', title: 'Bảo mật thông tin', desc: 'Chúng tôi không lưu thông tin hồ sơ ứng tuyển' },
          { icon: '🔗', title: 'Link chi tiết ở trang gốc', desc: job.sourceLink ?? 'Không có link trực tiếp' },
        ].map(item => (
          <div key={item.title} style={{
            display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 14px',
            background: 'var(--bg2)', borderRadius: '9px', border: '1px solid var(--border)', marginBottom: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
        <button style={{
          width: '100%', padding: '13px', fontSize: '14px', fontWeight: 700,
          background: 'rgb(35,42,162)', color: '#fff', border: 'none',
          borderRadius: '10px', cursor: job.sourceLink ? 'pointer' : 'not-allowed',
          opacity: job.sourceLink ? 1 : 0.5, marginTop: '8px',
        }} onClick={() => job.sourceLink && window.open(job.sourceLink, '_blank')}>
          Đi đến trang ứng tuyển →
        </button>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--ink4)' }}>
          Hoặc <span style={{ color: 'var(--rust)', cursor: 'pointer', fontWeight: 600 }} onClick={onClose}>
            quay lại xem việc khác
          </span>
        </div>
      </div>
    </div>
  )
}

function LoginModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      backdropFilter: 'blur(4px)', zIndex: 6000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surf)', borderRadius: '16px', padding: '32px 28px 24px',
        width: '360px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '36px', marginBottom: '4px' }}>🔐</div>
        <div style={{ fontSize: '18px', fontWeight: 700 }}>Bạn chưa đăng nhập</div>
        <div style={{ fontSize: '14px', color: 'var(--ink3)', textAlign: 'center', lineHeight: 1.5 }}>
          Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', width: '100%' }}>
          <button style={{
            flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 700,
            fontSize: '13px', cursor: 'pointer', border: '1.5px solid var(--border2)',
            background: 'transparent', color: 'var(--ink3)',
          }} onClick={onClose}>Để sau</button>
          <button style={{
            flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 700,
            fontSize: '13px', cursor: 'pointer', border: 'none',
            background: 'rgb(35,42,162)', color: '#fff',
          }} onClick={() => { window.location.href = '/login' }}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  )
}

function showToast(message) {
  const t = document.createElement('div')
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1C1510;color:#F5EED8;padding:10px 20px;border-radius:9px;font-size:13px;font-weight:600;z-index:9999'
  t.textContent = message
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 2800)
}

export default function CompanyDetailScreen({ company, onBack, token, jobBasePath = '/home/job' }) {
  const navigate = useNavigate()

  const [tab, setTab] = useState('overview')
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [matchMap, setMatchMap] = useState({})
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const [applyJob, setApplyJob] = useState(null)
  const [applyLoading, setApplyLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const [jobSearch, setJobSearch] = useState('')
  const [jobPage, setJobPage] = useState(1)

  const companyId = company?.companyID ?? company?.id

  useEffect(() => {
    if (!companyId) return
    setLoading(true)
    setTab('overview')
    setApiData(null)
    setMatchMap({})
    setJobSearch('')
    setJobPage(1)

    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    Promise.all([
      fetch(`${API}/companies/${companyId}`).then(r => r.json()),
      token
        ? fetch(`${API}/jobs/recommendations`, { headers }).then(r => r.json()).catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([companyData, recs]) => {
        setApiData(companyData)
        const map = {}
        if (Array.isArray(recs)) recs.forEach(r => { map[r.jobID] = r.matchPercent })
        setMatchMap(map)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [companyId, token])

  useEffect(() => {
    if (!token) { setSavedJobIds(new Set()); return }
    fetch(`${API}/jobs/saved`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const ids = new Set((Array.isArray(data) ? data : []).map(s => s.job?.jobID ?? s.jobID))
        setSavedJobIds(ids)
      })
      .catch(console.error)
  }, [token])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setApplyJob(null); setShowLogin(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  if (!company) return null

  const name = apiData?.name ?? company.name ?? ''
  const location = apiData?.location ?? company.location ?? 'Việt Nam'
  const size = apiData?.size ?? company.size ?? 'Chưa cập nhật nhân sự'
  const profile = apiData?.profile ?? ''
  const jobCount = apiData?.jobCount ?? company.jobs ?? 0
  const logo = apiData?.logo ?? company.logo ?? null
  const website = apiData?.website ?? company.website ?? null
  const logoColor = company.logoColor ?? 'linear-gradient(135deg,#1565C0,#1E88E5)'
  const cover = company.cover ?? 'linear-gradient(135deg,#1565C0,#42A5F5)'
  const tags = company.tags ?? []
  const industry = company.industry ?? ''
  const about = profile || `${name} là một trong những công ty hàng đầu${industry ? ` trong lĩnh vực ${industry}` : ''}.`
  const websiteDomain = website ? website.replace(/^https?:\/\//, '').split('/')[0] : null

  const allJobs = buildJobList(apiData?.jobs ?? []).map(j => ({ ...j, match: matchMap[j.id] ?? null }))

  const filteredJobs = jobSearch.trim()
    ? allJobs.filter(j =>
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.type?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.skills?.some(s => s.toLowerCase().includes(jobSearch.toLowerCase()))
    )
    : allJobs

  const totalJobPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const pagedJobs = filteredJobs.slice((jobPage - 1) * JOBS_PER_PAGE, jobPage * JOBS_PER_PAGE)

  const handleJobSearch = (val) => {
    setJobSearch(val)
    setJobPage(1)
  }

  const stats = [
    { n: size, l: 'Quy mô nhân sự' },
    { n: String(jobCount), l: 'Việc đang tuyển' },
  ]

  const TABS = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'jobs', label: `Việc làm (${allJobs.length})` },
  ]

  const handleSave = async (jobId, e) => {
    if (e) e.stopPropagation()
    if (!token) { setShowLogin(true); return }
    const isSaved = savedJobIds.has(jobId)
    try {
      await fetch(`${API}/jobs/${jobId}/save`, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      setSavedJobIds(prev => {
        const next = new Set(prev)
        isSaved ? next.delete(jobId) : next.add(jobId)
        return next
      })
      showToast(isSaved ? 'Đã bỏ lưu' : '🔖 Đã lưu việc làm!')
    } catch (err) { console.error(err) }
  }

  const trackBehavior = (jobId, action) => {
    if (!token) return
    fetch(`${API}/jobs/${jobId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    }).catch(console.error)
  }

  const handleApply = async (jobId, e) => {
    if (e) e.stopPropagation()

    // Đã đăng nhập → navigate đến JobDetailScreen
    if (token) {
      trackBehavior(jobId, 'view')
      navigate(`${jobBasePath}/${jobId}`)
      return
    }

    // Chưa đăng nhập → mở ApplyModal
    setApplyLoading(true)
    try {
      const res = await fetch(`${API}/jobs/${jobId}`)
      const data = await res.json()
      setApplyJob(data)
      trackBehavior(jobId, 'apply')
    } catch (err) {
      console.error(err)
      showToast('Không thể tải thông tin việc làm')
    } finally {
      setApplyLoading(false)
    }
  }

  const renderJobPages = () => {
    const pages = []
    const cur = jobPage
    const total = totalJobPages
    const addBtn = (n) => pages.push(
      <button key={n}
        onClick={() => setJobPage(n)}
        style={{
          width: 36, height: 36, borderRadius: 8, border: '1.5px solid',
          borderColor: cur === n ? 'rgb(35,42,162)' : '#DDD6C6',
          background: cur === n ? 'rgb(35,42,162)' : 'transparent',
          color: cur === n ? '#fff' : '#6B5E50',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>{n}</button>
    )
    const addDots = (k) => pages.push(
      <span key={k} style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: '#9A8D80' }}>…</span>
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
    <div className="cd-page">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}

      <div className="cd-breadcrumb">
        <div className="cd-bc-inner">
          <button className="cd-back" onClick={onBack}>← Quay lại</button>
          <span className="cd-bc-sep">›</span>
          <span>Công ty</span>
          <span className="cd-bc-sep">›</span>
          <span className="cd-bc-cur">{name}</span>
        </div>
      </div>

      <div className="cd-hero">
        <div className="cd-cover" style={{ background: cover }}>
          <div className="cd-cover-dim" />
          <div className="cd-cover-noise" />
        </div>
        <div className="cd-hero-body">
          <div className="cd-hero-inner">
            <div className="cd-logo-wrap">
              <CompanyLogo logo={logo} name={name} logoColor={logoColor} size="lg" />
            </div>
            <div className="cd-hero-info">
              <div className="cd-hero-row1">
                <div>
                  <h1 className="cd-name">{name}</h1>
                  <div className="cd-sub">
                    {industry && <><span>{industry}</span><span className="cd-dot">·</span></>}
                    <span>📍 {location}</span>
                    <span className="cd-dot">·</span>
                    <span>🏢 {size}</span>
                  </div>
                </div>
              </div>
              <div className="cd-kpi-strip">
                <div className="cd-kpi-div" />
                <div className="cd-kpi">
                  <span className="cd-kpi-n cd-rust">{allJobs.length}</span>
                  <span className="cd-kpi-l">việc đang tuyển</span>
                </div>
              </div>
              {tags.length > 0 && (
                <div className="cd-tag-row">
                  {tags.map(t => <span key={t} className="cd-tag">{t}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cd-tabs-bar">
        <div className="cd-tabs-inner">
          {TABS.map(t => (
            <button key={t.key} className={`cd-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => { setTab(t.key); if (t.key === 'jobs') { setJobSearch(''); setJobPage(1) } }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cd-body">
        <div className="cd-body-inner">
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px', color: 'var(--ink4)', fontSize: '14px' }}>
              ⟳ Đang tải thông tin công ty...
            </div>
          )}

          {!loading && (
            <>
              {tab === 'overview' && (
                <div className="cd-2col">
                  <div className="cd-col-main">
                    {profile && (
                      <section className="cd-sec">
                        <div className="cd-sec-title">📋 Giới thiệu</div>
                        <div className="cd-about">
                          {about.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                      </section>
                    )}
                    {location && (
                      <section className="cd-sec">
                        <div className="cd-sec-title">📍 Địa điểm làm việc</div>
                        <div className="cd-offices">
                          <div className="cd-office">
                            <div className="cd-office-dot" />
                            <div>
                              <div className="cd-office-city">{location}</div>
                              {website && (
                                <div className="cd-office-addr">
                                  Xem thêm tại <a href={website} target="_blank" rel="noreferrer">{websiteDomain}</a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  <div className="cd-col-side">
                    <div className="cd-card">
                      <div className="cd-card-title">📊 Số liệu nổi bật</div>
                      <div className="cd-stats-grid">
                        {stats.map((s, i) => (
                          <div key={i} className="cd-stat">
                            <div className="cd-stat-n">{s.n}</div>
                            <div className="cd-stat-l">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="cd-card">
                      <div className="cd-card-hd">
                        <span className="cd-card-title">💼 Việc đang tuyển</span>
                        <button className="cd-see-all" onClick={() => setTab('jobs')}>Xem tất cả →</button>
                      </div>
                      {allJobs.length > 0
                        ? allJobs.slice(0, 3).map(j => (
                          <div key={j.id} className="cd-qjob" style={{ cursor: 'pointer' }}
                            onClick={() => handleApply(j.id, null)}>
                            <div className="cd-qjob-info">
                              <div className="cd-qjob-title">{j.title}</div>
                              <div className="cd-qjob-meta">{j.type} · {j.salary}</div>
                            </div>
                            {j.match != null && (
                              <span className={`cd-qjob-match ${matchCls(j.match)}`}>{j.match}% phù hợp</span>
                            )}
                          </div>
                        ))
                        : <div className="cd-empty-sm">Chưa có dữ liệu.</div>
                      }
                    </div>

                    {website && (
                      <div className="cd-card">
                        <div className="cd-card-title">🔗 Liên kết</div>
                        <a href={website} target="_blank" rel="noreferrer" className="cd-website-link">
                          🌐 {websiteDomain}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'jobs' && (
                <div className="cd-tab-pane">
                  <div style={{
                    display: 'flex', gap: '10px', marginBottom: '20px',
                    alignItems: 'center', flexWrap: 'wrap',
                  }}>
                    <div style={{
                      flex: 1, minWidth: '200px',
                      display: 'flex', alignItems: 'center', gap: '0',
                      background: '#FEFCF7', border: '1.5px solid #DDD6C6',
                      borderRadius: '10px', overflow: 'hidden',
                    }}>
                      <span style={{ padding: '0 12px', fontSize: '16px', color: '#9A8D80', flexShrink: 0 }}>🔍</span>
                      <input
                        type="text"
                        placeholder="Tìm theo tên, loại hình, kỹ năng..."
                        value={jobSearch}
                        onChange={e => handleJobSearch(e.target.value)}
                        style={{
                          flex: 1, padding: '10px 12px 10px 0',
                          border: 'none', outline: 'none',
                          fontSize: '13.5px', background: 'transparent',
                          fontFamily: 'inherit', color: '#1C1510',
                        }}
                      />
                      {jobSearch && (
                        <button onClick={() => handleJobSearch('')} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '0 12px', fontSize: '16px', color: '#9A8D80', flexShrink: 0,
                        }}>×</button>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9A8D80', flexShrink: 0 }}>
                      {filteredJobs.length !== allJobs.length
                        ? <><strong style={{ color: '#1C1510' }}>{filteredJobs.length}</strong> / {allJobs.length} việc làm</>
                        : <><strong style={{ color: '#1C1510' }}>{allJobs.length}</strong> việc làm đang tuyển</>
                      }
                    </div>
                  </div>

                  {filteredJobs.length === 0 ? (
                    <div className="cd-empty">
                      <div className="cd-empty-ico">🔍</div>
                      <div className="cd-empty-t">Không tìm thấy việc làm</div>
                      <div className="cd-empty-s">Thử từ khóa khác hoặc xoá bộ lọc.</div>
                    </div>
                  ) : (
                    <>
                      <div className="cd-jobs-list">
                        {pagedJobs.map(j => (
                          <div key={j.id} className="cd-job-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleApply(j.id, null)}>
                            <div className="cd-job-top">
                              <CompanyLogo logo={logo} name={name} logoColor={logoColor} size="sm" />
                              <div className="cd-job-info">
                                <div className="cd-job-title">{j.title}</div>
                                <div className="cd-job-chips">
                                  <div className="cd-chip-row">
                                    <span className="cd-chip">📍 {location}</span>
                                    <span className="cd-chip">🕐 {j.type}</span>
                                    <span className="cd-chip">🎓 {j.exp}</span>
                                  </div>
                                  {j.skills.length > 0 && (
                                    <div className="cd-skill-row">
                                      {j.skills.map(s => (
                                        <span key={s} className="cd-chip cd-chip-skill">🔧 {s}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {j.match != null && (
                                <div className={`cd-job-match ${matchCls(j.match)}`}>
                                  <span className="cd-jm-n">{j.match}%</span>
                                  <span className="cd-jm-l">phù hợp</span>
                                </div>
                              )}
                            </div>
                            <div className="cd-job-foot">
                              <span className="cd-job-salary">💰 {j.salary}</span>
                              <span className="cd-job-dl">⏰ {j.deadline}</span>
                              <div className="cd-job-acts">
                                <button
                                  className={`cd-save-btn${savedJobIds.has(j.id) ? ' on' : ''}`}
                                  onClick={(e) => handleSave(j.id, e)}
                                  style={{
                                    width: savedJobIds.has(j.id) ? 'auto' : '34px',
                                    padding: savedJobIds.has(j.id) ? '0 10px' : '0',
                                    fontSize: savedJobIds.has(j.id) ? '12px' : '15px',
                                  }}
                                >
                                  {savedJobIds.has(j.id) ? '🔖 Đã lưu' : '🔖'}
                                </button>
                                <button
                                  className="cd-apply-btn"
                                  disabled={applyLoading}
                                  onClick={(e) => handleApply(j.id, e)}
                                >
                                  {applyLoading ? '⏳' : token ? '👁 Xem chi tiết' : '⚡ Ứng tuyển'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalJobPages > 1 && (
                        <div style={{
                          display: 'flex', justifyContent: 'center', alignItems: 'center',
                          gap: '6px', marginTop: '28px', flexWrap: 'wrap',
                        }}>
                          <button
                            disabled={jobPage === 1}
                            onClick={() => setJobPage(p => p - 1)}
                            style={{
                              width: 36, height: 36, borderRadius: 8,
                              border: '1.5px solid #DDD6C6', background: 'transparent',
                              color: '#6B5E50', fontSize: 16, cursor: jobPage === 1 ? 'not-allowed' : 'pointer',
                              opacity: jobPage === 1 ? 0.4 : 1,
                            }}>‹</button>
                          {renderJobPages()}
                          <button
                            disabled={jobPage === totalJobPages}
                            onClick={() => setJobPage(p => p + 1)}
                            style={{
                              width: 36, height: 36, borderRadius: 8,
                              border: '1.5px solid #DDD6C6', background: 'transparent',
                              color: '#6B5E50', fontSize: 16, cursor: jobPage === totalJobPages ? 'not-allowed' : 'pointer',
                              opacity: jobPage === totalJobPages ? 0.4 : 1,
                            }}>›</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}