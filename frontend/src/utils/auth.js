export function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function getUser() {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
}

export function clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
}