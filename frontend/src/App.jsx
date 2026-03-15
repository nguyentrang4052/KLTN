// src/App.jsx
import { useState } from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'

import Header              from './components/layout/Header/Header'
import Footer              from './components/layout/Footer/Footer'
import LandingScreen       from './components/screens/LandingScreen/LandingScreen'
import DashboardScreen     from './components/screens/DashboardScreen/DashboardScreen'
import HomeScreen     from './components/screens/HomeScreen/HomeScreen'
import JobDetailScreen     from './components/screens/JobDetailScreen/JobDetailScreen'
import CVBuilderScreen     from './components/screens/CVBuilderScreen/CVBuilderScreen'
import ApplicationsScreen  from './components/screens/ApplicationsScreen/ApplicationsScreen'
import ProfileScreen       from './components/screens/ProfileScreen/ProfileScreen'
import NotificationsScreen from './components/screens/NotificationsScreen/NotificationsScreen'
import JobSearchScreen       from './components/screens/JobSearchScreen/JobSearchScreen'
import CompaniesScreen     from './components/screens/CompaniesScreen/CompaniesScreen'
import AboutScreen from './components/screens/AboutScreen/AboutScreen'

import Login from './components/screens/Login/Login'
import Register from './components/screens/Register/Register'
import ForgotPassword from './components/screens/ForgotPassword/ForgotPassword'
import OAuthCallback from './components/screens/OAuthCallback/OAuthCallback'
// import { getToken } from './utils/auth'

// const NO_HEADER_SCREENS = new Set(['s1'])

function App() {
  const path = window.location.pathname

  // const [activeScreen, setActiveScreen] = useState(() => {
  //   if (path === '/oauth-callback') return 'oauth'
  //   if (getToken()) return 's3'
  //   return 's1'
  // })

  // const handleLoginSuccess = () => setActiveScreen('s3')

  // if (activeScreen === 'login')
  //   return <Login
  //     onGoRegister={() => setActiveScreen('register')}
  //     onGoForgot={() => setActiveScreen('forgot')}
  //     onLoginSuccess={handleLoginSuccess}
  //   />
  // if (activeScreen === 'register')
  //   return <Register onGoLogin={() => setActiveScreen('login')} />
  // if (activeScreen === 'forgot')
  //   return <ForgotPassword onGoLogin={() => setActiveScreen('login')} />
  // if (activeScreen === 'oauth')
  //   return <OAuthCallback onLoginSuccess={handleLoginSuccess} />

  // const screens = {
  //   s1:  <LandingScreen  onGoLogin={() => setActiveScreen('login')}  onNavigate={setActiveScreen} />,
  //   s2:  <DashboardScreen     onNavigate={setActiveScreen} />,
  //   s3:  <HomeScreen     onNavigate={setActiveScreen} />,
  //   s4:  <JobDetailScreen     onNavigate={setActiveScreen} />,
  //   s6:  <CVBuilderScreen     onNavigate={setActiveScreen} />,
  //   s7:  <ApplicationsScreen  onNavigate={setActiveScreen} />,
  //   s8:  <ProfileScreen       onNavigate={setActiveScreen} />,
  //   s9:  <NotificationsScreen onNavigate={setActiveScreen} />,
  //   s10: <JobSearchScreen onNavigate={setActiveScreen}/>,
  //   s11: <CompaniesScreen     onNavigate={setActiveScreen} />,
  //   s12: <AboutScreen onNavigate={setActiveScreen} />

  // }

  // const showHeader = !NO_HEADER_SCREENS.has(activeScreen) 

  const location = useLocation()

  const hideHeader = location.pathname === "/"
  return (
    <div className="app">
      {/* Header — hidden on Landing & Public screens */}
      {/* {showHeader && (
        <Header
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          notifCount={5}
        />
      )} */}
      {!hideHeader && <Header notifCount={5} />}

      <div className="screen-container">
        {/* {screens[activeScreen] ?? screens['s3']} */}
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/job/:id" element={<JobDetailScreen />} />
          <Route path="/cv-builder" element={<CVBuilderScreen />} />
          <Route path="/applications" element={<ApplicationsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/jobs" element={<JobSearchScreen />} />
          <Route path="/companies" element={<CompaniesScreen />} />
          <Route path="/about" element={<AboutScreen />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App