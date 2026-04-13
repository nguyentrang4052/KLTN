import './CVSectionNav.css'

function CVSectionNav({ onSelectTemplate, selectedTemplateId = 'classic' }) {
  const templates = [
    { id: 'classic', name: 'Classic', icon: '🏛', class: 't-classic' },
    { id: 'modern', name: 'Modern', icon: '💎', class: 't-modern' },
    { id: 'minimal', name: 'Minimal', icon: '○', class: 't-minimal' },
    { id: 'bold', name: 'Bold', icon: '⬛', class: 't-bold' },
    { id: 'clean', name: 'Clean', icon: '✦', class: 't-clean' },
    { id: 'pro', name: 'Pro', icon: '★', class: 't-pro' }
  ]

  const sections = [
    { id: 'personal', icon: '👤', label: 'Thông tin cá nhân', hasData: true },
    { id: 'objective', icon: '📝', label: 'Mục tiêu nghề nghiệp', hasData: true },
    { id: 'experience', icon: '💼', label: 'Kinh nghiệm làm việc', hasData: true },
    { id: 'education', icon: '🎓', label: 'Học vấn', hasData: true },
    { id: 'skills', icon: '⚡', label: 'Kỹ năng chuyên môn', hasData: true },
    { id: 'languages', icon: '🌐', label: 'Ngôn ngữ', hasData: true },
    { id: 'projects', icon: '🚀', label: 'Dự án nổi bật', hasData: false },
    { id: 'awards', icon: '🏆', label: 'Giải thưởng / Chứng chỉ', hasData: false },
    { id: 'activities', icon: '🎯', label: 'Hoạt động ngoại khoá', hasData: false },
    { id: 'reference', icon: '🤝', label: 'Người tham chiếu', hasData: false }
  ]

  const handleTemplateClick = (tpl) => {
    if (onSelectTemplate) {
      onSelectTemplate(tpl)
    }
  }

  return (
    <div className="cvb-nav">
      <div className="tpl-section">
        <div className="tpl-title">Mẫu CV</div>
        <div className="tpl-grid">
          {templates.map(tpl => (
            <button
              key={tpl.id}
              className={`tpl-thumb ${selectedTemplateId === tpl.id ? 'sel' : ''}`}
              onClick={() => handleTemplateClick(tpl)}
              style={{
                borderColor: selectedTemplateId === tpl.id ? tpl.color : 'transparent',
                background: selectedTemplateId === tpl.id ? `${tpl.color}15` : '#f8f9fa'
              }}
            >
              <div className={`tpl-inner ${tpl.class}`}>
                <span style={{ fontSize: '18px' }}>{tpl.icon}</span>
                <span className="tpl-name">{tpl.name}</span>
              </div>
              {selectedTemplateId === tpl.id && (
                <div className="tpl-check" style={{ background: tpl.color }}>✓</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="cvb-nav-title">Các mục nội dung</div>

      {sections.map(section => (
        <div key={section.id} className={`cvb-item ${section.id === 'personal' ? 'on' : ''}`}>
          <span className="cvb-icon">{section.icon}</span>
          <span className="cvb-label">{section.label}</span>
          <div className={`cvb-dot ${section.hasData ? '' : 'empty'}`}></div>
        </div>
      ))}

      <div className="ai-cv-card">
        <div className="ai-cv-title">🤖 AI Tối ưu CV</div>
        <div className="ai-cv-text">
          Phần mô tả KN có thể cải thiện. Thêm số liệu cụ thể để tăng 30% cơ hội được gọi phỏng vấn.
        </div>
        <button className="btn btn-amber btn-sm w100">✨ Tối ưu ngay</button>
        <div className="ats-score">
          <span className="ats-label">ATS Score</span>
          <div className="ats-bar-bg">
            <div className="ats-bar-fill"></div>
          </div>
          <span className="ats-value">78%</span>
        </div>
      </div>
    </div>
  )
}

export default CVSectionNav