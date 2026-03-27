import { useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import './ForgotPassword.css'

/* ── Icons ── */
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

export default function ForgotPassword({ onGoLogin }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const otpRefs = useRef([])
  const strength = getStrength(newPw)

  const navigate = useNavigate()

  const startResend = () => {
    setResendTimer(60)
    const t = setInterval(() => setResendTimer(v => {
      if (v <= 1) { clearInterval(t); return 0 }
      return v - 1
    }), 1000)
  }

  const handleSendOTP = async () => {
    setError('')
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Email không hợp lệ.'); return }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Gửi mã thất bại.')
      setStep(2)
      startResend()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const handleVerifyOTP = async () => {
    setError('')
    if (otp.join('').length < 6) { setError('Vui lòng nhập đầy đủ 6 chữ số.'); return }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join('') }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Mã OTP không đúng.')
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPw = async () => {
    setError('')
    if (!newPw || strength.score < 2) { setError('Mật khẩu quá yếu. Tối thiểu 8 ký tự.'); return }
    if (newPw !== confirmPw) { setError('Mật khẩu xác nhận không khớp.'); return }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), newPassword: newPw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Đặt lại mật khẩu thất bại.')
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fp-wrap">
      <div className="fp-noise" />


      <div className="fp-left">
        <div className="fp-brand">GZ<span>CONNECT</span></div>
        <div className="fp-panel-body">
          <h2 className="fp-panel-headline">Lấy lại<br /><em>quyền truy cập</em></h2>
          <p className="fp-panel-sub">Chúng tôi sẽ gửi mã xác minh qua email để bạn đặt lại mật khẩu an toàn.</p>
          <div className="fp-panel-stats">
            {[
              { ico: '🔥', bg: 'rgba(192,65,42,0.15)', title: 'Nhiều việc làm mới / ngày', sub: 'Tổng hợp từ nhiều nền tảng' },
              { ico: '🎯', bg: 'rgba(232,201,122,0.12)', title: 'Match Score AI', sub: 'Học theo hành vi của bạn' },
            ].map((s, i) => (
              <div key={i} className="fp-aps-item">
                <div className="fp-aps-ico" style={{ background: s.bg }}>{s.ico}</div>
                <div className="fp-aps-info"><strong>{s.title}</strong><span>{s.sub}</span></div>
              </div>
            ))}
          </div>
        </div>

      </div>


      <div className="fp-right">
        <div className="fp-glow" />
        <div className="fp-card">


          {step < 4 && (
            <button className="fp-back" onClick={step === 1 ? onGoLogin : () => setStep(s => s - 1)}>
              <IconArrowLeft /> {step === 1 ? 'Về đăng nhập' : 'Quay lại'}
            </button>
          )}


          {step < 4 && (
            <div className="fp-steps">
              {[1, 2, 3].map(s => (
                <div key={s} className={`fp-step-dot ${s === step ? 'active' : s < step ? 'done' : ''}`} />
              ))}
              <span className="fp-step-label">
                {['Nhập email', 'Xác minh OTP', 'Đặt lại mật khẩu'][step - 1]}
              </span>
            </div>
          )}

          {step === 1 && (
            <>
              <h2 className="fp-card-title">Quên mật khẩu?</h2>
              <p className="fp-card-sub">Nhập email đăng ký để nhận mã xác minh 6 chữ số.</p>
              <div className="fp-form">
                {error && <div className="fp-error">⚠ {error}</div>}
                <div className="fp-field">
                  <label>Email đăng ký</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-ico"><IconMail /></span>
                    <input className="fp-input" type="email" placeholder="ten@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <button className={`fp-submit${loading ? ' loading' : ''}`}
                  onClick={handleSendOTP} disabled={loading}>
                  {loading ? '⟳ Đang gửi mã...' : 'Gửi mã xác minh →'}
                </button>
              </div>
              <div className="fp-bottom">
                Nhớ mật khẩu rồi? <a onClick={() => navigate("/login")}>Đăng nhập</a>
              </div>
            </>
          )}


          {step === 2 && (
            <>
              <h2 className="fp-card-title">Nhập mã xác minh</h2>
              <p className="fp-card-sub">
                Mã 6 chữ số đã được gửi đến <strong style={{ color: '#E8C97A' }}>{email}</strong>.
                Có hiệu lực trong 10 phút.
              </p>
              <div className="fp-form">
                {error && <div className="fp-error">⚠ {error}</div>}
                <div className="fp-otp-row">
                  {otp.map((v, i) => (
                    <input key={i}
                      ref={el => otpRefs.current[i] = el}
                      className="fp-otp-box"
                      type="text" inputMode="numeric" maxLength={1}
                      value={v}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                    />
                  ))}
                </div>
                <button className={`fp-submit${loading ? ' loading' : ''}`}
                  onClick={handleVerifyOTP} disabled={loading}>
                  {loading ? '⟳ Đang xác minh...' : 'Xác minh mã →'}
                </button>
                <p className="fp-resend">
                  Không nhận được mã?{' '}
                  {resendTimer > 0
                    ? <span>Gửi lại sau {resendTimer}s</span>
                    : <a onClick={async () => {
                      startResend()
                      await handleSendOTP()
                    }}>Gửi lại</a>
                  }
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="fp-card-title">Đặt mật khẩu mới</h2>
              <p className="fp-card-sub">Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
              <div className="fp-form">
                {error && <div className="fp-error">⚠ {error}</div>}

                <div className="fp-field">
                  <label>Mật khẩu mới</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-ico"><IconLock /></span>
                    <input className="fp-input has-toggle"
                      type={showPw ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự"
                      value={newPw} onChange={e => setNewPw(e.target.value)} />
                    <button className="fp-toggle-pw" onClick={() => setShowPw(v => !v)}>
                      <IconEye off={showPw} />
                    </button>
                  </div>
                  {newPw && (
                    <>
                      <div className="fp-pw-strength">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`fp-pw-bar ${i <= strength.score ? `active-${strength.cls}` : ''}`} />
                        ))}
                      </div>
                      <div className={`fp-pw-label ${strength.cls}`}>{strength.label}</div>
                    </>
                  )}
                </div>

                <div className="fp-field">
                  <label>Xác nhận mật khẩu</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-ico"><IconLock /></span>
                    <input className="fp-input has-toggle"
                      type={showPw2 ? 'text' : 'password'} placeholder="Nhập lại mật khẩu"
                      value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                    <button className="fp-toggle-pw" onClick={() => setShowPw2(v => !v)}>
                      <IconEye off={showPw2} />
                    </button>
                  </div>
                </div>

                <button className={`fp-submit${loading ? ' loading' : ''}`}
                  onClick={handleResetPw} disabled={loading}>
                  {loading ? '⟳ Đang cập nhật...' : 'Đặt lại mật khẩu ✓'}
                </button>
              </div>
            </>
          )}


          {step === 4 && (
            <div className="fp-success">
              <div className="fp-success-ico">🔐</div>
              <h3>Đặt lại thành công!</h3>
              <p>Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập với mật khẩu mới.</p>
              <button className="fp-submit fp-submit-auto" onClick={onGoLogin}>
                Đăng nhập ngay →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}