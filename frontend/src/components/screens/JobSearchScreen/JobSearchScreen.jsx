import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../../utils/auth';
import './JobSearchScreen.css';

const API = 'http://localhost:3000/api';

function LoginModal({ onClose }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      backdropFilter: 'blur(4px)', zIndex: 4000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surf)', borderRadius: '16px', padding: '32px 28px 24px',
        width: '360px', maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,.2)',
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
          }} onClick={() => { navigate('/login'); window.scrollTo({ top: 0, behavior: 'instant' }); }}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}

const JOB_TYPE_OPTIONS = [
  { label: '🏢 Toàn thời gian', value: 'Toàn thời gian' },
  { label: '⏰ Bán thời gian', value: 'Bán thời gian' },
  { label: '🎓 Thực tập', value: 'Thực tập' },
  { label: '🌿 Thời vụ', value: 'Thời vụ' },
  { label: '💻 Remote', value: 'Remote' },
  { label: '🔧 Freelance', value: 'Freelance' },
];

const EXPERIENCE_OPTIONS = [
  { label: 'Không yêu cầu', value: 'Không yêu cầu' },
  { label: 'Dưới 1 năm', value: 'Dưới 1 năm' },
  { label: '1 - 2 năm', value: '1-2 năm' },
  { label: '2 - 3 năm', value: '2-3 năm' },
  { label: '3 - 5 năm', value: '3-5 năm' },
  { label: 'Trên 5 năm', value: 'Trên 5 năm' },
];

const SALARY_OPTIONS = [
  { label: 'Tất cả', min: 0, max: 0 },
  { label: 'Dưới 10tr', min: 0, max: 10 },
  { label: '10–20tr', min: 10, max: 20 },
  { label: '20–40tr', min: 20, max: 40 },
  { label: '40–60tr', min: 40, max: 60 },
  { label: 'Trên 60tr', min: 60, max: 0 },
];

function JobSearchScreen() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getToken());
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    jobType: [], experience: [], industry: [], locations: [], source: [],
  });
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(0);
  const [salaryRange, setSalaryRange] = useState(100);

  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState({
    jobTypes: [], sources: [], locations: [], experiences: [], industries: [],
  });
  const [dynamicFilters, setDynamicFilters] = useState({ industries: [] });
  const [loadingDynamic, setLoadingDynamic] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const provinceInputRef = useRef(null);

  const [recPage, setRecPage] = useState(1);
  const REC_LIMIT = 10;
  const pagedRecs = recommendations.slice((recPage - 1) * REC_LIMIT, recPage * REC_LIMIT);
  const recTotalPages = Math.ceil(recommendations.length / REC_LIMIT);

  const [alertKeyword, setAlertKeyword] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [myAlerts, setMyAlerts] = useState([]);
  const [showMyAlerts, setShowMyAlerts] = useState(false);

  // ── sync token ────────────────────────────────────────────
  useEffect(() => {
    const sync = () => setToken(getToken());
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  useEffect(() => {
    if (!token && sort === 'match') setSort('newest');
  }, [token]);

  // ── email từ JWT ──────────────────────────────────────────
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.email) setAlertEmail(payload.email);
      } catch { }
    } else {
      setAlertEmail('');
    }
  }, [token]);

  // ── alerts ────────────────────────────────────────────────
  const loadMyAlerts = useCallback(async (email) => {
    if (!email) return;
    try {
      const res = await fetch(`${API}/job-alerts?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setMyAlerts(Array.isArray(data) ? data : []);
    } catch { }
  }, []);

  useEffect(() => {
    if (alertEmail) loadMyAlerts(alertEmail);
  }, [alertEmail]);

  // ── saved jobs ────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setSavedJobIds(new Set()); return; }
    fetch(`${API}/jobs/saved`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const ids = new Set((Array.isArray(data) ? data : []).map(s => s.job.jobID));
        setSavedJobIds(ids);
      })
      .catch(console.error);
  }, [token]);

  // ── static filters + polling ──────────────────────────────
  useEffect(() => {
    const loadStatic = () =>
      Promise.all([
        fetch(`${API}/jobs/filter-options`).then(r => r.json()),
        fetch(`${API}/common/locations`).then(r => r.json()),
        fetch(`${API}/jobs/trending-keywords`).then(r => r.json()),
        fetch(`${API}/companies/top`).then(r => r.json()),
      ])
        .then(([opts, provs, trending, companies]) => {
          setFilterOptions(opts);
          setProvinces(provs);
          setTrendingKeywords(trending);
          setTopCompanies(companies);
        })
        .catch(console.error)
        .finally(() => setLoadingFilters(false));

    loadStatic();
    const interval = setInterval(loadStatic, 30_000);
    return () => clearInterval(interval);
  }, []);

  // auto-select source đầu tiên
  useEffect(() => {
    if (filterOptions.sources.length > 0 && activeFilters.source.length === 0) {
      setActiveFilters(prev => ({ ...prev, source: [filterOptions.sources[0].value] }));
    }
  }, [filterOptions.sources]);

  // ── dynamic industries theo source ───────────────────────
  useEffect(() => {
    setLoadingDynamic(true);
    const source = activeFilters.source[0] ?? '';
    const url = source
      ? `${API}/jobs/filter-by-source?source=${encodeURIComponent(source)}`
      : `${API}/jobs/filter-by-source`;
    fetch(url)
      .then(r => r.json())
      .then(data => setDynamicFilters({ industries: data?.industries ?? [] }))
      .catch(console.error)
      .finally(() => setLoadingDynamic(false));
  }, [activeFilters.source]);

  // ── recommendations ───────────────────────────────────────
  useEffect(() => {
    if (sort !== 'match' || !token) return;
    setLoadingRecs(true);
    fetch(`${API}/jobs/recommendations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setRecommendations(Array.isArray(data) ? data : []); setRecPage(1); })
      .catch(console.error)
      .finally(() => setLoadingRecs(false));
  }, [sort, token]);

  // ── fetch jobs ────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    if (sort === 'match' && token) return;
    setLoadingJobs(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: '10', sort });
      if (keyword) params.set('keyword', keyword);
      if (activeFilters.industry.length === 1) params.set('industryId', activeFilters.industry[0]);
      if (activeFilters.jobType.length > 0) params.set('jobType', activeFilters.jobType[0]);
      if (activeFilters.experience.length > 0) params.set('experience', activeFilters.experience[0]);
      if (activeFilters.source.length > 0) params.set('source', activeFilters.source[0]);
      if (salaryMin > 0) params.set('salaryMin', String(salaryMin));
      if (salaryMax > 0) params.set('salaryMax', String(salaryMax));
      activeFilters.locations.forEach(loc => params.append('locations', loc));
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API}/jobs?${params}`, { headers });
      const data = await res.json();
      setJobs(data.data ?? []);
      setMeta(data.meta ?? { total: 0, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  }, [currentPage, sort, keyword, activeFilters, salaryMin, salaryMax, token]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // polling 20s
  useEffect(() => {
    const interval = setInterval(() => {
      if (sort !== 'match' || !token) fetchJobs();
    }, 20_000);
    return () => clearInterval(interval);
  }, [fetchJobs, sort, token]);

  const displayJobs = sort === 'match' && token ? recommendations : jobs;
  const displayLoading = sort === 'match' && token ? loadingRecs : loadingJobs;

  // ── track ─────────────────────────────────────────────────
  const trackBehavior = useCallback((jobID, action) => {
    if (!token) return;
    fetch(`${API}/jobs/${jobID}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    }).catch(console.error);
  }, [token]);

  // ── detail ────────────────────────────────────────────────
  const openDetail = async (jobID) => {
    try {
      const res = await fetch(`${API}/jobs/${jobID}`);
      const data = await res.json();
      setSelectedJob(data);
      setDetailOpen(true);
      document.body.style.overflow = 'hidden';
      trackBehavior(jobID, 'view');
    } catch (err) { console.error(err); }
  };
  const closeDetail = () => { setDetailOpen(false); document.body.style.overflow = ''; };
  const openApply = (e) => { if (e) e.stopPropagation(); setApplyModalOpen(true); };
  const closeApply = () => setApplyModalOpen(false);

  const openCompanyDetail = (companyID, e) => {
    if (e) e.stopPropagation();
    if (!companyID) return;
    navigate(`/jobs/companies/${companyID}`);
  };

  // ── save ──────────────────────────────────────────────────
  const handleSave = async (jobID, e) => {
    if (e) e.stopPropagation();
    if (!token) { setShowLoginModal(true); return; }
    const isSaved = savedJobIds.has(jobID);
    try {
      await fetch(`${API}/jobs/${jobID}/save`, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      setSavedJobIds(prev => {
        const next = new Set(prev);
        isSaved ? next.delete(jobID) : next.add(jobID);
        return next;
      });
      showToast(isSaved ? 'Đã bỏ lưu' : '🔖 Đã lưu việc làm!');
      if (!isSaved) trackBehavior(jobID, 'save');
    } catch (err) { console.error(err); }
  };

  const handleApply = (e, jobID) => {
    if (e) e.stopPropagation();
    if (!token) { setShowLoginModal(true); return; }
    if (jobID) trackBehavior(jobID, 'apply');
    openApply(e);
  };

  // ── alert handlers ────────────────────────────────────────
  const handleCreateAlert = async () => {
    if (!alertKeyword.trim() || !alertEmail.trim()) return;
    setAlertLoading(true); setAlertMsg('');
    try {
      const res = await fetch(`${API}/job-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: alertKeyword.trim(), email: alertEmail.trim() }),
      });
      const data = await res.json();
      setAlertMsg(data.message ?? 'Đăng ký thành công!');
      setAlertKeyword('');
      loadMyAlerts(alertEmail);
    } catch {
      setAlertMsg('Có lỗi xảy ra, thử lại sau.');
    } finally {
      setAlertLoading(false);
      setTimeout(() => setAlertMsg(''), 4000);
    }
  };

  const handleRemoveAlert = async (kw) => {
    try {
      await fetch(`${API}/job-alerts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: kw, email: alertEmail }),
      });
      loadMyAlerts(alertEmail);
      showToast('Đã huỷ thông báo');
    } catch { }
  };

  // ── filters ───────────────────────────────────────────────
  const toggleFilter = (category, value) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
    setCurrentPage(1);
  };

  const toggleJobType = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(value) ? [] : [value],
    }));
    setCurrentPage(1);
  };

  const toggleExperience = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      experience: prev.experience.includes(value) ? [] : [value],
    }));
    setCurrentPage(1);
  };

  const toggleSource = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      source: prev.source.includes(value) ? [] : [value],
      jobType: [],
      industry: [],
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const firstSource = filterOptions.sources[0]?.value ?? '';
    setActiveFilters({
      jobType: [], experience: [], industry: [], locations: [],
      source: firstSource ? [firstSource] : [],
    });
    setSalaryMin(0); setSalaryMax(0); setSalaryRange(100); setCurrentPage(1);
  };

  // ── helpers ───────────────────────────────────────────────
  const showToast = (message) => {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1C1510;color:#F5EED8;padding:10px 20px;border-radius:9px;font-size:13px;font-weight:600;z-index:9999;animation:fadeIn .2s ease-out';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  };

  const getSourceClass = (src) => ({ TopCV: 'sc-tc', CareerLink: 'sc-cl', CareerViet: 'sc-cv', VietnamWorks: 'sc-vw' }[src] ?? 'sc-it');
  const getSourceLogoClass = (src) => ({ TopCV: 'sl-tc', CareerLink: 'sl-cl', CareerViet: 'sl-cv', VietnamWorks: 'sl-vw' }[src] ?? 'sl-it');
  const getLogoLetter = (name) => name?.[0]?.toUpperCase() ?? '?';

  const formatPostedAt = (postedAt) => {
    if (!postedAt) return '';
    const diff = Date.now() - new Date(postedAt).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (h < 1) return 'Vừa đăng';
    if (h < 24) return `Đăng ${h} giờ trước`;
    return `Đăng ${d} ngày trước`;
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const date = new Date(deadline);
    const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
    const formatted = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (days < 0) return `Đã hết hạn (${formatted})`;
    if (days === 0) return `Hết hạn hôm nay (${formatted})`;
    return `Còn ${days} ngày (${formatted})`;
  };

  const openProvinceDropdown = () => {
    if (provinceInputRef.current) {
      const rect = provinceInputRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setProvinceDropdownOpen(true);
  };

  const filteredProvinces = provinces.filter(p =>
    p.label.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  // ── pagination ────────────────────────────────────────────
  const renderPages = () => {
    const pages = [];
    const total = meta.totalPages;
    const cur = currentPage;
    const addBtn = (n) => pages.push(
      <button key={n} className={`pg-btn ${cur === n ? 'on' : ''}`} onClick={() => setCurrentPage(n)}>{n}</button>
    );
    const addDots = (k) => pages.push(
      <span key={k} style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: 'var(--ink4)' }}>…</span>
    );
    if (total <= 7) { for (let i = 1; i <= total; i++) addBtn(i); }
    else {
      addBtn(1);
      if (cur > 3) addDots('d1');
      const start = Math.max(2, cur - 1);
      const end = Math.min(total - 1, cur + 1);
      for (let i = start; i <= end; i++) addBtn(i);
      if (cur < total - 2) addDots('d2');
      addBtn(total);
    }
    return pages;
  };

  const renderRecPages = () => {
    const pages = [];
    const total = recTotalPages;
    const cur = recPage;
    const addBtn = (n) => pages.push(
      <button key={n} className={`pg-btn ${cur === n ? 'on' : ''}`} onClick={() => setRecPage(n)}>{n}</button>
    );
    const addDots = (k) => pages.push(
      <span key={k} style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: 'var(--ink4)' }}>…</span>
    );
    if (total <= 7) { for (let i = 1; i <= total; i++) addBtn(i); }
    else {
      addBtn(1);
      if (cur > 3) addDots('d1');
      const start = Math.max(2, cur - 1);
      const end = Math.min(total - 1, cur + 1);
      for (let i = start; i <= end; i++) addBtn(i);
      if (cur < total - 2) addDots('d2');
      addBtn(total);
    }
    return pages;
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeDetail(); closeApply();
        setShowLoginModal(false);
        setProvinceDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const updateDropdownPos = () => {
      if (provinceDropdownOpen && provinceInputRef.current) {
        const rect = provinceInputRef.current.getBoundingClientRect();
        setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      }
    };
    window.addEventListener('scroll', updateDropdownPos, true);
    return () => window.removeEventListener('scroll', updateDropdownPos, true);
  }, [provinceDropdownOpen]);

  const allChips = [
    ...activeFilters.source.map(v => ({ cat: 'source', value: v, label: `🌐 ${v}` })),
    ...activeFilters.industry.map(v => ({ cat: 'industry', value: v, label: filterOptions.industries?.find(i => String(i.id) === v)?.name ?? dynamicFilters.industries?.find(i => String(i.id) === v)?.name ?? v })),
    ...activeFilters.jobType.map(v => ({ cat: 'jobType', value: v, label: v })),
    ...activeFilters.experience.map(v => ({ cat: 'experience', value: v, label: v })),
    ...activeFilters.locations.map(v => ({ cat: 'locations', value: v, label: `📍 ${v}` })),
  ];

  return (
    <div className="app">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {provinceDropdownOpen && filteredProvinces.length > 0 && (
        <div style={{
          position: 'fixed', top: dropdownPos.top, left: dropdownPos.left,
          width: dropdownPos.width, zIndex: 9999, background: 'var(--surf)',
          border: '1px solid var(--border)', borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,.15)', maxHeight: '220px', overflowY: 'auto',
        }}>
          {filteredProvinces.map(p => (
            <div key={p.value} style={{
              padding: '8px 12px', fontSize: '12.5px', cursor: 'pointer',
              background: activeFilters.locations.includes(p.value) ? 'rgba(35,42,162,0.08)' : 'transparent',
              color: activeFilters.locations.includes(p.value) ? 'rgb(35,42,162)' : 'var(--ink)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }} onMouseDown={(e) => { e.preventDefault(); toggleFilter('locations', p.value); setProvinceSearch(''); }}>
              <span>{p.label}</span>
              {activeFilters.locations.includes(p.value) && (
                <span style={{ color: 'rgb(35,42,162)', fontWeight: 700 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="page">
        {/* ══ SIDEBAR ══════════════════════════════════════════ */}
        <aside className="sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <div className="filter-header-title">Bộ lọc</div>
              <span className="filter-clear" onClick={clearFilters}>Xoá tất cả</span>
            </div>

            {/* 1. NGUỒN */}
            <div className="filter-section">
              <div className="filter-section-title">Nguồn tuyển dụng</div>
              {loadingFilters
                ? <div style={{ fontSize: '12px', color: 'var(--ink4)' }}>Đang tải...</div>
                : filterOptions.sources.map(source => (
                  <div key={source.value} className="source-row" onClick={() => toggleSource(source.value)}>
                    <div className={`source-logo ${getSourceLogoClass(source.value)}`}>
                      {source.value?.[0] ?? '?'}
                    </div>
                    <span style={{ fontSize: '13px', flex: 1 }}>{source.value}</span>
                    <div className={`ck ${activeFilters.source.includes(source.value) ? 'on' : ''}`}>
                      {activeFilters.source.includes(source.value) ? '✓' : ''}
                    </div>
                    <span className="ck-count">{source.count?.toLocaleString()}</span>
                  </div>
                ))}
            </div>

            {/* 2. NGÀNH NGHỀ — dynamic theo source */}
            <div className="filter-section">
              <div className="filter-section-title">
                Ngành nghề
                {activeFilters.source[0] && (
                  <span style={{ fontSize: '10px', color: 'var(--ink4)', marginLeft: 5, fontWeight: 400 }}>
                    · {activeFilters.source[0]}
                  </span>
                )}
              </div>
              {loadingDynamic
                ? <div style={{ fontSize: '12px', color: 'var(--ink4)' }}>Đang tải...</div>
                : dynamicFilters.industries.length === 0
                  ? <div style={{ fontSize: '12px', color: 'var(--ink4)' }}>Không có dữ liệu</div>
                  : dynamicFilters.industries.map(item => (
                    <div key={item.id} className="ck-row" onClick={() => toggleFilter('industry', String(item.id))}>
                      <div className={`ck ${activeFilters.industry.includes(String(item.id)) ? 'on' : ''}`}>
                        {activeFilters.industry.includes(String(item.id)) ? '✓' : ''}
                      </div>
                      <span className="ck-label">{item.name}</span>
                      <span className="ck-count">{item.count?.toLocaleString()}</span>
                    </div>
                  ))}
            </div>

            {/* 3. LOẠI HÌNH — cứng hoàn toàn */}
            <div className="filter-section">
              <div className="filter-section-title">Loại hình công việc</div>
              {JOB_TYPE_OPTIONS.map(item => (
                <div key={item.value} className="ck-row" onClick={() => toggleJobType(item.value)}>
                  <div className={`ck ${activeFilters.jobType.includes(item.value) ? 'on' : ''}`}>
                    {activeFilters.jobType.includes(item.value) ? '✓' : ''}
                  </div>
                  <span className="ck-label">{item.label}</span>
                </div>
              ))}
            </div>

            {/* 4. LƯƠNG — cứng */}
            <div className="filter-section">
              <div className="filter-section-title">Mức lương (triệu/tháng)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {SALARY_OPTIONS.map(pill => (
                  <span key={pill.label}
                    className={`spill ${salaryMin === pill.min && salaryMax === pill.max ? 'on' : ''}`}
                    onClick={() => { setSalaryMin(pill.min); setSalaryMax(pill.max); setSalaryRange(pill.max || 100); setCurrentPage(1); }}>
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. KINH NGHIỆM — cứng */}
            <div className="filter-section">
              <div className="filter-section-title">Kinh nghiệm</div>
              {EXPERIENCE_OPTIONS.map(item => (
                <div key={item.value} className="ck-row" onClick={() => toggleExperience(item.value)}>
                  <div className={`ck ${activeFilters.experience.includes(item.value) ? 'on' : ''}`}>
                    {activeFilters.experience.includes(item.value) ? '✓' : ''}
                  </div>
                  <span className="ck-label">{item.label}</span>
                </div>
              ))}
            </div>

            {/* 6. ĐỊA ĐIỂM */}
            <div className="filter-section">
              <div className="filter-section-title">Địa điểm</div>
              {activeFilters.locations.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                  {activeFilters.locations.map(loc => (
                    <span key={loc} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                      background: 'rgba(35,42,162,0.1)', border: '1px solid rgba(35,42,162,0.25)',
                      color: 'rgb(35,42,162)', cursor: 'pointer',
                    }} onClick={() => toggleFilter('locations', loc)}>
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
                onChange={e => { setProvinceSearch(e.target.value); openProvinceDropdown(); }}
                onFocus={openProvinceDropdown}
                onBlur={() => setTimeout(() => setProvinceDropdownOpen(false), 200)}
                style={{
                  width: '100%', padding: '7px 10px', borderRadius: '7px',
                  border: '1.5px solid var(--border2)', fontSize: '12.5px',
                  background: 'var(--bg)', outline: 'none',
                }}
              />
            </div>
          </div>
        </aside>

        {/* ══ MAIN ═════════════════════════════════════════════ */}
        <main className="main">
          <div style={{
            display: 'flex', gap: '8px', marginBottom: '16px',
            background: 'var(--surf)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '12px',
          }}>
            <div className="search-field" style={{ flex: 1 }}>
              <span className="search-field-icon">🔍</span>
              <input placeholder="Tên công việc, kỹ năng, công ty..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setCurrentPage(1)} />
            </div>
            <button className="search-btn" onClick={() => setCurrentPage(1)}>Tìm kiếm</button>
          </div>

          {allChips.length > 0 && (
            <div className="active-filters">
              {allChips.map(chip => (
                <div key={`${chip.cat}-${chip.value}`} className="af-chip"
                  onClick={() => {
                    if (chip.cat === 'source') toggleSource(chip.value);
                    else if (chip.cat === 'jobType') toggleJobType(chip.value);
                    else if (chip.cat === 'experience') toggleExperience(chip.value);
                    else toggleFilter(chip.cat, chip.value);
                  }}>
                  {chip.label} <span className="af-x">×</span>
                </div>
              ))}
            </div>
          )}

          <div className="results-bar">
            <div className="results-count">
              {sort === 'match' && token
                ? <span>Hiển thị <strong>{recommendations.length} việc làm phù hợp</strong> với bạn</span>
                : <span>Tìm thấy <strong>{meta.total.toLocaleString()} việc làm</strong></span>
              }
            </div>
            <div className="sort-row">
              <span className="sort-label">Sắp xếp:</span>
              <select className="sort-sel" value={sort}
                onChange={e => { setSort(e.target.value); setCurrentPage(1); }}>
                {token && <option value="match">Phù hợp nhất</option>}
                <option value="newest">Mới nhất</option>
                <option value="salary">Lương cao nhất</option>
                <option value="deadline">Sắp hết hạn</option>
              </select>
            </div>
          </div>

          {displayLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--ink4)', fontSize: '14px' }}>
              ⟳ Đang tải việc làm...
            </div>
          ) : (sort === 'match' && token ? pagedRecs : displayJobs).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--ink4)', fontSize: '14px' }}>
              {sort === 'match' && token
                ? 'Chưa có gợi ý — hãy cập nhật kỹ năng trong hồ sơ'
                : 'Không tìm thấy việc làm phù hợp'}
            </div>
          ) : (
            <div className="jobs-list">
              {(sort === 'match' && token ? pagedRecs : displayJobs).map((job, idx) => (
                <div key={job.jobID} className="job-card fade-in"
                  style={{ animationDelay: `${idx * 0.04}s`, position: 'relative' }}
                  onClick={() => openDetail(job.jobID)}>

                  {job.matchPercent != null && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '14px',
                      padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: 800,
                      background: job.matchPercent >= 80 ? 'rgba(46,96,64,.12)' : 'rgba(212,130,10,.12)',
                      color: job.matchPercent >= 80 ? 'var(--sage)' : 'var(--amber)',
                      border: `1px solid ${job.matchPercent >= 80 ? 'rgba(46,96,64,.25)' : 'rgba(212,130,10,.25)'}`,
                    }}>
                      🎯 {Math.round(job.matchPercent)}% phù hợp
                    </div>
                  )}

                  <div className="jc-top">
                    <div className="co-logo" style={{ background: 'linear-gradient(135deg,#1565C0,#1E88E5)' }}>
                      {job.companyLogo
                        ? <img src={job.companyLogo} alt={job.companyName} />
                        : <span>{getLogoLetter(job.companyName)}</span>}
                    </div>
                    <div className="jc-info">
                      <div className="jc-title">{job.title}</div>
                      <div className="jc-company"
                        onClick={(e) => openCompanyDetail(job.companyID, e)}
                        style={{ cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}>
                        {job.companyName} <span className="verified">✓</span>
                      </div>
                      <div className="jc-meta">
                        {job.shortLocation && <span className="jc-meta-item">📍 {job.shortLocation}</span>}
                        {job.jobType && <span className="jc-meta-item">⏰ {job.jobType}</span>}
                        {job.experienceYear && <span className="jc-meta-item">🎯 {job.experienceYear}</span>}
                      </div>
                    </div>
                    <div className="jc-right" style={{ paddingTop: job.matchPercent != null ? '24px' : '0' }}>
                      <div className="jc-salary">{job.salary ?? 'Thỏa thuận'}</div>
                      <div className="jc-posted">{formatPostedAt(job.postedAt)}</div>
                      {job.deadline && (
                        <div className="jc-deadline"
                          style={formatDeadline(job.deadline)?.includes('hết') ? { color: 'var(--rust)' } : {}}>
                          ⏰ {formatDeadline(job.deadline)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="jc-bottom">
                    <div className="jc-tags">
                      {(job.skills ?? []).map(tag => (
                        <span key={tag} className="jtag">{tag}</span>
                      ))}
                      {job.sourcePlatform && (
                        <span className={`source-chip ${getSourceClass(job.sourcePlatform)}`}>
                          {job.sourcePlatform}
                        </span>
                      )}
                    </div>
                    <div className="jc-actions">
                      <button
                        className={`jc-save ${savedJobIds.has(job.jobID) ? 'saved' : ''}`}
                        onClick={(e) => handleSave(job.jobID, e)}
                        style={{
                          width: savedJobIds.has(job.jobID) ? 'auto' : '34px',
                          padding: savedJobIds.has(job.jobID) ? '0 10px' : '0',
                          gap: '4px',
                          fontSize: savedJobIds.has(job.jobID) ? '12px' : '15px',
                        }}>
                        {savedJobIds.has(job.jobID) ? '🔖 Đã lưu' : '🔖'}
                      </button>
                      <button className="jc-apply"
                        onClick={(e) => { e.stopPropagation(); handleApply(e, job.jobID); }}>
                        ⚡ Apply ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sort === 'match' && token && recTotalPages > 1 && (
            <div className="pagination">
              <button className="pg-btn" disabled={recPage === 1} onClick={() => setRecPage(p => p - 1)}>‹</button>
              {renderRecPages()}
              <button className="pg-btn" disabled={recPage === recTotalPages} onClick={() => setRecPage(p => p + 1)}>›</button>
            </div>
          )}

          {meta.totalPages > 1 && sort !== 'match' && (
            <div className="pagination">
              <button className="pg-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>‹</button>
              {renderPages()}
              <button className="pg-btn" disabled={currentPage === meta.totalPages} onClick={() => setCurrentPage(p => p + 1)}>›</button>
            </div>
          )}
        </main>
      </div>

      {/* ══ BOTTOM CARDS ═════════════════════════════════════ */}
      <div style={{
        maxWidth: '1360px', margin: '0 auto', padding: '0 28px 40px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px',
      }}>
        <div className="side-card">
          <div className="side-title">🔥 Từ khóa đang hot</div>
          <div className="kw-grid">
            {trendingKeywords.map(kw => (
              <span key={kw.name} className="kw-pill"
                onClick={() => { setKeyword(kw.name); setSort('newest'); setCurrentPage(1); }}>
                {kw.name}
              </span>
            ))}
          </div>
        </div>

        <div className="side-card">
          <div className="side-title">🏢 Công ty đang tuyển nhiều <a className="see-all" href="/companies">Tất cả</a></div>
          {topCompanies.map(company => (
            <div key={company.companyID} className="co-row"
              onClick={() => openCompanyDetail(company.companyID)}
              style={{ cursor: 'pointer' }}>
              <div className="co-mini" style={{ background: 'linear-gradient(135deg,#1565C0,#1E88E5)' }}>
                {company.logo
                  ? <img src={company.logo} alt={company.name} />
                  : <span>{getLogoLetter(company.name)}</span>}
              </div>
              <div className="co-info">
                <div className="co-name">{company.name}</div>
                <div className="co-jobs">{company.jobCount} vị trí đang tuyển</div>
              </div>
              <span className="co-badge cb-hire">Đang tuyển</span>
            </div>
          ))}
        </div>

        <div className="alert-card">
          <div className="alert-title">🔔 Tạo thông báo việc làm</div>
          <div className="alert-sub">Nhận email ngay khi có việc phù hợp!</div>
          <input className="alert-input" type="text"
            placeholder="Từ khóa: React Developer, PM..."
            value={alertKeyword}
            onChange={e => setAlertKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateAlert()}
          />
          <input className="alert-input" type="email"
            placeholder="Email của bạn"
            value={alertEmail}
            onChange={e => setAlertEmail(e.target.value)}
            readOnly={!!token}
            style={{ opacity: token ? 0.7 : 1, cursor: token ? 'default' : 'text' }}
          />
          {alertMsg && (
            <div style={{
              fontSize: 12, fontWeight: 600, marginBottom: 8, padding: '6px 10px',
              borderRadius: 7, textAlign: 'center',
              background: alertMsg.includes('thành công') || alertMsg.includes('Đăng ký')
                ? 'rgba(46,96,64,.1)' : 'rgba(192,65,42,.1)',
              color: alertMsg.includes('thành công') || alertMsg.includes('Đăng ký')
                ? 'var(--sage)' : 'var(--rust)',
            }}>
              {alertMsg}
            </div>
          )}
          <button className="btn btn-rust" style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleCreateAlert}
            disabled={alertLoading || !alertKeyword.trim() || !alertEmail.trim()}>
            {alertLoading ? '⏳ Đang đăng ký...' : '🔔 Tạo thông báo miễn phí'}
          </button>
          <div style={{ fontSize: '11px', color: 'var(--ink4)', marginTop: '8px', textAlign: 'center' }}>
            Gửi tối đa 1 email/ngày • Huỷ bất cứ lúc nào
          </div>
          {myAlerts.length > 0 && (
            <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>📋 Đang theo dõi ({myAlerts.length})</span>
                <span style={{ fontSize: 11, color: 'var(--rust)', cursor: 'pointer' }}
                  onClick={() => setShowMyAlerts(p => !p)}>
                  {showMyAlerts ? 'Thu gọn' : 'Xem tất cả'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {(showMyAlerts ? myAlerts : myAlerts.slice(0, 3)).map(alert => (
                  <div key={alert.keyword} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '5px 9px', borderRadius: 7,
                    background: 'var(--bg)', border: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink2)' }}>
                      🔍 {alert.keyword}
                    </span>
                    <button onClick={() => handleRemoveAlert(alert.keyword)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 16, color: 'var(--ink4)', padding: '0 2px', lineHeight: 1,
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--rust)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--ink4)'}>×</button>
                  </div>
                ))}
                {!showMyAlerts && myAlerts.length > 3 && (
                  <div style={{ fontSize: 11, color: 'var(--ink4)', textAlign: 'center', cursor: 'pointer', marginTop: 2 }}
                    onClick={() => setShowMyAlerts(true)}>
                    +{myAlerts.length - 3} từ khóa khác
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ DETAIL PANEL ═════════════════════════════════════ */}
      <div className={`detail-overlay ${detailOpen ? 'open' : ''}`} onClick={closeDetail}>
        <div className="detail-panel" onClick={e => e.stopPropagation()}>
          {selectedJob && (
            <>
              <div className="dp-header">
                <div className="co-logo" style={{ background: 'linear-gradient(135deg,#1565C0,#1E88E5)', flexShrink: 0 }}>
                  {selectedJob.company?.companyLogo
                    ? <img src={selectedJob.company.companyLogo} alt={selectedJob.company.companyName} />
                    : <span>{getLogoLetter(selectedJob.company?.companyName)}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                    {selectedJob.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink3)' }}>
                    <span onClick={(e) => openCompanyDetail(selectedJob.company?.companyID, e)}
                      style={{ cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}>
                      {selectedJob.company?.companyName}
                    </span>
                    {' '}• {selectedJob.jobType} • {selectedJob.shortLocation}
                  </div>
                  <div style={{ display: 'flex', gap: '7px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {selectedJob.salary && <span className="badge b-amber">💰 {selectedJob.salary}</span>}
                    {selectedJob.deadline && <span className="badge b-sage">⏰ {formatDeadline(selectedJob.deadline)}</span>}
                    {selectedJob.sourcePlatform && (
                      <span className={`source-chip ${getSourceClass(selectedJob.sourcePlatform)}`}>
                        {selectedJob.sourcePlatform}
                      </span>
                    )}
                  </div>
                </div>
                <button className="dp-close" onClick={closeDetail}>✕</button>
              </div>

              <div className="dp-body">
                <div className="dp-section">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {selectedJob.location && <span className="jc-meta-item">📍 {selectedJob.location}</span>}
                    {selectedJob.jobType && <span className="jc-meta-item">⏰ {selectedJob.jobType}</span>}
                    {selectedJob.experienceYear && <span className="jc-meta-item">🎯 {selectedJob.experienceYear}</span>}
                    {selectedJob.workingTime && <span className="jc-meta-item">🕐 {selectedJob.workingTime}</span>}
                  </div>
                </div>
                {selectedJob.description && (
                  <div className="dp-section">
                    <div className="dp-sec-title">Mô tả công việc</div>
                    <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {selectedJob.description}
                    </div>
                  </div>
                )}
                {selectedJob.requirement && (
                  <div className="dp-section">
                    <div className="dp-sec-title">Yêu cầu ứng viên</div>
                    <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {selectedJob.requirement}
                    </div>
                  </div>
                )}
                {selectedJob.benefit && (
                  <div className="dp-section">
                    <div className="dp-sec-title">Quyền lợi</div>
                    <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {selectedJob.benefit}
                    </div>
                  </div>
                )}
                {selectedJob.skills?.length > 0 && (
                  <div className="dp-section">
                    <div className="dp-sec-title">Kỹ năng yêu cầu</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {selectedJob.skills.map(skill => (
                        <span key={skill} className="jtag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="dp-section">
                  <div className="dp-sec-title">Thông tin công ty</div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div className="co-logo" style={{ background: 'linear-gradient(135deg,#1565C0,#1E88E5)', flexShrink: 0 }}>
                      {selectedJob.company?.companyLogo
                        ? <img src={selectedJob.company.companyLogo} alt={selectedJob.company.companyName} />
                        : <span>{getLogoLetter(selectedJob.company?.companyName)}</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}
                        onClick={(e) => openCompanyDetail(selectedJob.company?.companyID, e)}>
                        {selectedJob.company?.companyName}
                      </div>
                      {selectedJob.company?.companyProfile && (
                        <div style={{ fontSize: '12.5px', color: 'var(--ink3)', lineHeight: 1.65 }}>
                          {selectedJob.company.companyProfile}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '9px', flexWrap: 'wrap' }}>
                        {selectedJob.company?.companySize && (
                          <span className="badge b-teal">👥 {selectedJob.company.companySize}</span>
                        )}
                        {selectedJob.company?.address && (
                          <span className="badge b-gray">📍 {selectedJob.company.address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dp-apply-bar">
                <button className="dp-apply-btn" onClick={(e) => handleApply(e, selectedJob.jobID)}>⚡ Apply ngay</button>
                <button className="dp-save-btn"
                  style={{
                    color: savedJobIds.has(selectedJob.jobID) ? 'var(--amber)' : 'var(--ink3)',
                    borderColor: savedJobIds.has(selectedJob.jobID) ? 'var(--amber)' : 'var(--border2)',
                    background: savedJobIds.has(selectedJob.jobID) ? 'rgba(212,130,10,.07)' : 'transparent',
                    fontSize: '13px',
                    width: savedJobIds.has(selectedJob.jobID) ? 'auto' : '44px',
                    padding: savedJobIds.has(selectedJob.jobID) ? '0 12px' : '0',
                  }}
                  onClick={(e) => handleSave(selectedJob.jobID, e)}>
                  {savedJobIds.has(selectedJob.jobID) ? '🔖 Đã lưu' : '🔖'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ APPLY MODAL ══════════════════════════════════════ */}
      {applyModalOpen && (
        <div style={{
          display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          zIndex: 3000, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)',
        }} onClick={closeApply}>
          <div style={{
            background: 'var(--surf)', borderRadius: '16px', padding: '32px',
            maxWidth: '480px', width: '90%', boxShadow: '0 24px 80px rgba(0,0,0,.3)',
            animation: 'fadeIn .25s ease-out', position: 'relative',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={closeApply} style={{
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
              { icon: '🌐', title: 'Trang tuyển dụng gốc', desc: selectedJob?.sourcePlatform ?? '' },
              { icon: '📄', title: 'Nộp hồ sơ trực tiếp', desc: 'Ứng tuyển bằng CV của bạn trên nền tảng đó' },
              { icon: '🔒', title: 'Bảo mật thông tin', desc: 'Chúng tôi không lưu thông tin hồ sơ ứng tuyển' },
              { icon: '🔗', title: 'Link chi tiết ở trang gốc', desc: selectedJob?.sourceLink ?? '' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 14px',
                background: 'var(--bg2)', borderRadius: '9px', border: '1px solid var(--border)', marginBottom: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink3)', wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-rust" style={{
              width: '100%', justifyContent: 'center', padding: '13px',
              fontSize: '14px', background: 'rgb(35,42,162)', marginTop: '8px',
            }} onClick={() => selectedJob?.sourceLink && window.open(selectedJob.sourceLink, '_blank')}>
              Đi đến trang ứng tuyển →
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--ink4)' }}>
              Hoặc <span style={{ color: 'var(--rust)', cursor: 'pointer', fontWeight: 600 }}
                onClick={closeApply}>quay lại xem việc khác</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobSearchScreen;