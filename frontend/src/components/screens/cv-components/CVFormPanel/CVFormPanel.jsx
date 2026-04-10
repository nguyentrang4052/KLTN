import './CVFormPanel.css'

export default function CVFormPanel({
    cvData,
    activeSections,
    onUpdateSection,
    onAddItem,
    onRemoveItem,
    moveSection,
    removeSection
}) {
    const renderField = (sectionId, field, value, onChange, placeholder) => (
        <div className="form-field" key={field}>
            <label className="field-label">{placeholder}</label>
            {field.includes('description') || field.includes('summary') ? (
                <textarea
                    className="field-textarea"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                />
            ) : (
                <input
                    type="text"
                    className="field-input"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    )

    const renderPersonalSection = () => {
        const data = cvData.personal || {}
        return (
            <div className="form-section" key="personal">
                <SectionToolbar 
                    title="Thông tin cá nhân"
                    index={activeSections.indexOf('personal')}
                    onMoveUp={() => moveSection(activeSections.indexOf('personal'), 'up')}
                    onMoveDown={() => moveSection(activeSections.indexOf('personal'), 'down')}
                    onRemove={() => removeSection(activeSections.indexOf('personal'))}
                />
                <div className="form-grid">
                    {renderField('personal', 'fullName', data.fullName, 
                        (v) => onUpdateSection('personal', {...data, fullName: v}), 'Họ và tên')}
                    {renderField('personal', 'jobTitle', data.jobTitle, 
                        (v) => onUpdateSection('personal', {...data, jobTitle: v}), 'Chức danh')}
                    {renderField('personal', 'email', data.email, 
                        (v) => onUpdateSection('personal', {...data, email: v}), 'Email')}
                    {renderField('personal', 'phone', data.phone, 
                        (v) => onUpdateSection('personal', {...data, phone: v}), 'Số điện thoại')}
                    {renderField('personal', 'address', data.address, 
                        (v) => onUpdateSection('personal', {...data, address: v}), 'Địa chỉ')}
                    {renderField('personal', 'linkedin', data.linkedin, 
                        (v) => onUpdateSection('personal', {...data, linkedin: v}), 'LinkedIn')}
                    {renderField('personal', 'github', data.github, 
                        (v) => onUpdateSection('personal', {...data, github: v}), 'GitHub')}
                </div>
            </div>
        )
    }

    const renderSummarySection = () => {
        const data = cvData.summary || {}
        return (
            <div className="form-section" key="summary">
                <SectionToolbar 
                    title="Mục tiêu nghề nghiệp"
                    index={activeSections.indexOf('summary')}
                    onMoveUp={() => moveSection(activeSections.indexOf('summary'), 'up')}
                    onMoveDown={() => moveSection(activeSections.indexOf('summary'), 'down')}
                    onRemove={() => removeSection(activeSections.indexOf('summary'))}
                />
                {renderField('summary', 'summary', data.summary, 
                    (v) => onUpdateSection('summary', {summary: v}), 
                    'Mô tả mục tiêu nghề nghiệp của bạn')}
            </div>
        )
    }

    const renderRepeatableSection = (sectionId, title, fields) => {
        const items = cvData[sectionId] || []
        const index = activeSections.indexOf(sectionId)

        return (
            <div className="form-section" key={sectionId}>
                <SectionToolbar 
                    title={title}
                    index={index}
                    onMoveUp={() => moveSection(index, 'up')}
                    onMoveDown={() => moveSection(index, 'down')}
                    onRemove={() => removeSection(index)}
                    onAdd={() => onAddItem(sectionId)}
                    showAdd={true}
                />
                
                {items.length === 0 ? (
                    <div className="empty-items">
                        <p>Chưa có {title.toLowerCase()}. Nhấn "+ Thêm" để thêm mới.</p>
                    </div>
                ) : (
                    <div className="items-list">
                        {items.map((item, idx) => (
                            <div className="item-card" key={item.id || idx}>
                                <div className="item-header">
                                    <span className="item-number">{idx + 1}</span>
                                    <button 
                                        className="item-remove"
                                        onClick={() => onRemoveItem(sectionId, item.id)}
                                        title="Xóa"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="form-grid">
                                    {fields.map(field => (
                                        renderField(
                                            sectionId, 
                                            `${field.key}_${idx}`, 
                                            item[field.key],
                                            (v) => {
                                                const newItems = [...items]
                                                newItems[idx] = {...item, [field.key]: v}
                                                onUpdateSection(sectionId, newItems)
                                            },
                                            field.label
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const renderSkillsSection = () => {
        const data = cvData.skills || {}
        return (
            <div className="form-section" key="skills">
                <SectionToolbar 
                    title="Kỹ năng"
                    index={activeSections.indexOf('skills')}
                    onMoveUp={() => moveSection(activeSections.indexOf('skills'), 'up')}
                    onMoveDown={() => moveSection(activeSections.indexOf('skills'), 'down')}
                    onRemove={() => removeSection(activeSections.indexOf('skills'))}
                />
                {renderField('skills', 'technical', data.technical, 
                    (v) => onUpdateSection('skills', {...data, technical: v}), 
                    'Kỹ năng chuyên môn (mỗi dòng 1 kỹ năng)')}
                {renderField('skills', 'soft', data.soft, 
                    (v) => onUpdateSection('skills', {...data, soft: v}), 
                    'Kỹ năng mềm')}
            </div>
        )
    }

    const sectionRenderers = {
        personal: renderPersonalSection,
        summary: renderSummarySection,
        experience: () => renderRepeatableSection('experience', 'Kinh nghiệm làm việc', [
            { key: 'position', label: 'Vị trí' },
            { key: 'company', label: 'Công ty' },
            { key: 'startDate', label: 'Thời gian bắt đầu' },
            { key: 'endDate', label: 'Thời gian kết thúc' },
            { key: 'description', label: 'Mô tả công việc' },
        ]),
        education: () => renderRepeatableSection('education', 'Học vấn', [
            { key: 'school', label: 'Trường/Trung tâm' },
            { key: 'degree', label: 'Bằng cấp/Chứng chỉ' },
            { key: 'year', label: 'Năm tốt nghiệp' },
            { key: 'description', label: 'Mô tả thêm' },
        ]),
        projects: () => renderRepeatableSection('projects', 'Dự án', [
            { key: 'name', label: 'Tên dự án' },
            { key: 'role', label: 'Vai trò' },
            { key: 'duration', label: 'Thời gian' },
            { key: 'description', label: 'Mô tả dự án' },
        ]),
        certifications: () => renderRepeatableSection('certifications', 'Chứng chỉ', [
            { key: 'name', label: 'Tên chứng chỉ' },
            { key: 'year', label: 'Năm nhận' },
        ]),
        languages: () => renderRepeatableSection('languages', 'Ngoại ngữ', [
            { key: 'name', label: 'Ngôn ngữ' },
            { key: 'level', label: 'Trình độ' },
        ]),
        skills: renderSkillsSection,
    }

    return (
        <div className="cv-form-panel">
            <h3 className="panel-title">Chỉnh sửa nội dung</h3>
            <div className="form-sections">
                {activeSections.map(sectionId => {
                    const renderer = sectionRenderers[sectionId]
                    return renderer ? renderer() : null
                })}
            </div>
        </div>
    )
}

// Section Toolbar Component
function SectionToolbar({ title, index, onMoveUp, onMoveDown, onRemove, onAdd, showAdd }) {
    return (
        <div className="section-toolbar">
            <span className="toolbar-title">{title}</span>
            <div className="toolbar-actions">
                <button className="toolbar-btn" onClick={onMoveUp} title="Di chuyển lên">↑</button>
                <button className="toolbar-btn" onClick={onMoveDown} title="Di chuyển xuống">↓</button>
                {showAdd && (
                    <button className="toolbar-btn add" onClick={onAdd} title="Thêm mới">+ Thêm</button>
                )}
                <button className="toolbar-btn delete" onClick={onRemove} title="Xóa section">✕</button>
            </div>
        </div>
    )
}