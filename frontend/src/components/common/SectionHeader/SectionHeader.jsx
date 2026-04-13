import { useState } from "react";

export default function SectionHeader({ 
  title, 
  onTitleChange, 
  onMoveUp, 
  onMoveDown, 
  onDelete, 
  onAddItem,
  isFirst, 
  isLast, 
  accent, 
  isEdit,
  styleConfig 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  if (!isEdit) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ 
          fontSize: (styleConfig?.baseFontSize || 13) + 2, 
          fontWeight: "bold",
          color: styleConfig?.accentColor || accent,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 2, background: (styleConfig?.accentColor || accent) + "44" }} />
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 12, padding: "8px 0", borderBottom: `2px solid ${accent}22`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        {isEditing ? (
          <input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={() => { onTitleChange(tempTitle); setIsEditing(false); }}
            onKeyDown={(e) => e.key === "Enter" && (onTitleChange(tempTitle), setIsEditing(false))}
            autoFocus
            style={{
              fontSize: (styleConfig?.baseFontSize || 13) + 2,
              fontWeight: "bold",
              color: styleConfig?.accentColor || accent,
              border: "none",
              borderBottom: `2px solid ${accent}`,
              outline: "none",
              background: "transparent",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              width: "60%",
            }}
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)}
            style={{ 
              fontSize: (styleConfig?.baseFontSize || 13) + 2,
              fontWeight: "bold",
              color: styleConfig?.accentColor || accent,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {title}
            <span style={{ fontSize: 11, opacity: 0.5, fontWeight: "normal" }}>✏️</span>
          </span>
        )}
        <div style={{ flex: 1, height: 2, background: (styleConfig?.accentColor || accent) + "44" }} />
      </div>

      <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
        <button onClick={onMoveUp} disabled={isFirst} style={ctrlBtnStyle(isFirst, "#e8e8e8", "#555")} title="Lên">↑</button>
        <button onClick={onMoveDown} disabled={isLast} style={ctrlBtnStyle(isLast, "#e8e8e8", "#555")} title="Xuống">↓</button>
        <button onClick={onDelete} style={{...ctrlBtnStyle(false, "#fee2e2", "#dc2626"), fontWeight: "bold"}} title="Xóa section">✕</button>
        {onAddItem && (
          <button onClick={onAddItem} style={{...ctrlBtnStyle(false, accent, "white"), fontSize: 16, width: 28, marginLeft: 4}} title="Thêm">+</button>
        )}
      </div>
    </div>
  );
}

const ctrlBtnStyle = (disabled, bg, color) => ({
  width: 28, height: 28, borderRadius: 6, border: "none",
  background: disabled ? "#f5f5f5" : bg,
  color: disabled ? "#ccc" : color,
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
});