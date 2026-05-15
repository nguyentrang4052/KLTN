import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../utils/auth'

const API = 'http://localhost:3000/api'
const WS = 'http://localhost:3000'

export function useNotifications() {
    const [notifications, setNotifications] = useState([])
    const socketRef = useRef(null)

    const fetchNotifications = async () => {
        const token = getToken()
        if (!token) return
        try {
            const res = await fetch(`${API}/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setNotifications(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('[Notif] fetch error:', err)
        }
    }

    // useEffect(() => {
    //     const token = getToken()
    //     if (!token) return

    //     fetchNotifications()

    //     socketRef.current = io(`${WS}/notifications`, {
    //         auth: { token },
    //         transports: ['websocket'],
    //     })

    //     socketRef.current.on('notification', (notif) => {
    //         setNotifications((prev) => [notif, ...prev])
    //     })

    //     socketRef.current.on('connect_error', (err) => {
    //         console.error('[WS] connect error:', err.message)
    //     })

    //     return () => {
    //         socketRef.current?.disconnect()
    //     }
    // }, [])
    useEffect(() => {
        const init = () => {
            const token = getToken()
            if (!token) return
            if (socketRef.current?.connected) return

            socketRef.current?.disconnect()

            fetchNotifications()

            const socket = io(`${WS}/notifications`, {
                auth: { token },
                transports: ['websocket'],
            })
            socketRef.current = socket

            socket.on('notification', (notif) => {
                setNotifications((prev) => [notif, ...prev])
            })

            socket.on('connect_error', (err) => {
                console.error('[WS] connect error:', err.message)
            })
        }

        init()

        window.addEventListener('tokenChanged', init)

        return () => {
            window.removeEventListener('tokenChanged', init)
            socketRef.current?.disconnect()
        }
    }, [])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const markAsRead = async (id) => {
        const token = getToken()
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
        await fetch(`${API}/notifications/${id}/read`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        })
    }

    const markAllAsRead = async () => {
        const token = getToken()
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        await fetch(`${API}/notifications/read-all`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
        })
    }

    const deleteOne = async (id) => {
        const token = getToken()
        try {
            const res = await fetch(`${API}/notifications/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                setNotifications((prev) => prev.filter((n) => n.id !== id))
            } else {
                console.error('[Notif] delete failed:', res.status)
            }
        } catch (err) {
            console.error('[Notif] delete error:', err)
        }
    }

    return { notifications, unreadCount, markAsRead, markAllAsRead, deleteOne, refetch: fetchNotifications }
}