// // src/components/screens/MyCVScreen/MyCVScreen.jsx
// import { useState, useRef } from 'react'
// import './MyCVScreen.css'

// const MY_CVS = [
//     { id: 1, name: 'CV Senior React Developer', template: 'Modern · Neon Edge', updatedAt: 'Hôm nay, 14:32', completeness: 92, views: 18, downloads: 3, status: 'active', color: '#C0412A', previewBg: 'linear-gradient(135deg,#1C1510,#2A1A10)', thumbnail: 'F' },
//     { id: 2, name: 'CV Full-stack Developer', template: 'Tech · Terminal', updatedAt: '2 ngày trước', completeness: 78, views: 6, downloads: 1, status: 'draft', color: '#0D47A1', previewBg: 'linear-gradient(135deg,#0D1117,#161B22)', thumbnail: 'F' },
//     { id: 3, name: 'CV DevOps Engineer', template: 'Classic · Harvard', updatedAt: '1 tuần trước', completeness: 65, views: 2, downloads: 0, status: 'draft', color: '#2E6040', previewBg: 'linear-gradient(135deg,#1A3A2A,#2A3A1A)', thumbnail: 'F' },
// ]

// const UPLOADED_CVS = [
//     { id: 'u1', name: 'CV_TranVanA_2025.pdf', size: '1.2 MB', uploadedAt: '3 ngày trước', atsScore: 76 },
//     { id: 'u2', name: 'CV_English_Version.pdf', size: '980 KB', uploadedAt: '1 tháng trước', atsScore: 68 },
// ]

// const TIPS = [
//     { icon: '📸', title: 'Thêm ảnh đại diện', desc: 'CV có ảnh tăng 40% tỷ lệ được gọi phỏng vấn.', done: true },
//     { icon: '🎯', title: 'Thêm kỹ năng', desc: 'Hãy thêm ít nhất 5–8 kỹ năng phù hợp JD.', done: true },
//     { icon: '📊', title: 'Thêm số liệu thành tích', desc: 'Ví dụ: "Tăng hiệu suất API lên 40%"', done: false },
//     { icon: '🔗', title: 'Thêm LinkedIn / GitHub', desc: 'Nhà tuyển dụng muốn xem portfolio thực tế.', done: false },
//     { icon: '📝', title: 'Tóm tắt nghề nghiệp', desc: 'Viết 3–4 câu giới thiệu bản thân súc tích.', done: false },
// ]

// export default function MyCVScreen({ onNavigate }) {
//     const [activeTab, setActiveTab] = useState('my')
//     const [cvs, setCvs] = useState(MY_CVS)
//     const [uploads, setUploads] = useState(UPLOADED_CVS)
//     const [dragging, setDragging] = useState(false)
//     const [analyzing, setAnalyzing] = useState(null)
//     const [deleteModal, setDeleteModal] = useState(null)
//     const fileRef = useRef()

//     const handleDrop = (e) => {
//         e.preventDefault(); setDragging(false)
//         const files = Array.from(e.dataTransfer?.files || [])
//         handleFiles(files)
//     }

//     const handleFiles = (files) => {
//         const pdf = files.filter(f => f.name.endsWith('.pdf') || f.name.endsWith('.docx'))
//         if (!pdf.length) return
//         setAnalyzing(pdf[0].name)
//         setTimeout(() => {
//             setUploads(p => [{
//                 id: 'u' + Date.now(),
//                 name: pdf[0].name,
//                 size: (pdf[0].size / 1024).toFixed(0) + ' KB',
//                 uploadedAt: 'Vừa xong',
//                 atsScore: Math.floor(Math.random() * 20) + 65,
//             }, ...p])
//             setAnalyzing(null)
//             setActiveTab('upload')
//         }, 2000)
//     }

//     const completenessColor = (n) => n >= 85 ? '#2E6040' : n >= 60 ? '#D4820A' : '#C0412A'

//     return (
//         <div className="mc-page">

//             {/* Header */}
//             <div className="mc-header">
//                 <div className="mc-header-inner">
//                     <div>
//                         <h1 className="mc-title">CV của tôi</h1>
//                         <p className="mc-sub">Quản lý và tối ưu hồ sơ xin việc của bạn</p>
//                     </div>
//                     <div className="mc-header-actions">
//                         <button className="mc-upload-btn-sm" onClick={() => fileRef.current?.click()}>
//                             ⬆ Tải lên CV
//                         </button>
//                         <button className="mc-create-btn" onClick={() => onNavigate?.('s17')}>
//                             ✦ Tạo CV mới
//                         </button>
//                         <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => handleFiles(Array.from(e.target.files))} />
//                     </div>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="mc-tabs-bar">
//                 <div className="mc-tabs-inner">
//                     <button className={`mc-tab${activeTab === 'my' ? ' active' : ''}`} onClick={() => setActiveTab('my')}>
//                         📄 CV đã tạo <span className="mc-tab-ct">{cvs.length}</span>
//                     </button>
//                     <button className={`mc-tab${activeTab === 'upload' ? ' active' : ''}`} onClick={() => setActiveTab('upload')}>
//                         ⬆ CV tải lên <span className="mc-tab-ct">{uploads.length}</span>
//                     </button>
//                     <button className={`mc-tab${activeTab === 'tips' ? ' active' : ''}`} onClick={() => setActiveTab('tips')}>
//                         💡 Gợi ý cải thiện
//                         {TIPS.filter(t => !t.done).length > 0 && <span className="mc-tab-badge">{TIPS.filter(t => !t.done).length}</span>}
//                     </button>
//                 </div>
//             </div>

//             <div className="mc-body">

//                 {/* ── Tab: My CVs ──────────────────────────────── */}
//                 {activeTab === 'my' && (
//                     <div>
//                         <div className="mc-cv-grid">
//                             {cvs.map(cv => (
//                                 <div key={cv.id} className={`mc-cv-card${cv.status === 'active' ? ' active' : ''}`}>
//                                     {cv.status === 'active' && <div className="mc-active-badge">✓ Đang dùng</div>}

//                                     {/* Preview */}
//                                     <div className="mc-cv-preview" style={{ background: cv.previewBg }}>
//                                         <div className="mc-cv-preview-header">
//                                             <div className="mc-cv-preview-av" style={{ background: cv.color }}>{cv.thumbnail}</div>
//                                             <div>
//                                                 <div className="mc-cv-preview-bar long" />
//                                                 <div className="mc-cv-preview-bar" />
//                                             </div>
//                                         </div>
//                                         <div className="mc-cv-preview-lines">
//                                             <div className="mc-cv-preview-label" style={{ background: cv.color }} />
//                                             <div className="mc-cv-preview-bar w80" />
//                                             <div className="mc-cv-preview-bar w60" />
//                                             <div className="mc-cv-preview-bar w70" />
//                                             <div className="mc-cv-preview-label" style={{ background: cv.color }} />
//                                             <div className="mc-cv-preview-bar w90" />
//                                             <div className="mc-cv-preview-bar w55" />
//                                         </div>

//                                         {/* Hover overlay */}
//                                         <div className="mc-cv-overlay">
//                                             <button className="mc-ov-btn primary" onClick={() => onNavigate?.('s6')}>✏ Chỉnh sửa</button>
//                                             <button className="mc-ov-btn">👁 Xem trước</button>
//                                         </div>
//                                     </div>

//                                     <div className="mc-cv-body">
//                                         <div className="mc-cv-name">{cv.name}</div>
//                                         <div className="mc-cv-template">{cv.template}</div>

//                                         {/* Completeness */}
//                                         <div className="mc-completeness">
//                                             <div className="mc-comp-row">
//                                                 <span className="mc-comp-label">Độ hoàn thiện</span>
//                                                 <span className="mc-comp-n" style={{ color: completenessColor(cv.completeness) }}>{cv.completeness}%</span>
//                                             </div>
//                                             <div className="mc-comp-bar-bg">
//                                                 <div className="mc-comp-bar" style={{ width: `${cv.completeness}%`, background: completenessColor(cv.completeness) }} />
//                                             </div>
//                                         </div>

//                                         {/* Stats */}
//                                         <div className="mc-cv-stats">
//                                             <div className="mc-cv-stat"><span className="mc-cv-stat-n">{cv.views}</span><span className="mc-cv-stat-l">Lượt xem</span></div>
//                                             <div className="mc-cv-stat"><span className="mc-cv-stat-n">{cv.downloads}</span><span className="mc-cv-stat-l">Tải về</span></div>
//                                             <div className="mc-cv-stat"><span className="mc-cv-stat-n">{cv.updatedAt}</span><span className="mc-cv-stat-l">Cập nhật</span></div>
//                                         </div>
//                                     </div>

//                                     <div className="mc-cv-foot">
//                                         <button className="mc-cv-action-btn" onClick={() => onNavigate?.('s6')}>✏ Chỉnh sửa</button>
//                                         <button className="mc-cv-action-btn">⬇ Tải PDF</button>
//                                         <button className="mc-cv-action-btn">🔗 Chia sẻ</button>
//                                         <button className="mc-cv-action-btn danger" onClick={() => setDeleteModal(cv.id)}>🗑</button>
//                                     </div>
//                                 </div>
//                             ))}

//                             {/* Add new card */}
//                             <div className="mc-cv-card mc-cv-add" onClick={() => onNavigate?.('s17')}>
//                                 <div className="mc-cv-add-inner">
//                                     <div className="mc-cv-add-ico">✦</div>
//                                     <div className="mc-cv-add-title">Tạo CV mới</div>
//                                     <div className="mc-cv-add-sub">Chọn từ 50+ mẫu đẹp</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Tab: Uploaded CVs ─────────────────────────── */}
//                 {activeTab === 'upload' && (
//                     <div>
//                         {/* Drop zone */}
//                         <div
//                             className={`mc-dropzone${dragging ? ' dragover' : ''}`}
//                             onDragOver={e => { e.preventDefault(); setDragging(true) }}
//                             onDragLeave={() => setDragging(false)}
//                             onDrop={handleDrop}
//                             onClick={() => fileRef.current?.click()}
//                         >
//                             {analyzing ? (
//                                 <div className="mc-analyzing">
//                                     <div className="mc-analyzing-spinner" />
//                                     <div className="mc-analyzing-title">Đang phân tích CV...</div>
//                                     <div className="mc-analyzing-sub">AI đang đọc và chấm điểm ATS cho "{analyzing}"</div>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="mc-dz-ico">📎</div>
//                                     <div className="mc-dz-title">{dragging ? 'Thả file vào đây!' : 'Kéo & thả hoặc nhấn để tải lên CV'}</div>
//                                     <div className="mc-dz-sub">Hỗ trợ PDF, DOCX · Tối đa 5MB · AI sẽ chấm điểm ATS tự động</div>
//                                     <button className="mc-dz-btn">Chọn file từ máy</button>
//                                 </>
//                             )}
//                         </div>

//                         {/* Uploaded list */}
//                         {uploads.length > 0 && (
//                             <div className="mc-upload-list">
//                                 <div className="mc-upload-list-title">CV đã tải lên</div>
//                                 {uploads.map(u => (
//                                     <div key={u.id} className="mc-upload-row">
//                                         <div className="mc-upload-ico">📄</div>
//                                         <div className="mc-upload-info">
//                                             <div className="mc-upload-name">{u.name}</div>
//                                             <div className="mc-upload-meta">{u.size} · Tải lên {u.uploadedAt}</div>
//                                         </div>
//                                         <div className="mc-ats-score">
//                                             <div className="mc-ats-n" style={{ color: u.atsScore >= 75 ? '#2E6040' : u.atsScore >= 60 ? '#D4820A' : '#C0412A' }}>{u.atsScore}</div>
//                                             <div className="mc-ats-l">ATS Score</div>
//                                         </div>
//                                         <div className="mc-upload-actions">
//                                             <button className="mc-ul-btn">⬇ Tải về</button>
//                                             <button className="mc-ul-btn">🔗 Dùng CV này</button>
//                                             <button className="mc-ul-btn danger">🗑</button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* ── Tab: Tips ─────────────────────────────────── */}
//                 {activeTab === 'tips' && (
//                     <div>
//                         <div className="mc-tips-header">
//                             <div className="mc-tips-score-card">
//                                 <div className="mc-tips-score-ring">
//                                     <svg viewBox="0 0 80 80" className="mc-ring-svg">
//                                         <circle cx="40" cy="40" r="34" fill="none" stroke="#EFE9DC" strokeWidth="8" />
//                                         <circle cx="40" cy="40" r="34" fill="none" stroke="#C0412A" strokeWidth="8"
//                                             strokeDasharray={`${2 * Math.PI * 34 * 0.92} ${2 * Math.PI * 34 * 0.08}`}
//                                             strokeDashoffset={2 * Math.PI * 34 * 0.25}
//                                             strokeLinecap="round" />
//                                     </svg>
//                                     <div className="mc-ring-inner"><span className="mc-ring-n">92%</span><span className="mc-ring-l">Độ HT</span></div>
//                                 </div>
//                                 <div>
//                                     <div className="mc-tips-score-title">CV Senior React Developer</div>
//                                     <div className="mc-tips-score-sub">Hoàn thiện {TIPS.filter(t => t.done).length}/{TIPS.length} mục</div>
//                                     <div className="mc-tips-score-bar-wrap">
//                                         <div className="mc-tips-bar-bg"><div className="mc-tips-bar" style={{ width: `${(TIPS.filter(t => t.done).length / TIPS.length) * 100}%` }} /></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="mc-tips-list">
//                             {TIPS.map((tip, i) => (
//                                 <div key={i} className={`mc-tip-row${tip.done ? ' done' : ''}`}>
//                                     <div className={`mc-tip-check${tip.done ? ' on' : ''}`}>{tip.done ? '✓' : ''}</div>
//                                     <div className="mc-tip-ico">{tip.icon}</div>
//                                     <div className="mc-tip-info">
//                                         <div className="mc-tip-title">{tip.title}</div>
//                                         <div className="mc-tip-desc">{tip.desc}</div>
//                                     </div>
//                                     {!tip.done && (
//                                         <button className="mc-tip-do-btn" onClick={() => onNavigate?.('s6')}>Làm ngay →</button>
//                                     )}
//                                     {tip.done && <span className="mc-tip-done-tag">✓ Hoàn thành</span>}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Delete modal */}
//             {deleteModal && (
//                 <div className="mc-modal-overlay" onClick={() => setDeleteModal(null)}>
//                     <div className="mc-modal" onClick={e => e.stopPropagation()}>
//                         <div className="mc-modal-ico">🗑️</div>
//                         <div className="mc-modal-title">Xoá CV này?</div>
//                         <div className="mc-modal-sub">Hành động này không thể hoàn tác.</div>
//                         <div className="mc-modal-foot">
//                             <button className="mc-modal-cancel" onClick={() => setDeleteModal(null)}>Huỷ</button>
//                             <button className="mc-modal-ok" onClick={() => { setCvs(p => p.filter(c => c.id !== deleteModal)); setDeleteModal(null) }}>Xoá</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }







// src/components/screens/MyCVScreen/MyCVScreen.jsx
import { useState, useRef } from 'react'
import { useCVStore } from '../../../store/cvStore'
import { TEMPLATES, getTemplate } from '../../../data/templateRegistry'
import { useNavigate } from 'react-router-dom'
import './CreatedCVScreen.css'

const UPLOADED_CVS = [
    { id: 'u1', name: 'CV_TranVanA_2025.pdf', size: '1.2 MB', uploadedAt: '3 ngày trước', atsScore: 76 },
    { id: 'u2', name: 'CV_English_Version.pdf', size: '980 KB', uploadedAt: '1 tháng trước', atsScore: 68 },
]

const TIPS = [
    { icon: '📸', title: 'Thêm ảnh đại diện', desc: 'CV có ảnh tăng 40% tỷ lệ được gọi phỏng vấn.', done: true },
    { icon: '🎯', title: 'Thêm kỹ năng', desc: 'Hãy thêm ít nhất 5–8 kỹ năng phù hợp JD.', done: true },
    { icon: '📊', title: 'Thêm số liệu thành tích', desc: 'Ví dụ: "Tăng hiệu suất API lên 40%"', done: false },
    { icon: '🔗', title: 'Thêm LinkedIn / GitHub', desc: 'Nhà tuyển dụng muốn xem portfolio thực tế.', done: false },
    { icon: '📝', title: 'Tóm tắt nghề nghiệp', desc: 'Viết 3–4 câu giới thiệu bản thân súc tích.', done: false },
]

// Modal preview HTML
function PreviewModal({ cv, onClose }) {
    const [htmlContent, setHtmlContent] = useState('')
    const template = getTemplate(cv.templateId)

    useState(() => {
        if (template && cv) {
            fetch(template.htmlPath)
                .then(r => r.text())
                .then(html => {
                    const injected = template.injectData(html, cv)
                    setHtmlContent(injected)
                })
        }
    }, [cv, template])

    return (
        <div className="mc-modal-overlay" onClick={onClose}>
            <div
                className="mc-modal"
                onClick={e => e.stopPropagation()}
                style={{ width: '80%', height: '90%', overflow: 'auto', background: '#fff' }}
            >
                <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Xem trước: {cv.name}</h3>
                    <button style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>✕</button>
                </div>
                <div style={{ padding: '20px' }}>
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
            </div>
        </div>
    )
}

export default function MyCVScreen({ onNavigate }) {
    const { cvList, setEditingId, deleteCV } = useCVStore()
    const [activeTab, setActiveTab] = useState('my')
    const [uploads, setUploads] = useState(UPLOADED_CVS)
    const [dragging, setDragging] = useState(false)
    const [analyzing, setAnalyzing] = useState(null)
    const [deleteModal, setDeleteModal] = useState(null)
    const [previewCV, setPreviewCV] = useState(null)
    const fileRef = useRef()
    const navigate = useNavigate()

    const handleEdit = (cv) => {
        setEditingId(cv.id)
        navigate(`/cv-editor/${cv.id}`)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const files = Array.from(e.dataTransfer?.files || [])
        handleFiles(files)
    }

    const handleFiles = (files) => {
        const pdf = files.filter(f => f.name.endsWith('.pdf') || f.name.endsWith('.docx'))
        if (!pdf.length) return
        setAnalyzing(pdf[0].name)
        setTimeout(() => {
            setUploads(p => [{
                id: 'u' + Date.now(),
                name: pdf[0].name,
                size: (pdf[0].size / 1024).toFixed(0) + ' KB',
                uploadedAt: 'Vừa xong',
                atsScore: Math.floor(Math.random() * 20) + 65,
            }, ...p])
            setAnalyzing(null)
            setActiveTab('upload')
        }, 2000)
    }

    const completenessColor = (n) => n >= 85 ? '#2E6040' : n >= 60 ? '#D4820A' : '#C0412A'

    const handleDelete = () => {
        if (deleteModal) {
            deleteCV(deleteModal)
            setDeleteModal(null)
        }
    }

    // Tính tips dựa trên CV đang active (CV đầu tiên hoặc CV có completeness cao nhất)
    const activeCV = cvList.length > 0 ? cvList.reduce((prev, current) => (prev.completeness > current.completeness) ? prev : current) : null

    return (
        <div className="mc-page">
            {/* Header */}
            <div className="mc-header">
                <div className="mc-header-inner">
                    <div>
                        {/* <h1 className="mc-title">CV của tôi</h1>
                        <p className="mc-sub">Quản lý và tối ưu hồ sơ xin việc của bạn</p> */}
                    </div>
                    <div className="mc-header-actions">
                        <button className="mc-upload-btn-sm" onClick={() => fileRef.current?.click()}>
                            ⬆ Tải lên CV
                        </button>
                        <button className="mc-create-btn" onClick={() => onNavigate?.('templatePicker')}>
                            ✦ Tạo CV mới
                        </button>
                        <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => handleFiles(Array.from(e.target.files))} />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mc-tabs-bar">
                <div className="mc-tabs-inner">
                    <button className={`mc-tab${activeTab === 'my' ? ' active' : ''}`} onClick={() => setActiveTab('my')}>
                        📄 CV đã tạo <span className="mc-tab-ct">{cvList.length}</span>
                    </button>
                    <button className={`mc-tab${activeTab === 'upload' ? ' active' : ''}`} onClick={() => setActiveTab('upload')}>
                        ⬆ CV tải lên <span className="mc-tab-ct">{uploads.length}</span>
                    </button>
                    <button className={`mc-tab${activeTab === 'tips' ? ' active' : ''}`} onClick={() => setActiveTab('tips')}>
                        💡 Gợi ý cải thiện
                        {TIPS.filter(t => !t.done).length > 0 && <span className="mc-tab-badge">{TIPS.filter(t => !t.done).length}</span>}
                    </button>
                </div>
            </div>

            <div className="mc-body">
                {/* ── Tab: My CVs ──────────────────────────────── */}
                {activeTab === 'my' && (
                    <div>
                        <div className="mc-cv-grid">
                            {cvList.map(cv => {
                                const template = getTemplate(cv.templateId) || {}
                                return (
                                    <div key={cv.id} className={`mc-cv-card${cv.status === 'active' ? ' active' : ''}`}>
                                        {cv.status === 'active' && <div className="mc-active-badge">✓ Đang dùng</div>}

                                        {/* Preview */}
                                        <div className="mc-cv-preview" style={{ background: cv.previewBg || template.previewBg }}>
                                            <div className="mc-cv-preview-header">
                                                <div className="mc-cv-preview-av" style={{ background: cv.color || template.color }}>{cv.personal?.fullName?.[0] || 'A'}</div>
                                                <div>
                                                    <div className="mc-cv-preview-bar long" />
                                                    <div className="mc-cv-preview-bar" />
                                                </div>
                                            </div>
                                            <div className="mc-cv-preview-lines">
                                                <div className="mc-cv-preview-label" style={{ background: cv.color || template.color }} />
                                                <div className="mc-cv-preview-bar w80" />
                                                <div className="mc-cv-preview-bar w60" />
                                                <div className="mc-cv-preview-bar w70" />
                                                <div className="mc-cv-preview-label" style={{ background: cv.color || template.color }} />
                                                <div className="mc-cv-preview-bar w90" />
                                                <div className="mc-cv-preview-bar w55" />
                                            </div>

                                            {/* Hover overlay */}
                                            <div className="mc-cv-overlay">
                                                <button className="mc-ov-btn primary" onClick={() => handleEdit(cv)}>✏ Chỉnh sửa</button>
                                                <button className="mc-ov-btn" onClick={() => setPreviewCV(cv)}>👁 Xem trước</button>
                                            </div>
                                        </div>

                                        <div className="mc-cv-body">
                                            <div className="mc-cv-name">{cv.name}</div>
                                            <div className="mc-cv-template">{cv.template || template.style}</div>

                                            {/* Completeness */}
                                            <div className="mc-completeness">
                                                <div className="mc-comp-row">
                                                    <span className="mc-comp-label">Độ hoàn thiện</span>
                                                    <span className="mc-comp-n" style={{ color: completenessColor(cv.completeness) }}>{cv.completeness}%</span>
                                                </div>
                                                <div className="mc-comp-bar-bg">
                                                    <div className="mc-comp-bar" style={{ width: `${cv.completeness}%`, background: completenessColor(cv.completeness) }} />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="mc-cv-stats">
                                                <div className="mc-cv-stat"><span className="mc-cv-stat-n">{cv.views}</span><span className="mc-cv-stat-l">Lượt xem</span></div>
                                                <div className="mc-cv-stat"><span className="mc-cv-stat-n">{cv.downloads}</span><span className="mc-cv-stat-l">Tải về</span></div>
                                                <div className="mc-cv-stat"><span className="mc-cv-stat-n">{cv.updatedAt}</span><span className="mc-cv-stat-l">Cập nhật</span></div>
                                            </div>
                                        </div>

                                        <div className="mc-cv-foot">
                                            <button className="mc-cv-action-btn" onClick={() => handleEdit(cv)}>✏ Chỉnh sửa</button>
                                            <button className="mc-cv-action-btn">⬇ Tải PDF</button>
                                            <button className="mc-cv-action-btn">🔗 Chia sẻ</button>
                                            <button className="mc-cv-action-btn danger" onClick={() => setDeleteModal(cv.id)}>🗑</button>
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Add new card */}
                            <div className="mc-cv-card mc-cv-add" onClick={() => navigate('/cv-templates')}>
                                <div className="mc-cv-add-inner">
                                    <div className="mc-cv-add-ico">✦</div>
                                    <div className="mc-cv-add-title">Tạo CV mới</div>
                                    <div className="mc-cv-add-sub">Chọn từ {TEMPLATES.length}+ mẫu đẹp</div>
                                </div>
                            </div>
                        
                        </div>

                        {cvList.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                                <h3>Chưa có CV nào</h3>
                                <p>Hãy tạo CV mới để bắt đầu</p>
                                <button
                                    className="mc-create-btn"
                                    onClick={() => onNavigate?.('templatePicker')}
                                    style={{ marginTop: '16px' }}
                                >
                                    ✦ Tạo CV ngay
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab: Uploaded CVs ─────────────────────────── */}
                {activeTab === 'upload' && (
                    <div>
                        {/* Drop zone */}
                        <div
                            className={`mc-dropzone${dragging ? ' dragover' : ''}`}
                            onDragOver={e => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                        >
                            {analyzing ? (
                                <div className="mc-analyzing">
                                    <div className="mc-analyzing-spinner" />
                                    <div className="mc-analyzing-title">Đang phân tích CV...</div>
                                    <div className="mc-analyzing-sub">AI đang đọc và chấm điểm ATS cho "{analyzing}"</div>
                                </div>
                            ) : (
                                <>
                                    <div className="mc-dz-ico">📎</div>
                                    <div className="mc-dz-title">{dragging ? 'Thả file vào đây!' : 'Kéo & thả hoặc nhấn để tải lên CV'}</div>
                                    <div className="mc-dz-sub">Hỗ trợ PDF, DOCX · Tối đa 5MB · AI sẽ chấm điểm ATS tự động</div>
                                    <button className="mc-dz-btn">Chọn file từ máy</button>
                                </>
                            )}
                        </div>

                        {/* Uploaded list */}
                        {uploads.length > 0 && (
                            <div className="mc-upload-list">
                                <div className="mc-upload-list-title">CV đã tải lên</div>
                                {uploads.map(u => (
                                    <div key={u.id} className="mc-upload-row">
                                        <div className="mc-upload-ico">📄</div>
                                        <div className="mc-upload-info">
                                            <div className="mc-upload-name">{u.name}</div>
                                            <div className="mc-upload-meta">{u.size} · Tải lên {u.uploadedAt}</div>
                                        </div>
                                        <div className="mc-ats-score">
                                            <div className="mc-ats-n" style={{ color: u.atsScore >= 75 ? '#2E6040' : u.atsScore >= 60 ? '#D4820A' : '#C0412A' }}>{u.atsScore}</div>
                                            <div className="mc-ats-l">ATS Score</div>
                                        </div>
                                        <div className="mc-upload-actions">
                                            <button className="mc-ul-btn">⬇ Tải về</button>
                                            <button className="mc-ul-btn">🔗 Dùng CV này</button>
                                            <button className="mc-ul-btn danger">🗑</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab: Tips ─────────────────────────────────── */}
                {activeTab === 'tips' && (
                    <div>
                        <div className="mc-tips-header">
                            <div className="mc-tips-score-card">
                                <div className="mc-tips-score-ring">
                                    <svg viewBox="0 0 80 80" className="mc-ring-svg">
                                        <circle cx="40" cy="40" r="34" fill="none" stroke="#EFE9DC" strokeWidth="8" />
                                        <circle cx="40" cy="40" r="34" fill="none" stroke="#C0412A" strokeWidth="8"
                                            strokeDasharray={`${2 * Math.PI * 34 * (activeCV?.completeness || 92) / 100} ${2 * Math.PI * 34 * (1 - (activeCV?.completeness || 92) / 100)}`}
                                            strokeDashoffset={2 * Math.PI * 34 * 0.25}
                                            strokeLinecap="round" />
                                    </svg>
                                    <div className="mc-ring-inner"><span className="mc-ring-n">{activeCV?.completeness || 92}%</span><span className="mc-ring-l">Độ HT</span></div>
                                </div>
                                <div>
                                    <div className="mc-tips-score-title">{activeCV?.name || 'CV Senior React Developer'}</div>
                                    <div className="mc-tips-score-sub">Hoàn thiện {TIPS.filter(t => t.done).length}/{TIPS.length} mục</div>
                                    <div className="mc-tips-score-bar-wrap">
                                        <div className="mc-tips-bar-bg"><div className="mc-tips-bar" style={{ width: `${(TIPS.filter(t => t.done).length / TIPS.length) * 100}%` }} /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mc-tips-list">
                            {TIPS.map((tip, i) => (
                                <div key={i} className={`mc-tip-row${tip.done ? ' done' : ''}`}>
                                    <div className={`mc-tip-check${tip.done ? ' on' : ''}`}>{tip.done ? '✓' : ''}</div>
                                    <div className="mc-tip-ico">{tip.icon}</div>
                                    <div className="mc-tip-info">
                                        <div className="mc-tip-title">{tip.title}</div>
                                        <div className="mc-tip-desc">{tip.desc}</div>
                                    </div>
                                    {!tip.done && (
                                        <button className="mc-tip-do-btn" onClick={() => {
                                            if (activeCV) {
                                                setEditingId(activeCV.id)
                                                onNavigate?.('editor')
                                            }
                                        }}>Làm ngay →</button>
                                    )}
                                    {tip.done && <span className="mc-tip-done-tag">✓ Hoàn thành</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete modal */}
            {deleteModal && (
                <div className="mc-modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="mc-modal" onClick={e => e.stopPropagation()}>
                        <div className="mc-modal-ico">🗑️</div>
                        <div className="mc-modal-title">Xoá CV này?</div>
                        <div className="mc-modal-sub">Hành động này không thể hoàn tác.</div>
                        <div className="mc-modal-foot">
                            <button className="mc-modal-cancel" onClick={() => setDeleteModal(null)}>Huỷ</button>
                            <button className="mc-modal-ok" onClick={handleDelete}>Xoá</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview modal */}
            {previewCV && <PreviewModal cv={previewCV} onClose={() => setPreviewCV(null)} />}
        </div>
    )
}