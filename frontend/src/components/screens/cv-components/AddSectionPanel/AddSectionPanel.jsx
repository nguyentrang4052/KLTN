// import './AddSectionPanel.css'

// export default function AddSectionPanel({ 
//     availableSections, 
//     activeSections, 
//     onAddSection 
// }) {
//     const categories = {
//         basic: 'Thông tin cơ bản',
//         content: 'Nội dung chính',
//         extra: 'Thông tin thêm'
//     }

//     const groupedSections = availableSections.reduce((acc, section) => {
//         if (!acc[section.category]) acc[section.category] = []
//         acc[section.category].push(section)
//         return acc
//     }, {})

//     return (
//         <div className="add-section-panel">
//             <h3 className="panel-title">Thêm mục vào CV</h3>
//             <p className="panel-desc">Click để thêm các mục vào CV của bạn</p>

//             {Object.entries(groupedSections).map(([category, sections]) => (
//                 <div key={category} className="section-category">
//                     <h4 className="category-title">{categories[category]}</h4>
//                     <div className="section-list">
//                         {sections.map(section => {
//                             const isActive = activeSections.includes(section.id)
//                             return (
//                                 <button
//                                     key={section.id}
//                                     className={`section-item ${isActive ? 'active' : ''}`}
//                                     onClick={() => !isActive && onAddSection(section.id)}
//                                     disabled={isActive}
//                                 >
//                                     <span className="section-icon">{section.icon}</span>
//                                     <span className="section-label">{section.label}</span>
//                                     {isActive && <span className="section-check">✓</span>}
//                                 </button>
//                             )
//                         })}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }




import './AddSectionPanel.css'

const CATEGORY_LABELS = {
    basic: '📋 Cơ bản',
    content: '📝 Nội dung',
    extra: '✨ Bổ sung',
}

export default function AddSectionPanel({ availableSections, activeSections, onAddSection, onRemoveSection }) {
    const handleClick = (sectionId) => {
        if (activeSections.includes(sectionId)) {
            // Đã active → xóa (tìm index rồi xóa)
            const index = activeSections.indexOf(sectionId)
            onRemoveSection?.(index)
        } else {
            // Chưa active → thêm
            onAddSection(sectionId)
        }
    }

    return (
        <div className="add-section-panel">
            <p className="add-section-hint">
                Nhấn vào mục để thêm vào CV. Mục đã thêm sẽ được đánh dấu ✓
            </p>

            {['basic', 'content', 'extra'].map(category => (
                <div key={category} className="section-category">
                    <h4 className="category-title">
                        {category === 'basic' && '📋 Cơ bản'}
                        {category === 'content' && '📝 Nội dung'}
                        {category === 'extra' && '✨ Bổ sung'}
                    </h4>

                    <div className="section-list">
                        {availableSections.map(section => {
                            const isActive = activeSections.includes(section.id)
                            return (
                                <button
                                    key={section.id}
                                    className={`section-item ${isActive ? 'active' : ''}`}
                                    onClick={() => handleClick(section.id)}
                                >
                                    <span className="section-icon">{section.icon}</span>
                                    <span className="section-label">{section.label}</span>
                                    {isActive ? (
                                        <span className="section-check" title="Nhấn để xóa">✓</span>
                                    ) : (
                                        <span className="section-add">+</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}