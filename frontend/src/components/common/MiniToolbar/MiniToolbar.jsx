// import { useState, useRef, useCallback, memo, useEffect } from "react";

// /**
//  * MiniToolbar — compact floating toolbar for plain (non-rich) input/textarea fields.
//  * 
//  * BEHAVIOUR:
//  * - Shows above the selected/focused field on focus
//  * - Hides when clicking anywhere else (including outside)
//  * - Font-size / B / I / U apply to the whole field via styleConfig (field-level styling)
//  * 
//  * Props:
//  *  - visible: bool
//  *  - anchorRef: ref to the input element
//  *  - styleConfig: current styleConfig
//  *  - onStyleChange: (patch) => void
//  *  - onClose: () => void
//  */

// const FONT_OPTIONS = [
//     { label: "DM Sans", value: "'DM Sans', sans-serif" },
//     { label: "Inter", value: "'Inter', sans-serif" },
//     { label: "Roboto", value: "'Roboto', sans-serif" },
//     { label: "Lato", value: "'Lato', sans-serif" },
//     { label: "Open Sans", value: "'Open Sans', sans-serif" },
//     { label: "Playfair Display", value: "'Playfair Display', serif" },
//     { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
//     { label: "Merriweather", value: "'Merriweather', serif" },
//     { label: "Source Code Pro", value: "'Source Code Pro', monospace" },
// ];

// const btnSt = (active = false) => ({
//     width: 26,
//     height: 26,
//     border: `1px solid ${active ? "#6366f1" : "#e5e7eb"}`,
//     borderRadius: 4,
//     background: active ? "#e0e7ff" : "white",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 12,
//     color: active ? "#4338ca" : "#374151",
//     fontWeight: "bold",
//     padding: 0,
//     flexShrink: 0,
//     transition: "all 0.1s",
// });

// const Div = () => <div style={{ width: 1, height: 18, background: "#e5e7eb", flexShrink: 0 }} />;

// const MiniToolbar = memo(({ visible, anchorRef, styleConfig = {}, onStyleChange, onClose }) => {
//     const [showFont, setShowFont] = useState(false);
//     const toolbarRef = useRef(null);
//     const [pos, setPos] = useState({ top: 0, left: 0 });

//     // Recalculate position whenever visible or anchorRef changes
//     useEffect(() => {
//         if (!visible || !anchorRef?.current) return;
//         const rect = anchorRef.current.getBoundingClientRect();
//         const toolbarH = 38;
//         const gap = 6;
//         let top = rect.top - toolbarH - gap;
//         let left = rect.left;
//         if (top < 8) top = rect.bottom + gap;
//         const toolbarW = 340;
//         if (left + toolbarW > window.innerWidth - 8) left = window.innerWidth - toolbarW - 8;
//         left = Math.max(8, left);
//         setPos({ top, left });
//     }, [visible, anchorRef]);

//     // Hide on outside click
//     useEffect(() => {
//         if (!visible) return;
//         const handleMouseDown = (e) => {
//             if (toolbarRef.current && toolbarRef.current.contains(e.target)) return;
//             if (anchorRef?.current && anchorRef.current.contains(e.target)) return;
//             onClose?.();
//         };
//         document.addEventListener("mousedown", handleMouseDown);
//         return () => document.removeEventListener("mousedown", handleMouseDown);
//     }, [visible, anchorRef, onClose]);

//     const prevent = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);

//     const isBold = styleConfig.fontWeight === "bold";
//     const isItalic = styleConfig.fontStyle === "italic";
//     const isUnderline = styleConfig.textDecoration === "underline";
//     const fontSize = styleConfig.baseFontSize || 13;

//     if (!visible) return null;

//     return (
//         <div
//             ref={toolbarRef}
//             className="mini-toolbar"
//             onMouseDown={prevent}
//             style={{
//                 position: "fixed",
//                 top: pos.top,
//                 left: pos.left,
//                 zIndex: 999999,
//                 background: "white",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: 8,
//                 padding: "4px 7px",
//                 boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 3,
//                 userSelect: "none",
//                 whiteSpace: "nowrap",
//             }}
//         >
//             {/* Font family */}
//             <div style={{ position: "relative" }}>
//                 <button
//                     onMouseDown={(e) => { e.preventDefault(); setShowFont(f => !f); }}
//                     style={{ ...btnSt(), width: 36, fontSize: 10, fontWeight: "bold", letterSpacing: 0 }}
//                     title="Font chữ"
//                 >Aa</button>
//                 {showFont && (
//                     <div
//                         onMouseDown={prevent}
//                         style={{
//                             position: "fixed",
//                             top: pos.top + 36,
//                             left: pos.left,
//                             background: "white",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: 8,
//                             boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//                             padding: 4,
//                             zIndex: 1000000,
//                             minWidth: 170,
//                             maxHeight: 240,
//                             overflowY: "auto",
//                         }}
//                     >
//                         {FONT_OPTIONS.map(f => (
//                             <button
//                                 key={f.value}
//                                 onMouseDown={(e) => {
//                                     e.preventDefault();
//                                     onStyleChange({ fontFamily: f.value });
//                                     setShowFont(false);
//                                 }}
//                                 style={{
//                                     width: "100%",
//                                     border: "none",
//                                     background: styleConfig.fontFamily === f.value ? "#e0e7ff" : "none",
//                                     cursor: "pointer",
//                                     padding: "6px 10px",
//                                     fontSize: 13,
//                                     fontFamily: f.value,
//                                     textAlign: "left",
//                                     borderRadius: 4,
//                                     color: "#374151",
//                                 }}
//                             >
//                                 {f.label}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <Div />

//             {/* Font size -/number/+ */}
//             <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <button
//                     onMouseDown={(e) => { e.preventDefault(); onStyleChange({ baseFontSize: Math.max(10, fontSize - 1) }); }}
//                     style={{ ...btnSt(), width: 22, fontSize: 14, fontWeight: "normal" }}
//                     title="Giảm cỡ chữ"
//                 >−</button>
//                 <span style={{ fontSize: 11, minWidth: 22, textAlign: "center", fontWeight: 600, color: "#374151" }}>{fontSize}</span>
//                 <button
//                     onMouseDown={(e) => { e.preventDefault(); onStyleChange({ baseFontSize: Math.min(22, fontSize + 1) }); }}
//                     style={{ ...btnSt(), width: 22, fontSize: 14, fontWeight: "normal" }}
//                     title="Tăng cỡ chữ"
//                 >+</button>
//             </div>

//             <Div />

//             {/* B I U */}
//             <button
//                 onMouseDown={(e) => { e.preventDefault(); onStyleChange({ fontWeight: isBold ? "normal" : "bold" }); }}
//                 style={btnSt(isBold)}
//                 title="Đậm"
//             ><b>B</b></button>
//             <button
//                 onMouseDown={(e) => { e.preventDefault(); onStyleChange({ fontStyle: isItalic ? "normal" : "italic" }); }}
//                 style={btnSt(isItalic)}
//                 title="Nghiêng"
//             ><i style={{ fontStyle: "italic" }}>I</i></button>
//             <button
//                 onMouseDown={(e) => { e.preventDefault(); onStyleChange({ textDecoration: isUnderline ? "none" : "underline" }); }}
//                 style={btnSt(isUnderline)}
//                 title="Gạch chân"
//             ><u>U</u></button>

//             <Div />

//             {/* Close */}
//             <button
//                 onMouseDown={(e) => { e.preventDefault(); onClose(); }}
//                 style={{ ...btnSt(), border: "none", background: "transparent", color: "#9ca3af", marginLeft: 2 }}
//                 title="Đóng"
//             >✕</button>
//         </div>
//     );
// });

// export default MiniToolbar;


import { useState, useRef, useCallback, memo, useEffect } from "react";

const FONT_OPTIONS = [
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

const Btn = ({ active, title, children, onMouseDown }) => (
    <button onMouseDown={onMouseDown} title={title} style={{
        width: 26, height: 26,
        border: `1px solid ${active ? "#6366f1" : "#e5e7eb"}`,
        borderRadius: 4, background: active ? "#e0e7ff" : "white",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: active ? "#4338ca" : "#374151",
        fontWeight: "bold", padding: 0, flexShrink: 0,
    }}>{children}</button>
);

const Sep = () => <div style={{ width: 1, height: 18, background: "#e5e7eb", flexShrink: 0 }} />;

const MiniToolbar = memo(({ visible, anchorRef, styleConfig = {}, onStyleChange, onClose }) => {
    const [showFont, setShowFont] = useState(false);
    const toolbarRef = useRef(null);
    const [pos, setPos] = useState({ top: -999, left: 0 });

    const computePos = useCallback(() => {
        if (!anchorRef?.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        const TH = toolbarRef.current?.offsetHeight || 36;
        const TW = toolbarRef.current?.offsetWidth || 280;
        const GAP = 6;

        let top = rect.top - TH - GAP;
        let left = rect.left;

        if (top < 8) top = rect.bottom + GAP;
        left = Math.max(8, Math.min(left, window.innerWidth - TW - 8));
        setPos({ top, left });
    }, [anchorRef]);

    useEffect(() => {
        if (!visible) return;
        // Small delay to let DOM settle before measuring
        const id = setTimeout(computePos, 0);
        return () => clearTimeout(id);
    }, [visible, computePos]);

    useEffect(() => {
        if (!visible) return;
        const onScroll = () => computePos();
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
        };
    }, [visible, computePos]);

    const prevent = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);

    const isBold = styleConfig.fontWeight === "bold";
    const isItalic = styleConfig.fontStyle === "italic";
    const isUnder = styleConfig.textDecoration === "underline";
    const fontSize = styleConfig.baseFontSize || 13;

    if (!visible) return null;

    return (
        <div
            ref={toolbarRef}
            className="mini-toolbar"
            onMouseDown={prevent}
            style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                zIndex: 2147483647,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "4px 7px",
                boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
                display: "flex", alignItems: "center", gap: 3,
                userSelect: "none", whiteSpace: "nowrap",
            }}
        >
            {/* Font family */}
            <div style={{ position: "relative" }}>
                <Btn title="Font chữ" onMouseDown={(e) => { prevent(e); setShowFont(f => !f); }}>
                    <span style={{ fontSize: 10, fontWeight: "bold" }}>Aa</span>
                </Btn>
                {showFont && (
                    <div onMouseDown={prevent} style={{
                        position: "fixed",
                        top: pos.top + 34,
                        left: Math.max(8, pos.left),
                        background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        padding: 4, zIndex: 2147483647, minWidth: 170, maxHeight: 240, overflowY: "auto",
                    }}>
                        {FONT_OPTIONS.map(f => (
                            <button key={f.value}
                                onMouseDown={(e) => { prevent(e); onStyleChange({ fontFamily: f.value }); setShowFont(false); }}
                                style={{
                                    width: "100%", border: "none",
                                    background: styleConfig.fontFamily === f.value ? "#e0e7ff" : "none",
                                    cursor: "pointer", padding: "6px 10px", fontSize: 13,
                                    fontFamily: f.value, textAlign: "left", borderRadius: 4, color: "#374151",
                                }}>{f.label}</button>
                        ))}
                    </div>
                )}
            </div>

            <Sep />

            {/* Font size -/n/+ */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Btn title="Giảm" onMouseDown={(e) => { prevent(e); onStyleChange({ baseFontSize: Math.max(10, fontSize - 1) }); }}>
                    <span style={{ fontSize: 14, fontWeight: "normal" }}>−</span>
                </Btn>
                <span style={{ fontSize: 11, minWidth: 22, textAlign: "center", fontWeight: 600, color: "#374151" }}>{fontSize}</span>
                <Btn title="Tăng" onMouseDown={(e) => { prevent(e); onStyleChange({ baseFontSize: Math.min(24, fontSize + 1) }); }}>
                    <span style={{ fontSize: 14, fontWeight: "normal" }}>+</span>
                </Btn>
            </div>

            <Sep />

            <Btn active={isBold} title="Đậm" onMouseDown={(e) => { prevent(e); onStyleChange({ fontWeight: isBold ? "normal" : "bold" }); }}><b>B</b></Btn>
            <Btn active={isItalic} title="Nghiêng" onMouseDown={(e) => { prevent(e); onStyleChange({ fontStyle: isItalic ? "normal" : "italic" }); }}><i style={{ fontStyle: "italic" }}>I</i></Btn>
            <Btn active={isUnder} title="Gạch chân" onMouseDown={(e) => { prevent(e); onStyleChange({ textDecoration: isUnder ? "none" : "underline" }); }}><u>U</u></Btn>

            <Sep />

            <button
                onMouseDown={(e) => { prevent(e); onClose(); }}
                style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: 13, borderRadius: 4 }}
                title="Đóng"
            >✕</button>
        </div>
    );
});

export default MiniToolbar;