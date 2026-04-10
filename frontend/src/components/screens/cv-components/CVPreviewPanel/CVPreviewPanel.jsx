import { useEffect, useRef, useCallback } from 'react'
import './CVPreviewPanel.css'

export default function CVPreviewPanel({
    htmlTemplate,
    cvData,
    activeSections,
    fontFamily,
    themeColor,
    zoom,
    mode,
    onMoveSection,
    onRemoveSection,
    onAddItem,
    onUpdateField
}) {
    const iframeRef = useRef(null)

    // Tạo HTML content - chỉ thêm edit features khi ở edit mode
    const generateHTML = useCallback(() => {
        if (!htmlTemplate) return ''

        const isEditMode = mode === 'edit'

        // CSS cho cả 2 mode
        const baseStyles = `
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: ${fontFamily}, Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333;
                    background: white;
                }
                
                ${isEditMode ? `
                /* ===== EDIT MODE STYLES ===== */
                
                /* Editable fields - có thể click và sửa */
                [data-editable="true"] {
                    border: 1px dashed transparent;
                    transition: all 0.2s;
                    cursor: text;
                    display: inline-block;
                    min-width: 20px;
                    min-height: 1.2em;
                    position: relative;
                }
                
                [data-editable="true"]:hover {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.05);
                }
                
                [data-editable="true"]:focus {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    outline: 2px solid rgba(239, 68, 68, 0.2);
                }
                
                [data-editable="true"]:empty:before {
                    content: attr(data-placeholder);
                    color: #999;
                    font-style: italic;
                    pointer-events: none;
                }
                
                /* Image upload */
                [data-editable="image"] {
                    cursor: pointer;
                    border: 2px dashed transparent;
                    transition: all 0.2s;
                }
                
                [data-editable="image"]:hover {
                    border-color: #ef4444;
                    opacity: 0.8;
                }
                
                /* Section với toolbar */
                .cv-section {
                    position: relative;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                    margin: 8px 0;
                    padding: 8px;
                    border-radius: 8px;
                }
                
                .cv-section:hover {
                    border-color: rgba(239, 68, 68, 0.3);
                }
                
                .cv-section.selected {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
                }
                
                /* Toolbar */
                .section-toolbar {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    display: none;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
                    padding: 6px;
                    gap: 6px;
                    z-index: 1000;
                    border: 1px solid #e5e7eb;
                }
                
                .cv-section:hover .section-toolbar,
                .cv-section.selected .section-toolbar {
                    display: flex;
                }
                
                .toolbar-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: #f3f4f6;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.2s;
                    color: #374151;
                }
                
                .toolbar-btn:hover {
                    background: #e5e7eb;
                    transform: translateY(-1px);
                }
                
                .toolbar-btn.delete {
                    background: #ef4444;
                    color: white;
                }
                
                .toolbar-btn.delete:hover {
                    background: #dc2626;
                }
                
                .toolbar-btn.add {
                    background: #10b981;
                    color: white;
                    width: auto;
                    padding: 0 12px;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .toolbar-btn.add:hover {
                    background: #059669;
                }
                
                /* Notification */
                .edit-notification {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #10b981;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 13px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    z-index: 1000;
                }
                
                .edit-notification.show {
                    opacity: 1;
                }
                ` : ''}
                
                /* Theme colors */
                .theme-primary { color: ${themeColor} !important; }
                .theme-bg { background-color: ${themeColor} !important; }
                .theme-border { border-color: ${themeColor} !important; }
            </style>
        `

        // Script chỉ chạy ở edit mode
        const editScript = isEditMode ? `
            <script>
                (function() {
                    // Bật edit mode
                    document.body.contentEditable = 'true';
                    document.designMode = 'on';
                    
                    // Xử lý paste - chỉ cho phép text plain
                    document.querySelectorAll('[data-editable]').forEach(function(el) {
                        if (el.dataset.editable !== 'image') {
                            el.addEventListener('paste', function(e) {
                                e.preventDefault();
                                var text = e.clipboardData.getData('text/plain');
                                document.execCommand('insertText', false, text);
                            });
                            
                            // Gửi message khi có thay đổi
                            var timeout;
                            el.addEventListener('input', function() {
                                clearTimeout(timeout);
                                timeout = setTimeout(function() {
                                    window.parent.postMessage({
                                        type: 'change',
                                        field: el.dataset.field,
                                        section: el.dataset.section,
                                        content: el.innerText,
                                        html: el.innerHTML
                                    }, '*');
                                    
                                    // Hiện notification
                                    var notif = document.getElementById('notification');
                                    if (notif) {
                                        notif.classList.add('show');
                                        setTimeout(function() {
                                            notif.classList.remove('show');
                                        }, 1500);
                                    }
                                }, 500);
                            });
                        } else {
                            // Xử lý click vào ảnh
                            el.addEventListener('click', function() {
                                window.parent.postMessage({
                                    type: 'uploadImage',
                                    field: el.dataset.field,
                                    section: el.dataset.section
                                }, '*');
                            });
                        }
                    });
                    
                    // Xử lý click section
                    document.querySelectorAll('.cv-section').forEach(function(section, index) {
                        // Thêm toolbar nếu chưa có
                        if (!section.querySelector('.section-toolbar')) {
                            var toolbar = document.createElement('div');
                            toolbar.className = 'section-toolbar';
                            toolbar.innerHTML = 
                                '<button class="toolbar-btn move-up" data-action="moveUp" data-index="' + index + '" title="Di chuyển lên">↑</button>' +
                                '<button class="toolbar-btn move-down" data-action="moveDown" data-index="' + index + '" title="Di chuyển xuống">↓</button>' +
                                '<button class="toolbar-btn delete" data-action="delete" data-index="' + index + '" title="Xóa mục">✕</button>';
                            
                            // Thêm nút "+ Thêm" cho các section repeatable
                            var sectionId = section.dataset.section;
                            if (['experience', 'education', 'projects', 'certifications', 'languages'].includes(sectionId)) {
                                toolbar.innerHTML += '<button class="toolbar-btn add" data-action="add" data-section="' + sectionId + '" title="Thêm mới">+ Thêm</button>';
                            }
                            
                            section.appendChild(toolbar);
                        }
                        
                        section.addEventListener('click', function(e) {
                            if (e.target.closest('.toolbar-btn')) return;
                            
                            document.querySelectorAll('.cv-section').forEach(function(s) {
                                s.classList.remove('selected');
                            });
                            section.classList.add('selected');
                        });
                    });
                    
                    // Xử lý toolbar buttons
                    document.querySelectorAll('.toolbar-btn').forEach(function(btn) {
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            window.parent.postMessage({
                                type: 'toolbarAction',
                                action: btn.dataset.action,
                                index: parseInt(btn.dataset.index),
                                section: btn.dataset.section
                            }, '*');
                        });
                    });
                    
                    // Ngăn chặn click links
                    document.querySelectorAll('a').forEach(function(a) {
                        a.addEventListener('click', function(e) {
                            e.preventDefault();
                        });
                    });
                    
                    window.parent.postMessage({ type: 'loaded' }, '*');
                })();
            </script>
            <div id="notification" class="edit-notification">Đã lưu thay đổi</div>
        ` : ''

        // Inject vào HTML
        let html = htmlTemplate
        html = html.replace('</head>', `${baseStyles}</head>`)
        html = html.replace('</body>', `${editScript}</body>`)
        
        return html
    }, [htmlTemplate, fontFamily, themeColor, mode])

    // Update iframe content
    useEffect(() => {
        if (iframeRef.current) {
            const content = generateHTML()
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document
            doc.open()
            doc.write(content)
            doc.close()
        }
    }, [generateHTML])

    // Lắng nghe message từ iframe
    useEffect(() => {
        const handleMessage = (e) => {
            const { type, section, field, content, action, index } = e.data
            
            if (type === 'change' && onUpdateField) {
                onUpdateField(section, field, content)
            } else if (type === 'uploadImage') {
                console.log('Upload image for:', section, field)
            } else if (type === 'toolbarAction') {
                if (action === 'moveUp') onMoveSection?.(index, 'up')
                else if (action === 'moveDown') onMoveSection?.(index, 'down')
                else if (action === 'delete') onRemoveSection?.(index)
                else if (action === 'add') onAddItem?.(section)
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [onUpdateField, onMoveSection, onRemoveSection, onAddItem])

    return (
        <div className="cv-preview-panel">
            <div className="cv-paper-wrapper" style={{ transform: `scale(${zoom / 100})` }}>
                <iframe
                    ref={iframeRef}
                    className="cv-preview-iframe"
                    title="CV Preview"
                    sandbox="allow-same-origin allow-scripts"
                />
            </div>
        </div>
    )
}
