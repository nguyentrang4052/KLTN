import { useState, useEffect, useRef, useCallback, memo } from "react";
import RichTextField from "./RichTextField";

const EditableField = memo(({ 
    value = "", 
    onChange, 
    placeholder = "", 
    multiline = false, 
    style = {}, 
    isEdit = true,
    richText = false,
    styleConfig = {},
}) => {
    const [localValue, setLocalValue] = useState(value);
    const timeoutRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const inputRef = useRef(null);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => {
        if (document.activeElement !== inputRef.current) setLocalValue(value);
    }, [value]);

    const commit = useCallback((val) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        onChangeRef.current(val);
    }, []);

    const handleChange = useCallback((val) => {
        setLocalValue(val);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => onChangeRef.current(val), 300);
    }, []);

    if (!isEdit) {
        if (richText && value) {
            return <div dangerouslySetInnerHTML={{ __html: value }} style={{ ...style, color: styleConfig.textColor || "#333" }} />;
        }
        return (
            <span style={{
                color: value ? (styleConfig.textColor || "#333") : "#999",
                fontStyle: value ? "normal" : "italic",
                fontFamily: styleConfig.fontFamily || "inherit",
                fontSize: styleConfig.baseFontSize || 13,
                lineHeight: styleConfig.lineHeight || 1.6,
                fontWeight: styleConfig.fontWeight || "normal",
                ...style,
            }}>
                {value || placeholder}
            </span>
        );
    }

    if (richText) {
        return (
            <RichTextField
                value={localValue}
                onChange={handleChange}
                onBlur={commit}
                placeholder={placeholder}
                multiline={multiline}
                style={{
                    fontFamily: styleConfig.fontFamily || "inherit",
                    fontSize: styleConfig.baseFontSize || 13,
                    lineHeight: styleConfig.lineHeight || 1.6,
                    color: styleConfig.textColor || "#333",
                    fontWeight: styleConfig.fontWeight || "normal",
                    fontStyle: styleConfig.fontStyle || "normal",
                    textDecoration: styleConfig.textDecoration || "none",
                    ...style,
                }}
                styleConfig={styleConfig}
                isEdit={isEdit}
            />
        );
    }

    const baseStyle = {
        background: "transparent",
        border: "none",
        borderBottom: multiline ? "none" : "1.5px dashed #ccc",
        outline: "none",
        fontFamily: styleConfig.fontFamily || "inherit",
        width: "100%",
        padding: multiline ? "6px" : "2px 0",
        fontSize: styleConfig.baseFontSize || 13,
        color: styleConfig.textColor || "#333",
        lineHeight: styleConfig.lineHeight || 1.5,
        fontWeight: styleConfig.fontWeight || "normal",
        fontStyle: styleConfig.fontStyle || "normal",
        textDecoration: styleConfig.textDecoration || "none",
        transition: "border-color 0.2s",
        ...style,
    };

    if (multiline) {
        return (
            <textarea
                ref={inputRef}
                value={localValue}
                onChange={e => handleChange(e.target.value)}
                onBlur={e => commit(e.target.value)}
                placeholder={placeholder}
                style={{ ...baseStyle, resize: "vertical", minHeight: 60, border: "1.5px dashed #ccc", borderRadius: 4, boxSizing: "border-box" }}
            />
        );
    }

    return (
        <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={e => handleChange(e.target.value)}
            onBlur={e => commit(e.target.value)}
            placeholder={placeholder}
            style={baseStyle}
        />
    );
});

export default EditableField;