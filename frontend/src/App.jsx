import { useState } from 'react'
import './App.css'
import ScreenNav from './components/layout/ScreenNav/ScreenNav'
import LandingScreen from './components/screens//LandingScreen/LandingScreen'
import DashboardScreen from './components/screens/DashboardScreen/DashboardScreen'
import JobSearchScreen from './components/screens/JobSearchScreen/JobSearchScreen'
import JobDetailScreen from './components/screens/JobDetailScreen/JobDetailScreen'
import AutoApplyScreen from './components/screens/AutoApplyScreen/AutoApplyScreen'
import CVBuilderScreen from './components/screens/CVBuilderScreen/CVBuilderScreen'
import ApplicationsScreen from './components/screens/ApplicationsScreen/ApplicationsScreen'
import ProfileScreen from './components/screens/ProfileScreen/ProfileScreen'
import NotificationsScreen from './components/screens/NotificationsScreen/NotificationsScreen'

function App() {
  const [activeScreen, setActiveScreen] = useState('s1')

  const screens = {
    s1: <LandingScreen onNavigate={setActiveScreen} />,
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