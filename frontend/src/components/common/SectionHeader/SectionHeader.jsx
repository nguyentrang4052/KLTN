// ─── Section Headers (Sửa để nhận styleConfig) ──────────────────────────────
const SHead = memo(({ 
    sectionKey, 
    icon, 
    idx, 
    isEdit, 
    accent, 
    getTitle, 
    updateTitle, 
    moveSection, 
    totalSections, 
    onAdd,
    styleConfig = {}  // ← THÊM prop này
}) => {
    const [local, setLocal] = useState(() => getTitle(sectionKey));
    const t = useRef(null);
    const inputRef = useRef(null);

    // Ưu tiên accentColor từ styleConfig, fallback về accent prop
    const titleColor = styleConfig.accentColor || accent;
    const fontSize = (styleConfig.baseFontSize || 13) + 2; // Tiêu đề lớn hơn 2px
    const fontFamily = styleConfig.fontFamily || "inherit";

    useEffect(() => { 
        if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); 
    }, [sectionKey, getTitle]);

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 10, 
            position: "relative", 
            zIndex: 2 
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Icon circle - dùng accentColor */}
                <div style={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: "50%", 
                    background: titleColor + "18", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 12, 
                    color: titleColor 
                }}>
                    {icon}
                </div>
                
                {isEdit ? (
                    <input 
                        ref={inputRef} 
                        value={local}
                        onChange={e => { 
                            setLocal(e.target.value); 
                            if (t.current) clearTimeout(t.current); 
                            t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); 
                        }}
                        onBlur={e => { 
                            if (t.current) clearTimeout(t.current); 
                            updateTitle(sectionKey, e.target.value); 
                        }}
                        style={{ 
                            fontSize: fontSize,           // ← Từ styleConfig
                            fontWeight: "bold", 
                            letterSpacing: 1.5, 
                            textTransform: "uppercase", 
                            color: titleColor,              // ← Từ styleConfig.accentColor
                            fontFamily: fontFamily,       // ← Từ styleConfig
                            background: "transparent", 
                            border: "none", 
                            borderBottom: "1px dashed " + titleColor + "66", 
                            outline: "none" 
                        }} 
                    />
                ) : (
                    <div style={{ 
                        fontSize: fontSize, 
                        fontWeight: "bold", 
                        letterSpacing: 1.5, 
                        textTransform: "uppercase", 
                        color: titleColor,
                        fontFamily: fontFamily,
                    }}>
                        {getTitle(sectionKey)}
                    </div>
                )}
            </div>
            
            {isEdit && (
                <div style={{ display: "flex", gap: 3 }}>
                    {onAdd && (
                        <button 
                            onClick={onAdd} 
                            style={{ 
                                fontSize: 11, 
                                color: titleColor, 
                                background: titleColor + "10", 
                                border: `1px solid ${titleColor}33`, 
                                borderRadius: 8, 
                                padding: "2px 8px", 
                                cursor: "pointer" 
                            }}
                        >
                            + Thêm
                        </button>
                    )}
                    {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
                        const dis = dir === -1 ? idx === 0 : idx === totalSections - 1;
                        return (
                            <button 
                                key={lbl} 
                                onClick={() => moveSection(idx, dir)} 
                                disabled={dis}
                                style={{ 
                                    padding: "2px 5px", 
                                    fontSize: 10, 
                                    opacity: dis ? 0.3 : 1, 
                                    background: "#fff", 
                                    border: `1px solid ${titleColor}33`, 
                                    borderRadius: 3, 
                                    color: titleColor, 
                                    cursor: dis ? "not-allowed" : "pointer" 
                                }}
                            >
                                {lbl}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
});

const SideHead = memo(({ 
    sectionKey, 
    icon, 
    isEdit, 
    accent, 
    getTitle, 
    updateTitle, 
    onAdd,
    styleConfig = {}  // ← THÊM prop này
}) => {
    const [local, setLocal] = useState(() => getTitle(sectionKey));
    const t = useRef(null);
    const inputRef = useRef(null);

    const titleColor = styleConfig.accentColor || accent;
    const fontSize = (styleConfig.baseFontSize || 13) + 1; // Sidebar nhỏ hơn 1px
    const fontFamily = styleConfig.fontFamily || "inherit";

    useEffect(() => { 
        if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); 
    }, [sectionKey, getTitle]);

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: "50%", 
                    background: titleColor + "18", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: 10, 
                    color: titleColor 
                }}>
                    {icon}
                </div>
                
                {isEdit ? (
                    <input 
                        ref={inputRef} 
                        value={local}
                        onChange={e => { 
                            setLocal(e.target.value); 
                            if (t.current) clearTimeout(t.current); 
                            t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); 
                        }}
                        onBlur={e => { 
                            if (t.current) clearTimeout(t.current); 
                            updateTitle(sectionKey, e.target.value); 
                        }}
                        style={{ 
                            fontSize: fontSize, 
                            fontWeight: "bold", 
                            letterSpacing: 1.5, 
                            textTransform: "uppercase", 
                            color: titleColor,
                            fontFamily: fontFamily,
                            background: "transparent", 
                            border: "none", 
                            borderBottom: "1px dashed " + titleColor + "55", 
                            outline: "none" 
                        }} 
                    />
                ) : (
                    <div style={{ 
                        fontSize: fontSize, 
                        fontWeight: "bold", 
                        letterSpacing: 1.5, 
                        textTransform: "uppercase", 
                        color: titleColor,
                        fontFamily: fontFamily,
                    }}>
                        {getTitle(sectionKey)}
                    </div>
                )}
            </div>
            
            {isEdit && onAdd && (
                <button 
                    onClick={onAdd} 
                    style={{ 
                        fontSize: 10, 
                        color: titleColor, 
                        background: titleColor + "10", 
                        border: `1px solid ${titleColor}33`, 
                        borderRadius: 6, 
                        padding: "1px 6px", 
                        cursor: "pointer" 
                    }}
                >
                    +
                </button>
            )}
        </div>
    );
});