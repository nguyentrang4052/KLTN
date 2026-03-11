import { useState } from 'react'
import './App.css'
import LandingScreen from './components/screens/LandingScreen/LandingScreen'
import DashboardScreen from './components/screens/DashboardScreen/DashboardScreen'
import JobSearchScreen from './components/screens/JobSearchScreen/JobSearchScreen'
import JobDetailScreen from './components/screens/JobDetailScreen/JobDetailScreen'
import AutoApplyScreen from './components/screens/AutoApplyScreen/AutoApplyScreen'
import CVBuilderScreen from './components/screens/CVBuilderScreen/CVBuilderScreen'
import ApplicationsScreen from './components/screens/ApplicationsScreen/ApplicationsScreen'
import ProfileScreen from './components/screens/ProfileScreen/ProfileScreen'
import NotificationsScreen from './components/screens/NotificationsScreen/NotificationsScreen'
import Footer from './components/layout/Footer/Footer'
import PublicScreen from './components/screens/PublicScreen/PublicScreen'
import ScreenNav from './components/layout/ScreenNav/ScreenNav'

function App() {
  const [activeScreen, setActiveScreen] = useState('s1')

  const screens = {
    s1: <LandingScreen onNavigate={setActiveScreen}/>,
    s2: <DashboardScreen onNavigate={setActiveScreen}/>,
    s3: <JobSearchScreen onNavigate={setActiveScreen}/>,
    s4: <JobDetailScreen onNavigate={setActiveScreen}/>,
    s5: <AutoApplyScreen onNavigate={setActiveScreen}/>,
    s6: <CVBuilderScreen onNavigate={setActiveScreen}/>,
    s7: <ApplicationsScreen onNavigate={setActiveScreen}/>,
    s8: <ProfileScreen onNavigate={setActiveScreen}/>,
    s9: <NotificationsScreen onNavigate={setActiveScreen}/>,
    s10: <PublicScreen/>
  }

  return (
    <div className="app">
      {/* <ScreenNav activeScreen={activeScreen} onScreenChange={setActiveScreen} /> */}
      <div className="screen-container">
        {screens[activeScreen]}
      </div>
      <Footer></Footer>
    </div>
  )
}

export default App