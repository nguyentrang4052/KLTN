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

function App() {
  const path = window.location.pathname

  const location = useLocation()

  const HIDE_HEADER_ROUTES = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/oauth-callback"
  ]

  const hideHeader = HIDE_HEADER_ROUTES.includes(location.pathname)

  return (
    <div className="app">
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