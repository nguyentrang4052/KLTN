import { useEffect } from 'react'

function OAuthCallback({ onLoginSuccess }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const token = params.get('token')?.trim()
    const email = params.get('email')?.trim()
    const name = params.get('name')?.trim()

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        email: email ? decodeURIComponent(email) : '',
        fullName: name ? decodeURIComponent(name) : '',
      }))

      window.history.replaceState({}, document.title, '/')
      onLoginSuccess()
    }
  }, [onLoginSuccess])

  return (
    <div style={{
      minHeight: '100vh', background: '#0F0D0B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#888', fontFamily: 'DM Sans, sans-serif', fontSize: 14
    }}>
      ⟳ Đang đăng nhập...
    </div>
  )
}

export default OAuthCallback