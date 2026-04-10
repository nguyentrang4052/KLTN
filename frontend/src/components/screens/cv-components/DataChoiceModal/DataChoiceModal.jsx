import './DataChoiceModal.css'

export default function DataChoiceModal({ cvList, onUseExisting, onCreateNew, onClose }) {
    return (
        <div className="data-choice-overlay" onClick={onClose}>
            <div className="data-choice-modal" onClick={e => e.stopPropagation()}>
                <div className="data-choice-header">
                    <h2>Chọn cách tạo CV</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="data-choice-content">
                    <div className="choice-option" onClick={onCreateNew}>
                        <div className="choice-icon">🆕</div>
                        <div className="choice-info">
                            <h3>Tạo CV từ đầu</h3>
                            <p>Bắt đầu với CV trống và điền thông tin mới</p>
                        </div>
                    </div>

                    {cvList.length > 0 && (
                        <>
                            <div className="choice-divider">
                                <span>hoặc</span>
                            </div>
                            
                            <div className="existing-cvs">
                                <h3>Dùng dữ liệu từ CV trước đó</h3>
                                <div className="cv-list">
                                    {cvList.map(cv => (
                                        <div 
                                            key={cv.id} 
                                            className="cv-item"
                                            onClick={() => onUseExisting(cv.id)}
                                        >
                                            <div className="cv-item-icon">📄</div>
                                            <div className="cv-item-info">
                                                <span className="cv-item-name">{cv.name}</span>
                                                <span className="cv-item-date">Cập nhật: {cv.updatedAt}</span>
                                            </div>
                                            <span className="cv-item-completeness">
                                                {cv.completeness}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
