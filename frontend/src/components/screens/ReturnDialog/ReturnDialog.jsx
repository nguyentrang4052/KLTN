export default function ReturnDialog({ 
  template, 
  hasExistingCV, 
  onContinue, 
  onFresh, 
  onUpload, 
  onCreateNew, 
  onCancel,
  isUploading = false,
  uploadError = null
}) {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
      <div style={{ background: "white", borderRadius: 16, width: 420, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: template.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>📄</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", fontFamily: "Playfair Display, serif" }}>
          {hasExistingCV ? `Bạn đã có CV ${template.name}` : `Tạo CV mới với ${template.name}`}
        </h3>
        <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          {hasExistingCV
            ? "Bạn đã từng tạo CV với mẫu này. Bạn muốn tiếp tục chỉnh sửa hay bắt đầu lại từ đầu?"
            : "Bạn chưa từng tạo CV với mẫu này. Bạn có thể tạo CV mới hoặc tải lên CV để tự động điền thông tin."}
        </p>

        {uploadError && (
          <div style={{ 
            background: "#fee2e2", 
            color: "#dc2626", 
            padding: "12px", 
            borderRadius: 8, 
            marginBottom: 16,
            fontSize: 13 
          }}>
            ⚠️ {uploadError}
          </div>
        )}

        {isUploading && (
          <div style={{ 
            background: "#f3f4f6", 
            padding: "16px", 
            borderRadius: 8, 
            marginBottom: 16,
            textAlign: "center",
            fontSize: 14,
            color: "#666"
          }}>
            <div style={{ marginBottom: 8 }}>⏳ Đang phân tích CV...</div>
            <div style={{ fontSize: 12 }}>Vui lòng đợi trong giây lát</div>
          </div>
        )}

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          multiple
          style={{ display: 'none' }}
          id="cv-upload-input"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hasExistingCV ? (
            <>
              <button 
                onClick={onContinue} 
                disabled={isUploading}
                style={{ 
                  padding: "12px", 
                  background: template.accent, 
                  color: "white", 
                  border: "none", 
                  borderRadius: 8, 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.6 : 1
                }}
              >
                ✏️ Tiếp tục chỉnh sửa
              </button>
              <button 
                onClick={onFresh} 
                disabled={isUploading}
                style={{ 
                  padding: "12px", 
                  background: "white", 
                  color: "#333", 
                  border: "1px solid #ddd", 
                  borderRadius: 8, 
                  fontSize: 14, 
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.6 : 1
                }}
              >
                🔄 Tạo lại từ đầu
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onCreateNew} 
                disabled={isUploading}
                style={{ 
                  padding: "12px", 
                  background: template.accent, 
                  color: "white", 
                  border: "none", 
                  borderRadius: 8, 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: isUploading ? "not-allowed" : "pointer",
                  opacity: isUploading ? 0.6 : 1
                }}
              >
                + Tạo CV mới
              </button>
              <label 
                htmlFor="cv-upload-input" 
                style={{ 
                  padding: "12px", 
                  background: isUploading ? "#ccc" : "#1a1a1a", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 8, 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: isUploading ? "not-allowed" : "pointer",
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                📤 {isUploading ? 'Đang xử lý...' : 'Tải lên CV'}
              </label>
            </>
          )}
          <button 
            onClick={onCancel} 
            disabled={isUploading}
            style={{ 
              padding: "12px", 
              background: "transparent", 
              color: "#999", 
              border: "none", 
              fontSize: 13, 
              cursor: isUploading ? "not-allowed" : "pointer"
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}