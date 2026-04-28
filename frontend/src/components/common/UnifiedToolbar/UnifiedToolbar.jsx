import { useState, useEffect, useRef, useCallback, memo } from "react";

// ─── Global state ───────────────────────────────────────────────────────────
export let globalSavedRange = null;
export const saveGlobalSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) globalSavedRange = sel.getRangeAt(0).cloneRange();
};
export const restoreGlobalSelection = () => {
    if (!globalSavedRange) return false;
    try {
        const sel = window.getSelection();
        if (!sel) return false;
        sel.removeAllRanges();
        sel.addRange(globalSavedRange);
        return true;
    } catch { return false; }
};

// ─── Global registry for plain fields ───────────────────────────────────────
let activeStyleChangeFn = null;
let activeStyleConfig = {};
export const registerActiveField = (fn, sc) => {
    activeStyleChangeFn = fn;
    activeStyleConfig = sc || {};
};
export const clearActiveField = () => {
    activeStyleChangeFn = null;
    activeStyleConfig = {};
};

// ─── UI helpers ─────────────────────────────────────────────────────────────
const Btn = ({ active, title, children, onMouseDown, style: extra = {} }) => (
    <button
        title={title}
        onMouseDown={onMouseDown}
        style={{
            width: 28, height: 28,
            border: `1px solid ${active ? "#6366f1" : "#e5e7eb"}`,
            borderRadius: 4,
            background: active ? "#e0e7ff" : "white",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: active ? "#4338ca" : "#374151",
            fontWeight: "bold", padding: 0, flexShrink: 0,
            ...extra,
        }}
    >{children}</button>
);
const Sep = () => <div style={{ width: 1, height: 20, background: "#e5e7eb", flexShrink: 0 }} />;

const FONTS = [
    { label: "DM Sans", value: "'DM Sans', sans-serif" },
    { label: "Inter", value: "'Inter', sans-serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Lato", value: "'Lato', sans-serif" },
    { label: "Open Sans", value: "'Open Sans', sans-serif" },
    { label: "Playfair Display", value: "'Playfair Display', serif" },
    { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
    { label: "Merriweather", value: "'Merriweather', serif" },
    { label: "Source Code Pro", value: "'Source Code Pro', monospace" },
];
const COLORS = [
    "#000000","#333333","#555555","#888888",
    "#dc2626","#ea580c","#d97706","#16a34a",
    "#0369a1","#4f46e5","#7c3aed","#be185d",
];
const SIZES = [
    { label: "10px", cmd: "1" }, { label: "13px", cmd: "2" },
    { label: "16px", cmd: "3" }, { label: "20px", cmd: "4" },
    { label: "24px", cmd: "5" },
];

// ─── MAIN TOOLBAR ───────────────────────────────────────────────────────────
const UnifiedToolbar = memo(() => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const [mode, setMode] = useState("rich");
    const [sc, setSc] = useState({});
    const [showFont, setShowFont] = useState(false);
    const [showSize, setShowSize] = useState(false);
    const [showColor, setShowColor] = useState(false);
    const toolbarRef = useRef(null);
    const activeEditorRef = useRef(null);
    const activePlainRef = useRef(null);

    const closeDropdowns = () => { setShowFont(false); setShowSize(false); setShowColor(false); };
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

    const computePos = useCallback((rect) => {
        const TH = toolbarRef.current?.offsetHeight || 40;
        const TW = toolbarRef.current?.offsetWidth || 420;
        const GAP = 8;
        let top = rect.top - TH - GAP;
        let left = rect.left + rect.width / 2 - TW / 2;
        if (top < 8) top = rect.bottom + GAP;
        left = Math.max(8, Math.min(left, window.innerWidth - TW - 8));
        return { top, left };
    }, []);

    const handleSelectionChange = useCallback(() => {
        const sel = window.getSelection();

        // Rich text
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
            const anchor = sel.anchorNode;
            const editor = (anchor instanceof Element ? anchor : anchor?.parentElement)
                ?.closest("[data-rich-editor='true']");
            if (editor) {
                activeEditorRef.current = editor;
                activePlainRef.current = null;
                saveGlobalSelection();
                const range = sel.getRangeAt(0);
                const rects = range.getClientRects();
                const rect = rects[0] || range.getBoundingClientRect();
                if (rect.width === 0 && rect.height === 0) return;
                setMode("rich");
                setPos(computePos(rect));
                setVisible(true);
                return;
            }
        }

        // Plain text
        const active = document.activeElement;
        if (
            active &&
            (active.tagName === "INPUT" || active.tagName === "TEXTAREA") &&
            active.dataset.miniField === "true"
        ) {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            if (end > start) {
                activePlainRef.current = active;
                activeEditorRef.current = null;
                setSc({ ...activeStyleConfig });
                setMode("plain");
                setPos(computePos(active.getBoundingClientRect()));
                setVisible(true);
                return;
            }
        }
    }, [computePos]);

    useEffect(() => {
        document.addEventListener("selectionchange", handleSelectionChange);
        document.addEventListener("mouseup", handleSelectionChange);
        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange);
            document.removeEventListener("mouseup", handleSelectionChange);
        };
    }, [handleSelectionChange]);

    useEffect(() => {
        if (!visible) return;
        const id = setInterval(() => {
            if (mode === "plain" && activeStyleChangeFn) {
                setSc({ ...activeStyleConfig });
            }
        }, 100);
        return () => clearInterval(id);
    }, [visible, mode]);

    useEffect(() => {
        if (!visible) return;
        const update = () => {
            if (mode === "rich") {
                const sel = window.getSelection();
                if (!sel || sel.isCollapsed || !sel.rangeCount) return;
                const rects = sel.getRangeAt(0).getClientRects();
                if (!rects[0]) return;
                setPos(computePos(rects[0]));
            } else {
                const active = activePlainRef.current;
                if (active) setPos(computePos(active.getBoundingClientRect()));
            }
        };
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [visible, mode, computePos]);

    useEffect(() => {
        const onDown = (e) => {
            if (toolbarRef.current?.contains(e.target)) return;
            const inRich = e.target.closest("[data-rich-editor='true']");
            const inPlain = e.target.closest("[data-mini-field='true']") || e.target.dataset?.miniField === "true";
            if (inRich || inPlain) return;
            setVisible(false);
            closeDropdowns();
            globalSavedRange = null;
            activePlainRef.current = null;
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const execRich = useCallback((cmd, val = null) => {
        restoreGlobalSelection();
        if (cmd === "removeFormat") {
            document.execCommand("removeFormat", false);
            document.execCommand("fontName", false, "DM Sans");
            document.execCommand("fontSize", false, "3");
            document.execCommand("foreColor", false, "#000000");
        } else {
            document.execCommand(cmd, false, val);
        }
        if (activeEditorRef.current) {
            activeEditorRef.current.focus();
            activeEditorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        }
        setTimeout(saveGlobalSelection, 0);
    }, []);

    const applyStyle = useCallback((patch) => {
        if (mode === "rich") {
            if (patch.fontFamily) execRich("fontName", patch.fontFamily);
            if (patch.baseFontSize) {
                const sz = patch.baseFontSize;
                const cmd = sz <= 10 ? "1" : sz <= 13 ? "2" : sz <= 16 ? "3" : sz <= 20 ? "4" : sz <= 24 ? "5" : "6";
                execRich("fontSize", cmd);
            }
            if (patch.fontWeight === "bold") execRich("bold");
            if (patch.fontWeight === "normal") execRich("bold");
            if (patch.fontStyle === "italic") execRich("italic");
            if (patch.fontStyle === "normal") execRich("italic");
            if (patch.textDecoration === "underline") execRich("underline");
            if (patch.textDecoration === "none") execRich("underline");
            if (patch.color) execRich("foreColor", patch.color);
        } else {
            if (activePlainRef.current) activePlainRef.current.focus();
            if (activeStyleChangeFn) {
                activeStyleChangeFn(patch);
                setSc(prev => ({ ...prev, ...patch }));
            }
        }
    }, [mode, execRich]);

    const richExec = useCallback((cmd, val = null) => {
        if (mode === "rich") {
            execRich(cmd, val);
        } else {
            if (activePlainRef.current) activePlainRef.current.focus();
            const map = {
                bold: () => applyStyle({ fontWeight: sc.fontWeight === "bold" ? "normal" : "bold" }),
                italic: () => applyStyle({ fontStyle: sc.fontStyle === "italic" ? "normal" : "italic" }),
                underline: () => applyStyle({ textDecoration: sc.textDecoration === "underline" ? "none" : "underline" }),
                justifyLeft: () => applyStyle({ textAlign: "left" }),
                justifyCenter: () => applyStyle({ textAlign: "center" }),
                justifyRight: () => applyStyle({ textAlign: "right" }),
                justifyFull: () => applyStyle({ textAlign: "justify" }),
                removeFormat: () => applyStyle({ fontWeight: "normal", fontStyle: "normal", textDecoration: "none" }),
                insertOrderedList: () => {},
                insertUnorderedList: () => {},
            };
            map[cmd]?.();
        }
    }, [mode, execRich, applyStyle, sc]);

    if (!visible) return null;

    const dropTop = pos.top + 44;
    const isBold = mode === "plain" ? sc.fontWeight === "bold" : false;
    const isItalic = mode === "plain" ? sc.fontStyle === "italic" : false;
    const isUnder = mode === "plain" ? sc.textDecoration === "underline" : false;
    const fontSize = mode === "plain" ? (sc.baseFontSize || 13) : 13;

    return (
        <div
            ref={toolbarRef}
            className="selection-toolbar"
            onMouseDown={prevent}
            style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                zIndex: 2147483647,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "5px 8px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                display: "flex", alignItems: "center", gap: 3,
                userSelect: "none", flexWrap: "nowrap",
            }}
        >
            {/* Font Family */}
            <div style={{ position: "relative" }}>
                <Btn title="Font chữ" onMouseDown={(e) => { prevent(e); setShowFont(f => !f); setShowSize(false); setShowColor(false); }}>
                    <span style={{ fontSize: 10, fontWeight: "bold" }}>Aa</span>
                </Btn>
                {showFont && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed", top: dropTop, left: Math.max(8, pos.left),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", padding: 4,
                        zIndex: 2147483647, minWidth: 180, maxHeight: 240, overflowY: "auto",
                    }}>
                        {FONTS.map(f => (
                            <button key={f.value}
                                onMouseDown={(e) => { prevent(e); applyStyle({ fontFamily: f.value }); setShowFont(false); }}
                                style={{ width: "100%", border: "none", background: sc.fontFamily === f.value ? "#e0e7ff" : "none", cursor: "pointer", padding: "6px 10px", fontSize: 13, fontFamily: f.value, textAlign: "left", borderRadius: 4, color: "#374151" }}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Font Size */}
            <div style={{ position: "relative" }}>
                {mode === "plain" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Btn title="Giảm" onMouseDown={(e) => { prevent(e); applyStyle({ baseFontSize: Math.max(10, fontSize - 1) }); }}
                            style={{ width: 22 }}>−</Btn>
                        <span style={{ fontSize: 11, minWidth: 24, textAlign: "center", fontWeight: 600, color: "#374151" }}>{fontSize}</span>
                        <Btn title="Tăng" onMouseDown={(e) => { prevent(e); applyStyle({ baseFontSize: Math.min(24, fontSize + 1) }); }}
                            style={{ width: 22 }}>+</Btn>
                    </div>
                ) : (
                    <Btn title="Cỡ chữ" onMouseDown={(e) => { prevent(e); setShowSize(f => !f); setShowFont(false); setShowColor(false); }}>
                        <span style={{ fontSize: 8 }}>A</span><span style={{ fontSize: 14 }}>A</span>
                    </Btn>
                )}
                {showSize && mode === "rich" && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed", top: dropTop, left: Math.max(8, pos.left + 38),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", padding: 4,
                        zIndex: 2147483647, minWidth: 130,
                    }}>
                        {SIZES.map(s => (
                            <button key={s.cmd} onMouseDown={(e) => { prevent(e); execRich("fontSize", s.cmd); setShowSize(false); }}
                                style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: "5px 10px", fontSize: 12, textAlign: "left", borderRadius: 4 }}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Sep />

            <Btn active={isBold} title="Đậm" onMouseDown={(e) => { prevent(e); richExec("bold"); }}><b>B</b></Btn>
            <Btn active={isItalic} title="Nghiêng" onMouseDown={(e) => { prevent(e); richExec("italic"); }}><i style={{ fontStyle: "italic" }}>I</i></Btn>
            <Btn active={isUnder} title="Gạch chân" onMouseDown={(e) => { prevent(e); richExec("underline"); }}><u>U</u></Btn>

            {mode === "rich" && <>
                <Sep />
                <Btn title="Danh sách số" onMouseDown={(e) => { prevent(e); execRich("insertOrderedList"); }}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                        <text x="0" y="4.5" fontSize="4.5">1.</text><rect x="5" y="1.5" width="7" height="1.5" rx=".5"/>
                        <text x="0" y="8.5" fontSize="4.5">2.</text><rect x="5" y="5.5" width="7" height="1.5" rx=".5"/>
                        <text x="0" y="12.5" fontSize="4.5">3.</text><rect x="5" y="9.5" width="7" height="1.5" rx=".5"/>
                    </svg>
                </Btn>
                <Btn title="Dấu chấm" onMouseDown={(e) => { prevent(e); execRich("insertUnorderedList"); }}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                        <circle cx="2" cy="3" r="1.2"/><rect x="5" y="1.5" width="7" height="1.5" rx=".5"/>
                        <circle cx="2" cy="7" r="1.2"/><rect x="5" y="5.5" width="7" height="1.5" rx=".5"/>
                        <circle cx="2" cy="11" r="1.2"/><rect x="5" y="9.5" width="7" height="1.5" rx=".5"/>
                    </svg>
                </Btn>
                <Sep />
                <Btn title="Canh trái" onMouseDown={(e) => { prevent(e); execRich("justifyLeft"); }}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                        <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="0" y="4" width="9" height="2" rx="1"/>
                        <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="0" y="12" width="7" height="1" rx=".5"/>
                    </svg>
                </Btn>
                <Btn title="Căn giữa" onMouseDown={(e) => { prevent(e); execRich("justifyCenter"); }}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                        <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="2" y="4" width="9" height="2" rx="1"/>
                        <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="3" y="12" width="7" height="1" rx=".5"/>
                    </svg>
                </Btn>
                <Btn title="Canh phải" onMouseDown={(e) => { prevent(e); execRich("justifyRight"); }}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                        <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="4" y="4" width="9" height="2" rx="1"/>
                        <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="6" y="12" width="7" height="1" rx=".5"/>
                    </svg>
                </Btn>
                <Btn title="Đều 2 lề" onMouseDown={(e) => { prevent(e); execRich("justifyFull"); }}>
                    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                        <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="0" y="4" width="13" height="2" rx="1"/>
                        <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="0" y="12" width="13" height="1" rx=".5"/>
                    </svg>
                </Btn>
            </>}

            <Sep />

            {/* Text Color */}
            <div style={{ position: "relative" }}>
                <Btn title="Màu chữ" onMouseDown={(e) => { prevent(e); setShowColor(c => !c); setShowFont(false); setShowSize(false); }}>
                    <span style={{ fontSize: 12, fontWeight: "bold", color: "#dc2626", borderBottom: "2.5px solid #dc2626", lineHeight: 1.1 }}>A</span>
                </Btn>
                {showColor && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed", top: dropTop,
                        left: Math.min(pos.left + 220, window.innerWidth - 160),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", padding: 8,
                        zIndex: 2147483647, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, width: 148,
                    }}>
                        {COLORS.map(c => (
                            <button key={c} title={c}
                                onMouseDown={(e) => {
                                    prevent(e);
                                    if (mode === "rich") execRich("foreColor", c);
                                    else applyStyle({ color: c });
                                    setShowColor(false);
                                }}
                                style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid transparent", cursor: "pointer" }} />
                        ))}
                        <input type="color" onMouseDown={prevent}
                            onChange={e => {
                                if (mode === "rich") execRich("foreColor", e.target.value);
                                else applyStyle({ color: e.target.value });
                            }}
                            style={{ gridColumn: "span 4", height: 28, width: "100%", border: "none", cursor: "pointer", borderRadius: 4, marginTop: 2 }} />
                    </div>
                )}
            </div>

            {mode === "rich" && (
                <Btn title="Xóa định dạng" onMouseDown={(e) => { prevent(e); execRich("removeFormat"); }}>
                    <svg width="13" height="13" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 14 14" fill="none">
                        <path d="M3 2l8 10M11 2L3 12"/>
                    </svg>
                </Btn>
            )}

            <button
                onMouseDown={(e) => { prevent(e); setVisible(false); globalSavedRange = null; activePlainRef.current = null; closeDropdowns(); }}
                style={{ width: 24, height: 24, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2, borderRadius: 4 }}
                title="Đóng"
            >✕</button>
        </div>
    );
});

export default UnifiedToolbar;