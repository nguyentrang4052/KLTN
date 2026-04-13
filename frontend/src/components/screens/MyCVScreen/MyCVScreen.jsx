// export default function MyCVScreen({ cvList, onNew, onEdit, onDelete }) {
//   return (
//     <div style={{ minHeight: "100vh", background: "#F2F1EE" }}>
//       <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0, fontFamily: "Playfair Display, serif" }}>CV của tôi</h1>
//           <p style={{ color: "#888", fontSize: 14, margin: "4px 0 0" }}>{cvList.length} CV đã tạo</p>
//         </div>
//         <button onClick={onNew} style={{ padding: "10px 22px", background: "#1a1a1a", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Tải lên CV</button>
//         <button onClick={onNew} style={{ padding: "10px 22px", background: "#1a1a1a", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Tạo CV mới</button>
//       </div>
      
//       <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
//         {cvList.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "80px 20px", color: "#aaa" }}>
//             <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
//             <div style={{ fontSize: 18, fontWeight: 600, color: "#555", marginBottom: 8 }}>Chưa có CV nào</div>
//             <button onClick={onNew} style={{ padding: "12px 28px", background: "#1a1a1a", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Tạo CV đầu tiên</button>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
//             {cvList.map(cv => (
//               <div key={cv.id} style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
//                 <div style={{ height: 200, background: cv.accent || "#f5f5f5", overflow: "hidden", position: "relative", cursor: "pointer" }} onClick={() => onEdit(cv)}>
//                   <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: "bold" }}>{cv.name[0]}</div>
//                 </div>
//                 <div style={{ padding: "14px 16px" }}>
//                   <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 2 }}>{cv.name}</div>
//                   <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>{cv.templateId} · {cv.updatedAt}</div>
//                   <div style={{ display: "flex", gap: 8 }}>
//                     <button onClick={() => onEdit(cv)} style={{ flex: 1, padding: "8px", background: cv.accent || "#333", color: "white", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Chỉnh sửa</button>
//                     <button onClick={() => onDelete(cv.id)} style={{ padding: "8px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>✕</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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