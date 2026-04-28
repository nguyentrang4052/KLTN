// import { useRef, useEffect, useCallback, memo } from "react";
// import { saveGlobalSelection, restoreGlobalSelection } from "../SelectionToolbar/SelectionToolbar";

// // ─── RICH TEXT FIELD ─────────────────────────────────────────────────────────
// // Toolbar is now handled globally by SelectionToolbar mounted at the app level.
// // This component only manages the contenteditable area and syncs state.
// const RichTextField = memo(({
//     value,
//     onChange,
//     onBlur,
//     placeholder,
//     multiline = false,
//     style = {},
//     styleConfig = {},
//     isEdit = true,
// }) => {
//     const editorRef = useRef(null);
//     const isComposingRef = useRef(false);
//     const lastValueRef = useRef(value || "");
//     const isFocusedRef = useRef(false);

//     // Mount: set initial HTML once
//     useEffect(() => {
//         if (editorRef.current) {
//             editorRef.current.innerHTML = value || "";
//             lastValueRef.current = value || "";
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // Sync external value when not focused
//     useEffect(() => {
//         if (!editorRef.current) return;
//         if (isFocusedRef.current) return;
//         if (value === lastValueRef.current) return;
//         editorRef.current.innerHTML = value || "";
//         lastValueRef.current = value || "";
//     }, [value]);

//     const handleInput = useCallback(() => {
//         if (!editorRef.current || isComposingRef.current) return;
//         const html = editorRef.current.innerHTML;
//         lastValueRef.current = html;
//         onChange(html);
//     }, [onChange]);

//     const handleCompositionStart = useCallback(() => {
//         isComposingRef.current = true;
//     }, []);

//     const handleCompositionEnd = useCallback(() => {
//         isComposingRef.current = false;
//         handleInput();
//     }, [handleInput]);

//     const handleFocus = useCallback(() => {
//         isFocusedRef.current = true;
//     }, []);

//     const handleBlur = useCallback(() => {
//         setTimeout(() => {
//             // Don't blur if toolbar was clicked
//             if (document.activeElement?.closest(".selection-toolbar")) return;
//             if (editorRef.current?.contains(document.activeElement)) return;
//             isFocusedRef.current = false;
//             if (onBlur) onBlur(editorRef.current?.innerHTML || "");
//         }, 200);
//     }, [onBlur]);

//     // Save selection on mouseup/keyup so toolbar has the correct range
//     const handleSelect = useCallback(() => {
//         if (isFocusedRef.current) saveGlobalSelection();
//     }, []);

//     if (!isEdit) {
//         return (
//             <div
//                 dangerouslySetInnerHTML={{ __html: value || placeholder || "" }}
//                 style={{
//                     ...style,
//                     color: value ? style.color : "#999",
//                     fontStyle: value ? "normal" : "italic",
//                 }}
//             />
//         );
//     }

//     return (
//         <div style={{ position: "relative", width: "100%" }}>
//             <div
//                 ref={editorRef}
//                 contentEditable
//                 suppressContentEditableWarning
//                 data-rich-editor="true"
//                 onInput={handleInput}
//                 onCompositionStart={handleCompositionStart}
//                 onCompositionEnd={handleCompositionEnd}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//                 onMouseUp={handleSelect}
//                 onKeyUp={handleSelect}
//                 style={{
//                     ...style,
//                     outline: "none",
//                     borderBottom: "1.5px dashed #ccc",
//                     minHeight: multiline ? 60 : 24,
//                     cursor: "text",
//                     padding: multiline ? "6px 0" : "2px 0",
//                     whiteSpace: "pre-wrap",
//                     wordBreak: "break-word",
//                 }}
//             />
//             {(!value || value === "<br>") && (
//                 <span
//                     style={{
//                         position: "absolute",
//                         top: multiline ? 6 : 2,
//                         left: 0,
//                         color: "#bbb",
//                         fontSize: style.fontSize || 13,
//                         fontFamily: style.fontFamily || "inherit",
//                         pointerEvents: "none",
//                         fontStyle: "italic",
//                     }}
//                 >
//                     {placeholder}
//                 </span>
//             )}
//         </div>
//     );
// });

// export default RichTextField;

import { useRef, useEffect, useCallback, memo } from "react";
import { saveGlobalSelection } from "../UnifiedToolbar/UnifiedToolbar";

const RichTextField = memo(({
    value, onChange, onBlur, placeholder, multiline = true, style = {}, isEdit = true,
}) => {
    const editorRef = useRef(null);
    const isFocusedRef = useRef(false);
    const isComposingRef = useRef(false);
    const lastValueRef = useRef(value || "");

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value || "";
            lastValueRef.current = value || "";
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!editorRef.current || isFocusedRef.current) return;
        if (value === lastValueRef.current) return;
        editorRef.current.innerHTML = value || "";
        lastValueRef.current = value || "";
    }, [value]);

    const handleInput = useCallback(() => {
        if (!editorRef.current || isComposingRef.current) return;
        const html = editorRef.current.innerHTML;
        lastValueRef.current = html;
        onChange(html);
    }, [onChange]);

    const handleFocus = useCallback(() => { isFocusedRef.current = true; }, []);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            if (document.activeElement?.closest(".selection-toolbar")) return;
            isFocusedRef.current = false;
            if (onBlur) onBlur(editorRef.current?.innerHTML || "");
        }, 200);
    }, [onBlur]);

    const handleSelect = useCallback(() => {
        if (isFocusedRef.current) saveGlobalSelection();
    }, []);

    if (!isEdit) {
        return value
            ? <div dangerouslySetInnerHTML={{ __html: value }} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", ...style }} />
            : <span style={{ color: "#bbb", fontStyle: "italic", ...style }}>{placeholder}</span>;
    }

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <div
                ref={editorRef}
                contentEditable suppressContentEditableWarning
                data-rich-editor="true"
                onInput={handleInput}
                onCompositionStart={() => { isComposingRef.current = true; }}
                onCompositionEnd={() => { isComposingRef.current = false; handleInput(); }}
                onFocus={handleFocus} onBlur={handleBlur}
                onMouseUp={handleSelect} onKeyUp={handleSelect}
                style={{
                    outline: "none", minHeight: multiline ? 64 : 24, cursor: "text",
                    padding: multiline ? "6px 0" : "2px 0",
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                    borderBottom: "1.5px dashed #ccc", ...style,
                }}
            />
            {(!value || value === "<br>" || value === "") && (
                <span style={{
                    position: "absolute", top: multiline ? 6 : 2, left: 0,
                    color: "#bbb", fontStyle: "italic", pointerEvents: "none",
                    fontSize: style.fontSize || 13, fontFamily: style.fontFamily || "inherit",
                }}>
                    {placeholder}
                </span>
            )}
        </div>
    );
});

export default RichTextField;