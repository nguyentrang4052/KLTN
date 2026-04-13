// src/store/cvStore.js
import { createContext, useContext, useState } from 'react'

const CVContext = createContext(null)

const DEFAULT_DATA = (templateId) => ({
    templateId,
    name: 'CV mới',
    completeness: 0,
    status: 'draft',
    views: 0,
    downloads: 0,
    updatedAt: 'Vừa tạo',
    personal: { fullName: '', jobTitle: '', email: '', phone: '', address: '', linkedin: '', github: '', avatar: '' },
    summary: { summary: '' },
    experience: [{ company: '', position: '', startDate: '', endDate: '', desc: '' }],
    education: [{ school: '', degree: '', year: '' }],
    skills: { skills: '' },
})

export function CVStoreProvider({ children }) {
    const [cvList, setCvList] = useState([])
    const [editingId, setEditingId] = useState(null)

    const createCV = (template) => {
        const newCV = {
            id: Date.now(),
            ...DEFAULT_DATA(template.id),
            name: `CV ${template.name}`,
            template: template.style,
            color: template.color,
            previewBg: template.previewBg,
            htmlPath: template.htmlPath,
        }
        setCvList(prev => [...prev, newCV])
        return newCV.id
    }

    const updateCV = (id, sectionKey, data) => {
        setCvList(prev => prev.map(cv => {
            if (cv.id !== id) return cv
            const updated = { ...cv, [sectionKey]: data, updatedAt: 'Vừa xong' }
            updated.completeness = calcCompleteness(updated)
            return updated
        }))
    }

    const deleteCV = (id) => setCvList(prev => prev.filter(cv => cv.id !== id))

    const getCV = (id) => cvList.find(cv => cv.id === id)

    return (
        <CVContext.Provider value={{ cvList, editingId, setEditingId, createCV, updateCV, deleteCV, getCV }}>
            {children}
        </CVContext.Provider>
    )
}

export const useCVStore = () => useContext(CVContext)

function calcCompleteness(cv) {
    const checks = [
        cv.personal?.fullName, cv.personal?.email, cv.personal?.phone,
        cv.personal?.avatar, cv.summary?.summary,
        cv.experience?.[0]?.company, cv.education?.[0]?.school,
        cv.skills?.skills, cv.personal?.linkedin
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}