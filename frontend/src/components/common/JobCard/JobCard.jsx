import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';
import Badge from '../Badge/Badge';

const API_BASE = 'http://localhost:3000/api';

function JobCard({ job, showMatch = true, showActions = true, token }) {
  const [saved, setSaved] = useState(job?.isSaved ?? false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const handleSave = async (e) => {
    e.stopPropagation()
    if (!token) { setShowLoginModal(true); return }
    try {
      await fetch(`${API_BASE}/jobs/${job.id}/save`, {
        method: saved ? 'DELETE' : 'POST',
        headers,
      });
      setSaved(!saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = (e) => {
    e.stopPropagation()
    if (!token) {
      setShowLoginModal(true)
      return
    }
    alert('Apply logic')
  }

  const handleGoLogin = (e) => {
    e.stopPropagation()
    setShowLoginModal(false)
    navigate('/login')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 50)
  }


  const getPlatformBadge = (platform) => {
    const badges = {
      TopCV: 'b-sage',
      CareerViet: 'b-rust',
      CareerLink: 'b-teal',
      VietnamWorks: 'b-gray',
    };
    return badges[platform] || 'b-gray';
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'var(--sage)';
    if (match >= 80) return 'var(--amber)';
    return 'var(--rust)';
  };

  if (!job) return null;

  const logoLetter = job.company?.[0]?.toUpperCase() ?? '?';

  return (
    <>
      {showLoginModal && (
        <div className="jcard-modal-overlay" onClick={(e) => { e.stopPropagation(); setShowLoginModal(false) }}>
          <div className="jcard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jcard-modal-icon">🔐</div>
            <div className="jcard-modal-title">Bạn chưa đăng nhập</div>
            <div className="jcard-modal-desc">Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.</div>
            <div className="jcard-modal-actions">
              <button className="btn btn-outline btn-md" onClick={(e) => { e.stopPropagation(); setShowLoginModal(false) }}>
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
            <img className="co-logo" src={job.companyLogo} alt={job.company} />
          ) : (
            <div className="co-logo co-logo--letter">{logoLetter}</div>
          )}

          <div className="jcard-info">
            <div className="jcard-title">{job.title}</div>
            <div className="jcard-co">
              {job.company}
              {job.location && ` • ${job.location}`}
              {job.type && ` • ${job.type}`}
            </div>
            <div className="jcard-tags">
              {(job.tags ?? []).map((tag, idx) => (
                <span key={idx} className="jtag">{tag}</span>
              ))}
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
              <button className="btn btn-rust btn-md" onClick={handleApply}>
                ⚡ Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default JobCard;