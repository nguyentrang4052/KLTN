import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import Badge from '../../common/Badge/Badge'
import { getToken } from '../../../utils/auth'

const API = 'http://localhost:3000/api'


const AI_INSIGHTS = [
  { icon: '👁', text: 'Bạn thường xem kỹ JD có "React", "TypeScript" và lương >25tr', source: 'Từ 47 lần xem' },
  { icon: '🔖', text: '80% tin bạn lưu là Hybrid hoặc Remote', source: 'Từ 23 lần lưu' },
  { icon: '⚡', text: 'Bạn apply trong 24h đầu khi lương >30tr', source: 'Từ 14 lần apply' },
  { icon: '🏢', text: 'Ưu tiên Fintech và E-commerce hơn 60%', source: 'Phân tích toàn lịch sử' },
]
const AI_PREFERENCES = [
  { key: 'Ngành ưu tiên', value: 'Fintech, E-commerce, SaaS' },
  { key: 'Quy mô công ty', value: '100 – 1,000 người' },
  { key: 'Ngôn ngữ làm việc', value: 'Việt / English' },
]
const AI_TOGGLES = [
  { key: 'Thông báo việc mới', active: true },
  { key: 'Auto apply khi match >90%', active: false },
]
const CONNECTED_ACCOUNTS = [
  { name: 'TopCV', code: 'T', color: '#00B14F', connected: true },
  { name: 'CareerLink', code: 'C', color: '#D0392A', connected: true },
  { name: 'CareerViet', code: 'CV', color: 'var(--bg3)', connected: false },
]

// ─── Import CV Modal ──────────────────────────────────────────────────────────
// Nhận cvList trực tiếp từ App state qua props — không đọc localStorage
function ImportCVModal({ onClose, onImport, authHeaders}) {
  const [analyzedCVs, setAnalyzedCVs] = useState([])
  const [localCVs, setLocalCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null)
  const [importing, setImporting] = useState(false)
  const [tab, setTab] = useState('local')
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingAnalyzed, setLoadingAnalyzed] = useState(false)

  useEffect(() => {
    setLoadingLocal(true);
    fetch(`${API}/cv-builder/list`, { headers: authHeaders })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setLocalCVs(data.map(cv => ({ ...cv, type: 'local' })));
      })
      .catch(() => {})
      .finally(() => setLoadingLocal(false));
  }, []);

  useEffect(() => {
    setLoadingAnalyzed(true)
    fetch(`${API}/cv-analyzer/history`, { headers: authHeaders })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(res => setAnalyzedCVs(res.data || []))
      .catch(() => { })
      .finally(() => setLoadingAnalyzed(false))
  }, [])

  const handleImport = async () => {
    if (!selectedCV) return
    setImporting(true)
    try {
      await onImport(selectedCV)
      onClose()
    } finally {
      setImporting(false)
    }
  }

  const currentList = tab === 'local' ? localCVs : analyzedCVs;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface, #fff)', borderRadius: 14,
        width: '100%', maxWidth: 1000, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '18px 22px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Roboto', serif" }}>
              📋 Nhập thông tin từ CV
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>
              Chọn CV để tự động điền thông tin vào hồ sơ
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg2)', cursor: 'pointer', fontSize: 16, color: 'var(--ink3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg)', padding: '0 22px' }}>
          {[
            { id: 'local', label: '✏️ CV đã tạo', count: localCVs.length },
            { id: 'analyzed', label: '📤 CV đã tải lên', count: analyzedCVs.length },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSelectedCV(null) }}
              style={{
                padding: '10px 16px', border: 'none', background: 'transparent',
                borderBottom: tab === t.id ? '2px solid rgb(35, 42, 162)' : '2px solid transparent',
                fontWeight: tab === t.id ? 700 : 400, fontSize: 13,
                color: tab === t.id ? 'rgb(35, 42, 162)' : 'var(--ink3)',
                cursor: 'pointer', marginBottom: -1,
              }}>
              {t.label}
              <span style={{
                marginLeft: 6, fontSize: 11, background: 'var(--bg2)',
                padding: '1px 6px', borderRadius: 10, color: 'var(--ink4)',
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* CV List */}
          <div style={{
            width: 'fit-content', borderRight: '1px solid var(--border)',
            overflowY: 'auto', padding: 12, flexShrink: 0,
          }}>
            {tab === 'analyzed' && loadingAnalyzed ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink4)', fontSize: 13 }}>
                ⟳ Đang tải...
              </div>
            ) : currentList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--ink4)', fontSize: 13 }}>
                {tab === 'local' ? 'Chưa có CV nào được tạo' : 'Chưa có CV nào được tải lên'}
              </div>
            ) : currentList.map(cv => {
              const isSelected = selectedCV?.cv?.id === cv.id
              const displayName = tab === 'analyzed'
                ? (cv.fullName && cv.fullName !== '' ? cv.fullName : cv.filename || 'CV không tên')
                : (cv.name || cv.cvName || 'Không tên')
              const displaySub = tab === 'local' ? (cv.templateId || 'Custom') : (cv.filename || 'Đã phân tích')
              const displayDate = cv.updatedAt || cv.createdAt
              const iconBg = tab === 'analyzed' ? '#10b981' : (cv.accent || '#6366f1')
              return (
                <div key={cv.id}
                  onClick={() => setSelectedCV({ type: tab === 'local' ? 'local' : 'analyzed', cv })}
                  style={{
                    padding: '10px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 6,
                    border: '1px solid',
                    borderColor: isSelected ? 'rgb(35, 42, 162)' : 'var(--border)',
                    background: isSelected ? 'rgba(35,42,162,0.05)' : 'var(--bg)',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 16, color: '#fff',
                    }}>
                      {displayName[0]?.toUpperCase() || 'C'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {displayName}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>
                        {displaySub}
                        {displayDate && ` · ${new Date(displayDate).toLocaleDateString('vi-VN')}`}
                      </div>
                    </div>
                    {isSelected && <span style={{ color: 'rgb(35,42,162)', fontSize: 16, flexShrink: 0 }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Preview Panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {!selectedCV ? (
              <div style={{
                height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink4)', fontSize: 14, gap: 10,
              }}>
                <div style={{ fontSize: 40 }}>👈</div>
                <div>Chọn một CV để xem nội dung</div>
              </div>
            ) : selectedCV.type === 'local' ? (
              <LocalCVPreview cv={selectedCV.cv} />
            ) : (
              <AnalyzedCVPreview cv={selectedCV.cv} authHeaders={authHeaders} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--ink4)' }}>
            {selectedCV ? `Đã chọn: ${selectedCV.cv.name || selectedCV.cv.cvName || selectedCV.cv.filename || 'Không tên'}` : 'Chưa chọn CV nào'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              padding: '8px 18px', border: '1px solid var(--border)',
              borderRadius: 7, background: 'transparent',
              cursor: 'pointer', fontSize: 13, color: 'var(--ink2)',
            }}>Hủy</button>
            <button onClick={handleImport} disabled={!selectedCV || importing} style={{
              padding: '8px 20px', border: 'none', borderRadius: 7,
              background: selectedCV ? 'rgb(35, 42, 162)' : 'var(--border)',
              color: selectedCV ? '#fff' : 'var(--ink4)',
              cursor: selectedCV && !importing ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 600, transition: 'background 0.15s',
            }}>
              {importing ? '⏳ Đang nhập...' : '✓ Nhập thông tin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Preview CV đã phân tích (từ server) ─────────────────────────────────────
function AnalyzedCVPreview({ cv, authHeaders }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dùng result từ list item nếu có (khi history trả về result đầy đủ)
    // Fallback: fetch detail riêng
    if (cv.result) {
      setDetail(cv.result)
      setLoading(false)
      return
    }
    // Thử fetch detail endpoint
    fetch(`${API}/cv-analyzer/detail/${cv.id}`, { headers: authHeaders })
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (res?.data?.result) {
          setDetail(res.data.result)
        } else {
          // Nếu không có detail endpoint, tạo fallback từ field có sẵn
          setDetail({
            personalInfo: { fullName: cv.fullName || cv.filename || '' },
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setDetail({ personalInfo: { fullName: cv.fullName || cv.filename || '' } })
        setLoading(false)
      })
  }, [cv.id])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink4)' }}>⟳ Đang tải...</div>
  }

  if (!detail) {
    return (
      <div style={{
        padding: '16px 14px', background: 'rgba(239,68,68,0.07)',
        borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)',
        fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#dc2626' }}>⚠️ Không tìm thấy dữ liệu</div>
        Không thể tải chi tiết CV này từ server.
      </div>
    )
  }

  const info = detail.personalInfo || {}
  const experiences = detail.experiences || []
  const education = detail.education || []
  const skills = detail.skills || []
  const summary = detail.summary || ''

  return (
    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ marginBottom: 14, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
          {info.fullName || cv.filename || '—'}
        </div>
        {info.email && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>✉ {info.email}</div>}
        {info.phone && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>📞 {info.phone}</div>}
        {info.address && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>📍 {info.address}</div>}
      </div>
      {summary && (
        <PreviewSection label="Tóm tắt">
          <p style={{ margin: 0, color: 'var(--ink2)', fontSize: 12 }} dangerouslySetInnerHTML={{ __html: summary }} />
        </PreviewSection>
      )}
      {experiences.length > 0 && (
        <PreviewSection label="Kinh nghiệm">
          {experiences.map((e, i) => (
            <div key={i} style={{ marginBottom: 8, paddingLeft: 8 }}>
              <span style={{ fontWeight: 600 }}>{e.position}</span>
              {e.company && <span style={{ color: 'var(--ink3)' }}> · {e.company}</span>}
              {e.duration && <span style={{ color: 'var(--ink4)', fontSize: 11 }}> ({e.duration})</span>}
              {e.description && <div style={{ color: 'var(--ink3)', fontSize: 11, marginTop: 2 }} dangerouslySetInnerHTML={{ __html: e.description }} />}
            </div>
          ))}
        </PreviewSection>
      )}
      {education.length > 0 && (
        <PreviewSection label="Học vấn">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
              <span style={{ fontWeight: 600 }}>{e.degree || e.school}</span>
              {e.institution && <span style={{ color: 'var(--ink3)' }}> · {e.institution}</span>}
              {e.year && <span style={{ color: 'var(--ink4)', fontSize: 11 }}> ({e.year})</span>}
            </div>
          ))}
        </PreviewSection>
      )}
      {skills.length > 0 && (
        <PreviewSection label="Kỹ năng">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {skills.map((s, i) => {
              const label = typeof s === 'string' ? s : (s.category || s.name || JSON.stringify(s))
              return label ? (
                <span key={i} style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: 11,
                  background: 'var(--bg3)', color: 'var(--ink2)', fontWeight: 500,
                }}>{label}</span>
              ) : null
            })}
          </div>
        </PreviewSection>
      )}
    </div>
  )
}

// ─── Preview CV tự tạo (dùng dữ liệu từ API) ────────────────────────────────
function LocalCVPreview({ cv }) {
  // Dữ liệu CV được lưu trong cv.data.cvData (backend trả về)
  const cvData = cv.data?.cvData || {};
  const info = cvData.personalInfo || {};
  const experiences = cvData.experiences || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const certifications = cvData.certifications || [];
  const summary = cvData.summary || '';
  const hasData = info.fullName || experiences.length > 0 || skills.length > 0;

  if (!hasData) {
    return (
      <div style={{
        padding: '16px 14px', background: 'rgba(245,158,11,0.07)',
        borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)',
        fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#b45309' }}>
          ⚠️ CV chưa có dữ liệu chi tiết
        </div>
        CV này chưa được điền nội dung trong Editor. Hệ thống sẽ chỉ dùng tên CV khi nhập.
      </div>
    );
  }

  return (
    <div style={{ fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ marginBottom: 14, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
          {info.fullName || cv.name || '—'}
        </div>
        {info.email && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>✉ {info.email}</div>}
        {info.phone && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>📞 {info.phone}</div>}
        {info.address && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>📍 {info.address}</div>}
        {info.linkedin && <div style={{ color: 'var(--ink3)', fontSize: 12 }}>🔗 {info.linkedin}</div>}
      </div>

      {summary && (
        <PreviewSection label="Mục tiêu">
          <p style={{ margin: 0, color: 'var(--ink2)', fontSize: 12 }} dangerouslySetInnerHTML={{ __html: summary }} />
        </PreviewSection>
      )}

      {experiences.length > 0 && (
        <PreviewSection label="Kinh nghiệm">
          {experiences.map((e, i) => (
            <div key={i} style={{ marginBottom: 8, paddingLeft: 8 }}>
              <span style={{ fontWeight: 600 }}>{e.position}</span>
              {e.company && <span style={{ color: 'var(--ink3)' }}> · {e.company}</span>}
              {e.duration && <span style={{ color: 'var(--ink4)', fontSize: 11 }}> ({e.duration})</span>}
              {e.description && (
                <div style={{ color: 'var(--ink3)', fontSize: 11, marginTop: 2 }} dangerouslySetInnerHTML={{ __html: e.description }} />
              )}
            </div>
          ))}
        </PreviewSection>
      )}

      {education.length > 0 && (
        <PreviewSection label="Học vấn">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
              <span style={{ fontWeight: 600 }}>{e.degree || e.school}</span>
              {e.institution && <span style={{ color: 'var(--ink3)' }}> · {e.institution}</span>}
              {e.year && <span style={{ color: 'var(--ink4)', fontSize: 11 }}> ({e.year})</span>}
            </div>
          ))}
        </PreviewSection>
      )}

      {skills.length > 0 && (
        <PreviewSection label="Kỹ năng">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {skills.map((s, i) => {
              const label = typeof s === 'string' ? s : (s.category || s.name || '');
              return label ? (
                <span key={i} style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: 11,
                  background: 'var(--bg3)', color: 'var(--ink2)', fontWeight: 500,
                }}>{label}</span>
              ) : null;
            })}
          </div>
        </PreviewSection>
      )}

      {certifications.length > 0 && (
        <PreviewSection label="Chứng chỉ">
          {certifications.map((c, i) => (
            <div key={i} style={{ paddingLeft: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              {c.issuer && <span style={{ color: 'var(--ink3)' }}> · {c.issuer}</span>}
              {c.year && <span style={{ color: 'var(--ink4)', fontSize: 11 }}> ({c.year})</span>}
            </div>
          ))}
        </PreviewSection>
      )}
    </div>
  );
}

function PreviewSection({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5,
        color: 'var(--ink4)', marginBottom: 6,
        borderBottom: '1px solid var(--border)', paddingBottom: 4,
      }}>{label}</div>
      {children}
    </div>
  )
}

function ProfileScreen({ onNavigate, cvList: cvListProp = [] }) {
  const [cvList, setCvList] = useState(() => {
    try {
      const key = profile?.userID ? `cv_builder_state_${profile.userID}` : 'cv_builder_state'
      const raw = localStorage.getItem(key)
      const state = raw ? JSON.parse(raw) : {}
      const list = state._cvList
      return Array.isArray(list) && list.length > 0 ? list : cvListProp
    } catch { return cvListProp }
  })
  useEffect(() => {
    const sync = () => {
      try {
        const key = profile?.userID ? `cv_builder_state_${profile.userID}` : 'cv_builder_state'
        const raw = localStorage.getItem(key)
        const state = raw ? JSON.parse(raw) : {}
        if (Array.isArray(state._cvList)) setCvList(state._cvList)
      } catch { }
    }
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('focus', sync) }
  }, [])
  const navigate = useNavigate()
  const token = getToken()
  const authRef = useRef({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [allSkills, setAllSkills] = useState([])
  const [industries, setIndustries] = useState([])
  const [skillSearch, setSkillSearch] = useState('')
  const [showSkillDropdown, setShowSkillDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // ── Import CV modal state ──
  const [showImportModal, setShowImportModal] = useState(false)
  const [importMsg, setImportMsg] = useState('')

  const [personalForm, setPersonalForm] = useState({
    fullName: '', birthYear: '', phone: '', gender: 'Nam', address: '',
  })
  const [careerForm, setCareerForm] = useState({
    jobTitle: '', experienceYear: '', careerLevel: '',
    expectedSalary: '', workingType: '', industryId: '',
  })

  const fetchProfile = useCallback(async (syncForm = true) => {
    if (!token) { setLoading(false); return }
    if (syncForm) setLoading(true)
    try {
      const res = await fetch(`${API}/profile/me`, { headers: authRef.current })
      if (!res.ok) throw new Error('Unauthorized')
      const data = await res.json()
      setProfile(data)
      if (syncForm) {
        setPersonalForm({
          fullName: data.fullName ?? '',
          birthYear: data.birthYear ?? '',
          phone: data.phone ?? '',
          gender: data.gender ?? 'Nam',
          address: data.address ?? '',
        })
        setCareerForm({
          jobTitle: data.jobTitle ?? '',
          experienceYear: data.experienceYear ?? '',
          careerLevel: data.careerLevel ?? '',
          expectedSalary: data.expectedSalary ?? '',
          workingType: data.workingType ?? '',
          industryId: data.industry?.id ?? '',
        })
      }
    } catch (err) {
      console.error('fetchProfile:', err)
    } finally {
      if (syncForm) setLoading(false)
    }
  }, [token])

  const fetchStats = useCallback(async (userID) => {
    try {
      const res = await fetch(`${API}/profile/${userID}/stats`, { headers: authRef.current })
      setStats(await res.json())
    } catch (err) { console.error('fetchStats:', err) }
  }, [])

  const fetchAllSkills = useCallback(async () => {
    try {
      const res = await fetch(`${API}/profile/skills/all`)
      const data = await res.json()
      setAllSkills(Array.isArray(data) ? data : [])
    } catch (err) { console.error('fetchAllSkills:', err) }
  }, [])

  const fetchIndustries = useCallback(async () => {
    try {
      const res = await fetch(`${API}/industries`)
      const data = await res.json()
      setIndustries(Array.isArray(data) ? data : [])
    } catch (err) { console.error('fetchIndustries:', err) }
  }, [])

  useEffect(() => {
    fetchProfile(true)
    fetchAllSkills()
    fetchIndustries()
  }, [])

  useEffect(() => {
    if (profile?.userID) fetchStats(profile.userID)
  }, [profile?.userID])

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file || !profile?.userID) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`${API}/profile/${profile.userID}/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error()

      const updatedRes = await fetch(`${API}/profile/me`, { headers: authRef.current })
      const updatedData = await updatedRes.json()

      setProfile(updatedData)
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedData }))

    } catch { alert('Upload ảnh thất bại') }
  }


  const handleRemoveAvatar = async () => {
    if (!profile?.userID) return
    try {
      const res = await fetch(`${API}/profile/${profile.userID}/avatar`, {
        method: 'DELETE',
        headers: authRef.current,
      })
      if (!res.ok) throw new Error()

      const updatedRes = await fetch(`${API}/profile/me`, { headers: authRef.current })
      const updatedData = await updatedRes.json()

      setProfile(updatedData)
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedData }))

    } catch { alert('Xóa ảnh thất bại') }
  }

  const handleSave = async () => {
    if (!profile?.userID) return
    setSaving(true); setSaveMsg('')
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API}/profile/${profile.userID}`, {
          method: 'PUT',
          headers: authRef.current,
          body: JSON.stringify({
            fullName: personalForm.fullName || null,
            birthYear: personalForm.birthYear ? Number(personalForm.birthYear) : null,
            phone: personalForm.phone || null,
            gender: personalForm.gender || null,
            address: personalForm.address || null,
          }),
        }),
        fetch(`${API}/profile/${profile.userID}/user-profile`, {
          method: 'PUT',
          headers: authRef.current,
          body: JSON.stringify({
            jobTitle: careerForm.jobTitle || null,
            experienceYear: careerForm.experienceYear || null,
            careerLevel: careerForm.careerLevel || null,
            expectedSalary: careerForm.expectedSalary || null,
            workingType: careerForm.workingType || null,
            industryId: careerForm.industryId ? Number(careerForm.industryId) : null,
          }),
        }),
      ])
      if (!r1.ok || !r2.ok) throw new Error('Save failed')
      setSaveMsg('✓ Đã lưu thành công')
      const updatedRes = await fetch(`${API}/profile/me`, { headers: authRef.current })
      const updatedData = await updatedRes.json()
      setProfile(updatedData)
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: updatedData }))
    } catch {
      setSaveMsg('✗ Lưu thất bại')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  const handleAddSkill = async (skill) => {
    if (!profile?.userID) return
    try {
      await fetch(`${API}/profile/${profile.userID}/skills/${skill.skillID}`, {
        method: 'POST', headers: authRef.current,
      })
      setSkillSearch(''); setShowSkillDropdown(false)
      fetchProfile(false)
    } catch (err) { console.error(err) }
  }

  const handleRemoveSkill = async (skillID) => {
    if (!profile?.userID) return
    try {
      await fetch(`${API}/profile/${profile.userID}/skills/${skillID}`, {
        method: 'DELETE', headers: authRef.current,
      })
      fetchProfile(false)
    } catch (err) { console.error(err) }
  }

  const filteredSkills = allSkills.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(skillSearch.toLowerCase())
    const matchIndustry = careerForm.industryId
      ? industries.find(ind => String(ind.id) === String(careerForm.industryId))?.name?.toLowerCase() === s.industry?.toLowerCase()
      : true
    const notAdded = !(profile?.skills ?? []).some(us => us.id === s.skillID)
    return matchSearch && matchIndustry && notAdded
  })

  const avatarLetters = profile?.fullName
    ? profile.fullName.trim().split(' ').slice(-1)[0].charAt(0).toUpperCase()
    : '??'

  if (!token) {
    return (
      <div id="s8">
        <div className="app-layout">
          <Sidebar activeItem="profile" onNavigate={onNavigate} />
          <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--ink3)', fontSize: 14 }}>
              Vui lòng{' '}
              <span style={{ color: 'var(--rust)', cursor: 'pointer', fontWeight: 700 }}
                onClick={() => navigate('/login')}>đăng nhập</span>{' '}
              để xem hồ sơ.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Handle import from CV ──────────────────────────────────────────────────
  const handleImportFromCV = async ({ type, cv }) => {
    if (!profile?.userID) return

    try {
      if (type === 'analyzed') {
        const res = await fetch(`${API}/cv-analyzer/map-to-profile/${cv.id}`, {
          method: 'POST',
          headers: authRef.current,
        })
        if (!res.ok) throw new Error('Map failed')
        const result = await res.json()
        const d = result.data || {}
        setPersonalForm(prev => ({
          ...prev,
          fullName: d.fullName || prev.fullName,
          phone: d.phone || prev.phone,
          address: d.address || prev.address,
        }))
        setCareerForm(prev => ({
          ...prev,
          jobTitle: d.jobTitle ?? prev.jobTitle,
          experienceYear: d.experienceYear ?? prev.experienceYear,
          careerLevel: d.careerLevel ?? prev.careerLevel,
        }))
        setImportMsg('✓ Đã nhập từ CV phân tích thành công. Đang tải lại...')
        setTimeout(() => window.location.reload(), 1200)
        return
      } else {
        // CV local: data nằm trong cv_builder_state[cv.id].data
        const cvData = getCVData(cv.id)
        const personalInfo = cvData.personalInfo || {}
        const experiences = Array.isArray(cvData.experiences) ? cvData.experiences : []

        // Strip HTML khỏi summary trước khi gửi
        const rawSummary = cvData.summary || ''
        const plainSummary = rawSummary.replace(/<[^>]*>/g, '').trim()

        // Chỉ gửi các field cần thiết, bỏ description dài + HTML để tránh 413
        const lightExperiences = experiences.map(e => ({
          position: e.position || '',
          company: e.company || '',
          duration: e.duration || '',
        }))

        const lightSkills = (cvData.skills || []).map(s =>
          typeof s === 'string' ? { category: s, items: s } : { category: s.category || '', items: s.items || '' }
        )

        const res = await fetch(`${API}/cv-analyzer/map-from-local`, {
          method: 'POST',
          headers: authRef.current,
          body: JSON.stringify({
            personalInfo: {
              fullName: personalInfo.fullName || '',
              phone: personalInfo.phone || '',
              address: personalInfo.address || '',
              email: personalInfo.email || '',
            },
            experiences: lightExperiences,
            education: (cvData.education || []).map(e => ({ degree: e.degree || '', school: e.school || '', institution: e.institution || '', year: e.year || '' })),
            skills: lightSkills,
            summary: plainSummary,
          }),
        })
        if (!res.ok) throw new Error('Map failed')
        const result = await res.json()

        const d = result.data || {}
        setPersonalForm(prev => ({
          ...prev,
          fullName: d.fullName || personalInfo.fullName || prev.fullName,
          phone: d.phone || personalInfo.phone || prev.phone,
          address: d.address || personalInfo.address || prev.address,
        }))
        setCareerForm(prev => ({
          ...prev,
          jobTitle: d.jobTitle ?? prev.jobTitle,
          experienceYear: d.experienceYear ?? prev.experienceYear,
          careerLevel: d.careerLevel ?? prev.careerLevel,
        }))
        setImportMsg('✓ Đã nhập thông tin từ CV thành công. Đang tải lại...')
        setTimeout(() => window.location.reload(), 1200)
        return
      }
    } catch (err) {
      console.error('importFromCV:', err)
      setImportMsg('✗ Nhập thất bại, thử lại sau')
    }

    setTimeout(() => setImportMsg(''), 5000)
  }

  return (
    <div id="s8">
      <div className="app-layout">
        <Sidebar activeItem="profile" onNavigate={onNavigate} />
        <div className="main-content">
          <Topbar title="👤 Hồ sơ & Cài đặt AI">

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {saveMsg && (
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: saveMsg.startsWith('✓') ? 'var(--sage)' : 'var(--rust)',
                }}>
                  {saveMsg}
                </span>
              )}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowImportModal(true)}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              >
                📋 Nhập từ CV
              </button>

              <button className="btn btn-sage btn-sm" onClick={handleSave} disabled={saving || loading}>
                {saving ? '⏳ Đang lưu...' : '💾 Lưu'}
              </button>
            </div>
          </Topbar>

          <div className="main-scroll">
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink4)', fontSize: 14 }}>
                ⟳ Đang tải hồ sơ...
              </div>
            ) : (
              <div className="profile-wrap">
                <div className="profile-main">

                  <div className="card p-header">
                    <div className="p-avatar">
                      {profile?.avatar
                        ? (
                          <img
                            src={`${API}${profile.avatar}`}
                            alt="avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        )
                        : avatarLetters
                      }
                      <div className="p-status" />
                    </div>

                    <div className="p-info">
                      <div className="p-name">{profile?.fullName ?? '—'}</div>
                      <div className="p-role">
                        {[profile?.jobTitle, profile?.experienceYear].filter(Boolean).join(' • ') || 'Chưa cập nhật'}
                      </div>
                      <div className="p-tags">
                        {profile?.industry && <Badge variant="rust">💻 {profile.industry.name}</Badge>}
                        {profile?.workingType && <Badge variant="sage">🏠 {profile.workingType}</Badge>}
                        {profile?.careerLevel && <Badge variant="amber">⭐ {profile.careerLevel}</Badge>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignSelf: 'flex-start', flexShrink: 0 }}>
                      <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', textAlign: 'center' }}>
                        ✏️ Sửa ảnh
                        <input type="file" accept="image/*" hidden onChange={handleUploadAvatar} />
                      </label>
                      {profile?.avatar && (
                        <button
                          className="btn btn-sm"
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--ink3)',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                          onClick={handleRemoveAvatar}
                        >
                          🗑 Xóa ảnh
                        </button>
                      )}
                    </div>
                  </div>

                  {stats && (
                    <div className="card profile-card" style={{ padding: '16px 22px' }}>
                      <div className="profile-section-title" style={{ marginBottom: 12 }}>📊 Hoạt động của bạn</div>
                      <div style={{ display: 'flex' }}>
                        {[
                          { label: 'Đã xem', value: stats.viewCount, icon: '👁' },
                          { label: 'Đã lưu', value: stats.saveCount, icon: '🔖' },
                          { label: 'Đã apply', value: stats.applyCount, icon: '⚡' },
                          { label: 'Đề xuất', value: stats.recommendCount, icon: '🎯' },
                        ].map((s, i) => (
                          <div key={i} style={{
                            flex: 1, textAlign: 'center',
                            borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                            padding: '4px 0',
                          }}>
                            <div style={{ fontSize: 18 }}>{s.icon}</div>
                            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Fraunces', serif" }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: 'var(--ink4)' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="card profile-card">
                    <div className="profile-section-title">Thông tin cá nhân</div>
                    <div className="form-grid profile-grid">
                      <div className="form-group">
                        <div className="form-label">Họ và tên</div>
                        <input className="inp" value={personalForm.fullName}
                          onChange={e => setPersonalForm(p => ({ ...p, fullName: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <div className="form-label">Năm sinh</div>
                        <input className="inp" type="number" value={personalForm.birthYear}
                          onChange={e => setPersonalForm(p => ({ ...p, birthYear: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <div className="form-label">Số điện thoại</div>
                        <input className="inp" value={personalForm.phone}
                          onChange={e => setPersonalForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <div className="form-label">Giới tính</div>
                        <select className="inp" value={personalForm.gender}
                          onChange={e => setPersonalForm(p => ({ ...p, gender: e.target.value }))}>
                          <option>Nam</option>
                          <option>Nữ</option>
                          <option>Khác</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <div className="form-label">Địa chỉ</div>
                        <input className="inp" value={personalForm.address}
                          onChange={e => setPersonalForm(p => ({ ...p, address: e.target.value }))} />
                      </div>
                    </div>
                  </div>

                  <div className="card profile-card">
                    <div className="profile-section-title">Thông tin nghề nghiệp</div>
                    <div className="form-grid profile-grid">
                      <div className="form-group">
                        <div className="form-label">Chức danh</div>
                        <input className="inp" value={careerForm.jobTitle}
                          onChange={e => setCareerForm(p => ({ ...p, jobTitle: e.target.value }))}
                          placeholder="VD: Frontend Developer" />
                      </div>
                      <div className="form-group">
                        <div className="form-label">Kinh nghiệm</div>
                        <select className="inp" value={careerForm.experienceYear}
                          onChange={e => setCareerForm(p => ({ ...p, experienceYear: e.target.value }))}>
                          <option value="">-- Chọn --</option>
                          <option>Chưa có kinh nghiệm</option>
                          <option>Dưới 1 năm</option>
                          <option>1-2 năm</option>
                          <option>2-3 năm</option>
                          <option>3-5 năm</option>
                          <option>Trên 5 năm</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Cấp bậc</div>
                        <select className="inp" value={careerForm.careerLevel}
                          onChange={e => setCareerForm(p => ({ ...p, careerLevel: e.target.value }))}>
                          <option value="">-- Chọn --</option>
                          <option>Intern</option>
                          <option>Junior</option>
                          <option>Middle</option>
                          <option>Senior</option>
                          <option>Lead</option>
                          <option>Manager</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Lương kỳ vọng</div>
                        <input className="inp" value={careerForm.expectedSalary}
                          onChange={e => setCareerForm(p => ({ ...p, expectedSalary: e.target.value }))}
                          placeholder="VD: 25-35 triệu" />
                      </div>
                      <div className="form-group">
                        <div className="form-label">Hình thức làm việc</div>
                        <select className="inp" value={careerForm.workingType}
                          onChange={e => setCareerForm(p => ({ ...p, workingType: e.target.value }))}>
                          <option value="">-- Chọn --</option>
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Remote</option>
                          <option>Hybrid</option>
                          <option>Freelance</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <div className="form-label">Ngành nghề</div>
                        <select className="inp" value={careerForm.industryId}
                          onChange={e => setCareerForm(p => ({ ...p, industryId: e.target.value }))}>
                          <option value="">-- Chọn ngành nghề --</option>
                          {industries.map(ind => (
                            <option key={ind.id} value={ind.id}>{ind.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="card profile-card">
                    <div className="profile-section-title">Kỹ năng</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
                      {(profile?.skills ?? []).map(skill => (
                        <span key={skill.id} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                          background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--ink2)',
                        }}>
                          {skill.name}
                          <span style={{ cursor: 'pointer', color: 'var(--ink4)', fontSize: 15, lineHeight: 1 }}
                            onClick={() => handleRemoveSkill(skill.id)}>×</span>
                        </span>
                      ))}
                      {(profile?.skills ?? []).length === 0 && (
                        <span style={{ fontSize: 13, color: 'var(--ink4)' }}>Chưa có kỹ năng nào</span>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input className="inp" placeholder="🔍 Tìm và thêm kỹ năng..."
                        value={skillSearch}
                        onChange={e => { setSkillSearch(e.target.value); setShowSkillDropdown(true) }}
                        onFocus={() => setShowSkillDropdown(true)}
                        onBlur={() => setTimeout(() => setShowSkillDropdown(false), 150)}
                      />
                      {showSkillDropdown && filteredSkills.length > 0 && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
                          background: 'var(--surf)', border: '1px solid var(--border)',
                          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
                          maxHeight: 200, overflowY: 'auto',
                        }}>
                          {filteredSkills.slice(0, 20).map(skill => (
                            <div key={skill.skillID}
                              onMouseDown={() => handleAddSkill(skill)}
                              style={{
                                padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <span>{skill.name}</span>
                              <span style={{ fontSize: 11, color: 'var(--ink4)' }}>{skill.industry}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card profile-card">
                    <div className="profile-section-title">Tùy chỉnh AI đề xuất</div>
                    {AI_PREFERENCES.map((pref, idx) => (
                      <div key={idx} className="pref-row">
                        <span className="pref-k">{pref.key}</span>
                        <span className="pref-v">{pref.value}</span>
                      </div>
                    ))}
                    {AI_TOGGLES.map((toggle, idx) => (
                      <div key={idx} className="pref-row">
                        <span className="pref-k">{toggle.key}</span>
                        <div className="toggle-wrap">
                          <div className={`toggle ${toggle.active ? 'on' : 'off'}`}>
                            <div className="toggle-dot" />
                          </div>
                          <span className={`toggle-label ${toggle.active ? 'on' : 'off'}`}>
                            {toggle.active ? 'Bật' : 'Tắt'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="p-right">

                  <div className="card profile-card">
                    <div className="profile-section-title">🧠 AI đã học gì từ bạn</div>
                    {AI_INSIGHTS.map((insight, idx) => (
                      <div key={idx} className="act-item">
                        <div className="act-icon">{insight.icon}</div>
                        <div className="act-content">
                          <div className="act-text">{insight.text}</div>
                          <div className="act-time">{insight.source}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {profile && (
                    <div className="card profile-card">
                      <div className="profile-section-title">ℹ️ Tài khoản</div>
                      <div className="pref-row">
                        <span className="pref-k">Email</span>
                        <span className="pref-v" style={{ fontSize: 12 }}>{profile.email}</span>
                      </div>
                      <div className="pref-row" style={{ borderBottom: 'none' }}>
                        <span className="pref-k">Thành viên từ</span>
                        <span className="pref-v">
                          {profile.memberSince
                            ? new Date(profile.memberSince).toLocaleDateString('vi-VN')
                            : '—'}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Import CV Modal */}
      {showImportModal && (
        <ImportCVModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportFromCV}
          authHeaders={authRef.current}
          cvList={cvList}
        />
      )}
    </div>
  )
}

export default ProfileScreen