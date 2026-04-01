import './JobDetailScreen.css'
import Badge from '../../common/Badge/Badge'
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { getToken } from '../../../utils/auth';

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
  )
}

function JobDetailScreen() {

  const matchData = [
    { label: 'Kỹ năng kỹ thuật', value: 95, color: 'f-sage' },
    { label: 'Kinh nghiệm', value: 80, color: 'f-rust' },
    { label: 'Mức lương', value: 90, color: 'f-amber' },
    { label: 'Địa điểm', value: 70, color: 'f-teal' }
  ]

  const API = 'http://localhost:3000/api';
  const { id } = useParams();
  const [selectedJob, setSelectedJob] = useState(null);
  const [token, setToken] = useState(() => getToken());
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const openApply = (e) => { if (e) e.stopPropagation(); setApplyModalOpen(true); };
  const closeApply = () => setApplyModalOpen(false);
  const getLogoLetter = (name) => name?.[0]?.toUpperCase() ?? '?';

  useEffect(() => {
    const sync = () => setToken(getToken());
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  useEffect(() => {
    fetch(`${API}/jobs/${id}`)
      .then(res => res.json())
      .then(data => setSelectedJob(data))
      .catch(err => console.error("Failed to fetch job details:", err));

  }, [id])

  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (days < 0) return 'Đã hết hạn';
    if (days === 0) return 'Hết hạn hôm nay';
    return `Còn ${days} ngày`;
  };

  const showToast = (message) => {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1C1510;color:#F5EED8;padding:10px 20px;border-radius:9px;font-size:13px;font-weight:600;z-index:9999;animation:fadeIn .2s ease-out';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  };

  const trackBehavior = useCallback((jobID, action) => {
    if (!token) return;
    fetch(`${API}/jobs/${jobID}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    }).catch(console.error);
  }, [token]);


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

  return (
    <div id="s4">
      <div className="app-layout">
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

        <div className="main-content">
          <div className="jd-wrap">
            <div className="jd-main">
              <div className="jd-head">
                {/* <div className="jd-logo-big l-fpt">{selectedJob?.company?.companyLogo}</div> */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div className="jd-logo" style={{ background: 'linear-gradient(135deg,#1565C0,#1E88E5)', flexShrink: 0 }}>
                    {selectedJob?.company?.companyLogo ? (
                      <img src={selectedJob?.company?.companyLogo} alt={selectedJob?.company?.companyName} />
                    ) : (
                      <span>{getLogoLetter(selectedJob?.company?.companyName)}</span>
                    )}
                  </div>
                </div>
                <h1 className="jd-title">{selectedJob?.title}</h1>
                <div className="jd-co">
                  {selectedJob?.company?.companyName}
                  <Badge variant="indigo">{selectedJob?.company?.companySize}</Badge>
                </div>
                <div className="jd-meta-row">
                  <span className="jd-meta-pill">📍 {selectedJob?.shortLocation}</span>
                  <span className="jd-meta-pill">🏠 {selectedJob?.jobType}</span>
                  <span className="jd-meta-pill">⏰ {selectedJob?.workingTime}</span>
                  <span className="jd-meta-pill">📅 {formatDeadline(selectedJob?.deadline)}</span>
                  {/* <span className="jd-meta-pill">👁 2,341 lượt xem</span> */}
                </div>
                <div className="jd-actions">
                  <button className="btn btn-rust btn-lg" onClick={(e) => { e.stopPropagation(); handleApply(e, selectedJob?.jobID); }}>⚡ Apply</button>
                  <button
                    className={`jd-save ${savedJobIds.has(selectedJob?.jobID) ? 'saved' : ''}`}
                    onClick={(e) => handleSave(selectedJob?.jobID, e)}
                  >
                    {savedJobIds.has(selectedJob?.jobID) ? '🔖 Đã lưu' : '🔖 Lưu'}
                  </button>
                </div>
              </div>

              <div className="ai-box">
                <div className="ai-box-header">
                  <div className="ai-box-title">🤖 Phân tích AI — Mức độ phù hợp</div>
                </div>
                <div className="ai-box-content">
                  <div className="ai-ring">
                    <div className="ai-ring-in">
                      <div className="ai-ring-n">87%</div>
                      <div className="ai-ring-s">Match</div>
                    </div>
                  </div>
                  <div className="match-breakdown">
                    {matchData.map((item, idx) => (
                      <div key={idx} className="mbar-row">
                        <span className="mbar-label">{item.label}</span>
                        <div className="mbar-bg">
                          <div className={`mbar-fill ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                        <span className="mbar-pct">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="ai-tip">
                    💡 Thêm Docker vào CV để tăng 8% điểm phù hợp
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="jd-sec-title">Mô tả công việc</div>
              <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {selectedJob?.description}
              </div>

              <div className="divider"></div>

              <div className="jd-sec-title">Yêu cầu ứng viên</div>
              <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {selectedJob?.requirement}
              </div>

              {selectedJob?.benefit && (
                <>
                  <div className="divider"></div>
                  <div className="jd-sec-title">Quyền lợi</div>
                  <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {selectedJob?.benefit}
                  </div>
                </>)}


              {selectedJob?.other && (
                <>
                  <div className="divider"></div>
                  <div className="jd-sec-title">Yêu cầu khác</div>
                  <div
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--ink2)',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {selectedJob.other}
                  </div>
                </>
              )}

            </div>

            <div className="jd-side">
              <div className="apply-box">
                <div className="apply-salary">{selectedJob?.salary}</div>
                <div className="apply-dl">⏰ Hạn nộp: {formatDeadline(selectedJob?.deadline)}</div>
                <button className="btn btn-rust w100 btn-lg" onClick={(e) => { e.stopPropagation(); handleApply(e, selectedJob?.jobID); }}>⚡ Apply ngay</button>

                <div className="platforms-list">
                  <div className="plat-list-title">SẼ NỘP ĐẾN:</div>
                  {selectedJob?.sourcePlatform}
                </div>
              </div>

              <div className="card company-card">
                <div className="company-title">Về công ty</div>
                <div className="company-desc">
                  <div style={{ fontSize: '13.5px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {selectedJob?.company?.companyProfile}
                  </div>
                </div>
                <div className="company-badges">
                  <Badge variant="teal">🌍 {selectedJob?.company?.address}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                Khi nhấn <b>Đi đến trang ứng tuyển </b>, bạn sẽ được chuyển đến trang gốc để hoàn tất nộp hồ sơ.
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
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--ink3)',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                  }}>
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
    </div >

  );
}
export default JobDetailScreen