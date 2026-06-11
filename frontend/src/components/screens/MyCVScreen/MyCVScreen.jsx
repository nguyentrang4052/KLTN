import "./MyCVScreen.css";
import { useState } from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import {useNavigate} from "react-router-dom";

export default function MyCVScreen({onNavigate, cvList = [], onNew, onEdit, onDelete }) {
  const [cvToDelete, setCvToDelete] = useState(null);

  const handleDeleteClick = (cv) => {
    setCvToDelete(cv);
  };

  const confirmDelete = () => {
    if (cvToDelete) {
      onDelete(cvToDelete.id);
      setCvToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCvToDelete(null);
  };
  return (
    <div className="cv-container">
        <Sidebar activeItem="my-cv" onNavigate={onNavigate} />
      <main className ="cv-main">
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
                      style={{ background: "#333" }}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cv)}
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
      {cvToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>

            <div className="modal-title">Xác nhận xoá</div>

            <div className="modal-content">
              Bạn có chắc muốn xoá CV <b>{cvToDelete.name}</b> không?
            </div>

            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn-cancel">
                Huỷ
              </button>
              <button onClick={confirmDelete} className="btn-confirm">
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
