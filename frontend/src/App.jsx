import { useState } from 'react'
import './App.css'
import ScreenNav from './components/layout/ScreenNav/ScreenNav'
import LandingScreen from './components/screens/LandingScreen/LandingScreen'
import DashboardScreen from './components/screens/DashboardScreen/DashboardScreen'
import JobSearchScreen from './components/screens/JobSearchScreen/JobSearchScreen'
import JobDetailScreen from './components/screens/JobDetailScreen/JobDetailScreen'
import AutoApplyScreen from './components/screens/AutoApplyScreen/AutoApplyScreen'
import CVBuilderScreen from './components/screens/CVBuilderScreen/CVBuilderScreen'
import ApplicationsScreen from './components/screens/ApplicationsScreen/ApplicationsScreen'
import ProfileScreen from './components/screens/ProfileScreen/ProfileScreen'
import NotificationsScreen from './components/screens/NotificationsScreen/NotificationsScreen'
import Login from './components/screens/Login/Login'
import Register from './components/screens/Register/Register'
import ForgotPassword from './components/screens/ForgotPassword/ForgotPassword'
import OAuthCallback from './components/screens/OAuthCallback/OAuthCallback'
import { getToken } from './utils/auth'

function App() {
  const path = window.location.pathname

  const [activeScreen, setActiveScreen] = useState(() => {
    if (path === '/oauth-callback') return 'oauth'
    if (getToken()) return 's2'
    return 's1'
  })

  const handleLoginSuccess = () => setActiveScreen('s2')

  if (activeScreen === 'login')
    return <Login
      onGoRegister={() => setActiveScreen('register')}
      onGoForgot={() => setActiveScreen('forgot')}
      onLoginSuccess={handleLoginSuccess}
    />
  if (activeScreen === 'register')
    return <Register onGoLogin={() => setActiveScreen('login')} />
  if (activeScreen === 'forgot')
    return <ForgotPassword onGoLogin={() => setActiveScreen('login')} />
  if (activeScreen === 'oauth')
    return <OAuthCallback onLoginSuccess={handleLoginSuccess} />

  const screens = {
    s1: <LandingScreen onGoLogin={() => setActiveScreen('login')} />,
    s2: <DashboardScreen />,
    s3: <JobSearchScreen />,
    s4: <JobDetailScreen />,
    s5: <AutoApplyScreen />,
    s6: <CVBuilderScreen />,
    s7: <ApplicationsScreen />,
    s8: <ProfileScreen />,
    s9: <NotificationsScreen />
  }

  return (
    <div className="app">
      <ScreenNav activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      <div className="screen-container">
        {screens[activeScreen]}
      </div>
    </div>
  )
}

export default App