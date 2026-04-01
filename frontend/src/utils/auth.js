export function getToken() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const now = Math.floor(Date.now() / 1000)

        if (payload.exp && now >= payload.exp) {
            clearAuth()
            return null
        }

        return token
    } catch {
        return token
    }
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

export async function fetchMe(token) {
    const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Không thể lấy thông tin người dùng.');
    const data = await res.json();

    const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(data));

    return data;
}

export async function logoutRequest() {
    const token = getToken();
    if (token) {
        try {
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch { /* empty */ }
    }
    clearAuth();
}