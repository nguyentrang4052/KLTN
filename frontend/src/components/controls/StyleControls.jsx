import { useState } from "react";
import { FONT_OPTIONS, DEFAULT_STYLE_CONFIG } from "../../utils/constants";

const ALL_SECTIONS = [
  { key: "contact", label: "Thông tin liên hệ" },
  { key: "summary", label: "Mục tiêu nghề nghiệp" },
  { key: "education", label: "Học vấn" },
  { key: "skills", label: "Kỹ năng" },
  { key: "experiences", label: "Kinh nghiệm làm việc" },
  { key: "awards", label: "Thành tích & Giải thưởng" },
  { key: "certifications", label: "Chứng chỉ" },
  { key: "activities", label: "Hoạt động ngoại khóa" }
];

export default function StyleControls({ 
  styleConfig, 
  onChange, 
  accent,
  sectionOrder,
  setSectionOrder
}) {
  const [isOpen, setIsOpen] = useState(false);

  const updateStyle = (key, value) =>
    onChange({ ...styleConfig, [key]: value });

  const colors = [
    "#2C3E6B", "#1A6B5A", "#1C1C1C", "#8B1A1A",
    "#5B2D8E", "#D97706", "#059669", "#DC2626"
  ];

  const textColors = [
    "#111111", "#333333", "#555555", "#000000", "#1f2937"
  ];

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          left: 20,
          top: 120,
          zIndex: 1000,
          padding: "12px 16px",
          background: "#736b6b" ,
          color: "black", 
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
      >
        ⚙️ Thiết kế
      </button>
    );

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 20,
          top: 130,
          width: 300,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          zIndex: 1001,
          padding: 20,
          maxHeight: "85vh",
          overflowY: "auto"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16 }}>Thiết kế & Font</h3>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              border: "none",
              background: "none",
              fontSize: 18,
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* FONT */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">FONT CHỮ</label>
          <select
            value={styleConfig.fontFamily}
            onChange={(e) => updateStyle("fontFamily", e.target.value)}
            style={inputStyle}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* FONT SIZE */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">
            CỠ CHỮ: {styleConfig.baseFontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="16"
            value={styleConfig.baseFontSize}
            onChange={(e) =>
              updateStyle("baseFontSize", parseInt(e.target.value))
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* LINE HEIGHT */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">
            KHOẢNG CÁCH DÒNG: {styleConfig.lineHeight}
          </label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={styleConfig.lineHeight}
            onChange={(e) =>
              updateStyle("lineHeight", parseFloat(e.target.value))
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* STYLE */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">KIỂU CHỮ</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["bold", "italic", "underline"].map((type) => {
              const active =
                (type === "bold" && styleConfig.fontWeight === "bold") ||
                (type === "italic" && styleConfig.fontStyle === "italic") ||
                (type === "underline" &&
                  styleConfig.textDecoration === "underline");

              return (
                <button
                  key={type}
                  onClick={() => {
                    if (type === "bold")
                      updateStyle(
                        "fontWeight",
                        active ? "normal" : "bold"
                      );
                    if (type === "italic")
                      updateStyle(
                        "fontStyle",
                        active ? "normal" : "italic"
                      );
                    if (type === "underline")
                      updateStyle(
                        "textDecoration",
                        active ? "none" : "underline"
                      );
                  }}
                  style={{
                    flex: 1,
                    padding: 8,
                    border: `1px solid ${active ? accent : "#ddd"}`,
                    background: active ? accent + "20" : "white",
                    color: active ? accent : "#333",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12
                  }}
                >
                  {type === "bold"
                    ? "Đậm"
                    : type === "italic"
                    ? "Nghiêng"
                    : "Gạch chân"}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCENT COLOR */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">MÀU CHỦ ĐỀ</label>
          <div style={colorGrid}>
            {colors.map((c) => (
              <ColorBtn
                key={c}
                color={c}
                active={styleConfig.accentColor === c}
                onClick={() => updateStyle("accentColor", c)}
              />
            ))}
          </div>

          <input
            type="color"
            value={styleConfig.accentColor}
            onChange={(e) =>
              updateStyle("accentColor", e.target.value)
            }
            style={colorInput}
          />
        </div>

        {/* TEXT COLOR */}
        <div style={{ marginBottom: 16 }}>
          <label className="label">MÀU CHỮ</label>
          <div style={colorGrid}>
            {textColors.map((c) => (
              <ColorBtn
                key={c}
                color={c}
                active={styleConfig.textColor === c}
                onClick={() => updateStyle("textColor", c)}
              />
            ))}
          </div>

          <input
            type="color"
            value={styleConfig.textColor}
            onChange={(e) =>
              updateStyle("textColor", e.target.value)
            }
            style={colorInput}
          />
        </div>

        {/* RESET */}
        <button
          onClick={() =>
            onChange({
              ...DEFAULT_STYLE_CONFIG,
              accentColor: accent
            })
          }
          style={{
            width: "100%",
            marginTop: 20,
            padding: 10,
            background: "#f3f4f6",
            border: "1px solid #ddd",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12
          }}
        >
          Đặt lại mặc định
        </button>
      </div>

      {/* overlay */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 1000 }}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}

/* ---------- UI helpers ---------- */

const inputStyle = {
  width: "100%",
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ddd"
};

const colorGrid = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginBottom: 8
};

const colorInput = {
  width: "100%",
  height: 40,
  border: "none",
  borderRadius: 6
};

function ColorBtn({ color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: color,
        border: active
          ? "3px solid white"
          : "2px solid transparent",
        boxShadow: active
          ? `0 0 0 2px ${color}`
          : "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "pointer"
      }}
    />
  );
}