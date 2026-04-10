// import { useEffect, useRef, useCallback } from 'react'
// import './CVPreviewEditable.css'

// export default function CVPreviewEditable({
//     htmlTemplate,
//     cvData,
//     activeSections,
//     fontFamily,
//     themeColor,
//     zoom,
//     mode,
//     placeholders,
//     onMoveSection,
//     onRemoveSection,
//     onAddItem,
//     onRemoveItem,
//     onUpdateField
// }) {
//     const iframeRef = useRef(null)

//     // Tạo HTML với inline editing capabilities
//     const generateEditableHTML = useCallback(() => {
//         if (!htmlTemplate) return ''

//         const isEditMode = mode === 'edit'

//         // CSS cho edit mode
//         const editStyles = isEditMode ? `
//             /* Inline editing styles */
//             [data-editable="true"] {
//                 border: 1px dashed transparent;
//                 transition: all 0.2s;
//                 cursor: text;
//                 display: inline-block;
//                 min-width: 20px;
//                 min-height: 1.2em;
//             }

//             [data-editable="true"]:hover {
//                 border-color: #ef4444;
//                 background: rgba(239, 68, 68, 0.05);
//             }

//             [data-editable="true"]:focus {
//                 border-color: #ef4444;
//                 background: rgba(239, 68, 68, 0.1);
//                 outline: 2px solid rgba(239, 68, 68, 0.2);
//             }

//             [data-editable="true"]:empty:before {
//                 content: attr(data-placeholder);
//                 color: #9ca3af;
//                 font-style: italic;
//                 pointer-events: none;
//             }

//             /* Section styling with toolbar */
//             .cv-section {
//                 position: relative;
//                 border: 2px solid transparent;
//                 transition: all 0.2s;
//                 margin: 8px 0;
//                 padding: 8px;
//                 border-radius: 8px;
//             }

//             .cv-section:hover {
//                 border-color: rgba(239, 68, 68, 0.3);
//             }

//             .cv-section.selected {
//                 border-color: #ef4444;
//                 box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
//             }

//             /* Toolbar for sections */
//             .section-toolbar {
//                 position: absolute;
//                 top: -40px;
//                 right: 0;
//                 display: none;
//                 background: white;
//                 border-radius: 8px;
//                 box-shadow: 0 2px 12px rgba(0,0,0,0.15);
//                 padding: 6px;
//                 gap: 6px;
//                 z-index: 1000;
//                 border: 1px solid #e5e7eb;
//                 flex-wrap: wrap;
//                 max-width: 200px;
//             }

//             .cv-section:hover .section-toolbar,
//             .cv-section.selected .section-toolbar {
//                 display: flex;
//             }

//             .toolbar-btn {
//                 width: 32px;
//                 height: 32px;
//                 border: none;
//                 background: #f3f4f6;
//                 border-radius: 6px;
//                 cursor: pointer;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-size: 14px;
//                 transition: all 0.2s;
//                 color: #374151;
//             }

//             .toolbar-btn:hover {
//                 background: #e5e7eb;
//                 transform: translateY(-1px);
//             }

//             .toolbar-btn.delete {
//                 background: #ef4444;
//                 color: white;
//             }

//             .toolbar-btn.delete:hover {
//                 background: #dc2626;
//             }

//             .toolbar-btn.add {
//                 background: #10b981;
//                 color: white;
//                 width: auto;
//                 padding: 0 12px;
//                 font-size: 12px;
//                 font-weight: 600;
//             }

//             .toolbar-btn.add:hover {
//                 background: #059669;
//             }

//             /* Image upload */
//             [data-editable="image"] {
//                 cursor: pointer;
//                 border: 2px dashed transparent;
//                 transition: all 0.2s;
//             }

//             [data-editable="image"]:hover {
//                 border-color: #ef4444;
//                 opacity: 0.8;
//             }

//             /* Notification */
//             .edit-notification {
//                 position: fixed;
//                 top: 10px;
//                 right: 10px;
//                 background: #10b981;
//                 color: white;
//                 padding: 8px 16px;
//                 border-radius: 4px;
//                 font-size: 13px;
//                 opacity: 0;
//                 transition: opacity 0.3s;
//                 z-index: 1000;
//             }

//             .edit-notification.show {
//                 opacity: 1;
//             }
//         ` : ''

//         const baseStyles = `
//             <style>
//                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                 body { 
//                     font-family: ${fontFamily}, Arial, sans-serif; 
//                     line-height: 1.6; 
//                     color: #333;
//                     background: white;
//                     padding: 40px;
//                 }
//                 .theme-primary { color: ${themeColor} !important; }
//                 .theme-bg { background-color: ${themeColor} !important; }
//                 .theme-border { border-color: ${themeColor} !important; }
//                 ${editStyles}
//             </style>
//         `

//         // Script cho edit mode
//         const editScript = isEditMode ? `
//             <script>
//                 (function() {
//                     // Bật edit mode
//                     document.body.contentEditable = 'true';
//                     document.designMode = 'on';

//                     // Xử lý paste - chỉ cho phép text plain
//                     document.querySelectorAll('[data-editable]').forEach(function(el) {
//                         if (el.dataset.editable !== 'image') {
//                             el.addEventListener('paste', function(e) {
//                                 e.preventDefault();
//                                 var text = e.clipboardData.getData('text/plain');
//                                 document.execCommand('insertText', false, text);
//                             });

//                             // Gửi message khi có thay đổi
//                             var timeout;
//                             el.addEventListener('input', function() {
//                                 clearTimeout(timeout);
//                                 timeout = setTimeout(function() {
//                                     window.parent.postMessage({
//                                         type: 'change',
//                                         field: el.dataset.field,
//                                         section: el.dataset.section,
//                                         content: el.innerText,
//                                         html: el.innerHTML
//                                     }, '*');

//                                     // Hiện notification
//                                     var notif = document.getElementById('notification');
//                                     if (notif) {
//                                         notif.classList.add('show');
//                                         setTimeout(function() {
//                                             notif.classList.remove('show');
//                                         }, 1500);
//                                     }
//                                 }, 500);
//                             });
//                         } else {
//                             // Xử lý click vào ảnh
//                             el.addEventListener('click', function() {
//                                 window.parent.postMessage({
//                                     type: 'uploadImage',
//                                     field: el.dataset.field,
//                                     section: el.dataset.section
//                                 }, '*');
//                             });
//                         }
//                     });

//                     // Xử lý click section để chọn và thêm toolbar
//                     document.querySelectorAll('.cv-section').forEach(function(section, index) {
//                         var sectionId = section.dataset.section;

//                         // Thêm toolbar nếu chưa có
//                         if (!section.querySelector('.section-toolbar')) {
//                             var toolbar = document.createElement('div');
//                             toolbar.className = 'section-toolbar';

//                             var toolbarHTML = 
//                                 '<button class="toolbar-btn move-up" data-action="moveUp" data-index="' + index + '" title="Di chuyển lên">↑</button>' +
//                                 '<button class="toolbar-btn move-down" data-action="moveDown" data-index="' + index + '" title="Di chuyển xuống">↓</button>' +
//                                 '<button class="toolbar-btn delete" data-action="delete" data-index="' + index + '" title="Xóa mục">✕</button>';

//                             // Thêm nút "+ Thêm" cho các section repeatable
//                             if (['experience', 'education', 'projects', 'certifications', 'languages'].includes(sectionId)) {
//                                 toolbarHTML += '<button class="toolbar-btn add" data-action="add" data-section="' + sectionId + '" title="Thêm mới">+ Thêm</button>';
//                             }

//                             toolbar.innerHTML = toolbarHTML;
//                             section.appendChild(toolbar);
//                         }

//                         section.addEventListener('click', function(e) {
//                             if (e.target.closest('.toolbar-btn')) return;

//                             document.querySelectorAll('.cv-section').forEach(function(s) {
//                                 s.classList.remove('selected');
//                             });
//                             section.classList.add('selected');
//                         });
//                     });

//                     // Xử lý toolbar buttons
//                     document.querySelectorAll('.toolbar-btn').forEach(function(btn) {
//                         btn.addEventListener('click', function(e) {
//                             e.stopPropagation();
//                             window.parent.postMessage({
//                                 type: 'toolbarAction',
//                                 action: btn.dataset.action,
//                                 index: parseInt(btn.dataset.index),
//                                 section: btn.dataset.section
//                             }, '*');
//                         });
//                     });

//                     // Ngăn chặn click links
//                     document.querySelectorAll('a').forEach(function(a) {
//                         a.addEventListener('click', function(e) {
//                             e.preventDefault();
//                         });
//                     });

//                     window.parent.postMessage({ type: 'loaded' }, '*');
//                 })();
//             </script>
//             <div id="notification" class="edit-notification">Đã lưu thay đổi</div>
//         ` : ''

//         // Inject data vào template
//         const getValue = (key) => {
//             const keys = key.split('.')
//             let value = cvData
//             for (const k of keys) {
//                 value = value?.[k]
//                 if (value === undefined || value === null) return ''
//             }
//             return value || ''
//         }

//         // Xử lý template - TÌM VÀ THAY THẾ CÁC FIELD
//         let html = htmlTemplate

//         // Tìm tất cả {{field}} patterns
//         const fieldPattern = /\{\{(\w+(?:\.\w+)*)\}\}/g
//         let match

//         while ((match = fieldPattern.exec(htmlTemplate)) !== null) {
//             const fullMatch = match[0]
//             const key = match[1]
//             const value = getValue(key)
//             const placeholderText = placeholders[key] || ''

//             let replacement
//             if (isEditMode) {
//                 // Tạo editable span với data-placeholder
//                 const section = key.split('.')[0]
//                 replacement = `<span 
//                 data-editable="true" 
//                 data-field="${key}" 
//                 data-section="${section}" 
//                 data-placeholder="${placeholderText}"
//                 style="min-width: 50px; display: inline-block;"
//             >${value}</span>`
//             } else {
//                 replacement = value || placeholderText
//             }

//             html = html.replace(fullMatch, replacement)
//         }

//         return html
//     }, [htmlTemplate, cvData, fontFamily, themeColor, mode, placeholders])

//     // Update iframe
//     useEffect(() => {
//         if (iframeRef.current) {
//             const content = generateEditableHTML()
//             const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
//             doc.open()
//             doc.write(content)
//             doc.close()
//         }
//     }, [generateEditableHTML])

//     // Lắng nghe message từ iframe
//     useEffect(() => {
//         const handleMessage = (e) => {
//             const { type, section, field, content, action, index } = e.data

//             if (type === 'change' && onUpdateField) {
//                 onUpdateField(section, field, content)
//             } else if (type === 'uploadImage') {
//                 console.log('Upload image for:', section, field)
//             } else if (type === 'toolbarAction') {
//                 if (action === 'moveUp') onMoveSection?.(index, 'up')
//                 else if (action === 'moveDown') onMoveSection?.(index, 'down')
//                 else if (action === 'delete') onRemoveSection?.(index)
//                 else if (action === 'add') onAddItem?.(section)
//             }
//         }

//         window.addEventListener('message', handleMessage)
//         return () => window.removeEventListener('message', handleMessage)
//     }, [onUpdateField, onMoveSection, onRemoveSection, onAddItem])

//     return (
//         <div className="cv-preview-editable">
//             <div className="cv-paper-wrapper" style={{ transform: `scale(${zoom / 100})` }}>
//                 <iframe
//                     ref={iframeRef}
//                     className="cv-preview-iframe"
//                     title="CV Preview"
//                     sandbox="allow-same-origin allow-scripts"
//                 />
//             </div>
//         </div>
//     )
// }



import { useRef, useEffect, useState } from 'react'
import './CVPreviewEditable.css'

export default function CVPreviewEditable({
    cvData,
    activeSections,
    fontFamily,
    themeColor,
    backgroundColor,
    lineHeight,
    fontSize,
    zoom,
    mode,
    placeholders,
    templateHtmlPath,
    onMoveSection,
    onRemoveSection,
    onAddItem,
    onRemoveItem,
    onUpdateField,
    onUploadAvatar,
}) {
    const iframeRef = useRef(null)
    const [htmlContent, setHtmlContent] = useState('')
    const isEdit = mode === 'edit'

    // ── Load template HTML once ──
    useEffect(() => {
        if (!templateHtmlPath) return
        fetch(templateHtmlPath)
            .then(r => r.text())
            .then(setHtmlContent)
            .catch(err => console.error('Failed to load template:', err))
    }, [templateHtmlPath])

    // ── Regenerate iframe content on any relevant change ──
    useEffect(() => {
        if (!htmlContent || !iframeRef.current) return

        const doc = iframeRef.current.contentDocument
        if (!doc) return

        const html = generateHTML(htmlContent, {
            cvData,
            activeSections,
            fontFamily,
            themeColor,
            backgroundColor,
            lineHeight,
            fontSize,
            isEdit,
            placeholders,
        })

        doc.open()
        doc.write(html)
        doc.close()

        // Auto-height: expand iframe to fit content
        const resize = () => {
            if (!iframeRef.current) return
            const h = iframeRef.current.contentDocument?.documentElement?.scrollHeight
            if (h) iframeRef.current.style.height = h + 'px'
        }
        setTimeout(resize, 200)
    }, [htmlContent, cvData, activeSections, fontFamily, themeColor, backgroundColor, lineHeight, fontSize, isEdit, placeholders])

    // ── Listen for messages from iframe ──
    useEffect(() => {
        const handler = (e) => {
            if (e.source !== iframeRef.current?.contentWindow) return
            const { type, section, field, value, action, index, sectionId, itemId } = e.data || {}

            switch (type) {
                case 'fieldChange': onUpdateField?.(section, field, value); break
                case 'moveSection': onMoveSection?.(parseInt(index), action); break
                case 'removeSection': onRemoveSection?.(parseInt(index)); break
                case 'addItem': onAddItem?.(sectionId); break
                case 'removeItem': onRemoveItem?.(section, itemId); break
                case 'uploadAvatar': onUploadAvatar?.(); break
            }
        }
        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
    }, [onUpdateField, onMoveSection, onRemoveSection, onAddItem, onRemoveItem, onUploadAvatar])

    if (!templateHtmlPath) return <div className="cv-preview-empty">Chưa chọn template</div>

    // Scale wrapper: need extra bottom space because scale() doesn't affect document flow
    const scale = (zoom || 100) / 100
    // A4 paper is 297mm ≈ 1123px at 96dpi
    const paperH = 1123
    const scaledH = paperH * scale
    const bottomPad = Math.max(0, paperH - scaledH) + 60

    return (
        <div className={`cv-preview-wrapper ${isEdit ? 'edit-mode' : 'preview-mode'}`}>
            {/* Outer div compensates for scale so scroll area is correct */}
            <div
                className="cv-scale-container"
                style={{ paddingBottom: bottomPad }}
            >
                <div
                // className="cv-paper"
                // style={{
                //     transform: `scale(${scale})`,
                //     transformOrigin: 'top center',
                // }}
                >
                    <iframe
                        ref={iframeRef}
                        title="CV Preview"
                        sandbox="allow-same-origin allow-scripts"
                        scrolling="no"
                        style={{ width: '210mm', minHeight: '297mm', border: 'none', display: 'block' }}
                    />
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
//  HTML GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

function generateHTML(template, config) {
    const { cvData, activeSections, themeColor, backgroundColor, lineHeight, fontSize, fontFamily, isEdit, placeholders } = config

    const parser = new DOMParser()
    const doc = parser.parseFromString(template, 'text/html')

    // Inject CSS (chỉ thêm style cho edit mode, không thay đổi layout)
    const style = doc.createElement('style')
    style.textContent = getCSS(themeColor, backgroundColor, lineHeight, fontSize, fontFamily, isEdit)
    doc.head.appendChild(style)

    const container = doc.querySelector('.cv-container') || doc.body

    // ── Map các section có sẵn trong template ──
    const existingSections = new Map()
    doc.querySelectorAll('[data-section-id]').forEach(el => {
        existingSections.set(el.dataset.sectionId, el)
    })

    // ── Xử lý từng active section ──
    activeSections.forEach((id, index) => {
        let el = existingSections.get(id)
        
        if (el) {
            // Section có sẵn trong template → GIỮ NGUYÊN HTML, chỉ inject data và editable
            el.style.display = ''
            el.dataset.section = id
            el.style.position = 'relative'
            
            // Inject data vào template gốc (không xóa layout)
            injectDataIntoTemplate(el, id, cvData, isEdit, placeholders)
            
            if (isEdit) {
                addToolbar(el, id, index, activeSections.length)
            }
        } else {
            // Section không có trong template → tạo mới (trường hợp thêm section động)
            el = createSectionFromScratch(doc, id)
            container.appendChild(el)
            fillNewSectionData(el, id, cvData, isEdit, placeholders)
        }
    })

    // ── Ẩn sections không active ──
    existingSections.forEach((el, id) => {
        if (!activeSections.includes(id)) el.style.display = 'none'
    })

    // ── Sắp xếp lại theo thứ tự activeSections ──
    activeSections.forEach(id => {
        const el = existingSections.get(id)
        if (el && el.parentNode === container) {
            container.appendChild(el)
        }
    })

    if (isEdit) {
        const script = doc.createElement('script')
        script.textContent = getEditScript()
        doc.body.appendChild(script)
    }

    return '<!DOCTYPE html>' + doc.documentElement.outerHTML
}

// Hàm chính: Inject data vào template gốc mà không thay đổi structure
function injectDataIntoTemplate(el, id, cvData, isEdit, placeholders) {
    const data = cvData?.[id]
    
    // Xử lý section title (h2 hoặc .section-title)
    const titleEl = el.querySelector('h2, .section-title, .title, header h3')
    if (titleEl && isEdit) {
        const currentText = titleEl.textContent.trim()
        const userTitle = data?.sectionTitle || currentText
        const defaultTitle = currentText || getDefaultTitle(id)
        
        titleEl.setAttribute('contenteditable', 'true')
        titleEl.dataset.section = id
        titleEl.dataset.field = 'sectionTitle'
        titleEl.dataset.placeholder = defaultTitle
        titleEl.textContent = userTitle
        titleEl.classList.add('cv-editable', 'cv-title')
    }

    // Xử lý các field cụ thể theo từng section type
    switch(id) {
        case 'personal':
            injectPersonalData(el, cvData?.personal, isEdit, placeholders)
            break
        case 'education':
            injectEducationData(el, cvData?.education, isEdit, placeholders)
            break
        case 'experience':
            injectExperienceData(el, cvData?.experience, isEdit, placeholders)
            break
        case 'skills':
            injectSkillsData(el, cvData?.skills, isEdit, placeholders)
            break
        case 'summary':
            injectSummaryData(el, data, isEdit, placeholders)
            break
        default:
            // Generic: tìm tất cả text node và cho phép edit
            injectGenericData(el, data, id, isEdit, placeholders)
    }
}

function injectPersonalData(el, data, isEdit, placeholders) {
    if (!data) return
    
    // Map các field thông dụng
    const fieldMap = {
        'fullName': ['h1', '.name', '.full-name', '[data-field="fullName"]'],
        'jobTitle': ['.title', '.job-title', '.position', '[data-field="jobTitle"]'],
        'email': ['[data-field="email"]', '.email'],
        'phone': ['[data-field="phone"]', '.phone'],
        'address': ['[data-field="address"]', '.address', '.location'],
        'linkedin': ['[data-field="linkedin"]', '.linkedin'],
        'github': ['[data-field="github"]', '.github'],
        'birthDate': ['[data-field="birthDate"]', '.birth-date'],
        'gender': ['[data-field="gender"]', '.gender']
    }
    
    Object.entries(fieldMap).forEach(([field, selectors]) => {
        const value = data[field] || ''
        const placeholder = placeholders?.[`personal.${field}`] || ''
        
        for (const selector of selectors) {
            const node = el.querySelector(selector)
            if (node) {
                if (isEdit) {
                    node.setAttribute('contenteditable', 'true')
                    node.dataset.section = 'personal'
                    node.dataset.field = field
                    node.dataset.placeholder = placeholder
                    node.textContent = value || placeholder
                    node.classList.add('cv-editable')
                    if (!value) node.classList.add('cv-placeholder')
                } else {
                    node.textContent = value || node.textContent
                }
                break
            }
        }
    })

    // Xử lý avatar
    const img = el.querySelector('img[data-field="avatar"], .avatar-wrapper img, img[alt*="avatar"]')
    if (img) {
        if (data?.avatar) img.src = data.avatar
        if (isEdit) {
            img.style.cursor = 'pointer'
            img.title = 'Nhấn để đổi ảnh'
        }
    }
}

function injectEducationData(el, items, isEdit, placeholders) {
    if (!Array.isArray(items) || items.length === 0) {
        // Nếu không có data, để nguyên template gốc nhưng cho phép edit như placeholder
        if (isEdit) makeTemplateEditable(el, 'education', placeholders)
        return
    }
    
    // Tìm item template đầu tiên trong section
    const itemTemplate = el.querySelector('.education-item, .item, [data-item]') || el
    
    items.forEach((item, index) => {
        let itemEl
        if (index === 0) {
            itemEl = itemTemplate
        } else {
            // Clone thêm item nếu có nhiều hơn 1
            itemEl = itemTemplate.cloneNode(true)
            itemTemplate.parentNode.appendChild(itemEl)
        }
        
        itemEl.dataset.itemId = item.id || index
        
        // Map các field
        const fields = {
            'school': ['[data-field="school"]', '.school', '.university', 'h3', '.institution'],
            'degree': ['[data-field="degree"]', '.degree', '.major', '.bold'],
            'time': ['[data-field="time"]', '.time', '.year', '.date'],
            'gpa': ['[data-field="gpa"]', '.gpa']
        }
        
        Object.entries(fields).forEach(([field, selectors]) => {
            const value = item[field] || ''
            const placeholder = placeholders?.[`education.${field}`] || ''
            
            for (const selector of selectors) {
                const node = itemEl.querySelector(selector)
                if (node) {
                    if (isEdit) {
                        node.setAttribute('contenteditable', 'true')
                        node.dataset.section = 'education'
                        node.dataset.field = `${field}_${index}`
                        node.dataset.placeholder = placeholder
                        node.textContent = value || placeholder
                        node.classList.add('cv-editable')
                        if (!value) node.classList.add('cv-placeholder')
                    } else {
                        node.textContent = value || node.textContent
                    }
                    break
                }
            }
        })
        
        // Xử lý list thành tích nếu có
        const listItems = itemEl.querySelectorAll('li, .achievement-list li')
        if (item.achievements && Array.isArray(item.achievements)) {
            listItems.forEach((li, idx) => {
                if (isEdit) {
                    li.setAttribute('contenteditable', 'true')
                    li.dataset.section = 'education'
                    li.dataset.field = `achievement${idx}_${index}`
                    li.dataset.placeholder = 'Thành tích...'
                    li.textContent = item.achievements[idx] || ''
                    li.classList.add('cv-editable')
                }
            })
        }
    })
}

function injectExperienceData(el, items, isEdit, placeholders) {
    if (!Array.isArray(items) || items.length === 0) {
        if (isEdit) makeTemplateEditable(el, 'experience', placeholders)
        return
    }
    
    const itemTemplate = el.querySelector('.timeline-item, .experience-item, .job, [data-item]') || el
    
    items.forEach((item, index) => {
        let itemEl
        if (index === 0) {
            itemEl = itemTemplate
        } else {
            itemEl = itemTemplate.cloneNode(true)
            itemTemplate.parentNode.appendChild(itemEl)
        }
        
        itemEl.dataset.itemId = item.id || index
        
        const fields = {
            'company': ['[data-field="company"]', '.company', 'h3', '.timeline-title'],
            'position': ['[data-field="position"]', '.position', '.role', '.job-title', '.timeline-subtitle'],
            'time': ['[data-field="time"]', '.time', '.duration', '.date', '.timeline-period'],
            'description': ['[data-field="description"]', '.description', '.desc']
        }
        
        Object.entries(fields).forEach(([field, selectors]) => {
            const value = item[field] || ''
            const placeholder = placeholders?.[`experience.${field}`] || ''
            
            for (const selector of selectors) {
                const nodes = itemEl.querySelectorAll(selector)
                nodes.forEach((node, idx) => {
                    if (isEdit) {
                        node.setAttribute('contenteditable', 'true')
                        node.dataset.section = 'experience'
                        node.dataset.field = `${field}_${index}_${idx}`
                        node.dataset.placeholder = placeholder
                        node.textContent = value || placeholder
                        node.classList.add('cv-editable')
                        if (!value) node.classList.add('cv-placeholder')
                    } else {
                        node.textContent = value || node.textContent
                    }
                })
            }
        })
    })
}

function injectSkillsData(el, data, isEdit, placeholders) {
    // Xử lý bảng kỹ năng hoặc list kỹ năng
    const rows = el.querySelectorAll('tr, .skill-row, .skill-item')
    
    if (data?.items && Array.isArray(data.items)) {
        rows.forEach((row, index) => {
            if (data.items[index]) {
                const nameCell = row.querySelector('.skill-name, td:first-child, .name')
                const levelCell = row.querySelector('.skill-level, td:last-child, .level')
                
                if (nameCell && isEdit) {
                    nameCell.setAttribute('contenteditable', 'true')
                    nameCell.dataset.section = 'skills'
                    nameCell.dataset.field = `name_${index}`
                    nameCell.dataset.placeholder = 'Tên kỹ năng'
                    nameCell.textContent = data.items[index].name || ''
                    nameCell.classList.add('cv-editable')
                }
                
                if (levelCell && isEdit) {
                    levelCell.setAttribute('contenteditable', 'true')
                    levelCell.dataset.section = 'skills'
                    levelCell.dataset.field = `level_${index}`
                    levelCell.dataset.placeholder = 'Trình độ'
                    levelCell.textContent = data.items[index].level || ''
                    levelCell.classList.add('cv-editable')
                }
            }
        })
    } else if (isEdit) {
        makeTemplateEditable(el, 'skills', placeholders)
    }
}

function injectSummaryData(el, data, isEdit, placeholders) {
    const contentEl = el.querySelector('p, .summary-content, .content') || el
    const value = data?.summary || ''
    const placeholder = placeholders?.['summary.summary'] || 'Mô tả ngắn gọn...'
    
    if (isEdit) {
        contentEl.setAttribute('contenteditable', 'true')
        contentEl.dataset.section = 'summary'
        contentEl.dataset.field = 'summary'
        contentEl.dataset.placeholder = placeholder
        contentEl.textContent = value || placeholder
        contentEl.classList.add('cv-editable')
        if (!value) contentEl.classList.add('cv-placeholder')
    } else {
        contentEl.textContent = value || contentEl.textContent
    }
}

// Hàm phụ trợ: Làm cho template gốc có thể edit (khi chưa có data)
function makeTemplateEditable(el, section, placeholders) {
    el.querySelectorAll('*').forEach(node => {
        if (node.children.length > 0) return
        if (['SCRIPT', 'STYLE', 'IMG', 'SVG'].includes(node.tagName)) return
        
        const text = node.textContent.trim()
        if (!text) return
        
        // Tìm field phù hợp dựa trên text
        const field = guessFieldFromContent(text, section)
        const placeholder = placeholders?.[`${section}.${field}`] || text
        
        node.setAttribute('contenteditable', 'true')
        node.dataset.section = section
        node.dataset.field = `${field}_0`
        node.dataset.placeholder = placeholder
        node.classList.add('cv-editable', 'cv-placeholder')
        // Giữ nguyên text gốc làm placeholder
    })
}

function guessFieldFromContent(text, section) {
    const t = text.toLowerCase()
    const maps = {
        education: {
            'trường': 'school', 'đại học': 'school', 'học': 'school',
            'bằng': 'degree', 'chuyên ngành': 'degree',
            'năm': 'time', 'thời gian': 'time'
        },
        experience: {
            'công ty': 'company', 'tên công ty': 'company',
            'vị trí': 'position', 'chức vụ': 'position',
            'mô tả': 'description', 'chi tiết': 'description'
        }
    }
    
    const map = maps[section] || {}
    for (const [key, val] of Object.entries(map)) {
        if (t.includes(key)) return val
    }
    return 'content'
}

function getDefaultTitle(id) {
    const titles = {
        personal: 'Thông tin cá nhân',
        summary: 'Mục tiêu nghề nghiệp',
        experience: 'Kinh nghiệm làm việc',
        education: 'Học vấn',
        skills: 'Kỹ năng',
        projects: 'Dự án',
        certifications: 'Chứng chỉ',
        languages: 'Ngoại ngữ',
        activities: 'Hoạt động',
        hobbies: 'Sở thích'
    }
    return titles[id] || id.toUpperCase()
}

// Xóa các hàm wipeTemplateContent, processSection cũ
// Thay bằng logic trên

// Hàm mới: Inject editable vào section có sẵn mà không xóa nội dung
function injectEditableToExistingSection(el, id, cvData, isEdit, placeholders) {
    if (!isEdit) return

    const data = cvData?.[id] || {}
    
    // Tìm tất cả phần tử có text và cho phép edit
    el.querySelectorAll('*').forEach(node => {
        // Bỏ qua nếu là container có con, hoặc là script/style
        if (node.children.length > 0) return
        if (['SCRIPT', 'STYLE', 'SVG', 'IMG'].includes(node.tagName)) return
        
        const originalText = node.textContent.trim()
        if (!originalText) return
        
        // Xác định field name từ text content hoặc data-field
        let field = node.dataset.field
        if (!field) {
            field = guessFieldFromText(originalText, id)
        }
        if (!field) return

        // Lấy giá trị user đã lưu (nếu có)
        let userValue = ''
        if (id === 'personal' && data[field]) {
            userValue = data[field]
        } else if (Array.isArray(data)) {
            // Tìm trong array items...
            const itemIndex = 0 // Giả sử item đầu tiên cho section đơn giản
            if (data[itemIndex]?.[field]) userValue = data[itemIndex][field]
        } else if (data[field]) {
            userValue = data[field]
        }

        const placeholderText = placeholders?.[`${id}.${field}`] || originalText
        
        // QUAN TRỌNG: Hiển thị placeholder text thực tế, không để trống
        const displayValue = userValue || placeholderText
        
        node.setAttribute('contenteditable', 'true')
        node.dataset.section = id
        node.dataset.field = field
        node.dataset.placeholder = placeholderText
        node.textContent = displayValue
        
        node.classList.add('cv-editable')
        if (!userValue) {
            node.classList.add('cv-placeholder') // Đánh dấu đây là placeholder
        }
    })

    // Xử lý riêng cho section title (h2)
    const titleEl = el.querySelector('h2, .section-title')
    if (titleEl && !titleEl.hasAttribute('contenteditable')) {
        const defaultTitles = {
            personal: 'Thông tin cá nhân', summary: 'Mục tiêu nghề nghiệp',
            experience: 'Kinh nghiệm làm việc', education: 'Học vấn',
            skills: 'Kỹ năng', projects: 'Dự án',
            certifications: 'Chứng chỉ', languages: 'Ngoại ngữ',
            activities: 'Hoạt động', hobbies: 'Sở thích'
        }
        const currentText = titleEl.textContent.trim()
        const defaultText = defaultTitles[id] || id
        
        titleEl.setAttribute('contenteditable', 'true')
        titleEl.dataset.section = id
        titleEl.dataset.field = 'sectionTitle'
        titleEl.dataset.placeholder = defaultText
        titleEl.textContent = currentText || defaultText
        titleEl.classList.add('cv-editable', 'cv-section-title')
    }
}

function guessFieldFromText(text, sectionId) {
    const t = text.toLowerCase()
    const map = {
        personal: {
            'họ và tên': 'fullName', 'full name': 'fullName',
            'vị trí': 'jobTitle', 'chức danh': 'jobTitle',
            'email': 'email', 'số điện thoại': 'phone', 'điện thoại': 'phone',
            'địa chỉ': 'address', 'linkedin': 'linkedin', 'github': 'github'
        },
        education: {
            'trường': 'school', 'đại học': 'school', 'bằng cấp': 'degree',
            'chuyên ngành': 'degree', 'gpa': 'gpa', 'thời gian': 'time'
        },
        experience: {
            'công ty': 'company', 'vị trí': 'position', 'mô tả': 'description',
            'thành tích': 'description', 'thời gian': 'time'
        }
    }
    
    const sectionMap = map[sectionId] || {}
    for (const [key, value] of Object.entries(sectionMap)) {
        if (t.includes(key)) return value
    }
    return 'content'
}

//  SECTION DETECTOR
// ─────────────────────────────────────────────────────────────────────────────

function detectSectionId(el) {
    const cls = (el.className || '').toLowerCase()
    const text = (el.textContent || '').toLowerCase().slice(0, 100)
    if (cls.includes('personal') || cls.includes('header')) return 'personal'
    if (cls.includes('summary') || text.includes('mục tiêu') || text.includes('career objective')) return 'summary'
    if (cls.includes('experience') || text.includes('kinh nghiệm')) return 'experience'
    if (cls.includes('education') || text.includes('học vấn')) return 'education'
    if (cls.includes('skill') || text.includes('kỹ năng')) return 'skills'
    if (cls.includes('project') || text.includes('dự án')) return 'projects'
    if (cls.includes('certif') || text.includes('chứng chỉ')) return 'certifications'
    if (cls.includes('language') || text.includes('ngoại ngữ')) return 'languages'
    if (cls.includes('activ') || text.includes('hoạt động')) return 'activities'
    if (cls.includes('hobb') || text.includes('sở thích')) return 'hobbies'
    return null
}

// ─────────────────────────────────────────────────────────────────────────────
//  WIPE — clear default text, make placeholders (only called when el exists)
// ─────────────────────────────────────────────────────────────────────────────

function wipeTemplateContent(el) {
    // // Guard: el must be a real DOM element with querySelectorAll
    // if (!el || typeof el.querySelectorAll !== 'function') return

    // el.querySelectorAll('*').forEach(node => {
    //     if (node.children.length > 0) return
    //     const text = node.textContent.trim()
    //     if (!text) return
    //     node.textContent = ''
    //     node.classList.add('cv-placeholder')
    // })
}

// ─────────────────────────────────────────────────────────────────────────────
//  CREATE SECTION (when template doesn't have one)
// ─────────────────────────────────────────────────────────────────────────────

function createSection(doc, id) {
    const section = doc.createElement('section')
    section.className = `cv-section cv-section-${id}`
    section.dataset.section = id
    section.dataset.sectionId = id

    const titles = {
        personal: 'Thông tin cá nhân', summary: 'Mục tiêu nghề nghiệp',
        experience: 'Kinh nghiệm làm việc', education: 'Học vấn',
        skills: 'Kỹ năng', projects: 'Dự án',
        certifications: 'Chứng chỉ', languages: 'Ngoại ngữ',
        activities: 'Hoạt động', hobbies: 'Sở thích',
    }

    const tmplHtml = buildItemTemplate(id)

    section.innerHTML = `
        <h2 class="section-title">${titles[id] || id}</h2>
        <div class="section-content">
            <div class="item-template" style="display:none">${tmplHtml}</div>
        </div>
    `
    return section
}

function buildItemTemplate(id) {
    switch (id) {
        case 'experience':
        case 'activities':
            return `
                <div class="item-row">
                    <span class="item-left" data-field="position" data-placeholder="Vị trí công việc"></span>
                    <span class="item-right" data-field="time" data-placeholder="Bắt đầu – Kết thúc"></span>
                </div>
                <div class="item-sub" data-field="company" data-placeholder="Tên công ty / Tổ chức"></div>
                <div class="item-desc" data-field="description" data-placeholder="Mô tả công việc..." data-multiline="true"></div>`
        case 'education':
            return `
                <div class="item-row">
                    <span class="item-left" data-field="school" data-placeholder="Tên trường học"></span>
                    <span class="item-right" data-field="time" data-placeholder="YYYY – YYYY"></span>
                </div>
                <div class="item-sub" data-field="degree" data-placeholder="Bằng cấp / Chuyên ngành"></div>
                <div class="item-desc" data-field="description" data-placeholder="Mô tả..." data-multiline="true"></div>`
        case 'projects':
            return `
                <div class="item-row">
                    <span class="item-left" data-field="role" data-placeholder="Vai trò trong dự án"></span>
                    <span class="item-right" data-field="time" data-placeholder="Bắt đầu – Kết thúc"></span>
                </div>
                <div class="item-project-name" data-field="projectName" data-placeholder="Tên dự án"></div>
                <div class="item-desc" data-field="description" data-placeholder="Mô tả dự án..." data-multiline="true"></div>`
        case 'certifications':
            return `
                <div class="item-row cert-row">
                    <span class="item-time" data-field="time" data-placeholder="Thời gian"></span>
                    <span class="item-name" data-field="name" data-placeholder="Tên chứng chỉ / Giải thưởng"></span>
                </div>`
        case 'languages':
            return `
                <div class="item-row lang-row">
                    <span class="item-name" data-field="name" data-placeholder="Tiếng Anh / Tiếng Nhật..."></span>
                    <span class="item-level" data-field="level" data-placeholder="IELTS 7.5 / N2..."></span>
                </div>`
        case 'skills':
            return `
                <div class="item-row skill-row">
                    <span class="skill-name" data-field="name" data-placeholder="Tên kỹ năng"></span>
                    <span class="skill-level" data-field="level" data-placeholder="Thành thạo / 5 năm..."></span>
                </div>`
        default:
            return `<div data-field="content" data-placeholder="Nội dung..." data-multiline="true"></div>`
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROCESS SECTION
// ─────────────────────────────────────────────────────────────────────────────

// function processSection(el, id, cvData, isEdit, placeholders, doc) {
//     if (!el) return
//     const data = cvData?.[id]

//      // ── XỬ LÝ TIÊU ĐỀ SECTION (cho phép edit) ─────────────────────────────
//     const titleEl = el.querySelector('.section-title') || el.querySelector('h2')
//     if (titleEl && isEdit) {
//         const defaultTitles = {
//             personal: 'Thông tin cá nhân',
//             summary: 'Mục tiêu nghề nghiệp',
//             experience: 'Kinh nghiệm làm việc',
//             education: 'Học vấn',
//             skills: 'Kỹ năng',
//             projects: 'Dự án',
//             certifications: 'Chứng chỉ',
//             languages: 'Ngoại ngữ',
//             activities: 'Hoạt động',
//             hobbies: 'Sở thích'
//         }
//         const currentTitle = titleEl.textContent.trim() || defaultTitles[id] || id
//         titleEl.setAttribute('contenteditable', 'true')
//         titleEl.dataset.section = id
//         titleEl.dataset.field = 'sectionTitle'
//         titleEl.classList.add('cv-editable', 'cv-section-title-editable')
//         // Giữ nguyên text hiện tại, không xóa thành placeholder
//         titleEl.dataset.placeholder = defaultTitles[id] || id
//     }


//     // ── PERSONAL ──────────────────────────────────────────────────────────────
//     if (id === 'personal') {
//         const img = el.querySelector('img')
//         if (img && isEdit) {
//             img.style.cursor = 'pointer'
//             img.title = 'Nhấn để đổi ảnh'
//             if (data?.avatar) img.src = data.avatar
//         }

//         el.querySelectorAll('h1, h2, h3, p, span, div, li, a').forEach(node => {
//             if (node.querySelector('img, svg')) return
//             if (node.children.length > 0) {
//                 const hasBlock = Array.from(node.children).some(c =>
//                     ['DIV', 'SECTION', 'UL', 'OL', 'TABLE'].includes(c.tagName))
//                 if (hasBlock) return
//             }

//             const rawText = node.textContent.trim()
//             if (!rawText && !node.dataset.field) return

//             const field = node.dataset.field || guessPersonalField(node, rawText)
//             const userValue = data?.[field] || ''
//             const ph = placeholders?.[`personal.${field}`] || getDefaultPlaceholder(field)

//             if (isEdit) {
//                 node.setAttribute('contenteditable', 'true')
//                 node.dataset.section = 'personal'
//                 node.dataset.field = field
//                 node.dataset.placeholder = ph
//                 node.textContent = userValue
//                 node.classList.add('cv-editable')
//                 if (!userValue) node.classList.add('cv-placeholder')
//             } else {
//                 node.textContent = userValue || rawText
//             }
//         })
//         return
//     }

//     // ── SUMMARY ───────────────────────────────────────────────────────────────
//     if (id === 'summary') {
//         const content = el.querySelector('[data-field="summary"], .summary-content, p') || el
//         const originalText = content.textContent.trim()
//         const userValue = data?.summary || ''

//         if (isEdit) {
//             content.setAttribute('contenteditable', 'true')
//             content.dataset.section = 'summary'
//             content.dataset.field = 'summary'
//             content.dataset.placeholder = originalText || 'Mô tả ngắn gọn về bản thân và mục tiêu...'
//             content.dataset.multiline = 'true'
//             content.textContent = userValue
//             content.classList.add('cv-editable')
//             if (!userValue) content.classList.add('cv-placeholder')
//         } else {
//             content.textContent = userValue || originalText
//         }
//         return
//     }

//     // ── HOBBIES ───────────────────────────────────────────────────────────────
//     if (id === 'hobbies') {
//         const content = el.querySelector('p, div:not([class*="title"])') || el
//         const originalText = content.textContent.trim()
//         const userValue = typeof data === 'string' ? data : ''

//         if (isEdit) {
//             content.setAttribute('contenteditable', 'true')
//             content.dataset.section = 'hobbies'
//             content.dataset.field = 'hobbies'
//             content.dataset.placeholder = originalText || 'Mô tả sở thích của bạn...'
//             content.dataset.multiline = 'true'
//             content.textContent = userValue
//             content.classList.add('cv-editable')
//             if (!userValue) content.classList.add('cv-placeholder')
//         } else {
//             content.textContent = userValue || originalText
//         }
//         return
//     }

//     // ── LIST SECTIONS ─────────────────────────────────────────────────────────
//     const items = Array.isArray(data) ? data : (data?.items || [])
//     const sectionContent = el.querySelector('.section-content') || el
//     const tmpl = sectionContent.querySelector('.item-template')

//     // Remove previously rendered items (keep template)
//     sectionContent.querySelectorAll('.cv-item').forEach(e => e.remove())

//     // Case A: no user data → show placeholder from template structure
//     if (items.length === 0 && isEdit) {
//         // Find existing "real" content rows in the template
//         const existingItems = Array.from(sectionContent.children).filter(child =>
//             !child.classList.contains('item-template') &&
//             !child.classList.contains('cv-item') &&
//             child.textContent.trim()
//         )

//         if (existingItems.length > 0) {
//             existingItems.forEach((origItem, idx) => {
//                 const clone = origItem.cloneNode(true)
//                 clone.classList.add('cv-item', 'cv-placeholder-item')

//                 clone.querySelectorAll('*').forEach(child => {
//                     if (child.children.length > 0) return
//                     const rawText = child.textContent.trim()
//                     if (!rawText) return

//                     const fieldAttr = child.dataset.field || `field_${idx}`
//                     const ph = placeholders?.[`${id}.${fieldAttr}`] || rawText || getDefaultPlaceholder(fieldAttr)

//                     child.setAttribute('contenteditable', 'true')
//                     child.dataset.section = id
//                     child.dataset.field = `${fieldAttr}_0`
//                     child.dataset.placeholder = ph
//                     child.textContent = ''
//                     child.classList.add('cv-editable', 'cv-placeholder')
//                 })

//                 appendDeleteBtn(clone, id, idx)
//                 origItem.replaceWith(clone)
//             })
//         } else if (tmpl) {
//             const clone = tmpl.cloneNode(true)
//             clone.classList.remove('item-template')
//             clone.classList.add('cv-item', 'cv-placeholder-item')
//             clone.style.display = 'block'

//             clone.querySelectorAll('[data-field], [data-placeholder]').forEach(child => {
//                 const fieldKey = child.dataset.field || 'content'
//                 const ph = child.dataset.placeholder || child.textContent.trim() || getDefaultPlaceholder(fieldKey)
//                 child.setAttribute('contenteditable', 'true')
//                 child.dataset.section = id
//                 child.dataset.field = `${fieldKey}_0`
//                 child.dataset.placeholder = ph
//                 child.textContent = ''
//                 child.classList.add('cv-editable', 'cv-placeholder')
//             })

//             appendDeleteBtn(clone, id, 0)
//             sectionContent.appendChild(clone)
//         }
//     }

//     // Case B: user data → render real items
//     items.forEach((item, idx) => {
//         let clone
//         if (tmpl) {
//             clone = tmpl.cloneNode(true)
//             clone.classList.remove('item-template')
//         } else {
//             const div = doc.createElement('div')
//             div.innerHTML = buildItemTemplate(id)
//             clone = div
//         }
//         clone.classList.add('cv-item')
//         clone.style.display = 'block'
//         clone.dataset.itemId = item.id || idx

//         clone.querySelectorAll('[data-field]').forEach(field => {
//             const rawKey = field.dataset.field.replace(/_\d+$/, '')
//             const value = item?.[rawKey] ?? ''
//             const ph = field.dataset.placeholder || placeholders?.[`${id}.${rawKey}`] || getDefaultPlaceholder(rawKey)

//             if (isEdit) {
//                 field.setAttribute('contenteditable', 'true')
//                 field.dataset.section = id
//                 field.dataset.field = `${rawKey}_${idx}`
//                 field.dataset.placeholder = ph
//                 field.textContent = value
//                 field.classList.add('cv-editable')
//                 if (!value) field.classList.add('cv-placeholder')
//             } else {
//                 field.textContent = value || ph
//             }
//         })

//         if (isEdit) appendDeleteBtn(clone, id, item.id || idx)
//         sectionContent.appendChild(clone)
//     })

//     if (tmpl) tmpl.style.display = 'none'
// }

function appendDeleteBtn(clone, sectionId, itemId) {
    const del = document.createElement('button')
    del.className = 'item-delete'
    del.innerHTML = '×'
    del.setAttribute('onclick',
        `window.parent.postMessage({type:'removeItem',section:'${sectionId}',itemId:'${itemId}'},'*')`)
    clone.appendChild(del)
}

// ─────────────────────────────────────────────────────────────────────────────
//  TOOLBAR
// ─────────────────────────────────────────────────────────────────────────────

function addToolbar(el, id, index, total) {
    if (!el) return
    el.querySelector('.section-toolbar')?.remove()

    const hasAdd = ['experience', 'education', 'projects', 'certifications',
        'languages', 'activities', 'skills'].includes(id)

    const toolbar = document.createElement('div')
    toolbar.className = 'section-toolbar'
    toolbar.innerHTML = `
        <button class="tb-btn tb-move" title="Lên"
            onclick="window.parent.postMessage({type:'moveSection',index:${index},action:'up'},'*')"
            ${index === 0 ? 'disabled' : ''}>↑</button>
        <button class="tb-btn tb-move" title="Xuống"
            onclick="window.parent.postMessage({type:'moveSection',index:${index},action:'down'},'*')"
            ${index === total - 1 ? 'disabled' : ''}>↓</button>
        <button class="tb-btn tb-delete" title="Xóa mục"
            onclick="window.parent.postMessage({type:'removeSection',index:${index}},'*')">×</button>
        ${hasAdd ? `<button class="tb-btn tb-add" title="Thêm mới"
            onclick="window.parent.postMessage({type:'addItem',sectionId:'${id}'},'*')">+ Thêm</button>` : ''}
    `
    el.appendChild(toolbar)
}

// ─────────────────────────────────────────────────────────────────────────────
//  EDIT SCRIPT
// ─────────────────────────────────────────────────────────────────────────────

function getEditScript() {
    return `
(function() {
    document.querySelectorAll('.cv-editable').forEach(function(el) {
        var placeholder = el.dataset.placeholder;
        var originalValue = el.textContent;
        
        el.addEventListener('focus', function() {
            // Nếu là placeholder (chưa có dữ liệu thực), select all để dễ thay thế
            if (this.classList.contains('cv-placeholder')) {
                document.execCommand('selectAll', false, null);
            }
        });
        
        el.addEventListener('input', function() {
            // Khi user nhập, bỏ trạng thái placeholder
            if (this.textContent.trim() !== '') {
                this.classList.remove('cv-placeholder');
            }
        });
        
        el.addEventListener('blur', function() {
            var current = this.textContent.trim();
            // Nếu để trống, trả lại placeholder
            if (current === '') {
                this.textContent = placeholder;
                this.classList.add('cv-placeholder');
            }
        });
        
        // Paste plain text
        el.addEventListener('paste', function(e) {
            e.preventDefault();
            var text = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    });

    // Avatar upload
    document.querySelectorAll('img[title*="ảnh"]').forEach(function(img) {
        img.addEventListener('click', function() {
            window.parent.postMessage({ type: 'uploadAvatar' }, '*');
        });
    });

    // Prevent link navigation
    document.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function(e) { e.preventDefault(); });
    });
})();
`
}
// ─────────────────────────────────────────────────────────────────────────────
//  CSS
// ─────────────────────────────────────────────────────────────────────────────

function getCSS(themeColor, bgColor, lineHeight, fontSize, fontFamily, isEdit) {
    const tc = themeColor || '#C0412A'
    
    return `
        ${isEdit ? `
        /* Chỉ thêm style cho edit mode, không đè lên layout gốc */
        
        [data-section-id] {
            position: relative;
        }
        
        /* Highlight section khi hover - không làm thay đổi layout */
        [data-section-id]:hover {
            outline: 2px dashed ${tc}40;
            outline-offset: 4px;
        }

        /* Editable text - inline style không ảnh hưởng layout */
        .cv-editable {
            border-bottom: 1px dashed transparent;
            transition: all 0.2s;
            cursor: text;
            outline: none;
        }

        .cv-editable:hover {
            border-bottom-color: ${tc}80;
            background: rgba(192, 65, 42, 0.05);
        }

        .cv-editable:focus {
            border-bottom: 2px solid ${tc};
            background: rgba(192, 65, 42, 0.08);
        }

        /* Placeholder style */
        .cv-placeholder {
            color: #9ca3af;
            font-style: italic;
        }

        /* Section title có thể edit */
        .cv-title {
            border: 1px dashed transparent;
            padding: 2px 6px;
            margin: -2px -6px;
            border-radius: 4px;
        }

        .cv-title:hover {
            border-color: ${tc}60;
            background: rgba(192, 65, 42, 0.04);
        }

        /* Toolbar */
        .section-toolbar {
            position: absolute;
            top: -12px;
            right: 8px;
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s;
            background: white;
            padding: 4px 8px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            border: 1px solid #e5e7eb;
            z-index: 1000;
        }

        [data-section-id]:hover .section-toolbar {
            opacity: 1;
        }

        .tb-btn {
            width: 28px;
            height: 28px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            background: #f3f4f6;
            color: #374151;
        }

        .tb-move { background: #6b7280; color: white; }
        .tb-delete { background: #ef4444; color: white; }
        .tb-add { background: ${tc}; color: white; padding: 0 12px; width: auto; font-size: 12px; }

        /* Avatar */
        img[title*="ảnh"] { cursor: pointer; }
        img[title*="ảnh"]:hover { opacity: 0.8; }

        ` : ''}
    `
}
// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function guessPersonalField(node, text) {
    const t = text.toLowerCase()
    const tag = node.tagName?.toLowerCase()
    if (tag === 'h1') return 'fullName'
    if (tag === 'h2' && !t.includes('@')) return 'jobTitle'
    if (t.includes('@') || t.includes('email')) return 'email'
    if (t.includes('linkedin')) return 'linkedin'
    if (t.includes('github')) return 'github'
    if (/\d[\d\s\-()]{7,}/.test(t)) return 'phone'
    if (t.includes('quận') || t.includes('hà nội') || t.includes('hcm') || t.includes('tp.') || t.includes('phường')) return 'address'
    return 'content'
}

function getDefaultPlaceholder(field) {
    const map = {
        fullName: 'Họ và tên', jobTitle: 'Vị trí ứng tuyển',
        email: 'email@example.com', phone: '0123 456 789',
        address: 'Địa chỉ', linkedin: 'linkedin.com/in/username',
        github: 'github.com/username', position: 'Vị trí công việc',
        company: 'Tên công ty', time: 'Bắt đầu – Kết thúc',
        description: 'Mô tả chi tiết...', school: 'Tên trường',
        degree: 'Bằng cấp', role: 'Vai trò', projectName: 'Tên dự án',
        name: 'Tên', level: 'Trình độ', content: 'Nội dung...',
        summary: 'Mô tả ngắn gọn về bản thân và mục tiêu...'
    }
    return map[field] || 'Địa chỉ'
}


// Tạo section mới từ đầu khi template không có section này
function createSectionFromScratch(doc, id) {
    const section = doc.createElement('section')
    section.className = `cv-section cv-section-${id}`
    section.dataset.sectionId = id
    section.dataset.section = id
    
    const titles = {
        personal: 'Thông tin cá nhân',
        summary: 'Mục tiêu nghề nghiệp',
        experience: 'Kinh nghiệm làm việc',
        education: 'Học vấn',
        skills: 'Kỹ năng',
        projects: 'Dự án',
        certifications: 'Chứng chỉ',
        languages: 'Ngoại ngữ',
        activities: 'Hoạt động',
        hobbies: 'Sở thích',
        references: 'Người tham khảo'
    }
    
    const title = titles[id] || id
    
    // Tạo cấu trúc cơ bản
    section.innerHTML = `
        <h2 class="section-title cv-title" data-section="${id}" data-field="sectionTitle">${title}</h2>
        <div class="section-content"></div>
    `
    
    return section
}

// Fill data vào section mạo (khi template không có sẵn)
function fillNewSectionData(el, id, cvData, isEdit, placeholders) {
    const data = cvData?.[id]
    const contentEl = el.querySelector('.section-content')
    
    if (!contentEl) return
    
    if (id === 'hobbies') {
        const p = doc.createElement('p')
        p.className = 'cv-editable'
        const value = data || ''
        const placeholder = 'Sở thích của bạn...'
        
        if (isEdit) {
            p.setAttribute('contenteditable', 'true')
            p.dataset.section = id
            p.dataset.field = 'hobbies'
            p.dataset.placeholder = placeholder
            p.textContent = value || placeholder
            if (!value) p.classList.add('cv-placeholder')
        } else {
            p.textContent = value
        }
        contentEl.appendChild(p)
    } else if (['experience', 'education', 'projects', 'certifications', 'languages', 'activities'].includes(id)) {
        const items = Array.isArray(data) ? data : []
        
        if (items.length === 0 && isEdit) {
            // Hiển thị 1 item trống để user thêm
            const itemDiv = createEmptyItem(doc, id, 0, placeholders)
            contentEl.appendChild(itemDiv)
        } else {
            items.forEach((item, idx) => {
                const itemDiv = createItemFromData(doc, id, item, idx, isEdit, placeholders)
                contentEl.appendChild(itemDiv)
            })
        }
    }
}

function createEmptyItem(doc, sectionId, index, placeholders) {
    const div = doc.createElement('div')
    div.className = 'cv-item'
    div.dataset.itemId = index
    
    const templates = {
        experience: `
            <div class="item-row">
                <span class="cv-editable cv-placeholder" data-field="position_${index}" data-placeholder="Vị trí công việc">Vị trí công việc</span>
                <span class="cv-editable cv-placeholder" data-field="time_${index}" data-placeholder="Thời gian">Thời gian</span>
            </div>
            <div class="cv-editable cv-placeholder" data-field="company_${index}" data-placeholder="Tên công ty">Tên công ty</div>
            <div class="cv-editable cv-placeholder" data-field="description_${index}" data-placeholder="Mô tả công việc">Mô tả công việc</div>
        `,
        education: `
            <div class="item-row">
                <span class="cv-editable cv-placeholder" data-field="school_${index}" data-placeholder="Tên trường">Tên trường</span>
                <span class="cv-editable cv-placeholder" data-field="time_${index}" data-placeholder="Năm học">Năm học</span>
            </div>
            <div class="cv-editable cv-placeholder" data-field="degree_${index}" data-placeholder="Bằng cấp">Bằng cấp</div>
        `,
        certifications: `
            <div class="cv-editable cv-placeholder" data-field="name_${index}" data-placeholder="Tên chứng chỉ">Tên chứng chỉ</div>
            <span class="cv-editable cv-placeholder" data-field="time_${index}" data-placeholder="Năm nhận">Năm nhận</span>
        `,
        languages: `
            <div class="cv-editable cv-placeholder" data-field="name_${index}" data-placeholder="Ngôn ngữ">Ngôn ngữ</span>
            <span class="cv-editable cv-placeholder" data-field="level_${index}" data-placeholder="Trình độ">Trình độ</span>
        `
    }
    
    const template = templates[sectionId] || `<div class="cv-editable cv-placeholder" data-field="content_${index}" data-placeholder="Nội dung">Nội dung</div>`
    
    div.innerHTML = template
    
    // Thêm sự kiện contenteditable
    div.querySelectorAll('.cv-editable').forEach(el => {
        el.setAttribute('contenteditable', 'true')
        el.dataset.section = sectionId
    })
    
    return div
}

function createItemFromData(doc, sectionId, item, index, isEdit, placeholders) {
    const div = doc.createElement('div')
    div.className = 'cv-item'
    div.dataset.itemId = item.id || index
    
    // Tương tự như trên nhưng fill data thực tế
    // ... (implementation tương tự injectEducationData/injectExperienceData nhưng cho section mới)
    
    return div
}

function injectGenericData(el, data, sectionId, isEdit, placeholders) {
    // Implementation đã có trong câu trả lời trước
    el.querySelectorAll('*').forEach(node => {
        if (node.children.length > 0) return
        if (['SCRIPT', 'STYLE', 'IMG', 'SVG'].includes(node.tagName)) return
        
        const text = node.textContent.trim()
        if (!text) return
        
        const field = guessFieldFromContent(text, sectionId)
        const value = data?.[field] || ''
        const placeholder = placeholders?.[`${sectionId}.${field}`] || text
        
        if (isEdit) {
            node.setAttribute('contenteditable', 'true')
            node.dataset.section = sectionId
            node.dataset.field = field
            node.dataset.placeholder = placeholder
            node.textContent = value || placeholder
            node.classList.add('cv-editable')
            if (!value) node.classList.add('cv-placeholder')
        } else {
            node.textContent = value || text
        }
    })
}