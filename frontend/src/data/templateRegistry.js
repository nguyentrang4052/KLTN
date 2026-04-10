// src/data/templateRegistry.js

export const TEMPLATES = [
    // Thêm vào templateRegistry.js - ví dụ hàm injectData cụ thể cho Technology Specialist

    {
        id: 'technology-specialist',
        name: 'Technology Specialist',
        style: 'Modern · Neon Edge',
        htmlPath: '/templates/Technology Specialist CV.html',
        thumbnail: '/templates/thumbs/tech-specialist.png',
        color: '#C0412A',
        previewBg: 'linear-gradient(135deg,#1C1510,#2A1A10)',

        schema: {
            personal: {
                label: 'Thông tin cá nhân',
                fields: [
                    { key: 'fullName', label: 'Họ và tên', type: 'text' },
                    { key: 'jobTitle', label: 'Chức danh', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' },
                    { key: 'phone', label: 'Điện thoại', type: 'tel' },
                    { key: 'address', label: 'Địa chỉ', type: 'text' },
                    { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
                    { key: 'github', label: 'GitHub URL', type: 'url' },
                    { key: 'avatar', label: 'Ảnh đại diện', type: 'image' },
                ]
            },
            summary: {
                label: 'Tóm tắt nghề nghiệp',
                fields: [
                    { key: 'summary', label: 'Giới thiệu bản thân', type: 'textarea' }
                ]
            },
            experience: {
                label: 'Kinh nghiệm làm việc',
                repeatable: true,
                fields: [
                    { key: 'company', label: 'Công ty', type: 'text' },
                    { key: 'position', label: 'Vị trí', type: 'text' },
                    { key: 'startDate', label: 'Từ tháng/năm', type: 'text' },
                    { key: 'endDate', label: 'Đến tháng/năm', type: 'text' },
                    { key: 'desc', label: 'Mô tả công việc', type: 'textarea' },
                ]
            },
            education: {
                label: 'Học vấn',
                repeatable: true,
                fields: [
                    { key: 'school', label: 'Trường', type: 'text' },
                    { key: 'degree', label: 'Bằng cấp', type: 'text' },
                    { key: 'year', label: 'Năm tốt nghiệp', type: 'text' },
                ]
            },
            skills: {
                label: 'Kỹ năng',
                fields: [
                    { key: 'skills', label: 'Danh sách kỹ năng (mỗi dòng 1 kỹ năng)', type: 'textarea' }
                ]
            },
        },

        injectData: (html, data) => {
            let result = html

            // Thay thế placeholders
            result = result.replace(/{{fullName}}/g, data.personal?.fullName || '')
            result = result.replace(/{{jobTitle}}/g, data.personal?.jobTitle || '')
            result = result.replace(/{{email}}/g, data.personal?.email || '')
            result = result.replace(/{{phone}}/g, data.personal?.phone || '')
            result = result.replace(/{{linkedin}}/g, data.personal?.linkedin || '')
            result = result.replace(/{{github}}/g, data.personal?.github || '')
            result = result.replace(/{{location}}/g, data.personal?.location || '')
            result = result.replace(/{{summary}}/g, data.summary?.summary || '')

            // Experience - giữ nguyên HTML structure nếu chưa có data
            if (data.experience && data.experience[0]) {
                const exp = data.experience[0]
                result = result.replace(/{{position}}/g, exp.position || '')
                result = result.replace(/{{company}}/g, exp.company || '')
                result = result.replace(/{{startDate}}/g, exp.startDate || '')
                result = result.replace(/{{endDate}}/g, exp.endDate || '')
                result = result.replace(/{{duration}}/g, `${exp.startDate || ''} - ${exp.endDate || ''}`)
                result = result.replace(/{{desc}}/g, exp.desc || '')
            }

            return result
        }

    },

   
     {
        id: 'template-moi',
        name: 'Template Mới',
        style: 'Tối giản',
        htmlPath: '/templates/simple.html',
        previewBg: 'white',
        defaultThemeColor: 'white',
        defaultFont: 'Inter',
        schema: {
            personal: { label: 'Thông tin', max: 1 },
            summary: { label: 'Giới thiệu', max: 1 },
            experience: { label: 'Kinh nghiệm', repeatable: true },
            education: { label: 'Học vấn', repeatable: true },
            skills: { label: 'Kỹ năng', repeatable: true },
            // Template này không có projects, certifications...
        }
    }
]

// Helper: flatten nested data thành { 'personal.fullName': 'Nguyen Van A', ... }
function flattenData(data, prefix = '') {
    const out = {}
    for (const [k, v] of Object.entries(data)) {
        const fullKey = prefix ? `${prefix}.${k}` : k
        if (Array.isArray(v)) {
            v.forEach((item, i) => {
                Object.assign(out, flattenData(item, `${fullKey}[${i}]`))
            })
        } else if (typeof v === 'object' && v !== null) {
            Object.assign(out, flattenData(v, fullKey))
        } else {
            out[fullKey] = v
        }
    }
    return out
}

export const getTemplate = (id) => TEMPLATES.find(t => t.id === id)