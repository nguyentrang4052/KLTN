import "./MyCVScreen.css";

export default function MyCVScreen({ cvList = [], onNew, onEdit, onDelete }) {
  return (
    <div className="cv-container">
      <div className="cv-header">
        <div>
          <h1 className="cv-title">CV của tôi</h1>
          <p className="cv-subtitle">{cvList.length} CV đã tạo</p>
        </div>

        <div className="cv-header-actions">
          <button onClick={onNew} className="btn-primary">
            + Tạo CV mới
          </button>
        </div>
      </div>

      <div className="cv-content">
        {cvList.length === 0 ? (
          <div className="cv-empty">
            <div className="cv-empty-icon">📄</div>
            <div className="cv-empty-title">Chưa có CV nào</div>
            <button onClick={onNew} className="btn-primary">
              + Tạo CV đầu tiên
            </button>
          </div>
        ) : (
          <div className="cv-grid">
            {cvList.map((cv) => (
              <div key={cv.id} className="cv-card">
                <div
                  className="cv-preview"
                  style={{ background: cv.accent || "#f5f5f5" }}
                  onClick={() => onEdit(cv)}
                >
                  <div className="cv-preview-letter">
                    {cv.name[0]}
                  </div>
                </div>

                <div className="cv-card-body">
                  <div className="cv-name">{cv.name}</div>
                  <div className="cv-meta">
                    {cv.templateId} · {cv.updatedAt}
                  </div>

                  <div className="cv-actions">
                    <button
                      onClick={() => onEdit(cv)}
                      className="btn-edit"
                      style={{ background: cv.accent || "#333" }}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => onDelete(cv.id)}
                      className="btn-delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}