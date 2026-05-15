import { StrictMode } from 'react';
import App from './App.jsx';
import './index.css';

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CVStoreProvider } from './store/cvStore'


const originalFetch = window.fetch
let isRedirecting = false

window.fetch = async function (...args) {
  const res = await originalFetch(...args)
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url ?? ''
  const isLogout = url.includes('/auth/logout')

  if (res.status === 401 && !isRedirecting && !isLogout) {
    isRedirecting = true
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    window.location.href = '/'
  }

  return res
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CVStoreProvider>
      <App />
    </CVStoreProvider>
  </BrowserRouter>
)