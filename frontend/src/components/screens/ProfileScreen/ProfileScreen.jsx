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

function ProfileScreen({ onNavigate }) {
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

  return (
    <div id="s8">
      <div className="app-layout">
        <Sidebar activeItem="profile" onNavigate={onNavigate} />
        <div className="main-content">
          <Topbar title="👤 Hồ sơ & Cài đặt AI">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 15, paddingRight: 15, borderRight: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{profile?.fullName}</span>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: 'rgb(189, 114, 71)'
              }}>
                {profile?.avatar
                  ? <img src={`${API}${profile.avatar}`} alt="avt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : avatarLetters
                }
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {saveMsg && (
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: saveMsg.startsWith('✓') ? 'var(--sage)' : 'var(--rust)',
                }}>
                  {saveMsg}
                </span>
              )}
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

                  {/* <div className="card profile-card">
                      <div className="profile-section-title">🔗 Tài khoản kết nối</div>
                      <div className="account-list">
                        {CONNECTED_ACCOUNTS.map((acc, idx) => (
                          <div key={idx} className="account-row">
                            <div className="account-icon" style={{
                              background: acc.color,
                              color: acc.connected ? '#FFF' : 'var(--ink3)',
                              border: acc.connected ? 'none' : '1px solid var(--border)',
                            }}>
                              {acc.code}
                            </div>
                            <div className="account-info">
                              <div className="account-name">{acc.name}</div>
                              <div className={`account-status ${acc.connected ? 'connected' : ''}`}>
                                {acc.connected ? '✓ Đã kết nối' : 'Chưa kết nối'}
                              </div>
                            </div>
                            <button className={`btn btn-${acc.connected ? 'outline' : 'rust'} btn-sm`}>
                              {acc.connected ? 'Ngắt' : '+ Kết nối'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div> */}

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
    </div>
  )
}

export default ProfileScreen