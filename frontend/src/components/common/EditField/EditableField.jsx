export default function EditableField({ value, onChange, placeholder, multiline, style = {}, isEdit = true }) {
  if (!isEdit) {
    return (
      <span style={{ 
        color: value ? "#333" : "#999", 
        fontStyle: value ? "normal" : "italic",
        fontSize: 13,
        ...style 
      }}>
        {value || placeholder}
      </span>
    );
  }

  const baseStyle = {
    border: "none",
    borderBottom: "1.5px dashed #ccc",
    outline: "none",
    background: "transparent",
    width: "100%",
    fontFamily: "inherit",
    padding: "2px 0",
    fontSize: 13,
    color: "#333",
    transition: "border-color 0.2s",
    lineHeight: 1.5,
    ...style,
  };

  if (multiline) {
    return (
      <textarea
        style={{ ...baseStyle, resize: "vertical", minHeight: 60, border: "1.5px dashed #ccc", padding: "6px 8px", borderRadius: 4 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type="text"
      style={baseStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}