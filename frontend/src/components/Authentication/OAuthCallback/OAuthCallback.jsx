import { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"


function OAuthCallback({ onLoginSuccess }) {
  const navigate = useNavigate()
  const hasRun = useRef(false)


  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

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

      // window.history.replaceState({}, document.title, '/')
      // onLoginSuccess()
      // navigate("/home")
      navigate("/home", { replace: true })
    } else {
      navigate("/login")
    }
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh', background: '#0F0D0B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#888', fontFamily: 'Roboto, sans-serif', fontSize: 14
    }}>
      ⟳ Đang đăng nhập...
    </div>
  )
}

export default OAuthCallback