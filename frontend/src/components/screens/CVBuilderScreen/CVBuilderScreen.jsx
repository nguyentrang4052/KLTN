import './CVBuilderScreen.css'
import CVSectionNav from '../../cv/CVSectionNav/CVSectionNav'
import CVEditor from '../../cv/CVEditor/CVEditor'
import CVPreview from '../../cv/CVPreview/CVPreview'
import { useState } from 'react'
import CVTemplateScreen from '../CVTemplateScreen/CVTemplateScreen'

function CVBuilderScreen({ onNavigate }) {
  const [selectedTpl, setSelectedTpl] = useState('classic')
  
  const handleSelectTemplate = (template) => {
    setSelectedTpl(template.id)
    // Template object: { id, name, icon, class, color }
    // Cập nhật CV preview ở đây
  }
  return (
    <div id="s6">
      <div className="app-layout">

        <div className="main-content cv-builder">
          <div className="topbar cv-topbar">
            <div className="topbar-title">✏️ CV Builder — Trần Văn Ngọc</div>
            <div className="topbar-actions">
              {/* <Badge variant="sage" className="auto-save-badge">● Tự động lưu</Badge> */}
              <button className="btn btn-teal btn-sm" onClick={() => onNavigate?.('s2')}>👁 Xem trước</button>

              {/* <button className="btn btn-amber btn-sm">🤖 AI tối ưu ATS</button> */}
              <button className="btn btn-rust btn-sm">📥 Tải PDF</button>
            </div>
          </div>

          <div className="cvb-layout">
            <CVSectionNav
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTpl}
            />

            {/* <CVEditor /> */}
            {/* <CVPreview /> */}
             <CVTemplateScreen templateId={selectedTpl} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick Badge import for this file
function Badge({ children, variant, className }) {
  return <span className={`badge b-${variant} ${className}`}>{children}</span>
}

export default CVBuilderScreen