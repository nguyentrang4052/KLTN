import { useState, useRef, useEffect } from 'react'
import './Register.css'

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const IconEye = ({ off }) => off ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const IconGoogle = () => (
  <svg viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Cần Thơ',
  'Huế',
  'An Giang',
  'Bắc Ninh',
  'Bình Dương',
  'Bình Thuận',
  'Cao Bằng',
  'Cà Mau',
  'Đắk Lắk',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Tĩnh',
  'Hưng Yên',
  'Khánh Hòa',
  'Lai Châu',
  'Lào Cai',
  'Lâm Đồng',
  'Lạng Sơn',
  'Long An',
  'Nghệ An',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Sơn La',
  'Thanh Hóa',
  'Thái Nguyên',
  'Tuyên Quang',
  'Vĩnh Long',
]

function ProvinceSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapRef = useRef(null)

  const filtered = PROVINCES.filter(p =>
    p.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (p) => { onChange(p); setOpen(false); setSearch('') }

  return (
    <div className="rg-province-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`rg-province-trigger${open ? ' open' : ''}${value ? ' has-value' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className="rg-province-ico"><IconMapPin /></span>
        <span className="rg-province-val">{value || 'Chọn tỉnh / thành phố'}</span>
        <span className={`rg-province-chevron${open ? ' open' : ''}`}><IconChevron /></span>
      </button>

      {open && (
        <div className="rg-province-dropdown">
          <div className="rg-province-search">
            <span className="rg-ps-ico"><IconSearch /></span>
            <input
              autoFocus
              className="rg-ps-input"
              placeholder="Tìm tỉnh thành..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="rg-province-list">
            {filtered.length === 0
              ? <div className="rg-province-empty">Không tìm thấy</div>
              : filtered.map(p => (
                <div
                  key={p}
                  className={`rg-province-item${value === p ? ' selected' : ''}`}
                  onClick={() => select(p)}
                >
                  {p}
                  {value === p && <span className="rg-province-check">✓</span>}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', cls: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return {
    score: s,
    label: ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'][s],
    cls: ['', 'weak', 'fair', 'good', 'strong'][s],
  }
}

function isValidPhone(phone) {
  return /^(0|\+84)[0-9]{9}$/.test(phone)
}

function isValidBirthYear(year) {
  if (!year) return true

  const y = Number(year)
  const current = new Date().getFullYear()

  return y >= 1950 && y <= current - 16
}

export default function Register({ onGoLogin }) {
  const [step, setStep] = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '', password: '', confirm: '',
    fullName: '', phone: '', birthYear: '', gender: '', address: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const strength = getStrength(form.password)

  const handleStep1 = () => {
    setError('')
    if (!form.email) { setError('Vui lòng nhập email.'); return }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Email không hợp lệ.'); return }
    if (!form.password) { setError('Vui lòng nhập mật khẩu.'); return }
    if (strength.score < 2) { setError('Mật khẩu quá yếu. Cần ít nhất 8 ký tự và 1 chữ hoa hoặc số.'); return }
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    setStep(2)
  }

  const handleStep2 = async () => {
    setError('')

    if (!form.fullName.trim()) {
      setError('Vui lòng nhập họ tên.')
      return
    }

    if (!form.phone.trim()) {
      setError('Vui lòng nhập số điện thoại.')
      return
    }

    if (!isValidPhone(form.phone)) {
      setError('Số điện thoại không hợp lệ.')
      return
    }

    if (!isValidBirthYear(form.birthYear)) {
      setError('Năm sinh không hợp lệ (16 - 75 tuổi).')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          phone: form.phone,
          birthYear: form.birthYear ? Number(form.birthYear) : null,
          gender: form.gender,
          address: form.address,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Đăng ký thất bại')
      }

      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const STEP_LABELS = ['Tài khoản', 'Hồ sơ', 'Xong']

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  const handleFacebookRegister = () => {
    window.location.href = 'http://localhost:3000/api/auth/facebook'
  }

  return (
    <div className="rg-wrap">
      <div className="rg-noise" />

      <div className="rg-left">
        <div className="rg-brand">GZ<span>CONNECT</span></div>
        <div className="rg-panel-body">
          <h2 className="rg-panel-headline">Bắt đầu hành trình <em>sự nghiệp</em> mới</h2>
          <div className="rg-panel-stats">
            {[
              { ico: '🔥', bg: 'rgba(192,65,42,0.15)', title: 'Nhiều việc làm mới / ngày', sub: 'Tổng hợp từ nhiều nền tảng' },
              { ico: '🎯', bg: 'rgba(232,201,122,0.12)', title: 'Match Score AI', sub: 'Học theo hành vi của bạn' },
            ].map((s, i) => (
              <div key={i} className="rg-aps-item">
                <div className="rg-aps-ico" style={{ background: s.bg }}>{s.ico}</div>
                <div className="rg-aps-info"><strong>{s.title}</strong><span>{s.sub}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="rg-right">
        <div className="rg-glow" />
        <div className="rg-card">


          {step < 3 && (
            <div className="rg-stepper">
              {[1, 2].map((s) => (
                <div key={s} className={`rg-stepper-item${step === s ? ' active' : step > s ? ' done' : ''}`}>
                  <div className="rg-stepper-circle">
                    {step > s ? '✓' : s}
                  </div>
                  <span className="rg-stepper-label">{STEP_LABELS[s - 1]}</span>
                  {s < 2 && <div className={`rg-stepper-line${step > s ? ' done' : ''}`} />}
                </div>
              ))}
            </div>
          )}


          {step === 1 && (
            <>
              <h2 className="rg-card-title">Tạo tài khoản</h2>
              <p className="rg-card-sub">Đã có tài khoản? <a onClick={onGoLogin}>Đăng nhập →</a></p>

              <div className="rg-socials">
                <button className="rg-social-btn" onClick={handleGoogleRegister}>
                  <IconGoogle /> Google
                </button>

                {/* <button className="rg-social-btn" onClick={handleFacebookRegister}>
                  <IconFacebook /> Facebook
                </button> */}
              </div>
              <div className="rg-divider"><span>hoặc đăng ký bằng email</span></div>

              <div className="rg-form">
                {error && <div className="rg-error">⚠ {error}</div>}

                <div className="rg-field">
                  <label>Email <span className="rg-req">*</span></label>
                  <div className="rg-input-wrap">
                    <span className="rg-input-ico"><IconMail /></span>
                    <input className="rg-input" type="email" placeholder="ten@example.com"
                      value={form.email} onChange={e => set('email', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStep1()} />
                  </div>
                </div>

                <div className="rg-field">
                  <label>Mật khẩu <span className="rg-req">*</span></label>
                  <div className="rg-input-wrap">
                    <span className="rg-input-ico"><IconLock /></span>
                    <input className="rg-input has-toggle"
                      type={showPw ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự"
                      value={form.password} onChange={e => set('password', e.target.value)} />
                    <button className="rg-toggle-pw" type="button" onClick={() => setShowPw(v => !v)}>
                      <IconEye off={showPw} />
                    </button>
                  </div>
                  {form.password && (
                    <div className="rg-strength-wrap">
                      <div className="rg-pw-strength">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`rg-pw-bar ${i <= strength.score ? `active-${strength.cls}` : ''}`} />
                        ))}
                      </div>
                      <span className={`rg-pw-label ${strength.cls}`}>{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="rg-field">
                  <label>Xác nhận mật khẩu <span className="rg-req">*</span></label>
                  <div className="rg-input-wrap">
                    <span className="rg-input-ico"><IconLock /></span>
                    <input className="rg-input has-toggle"
                      type={showPw2 ? 'text' : 'password'} placeholder="Nhập lại mật khẩu"
                      value={form.confirm} onChange={e => set('confirm', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStep1()} />
                    <button className="rg-toggle-pw" type="button" onClick={() => setShowPw2(v => !v)}>
                      <IconEye off={showPw2} />
                    </button>
                  </div>
                  {form.confirm && form.password !== form.confirm && (
                    <span className="rg-field-hint error">Mật khẩu chưa khớp</span>
                  )}
                  {form.confirm && form.password === form.confirm && form.confirm.length > 0 && (
                    <span className="rg-field-hint ok">✓ Mật khẩu khớp</span>
                  )}
                </div>

                <button className="rg-submit" type="button" onClick={handleStep1}>
                  Tiếp theo →
                </button>

              </div>
            </>
          )}


          {step === 2 && (
            <>
              <button className="rg-back" onClick={() => { setStep(1); setError('') }}>
                <IconArrowLeft /> Quay lại
              </button>

              <h2 className="rg-card-title">Thông tin cá nhân</h2>
              <p className="rg-card-sub">Giúp AI đề xuất việc làm phù hợp hơn với bạn.</p>

              <div className="rg-form">
                {error && <div className="rg-error">⚠ {error}</div>}


                <div className="rg-field">
                  <label>Họ và tên <span className="rg-req">*</span></label>
                  <div className="rg-input-wrap">
                    <span className="rg-input-ico"><IconUser /></span>
                    <input className="rg-input" type="text" placeholder="Nguyễn Văn A"
                      value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                  </div>
                </div>


                <div className="rg-two-col">
                  <div className="rg-field">
                    <label>Số điện thoại <span className="rg-req">*</span></label>
                    <div className="rg-input-wrap">
                      <span className="rg-input-ico"><IconPhone /></span>
                      <input className="rg-input" type="tel" placeholder="09xx xxx xxx"
                        value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                  <div className="rg-field">
                    <label>Năm sinh</label>
                    <div className="rg-input-wrap">
                      <span className="rg-input-ico rg-input-ico--emoji">🎂</span>
                      <input className="rg-input" type="number" placeholder="2000"
                        min="1950" max="2010"
                        value={form.birthYear} onChange={e => set('birthYear', e.target.value)} />
                    </div>
                  </div>
                </div>


                <div className="rg-field">
                  <label>Giới tính</label>
                  <div className="rg-gender-row">
                    {[
                      { val: 'Nam', emoji: '👨' },
                      { val: 'Nữ', emoji: '👩' },
                      { val: 'Khác', emoji: '🧑' },
                    ].map(g => (
                      <button key={g.val} type="button"
                        className={`rg-gender-btn${form.gender === g.val ? ' selected' : ''}`}
                        onClick={() => set('gender', g.val)}>
                        <span className="rg-gender-emoji">{g.emoji}</span>
                        {g.val}
                      </button>
                    ))}
                  </div>
                </div>


                <div className="rg-field">
                  <label>Tỉnh / Thành phố</label>
                  <ProvinceSelect
                    value={form.address}
                    onChange={v => set('address', v)}
                  />
                </div>

                <button
                  className={`rg-submit${loading ? ' loading' : ''}`}
                  type="button"
                  onClick={handleStep2}
                  disabled={loading}
                >
                  {loading ? '⟳ Đang tạo tài khoản...' : 'Hoàn tất đăng ký ✓'}
                </button>

                <p className="rg-terms">
                  Các trường không bắt buộc có thể cập nhật sau trong phần <strong>Hồ sơ</strong>.
                </p>
              </div>
            </>
          )}


          {step === 3 && (
            <div className="rg-success">
              <div className="rg-success-ring">
                <div className="rg-success-ico">🎉</div>
              </div>
              <h3>Chào mừng đến với GZCONNECT!</h3>
              <p>Tài khoản đã được tạo thành công.</p>
              <div className="rg-success-info">
                <div className="rg-success-info-item">
                  <span>📧</span> {form.email}
                </div>
                {form.address && (
                  <div className="rg-success-info-item">
                    <span>📍</span> {form.address}
                  </div>
                )}
              </div>
              <button className="rg-submit" style={{ marginTop: 24, maxWidth: 240 }} onClick={onGoLogin}>
                Đăng nhập để tiếp tục →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}