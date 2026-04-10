
// import { useState, useEffect, useCallback, useRef } from 'react'
// import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import { useCVStore } from '../../../store/cvStore'
// import { getTemplate } from '../../../data/templateRegistry'
// import CollapsibleSidebar from './../cv-components/CollapsibleSidebar/CollapsibleSidebar'
// import DesignPanel from './../cv-components/DesignPanel/DesignPanel'
// import AddSectionPanel from './../cv-components/AddSectionPanel/AddSectionPanel'
// import DataChoiceModal from './../cv-components/DataChoiceModal/DataChoiceModal'
// import CVPreviewEditable from './../cv-components/CVPreviewEditable/CVPreviewEditable'
// import './VisualCVEditorScreen.css'

// // Data trống hoàn toàn
// const EMPTY_DATA = {
//     personal: {
//         fullName: '',
//         jobTitle: '',
//         email: '',
//         phone: '',
//         address: '',
//         linkedin: '',
//         github: '',
//         avatar: null
//     },
//     summary: { summary: '' },
//     experience: [],
//     education: [],
//     skills: { technical: '', soft: '' },
//     projects: [],
//     certifications: [],
//     languages: [],
//     hobbies: '',
//     references: []
// }

// const AVAILABLE_SECTIONS = [
//     { id: 'avatar', label: 'Ảnh đại diện', icon: '👤', category: 'basic' },
//     { id: 'personal', label: 'Danh thiếp', icon: '🪪', category: 'basic' },
//     { id: 'contact', label: 'Thông tin liên hệ', icon: '📞', category: 'basic' },
//     { id: 'summary', label: 'Mục tiêu nghề nghiệp', icon: '🎯', category: 'content' },
//     { id: 'experience', label: 'Kinh nghiệm làm việc', icon: '💼', category: 'content' },
//     { id: 'education', label: 'Học vấn', icon: '🎓', category: 'content' },
//     { id: 'skills', label: 'Kỹ năng', icon: '⚡', category: 'content' },
//     { id: 'projects', label: 'Dự án', icon: '🚀', category: 'content' },
//     { id: 'certifications', label: 'Chứng chỉ', icon: '🏆', category: 'content' },
//     { id: 'languages', label: 'Ngoại ngữ', icon: '🌐', category: 'content' },
//     { id: 'hobbies', label: 'Sở thích', icon: '❤️', category: 'extra' },
//     { id: 'references', label: 'Người tham khảo', icon: '🤝', category: 'extra' },
// ]

// // Placeholders cho CV preview
// const PLACEHOLDERS = {
//     'personal.fullName': 'Họ và tên',
//     'personal.jobTitle': 'Ví dụ: Senior Frontend Developer',
//     'personal.email': 'email@example.com',
//     'personal.phone': '0123 456 789',
//     'personal.address': 'Quận 1, TP. Hồ Chí Minh',
//     'personal.linkedin': 'linkedin.com/in/username',
//     'personal.github': 'github.com/username',
//     'summary.summary': 'Mô tả ngắn gọn về bản thân, mục tiêu nghề nghiệp...',
//     'experience.position': 'Vị trí công việc',
//     'experience.company': 'Tên công ty',
//     'experience.startDate': 'MM/YYYY',
//     'experience.endDate': 'MM/YYYY hoặc "Hiện tại"',
//     'experience.description': '• Mô tả trách nhiệm và thành tích',
//     'education.school': 'Tên trường/đại học',
//     'education.degree': 'Bằng cấp/chuyên ngành',
//     'education.year': 'YYYY - YYYY',
//     'skills.technical': 'React, Node.js, Python...',
//     'skills.soft': 'Làm việc nhóm, giao tiếp...',
//     'projects.name': 'Tên dự án',
//     'projects.role': 'Vai trò của bạn',
//     'projects.duration': 'Thời gian thực hiện',
//     'certifications.name': 'Tên chứng chỉ',
//     'certifications.year': 'Năm nhận',
//     'languages.name': 'Tiếng Anh, Tiếng Nhật...',
//     'languages.level': 'Trình độ (ví dụ: IELTS 7.5)',
// }

// export default function VisualCVEditorScreen() {
//     const { id } = useParams()
//     const navigate = useNavigate()
//     const location = useLocation()
//     const { getCV, updateCV, createCV, cvList, setEditingId } = useCVStore()

//     const [mode, setMode] = useState('preview')
//     const [showDataChoice, setShowDataChoice] = useState(false)

//     // Sidebar chỉ còn 2 tab: design và sections (xoá content tab)
//     const [sidebarOpen, setSidebarOpen] = useState(true)
//     const [activeTab, setActiveTab] = useState('design') // 'design' | 'sections'

//     const [cvData, setCvData] = useState(EMPTY_DATA)
//     const [activeSections, setActiveSections] = useState(['personal', 'summary', 'experience', 'education', 'skills'])
//     const [template, setTemplate] = useState(null)
//     const [htmlTemplate, setHtmlTemplate] = useState('')

//     const [fontFamily, setFontFamily] = useState('Arial')
//     const [themeColor, setThemeColor] = useState('#6366f1')
//     const [cvName, setCvName] = useState('CV mới')

//     const [loading, setLoading] = useState(true)
//     const [zoom, setZoom] = useState(100)
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
//     const [savingStatus, setSavingStatus] = useState('') // '', 'saving', 'saved'

//     // Auto-save
//     useEffect(() => {
//         if (mode === 'edit' && hasUnsavedChanges && id) {
//             const timer = setTimeout(() => {
//                 handleAutoSave()
//             }, 3000)
//             return () => clearTimeout(timer)
//         }
//     }, [cvData, hasUnsavedChanges, mode, id])

//     // Cảnh báo khi rời trang
//     useEffect(() => {
//         const handleBeforeUnload = (e) => {
//             if (hasUnsavedChanges) {
//                 e.preventDefault()
//                 e.returnValue = ''
//             }
//         }
//         window.addEventListener('beforeunload', handleBeforeUnload)
//         return () => window.removeEventListener('beforeunload', handleBeforeUnload)
//     }, [hasUnsavedChanges])

//     // Khởi tạo
//     const hasInitialized = useRef(false)

// useEffect(() => {
//     if (hasInitialized.current) return
//     if (!location.state && !id) return

//     const templateState = location.state

//     if (templateState?.isNew && templateState?.templateId) {
//         hasInitialized.current = true

//         const templateData = getTemplate(templateState.templateId)
//         if (!templateData) {
//             console.error('Template not found:', templateState.templateId)
//             navigate('/templates')
//             return
//         }

//         setTemplate(templateData)
//         setCvName(templateState.templateName || 'CV mới')

//         const newCV = createCV({
//             name: templateState.templateName || 'CV mới',
//             templateId: templateState.templateId,
//             htmlPath: templateData.htmlPath,
//             ...EMPTY_DATA
//         })

//         // Xử lý cả trường hợp return number hoặc object
//         const cvId = typeof newCV === 'number' ? newCV : newCV?.id

//         if (!cvId) {
//             console.error('Failed to create CV, no ID returned:', newCV)
//             return
//         }

//         console.log('Created CV with ID:', cvId)
//         setEditingId(cvId)
//         navigate(`/cv-editor/${cvId}`, { replace: true })

//         fetch(templateData.htmlPath)
//             .then(res => res.text())
//             .then(html => {
//                 setHtmlTemplate(html)
//                 setLoading(false)
//             })
//             .catch(err => {
//                 console.error('Failed to load template:', err)
//                 setLoading(false)
//             })

//     } else if (id) {
//         hasInitialized.current = true

//         const existingCV = getCV(Number(id))
//         if (existingCV) {
//             setCvData(existingCV.personal ? existingCV : EMPTY_DATA)
//             setCvName(existingCV.name)
//             setActiveSections(existingCV.activeSections || ['personal', 'summary', 'experience', 'education', 'skills'])
//             const templateData = getTemplate(existingCV.templateId)
//             setTemplate(templateData)

//             fetch(existingCV.htmlPath || templateData?.htmlPath)
//                 .then(res => res.text())
//                 .then(html => {
//                     setHtmlTemplate(html)
//                     setLoading(false)
//                 })
//                 .catch(err => {
//                     console.error('Failed to load template:', err)
//                     setLoading(false)
//                 })
//         } else {
//             console.error('CV not found:', id)
//             navigate('/my-cv')
//         }
//     }
// }, [id, location.state]) // Dependencies tối thiểu

//     // Auto-save function
//     const handleAutoSave = async () => {
//         if (!id) return

//         setSavingStatus('saving')

//         await updateCV(Number(id), {
//             ...cvData,
//             name: cvName,
//             activeSections,
//             templateId: template?.id,
//             htmlPath: template?.htmlPath,
//             updatedAt: new Date().toISOString()
//         })

//         setHasUnsavedChanges(false)
//         setSavingStatus('saved')

//         setTimeout(() => setSavingStatus(''), 2000)
//     }

//     // Chuyển sang edit mode
//     const handleStartEdit = () => {
//         const hasExistingData = cvList.some(cv => cv.completeness > 30 && cv.id !== Number(id))

//         if (hasExistingData) {
//             setShowDataChoice(true)
//         } else {
//             setMode('edit')
//         }
//     }

//     // Chọn dữ liệu từ CV cũ
//     const handleUseExistingData = (sourceCVId) => {
//         const sourceCV = getCV(sourceCVId)
//         if (sourceCV) {
//             setCvData(sourceCV)
//             setActiveSections(sourceCV.activeSections || activeSections)
//         }
//         setShowDataChoice(false)
//         setMode('edit')
//         setHasUnsavedChanges(true)
//     }

//     // Tạo từ đầu
//     const handleCreateNew = () => {
//         setCvData(EMPTY_DATA)
//         setShowDataChoice(false)
//         setMode('edit')
//         setHasUnsavedChanges(true)
//     }

//     // Cập nhật data từ preview edit
//     const handleUpdateFromPreview = (section, field, value) => {
//         setCvData(prev => {
//             if (section === 'personal') {
//                 return { ...prev, personal: { ...prev.personal, [field]: value } }
//             } else if (section === 'summary') {
//                 return { ...prev, summary: { summary: value } }
//             } else if (['experience', 'education', 'projects', 'certifications', 'languages'].includes(section)) {
//                 const [fieldName, itemIndex] = field.split('_')
//                 if (itemIndex !== undefined) {
//                     const items = [...(prev[section] || [])]
//                     if (items[itemIndex]) {
//                         items[itemIndex] = { ...items[itemIndex], [fieldName]: value }
//                     }
//                     return { ...prev, [section]: items }
//                 }
//             }
//             return prev
//         })
//         setHasUnsavedChanges(true)
//     }

//     // Thêm section mới
//     const handleAddSection = (sectionId) => {
//         if (!activeSections.includes(sectionId)) {
//             const newSections = [...activeSections, sectionId]
//             setActiveSections(newSections)

//             if (!cvData[sectionId]) {
//                 const emptyData = {
//                     'experience': [],
//                     'education': [],
//                     'projects': [],
//                     'certifications': [],
//                     'languages': [],
//                     'references': [],
//                     'skills': { technical: '', soft: '' },
//                     'summary': { summary: '' },
//                     'hobbies': '',
//                 }[sectionId] || {}

//                 setCvData(prev => ({ ...prev, [sectionId]: emptyData }))
//             }
//             setHasUnsavedChanges(true)
//         }
//     }

//     // Di chuyển section
//     const moveSection = (index, direction) => {
//         const newSections = [...activeSections]
//         if (direction === 'up' && index > 0) {
//             [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]]
//         } else if (direction === 'down' && index < newSections.length - 1) {
//             [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
//         }
//         setActiveSections(newSections)
//         setHasUnsavedChanges(true)
//     }

//     // Xóa section
//     const removeSection = (index) => {
//         const newSections = activeSections.filter((_, i) => i !== index)
//         setActiveSections(newSections)
//         setHasUnsavedChanges(true)
//     }

//     // Thêm item vào section (từ toolbar trên CV)
//     const addItemToSection = (sectionId) => {
//         const newItem = {
//             'experience': {
//                 id: Date.now(),
//                 position: '',
//                 company: '',
//                 startDate: '',
//                 endDate: '',
//                 description: ''
//             },
//             'education': {
//                 id: Date.now(),
//                 school: '',
//                 degree: '',
//                 year: '',
//                 description: ''
//             },
//             'projects': {
//                 id: Date.now(),
//                 name: '',
//                 role: '',
//                 duration: '',
//                 description: ''
//             },
//             'certifications': {
//                 id: Date.now(),
//                 name: '',
//                 year: ''
//             },
//             'languages': {
//                 id: Date.now(),
//                 name: '',
//                 level: ''
//             },
//             'references': {
//                 id: Date.now(),
//                 name: '',
//                 position: '',
//                 company: '',
//                 phone: '',
//                 email: ''
//             }
//         }[sectionId]

//         setCvData(prev => ({
//             ...prev,
//             [sectionId]: [...(prev[sectionId] || []), newItem]
//         }))
//         setHasUnsavedChanges(true)
//     }

//     // Xóa item khỏi section
//     const removeItemFromSection = (sectionId, itemId) => {
//         setCvData(prev => ({
//             ...prev,
//             [sectionId]: prev[sectionId].filter(item => item.id !== itemId)
//         }))
//         setHasUnsavedChanges(true)
//     }

//     // Lưu và thoát
//     const handleSave = () => {
//         handleAutoSave()
//         navigate('/cv-builder')
//     }

//     if (loading) return <div className="cv-editor-loading">Đang tải...</div>

//     return (
//         <div className="cv-editor-screen">
//             {/* Header */}
//             <header className="cv-editor-header">
//                 <div className="cv-editor-header-left">
//                     <button className="cv-editor-back" onClick={() => navigate('/cv-builder')}>
//                         ← Quay lại
//                     </button>
//                     <div className="cv-editor-title-group">
//                         <input
//                             type="text"
//                             className="cv-editor-name-input"
//                             value={cvName}
//                             onChange={(e) => {
//                                 setCvName(e.target.value)
//                                 setHasUnsavedChanges(true)
//                             }}
//                             placeholder="Tên CV"
//                         />
//                         <span className="cv-editor-template-name">{template?.name}</span>
//                         {hasUnsavedChanges && <span className="cv-editor-unsaved">● Chưa lưu</span>}
//                     </div>
//                 </div>

//                 <div className="cv-editor-mode-toggle">
//                     <button
//                         className={`mode-btn ${mode === 'preview' ? 'active' : ''}`}
//                         onClick={() => setMode('preview')}
//                     >
//                         👁 Xem thử
//                     </button>
//                     <button
//                         className={`mode-btn ${mode === 'edit' ? 'active' : ''}`}
//                         onClick={mode === 'edit' ? undefined : handleStartEdit}
//                     >
//                         ✏️ Chỉnh sửa
//                     </button>
//                 </div>

//                 <div className="cv-editor-actions">
//                     <div className="cv-editor-zoom">
//                         <button onClick={() => setZoom(z => Math.max(50, z - 10))}>−</button>
//                         <span>{zoom}%</span>
//                         <button onClick={() => setZoom(z => Math.min(150, z + 10))}>+</button>
//                     </div>
//                     {mode === 'edit' && (
//                         <>
//                             <button className="cv-editor-save-draft-btn" onClick={handleAutoSave}>
//                                 💾 Lưu nháp
//                             </button>
//                             <button className="cv-editor-save-btn" onClick={handleSave}>
//                                 ✓ Lưu & Thoát
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </header>

//             {/* Main Content */}
//             <div className="cv-editor-body">
//                 {/* Sidebar chỉ còn 2 tab: Design và Add Section */}
//                 {mode === 'edit' && (
//                     <CollapsibleSidebar
//                         isOpen={sidebarOpen}
//                         onToggle={() => setSidebarOpen(!sidebarOpen)}
//                         activeTab={activeTab}
//                         onTabChange={setActiveTab}
//                         tabs={[
//                             { id: 'design', label: 'Thiết kế', icon: '🎨' },
//                             { id: 'sections', label: 'Thêm mục', icon: '➕' },
//                         ]}
//                     >
//                         {activeTab === 'design' && (
//                             <DesignPanel
//                                 fontFamily={fontFamily}
//                                 setFontFamily={setFontFamily}
//                                 themeColor={themeColor}
//                                 setThemeColor={setThemeColor}
//                             />
//                         )}
//                         {activeTab === 'sections' && (
//                             <AddSectionPanel
//                                 availableSections={AVAILABLE_SECTIONS}
//                                 activeSections={activeSections}
//                                 onAddSection={handleAddSection}
//                             />
//                         )}
//                     </CollapsibleSidebar>
//                 )}

//                 {/* Preview Area - Tất cả edit diễn ra ở đây */}
//                 <div
//                     className={`cv-editor-preview-area 
//                         ${mode === 'preview' ? 'full' : ''} 
//                         ${mode === 'edit' && !sidebarOpen ? 'expanded' : ''}
//                     `}
//                 >
//                     <CVPreviewEditable
//                         htmlTemplate={htmlTemplate}
//                         cvData={cvData}
//                         activeSections={activeSections}
//                         fontFamily={fontFamily}
//                         themeColor={themeColor}
//                         zoom={zoom}
//                         mode={mode}
//                         placeholders={PLACEHOLDERS}
//                         onMoveSection={moveSection}
//                         onRemoveSection={removeSection}
//                         onAddItem={addItemToSection}
//                         onRemoveItem={removeItemFromSection}
//                         onUpdateField={handleUpdateFromPreview}
//                     />
//                 </div>
//             </div>

//             {/* Saving Status Toast */}
//             {savingStatus && (
//                 <div className={`saving-toast ${savingStatus === 'saved' ? 'saved' : ''}`}>
//                     {savingStatus === 'saving' && <div className="saving-spinner" />}
//                     <span>
//                         {savingStatus === 'saving' ? 'Đang lưu...' :
//                             savingStatus === 'saved' ? '✓ Đã lưu' : ''}
//                     </span>
//                 </div>
//             )}

//             {/* Data Choice Modal */}
//             {showDataChoice && (
//                 <DataChoiceModal
//                     cvList={cvList.filter(cv => cv.completeness > 30 && cv.id !== Number(id))}
//                     onUseExisting={handleUseExistingData}
//                     onCreateNew={handleCreateNew}
//                     onClose={() => setShowDataChoice(false)}
//                 />
//             )}
//         </div>
//     )
// }




import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useCVStore } from '../../../store/cvStore'
import { getTemplate } from '../../../data/templateRegistry'
import CollapsibleSidebar from './../cv-components/CollapsibleSidebar/CollapsibleSidebar'
import DesignPanel from './../cv-components/DesignPanel/DesignPanel'
import AddSectionPanel from './../cv-components/AddSectionPanel/AddSectionPanel'
import DataChoiceModal from './../cv-components/DataChoiceModal/DataChoiceModal'
import CVPreviewEditable from './../cv-components/CVPreviewEditable/CVPreviewEditable'
import './VisualCVEditorScreen.css'

// ──────────────────────────────────────────────────────────
//  Constants
// ──────────────────────────────────────────────────────────

const EMPTY_DATA = {
    personal: { fullName: '', jobTitle: '', email: '', phone: '', address: '', linkedin: '', github: '', avatar: null },
    summary: { summary: '' },
    experience: [],
    education: [],
    skills: { items: [] },
    projects: [],
    certifications: [],
    languages: [],
    activities: [],
    hobbies: '',
    references: [],
}

const AVAILABLE_SECTIONS = [
    { id: 'personal', label: 'Danh thiếp', icon: '🪪', category: 'basic' },
    { id: 'summary', label: 'Mục tiêu nghề nghiệp', icon: '🎯', category: 'content' },
    { id: 'experience', label: 'Kinh nghiệm làm việc', icon: '💼', category: 'content' },
    { id: 'education', label: 'Học vấn', icon: '🎓', category: 'content' },
    { id: 'skills', label: 'Kỹ năng', icon: '⚡', category: 'content' },
    { id: 'projects', label: 'Dự án', icon: '🚀', category: 'content' },
    { id: 'certifications', label: 'Chứng chỉ', icon: '🏆', category: 'content' },
    { id: 'languages', label: 'Ngoại ngữ', icon: '🌐', category: 'content' },
    { id: 'activities', label: 'Hoạt động', icon: '🎭', category: 'extra' },
    { id: 'hobbies', label: 'Sở thích', icon: '❤️', category: 'extra' },
    { id: 'references', label: 'Người tham khảo', icon: '🤝', category: 'extra' },
]

const PLACEHOLDERS = {
    'personal.fullName': 'Họ và tên của bạn',
    'personal.jobTitle': 'Ví dụ: Senior Frontend Developer',
    'personal.email': 'email@example.com',
    'personal.phone': '0123 456 789',
    'personal.address': 'Quận 1, TP. Hồ Chí Minh',
    'personal.linkedin': 'linkedin.com/in/username',
    'personal.github': 'github.com/username',
    'summary.summary': 'Mô tả ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp...',
    'experience.position': 'Vị trí công việc',
    'experience.company': 'Tên công ty',
    'experience.time': 'MM/YYYY – MM/YYYY',
    'experience.description': '• Mô tả trách nhiệm và thành tích của bạn',
    'education.school': 'Tên trường / Đại học',
    'education.degree': 'Bằng cấp / Chuyên ngành',
    'education.time': 'YYYY – YYYY',
    'skills.name': 'Tên kỹ năng',
    'skills.level': 'Thành thạo / 5 năm kinh nghiệm...',
    'projects.projectName': 'Tên dự án',
    'projects.role': 'Vai trò của bạn',
    'projects.time': 'Thời gian thực hiện',
    'projects.description': '• Mô tả chi tiết dự án',
    'certifications.name': 'Tên chứng chỉ',
    'certifications.time': 'Năm nhận',
    'languages.name': 'Tiếng Anh, Tiếng Nhật...',
    'languages.level': 'IELTS 7.5 / N2...',
}

const DEFAULT_SECTIONS = ['personal', 'summary', 'experience', 'education']

// Default design values — centralized so save/load are always in sync
const DEFAULT_DESIGN = {
    fontFamily: 'Be Vietnam Pro',
    themeColor: '#C0412A',
    bgColor: '#ffffff',
    lineHeight: 1.6,
    fontSize: 14,
    textStyle: { bold: false, italic: false, underline: false },
}

// ──────────────────────────────────────────────────────────
//  Component
// ──────────────────────────────────────────────────────────

export default function VisualCVEditorScreen() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { getCV, updateCV, createCV, cvList, setEditingId } = useCVStore()

    const [mode, setMode] = useState('preview')
    const [showDataChoice, setShowDataChoice] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState('design')

    // CV data
    const [cvData, setCvData] = useState(EMPTY_DATA)
    const [activeSections, setActiveSections] = useState(DEFAULT_SECTIONS)
    const [template, setTemplate] = useState(null)
    const [cvName, setCvName] = useState('CV mới')

    // Design — all synced to store on save
    const [fontFamily, setFontFamily] = useState(DEFAULT_DESIGN.fontFamily)
    const [themeColor, setThemeColor] = useState(DEFAULT_DESIGN.themeColor)
    const [bgColor, setBgColor] = useState(DEFAULT_DESIGN.bgColor)
    const [lineHeight, setLineHeight] = useState(DEFAULT_DESIGN.lineHeight)
    const [fontSize, setFontSize] = useState(DEFAULT_DESIGN.fontSize)
    const [textStyle, setTextStyle] = useState(DEFAULT_DESIGN.textStyle)

    // UI state
    const [loading, setLoading] = useState(true)
    const [zoom, setZoom] = useState(90)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [savingStatus, setSavingStatus] = useState('')

    const hasInitialized = useRef(false)
    const fileInputRef = useRef(null)

    const markChanged = () => setHasUnsavedChanges(true)

    // ── Init ──────────────────────────────────────────────
    useEffect(() => {
        if (hasInitialized.current) return

        const state = location.state

        if (state?.isNew && state?.templateId) {
            hasInitialized.current = true
            const templateData = getTemplate(state.templateId)
            if (!templateData) { navigate('/templates'); return }

            setTemplate(templateData)
            setCvName(state.templateName ? `CV ${state.templateName}` : 'CV mới')

            // Apply template design defaults
            if (templateData.defaultThemeColor) setThemeColor(templateData.defaultThemeColor)
            if (templateData.defaultBgColor) setBgColor(templateData.defaultBgColor)
            if (templateData.defaultFont) setFontFamily(templateData.defaultFont)

            const newCV = createCV({
                name: `CV ${templateData.name}`,
                templateId: templateData.id,
                htmlPath: templateData.htmlPath,
                ...EMPTY_DATA,
            })
            const cvId = typeof newCV === 'number' ? newCV : newCV?.id
            if (!cvId) { console.error('Failed to create CV'); setLoading(false); return }

            setEditingId?.(cvId)
            navigate(`/cv-editor/${cvId}`, { replace: true })
            setLoading(false)

        } else if (id && id !== 'new') {
            hasInitialized.current = true
            const existing = getCV(Number(id))

            if (existing) {
                // Restore CV data
                setCvData(existing.personal ? existing : EMPTY_DATA)
                setCvName(existing.name || 'CV mới')
                setActiveSections(existing.activeSections || DEFAULT_SECTIONS)

                // ✅ FIX: Restore ALL design settings from store
                setFontFamily(existing.fontFamily || DEFAULT_DESIGN.fontFamily)
                setThemeColor(existing.themeColor || DEFAULT_DESIGN.themeColor)
                setBgColor(existing.bgColor || DEFAULT_DESIGN.bgColor)
                setLineHeight(existing.lineHeight ?? DEFAULT_DESIGN.lineHeight)
                setFontSize(existing.fontSize ?? DEFAULT_DESIGN.fontSize)
                setTextStyle(existing.textStyle || DEFAULT_DESIGN.textStyle)

                const templateData = getTemplate(existing.templateId)
                setTemplate(templateData || null)
                setLoading(false)
            } else {
                console.warn('CV not found:', id)
                navigate('/my-cv')
            }
        } else {
            navigate('/my-cv')
        }
    }, [id, location.state])

    // ── Auto-save after 3s of inactivity ──
    useEffect(() => {
        if (mode !== 'edit' || !hasUnsavedChanges || !id || id === 'new') return
        const timer = setTimeout(handleAutoSave, 3000)
        return () => clearTimeout(timer)
    }, [cvData, fontFamily, themeColor, bgColor, lineHeight, fontSize, textStyle, hasUnsavedChanges, mode, id])

    // ── Warn before leaving with unsaved changes ──
    useEffect(() => {
        const onBeforeUnload = (e) => {
            if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = '' }
        }
        window.addEventListener('beforeunload', onBeforeUnload)
        return () => window.removeEventListener('beforeunload', onBeforeUnload)
    }, [hasUnsavedChanges])

    // ──────────────────────────────────────────────────────
    //  Save
    // ──────────────────────────────────────────────────────

    const handleAutoSave = async () => {
        if (!id || id === 'new') return
        setSavingStatus('saving')

        // ✅ FIX: Save ALL design settings to store
        await updateCV(Number(id), {
            ...cvData,
            name: cvName,
            activeSections,
            templateId: template?.id,
            htmlPath: template?.htmlPath,
            // Design
            fontFamily,
            themeColor,
            bgColor,
            lineHeight,
            fontSize,
            textStyle,
            updatedAt: new Date().toISOString(),
        })

        setHasUnsavedChanges(false)
        setSavingStatus('saved')
        setTimeout(() => setSavingStatus(''), 2000)
    }

    const handleSaveAndExit = async () => {
        await handleAutoSave()
        navigate('/my-cv')
    }

    // ──────────────────────────────────────────────────────
    //  Edit mode
    // ──────────────────────────────────────────────────────

    const handleStartEdit = () => {
        const hasOtherData = cvList.some(cv => cv.completeness > 30 && cv.id !== Number(id))
        if (hasOtherData) {
            setShowDataChoice(true)
        } else {
            setMode('edit')
        }
    }

    const handleUseExistingData = (sourceCVId) => {
        const src = getCV(sourceCVId)
        if (src) {
            setCvData(src)
            setActiveSections(src.activeSections || DEFAULT_SECTIONS)
        }
        setShowDataChoice(false)
        setMode('edit')
        markChanged()
    }

    const handleCreateNew = () => {
        setCvData(EMPTY_DATA)
        setShowDataChoice(false)
        setMode('edit')
        markChanged()
    }

    // ──────────────────────────────────────────────────────
    //  Avatar upload
    // ──────────────────────────────────────────────────────

    const handleUploadAvatar = () => fileInputRef.current?.click()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setCvData(prev => ({
                ...prev,
                personal: { ...prev.personal, avatar: ev.target.result }
            }))
            markChanged()
        }
        reader.readAsDataURL(file)
    }

    // ──────────────────────────────────────────────────────
    //  CV data handlers
    // ──────────────────────────────────────────────────────

    const handleUpdateField = (section, field, value) => {
        setCvData(prev => {
            if (section === 'personal') {
                return { ...prev, personal: { ...prev.personal, [field]: value } }
            }
            if (section === 'summary') {
                return { ...prev, summary: { ...prev.summary, summary: value } }
            }
            if (section === 'hobbies') {
                return { ...prev, hobbies: value }
            }
            // List sections: field = "fieldName_index"
            if (['experience', 'education', 'projects', 'certifications', 'languages', 'skills', 'activities'].includes(section)) {
                const parts = field.split('_')
                const itemIndex = parseInt(parts[parts.length - 1])
                const fieldName = parts.slice(0, -1).join('_')

                if (!isNaN(itemIndex)) {
                    const currentArr = section === 'skills'
                        ? (prev.skills?.items || [])
                        : (prev[section] || [])

                    const items = [...currentArr]
                    if (items[itemIndex]) {
                        items[itemIndex] = { ...items[itemIndex], [fieldName]: value }
                    }

                    if (section === 'skills') {
                        return { ...prev, skills: { ...prev.skills, items } }
                    }
                    return { ...prev, [section]: items }
                }
            }
            return prev
        })
        markChanged()
    }

    const handleMoveSection = (index, direction) => {
        setActiveSections(prev => {
            const next = [...prev]
            if (direction === 'up' && index > 0)
                [next[index], next[index - 1]] = [next[index - 1], next[index]]
            else if (direction === 'down' && index < next.length - 1)
                [next[index], next[index + 1]] = [next[index + 1], next[index]]
            return next
        })
        markChanged()
    }

    const handleRemoveSection = (index) => {
        setActiveSections(prev => prev.filter((_, i) => i !== index))
        markChanged()
    }

    const handleAddSection = (sectionId) => {
        if (activeSections.includes(sectionId)) return
        setActiveSections(prev => [...prev, sectionId])

        if (!cvData[sectionId]) {
            const emptyData = {
                experience: [],
                education: [],
                projects: [],
                certifications: [],
                languages: [],
                references: [],
                activities: [],
                skills: { items: [] },
                summary: { summary: '' },
                hobbies: '',
            }[sectionId] ?? {}
            setCvData(prev => ({ ...prev, [sectionId]: emptyData }))
        }
        markChanged()
    }

    const handleAddItem = (sectionId) => {
        const newItem = {
            experience: { id: Date.now(), position: '', company: '', time: '', description: '' },
            education: { id: Date.now(), school: '', degree: '', time: '', description: '' },
            projects: { id: Date.now(), role: '', projectName: '', time: '', description: '' },
            certifications: { id: Date.now(), name: '', time: '' },
            languages: { id: Date.now(), name: '', level: '' },
            activities: { id: Date.now(), position: '', company: '', time: '', description: '' },
            skills: { id: Date.now(), name: '', level: '' },
        }[sectionId]

        if (!newItem) return

        setCvData(prev => {
            const current = sectionId === 'skills'
                ? (prev.skills?.items || [])
                : (prev[sectionId] || [])
            const newArr = [...current, newItem]

            if (sectionId === 'skills') return { ...prev, skills: { ...prev.skills, items: newArr } }
            return { ...prev, [sectionId]: newArr }
        })
        markChanged()
    }

    const handleRemoveItem = (sectionId, itemId) => {
        setCvData(prev => {
            if (sectionId === 'skills') {
                return { ...prev, skills: { ...prev.skills, items: prev.skills.items.filter(i => String(i.id) !== String(itemId)) } }
            }
            return { ...prev, [sectionId]: (prev[sectionId] || []).filter(i => String(i.id) !== String(itemId)) }
        })
        markChanged()
    }

    // ──────────────────────────────────────────────────────
    //  Design handlers
    // ──────────────────────────────────────────────────────

    const handleFontChange = (v) => { setFontFamily(v); markChanged() }
    const handleColorChange = (v) => { setThemeColor(v); markChanged() }
    const handleBgChange = (v) => { setBgColor(v); markChanged() }
    const handleLineHeightChange = (v) => { setLineHeight(v); markChanged() }
    const handleFontSizeChange = (v) => { setFontSize(v); markChanged() }
    const handleTextStyleChange = (v) => { setTextStyle(v); markChanged() }

    // ──────────────────────────────────────────────────────
    //  Render
    // ──────────────────────────────────────────────────────

    const previewAreaClass = [
        'cv-editor-preview-area',
        mode === 'preview' ? 'full' : '',
        mode === 'edit' && !sidebarOpen ? 'expanded' : '',
    ].filter(Boolean).join(' ')

    if (loading) {
        return (
            <div className="cv-editor-loading">
                <div className="cv-editor-loading-spinner" />
                <span>Đang tải CV...</span>
            </div>
        )
    }

    return (
        <div className="cv-editor-screen">
            {/* ── HEADER ── */}
            <header className="cv-editor-header">
                <div className="cv-editor-header-left">
                    <button
                        className="cv-editor-back"
                        onClick={() => {
                            if (hasUnsavedChanges) {
                                if (window.confirm('Có thay đổi chưa lưu. Thoát không?')) navigate('/my-cv')
                            } else {
                                navigate('/my-cv')
                            }
                        }}
                    >
                        ← Quay lại
                    </button>
                    <div className="cv-editor-title-group">
                        <input
                            type="text"
                            className="cv-editor-name-input"
                            value={cvName}
                            onChange={(e) => { setCvName(e.target.value); markChanged() }}
                            placeholder="Tên CV"
                        />
                        <span className="cv-editor-template-name">
                            {template?.name || 'CV'}
                            {hasUnsavedChanges && <span className="cv-editor-unsaved"> · Chưa lưu</span>}
                        </span>
                    </div>
                </div>

                <div className="cv-editor-mode-toggle">
                    <button
                        className={`mode-btn ${mode === 'preview' ? 'active' : ''}`}
                        onClick={() => setMode('preview')}
                    >
                        👁 Xem thử
                    </button>
                    <button
                        className={`mode-btn ${mode === 'edit' ? 'active' : ''}`}
                        onClick={mode === 'edit' ? undefined : handleStartEdit}
                    >
                        ✏️ Chỉnh sửa
                    </button>
                </div>

                <div className="cv-editor-actions">
                    <div className="cv-editor-zoom">
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))}>−</button>
                        <span>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(150, z + 10))}>+</button>
                    </div>

                    {mode === 'edit' && (
                        <button
                            className="cv-editor-save-draft-btn"
                            onClick={handleAutoSave}
                            disabled={savingStatus === 'saving'}
                        >
                            {savingStatus === 'saving' ? '⏳' : '💾'} Lưu nháp
                        </button>
                    )}

                    <button className="cv-editor-save-btn" onClick={handleSaveAndExit}>
                        ✓ Lưu & Thoát
                    </button>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="cv-editor-body">
                {mode === 'edit' && (
                    <CollapsibleSidebar
                        isOpen={sidebarOpen}
                        onToggle={() => setSidebarOpen(!sidebarOpen)}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabs={[
                            { id: 'design', label: 'Thiết kế', icon: '🎨' },
                            { id: 'sections', label: 'Thêm mục', icon: '➕' },
                        ]}
                    >
                        {activeTab === 'design' && (
                            <DesignPanel
                                fontFamily={fontFamily}
                                setFontFamily={handleFontChange}
                                themeColor={themeColor}
                                setThemeColor={handleColorChange}
                                bgColor={bgColor}
                                setBgColor={handleBgChange}
                                lineHeight={lineHeight}
                                setLineHeight={handleLineHeightChange}
                                fontSize={fontSize}
                                setFontSize={handleFontSizeChange}
                                textStyle={textStyle}
                                setTextStyle={handleTextStyleChange}
                            />
                        )}
                        {activeTab === 'sections' && (
                            <AddSectionPanel
                                availableSections={AVAILABLE_SECTIONS}
                                activeSections={activeSections}
                                onAddSection={handleAddSection}
                            />
                        )}
                    </CollapsibleSidebar>
                )}

                <div className={previewAreaClass}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <CVPreviewEditable
                        cvData={cvData}
                        activeSections={activeSections}
                        fontFamily={fontFamily}
                        themeColor={themeColor}
                        backgroundColor={bgColor}
                        lineHeight={lineHeight}
                        fontSize={fontSize}
                        zoom={zoom}
                        mode={mode}
                        placeholders={PLACEHOLDERS}
                        templateHtmlPath={template?.htmlPath}
                        onMoveSection={handleMoveSection}
                        onRemoveSection={handleRemoveSection}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        onUpdateField={handleUpdateField}
                        onUploadAvatar={handleUploadAvatar}
                    />
                </div>
            </div>

            {/* ── Saving toast ── */}
            {savingStatus && (
                <div className={`cv-saving-toast ${savingStatus === 'saved' ? 'saved' : ''}`}>
                    {savingStatus === 'saving' && <div className="cv-saving-spinner" />}
                    <span>{savingStatus === 'saving' ? 'Đang lưu...' : '✓ Đã lưu'}</span>
                </div>
            )}

            {/* ── Data choice modal ── */}
            {showDataChoice && (
                <DataChoiceModal
                    cvList={cvList.filter(cv => cv.completeness > 30 && cv.id !== Number(id))}
                    onUseExisting={handleUseExistingData}
                    onCreateNew={handleCreateNew}
                    onClose={() => setShowDataChoice(false)}
                />
            )}
        </div>
    )
}