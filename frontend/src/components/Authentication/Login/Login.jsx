import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import './Login.css'

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
const IconGoogle = () => (
  <svg viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)


export default function Login({ onGoRegister, onGoForgot, onLoginSuccess }) {
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(true)

  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại.')

      const storage = remember ? localStorage : sessionStorage
      storage.setItem('token', data.accessToken)
      storage.setItem('user', JSON.stringify(data.user))
      console.log('user data:', data.user)       // xem có role không
      console.log('role:', data.user.role)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err) {
      setError(decodeURIComponent(err))
      window.history.replaceState({}, document.title, '/login')
    }
  }, [])


  return (
    <div className="auth-wrap">
      <div className="auth-noise" />

      <div className="auth-left">
        <div className="auth-brand">GZ<span>CONNECT</span></div>
        <div className="auth-panel-body">
          <h2 className="auth-panel-headline">Chào mừng<br />trở lại <em>GZCONNECT</em></h2>
          <p className="auth-panel-sub">Hàng nghìn cơ hội việc làm đang chờ bạn. Đăng nhập để trải nghiệm ngay hôm nay.</p>
          <div className="auth-panel-stats">
            {[
              { ico: '🔥', bg: 'rgba(192,65,42,0.15)', title: 'Nhiều việc làm mới / ngày', sub: 'Tổng hợp từ nhiều nền tảng' },
              { ico: '🎯', bg: 'rgba(232,201,122,0.12)', title: 'Match Score AI', sub: 'Học theo hành vi của bạn' },
            ].map((s, i) => (
              <div key={i} className="aps-item">
                <div className="aps-ico" style={{ background: s.bg }}>{s.ico}</div>
                <div className="aps-info"><strong>{s.title}</strong><span>{s.sub}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-glow" />
        <div className="auth-card">
          <h2 className="auth-card-title">ĐĂNG NHẬP</h2>

          <div className="auth-socials">
            <button className="auth-social-btn" onClick={handleGoogle}>
              <IconGoogle /> Google
            </button>
          </div>
          <div className="auth-divider"><span>hoặc đăng nhập bằng email</span></div>

          <div className="auth-form">
            {error && <div className="auth-error">⚠ {error}</div>}

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <span className="auth-input-ico"><IconMail /></span>
                <input className="auth-input" type="email" placeholder="ten@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
            </div>

            <div className="auth-field">
              <label>Mật khẩu</label>
              <div className="auth-input-wrap">
                <span className="auth-input-ico"><IconLock /></span>
                <input className="auth-input has-toggle"
                  type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                <button className="auth-toggle-pw" onClick={() => setShowPw(v => !v)}>
                  <IconEye off={showPw} />
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-check-wrap">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a className="auth-link" onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</a>
            </div>

            <button className={`auth-submit${loading ? ' loading' : ''}`}
              onClick={handleSubmit} disabled={loading}>
              {loading ? '⟳ Đang xử lý...' : 'Đăng nhập →'}
            </button>
          </div>

          <div className="auth-bottom">
            Chưa có tài khoản? <a onClick={() => navigate("/register")}>Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  )
}