import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import './JobDetailScreen.css'
import Badge from '../../common/Badge/Badge'
import { getToken } from '../../../utils/auth'
import { API } from '../../../config/api'


function JobDetailScreen({ jobId, onBack, token: tokenProp, onCompanyClick }) {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const id = jobId ?? params.id
  const token = getToken()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const [matchInfo, setMatchInfo] = useState(null)
  const [matchDetail, setMatchDetail] = useState(null)
  const [checkingMatch, setCheckingMatch] = useState(false)
  const [matchError, setMatchError] = useState(null)

  const handleBack = () => {
    const fromPath = location.state?.fromPath
    if (fromPath === '/ai-assistant') { navigate('/ai-assistant'); return }
    if (fromPath) { navigate(fromPath, { state: { scrollY: location.state?.scrollY || 0 } }); return }
    navigate(-1)
  }

  // Sửa từ dòng 48-57
  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`${API}/jobs/${id}`)
      .then(r => r.json())
      .then(setJob)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!token || !id) return
    fetch(`${API}/jobs/saved`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.data ?? [])
        const ids = new Set(list.map(s => s.job?.jobID ?? s.jobID))
        setSaved(ids.has(Number(id)))
      })
      .catch(err => console.error('Fetch saved error:', err))
  }, [token, id])

  useEffect(() => {
    if (!token || !id) return
    fetch(`${API}/jobs/${id}/match`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setMatchInfo(data))
      .catch(console.error)
  }, [token, id])

  const handleCheckDetail = async () => {
    if (!token) { setShowLoginModal(true); return }
    setCheckingMatch(true)
    setMatchError(null)
    try {
      const res = await fetch(`${API}/jobs/${id}/match/check`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 402 || res.status === 400) {
        const err = await res.json()
        setMatchError(err.message || 'Đã hết lượt kiểm tra.')
        return
      }
      const data = await res.json()
      setMatchDetail(data)
    } catch (err) {
      setMatchError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setCheckingMatch(false)
    }
  }

  const handleSave = async () => {
    if (!token) { setShowLoginModal(true); return }
    try {
      await fetch(`${API}/jobs/${id}/save`, {
        method: saved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      setSaved(!saved)
    } catch (err) { console.error(err) }
  }

  const handleApply = () => {
    if (!token) { setShowLoginModal(true); return }
    setApplyModalOpen(true)
  }

  const formatDeadline = (deadline) => {
    if (!deadline) return 'Chưa cập nhật'
    const date = new Date(deadline)
    const days = Math.ceil((date.getTime() - Date.now()) / 86400000)
    const formatted = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    if (days < 0) return `Đã hết hạn (${formatted})`
    if (days === 0) return `Hết hạn hôm nay (${formatted})`
    return `${formatted} (còn ${days} ngày)`
  }

  const formatPostedAt = (postedAt) => {
    if (!postedAt) return ''
    const diff = Date.now() - new Date(postedAt).getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (h < 1) return 'Vừa đăng'
    if (h < 24) return `Đăng ${h} giờ trước`
    return `Đăng ${d} ngày trước`
  }

  const openCompany = () => {
    if (!job?.company?.companyID) return
    if (onCompanyClick) onCompanyClick(job.company.companyID)
    else navigate(`/jobs/companies/${job.company.companyID}`)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#9A8D80', fontSize: 15 }}>
        ⟳ Đang tải thông tin việc làm...
      </div>
    )
  }

  if (!job) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#9A8D80', fontSize: 15 }}>
        Không tìm thấy việc làm này.
      </div>
    )
  }

  const isExpired = job?.deadline && (new Date(job.deadline).getTime() < Date.now())
  const logoLetter = job.company?.companyName?.[0]?.toUpperCase() ?? '?'

  return (
    <div id="s4">
      {onBack && (
        <div style={{ background: 'var(--surf)', borderBottom: '1px solid var(--border)', padding: '0 28px' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', height: 44,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#9A8D80',
          }}>
            <button onClick={handleBack} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--rust)', fontSize: 13, fontWeight: 700, padding: 0,
            }}>← Quay lại</button>
            <span style={{ color: '#DDD6C6' }}>›</span>
            <span style={{ color: '#1C1510', fontWeight: 600 }}>{job?.title ?? '...'}</span>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          backdropFilter: 'blur(4px)', zIndex: 4000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowLoginModal(false)}>
          <div style={{
            background: 'var(--surf)', borderRadius: '16px', padding: '32px 28px 24px',
            width: '360px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,.2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '36px' }}>🔐</div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Bạn chưa đăng nhập</div>
            <div style={{ fontSize: '14px', color: 'var(--ink3)', textAlign: 'center', lineHeight: 1.5 }}>
              Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', width: '100%' }}>
              <button style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 700,
                fontSize: '13px', cursor: 'pointer', border: '1.5px solid var(--border2)',
                background: 'transparent', color: 'var(--ink3)',
              }} onClick={() => setShowLoginModal(false)}>Để sau</button>
              <button style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontWeight: 700,
                fontSize: '13px', cursor: 'pointer', border: 'none',
                background: 'rgb(35,42,162)', color: '#fff',
              }} onClick={() => { navigate('/login'); window.scrollTo({ top: 0, behavior: 'instant' }) }}>
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {applyModalOpen && (
        <div style={{
          display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
          zIndex: 3000, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)',
        }} onClick={() => setApplyModalOpen(false)}>
          <div style={{
            background: 'var(--surf)', borderRadius: '16px', padding: '32px',
            maxWidth: '480px', width: '90%', boxShadow: '0 24px 80px rgba(0,0,0,.3)',
            position: 'relative',
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setApplyModalOpen(false)} style={{
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
              Hoặc <span style={{ color: 'var(--rust)', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setApplyModalOpen(false)}>quay lại xem việc khác</span>
            </div>
          </div>
        </div>
      )}

      <div className="app-layout">
        <div className="main-content">
          <div className="jd-wrap">

            <div className="jd-main" style={{ position: 'relative', opacity: isExpired ? 0.6 : 1 }}>
              {isExpired && <div className="jd-card-ribbon">Đã hết hạn</div>}

              <div className="jd-head">
                <div style={{
                  width: 64, height: 64, borderRadius: 14, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: job.company?.companyLogo ? 'transparent' : 'linear-gradient(135deg,#1565C0,#1E88E5)',
                  fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12,
                  border: job.company?.companyLogo ? '1px solid var(--border)' : 'none',
                  overflow: 'hidden',
                }}>
                  {job.company?.companyLogo
                    ? <img src={job.company.companyLogo} alt={job.company.companyName}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : logoLetter}
                </div>

                <h1 className="jd-title">{job.title}</h1>

                <div className="jd-co">
                  <span onClick={openCompany}
                    style={{ cursor: 'pointer', textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}>
                    {job.company?.companyName}
                  </span>
                  {job.company?.companySize && <Badge variant="indigo">👥 {job.company.companySize}</Badge>}
                  {job.sourcePlatform && <Badge variant="teal">{job.sourcePlatform}</Badge>}
                </div>

                <div className="jd-meta-row">
                  {job.location && <span className="jd-meta-pill">📍 {job.location}</span>}
                  {job.jobType && <span className="jd-meta-pill">⏰ {job.jobType}</span>}
                  {job.workingTime && <span className="jd-meta-pill">🕐 {job.workingTime}</span>}
                  {job.experienceYear && <span className="jd-meta-pill">🎯 {job.experienceYear}</span>}
                  {job.deadline && <span className="jd-meta-pill">📅 {formatDeadline(job.deadline)}</span>}
                  {job.postedAt && <span className="jd-meta-pill">🕒 {formatPostedAt(job.postedAt)}</span>}
                </div>

                <div className="jd-actions">
                  <button className="btn btn-rust btn-lg" onClick={handleApply} disabled={isExpired}
                    style={{ opacity: isExpired ? 0.5 : 1, cursor: isExpired ? 'not-allowed' : 'pointer' }}>
                    ⚡ Apply ngay
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={handleSave} disabled={isExpired}>
                    {saved ? '🔖 Đã lưu' : '🔖 Lưu'}
                  </button>
                </div>
              </div>
              {token && (matchInfo || !matchInfo) && (
                <div className="ai-box">
                  <div className="ai-box-header">
                    <div className="ai-box-title">🤖 Phân tích AI — Mức độ phù hợp</div>
                  </div>

                  {matchInfo && (
                    <div className="ai-box-content" style={{ marginBottom: matchDetail ? 16 : 0 }}>
                      <div className="ai-ring" style={{
                        background: `conic-gradient(var(--sage) 0% ${matchInfo.matchPercent}%, var(--bg3) ${matchInfo.matchPercent}%)`
                      }}>
                        <div className="ai-ring-in">
                          <div className="ai-ring-n">{Math.round(matchInfo.matchPercent)}%</div>
                          <div className="ai-ring-s">Match</div>
                        </div>
                      </div>
                      {matchInfo.reason && (
                        <div className="ai-reason">
                          <span className="ai-reason-icon">💡</span>
                          <span>{matchInfo.reason}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {!matchInfo && (
                    <div style={{ fontSize: 13, color: 'var(--ink3)', marginBottom: 12 }}>
                      Chưa có dữ liệu phù hợp.
                    </div>
                  )}

                  {matchDetail && (
                    <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>

                      {(matchDetail.skillOverlap?.length > 0 || matchDetail.skillGap?.length > 0) && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)', marginBottom: 8 }}>🛠 Kỹ năng</div>
                          {matchDetail.skillOverlap?.length > 0 && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#2E6040', marginBottom: 5 }}>
                                ✅ Phù hợp ({matchDetail.skillOverlap.length})
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {matchDetail.skillOverlap.map(s => (
                                  <span key={s} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, background: '#E0F0E6', color: '#2E6040', fontWeight: 600 }}>{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {matchDetail.skillGap?.length > 0 && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#C0412A', marginBottom: 5 }}>
                                📚 Cần bổ sung ({matchDetail.skillGap.length})
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {matchDetail.skillGap.map(s => (
                                  <span key={s} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, background: '#FDE8E4', color: '#C0412A', fontWeight: 600 }}>{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {matchDetail.industryName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: matchDetail.industryMatch ? '#E0F0E6' : 'var(--bg3)', border: `1px solid ${matchDetail.industryMatch ? 'rgba(46,96,64,.2)' : 'var(--border)'}` }}>
                          <span style={{ fontSize: 18 }}>{matchDetail.industryMatch ? '✅' : '⚠️'}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: matchDetail.industryMatch ? '#2E6040' : 'var(--ink2)' }}>
                              Ngành nghề: {matchDetail.industryName}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--ink3)' }}>
                              {matchDetail.industryMatch ? 'Đúng ngành bạn đang theo đuổi' : 'Khác ngành trong hồ sơ của bạn'}
                            </div>
                          </div>
                        </div>
                      )}

                      {matchDetail.jobExp && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: matchDetail.expMatch ? '#E0F0E6' : 'var(--bg3)', border: `1px solid ${matchDetail.expMatch ? 'rgba(46,96,64,.2)' : 'var(--border)'}` }}>
                          <span style={{ fontSize: 18 }}>{matchDetail.expMatch ? '✅' : '📋'}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: matchDetail.expMatch ? '#2E6040' : 'var(--ink2)' }}>
                              Kinh nghiệm yêu cầu: {matchDetail.jobExp}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--ink3)' }}>
                              {matchDetail.userExp ? `Hồ sơ của bạn: ${matchDetail.userExp}` : 'Chưa cập nhật kinh nghiệm trong hồ sơ'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Salary */}
                      {matchDetail.salaryStatus !== 'unknown' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: matchDetail.salaryStatus === 'match' ? '#E0F0E6' : '#FFF8E1', border: `1px solid ${matchDetail.salaryStatus === 'match' ? 'rgba(46,96,64,.2)' : 'rgba(212,130,10,.3)'}` }}>
                          <span style={{ fontSize: 18 }}>{matchDetail.salaryStatus === 'match' ? '💰' : '⚠️'}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: matchDetail.salaryStatus === 'match' ? '#2E6040' : '#8a6000' }}>
                              Lương: {matchDetail.jobSalary ?? 'Thỏa thuận'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--ink3)' }}>
                              {matchDetail.salaryStatus === 'match'
                                ? `Phù hợp kỳ vọng của bạn (${matchDetail.expectedSalary})`
                                : `Thấp hơn kỳ vọng của bạn (${matchDetail.expectedSalary})`}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {!matchDetail && (
                    <div style={{ marginTop: 12 }}>
                      {matchError ? (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{
                            fontSize: 12, color: '#C0412A', background: '#FDE8E4',
                            padding: '8px 12px', borderRadius: 8, marginBottom: 8,
                          }}>
                            ⚠️ {matchError}
                          </div>
                          <button onClick={() => navigate('/services')} style={{
                            width: '100%', padding: '8px', borderRadius: 8,
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                            background: 'linear-gradient(135deg,#C0412A,#E05A40)', color: '#fff',
                          }}>
                            ⚡ Nâng cấp gói →
                          </button>
                        </div>
                      ) : (
                        <button onClick={handleCheckDetail} disabled={checkingMatch} style={{
                          width: '100%', padding: '8px', borderRadius: 8,
                          fontSize: 12, fontWeight: 700, border: 'none', cursor: checkingMatch ? 'not-allowed' : 'pointer',
                          background: checkingMatch ? '#EDE8DF' : 'linear-gradient(135deg,#232AA2,#1565C0)',
                          color: checkingMatch ? '#9A8D80' : '#fff',
                        }}>
                          {checkingMatch ? '⟳ Đang phân tích...' : '🔍 Xem chi tiết độ phù hợp'}
                        </button>
                      )}
                    </div>
                  )}

                  <button onClick={() => navigate('/ai-assistant')} style={{
                    marginTop: 8, width: '100%', padding: '8px', borderRadius: 8,
                    fontSize: 12, fontWeight: 700, border: '1.5px solid var(--border2)',
                    background: 'transparent', color: 'var(--ink2)', cursor: 'pointer',
                  }}>
                    🤖 Tư vấn chi tiết với AI →
                  </button>
                </div>
              )}

              <div className="divider" />

              {job.description && (
                <>
                  <div className="jd-sec-title">Mô tả công việc</div>
                  <div style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: 24 }}>
                    {job.description}
                  </div>
                  <div className="divider" />
                </>
              )}

              {job.requirement && (
                <>
                  <div className="jd-sec-title">Yêu cầu ứng viên</div>
                  <div style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: 24 }}>
                    {job.requirement}
                  </div>
                  <div className="divider" />
                </>
              )}

              {job.benefit && (
                <>
                  <div className="jd-sec-title">Quyền lợi</div>
                  <div style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: 24 }}>
                    {job.benefit}
                  </div>
                  <div className="divider" />
                </>
              )}

              {job.skills?.length > 0 && (
                <>
                  <div className="jd-sec-title">Kỹ năng yêu cầu</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {job.skills.map(skill => (
                      <span key={skill} style={{
                        padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--ink3)',
                      }}>{skill}</span>
                    ))}
                  </div>
                  <div className="divider" />
                </>
              )}

              {job.other && (
                <>
                  <div className="jd-sec-title">Thông tin khác</div>
                  <div style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: 24 }}>
                    {job.other}
                  </div>
                </>
              )}
            </div>

            <div className="jd-side">
              <div className="apply-box">
                <div className="apply-salary">💰 {job.salary ?? 'Thỏa thuận'}</div>
                {job.deadline && (
                  <div className="apply-dl">⏰ Hạn nộp: {formatDeadline(job.deadline)}</div>
                )}
                <button className="btn btn-rust w100 btn-lg" onClick={handleApply} disabled={isExpired}
                  style={{ opacity: isExpired ? 0.5 : 1, cursor: isExpired ? 'not-allowed' : 'pointer' }}>
                  ⚡ Apply ngay
                </button>
                <button className="btn btn-outline w100 btn-lg" style={{ marginTop: 8 }}
                  onClick={handleSave} disabled={isExpired}>
                  {saved ? '🔖 Đã lưu' : '🔖 Lưu việc làm'}
                </button>
              </div>

              <div className="card company-card">
                <div className="company-title">Về công ty</div>
                {job.company?.companyLogo && (
                  <img src={job.company.companyLogo} alt={job.company.companyName}
                    style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 10, marginBottom: 10 }} />
                )}
                <div className="company-name" onClick={openCompany}>
                  {job.company?.companyName}
                </div>
                {job.company?.companyProfile && (
                  <div className="company-desc">
                    {job.company.companyProfile.slice(0, 200)}
                    {job.company.companyProfile.length > 200 ? '...' : ''}
                  </div>
                )}
                <div className="company-badges" style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {job.company?.companySize && <Badge variant="teal">👥 {job.company.companySize}</Badge>}
                  {job.company?.address && <Badge variant="gray">📍 {job.company.address}</Badge>}
                  {job.company?.companyWebsite && (
                    <a href={job.company.companyWebsite} target="_blank" rel="noreferrer">
                      <Badge variant="indigo">🌐 Website</Badge>
                    </a>
                  )}
                </div>
                <button className="btn btn-outline btn-md"
                  style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                  onClick={openCompany}>
                  Xem tất cả việc làm →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailScreen