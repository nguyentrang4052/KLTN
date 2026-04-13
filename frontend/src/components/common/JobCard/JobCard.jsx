import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';
import Badge from '../Badge/Badge';

const API_BASE = 'http://localhost:3000/api';

function JobCard({ job, showMatch = true, showActions = true, token, onSave, onCompanyClick }) {
  const [saved, setSaved] = useState(job?.isSaved ?? false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const openApply = (e) => { if (e) e.stopPropagation(); setApplyModalOpen(true); };
  const closeApply = () => setApplyModalOpen(false);

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!token) { setShowLoginModal(true); return; }
    try {
      await fetch(`${API_BASE}/jobs/${job.id}/save`, {
        method: saved ? 'DELETE' : 'POST',
        headers,
      });
      if (!saved && onSave) onSave(job.id);
      setSaved(!saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = (e, jobID) => {
    if (e) e.stopPropagation();
    if (!token) { setShowLoginModal(true); return; }
    if (jobID) trackBehavior(jobID, 'apply');
    openApply(e);
  };

  const handleGoLogin = (e) => {
    e.stopPropagation();
    setShowLoginModal(false);
    navigate('/login');
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 50);
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    if (onCompanyClick && job.companyID) {
      onCompanyClick(job.companyID);
    }
  };

  const getPlatformBadge = (platform) => {
    const badges = {
      TopCV: 'b-sage',
      CareerViet: 'b-rust',
      CareerLink: 'b-teal',
    };
    return badges[platform] || 'b-gray';
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'var(--sage)';
    if (match >= 80) return 'var(--amber)';
    return 'var(--rust)';
  };

  const trackBehavior = useCallback((jobID, action) => {
    if (!token) return;
    fetch(`${API_BASE}/jobs/${jobID}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    }).catch(console.error);
  }, [token]);

  if (!job) return null;

  const logoLetter = job.company?.[0]?.toUpperCase() ?? '?';

  return (
    <>
      {showLoginModal && (
        <div className="jcard-modal-overlay" onClick={(e) => { e.stopPropagation(); setShowLoginModal(false); }}>
          <div className="jcard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jcard-modal-icon">🔐</div>
            <div className="jcard-modal-title">Bạn chưa đăng nhập</div>
            <div className="jcard-modal-desc">Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.</div>
            <div className="jcard-modal-actions">
              <button className="btn btn-outline btn-md" onClick={(e) => { e.stopPropagation(); setShowLoginModal(false); }}>
                Để sau
              </button>
              <button className="btn btn-rust btn-md" onClick={handleGoLogin}>
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card jcard">
        <div className="jcard-top">
          {job.companyLogo ? (
            <img
              className="co-logo"
              src={job.companyLogo}
              alt={job.company}
              onClick={handleCompanyClick}
              style={{ cursor: onCompanyClick && job.companyID ? 'pointer' : 'default' }}
            />
          ) : (
            <div
              className="co-logo co-logo--letter"
              onClick={handleCompanyClick}
              style={{ cursor: onCompanyClick && job.companyID ? 'pointer' : 'default' }}
            >
              {logoLetter}
            </div>
          )}
          {/* <div className={`card jcard${job.isExpired ? ' jcard--expired' : ''}`}></div> */}
          <div className="jcard-info">
            <div className="jcard-title">{job.title}</div>
            <div className="jcard-co">
              <div
                className="jcard-co-name"
                onClick={handleCompanyClick}
                style={onCompanyClick && job.companyID ? {
                  cursor: 'pointer',
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'dotted',
                } : {}}
              >
                {job.company}
              </div>
              <div>{job.shortLocation && ` • ${job.shortLocation}`}</div>
              <div>{job.type && ` • ${job.type}`}</div>
            </div>
            {/* <div className="jcard-tags">
              {(job.tags ?? []).map((tag, idx) => (
                <span key={idx} className="jtag">{tag}</span>
              ))}
              {job.platform && (
                <Badge variant={getPlatformBadge(job.platform)} className="platform-badge">
                  {job.platform}
                </Badge>
              )}
            </div> */}
            <div className="jcard-tags">
              {(job.tags ?? []).map((tag, idx) => (
                <span key={idx} className="jtag">{tag}</span>
              ))}

              {job.isExpired && (
                <span className="jcard-ribbon">Đã hết hạn</span>
              )}


              {job.platform && (
                <Badge variant={getPlatformBadge(job.platform)} className="platform-badge">
                  {job.platform}
                </Badge>
              )}
            </div>
          </div>

          {showMatch && job.match != null && (
            <div className="jcard-match">
              <div className="match-n" style={{ color: getMatchColor(job.match) }}>
                {job.match}%
              </div>
              <div className="match-l">phù hợp</div>
            </div>
          )}
        </div>

        <div className="jcard-foot">
          <span className="salary">💰 {job.salary ?? 'Thỏa thuận'}</span>
          {showActions && (
            <div className="jcard-actions">
              <button className="btn btn-outline btn-md" onClick={handleSave}>
                {saved ? '🔖 Đã lưu' : '🔖 Lưu'}
              </button>
              <button className="btn btn-rust btn-md" onClick={(e) => { e.stopPropagation(); handleApply(e, job.id); }} disabled={job.isExpired}>
                ⚡ Apply
              </button>
            </div>
          )}
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
                Khi nhấn <b>Đi đến trang ứng tuyển</b>, bạn sẽ được chuyển đến trang gốc để hoàn tất nộp hồ sơ.
              </div>
            </div>

            {[
              { icon: '🌐', title: 'Trang tuyển dụng gốc', desc: job?.platform ?? '' },
              { icon: '📄', title: 'Nộp hồ sơ trực tiếp', desc: 'Ứng tuyển bằng CV của bạn trên nền tảng đó' },
              { icon: '🔒', title: 'Bảo mật thông tin', desc: 'Chúng tôi không lưu thông tin hồ sơ ứng tuyển' },
              { icon: '🔗', title: 'Link chi tiết ở trang gốc', desc: job?.sourceLink ?? '' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 14px',
                background: 'var(--bg2)', borderRadius: '9px', border: '1px solid var(--border)', marginBottom: '8px',
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</div>
                  <div style={{
                    fontSize: '11px', color: 'var(--ink3)',
                    wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word',
                  }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}

            <button className="btn btn-rust" style={{
              width: '100%', justifyContent: 'center', padding: '13px',
              fontSize: '14px', background: 'rgb(35,42,162)', marginTop: '8px',
            }} onClick={() => job?.sourceLink && window.open(job.sourceLink, '_blank')}>
              Đi đến trang ứng tuyển →
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--ink4)' }}>
              Hoặc <span style={{ color: 'var(--rust)', cursor: 'pointer', fontWeight: 600 }}
                onClick={closeApply}>quay lại xem việc khác</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobCard;