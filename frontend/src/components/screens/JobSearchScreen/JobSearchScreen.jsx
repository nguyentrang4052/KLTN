import { useState, useEffect } from 'react';
import './JobSearchScreen.css';

function JobSearchScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('TP. Hồ Chí Minh');
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [detailOpen, setDetailOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    jobType: ['Full-time', 'Remote / Hybrid'],
    experience: ['1 – 3 năm', '3 – 5 năm'],
    industry: ['IT / Phần mềm'],
    location: ['TP. Hồ Chí Minh'],
    source: ['TopCV', 'CareerLink', 'CareerViet']
  });
  const [salaryRange, setSalaryRange] = useState(35);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSave = (jobId, e) => {
    if (e) e.stopPropagation();
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
      showToast('Đã bỏ lưu');
    } else {
      newSaved.add(jobId);
      showToast('🔖 Đã lưu! Đăng ký để xem danh sách lưu');
    }
    setSavedJobs(newSaved);
  };

  const showToast = (message) => {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1C1510;color:#F5EED8;padding:10px 20px;border-radius:9px;font-size:13px;font-weight:600;z-index:9999;animation:fadeIn .2s ease-out';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  };

  const toggleFilter = (category, value) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      jobType: [],
      experience: [],
      industry: [],
      location: [],
      source: []
    });
    setSalaryRange(0);
  };

  const removeFilterChip = (category, value) => {
    toggleFilter(category, value);
  };

  const handleSearchTag = (tag) => {
    setSearchInput(tag);
  };

  const openDetail = () => {
    setDetailOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetail = () => {
    setDetailOpen(false);
    document.body.style.overflow = '';
  };

  const openApply = (e) => {
    if (e) e.stopPropagation();
    setApplyModalOpen(true);
  };

  const closeApply = () => {
    setApplyModalOpen(false);
  };

  const jobs = [
    {
      id: 'fpt',
      title: 'Senior React Developer',
      company: 'FPT Software',
      logo: 'F',
      logoClass: 'l-fpt',
      location: 'Cầu Giấy, Hà Nội',
      workMode: 'Hybrid (3 ngày remote)',
      type: 'Full-time',
      size: '1000+ nhân viên',
      salary: '25 – 35 triệu',
      posted: 'Đăng 2 giờ trước',
      deadline: 'Còn 26 ngày',
      tags: ['React.js', 'TypeScript', 'Node.js', 'Redux'],
      source: 'TopCV',
      sourceClass: 'sc-tc',
      featured: true,
      badge: '⭐ Nổi bật',
      badgeClass: 'badge-feat'
    },
    {
      id: 'shopee',
      title: 'Frontend Lead Engineer',
      company: 'Shopee Vietnam',
      logo: 'S',
      logoClass: 'l-shopee',
      location: 'Quận 1, TP.HCM',
      workMode: 'Onsite',
      type: 'Full-time',
      salary: '40 – 60 triệu',
      posted: 'Đăng hôm nay',
      deadline: 'Còn 3 ngày',
      tags: ['React', 'Team Lead', 'Performance', 'System Design'],
      source: 'CareerLink',
      sourceClass: 'sc-cl',
      urgent: true,
      badge: '🔥 Tuyển gấp',
      badgeClass: 'badge-hot'
    },
    {
      id: 'vng',
      title: 'Full-stack Engineer (Python + React)',
      company: 'VNG Corporation',
      logo: 'V',
      logoClass: 'l-vng',
      location: 'Quận 7, TP.HCM',
      workMode: 'Remote 100%',
      type: 'Full-time',
      salary: '30 – 45 triệu',
      posted: 'Đăng 5 giờ trước',
      deadline: 'Còn 30 ngày',
      tags: ['Python', 'React', 'AWS', 'PostgreSQL'],
      source: 'CareerViet',
      sourceClass: 'sc-cv',
      badge: '✦ Mới đăng',
      badgeClass: 'badge-new'
    },
    {
      id: 'tiki',
      title: 'React Native Mobile Developer',
      company: 'Tiki Corporation',
      logo: 'Ti',
      logoClass: 'l-tiki',
      location: 'Toàn quốc',
      workMode: 'Remote 100%',
      type: 'Mobile',
      salary: '22 – 32 triệu',
      posted: 'Đăng 1 ngày trước',
      deadline: 'Còn 20 ngày',
      tags: ['React Native', 'iOS', 'Android', 'Firebase'],
      source: 'VietnamWorks',
      sourceClass: 'sc-vw',
      badge: '🏠 Remote',
      badgeClass: 'badge-remote'
    },
    {
      id: 'momo',
      title: 'Backend Engineer — Golang',
      company: 'MoMo (M_Service)',
      logo: 'M',
      logoClass: 'l-momo',
      location: 'Quận 3, TP.HCM',
      workMode: 'Hybrid',
      type: 'Full-time',
      salary: '28 – 42 triệu',
      posted: 'Đăng 2 ngày trước',
      deadline: 'Còn 18 ngày',
      tags: ['Golang', 'gRPC', 'Kafka', 'K8s'],
      source: 'TopCV',
      sourceClass: 'sc-tc',
      extraBadges: ['Unicorn']
    },
    {
      id: 'grab',
      title: 'Software Engineer II — Platform',
      company: 'Grab Vietnam',
      logo: 'G',
      logoClass: 'l-grab',
      location: 'TP.HCM / HN',
      workMode: 'Hybrid',
      type: 'Full-time',
      salary: '45 – 70 triệu',
      posted: 'Đăng 3 ngày trước',
      deadline: 'Còn 14 ngày',
      tags: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
      source: 'LinkedIn',
      sourceClass: 'sc-li',
      featured: true,
      badge: '💎 Premium',
      badgeClass: 'badge-feat',
      extraBadges: ['Superapp']
    },
    {
      id: 'vnpay',
      title: 'Product Manager — Payment',
      company: 'VNPay',
      logo: 'VP',
      logoClass: 'l-vnpay',
      location: 'Hoàn Kiếm, HN',
      workMode: 'Onsite',
      type: 'Senior level',
      salary: '35 – 55 triệu',
      posted: 'Đăng 4 ngày trước',
      deadline: 'Còn 22 ngày',
      tags: ['Product', 'Fintech', 'Agile / Scrum', 'OKR'],
      source: 'CareerViet',
      sourceClass: 'sc-cv'
    },
    {
      id: 'zalo',
      title: 'Junior Frontend Developer (Fresher)',
      company: 'Zalo Group',
      logo: 'Z',
      logoClass: 'l-zalo',
      location: 'Quận 7, TP.HCM',
      workMode: 'Hybrid',
      type: 'Full-time',
      salary: '12 – 18 triệu',
      posted: 'Đăng 1 ngày trước',
      deadline: 'Còn 25 ngày',
      tags: ['HTML/CSS', 'JavaScript', 'Vue.js', 'Git'],
      source: 'TopCV',
      sourceClass: 'sc-tc',
      badge: '🎓 Fresher OK',
      badgeClass: 'badge-new'
    },
    {
      id: 'sea',
      title: 'Data Engineer — Big Data Platform',
      company: 'Sea Limited',
      logo: 'Sea',
      logoClass: 'l-sea',
      location: 'Quận 1, TP.HCM',
      workMode: 'English',
      type: 'Data',
      salary: '40 – 65 triệu',
      posted: 'Đăng 5 ngày trước',
      deadline: 'Còn 12 ngày',
      tags: ['Spark', 'Airflow', 'Python', 'dbt', 'Kafka'],
      source: 'LinkedIn',
      sourceClass: 'sc-li',
      extraBadges: ['NYSE: SE']
    },
    {
      id: 'misa',
      title: 'DevOps / Cloud Engineer',
      company: 'MISA Joint Stock Company',
      logo: 'Mi',
      logoClass: 'l-misa',
      location: 'Đống Đa, HN',
      workMode: 'Hybrid',
      type: 'Cloud',
      salary: '25 – 40 triệu',
      posted: 'Đăng 3 ngày trước',
      deadline: 'Còn 17 ngày',
      tags: ['Docker', 'Kubernetes', 'Terraform', 'AWS'],
      source: 'TopCV',
      sourceClass: 'sc-tc'
    }
  ];

  const categories = [
    { name: 'Tất cả' },
    { name: '💻 IT/Tech' },
    { name: '📊 Marketing' },
    { name: '💰 Tài chính' },
    { name: '🎨 Design' },
    { name: '🏢 Quản lý' },
    { name: '🏠 Remote' }
  ];

  const trendingKeywords = ['AI Engineer', 'LLM', 'Golang', 'Rust', 'React Native', 'DevOps', 'Product Manager', 'Figma', 'Web3', 'Kubernetes', 'FastAPI', 'Next.js', 'Blockchain', 'Machine Learning'];

  const topCompanies = [
    { name: 'FPT Software', jobs: '127 vị trí đang tuyển', logo: 'F', logoClass: 'l-fpt', badge: 'Đang tuyển', badgeClass: 'cb-hire' },
    { name: 'VNG Corporation', jobs: '84 vị trí đang tuyển', logo: 'V', logoClass: 'l-vng', badge: 'Hot', badgeClass: 'cb-hot' },
    { name: 'Shopee Vietnam', jobs: '62 vị trí đang tuyển', logo: 'S', logoClass: 'l-shopee', badge: 'Đang tuyển', badgeClass: 'cb-hire' },
    { name: 'MoMo', jobs: '48 vị trí đang tuyển', logo: 'M', logoClass: 'l-momo', badge: 'Hot', badgeClass: 'cb-hot' },
    { name: 'Grab Vietnam', jobs: '35 vị trí đang tuyển', logo: 'G', logoClass: 'l-grab', badge: 'Đang tuyển', badgeClass: 'cb-hire' }
  ];

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeDetail();
        closeApply();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="app">
      {/* NAVBAR */}
      {/* <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-logo"><em>GZCONNECT</em></div>
          <div className="nav-links">
            <a className="nav-link active" href="#">Tìm việc làm</a>
            <a className="nav-link" href="#">Công ty</a>
            <a className="nav-link" href="#">CV Builder</a>
            <a className="nav-link" href="#">Blog nghề nghiệp</a>
          </div>
          <div className="nav-right">
            <button className="btn btn-ghost btn-sm">Đăng nhập</button>
            <button className="btn btn-rust btn-sm">Đăng ký</button>
          </div>
        </div>
      </nav> */}

      {/* <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '16px 28px 0' }}>
        <div className="login-nudge">
          <div className="nudge-icon">🤖</div>
          <div className="nudge-text">
            <div className="nudge-title">Đăng ký miễn phí để nhận gợi ý việc làm phù hợp với bạn</div>
            <div className="nudge-sub">AI sẽ học theo hành vi của bạn và tự động nộp CV đến 15+ nền tảng cùng lúc</div>
          </div>
          <div className="nudge-actions">
            <button className="btn btn-rust btn-sm">Đăng ký miễn phí</button>
            <button 
              className="btn btn-ghost btn-sm" 
              style={{ color: 'rgba(200,184,154,.6)', borderColor: 'rgba(255,255,255,.15)' }}
              onClick={(e) => e.target.closest('.login-nudge').style.display = 'none'}
            >
              ✕
            </button>
          </div>
        </div>
      </div> */}

      <div className="page">
        <aside className="sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <div className="filter-header-title">Bộ lọc</div>
              <span className="filter-clear" onClick={clearFilters}>Xoá tất cả</span>
            </div>

            <div className="filter-section">
              <div className="filter-section-title">Loại hình công việc</div>
              {[
                { label: 'Full-time', count: '32,410', checked: true },
                { label: 'Remote / Hybrid', count: '8,920', checked: true },
                { label: 'Part-time', count: '2,340', checked: false },
                { label: 'Freelance', count: '1,180', checked: false },
                { label: 'Thực tập sinh', count: '4,600', checked: false }
              ].map(item => (
                <div key={item.label} className="ck-row" onClick={() => toggleFilter('jobType', item.label)}>
                  <div className={`ck ${activeFilters.jobType.includes(item.label) ? 'on' : ''}`}>
                    {activeFilters.jobType.includes(item.label) ? '✓' : ''}
                  </div>
                  <span className="ck-label">{item.label}</span>
                  <span className="ck-count">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Mức lương */}
            <div className="filter-section">
              <div className="filter-section-title">Mức lương (triệu/tháng)</div>
              <div className="range-row"><span>0</span><span>{salaryRange}tr+</span></div>
              <input
                type="range"
                min="0"
                max="100"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
              <div className="salary-pills">
                {['Dưới 10tr', '10–20tr', '20–40tr', '40–60tr', 'Trên 60tr'].map((pill, idx) => (
                  <span
                    key={pill}
                    className={`spill ${pill === '20–40tr' ? 'on' : ''}`}
                    onClick={(e) => e.target.classList.toggle('on')}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Kinh nghiệm */}
            <div className="filter-section">
              <div className="filter-section-title">Kinh nghiệm</div>
              {[
                { label: 'Không yêu cầu KN', count: '5,200' },
                { label: 'Dưới 1 năm', count: '3,800' },
                { label: '1 – 3 năm', count: '12,400', checked: true },
                { label: '3 – 5 năm', count: '8,900', checked: true },
                { label: 'Trên 5 năm', count: '4,100' }
              ].map(item => (
                <div key={item.label} className="ck-row" onClick={() => toggleFilter('experience', item.label)}>
                  <div className={`ck ${activeFilters.experience.includes(item.label) ? 'on' : ''}`}>
                    {activeFilters.experience.includes(item.label) ? '✓' : ''}
                  </div>
                  <span className="ck-label">{item.label}</span>
                  <span className="ck-count">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Ngành nghề */}
            <div className="filter-section">
              <div className="filter-section-title">Ngành nghề</div>
              {[
                { label: 'IT / Phần mềm', count: '15,200', checked: true },
                { label: 'Marketing / Digital', count: '6,400' },
                { label: 'Tài chính / Kế toán', count: '4,800' },
                { label: 'Thiết kế / Sáng tạo', count: '3,200' },
                { label: 'Bán hàng / Kinh doanh', count: '7,600' },
                { label: 'Quản lý / Điều hành', count: '2,100' }
              ].map(item => (
                <div key={item.label} className="ck-row" onClick={() => toggleFilter('industry', item.label)}>
                  <div className={`ck ${activeFilters.industry.includes(item.label) ? 'on' : ''}`}>
                    {activeFilters.industry.includes(item.label) ? '✓' : ''}
                  </div>
                  <span className="ck-label">{item.label}</span>
                  <span className="ck-count">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Nguồn */}
            <div className="filter-section">
              <div className="filter-section-title">Nguồn tuyển dụng</div>
              {[
                { name: 'TopCV', code: 'T', class: 'sl-tc', count: '18,400', checked: true },
                { name: 'CareerLink', code: 'C', class: 'sl-cl', count: '12,100', checked: true },
                { name: 'CareerViet', code: 'V', class: 'sl-cv', count: '9,800', checked: true },
                { name: 'VietnamWorks', code: 'V', class: 'sl-vw', count: '8,200' },
                // { name: 'LinkedIn', code: 'in', class: 'sl-li', count: '5,600', small: true },
                // { name: 'ITviec', code: 'IT', class: 'sl-it', count: '3,900', small: true }
              ].map(source => (
                <div key={source.name} className="source-row" onClick={() => toggleFilter('source', source.name)}>
                  <div className={`source-logo ${source.class}`} style={source.small ? { fontSize: '10px' } : {}}>{source.code}</div>
                  <span style={{ fontSize: '13px', flex: 1 }}>{source.name}</span>
                  <div className={`ck ${activeFilters.source.includes(source.name) ? 'on' : ''}`}>
                    {activeFilters.source.includes(source.name) ? '✓' : ''}
                  </div>
                  <span className="ck-count">{source.count}</span>
                </div>
              ))}
            </div>

            {/* Địa điểm */}
            <div className="filter-section">
              <div className="filter-section-title">Địa điểm</div>
              {[
                { label: 'TP. Hồ Chí Minh', count: '28,400', checked: true },
                { label: 'Hà Nội', count: '14,200' },
                { label: 'Đà Nẵng', count: '3,400' },
                { label: 'Toàn quốc', count: '2,800' },
                { label: 'Nước ngoài', count: '840' }
              ].map(item => (
                <div key={item.label} className="ck-row" onClick={() => toggleFilter('location', item.label)}>
                  <div className={`ck ${activeFilters.location.includes(item.label) ? 'on' : ''}`}>
                    {activeFilters.location.includes(item.label) ? '✓' : ''}
                  </div>
                  <span className="ck-label">{item.label}</span>
                  <span className="ck-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo card */}
          {/* <div style={{ marginTop: '14px' }}>
            <div className="promo-card">
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤖</div>
              <div className="promo-title">Để AI tìm việc thay bạn</div>
              <div className="promo-sub">Đăng ký miễn phí và nhận gợi ý việc phù hợp mỗi ngày</div>
              <div className="promo-steps">
                {['Tạo hồ sơ trong 2 phút', 'AI phân tích kỹ năng của bạn', 'Nhận 10+ gợi ý mỗi ngày', '1-click tự động nộp CV'].map((step, idx) => (
                  <div key={idx} className="promo-step">
                    <div className="promo-step-n">{idx + 1}</div>
                    <div className="promo-step-t">{step}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-rust" style={{ width: '100%', justifyContent: 'center' }}>Bắt đầu miễn phí →</button>
            </div>
          </div> */}
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          {/* Active filter chips */}
          <div className="active-filters">
            {activeFilters.industry.map(f => (
              <div key={f} className="af-chip" onClick={() => removeFilterChip('industry', f)}>{f} <span className="af-x">×</span></div>
            ))}
            {activeFilters.jobType.map(f => (
              <div key={f} className="af-chip" onClick={() => removeFilterChip('jobType', f)}>{f} <span className="af-x">×</span></div>
            ))}
            <div className="af-chip" onClick={() => { }}>20–40 triệu <span className="af-x">×</span></div>
            {activeFilters.experience.map(f => (
              <div key={f} className="af-chip" onClick={() => removeFilterChip('experience', f)}>{f.replace('KN', 'KN')} <span className="af-x">×</span></div>
            ))}
            {activeFilters.location.map(f => (
              <div key={f} className="af-chip" onClick={() => removeFilterChip('location', f)}>{f === 'TP. Hồ Chí Minh' ? 'HCM' : f} <span className="af-x">×</span></div>
            ))}
          </div>

          {/* Category tabs */}
          <div className="cat-tabs">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`cat-tab ${selectedCategory === cat.name ? 'on' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name} <span className="ct-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Results bar */}
          <div className="results-bar">
            <div className="results-count">Tìm thấy <strong>15,247 việc làm</strong> phù hợp bộ lọc</div>
            <div className="sort-row">
              <span className="sort-label">Sắp xếp:</span>
              <select className="sort-sel">
                <option>Phù hợp nhất</option>
                <option>Mới nhất</option>
                <option>Lương cao nhất</option>
                <option>Sắp hết hạn</option>
              </select>
            </div>
          </div>

          {/* Featured banner */}
          <div className="featured-banner">
            <div className="fb-icon">⭐</div>
            <div>
              <div className="fb-title">3 tin tuyển dụng nổi bật hôm nay từ TopCV</div>
              <div className="fb-sub">Được các nhà tuyển dụng hàng đầu tài trợ • Cập nhật lúc 08:00 sáng nay</div>
            </div>
            <div className="fb-cta">
              <button className="btn btn-amber btn-sm">Xem tất cả ↗</button>
            </div>
          </div>

          {/* JOB CARDS */}
          <div className="jobs-list">
            {jobs.map((job, idx) => (
              <div
                key={job.id}
                className={`job-card fade-in ${job.featured ? 'featured' : ''} ${job.urgent ? 'urgent' : ''}`}
                style={{ animationDelay: `${(idx + 1) * 0.04}s` }}
                onClick={() => openDetail(job.id)}
              >
                {job.badge && <div className={`card-hot-badge ${job.badgeClass}`}>{job.badge}</div>}
                <div className="jc-top">
                  <div className={`co-logo ${job.logoClass}`}>{job.logo}</div>
                  <div className="jc-info">
                    <div className="jc-title">{job.title}</div>
                    <div className="jc-company">
                      {job.company} <span className="verified">✓</span>
                      {job.extraBadges && job.extraBadges.map(badge => (
                        <span key={badge} className={`badge ${badge === 'Top 10 IT VN' ? 'b-sage' : badge === 'Sea Group' ? 'b-teal' : badge === 'Unicorn' ? 'b-amber' : badge === 'Superapp' ? 'b-sage' : 'b-indigo'}`} style={{ fontSize: '10px' }}>{badge}</span>
                      ))}
                    </div>
                    <div className="jc-meta">
                      <span className="jc-meta-item">📍 {job.location}</span>
                      <span className="jc-meta-item">{job.workMode.includes('Remote') ? '🏠' : job.workMode.includes('Hybrid') ? '🏠' : '🏢'} {job.workMode}</span>
                      <span className="jc-meta-item">⏰ {job.type}</span>
                      {job.size && <span className="jc-meta-item">👥 {job.size}</span>}
                    </div>
                  </div>
                  <div className="jc-right">
                    <div className="jc-salary">{job.salary}</div>
                    <div className="jc-posted">{job.posted}</div>
                    <div className="jc-deadline" style={job.urgent ? { color: 'var(--rust)' } : {}}>{job.urgent ? '⚠️ ' : '⏰ '}{job.deadline}</div>
                  </div>
                </div>
                <div className="jc-bottom">
                  <div className="jc-tags">
                    {job.tags.map(tag => <span key={tag} className="jtag">{tag}</span>)}
                    <span className={`source-chip ${job.sourceClass}`}>{job.source}</span>
                  </div>
                  <div className="jc-actions">
                    <button
                      className={`jc-save ${savedJobs.has(job.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSave(job.id, e)}
                      title="Lưu việc làm"
                    >
                      🔖
                    </button>
                    <button className="jc-apply" onClick={(e) => { e.stopPropagation(); openApply(); }}>⚡ Apply ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`pg-btn ${currentPage === page ? 'on' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: 'var(--ink4)' }}>…</span>
            <button className="pg-btn" onClick={() => setCurrentPage(127)}>127</button>
            <button className="pg-btn pg-next" onClick={() => setCurrentPage(p => p + 1)}>Tiếp theo →</button>
          </div>
        </main>
      </div>

      {/* Trending & Top Companies */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 28px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Trending keywords */}
        <div className="side-card">
          <div className="side-title">🔥 Từ khóa đang hot <a className="see-all" href="#">Xem thêm</a></div>
          <div className="kw-grid">
            {trendingKeywords.map(kw => (
              <span key={kw} className="kw-pill">{kw}</span>
            ))}
          </div>
        </div>

        {/* Top companies hiring */}
        <div className="side-card">
          <div className="side-title">🏢 Công ty đang tuyển nhiều <a className="see-all" href="#">Tất cả</a></div>
          {topCompanies.map(company => (
            <div key={company.name} className="co-row">
              <div className={`co-mini ${company.logoClass}`}>{company.logo}</div>
              <div className="co-info">
                <div className="co-name">{company.name}</div>
                <div className="co-jobs">{company.jobs}</div>
              </div>
              <span className={`co-badge ${company.badgeClass}`}>{company.badge}</span>
            </div>
          ))}
        </div>

        {/* Job alert setup */}
        <div className="alert-card">
          <div className="alert-title">🔔 Tạo thông báo việc làm</div>
          <div className="alert-sub">Nhận email ngay khi có việc phù hợp — không cần tài khoản!</div>
          <input className="alert-input" type="text" placeholder="Từ khóa: React Developer, PM..." />
          <input className="alert-input" type="email" placeholder="Email của bạn" />
          <button className="btn btn-rust" style={{ width: '100%', justifyContent: 'center' }}>🔔 Tạo thông báo miễn phí</button>
          <div style={{ fontSize: '11px', color: 'var(--ink4)', marginTop: '8px', textAlign: 'center' }}>Gửi tối đa 1 email/ngày • Huỷ bất cứ lúc nào</div>
        </div>
      </div>

      {/* FOOTER */}
      {/* <footer className="footer-mini">
        <div className="fm-inner">
          <div className="fm-logo">Nghề<span>VN</span></div>
          <div className="fm-links">
            <a href="#">Về chúng tôi</a>
            <a href="#">Blog</a>
            <a href="#">Tuyển dụng</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản</a>
            <a href="#">Liên hệ</a>
          </div>
          <div className="fm-copy">© 2026 NghềVN. Tổng hợp việc làm từ TopCV, CareerLink, CareerViet, VietnamWorks & 10+ nền tảng lớn.</div>
        </div>
      </footer> */}

      <div className={`detail-overlay ${detailOpen ? 'open' : ''}`} onClick={closeDetail}>
        <div className="detail-panel" onClick={e => e.stopPropagation()}>
          <div className="dp-header">
            <div className="co-logo l-fpt" id="dpLogo">F</div>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: '18px', fontWeight: 700, marginBottom: '4px' }} id="dpTitle">Senior React Developer</div>
              <div style={{ fontSize: '13px', color: 'var(--ink3)' }} id="dpCompany">FPT Software • Hybrid • Hà Nội</div>
              <div style={{ display: 'flex', gap: '7px', marginTop: '8px' }} id="dpBadges">
                <span className="badge b-amber">25–35 triệu/tháng</span>
                <span className="badge b-sage">⏰ Còn 26 ngày</span>
                <span className="source-chip sc-tc">TopCV</span>
              </div>
            </div>
            <button className="dp-close" onClick={closeDetail}>✕</button>
          </div>
          <div className="dp-body">
            <div className="dp-section">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <span className="jc-meta-item">📍 Cầu Giấy, Hà Nội</span>
                <span className="jc-meta-item">🏠 Hybrid (3 ngày remote)</span>
                <span className="jc-meta-item">⏰ Full-time</span>
                <span className="jc-meta-item">👁 2,341 lượt xem</span>
                <span className="jc-meta-item">📤 842 đã nộp</span>
              </div>
              {/* <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px' }}>🔓</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>Bạn đang xem với tư cách khách</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink3)' }}>Đăng ký miễn phí để <strong>nộp CV tự động</strong>, theo dõi trạng thái và nhận gợi ý AI</div>
                </div>
                <button className="btn btn-rust btn-sm" style={{ flexShrink: 0 }}>Đăng ký</button>
              </div> */}
            </div>
            <div className="dp-section">
              <div className="dp-sec-title">Mô tả công việc</div>
              <ul className="dp-list">
                <li>Phát triển ứng dụng web phức tạp với React.js và TypeScript, đảm bảo hiệu suất tối ưu</li>
                <li>Thiết kế và implement UI/UX theo mockup từ designer, đạt tiêu chuẩn pixel-perfect</li>
                <li>Phối hợp với Backend engineers tích hợp REST API và GraphQL</li>
                <li>Code review, mentoring Junior Developer và thiết lập best practices</li>
                <li>Tham gia Sprint planning, ước tính effort và breakdown task kỹ thuật</li>
              </ul>
            </div>
            <div className="dp-section">
              <div className="dp-sec-title">Yêu cầu ứng viên</div>
              <ul className="dp-list">
                <li>Tối thiểu 3 năm kinh nghiệm React.js, thành thạo Hooks, Context API, Performance optimization</li>
                <li>Thành thạo TypeScript, hiểu rõ type system và generic types</li>
                <li>Kinh nghiệm với state management: Redux Toolkit, Zustand hoặc Jotai</li>
                <li>Hiểu biết về Core Web Vitals, lazy loading, code splitting, bundle optimization</li>
                <li>Tiếng Anh đọc viết tài liệu kỹ thuật tốt (Reading/Writing)</li>
              </ul>
            </div>
            <div className="dp-section">
              <div className="dp-sec-title">Quyền lợi</div>
              <ul className="dp-list">
                <li>Lương cạnh tranh 25–35 triệu, review 2 lần/năm theo hiệu quả</li>
                <li>Thưởng dự án, thưởng cuối năm lên đến 3 tháng lương</li>
                <li>BHYT, BHXH đầy đủ + gói bảo hiểm sức khỏe nâng cao Bảo Việt</li>
                <li>Budget học tập 5,000,000đ/năm cho khóa học, sách, chứng chỉ</li>
                <li>14 ngày phép/năm + remote 3 ngày/tuần sau 3 tháng thử việc</li>
              </ul>
            </div>
            <div className="dp-section">
              <div className="dp-sec-title">Thông tin công ty</div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div className="co-logo l-fpt" style={{ flexShrink: 0 }}>F</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>FPT Software</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink3)', lineHeight: 1.65 }}>Công ty phần mềm hàng đầu Việt Nam với 30,000+ nhân viên, hiện diện tại 29 quốc gia. Chuyên cung cấp giải pháp CNTT cho doanh nghiệp toàn cầu.</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '9px' }}>
                    <span className="badge b-sage">🏆 Top 10 IT VN</span>
                    <span className="badge b-teal">🌍 30K+ nhân viên</span>
                    <span className="badge b-gray">📅 Thành lập 1999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dp-apply-bar">
            <button className="dp-apply-btn" onClick={openApply}>⚡ Apply ngay (Đăng ký để nộp tự động)</button>
            <button className="dp-save-btn" onClick={(e) => toggleSave('detail', e)}>🔖</button>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {applyModalOpen && (
        <div
          id="applyModal"
          style={{
            display: 'flex',
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 3000,
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)'
          }}
          onClick={closeApply}
        >
          <div
            style={{
              background: 'var(--surf)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 24px 80px rgba(0,0,0,.3)',
              animation: 'fadeIn .25s ease-out',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >

            {/* Close */}
            <button
              onClick={closeApply}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: 'var(--ink4)',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔗</div>

              <div
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  marginBottom: '8px'
                }}
              >
                Chuyển đến trang ứng tuyển
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--ink3)',
                  lineHeight: 1.65
                }}
              >
                Đây là nền tảng tổng hợp việc làm.
                Khi nhấn <b>Ứng tuyển</b>, bạn sẽ được chuyển đến trang gốc của công việc để hoàn tất việc nộp hồ sơ.
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              {[
                { icon: '🌐', title: 'Trang tuyển dụng gốc', desc: 'Bạn sẽ được chuyển đến website đăng tuyển chính thức' },
                { icon: '📄', title: 'Nộp hồ sơ trực tiếp', desc: 'Ứng tuyển bằng CV của bạn trên nền tảng đó' },
                { icon: '🔒', title: 'Bảo mật thông tin', desc: 'Chúng tôi không lưu thông tin hồ sơ ứng tuyển của bạn' },
                // { icon: '🌐', title: 'Nguồn tuyển dụng', desc: new URL(job.sourceUrl).hostname }
                { icon: '🌐', title: 'Nguồn tuyển dụng', desc: null }
              ].map(item => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '10px 14px',
                    background: 'var(--bg2)',
                    borderRadius: '9px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {item.title}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--ink3)' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply button */}
            <button
              className="btn btn-rust"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: '14px',
                background: 'rgb(35, 42, 162)'
              }}
              onClick={() => window.open(job.sourceUrl, "_blank")}
            >
              Đi đến trang ứng tuyển →
            </button>

            <div
              style={{
                textAlign: 'center',
                marginTop: '12px',
                fontSize: '12px',
                color: 'var(--ink4)'
              }}
            >
              Hoặc <span
                style={{ color: 'var(--rust)', cursor: 'pointer', fontWeight: 600 }}
                onClick={closeApply}
              >
                quay lại xem việc khác
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default JobSearchScreen;