import { useRef, useEffect, useState, useCallback } from "react";
import { registerActiveField, clearActiveField } from "../UnifiedToolbar/UnifiedToolbar";

export default function PlainField({
  value,
  onChange,
  multiline = false,
  styleConfig,
  className,
  style: userStyle,
  placeholder,
  ...rest
}) {
  const ref = useRef(null);

  const [fieldStyle, setFieldStyle] = useState(() => ({
    fontFamily: styleConfig?.fontFamily || "'DM Sans', sans-serif",
    baseFontSize: styleConfig?.baseFontSize || 13,
    fontWeight: styleConfig?.fontWeight || "normal",
    fontStyle: styleConfig?.fontStyle || "normal",
    textDecoration: styleConfig?.textDecoration || "none",
    color: styleConfig?.textColor || "#111111",
    textAlign: "left",
  }));

  // Đồng bộ khi styleConfig global thay đổi (từ Sidebar)
  useEffect(() => {
    if (!styleConfig) return;
    setFieldStyle((prev) => {
      const next = {
        ...prev,
        fontFamily: styleConfig.fontFamily || prev.fontFamily,
        baseFontSize: styleConfig.baseFontSize ?? prev.baseFontSize,
        fontWeight: styleConfig.fontWeight || prev.fontWeight,
        fontStyle: styleConfig.fontStyle || prev.fontStyle,
        textDecoration: styleConfig.textDecoration || prev.textDecoration,
        color: styleConfig.textColor || prev.color,
      };
      applyToDOM(next);
      return next;
    });
  }, [styleConfig]);

  const applyToDOM = useCallback((next) => {
    const el = ref.current;
    if (!el) return;
    if (next.fontFamily) el.style.fontFamily = next.fontFamily;
    if (next.baseFontSize) el.style.fontSize = `${next.baseFontSize}px`;
    if (next.fontWeight) el.style.fontWeight = next.fontWeight;
    if (next.fontStyle) el.style.fontStyle = next.fontStyle;
    if (next.textDecoration !== undefined) el.style.textDecoration = next.textDecoration;
    if (next.color) el.style.color = next.color;
    if (next.textAlign) el.style.textAlign = next.textAlign;
  }, []);

  const handleStyleChange = useCallback((patch) => {
    setFieldStyle((prev) => {
      const next = { ...prev, ...patch };
      applyToDOM(next);
      return next;
    });
  }, [applyToDOM]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onSelect = () => {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      if (end > start) {
        registerActiveField(handleStyleChange, fieldStyle);
      }
    };

    const onFocus = () => registerActiveField(handleStyleChange, fieldStyle);

    el.addEventListener("focus", onFocus);
    el.addEventListener("select", onSelect);
    el.addEventListener("mouseup", onSelect);
    el.addEventListener("keyup", onSelect);

    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("select", onSelect);
      el.removeEventListener("mouseup", onSelect);
      el.removeEventListener("keyup", onSelect);
      clearActiveField();
    };
  }, [handleStyleChange, fieldStyle]);

  const Tag = multiline ? "textarea" : "input";

  return (
    <Tag
      ref={ref}
      data-mini-field="true"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      style={{
        fontFamily: fieldStyle.fontFamily,
        fontSize: `${fieldStyle.baseFontSize}px`,
        fontWeight: fieldStyle.fontWeight,
        fontStyle: fieldStyle.fontStyle,
        textDecoration: fieldStyle.textDecoration,
        color: fieldStyle.color,
        textAlign: fieldStyle.textAlign,
        background: "transparent",
        border: "1px dashed transparent",
        borderRadius: 4,
        padding: "2px 4px",
        outline: "none",
        width: "100%",
        resize: multiline ? "none" : undefined,
        ...userStyle,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#6366f1";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "transparent";
      }}
      {...rest}
    />
  );
}