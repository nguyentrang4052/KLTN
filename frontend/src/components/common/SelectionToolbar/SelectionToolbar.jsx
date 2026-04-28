// import { useState, useEffect, useRef, useCallback, memo } from "react";

// // ─── GLOBAL SAVED RANGE ───────────────────────────────────────────────────────
// // Shared with RichTextField so exec commands restore selection correctly
// export let globalSavedRange = null;
// export const saveGlobalSelection = () => {
//     const sel = window.getSelection();
//     if (sel && sel.rangeCount > 0) globalSavedRange = sel.getRangeAt(0).cloneRange();
// };
// export const restoreGlobalSelection = () => {
//     if (!globalSavedRange) return false;
//     const sel = window.getSelection();
//     if (!sel) return false;
//     sel.removeAllRanges();
//     sel.addRange(globalSavedRange);
//     return true;
// };

// // ─── TOOLBAR BUTTON STYLE ─────────────────────────────────────────────────────
// const btnStyle = (active = false) => ({
//     width: 28,
//     height: 28,
//     border: `1px solid ${active ? "#6366f1" : "#e5e7eb"}`,
//     borderRadius: 4,
//     background: active ? "#e0e7ff" : "white",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 13,
//     color: active ? "#4338ca" : "#374151",
//     fontWeight: "bold",
//     flexShrink: 0,
//     padding: 0,
//     transition: "all 0.1s",
// });

// const Divider = () => (
//     <div style={{ width: 1, height: 20, background: "#e5e7eb", flexShrink: 0 }} />
// );

// // ─── SELECTION TOOLBAR (GLOBAL) ───────────────────────────────────────────────
// const SelectionToolbar = memo(() => {
//     const [visible, setVisible] = useState(false);
//     const [pos, setPos] = useState({ x: 0, y: 0, width: 0 });
//     const [showFontSize, setShowFontSize] = useState(false);
//     const [showColor, setShowColor] = useState(false);
//     const [showFontFamily, setShowFontFamily] = useState(false);
//     const toolbarRef = useRef(null);
//     const activeEditorRef = useRef(null);

//     const fontSizes = [
//         { label: "Nhỏ (10px)", value: "1" },
//         { label: "Bình thường (13px)", value: "2" },
//         { label: "Lớn (16px)", value: "3" },
//         { label: "Rất lớn (20px)", value: "4" },
//         { label: "Tiêu đề (24px)", value: "5" },
//     ];

//     const fontFamilies = [
//         { label: "DM Sans", value: "DM Sans, sans-serif" },
//         { label: "Inter", value: "Inter, sans-serif" },
//         { label: "Roboto", value: "Roboto, sans-serif" },
//         { label: "Lato", value: "Lato, sans-serif" },
//         { label: "Open Sans", value: "Open Sans, sans-serif" },
//         { label: "Playfair Display", value: "Playfair Display, serif" },
//         { label: "Cormorant", value: "Cormorant Garamond, serif" },
//         { label: "Merriweather", value: "Merriweather, serif" },
//         { label: "Source Code Pro", value: "Source Code Pro, monospace" },
//     ];

//     const colors = [
//         "#000000", "#333333", "#666666", "#999999",
//         "#DC2626", "#059669", "#0369A1", "#D97706",
//         "#5B2D8E", "#8B1A1A", "#1A6B5A", "#2C3E6B",
//     ];

//     const exec = useCallback((command, value = null) => {
//         restoreGlobalSelection();
//         document.execCommand(command, false, value);
//         if (activeEditorRef.current) {
//             activeEditorRef.current.focus();
//             activeEditorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
//         }
//         setTimeout(() => saveGlobalSelection(), 0);
//     }, []);

//     const handleSelectionChange = useCallback(() => {
//         const sel = window.getSelection();
//         if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
//             // Don't hide immediately — user might be clicking toolbar
//             return;
//         }

//         // Only show for contenteditable elements (rich text)
//         const anchorNode = sel.anchorNode;
//         const editorEl = anchorNode instanceof Element
//             ? anchorNode.closest("[data-rich-editor='true']")
//             : anchorNode?.parentElement?.closest("[data-rich-editor='true']");

//         if (!editorEl) {
//             setVisible(false);
//             return;
//         }

//         activeEditorRef.current = editorEl;

//         const range = sel.getRangeAt(0);
//         const rect = range.getBoundingClientRect();
//         if (rect.width === 0 && rect.height === 0) return;

//         saveGlobalSelection();

//         // Position toolbar ABOVE the selection
//         const toolbarH = 42; // approx toolbar height
//         const toolbarW = toolbarRef.current?.offsetWidth || 400;
//         const gap = 8;

//         let x = rect.left + rect.width / 2 - toolbarW / 2;
//         let y = rect.top - toolbarH - gap;

//         // Keep inside viewport
//         x = Math.max(8, Math.min(x, window.innerWidth - toolbarW - 8));
//         if (y < 8) y = rect.bottom + gap; // flip below if no room above

//         setPos({ x, y, selRect: rect });
//         setVisible(true);
//     }, []);

//     useEffect(() => {
//         document.addEventListener("selectionchange", handleSelectionChange);
//         return () => document.removeEventListener("selectionchange", handleSelectionChange);
//     }, [handleSelectionChange]);

//     // Hide on outside click
//     useEffect(() => {
//         const handleMouseDown = (e) => {
//             if (toolbarRef.current?.contains(e.target)) return;
//             const editor = e.target.closest("[data-rich-editor='true']");
//             if (editor) return; // clicking inside editor — let selectionchange handle it
//             setVisible(false);
//             globalSavedRange = null;
//         };
//         document.addEventListener("mousedown", handleMouseDown);
//         return () => document.removeEventListener("mousedown", handleMouseDown);
//     }, []);

//     // Close dropdowns when clicking outside toolbar
//     useEffect(() => {
//         const handler = (e) => {
//             if (!toolbarRef.current?.contains(e.target)) {
//                 setShowFontSize(false);
//                 setShowColor(false);
//                 setShowFontFamily(false);
//             }
//         };
//         document.addEventListener("mousedown", handler);
//         return () => document.removeEventListener("mousedown", handler);
//     }, []);

//     const preventBlur = useCallback((e) => {
//         e.preventDefault();
//         e.stopPropagation();
//     }, []);

//     if (!visible) return null;

//     const toolbarStyle = {
//         position: "fixed",
//         top: pos.y,
//         left: pos.x,
//         zIndex: 999999,
//         background: "white",
//         border: "1px solid #e2e8f0",
//         borderRadius: 10,
//         padding: "5px 8px",
//         boxShadow: "0 8px 30px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
//         display: "flex",
//         gap: 3,
//         alignItems: "center",
//         flexWrap: "nowrap",
//         userSelect: "none",
//         // Arrow pointer below toolbar pointing to selection
//         "&::after": {},
//     };

//     return (
//         <div
//             ref={toolbarRef}
//             className="selection-toolbar"
//             style={toolbarStyle}
//             onMouseDown={preventBlur}
//         >
//             {/* Font Family */}
//             <div style={{ position: "relative" }}>
//                 <button
//                     onMouseDown={(e) => {
//                         e.preventDefault();
//                         setShowFontFamily(f => !f);
//                         setShowFontSize(false);
//                         setShowColor(false);
//                     }}
//                     style={{ ...btnStyle(), fontSize: 11, width: 40, fontWeight: "bold" }}
//                     title="Font chữ"
//                 >Aa</button>
//                 {showFontFamily && (
//                     <div
//                         style={{
//                             position: "fixed",
//                             top: pos.y + 44,
//                             left: Math.max(8, pos.x),
//                             background: "white",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: 8,
//                             boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//                             padding: 4,
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 2,
//                             zIndex: 1000000,
//                             minWidth: 160,
//                             maxHeight: 220,
//                             overflowY: "auto",
//                         }}
//                         onMouseDown={preventBlur}
//                     >
//                         {fontFamilies.map(f => (
//                             <button
//                                 key={f.value}
//                                 onMouseDown={(e) => { e.preventDefault(); exec("fontName", f.value); setShowFontFamily(false); }}
//                                 style={{ border: "none", background: "none", cursor: "pointer", padding: "6px 10px", fontSize: 13, fontFamily: f.value, textAlign: "left", borderRadius: 4 }}
//                             >
//                                 {f.label}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <Divider />

//             {/* Font Size */}
//             <div style={{ position: "relative" }}>
//                 <button
//                     onMouseDown={(e) => {
//                         e.preventDefault();
//                         setShowFontSize(f => !f);
//                         setShowFontFamily(false);
//                         setShowColor(false);
//                     }}
//                     style={btnStyle()}
//                     title="Cỡ chữ"
//                 >
//                     <span style={{ fontSize: 9 }}>A</span><span style={{ fontSize: 14 }}>A</span>
//                 </button>
//                 {showFontSize && (
//                     <div
//                         style={{
//                             position: "fixed",
//                             top: pos.y + 44,
//                             left: Math.max(8, pos.x + 44),
//                             background: "white",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: 8,
//                             boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//                             padding: 4,
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 2,
//                             zIndex: 1000000,
//                             minWidth: 140,
//                         }}
//                         onMouseDown={preventBlur}
//                     >
//                         {fontSizes.map(s => (
//                             <button
//                                 key={s.value}
//                                 onMouseDown={(e) => { e.preventDefault(); exec("fontSize", s.value); setShowFontSize(false); }}
//                                 style={{ border: "none", background: "none", cursor: "pointer", padding: "5px 10px", fontSize: 12, textAlign: "left", borderRadius: 4 }}
//                             >
//                                 {s.label}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <Divider />

//             {/* Bold / Italic / Underline */}
//             <button onMouseDown={(e) => { e.preventDefault(); exec("bold"); }} style={btnStyle()} title="Đậm (Ctrl+B)"><b>B</b></button>
//             <button onMouseDown={(e) => { e.preventDefault(); exec("italic"); }} style={btnStyle()} title="Nghiêng (Ctrl+I)"><i>I</i></button>
//             <button onMouseDown={(e) => { e.preventDefault(); exec("underline"); }} style={btnStyle()} title="Gạch chân (Ctrl+U)"><u>U</u></button>

//             <Divider />

//             {/* Lists */}
//             <button onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }} style={btnStyle()} title="Danh sách số">
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                     <rect x="5" y="2" width="8" height="1.5" rx=".5" fill="currentColor"/>
//                     <rect x="5" y="6" width="8" height="1.5" rx=".5" fill="currentColor"/>
//                     <rect x="5" y="10" width="8" height="1.5" rx=".5" fill="currentColor"/>
//                     <text x="0" y="4" fontSize="4" fill="currentColor">1.</text>
//                     <text x="0" y="8" fontSize="4" fill="currentColor">2.</text>
//                     <text x="0" y="12" fontSize="4" fill="currentColor">3.</text>
//                 </svg>
//             </button>
//             <button onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }} style={btnStyle()} title="Danh sách dấu đầu dòng">
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                     <circle cx="2" cy="3" r="1.2" fill="currentColor"/>
//                     <rect x="5" y="2" width="8" height="1.5" rx=".5" fill="currentColor"/>
//                     <circle cx="2" cy="7" r="1.2" fill="currentColor"/>
//                     <rect x="5" y="6" width="8" height="1.5" rx=".5" fill="currentColor"/>
//                     <circle cx="2" cy="11" r="1.2" fill="currentColor"/>
//                     <rect x="5" y="10" width="8" height="1.5" rx=".5" fill="currentColor"/>
//                 </svg>
//             </button>

//             <Divider />

//             {/* Alignment: Left / Center / Right / Justify */}
//             <button onMouseDown={(e) => { e.preventDefault(); exec("justifyLeft"); }} style={btnStyle()} title="Canh trái">
//                 <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
//                     <rect x="0" y="0" width="13" height="2" rx="1"/>
//                     <rect x="0" y="4" width="9" height="2" rx="1"/>
//                     <rect x="0" y="8" width="13" height="2" rx="1"/>
//                     <rect x="0" y="12" width="7" height="1" rx=".5"/>
//                 </svg>
//             </button>
//             <button onMouseDown={(e) => { e.preventDefault(); exec("justifyCenter"); }} style={btnStyle()} title="Căn giữa">
//                 <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
//                     <rect x="0" y="0" width="13" height="2" rx="1"/>
//                     <rect x="2" y="4" width="9" height="2" rx="1"/>
//                     <rect x="0" y="8" width="13" height="2" rx="1"/>
//                     <rect x="3" y="12" width="7" height="1" rx=".5"/>
//                 </svg>
//             </button>
//             <button onMouseDown={(e) => { e.preventDefault(); exec("justifyRight"); }} style={btnStyle()} title="Canh phải">
//                 <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
//                     <rect x="0" y="0" width="13" height="2" rx="1"/>
//                     <rect x="4" y="4" width="9" height="2" rx="1"/>
//                     <rect x="0" y="8" width="13" height="2" rx="1"/>
//                     <rect x="6" y="12" width="7" height="1" rx=".5"/>
//                 </svg>
//             </button>
//             {/* Justify Full — canh đều 2 lề */}
//             <button onMouseDown={(e) => { e.preventDefault(); exec("justifyFull"); }} style={btnStyle()} title="Canh đều 2 lề">
//                 <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
//                     <rect x="0" y="0" width="13" height="2" rx="1"/>
//                     <rect x="0" y="4" width="13" height="2" rx="1"/>
//                     <rect x="0" y="8" width="13" height="2" rx="1"/>
//                     <rect x="0" y="12" width="13" height="1" rx=".5"/>
//                 </svg>
//             </button>

//             <Divider />

//             {/* Text Color */}
//             <div style={{ position: "relative" }}>
//                 <button
//                     onMouseDown={(e) => {
//                         e.preventDefault();
//                         setShowColor(c => !c);
//                         setShowFontSize(false);
//                         setShowFontFamily(false);
//                     }}
//                     style={{ ...btnStyle(), color: "#DC2626" }}
//                     title="Màu chữ"
//                 >
//                     <span style={{ borderBottom: "3px solid currentColor", paddingBottom: 1, lineHeight: 1 }}>A</span>
//                 </button>
//                 {showColor && (
//                     <div
//                         style={{
//                             position: "fixed",
//                             top: pos.y + 44,
//                             left: Math.max(8, pos.x + 230),
//                             background: "white",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: 8,
//                             boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//                             padding: 8,
//                             display: "grid",
//                             gridTemplateColumns: "repeat(4, 1fr)",
//                             gap: 4,
//                             zIndex: 1000000,
//                         }}
//                         onMouseDown={preventBlur}
//                     >
//                         {colors.map(c => (
//                             <button
//                                 key={c}
//                                 onMouseDown={(e) => { e.preventDefault(); exec("foreColor", c); setShowColor(false); }}
//                                 style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid transparent", cursor: "pointer" }}
//                             />
//                         ))}
//                         <input
//                             type="color"
//                             onMouseDown={preventBlur}
//                             onChange={e => exec("foreColor", e.target.value)}
//                             style={{ gridColumn: "span 4", width: "100%", height: 28, border: "none", cursor: "pointer", marginTop: 4, borderRadius: 4 }}
//                         />
//                     </div>
//                 )}
//             </div>

//             <Divider />

//             {/* Remove Format */}
//             <button
//                 onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}
//                 style={btnStyle()}
//                 title="Xóa định dạng"
//             >
//                 <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
//                     <path d="M3 2l8 10M11 2L3 12"/>
//                 </svg>
//             </button>

//             {/* Close */}
//             <button
//                 onMouseDown={(e) => { e.preventDefault(); setVisible(false); globalSavedRange = null; }}
//                 style={{ ...btnStyle(), marginLeft: 2, color: "#9ca3af", border: "none", background: "transparent" }}
//                 title="Đóng"
//             >✕</button>
//         </div>
//     );
// });

// export default SelectionToolbar;



import { useState, useEffect, useRef, useCallback, memo } from "react";

export let globalSavedRange = null;

export const saveGlobalSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) globalSavedRange = sel.getRangeAt(0).cloneRange();
};

export const restoreGlobalSelection = () => {
    if (!globalSavedRange) return false;
    const sel = window.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(globalSavedRange);
    return true;
};

const FONT_FAMILIES = [
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

const FONT_SIZES = [
    { label: "Nhỏ (10px)", cmd: "1" },
    { label: "Bình thường (13px)", cmd: "2" },
    { label: "Vừa (16px)", cmd: "3" },
    { label: "Lớn (20px)", cmd: "4" },
    { label: "Rất lớn (24px)", cmd: "5" },
];

const COLORS = [
    "#000000","#333333","#555555","#888888",
    "#dc2626","#ea580c","#d97706","#16a34a",
    "#0369a1","#4f46e5","#7c3aed","#be185d",
];

const Btn = ({ active, title, children, onMouseDown }) => (
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
        }}
    >
        {children}
    </button>
);

const Sep = () => <div style={{ width: 1, height: 20, background: "#e5e7eb", flexShrink: 0 }} />;

const SelectionToolbar = memo(() => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const [showFontFamily, setShowFontFamily] = useState(false);
    const [showFontSize, setShowFontSize] = useState(false);
    const [showColor, setShowColor] = useState(false);
    const toolbarRef = useRef(null);
    const activeEditorRef = useRef(null);
    const posRef = useRef({ top: 0, left: 0 });

    const exec = useCallback((cmd, val = null) => {
        // Restore selection before exec
        restoreGlobalSelection();
        document.execCommand(cmd, false, val);
        if (activeEditorRef.current) {
            activeEditorRef.current.focus();
            activeEditorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        }
        // Re-save after exec
        setTimeout(saveGlobalSelection, 0);
    }, []);

    const computePos = useCallback(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
        const range = sel.getRangeAt(0);
        const rects = range.getClientRects();
        if (!rects.length) return null;

        // Use the FIRST rect (top of selection) to position toolbar above it
        const firstRect = rects[0];
        const TOOLBAR_H = 40;
        const TOOLBAR_W = toolbarRef.current?.offsetWidth || 380;
        const GAP = 8;

        let top = firstRect.top - TOOLBAR_H - GAP;
        let left = firstRect.left + firstRect.width / 2 - TOOLBAR_W / 2;

        // Flip below if no room above
        if (top < 8) top = firstRect.bottom + GAP;

        // Clamp horizontally
        left = Math.max(8, Math.min(left, window.innerWidth - TOOLBAR_W - 8));

        return { top, left };
    }, []);

    const handleSelectionChange = useCallback(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

        const anchor = sel.anchorNode;
        const editor = (anchor instanceof Element ? anchor : anchor?.parentElement)
            ?.closest("[data-rich-editor='true']");
        if (!editor) {
            setVisible(false);
            return;
        }

        activeEditorRef.current = editor;
        saveGlobalSelection();

        const p = computePos();
        if (!p) return;
        posRef.current = p;
        setPos(p);
        setVisible(true);
    }, [computePos]);

    // Update position on scroll/resize while visible
    useEffect(() => {
        if (!visible) return;
        const update = () => {
            const p = computePos();
            if (p) { posRef.current = p; setPos(p); }
        };
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
    }, [visible, computePos]);

    useEffect(() => {
        document.addEventListener("selectionchange", handleSelectionChange);
        return () => document.removeEventListener("selectionchange", handleSelectionChange);
    }, [handleSelectionChange]);

    // Hide on outside mousedown
    useEffect(() => {
        const onDown = (e) => {
            if (toolbarRef.current?.contains(e.target)) return;
            const inEditor = e.target.closest("[data-rich-editor='true']");
            if (inEditor) return;
            setVisible(false);
            setShowFontFamily(false);
            setShowFontSize(false);
            setShowColor(false);
            globalSavedRange = null;
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

    if (!visible) return null;

    // Dropdown positions: always below toolbar
    const dropTop = pos.top + 42;

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
                display: "flex",
                alignItems: "center",
                gap: 3,
                userSelect: "none",
                flexWrap: "nowrap",
                // Arrow pointing down toward selection
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
            }}
        >
            {/* Font Family */}
            <div style={{ position: "relative" }}>
                <Btn title="Font chữ" onMouseDown={(e) => { prevent(e); setShowFontFamily(f => !f); setShowFontSize(false); setShowColor(false); }}>
                    <span style={{ fontSize: 10, fontWeight: "bold", letterSpacing: -0.5 }}>Aa</span>
                </Btn>
                {showFontFamily && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed", top: dropTop, left: Math.max(8, pos.left),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", padding: 4,
                        zIndex: 2147483647, minWidth: 170, maxHeight: 230, overflowY: "auto",
                    }}>
                        {FONT_FAMILIES.map(f => (
                            <button key={f.value} onMouseDown={(e) => { prevent(e); exec("fontName", f.value); setShowFontFamily(false); }}
                                style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: "6px 10px", fontSize: 13, fontFamily: f.value, textAlign: "left", borderRadius: 4 }}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Font Size */}
            <div style={{ position: "relative" }}>
                <Btn title="Cỡ chữ" onMouseDown={(e) => { prevent(e); setShowFontSize(f => !f); setShowFontFamily(false); setShowColor(false); }}>
                    <span style={{ fontSize: 8 }}>A</span><span style={{ fontSize: 14 }}>A</span>
                </Btn>
                {showFontSize && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed", top: dropTop, left: Math.max(8, pos.left + 36),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", padding: 4,
                        zIndex: 2147483647, minWidth: 150,
                    }}>
                        {FONT_SIZES.map(s => (
                            <button key={s.cmd} onMouseDown={(e) => { prevent(e); exec("fontSize", s.cmd); setShowFontSize(false); }}
                                style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: "5px 10px", fontSize: 12, textAlign: "left", borderRadius: 4 }}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Sep />

            <Btn title="Đậm" onMouseDown={(e) => { prevent(e); exec("bold"); }}><b>B</b></Btn>
            <Btn title="Nghiêng" onMouseDown={(e) => { prevent(e); exec("italic"); }}><i style={{ fontStyle: "italic" }}>I</i></Btn>
            <Btn title="Gạch chân" onMouseDown={(e) => { prevent(e); exec("underline"); }}><u>U</u></Btn>

            <Sep />

            {/* Ordered list */}
            <Btn title="Danh sách số" onMouseDown={(e) => { prevent(e); exec("insertOrderedList"); }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                    <text x="0" y="4.5" fontSize="4.5">1.</text><rect x="5" y="1.5" width="7" height="1.5" rx=".5"/>
                    <text x="0" y="8.5" fontSize="4.5">2.</text><rect x="5" y="5.5" width="7" height="1.5" rx=".5"/>
                    <text x="0" y="12.5" fontSize="4.5">3.</text><rect x="5" y="9.5" width="7" height="1.5" rx=".5"/>
                </svg>
            </Btn>
            {/* Unordered list */}
            <Btn title="Dấu đầu dòng" onMouseDown={(e) => { prevent(e); exec("insertUnorderedList"); }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                    <circle cx="2" cy="3" r="1.2"/><rect x="5" y="1.5" width="7" height="1.5" rx=".5"/>
                    <circle cx="2" cy="7" r="1.2"/><rect x="5" y="5.5" width="7" height="1.5" rx=".5"/>
                    <circle cx="2" cy="11" r="1.2"/><rect x="5" y="9.5" width="7" height="1.5" rx=".5"/>
                </svg>
            </Btn>

            <Sep />

            {/* Alignment */}
            <Btn title="Canh trái" onMouseDown={(e) => { prevent(e); exec("justifyLeft"); }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                    <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="0" y="4" width="9" height="2" rx="1"/>
                    <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="0" y="12" width="7" height="1" rx=".5"/>
                </svg>
            </Btn>
            <Btn title="Căn giữa" onMouseDown={(e) => { prevent(e); exec("justifyCenter"); }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                    <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="2" y="4" width="9" height="2" rx="1"/>
                    <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="3" y="12" width="7" height="1" rx=".5"/>
                </svg>
            </Btn>
            <Btn title="Canh phải" onMouseDown={(e) => { prevent(e); exec("justifyRight"); }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                    <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="4" y="4" width="9" height="2" rx="1"/>
                    <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="6" y="12" width="7" height="1" rx=".5"/>
                </svg>
            </Btn>
            <Btn title="Canh đều 2 lề" onMouseDown={(e) => { prevent(e); exec("justifyFull"); }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
                    <rect x="0" y="0" width="13" height="2" rx="1"/><rect x="0" y="4" width="13" height="2" rx="1"/>
                    <rect x="0" y="8" width="13" height="2" rx="1"/><rect x="0" y="12" width="13" height="1" rx=".5"/>
                </svg>
            </Btn>

            <Sep />

            {/* Text Color */}
            <div style={{ position: "relative" }}>
                <Btn title="Màu chữ" onMouseDown={(e) => { prevent(e); setShowColor(c => !c); setShowFontFamily(false); setShowFontSize(false); }}>
                    <span style={{ fontSize: 12, fontWeight: "bold", color: "#dc2626", borderBottom: "2.5px solid #dc2626", lineHeight: 1.1 }}>A</span>
                </Btn>
                {showColor && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed", top: dropTop,
                        left: Math.min(pos.left + 200, window.innerWidth - 180),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)", padding: 8,
                        zIndex: 2147483647, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, width: 140,
                    }}>
                        {COLORS.map(c => (
                            <button key={c} onMouseDown={(e) => { prevent(e); exec("foreColor", c); setShowColor(false); }}
                                title={c}
                                style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid transparent", cursor: "pointer", outline: "none" }} />
                        ))}
                        <input type="color" onMouseDown={prevent} onChange={e => exec("foreColor", e.target.value)}
                            style={{ gridColumn: "span 4", height: 28, width: "100%", border: "none", cursor: "pointer", borderRadius: 4, marginTop: 2 }} />
                    </div>
                )}
            </div>

            <Sep />

            {/* Remove format */}
            <Btn title="Xóa định dạng" onMouseDown={(e) => { prevent(e); exec("removeFormat"); }}>
                <svg width="13" height="13" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 14 14" fill="none">
                    <path d="M3 2l8 10M11 2L3 12"/>
                </svg>
            </Btn>

            {/* Close */}
            <button
                onMouseDown={(e) => { prevent(e); setVisible(false); globalSavedRange = null; }}
                style={{ width: 24, height: 24, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2, borderRadius: 4 }}
                title="Đóng"
            >✕</button>
        </div>
    );
});

export default SelectionToolbar;