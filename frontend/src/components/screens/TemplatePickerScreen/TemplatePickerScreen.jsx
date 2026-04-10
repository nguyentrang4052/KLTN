// // src/components/screens/TemplatePickerScreen/TemplatePickerScreen.jsx
// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { TEMPLATES } from '../../../data/templateRegistry'
// import { useCVStore } from '../../../store/cvStore'
// import './TemplatePickerScreen.css'

// export default function TemplatePickerScreen() {
//     const navigate = useNavigate()
//     const { createCV } = useCVStore()
//     const [previewTemplate, setPreviewTemplate] = useState(null)

//     const handleSelect = (template) => {
//         const newId = createCV(template)
//         navigate(`/cv-editor/${newId}`)
//     }

//     return (
//         <div className="tp-page">
//             <div className="tp-header">
//                 <button className="tp-back" onClick={() => navigate('/my-cv')}>← Quay lại</button>
//                 <h1 className="tp-title">Chọn mẫu CV</h1>
//                 <p className="tp-sub">Chọn template phù hợp, sau đó điền thông tin của bạn</p>
//             </div>

//             <div className="tp-grid">
//                 {TEMPLATES.map(template => (
//                     <div key={template.id} className="tp-card">
//                         {/* Preview thumbnail built from CSS */}
//                         <div className="tp-thumb" style={{ background: template.previewBg }}>
//                             <div className="tp-thumb-inner">
//                                 <div className="tp-thumb-av" style={{ background: template.color }}>
//                                     A
//                                 </div>
//                                 <div className="tp-thumb-lines">
//                                     <div className="tp-line long" />
//                                     <div className="tp-line" />
//                                     <div className="tp-line w80" />
//                                     <div className="tp-line w60" />
//                                     <div className="tp-line w70" />
//                                 </div>
//                             </div>
                            
//                             {/* Hover overlay */}
//                             <div className="tp-thumb-overlay">
//                                 <button className="tp-ov-btn" onClick={() => setPreviewTemplate(template)}>
//                                     👁 Xem thử
//                                 </button>
//                                 <button className="tp-ov-btn primary" onClick={() => handleSelect(template)}>
//                                     ✦ Dùng mẫu này
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="tp-card-body">
//                             <div className="tp-card-name">{template.name}</div>
//                             <div className="tp-card-style">{template.style}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Preview Modal với iframe thật */}
//             {previewTemplate && (
//                 <div className="tp-modal-overlay" onClick={() => setPreviewTemplate(null)}>
//                     <div className="tp-modal" onClick={e => e.stopPropagation()}>
//                         <div className="tp-modal-head">
//                             <span>{previewTemplate.name} - {previewTemplate.style}</span>
//                             <button className="tp-close" onClick={() => setPreviewTemplate(null)}>✕</button>
//                         </div>
//                         <div className="tp-modal-body">
//                             <iframe
//                                 src={previewTemplate.htmlPath}
//                                 title="preview"
//                                 className="tp-modal-iframe"
//                             />
//                         </div>
//                         <div className="tp-modal-foot">
//                             <button className="tp-btn-use" onClick={() => { 
//                                 setPreviewTemplate(null)
//                                 handleSelect(previewTemplate)
//                             }}>
//                                 ✦ Dùng mẫu này
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }



import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TEMPLATES } from '../../../data/templateRegistry'
import { useCVStore } from '../../../store/cvStore'
import './TemplatePickerScreen.css'

export default function TemplatePickerScreen() {
    const navigate = useNavigate()
    const { createCV } = useCVStore()
    const [previewTemplate, setPreviewTemplate] = useState(null)
    const [loadingPreview, setLoadingPreview] = useState(false)

    const handleSelect = (template) => {
        // Navigate to editor with template info
        navigate('/cv-editor/new', {
            state: {
                isNew: true,
                templateId: template.id,
                templateName: template.name,
                htmlPath: template.htmlPath
            }
        })
    }

    const handlePreview = (template) => {
        setLoadingPreview(true)
        setPreviewTemplate(template)
        // Preload iframe
        setTimeout(() => setLoadingPreview(false), 500)
    }

    return (
        <div className="tp-page">
            <div className="tp-header">
                <button className="tp-back" onClick={() => navigate('/cv-builder')}>
                    ← Quay lại
                </button>
                <h1 className="tp-title">Chọn mẫu CV</h1>
                <p className="tp-sub">Chọn template phù hợp, sau đó điền thông tin của bạn</p>
            </div>

            <div className="tp-grid">
                {TEMPLATES.map(template => (
                    <div key={template.id} className="tp-card">
                        {/* Preview thumbnail - hiển thị preview thật qua iframe thu nhỏ */}
                        <div className="tp-thumb-wrapper">
                            <div className="tp-thumb" style={{ background: template.previewBg }}>
                                <iframe
                                    src={template.htmlPath}
                                    title={`preview-${template.id}`}
                                    className="tp-thumb-iframe"
                                    scrolling="no"
                                    sandbox="allow-same-origin"
                                />
                            </div>
                            
                            {/* Hover overlay */}
                            <div className="tp-thumb-overlay">
                                <button 
                                    className="tp-ov-btn" 
                                    onClick={() => handlePreview(template)}
                                >
                                    👁 Xem thử
                                </button>
                                <button 
                                    className="tp-ov-btn primary" 
                                    onClick={() => handleSelect(template)}
                                >
                                    ✦ Dùng mẫu này
                                </button>
                            </div>
                        </div>

                        <div className="tp-card-body">
                            <div className="tp-card-name">{template.name}</div>
                            <div className="tp-card-style">{template.style}</div>
                            <div className="tp-card-tags">
                                {template.schema && Object.keys(template.schema).slice(0, 3).map(key => (
                                    <span key={key} className="tp-tag">
                                        {template.schema[key].label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal với iframe thật */}
            {previewTemplate && (
                <div className="tp-modal-overlay" onClick={() => setPreviewTemplate(null)}>
                    <div className="tp-modal" onClick={e => e.stopPropagation()}>
                        <div className="tp-modal-head">
                            <div className="tp-modal-info">
                                <span className="tp-modal-name">{previewTemplate.name}</span>
                                <span className="tp-modal-style">{previewTemplate.style}</span>
                            </div>
                            <button 
                                className="tp-close" 
                                onClick={() => setPreviewTemplate(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="tp-modal-body">
                            {loadingPreview && (
                                <div className="tp-loading">Đang tải preview...</div>
                            )}
                            <iframe
                                src={previewTemplate.htmlPath}
                                title="preview"
                                className="tp-modal-iframe"
                                sandbox="allow-same-origin"
                            />
                        </div>
                        <div className="tp-modal-foot">
                            <button 
                                className="tp-btn-secondary" 
                                onClick={() => setPreviewTemplate(null)}
                            >
                                Đóng
                            </button>
                            <button 
                                className="tp-btn-use" 
                                onClick={() => { 
                                    setPreviewTemplate(null)
                                    handleSelect(previewTemplate)
                                }}
                            >
                                ✦ Dùng mẫu này
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

