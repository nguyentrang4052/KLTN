export default function ItemControls({ onUp, onDown, onDelete, isFirst, isLast, accent }) {
  return (
    <div className="item-controls" style={{
      display: "flex", gap: 4, position: "absolute", top: 0, right: 0, zIndex: 10, opacity: 1, transition: "opacity 0.2s"
    }}>
      <button onClick={onUp} disabled={isFirst} style={btnStyle(isFirst, "#e8e8e8", "#555")} title="Lên">↑</button>
      <button onClick={onDown} disabled={isLast} style={btnStyle(isLast, "#e8e8e8", "#555")} title="Xuống">↓</button>
      <button onClick={onDelete} style={{...btnStyle(false, "#fee2e2", "#dc2626"), fontWeight: "bold"}} title="Xóa">✕</button>
    </div>
  );
}

const btnStyle = (disabled, bg, color) => ({
  width: 24, height: 24, borderRadius: 4, border: "none",
  background: disabled ? "#f5f5f5" : bg,
  color: disabled ? "#ccc" : color,
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center"
});