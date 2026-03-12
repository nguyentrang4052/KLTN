// src/App.jsx
import { useState } from 'react'
import './App.css'

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

const NO_HEADER_SCREENS = new Set(['s1'])

function App() {
  const [activeScreen, setActiveScreen] = useState('s1')

  const screens = {
    s1:  <LandingScreen       onNavigate={setActiveScreen} />,
    s2:  <DashboardScreen     onNavigate={setActiveScreen} />,
    s3:  <HomeScreen     onNavigate={setActiveScreen} />,
    s4:  <JobDetailScreen     onNavigate={setActiveScreen} />,
    s6:  <CVBuilderScreen     onNavigate={setActiveScreen} />,
    s7:  <ApplicationsScreen  onNavigate={setActiveScreen} />,
    s8:  <ProfileScreen       onNavigate={setActiveScreen} />,
    s9:  <NotificationsScreen onNavigate={setActiveScreen} />,
    s10: <JobSearchScreen onNavigate={setActiveScreen}/>,
    s11: <CompaniesScreen     onNavigate={setActiveScreen} />,
    s12: <AboutScreen onNavigate={setActiveScreen} />
  }

  const showHeader = !NO_HEADER_SCREENS.has(activeScreen)

  return (
    <div className="app">
      {/* Header — hidden on Landing & Public screens */}
      {showHeader && (
        <Header
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          notifCount={5}
        />
      )}

      <div className="screen-container">
        {screens[activeScreen] ?? screens['s3']}
      </div>

      <Footer />
    </div>
  )
}

export default App