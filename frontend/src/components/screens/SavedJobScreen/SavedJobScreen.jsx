import { useState, useEffect, useCallback } from 'react'
import './SavedJobScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import { useNavigate } from "react-router-dom"
import { getToken } from '../../../utils/auth'
import JobCard from '../../common/JobCard/JobCard'

const API = 'http://localhost:3000/api'

// const COLLECTIONS = ['Tất cả', 'Việc IT', 'Remote', 'Chưa phân loại']

export default function SavedJobsScreen({ onNavigate }) {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [page, setPage] = useState(1)

  const [token, setToken] = useState(() => getToken())
  const [savedJobIds, setSavedJobIds] = useState(new Set())

  // const [col, setCol] = useState('Tất cả')
  const [search, setSearch] = useState('')
  // const [selected, setSelected] = useState(new Set())
  // const [view, setView] = useState('grid')

  // sync token
  useEffect(() => {
    const sync = () => setToken(getToken())
    window.addEventListener('focus', sync)
    sync()
    return () => window.removeEventListener('focus', sync)
  }, [])

  // 🔥 FETCH SAVED JOBS
  useEffect(() => {
    if (!token) {
      setJobs([])
      setSavedJobIds(new Set())
      return
    }

    fetch(`${API}/jobs/saved?page=${page}&limit=9`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("SAVED API:", data)

        const list = data.data ?? data

        // normalize job
        const normalized = list.map(j => j.job ?? j)

        setJobs(normalized)

        setMeta(data.meta ?? {
          total: normalized.length,
          totalPages: 1
        })

        setSavedJobIds(new Set(
          normalized.map(j => j.jobID)
        ))
      })
      .catch(console.error)

  }, [token, page])

  // tracking
  const trackBehavior = useCallback((jobID, action) => {
    if (!token) return
    fetch(`${API}/jobs/${jobID}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ action }),
    }).catch(console.error)
  }, [token])

  const handleJobClick = (job) => {
    trackBehavior(job.jobID, 'click')
    navigate(`/saved-jobs/job/${job.jobID}`)
  }

  // filter
  const filtered = jobs.filter(j => {
    if (search &&
      !j.title?.toLowerCase().includes(search.toLowerCase()) &&
      !j.companyName?.toLowerCase().includes(search.toLowerCase())
    ) return false
    return true
  })



  const renderJobCard = (job) => (
    <div key={job.jobID} style={{ cursor: 'pointer' }}
      onClick={() => handleJobClick(job)}>
      <JobCard
        key={`${job.jobID}-${savedJobIds.has(job.jobID)}`}
        token={token}
        job={{
          id: job.jobID,
          title: job.title,
          company: job.company.companyName,
          companyID: job.company.companyID,
          companyLogo: job.company.companyLogo,
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
        onSave={(jobID) => {
          if (!savedJobIds.has(jobID)) trackBehavior(jobID, 'save')
        }}
        onCompanyClick={(companyID) => navigate(`/home/companies/${companyID}`)}
      />
    </div>
  )

  // pagination UI
  const renderPages = (curPage, totalPages, onPageChange) => {
    const pages = []
    const addBtn = (n) => pages.push(
      <button key={n} className={`sj-pg-btn${curPage === n ? ' sj-pg-active' : ''}`}
        onClick={() => onPageChange(n)}>{n}</button>
    )
    const addDots = (k) => pages.push(<span key={k} className="sj-pg-dots">…</span>)
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
    <div className="sj-pagination">
      <button className="sj-pg-btn sj-pg-arrow"
        disabled={curPage === 1}
        onClick={() => onPageChange(curPage - 1)}>‹</button>
      {renderPages(curPage, totalPages, onPageChange)}
      <button className="sj-pg-btn sj-pg-arrow"
        disabled={curPage === totalPages}
        onClick={() => onPageChange(curPage + 1)}>›</button>
      <div className="sj-pg-jump">
        <span className="sj-pg-jump-lbl">Đến trang</span>
        <input className="sj-pg-jump-inp" type="number" min={1} max={totalPages}
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

  return (
    <div className="sj-page">
      <div className="sj-layout">
        <Sidebar activeItem="saved-jobs" onNavigate={onNavigate} />

        <main className="sj-main">

          {/* HEADER */}
          <div className="sj-header">
            <div className="sj-header-inner">
              <div>
                <h1 className="sj-title">Việc làm đã lưu</h1>
                <p className="sj-sub">Quản lý danh sách việc bạn quan tâm</p>
              </div>

              <div className="sj-header-stats">
                <div className="sj-hstat">
                  <span className="sj-hstat-n">{meta.total}</span>
                  <span className="sj-hstat-l">Đã lưu</span>
                </div>
              </div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="sj-toolbar">
            <div className="sj-toolbar-inner">

              <div className="sj-search">
                <span>🔍</span>
                <input
                  placeholder="Tìm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>


            </div>
          </div>

          {/* CONTENT */}
          <div className="sj-body">
            {filtered.length === 0 ? (
              <div className="sj-empty">
                <div>Chưa có việc làm nào</div>
              </div>
            ) : (
              <div className="sj-grid">
                {filtered.map(renderJobCard)}
              </div>
            )}

            {meta.totalPages > 1 && (
              <Pagination
                curPage={page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>

        </main>
      </div>
    </div>
  )
}