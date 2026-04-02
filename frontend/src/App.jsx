import { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import LandingScreen from './components/screens/LandingScreen/LandingScreen'
import DashboardScreen from './components/screens/DashboardScreen/DashboardScreen'
import HomeScreen from './components/screens/HomeScreen/HomeScreen'
import JobDetailScreen from './components/screens/JobDetailScreen/JobDetailScreen'
import CVBuilderScreen from './components/screens/CVBuilderScreen/CVBuilderScreen'
// import ApplicationsScreen from './components/screens/ApplicationsScreen/ApplicationsScreen'
import ProfileScreen from './components/screens/ProfileScreen/ProfileScreen'
import NotificationsScreen from './components/screens/NotificationsScreen/NotificationsScreen'
import JobSearchScreen from './components/screens/JobSearchScreen/JobSearchScreen'
import CompaniesScreen from './components/screens/CompaniesScreen/CompaniesScreen'
import CompanyDetailScreen from './components/screens/CompanyDetailScreen/CompanyDetailScreen'
import AboutScreen from './components/screens/AboutScreen/AboutScreen'
import AccountSettingScreen from './components/screens/AccountSettingScreen/AccountSettingScreen'
import SavedJobScreen from './components/screens/SavedJobScreen/SavedJobScreen'
import MyCVScreen from './components/screens/MyCVScreen/MyCVScreen'
import AIScreen from './components/screens/AIScreen/AIScreen'
import PricingScreen from './components/screens/PricingScreen/PricingScreen'
import CheckoutScreen from './components/screens/CheckoutScreen/CheckoutScreen'
import PaymentScreen from './components/screens/PaymentScreen/PaymentScreen'

import Login from './components/Authentication/Login/Login'
import Register from './components/Authentication/Register/Register'
import ForgotPassword from './components/Authentication/ForgotPassword/ForgotPassword'
import OAuthCallback from './components/Authentication/OAuthCallback/OAuthCallback'

import AdminLayout from './components/Admin/AdminLayout/AdminLayout'
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard'
import AdminUsers from './components/Admin/AdminUsers/AdminUsers'
import AdminCategories from './components/Admin/AdminCategories/AdminCategories'
import AdminPackages from './components/Admin/AdminPackages/AdminPackages'

import { useParams, useNavigate } from 'react-router-dom'
import { getToken } from './utils/auth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

function CompanyDetailScreenRouteForJobs() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  return (
    <CompanyDetailScreen
      company={{ id: Number(id) }}
      onBack={() => navigate('/jobs')}
      token={token}
      jobBasePath={`/jobs/companies/${id}/jobs`}
    />
  )
}

function CompanyDetailScreenRouteForCompanies() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  return (
    <CompanyDetailScreen
      company={{ id: Number(id) }}
      onBack={() => navigate(-1)}
      token={token}
      jobBasePath={`/companies/${id}/jobs`}
    />
  )
}

function CompanyDetailScreenRouteForHome() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  return (
    <CompanyDetailScreen
      company={{ id: Number(id) }}
      onBack={() => navigate(-1)}
      token={token}
      jobBasePath={`/home/companies/${id}/jobs`}
    />
  )
}

function JobDetailScreenRoute({ backPath, companyBasePath }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  return (
    <JobDetailScreen
      jobId={Number(id)}
      onBack={() => navigate(backPath)}
      token={token}
      onCompanyClick={(companyID) => navigate(`${companyBasePath}/${companyID}`)}
    />
  )
}


function JobDetailForSavedJobs({ backPath, savedJobPath }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  return (
    <JobDetailScreen
      jobID={Number(id)}
      onBack={() => navigate(backPath)}
      token={token}
      onSavedJobClick={(jobID) => navigate(`${savedJobPath}${jobID}`)}
    />
  )
}


function App() {
  const location = useLocation()

  const HIDE_HEADER_ROUTES = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/oauth-callback',
    '/admin',
    '/admin/users',
    '/admin/categories',
    '/admin/packages',
  ]

  const hideHeader =
    HIDE_HEADER_ROUTES.includes(location.pathname) ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/jobs/companies/') ||
    location.pathname.startsWith('/home/companies/') ||
    location.pathname.startsWith('/companies/') ||
    location.pathname.startsWith('/home/job/') ||
    location.pathname.startsWith('/jobs/job/')

  return (
    <div className="app">
      {!hideHeader && <Header />}

      <div className="screen-container">
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/about" element={<AboutScreen />} />

          <Route path="/jobs" element={<JobSearchScreen />} />
          <Route path="/jobs/job/:id" element={
            <JobDetailScreenRoute backPath="/jobs" companyBasePath="/jobs/companies" />
          } />

          <Route path="/jobs/companies/:id" element={<CompanyDetailScreenRouteForJobs />} />

          <Route path="/jobs/companies/:companyId/jobs/:id" element={
            <JobDetailScreenRoute backPath="/jobs" companyBasePath="/jobs/companies" />
          } />

          <Route path="/companies" element={<CompaniesScreen />} />
          <Route path="/companies/:id" element={<CompanyDetailScreenRouteForCompanies />} />

          <Route path="/companies/:companyId/jobs/:id" element={
            <JobDetailScreenRoute backPath="/companies" companyBasePath="/companies" />
          } />


          <Route
            path="/saved-jobs"
            element={
              <ProtectedRoute>
                <SavedJobScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved-jobs/job/:id"
            element={
              <JobDetailForSavedJobs
                backPath="/saved-jobs"
                savedJobPath="/saved-jobs/job/"
              />
            }
          />

          <Route path="/home" element={
            <ProtectedRoute><HomeScreen /></ProtectedRoute>
          } />

          <Route path="/home/job/:id" element={
            <ProtectedRoute>
              <JobDetailScreenRoute backPath="/home" companyBasePath="/home/companies" />
            </ProtectedRoute>
          } />
          <Route path="/home/companies/:id" element={
            <ProtectedRoute><CompanyDetailScreenRouteForHome /></ProtectedRoute>
          } />
          <Route path="/home/companies/:companyId/jobs/:id" element={
            <ProtectedRoute>
              <JobDetailScreenRoute backPath="/home" companyBasePath="/home/companies" />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardScreen /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfileScreen /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><AccountSettingScreen /></ProtectedRoute>
          } />

          {/* <Route path="/applications" element={
            <ProtectedRoute><ApplicationsScreen /></ProtectedRoute>
          } /> */}
          <Route path="/cv-builder" element={
            <ProtectedRoute><CVBuilderScreen /></ProtectedRoute>
          } />

          <Route path="/my-cv" element={
            <ProtectedRoute><MyCVScreen/></ProtectedRoute>
          } />

          <Route path="/ai-assistant" element={
            <ProtectedRoute><AIScreen/></ProtectedRoute>
          } />

          <Route path="/services" element={
            <ProtectedRoute><PricingScreen/></ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute><CheckoutScreen /></ProtectedRoute>
          } />

          <Route path="/payment" element={
            <ProtectedRoute><PaymentScreen /></ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute><NotificationsScreen /></ProtectedRoute>
          } />


          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="packages" element={<AdminPackages />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App