// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "./../common/ItemControls/ItemControls";
// import EditableField from "./../common/EditField/EditableField";

// const SAMPLE_DATA = {
//   personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Creative Director / UX Designer", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//   summary: "Creative Director với 5 năm kinh nghiệm xây dựng thương hiệu và thiết kế trải nghiệm người dùng. Kết hợp tư duy chiến lược và khả năng sáng tạo để tạo ra các sản phẩm số ấn tượng.",
//   experiences: [
//     { company: "Studio Creative XYZ", position: "Creative Director", duration: "01/2022 – Hiện tại", description: "• Lãnh đạo team 8 designer thực hiện các dự án thương hiệu lớn\n• Phát triển hệ thống nhận diện thương hiệu cho 20+ khách hàng" },
//     { company: "Agency ABC", position: "Senior UI/UX Designer", duration: "03/2019 – 12/2021", description: "• Thiết kế UX/UI cho 15+ ứng dụng mobile và web\n• Tăng 40% tỷ lệ chuyển đổi nhờ tối ưu trải nghiệm người dùng" }
//   ],
//   education: [{ institution: "Đại học Mỹ thuật TP. Hồ Chí Minh", degree: "Cử nhân Thiết kế Đồ họa", year: "2015 – 2019", gpa: "GPA: 3.8/4.0" }],
//   skills: [
//     { category: "Thiết kế", items: "Figma, Adobe XD, Illustrator, Photoshop, After Effects" },
//     { category: "Branding", items: "Brand Strategy, Visual Identity, Typography, Color Theory" },
//     { category: "Digital", items: "HTML/CSS, Motion Design, 3D Modeling" },
//     { category: "Ngoại ngữ", items: "Tiếng Anh (Fluent), Tiếng Pháp (A2)" }
//   ],
//   awards: [
//     { title: "Best Design Agency of the Year", issuer: "Vietnam Creative Awards", year: "2023", description: "Dự án rebranding cho thương hiệu F&B hàng đầu Việt Nam" },
//     { title: "Gold Award – Brand Identity", issuer: "Asia Design Federation", year: "2022", description: "Thiết kế nhận diện thương hiệu cho startup công nghệ" }
//   ],
//   certifications: [
//     { name: "Google UX Design Certificate", issuer: "Google / Coursera", year: "2022", score: "Distinction" },
//     { name: "Adobe Certified Expert", issuer: "Adobe", year: "2021", score: "Pass" }
//   ],
//   activities: [{ organization: "Vietnam Designers Community", role: "Mentor & Speaker", duration: "2020 – nay", description: "• Hướng dẫn 50+ designer junior về career path\n• Diễn giả tại 10+ workshop và hội thảo thiết kế" }]
// };

// const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
// const SAMPLE_SECTION_TITLES = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };

// const hasContent = (v) => {
//   if (!v) return false;
//   if (typeof v === "string") return v.trim() !== "";
//   if (Array.isArray(v)) return v.some(hasContent);
//   if (typeof v === "object") return Object.values(v).some(hasContent);
//   return false;
// };

// // ─── Stable inputs (defined OUTSIDE) ─────────────────────────────────────────
// const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);

//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//   const base = { background: "transparent", border: "none", outline: "none", fontFamily: "inherit", width: "100%", ...style };
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ ...base, resize: "vertical", minHeight: 60, border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", boxSizing: "border-box", lineHeight: 1.5 }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
// });

// const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);

//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//   if (!isEdit) return hasContent(value) ? <div style={style}>{value}</div> : null;
//   const base = { background: "transparent", border: "none", borderBottom: "1px dashed #ddd", outline: "none", fontFamily: "inherit", ...style };
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ width: "100%", border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", fontSize: 12, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5, background: "transparent" }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
// });

// // ─── Section Headers (SỬA ĐỂ NHẬN styleConfig) ─────────────────────────────
// const SHead = memo(({ sectionKey, icon, idx, isEdit, accent, getTitle, updateTitle, moveSection, totalSections, onAdd, styleConfig = {} }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   const titleColor = styleConfig.accentColor || accent;
//   const fontSize = (styleConfig.baseFontSize || 13) + 2;
//   const fontFamily = styleConfig.fontFamily || "inherit";

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, position: "relative", zIndex: 2 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//         <div style={{ width: 24, height: 24, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: titleColor }}>{icon}</div>
//         {isEdit ? (
//           <input ref={inputRef} value={local}
//             onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//             onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//             style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, background: "transparent", border: "none", borderBottom: "1px dashed " + titleColor + "66", outline: "none" }} />
//         ) : (
//           <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>{getTitle(sectionKey)}</div>
//         )}
//       </div>
//       {isEdit && (
//         <div style={{ display: "flex", gap: 3 }}>
//           {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>+ Thêm</button>}
//           {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
//             const dis = dir === -1 ? idx === 0 : idx === totalSections - 1;
//             return (
//               <button key={lbl} onClick={() => moveSection(idx, dir)} disabled={dis}
//                 style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${titleColor}33`, borderRadius: 3, color: titleColor, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// });

// const SideHead = memo(({ sectionKey, icon, isEdit, accent, getTitle, updateTitle, onAdd, styleConfig = {} }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   const titleColor = styleConfig.accentColor || accent;
//   const fontSize = (styleConfig.baseFontSize || 13) + 1;
//   const fontFamily = styleConfig.fontFamily || "inherit";

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <div style={{ width: 20, height: 20, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: titleColor }}>{icon}</div>
//         {isEdit ? (
//           <input ref={inputRef} value={local}
//             onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//             onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//             style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, background: "transparent", border: "none", borderBottom: "1px dashed " + titleColor + "55", outline: "none" }} />
//         ) : (
//           <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>{getTitle(sectionKey)}</div>
//         )}
//       </div>
//       {isEdit && onAdd && <button onClick={onAdd} style={{ fontSize: 10, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 6, padding: "1px 6px", cursor: "pointer" }}>+</button>}
//     </div>
//   );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, rowStyle = {}, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", padding: "8px 12px", borderLeft: `3px solid ${accent}`, background: accent + "04", borderRadius: "0 6px 6px 0", marginBottom: 10, paddingRight: isEdit ? 100 : 12, ...rowStyle }}>
//     {isEdit && <div style={{ position: "absolute", top: 4, right: 4, zIndex: 1 }}>
//       <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)} isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//     </div>}
//     {children}
//   </div>
// ));

// const SidebarItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", marginBottom: 8, paddingBottom: 8, borderBottom: "1px dashed #eee", paddingRight: isEdit ? 60 : 0 }}>
//     {isEdit && <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2 }}>
//       <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
//       <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === total - 1 ? 0.3 : 1 }}>↓</button>
//       <button onClick={() => delItem(section, idx)} style={{ width: 16, height: 16, border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 2, fontSize: 8, cursor: "pointer" }}>×</button>
//     </div>}
//     {children}
//   </div>
// ));

// // ─── Avatar Editor (defined OUTSIDE) ─────────────────────────────────────────
// const AvatarEditor = memo(({ avatarUrl, isEdit, onAvatarChange, accent }) => {
//   const fileInputRef = useRef(null);
//   const handleFileChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onAvatarChange(ev.target.result);
//     reader.readAsDataURL(file);
//   }, [onAvatarChange]);

//   return (
//     <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
//       <div style={{ width: 70, height: 70, borderRadius: "50%", background: avatarUrl ? "transparent" : "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
//         {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "✦"}
//       </div>
//       {isEdit && (
//         <>
//           <button onClick={() => fileInputRef.current?.click()} style={{
//             position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%",
//             background: "white", border: "none", cursor: "pointer", fontSize: 11,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
//           }} title="Đổi ảnh">📷</button>
//           <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
//         </>
//       )}
//     </div>
//   );
// });

// function getContrastColor(hexColor) {
//   const hex = hexColor.replace('#', '');
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
//   return yiq >= 128 ? '#1a1a1a' : '#ffffff';
// }

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function CreativeCV({
//   data, onChange, isEdit,
//   accent = "#5B2D8E",
//   styleConfig = {},
//   sectionOrder = ["summary", "experiences", "education", "awards", "activities"],
//   setSectionOrder,
//   sectionTitles = {},
//   setSectionTitles,
//   useSampleData = false,
// }) {
//   const shouldUseSample = useMemo(() => {
//     if (useSampleData) return true;
//     if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
//     return false;
//   }, [useSampleData, isEdit, data]);

//   const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
//   const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
//   const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
//   const isUserEditing = useRef(false);

//   const contrastColor = getContrastColor(styleConfig.accentColor || accent);
//   const headerTextColor = contrastColor;
//   const bodyTextColor = styleConfig.textColor || "#333333";
//   const bodyBgColor = styleConfig.backgroundColor || "#ffffff";

//   useEffect(() => {
//     if (isUserEditing.current) return;
//     if (shouldUseSample) return;
//     setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
//   }, [data, sectionOrder, sectionTitles, shouldUseSample]);

//   const pi = localData.personalInfo || {};

//   const upd = useCallback((section, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => ({ ...d, [section]: val }));
//     onChange(section, val);
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const updPi = useCallback((key, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => { const np = { ...(d.personalInfo || {}), [key]: val }; onChange("personalInfo", np); return { ...d, personalInfo: np }; });
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const updArr = useCallback((section, idx, key, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => { const arr = [...(d[section] || [])]; arr[idx] = { ...arr[idx], [key]: val }; onChange(section, arr); return { ...d, [section]: arr }; });
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const addItem = useCallback((section, empty) => {
//     setLocalData(d => { const arr = [...(d[section] || []), { ...empty }]; onChange(section, arr); return { ...d, [section]: arr }; });
//   }, [onChange]);

//   const delItem = useCallback((section, idx) => {
//     setLocalData(d => { const arr = (d[section] || []).filter((_, i) => i !== idx); onChange(section, arr); return { ...d, [section]: arr }; });
//   }, [onChange]);

//   const moveItem = useCallback((section, idx, dir) => {
//     setLocalData(d => {
//       const arr = [...(d[section] || [])]; const ni = idx + dir;
//       if (ni < 0 || ni >= arr.length) return d;
//       [arr[idx], arr[ni]] = [arr[ni], arr[idx]]; onChange(section, arr); return { ...d, [section]: arr };
//     });
//   }, [onChange]);

//   const moveSection = useCallback((idx, dir) => {
//     const ni = idx + dir; if (ni < 0 || ni >= localOrder.length) return;
//     const arr = [...localOrder];[arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//     setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//   }, [localOrder, setSectionOrder]);

//   const updateTitle = useCallback((key, title) => {
//     const nt = { ...localTitles, [key]: title };
//     setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//   }, [localTitles, setSectionTitles]);

//   const DEFAULTS = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };
//   const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//   const handleAvatarChange = useCallback((url) => updPi("avatar", url), [updPi]);

//   const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
//   const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));
//   const sectionIconMap = { summary: "◑", experiences: "⧖", education: "◻", awards: "★", activities: "◉", skills: "◈", certifications: "◎" };

//   return (
//     <div id="cv-paper" className="cv-paper" style={{
//       width: "100%",
//       maxWidth: "800px",
//       minHeight: "1123px",
//       background: bodyBgColor,
//       fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif",
//       fontSize: styleConfig.baseFontSize || 14,
//       lineHeight: styleConfig.lineHeight || 1.6,
//       color: bodyTextColor,
//     }}>
//       {/* Header */}
//       <div style={{
//         background: `linear-gradient(120deg, ${styleConfig.accentColor || accent}, ${(styleConfig.accentColor || accent)}cc)`,
//         padding: "32px 40px",
//         position: "relative",
//         overflow: "hidden",
//         color: headerTextColor
//       }}>
//         <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
//         <div style={{ position: "absolute", right: 60, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
//         <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
//           <AvatarEditor avatarUrl={pi.avatar} isEdit={isEdit} onAvatarChange={handleAvatarChange} accent={styleConfig.accentColor || accent} />
//           <div style={{ flex: 1 }}>
//             <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//               style={{ fontSize: 28, fontWeight: "bold", color: headerTextColor, marginBottom: 4, borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.4)" : "none" }} />
//             <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh sáng tạo"
//               style={{ fontSize: 14, color: headerTextColor + "cc", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.3)" : "none", width: "70%" }} />
//           </div>
//         </div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 16, position: "relative" }}>
//           {[["email", "✉ ", "Email"], ["phone", "☎ ", "Điện thoại"], ["linkedin", "⊕ ", "LinkedIn"], ["address", "◎ ", "Địa chỉ"]].map(([key, icon, ph]) => (
//             <div key={key} style={{ display: "flex", width: "fit-content", alignItems: "center", gap: 3, fontSize: 11, color: headerTextColor + "cc", background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 12 }}>
//               <span>{icon}</span>
//               {isEdit
//                 ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 11, color: headerTextColor + "cc", width: 120, borderBottom: "none" }} />
//                 : <span>{pi[key] || ph}</span>}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: "flex" }}>
//         {/* Left sidebar */}
//         <div style={{
//           width: "40%",
//           padding: "20px 16px 20px 24px",
//           background: bodyBgColor === "#ffffff" ? "#FAFAFA" : bodyBgColor + "f5",
//           borderRight: `1px solid ${bodyTextColor}15`,
//           flexShrink: 0,
//           color: bodyTextColor,
//         }}>
//           {(isEdit || hasContent(localData.summary)) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="summary"
//                 icon="◑"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               <EditableField
//                 richText={true}
//                 multiline={true}
//                 value={localData.summary || ""}
//                 onChange={v => upd("summary", v)}
//                 placeholder="Mô tả sáng tạo về bản thân..."
//                 isEdit={isEdit}
//                 styleConfig={styleConfig}
//                 style={{ fontSize: 12, color: bodyTextColor }}
//               />
//             </div>
//           )}

//           {(isEdit || filteredSkills.length > 0) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="skills"
//                 icon="◈"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 onAdd={() => addItem("skills", { category: "", items: "" })}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               {filteredSkills.map((sk, idx) => (
//                 <SidebarItemRow key={idx} section="skills" idx={idx} total={filteredSkills.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                   <EditableField
//                     richText={false}
//                     value={sk.category}
//                     onChange={v => updArr("skills", idx, "category", v)}
//                     placeholder="Nhóm kỹ năng"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 11, fontWeight: "bold", color: styleConfig.accentColor || accent, marginBottom: 3 }}
//                   />
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: isEdit ? 4 : 0 }}>
//                     {(sk.items || "").split(",").filter(Boolean).map((item, i) => (
//                       <span key={i} style={{ fontSize: 10, background: (styleConfig.accentColor || accent) + "12", color: styleConfig.accentColor || accent, padding: "2px 6px", borderRadius: 8 }}>{item.trim()}</span>
//                     ))}
//                   </div>
//                   {isEdit && (
//                     <EditableField
//                       richText={false}
//                       multiline={true}
//                       value={sk.items || ""}
//                       onChange={v => updArr("skills", idx, "items", v)}
//                       placeholder="skill1, skill2, ..."
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: bodyTextColor + "99" }}
//                     />
//                   )}
//                 </SidebarItemRow>
//               ))}
//             </div>
//           )}

//           {(isEdit || filteredCerts.length > 0) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="certifications"
//                 icon="◎"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               {filteredCerts.map((cert, idx) => (
//                 <SidebarItemRow key={idx} section="certifications" idx={idx} total={filteredCerts.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                   <EditableField
//                     richText={false}
//                     value={cert.name}
//                     onChange={v => updArr("certifications", idx, "name", v)}
//                     placeholder="Tên chứng chỉ"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 11, fontWeight: "bold", color: bodyTextColor }}
//                   />
//                   <EditableField
//                     richText={false}
//                     value={cert.issuer}
//                     onChange={v => updArr("certifications", idx, "issuer", v)}
//                     placeholder="Tổ chức"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 10, color: bodyTextColor + "99", display: "block" }}
//                   />
//                   {(isEdit || hasContent(cert.year)) && (
//                     <EditableField
//                       richText={false}
//                       value={cert.year}
//                       onChange={v => updArr("certifications", idx, "year", v)}
//                       placeholder="Năm"
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: bodyTextColor + "88" }}
//                     />
//                   )}
//                   {(isEdit || hasContent(cert.score)) && (
//                     <EditableField
//                       richText={false}
//                       value={cert.score}
//                       onChange={v => updArr("certifications", idx, "score", v)}
//                       placeholder="Score"
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: styleConfig.accentColor || accent, fontWeight: 600 }}
//                     />
//                   )}
//                 </SidebarItemRow>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Main content */}
//         <div style={{ flex: 1, padding: "20px 28px 20px 20px", color: bodyTextColor }}>
//           {localOrder.map((key, idx) => {
//             if (key === "summary") return null;

//             if (key === "experiences") {
//               const arr = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((exp, i) => (
//                     <ItemRow key={i} section="experiences" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 6 }}>
//                         <EditableField
//                           richText={false}
//                           value={exp.position}
//                           onChange={v => updArr("experiences", i, "position", v)}
//                           placeholder="Vị trí công việc"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={exp.duration}
//                           onChange={v => updArr("experiences", i, "duration", v)}
//                           placeholder="Thời gian"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 120 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={exp.company}
//                         onChange={v => updArr("experiences", i, "company", v)}
//                         placeholder="Công ty"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         multiline={true}
//                         value={exp.description}
//                         onChange={v => updArr("experiences", i, "description", v)}
//                         placeholder="Mô tả công việc..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "education") {
//               const arr = (localData.education || []).filter(e => isEdit || hasContent(e.degree) || hasContent(e.institution));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((edu, i) => (
//                     <ItemRow key={i} section="education" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem} rowStyle={{ borderLeftColor: (styleConfig.accentColor || accent) + "55", background: "#fafafa" }}>
//                       <EditableField
//                         richText={false}
//                         value={edu.degree}
//                         onChange={v => updArr("education", i, "degree", v)}
//                         placeholder="Bằng cấp / Chuyên ngành"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor }}
//                       />
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={edu.institution}
//                           onChange={v => updArr("education", i, "institution", v)}
//                           placeholder="Tên trường"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 12, color: bodyTextColor + "99", flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={edu.year}
//                           onChange={v => updArr("education", i, "year", v)}
//                           placeholder="Năm"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 70 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={edu.gpa}
//                           onChange={v => updArr("education", i, "gpa", v)}
//                           placeholder="GPA"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 60 }}
//                         />
//                       </div>
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "awards") {
//               const arr = (localData.awards || []).filter(a => isEdit || hasContent(a.title));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((aw, i) => (
//                     <ItemRow key={i} section="awards" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={aw.title}
//                           onChange={v => updArr("awards", i, "title", v)}
//                           placeholder="Tên giải thưởng"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={aw.year}
//                           onChange={v => updArr("awards", i, "year", v)}
//                           placeholder="Năm"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 50 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={aw.issuer}
//                         onChange={v => updArr("awards", i, "issuer", v)}
//                         placeholder="Tổ chức trao giải"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         value={aw.description}
//                         onChange={v => updArr("awards", i, "description", v)}
//                         placeholder="Mô tả..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: bodyTextColor + "99", marginTop: 2 }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "activities") {
//               const arr = (localData.activities || []).filter(a => isEdit || hasContent(a.role) || hasContent(a.organization));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((act, i) => (
//                     <ItemRow key={i} section="activities" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={act.role}
//                           onChange={v => updArr("activities", i, "role", v)}
//                           placeholder="Vai trò / Dự án"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={act.duration}
//                           onChange={v => updArr("activities", i, "duration", v)}
//                           placeholder="Thời gian"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 110 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={act.organization}
//                         onChange={v => updArr("activities", i, "organization", v)}
//                         placeholder="Tổ chức / CLB"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         multiline={true}
//                         value={act.description}
//                         onChange={v => updArr("activities", i, "description", v)}
//                         placeholder="Mô tả hoạt động..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             return null;
//           })}
//         </div>
//       </div>
//       <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//     </div>
//   );
// }



// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "./../common/ItemControls/ItemControls";
// import EditableField from "./../common/EditField/EditableField";

// const SAMPLE_DATA = {
//   personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Creative Director / UX Designer", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//   summary: "Creative Director với 5 năm kinh nghiệm xây dựng thương hiệu và thiết kế trải nghiệm người dùng. Kết hợp tư duy chiến lược và khả năng sáng tạo để tạo ra các sản phẩm số ấn tượng.",
//   experiences: [
//     { company: "Studio Creative XYZ", position: "Creative Director", duration: "01/2022 – Hiện tại", description: "• Lãnh đạo team 8 designer thực hiện các dự án thương hiệu lớn\n• Phát triển hệ thống nhận diện thương hiệu cho 20+ khách hàng" },
//     { company: "Agency ABC", position: "Senior UI/UX Designer", duration: "03/2019 – 12/2021", description: "• Thiết kế UX/UI cho 15+ ứng dụng mobile và web\n• Tăng 40% tỷ lệ chuyển đổi nhờ tối ưu trải nghiệm người dùng" }
//   ],
//   education: [{ institution: "Đại học Mỹ thuật TP. Hồ Chí Minh", degree: "Cử nhân Thiết kế Đồ họa", year: "2015 – 2019", gpa: "GPA: 3.8/4.0" }],
//   skills: [
//     { category: "Thiết kế", items: "Figma, Adobe XD, Illustrator, Photoshop, After Effects" },
//     { category: "Branding", items: "Brand Strategy, Visual Identity, Typography, Color Theory" },
//     { category: "Digital", items: "HTML/CSS, Motion Design, 3D Modeling" },
//     { category: "Ngoại ngữ", items: "Tiếng Anh (Fluent), Tiếng Pháp (A2)" }
//   ],
//   awards: [
//     { title: "Best Design Agency of the Year", issuer: "Vietnam Creative Awards", year: "2023", description: "Dự án rebranding cho thương hiệu F&B hàng đầu Việt Nam" },
//     { title: "Gold Award – Brand Identity", issuer: "Asia Design Federation", year: "2022", description: "Thiết kế nhận diện thương hiệu cho startup công nghệ" }
//   ],
//   certifications: [
//     { name: "Google UX Design Certificate", issuer: "Google / Coursera", year: "2022", score: "Distinction" },
//     { name: "Adobe Certified Expert", issuer: "Adobe", year: "2021", score: "Pass" }
//   ],
//   activities: [{ organization: "Vietnam Designers Community", role: "Mentor & Speaker", duration: "2020 – nay", description: "• Hướng dẫn 50+ designer junior về career path\n• Diễn giả tại 10+ workshop và hội thảo thiết kế" }]
// };

// const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
// const SAMPLE_SECTION_TITLES = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };

// const hasContent = (v) => {
//   if (!v) return false;
//   if (typeof v === "string") return v.trim() !== "";
//   if (Array.isArray(v)) return v.some(hasContent);
//   if (typeof v === "object") return Object.values(v).some(hasContent);
//   return false;
// };

// // ─── Stable inputs (defined OUTSIDE) ─────────────────────────────────────────
// const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);

//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//   const base = { background: "transparent", border: "none", outline: "none", fontFamily: "inherit", width: "100%", ...style };
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ ...base, resize: "vertical", minHeight: 60, border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", boxSizing: "border-box", lineHeight: 1.5 }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
// });

// const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);

//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//   if (!isEdit) return hasContent(value) ? <div style={style}>{value}</div> : null;
//   const base = { background: "transparent", border: "none", borderBottom: "1px dashed #ddd", outline: "none", fontFamily: "inherit", ...style };
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ width: "100%", border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", fontSize: 12, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5, background: "transparent" }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
// });

// // ─── Section Headers (SỬA ĐỂ NHẬN styleConfig) ─────────────────────────────
// const SHead = memo(({ sectionKey, icon, idx, isEdit, accent, getTitle, updateTitle, moveSection, totalSections, onAdd, styleConfig = {} }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   const titleColor = styleConfig.accentColor || accent;
//   const fontSize = (styleConfig.baseFontSize || 13) + 2;
//   const fontFamily = styleConfig.fontFamily || "inherit";

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, position: "relative", zIndex: 2 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//         <div style={{ width: 24, height: 24, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: titleColor }}>{icon}</div>
//         {isEdit ? (
//           <input ref={inputRef} value={local}
//             onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//             onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//             style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, background: "transparent", border: "none", borderBottom: "1px dashed " + titleColor + "66", outline: "none" }} />
//         ) : (
//           <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>{getTitle(sectionKey)}</div>
//         )}
//       </div>
//       {isEdit && (
//         <div style={{ display: "flex", gap: 3 }}>
//           {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>+ Thêm</button>}
//           {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
//             const dis = dir === -1 ? idx === 0 : idx === totalSections - 1;
//             return (
//               <button key={lbl} onClick={() => moveSection(idx, dir)} disabled={dis}
//                 style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${titleColor}33`, borderRadius: 3, color: titleColor, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// });

// const SideHead = memo(({ sectionKey, icon, isEdit, accent, getTitle, updateTitle, onAdd, styleConfig = {} }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   const titleColor = styleConfig.accentColor || accent;
//   const fontSize = (styleConfig.baseFontSize || 13) + 1;
//   const fontFamily = styleConfig.fontFamily || "inherit";

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <div style={{ width: 20, height: 20, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: titleColor }}>{icon}</div>
//         {isEdit ? (
//           <input ref={inputRef} value={local}
//             onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//             onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//             style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, background: "transparent", border: "none", borderBottom: "1px dashed " + titleColor + "55", outline: "none" }} />
//         ) : (
//           <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>{getTitle(sectionKey)}</div>
//         )}
//       </div>
//       {isEdit && onAdd && <button onClick={onAdd} style={{ fontSize: 10, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 6, padding: "1px 6px", cursor: "pointer" }}>+</button>}
//     </div>
//   );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, rowStyle = {}, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", padding: "8px 12px", borderLeft: `3px solid ${accent}`, background: accent + "04", borderRadius: "0 6px 6px 0", marginBottom: 10, paddingRight: isEdit ? 100 : 12, ...rowStyle }}>
//     {isEdit && <div style={{ position: "absolute", top: 4, right: 4, zIndex: 1 }}>
//       <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)} isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//     </div>}
//     {children}
//   </div>
// ));

// const SidebarItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", marginBottom: 8, paddingBottom: 8, borderBottom: "1px dashed #eee", paddingRight: isEdit ? 60 : 0 }}>
//     {isEdit && <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2 }}>
//       <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
//       <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === total - 1 ? 0.3 : 1 }}>↓</button>
//       <button onClick={() => delItem(section, idx)} style={{ width: 16, height: 16, border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 2, fontSize: 8, cursor: "pointer" }}>×</button>
//     </div>}
//     {children}
//   </div>
// ));

// // ─── Avatar Editor (defined OUTSIDE) ─────────────────────────────────────────
// const AvatarEditor = memo(({ avatarUrl, isEdit, onAvatarChange, accent }) => {
//   const fileInputRef = useRef(null);
//   const handleFileChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onAvatarChange(ev.target.result);
//     reader.readAsDataURL(file);
//   }, [onAvatarChange]);

//   return (
//     <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
//       <div style={{ width: 70, height: 70, borderRadius: "50%", background: avatarUrl ? "transparent" : "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
//         {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "✦"}
//       </div>
//       {isEdit && (
//         <>
//           <button onClick={() => fileInputRef.current?.click()} style={{
//             position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%",
//             background: "white", border: "none", cursor: "pointer", fontSize: 11,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
//           }} title="Đổi ảnh">📷</button>
//           <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
//         </>
//       )}
//     </div>
//   );
// });

// function getContrastColor(hexColor) {
//   const hex = hexColor.replace('#', '');
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
//   return yiq >= 128 ? '#1a1a1a' : '#ffffff';
// }

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function CreativeCV({
//   data, onChange, isEdit,
//   accent = "#5B2D8E",
//   styleConfig = {},
//   sectionOrder = ["summary", "experiences", "education", "awards", "activities"],
//   setSectionOrder,
//   sectionTitles = {},
//   setSectionTitles,
//   useSampleData = false,
// }) {
//   const shouldUseSample = useMemo(() => {
//     if (useSampleData) return true;
//     if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
//     return false;
//   }, [useSampleData, isEdit, data]);

//   const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
//   const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
//   const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
//   const isUserEditing = useRef(false);

//   const contrastColor = getContrastColor(styleConfig.accentColor || accent);
//   const headerTextColor = contrastColor;
//   const bodyTextColor = styleConfig.textColor || "#333333";
//   const bodyBgColor = styleConfig.backgroundColor || "#ffffff";

//   useEffect(() => {
//     if (isUserEditing.current) return;
//     if (shouldUseSample) return;
//     setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
//   }, [data, sectionOrder, sectionTitles, shouldUseSample, forceReset]);

//   const pi = localData.personalInfo || {};

//   const upd = useCallback((section, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => ({ ...d, [section]: val }));
//     onChange(section, val);
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const updPi = useCallback((key, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => { const np = { ...(d.personalInfo || {}), [key]: val }; onChange("personalInfo", np); return { ...d, personalInfo: np }; });
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const updArr = useCallback((section, idx, key, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => { const arr = [...(d[section] || [])]; arr[idx] = { ...arr[idx], [key]: val }; onChange(section, arr); return { ...d, [section]: arr }; });
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const addItem = useCallback((section, empty) => {
//     setLocalData(d => { const arr = [...(d[section] || []), { ...empty }]; onChange(section, arr); return { ...d, [section]: arr }; });
//   }, [onChange]);

//   const delItem = useCallback((section, idx) => {
//     setLocalData(d => { const arr = (d[section] || []).filter((_, i) => i !== idx); onChange(section, arr); return { ...d, [section]: arr }; });
//   }, [onChange]);

//   const moveItem = useCallback((section, idx, dir) => {
//     setLocalData(d => {
//       const arr = [...(d[section] || [])]; const ni = idx + dir;
//       if (ni < 0 || ni >= arr.length) return d;
//       [arr[idx], arr[ni]] = [arr[ni], arr[idx]]; onChange(section, arr); return { ...d, [section]: arr };
//     });
//   }, [onChange]);

//   const moveSection = useCallback((idx, dir) => {
//     const ni = idx + dir; if (ni < 0 || ni >= localOrder.length) return;
//     const arr = [...localOrder];[arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//     setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//   }, [localOrder, setSectionOrder]);

//   const updateTitle = useCallback((key, title) => {
//     const nt = { ...localTitles, [key]: title };
//     setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//   }, [localTitles, setSectionTitles]);

//   const DEFAULTS = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };
//   const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//   const handleAvatarChange = useCallback((url) => updPi("avatar", url), [updPi]);

//   const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
//   const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));
//   const sectionIconMap = { summary: "◑", experiences: "⧖", education: "◻", awards: "★", activities: "◉", skills: "◈", certifications: "◎" };

//   return (
//     <div id="cv-paper" className="cv-paper" style={{
//       width: "100%",
//       maxWidth: "800px",
//       minHeight: "1123px",
//       background: bodyBgColor,
//       fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif",
//       fontSize: styleConfig.baseFontSize || 14,
//       lineHeight: styleConfig.lineHeight || 1.6,
//       color: bodyTextColor,
//     }}>
//       {/* Header */}
//       <div style={{
//         background: `linear-gradient(120deg, ${styleConfig.accentColor || accent}, ${(styleConfig.accentColor || accent)}cc)`,
//         padding: "32px 40px",
//         position: "relative",
//         overflow: "hidden",
//         color: headerTextColor
//       }}>
//         <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
//         <div style={{ position: "absolute", right: 60, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
//         <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
//           <AvatarEditor avatarUrl={pi.avatar} isEdit={isEdit} onAvatarChange={handleAvatarChange} accent={styleConfig.accentColor || accent} />
//           <div style={{ flex: 1 }}>
//             <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//               style={{ fontSize: 28, fontWeight: "bold", color: headerTextColor, marginBottom: 4, borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.4)" : "none" }} />
//             <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh sáng tạo"
//               style={{ fontSize: 14, color: headerTextColor + "cc", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.3)" : "none", width: "70%" }} />
//           </div>
//         </div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 16, position: "relative" }}>
//           {[["email", "✉ ", "Email"], ["phone", "☎ ", "Điện thoại"], ["linkedin", "⊕ ", "LinkedIn"], ["address", "◎ ", "Địa chỉ"]].map(([key, icon, ph]) => (
//             <div key={key} style={{ display: "flex", width: "fit-content", alignItems: "center", gap: 3, fontSize: 11, color: headerTextColor + "cc", background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 12 }}>
//               <span>{icon}</span>
//               {isEdit
//                 ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 11, color: headerTextColor + "cc", width: 120, borderBottom: "none" }} />
//                 : <span>{pi[key] || ph}</span>}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: "flex" }}>
//         {/* Left sidebar */}
//         <div style={{
//           width: "40%",
//           padding: "20px 16px 20px 24px",
//           background: bodyBgColor === "#ffffff" ? "#FAFAFA" : bodyBgColor + "f5",
//           borderRight: `1px solid ${bodyTextColor}15`,
//           flexShrink: 0,
//           color: bodyTextColor,
//         }}>
//           {(isEdit || hasContent(localData.summary)) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="summary"
//                 icon="◑"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               <EditableField
//                 richText={true}
//                 multiline={true}
//                 value={localData.summary || ""}
//                 onChange={v => upd("summary", v)}
//                 placeholder="Mô tả sáng tạo về bản thân..."
//                 isEdit={isEdit}
//                 styleConfig={styleConfig}
//                 style={{ fontSize: 12, color: bodyTextColor }}
//               />
//             </div>
//           )}

//           {(isEdit || filteredSkills.length > 0) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="skills"
//                 icon="◈"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 onAdd={() => addItem("skills", { category: "", items: "" })}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               {filteredSkills.map((sk, idx) => (
//                 <SidebarItemRow key={idx} section="skills" idx={idx} total={filteredSkills.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                   <EditableField
//                     richText={false}
//                     value={sk.category}
//                     onChange={v => updArr("skills", idx, "category", v)}
//                     placeholder="Nhóm kỹ năng"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 11, fontWeight: "bold", color: styleConfig.accentColor || accent, marginBottom: 3 }}
//                   />
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: isEdit ? 4 : 0 }}>
//                     {(sk.items || "").split(",").filter(Boolean).map((item, i) => (
//                       <span key={i} style={{ fontSize: 10, background: (styleConfig.accentColor || accent) + "12", color: styleConfig.accentColor || accent, padding: "2px 6px", borderRadius: 8 }}>{item.trim()}</span>
//                     ))}
//                   </div>
//                   {isEdit && (
//                     <EditableField
//                       richText={false}
//                       multiline={true}
//                       value={sk.items || ""}
//                       onChange={v => updArr("skills", idx, "items", v)}
//                       placeholder="skill1, skill2, ..."
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: bodyTextColor + "99" }}
//                     />
//                   )}
//                 </SidebarItemRow>
//               ))}
//             </div>
//           )}

//           {(isEdit || filteredCerts.length > 0) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="certifications"
//                 icon="◎"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               {filteredCerts.map((cert, idx) => (
//                 <SidebarItemRow key={idx} section="certifications" idx={idx} total={filteredCerts.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                   <EditableField
//                     richText={false}
//                     value={cert.name}
//                     onChange={v => updArr("certifications", idx, "name", v)}
//                     placeholder="Tên chứng chỉ"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 11, fontWeight: "bold", color: bodyTextColor }}
//                   />
//                   <EditableField
//                     richText={false}
//                     value={cert.issuer}
//                     onChange={v => updArr("certifications", idx, "issuer", v)}
//                     placeholder="Tổ chức"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 10, color: bodyTextColor + "99", display: "block" }}
//                   />
//                   {(isEdit || hasContent(cert.year)) && (
//                     <EditableField
//                       richText={false}
//                       value={cert.year}
//                       onChange={v => updArr("certifications", idx, "year", v)}
//                       placeholder="Năm"
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: bodyTextColor + "88" }}
//                     />
//                   )}
//                   {(isEdit || hasContent(cert.score)) && (
//                     <EditableField
//                       richText={false}
//                       value={cert.score}
//                       onChange={v => updArr("certifications", idx, "score", v)}
//                       placeholder="Score"
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: styleConfig.accentColor || accent, fontWeight: 600 }}
//                     />
//                   )}
//                 </SidebarItemRow>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Main content */}
//         <div style={{ flex: 1, padding: "20px 28px 20px 20px", color: bodyTextColor }}>
//           {localOrder.map((key, idx) => {
//             if (key === "summary") return null;

//             if (key === "experiences") {
//               const arr = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((exp, i) => (
//                     <ItemRow key={i} section="experiences" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 6 }}>
//                         <EditableField
//                           richText={false}
//                           value={exp.position}
//                           onChange={v => updArr("experiences", i, "position", v)}
//                           placeholder="Vị trí công việc"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={exp.duration}
//                           onChange={v => updArr("experiences", i, "duration", v)}
//                           placeholder="Thời gian"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 120 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={exp.company}
//                         onChange={v => updArr("experiences", i, "company", v)}
//                         placeholder="Công ty"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         multiline={true}
//                         value={exp.description}
//                         onChange={v => updArr("experiences", i, "description", v)}
//                         placeholder="Mô tả công việc..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "education") {
//               const arr = (localData.education || []).filter(e => isEdit || hasContent(e.degree) || hasContent(e.institution));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((edu, i) => (
//                     <ItemRow key={i} section="education" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem} rowStyle={{ borderLeftColor: (styleConfig.accentColor || accent) + "55", background: "#fafafa" }}>
//                       <EditableField
//                         richText={false}
//                         value={edu.degree}
//                         onChange={v => updArr("education", i, "degree", v)}
//                         placeholder="Bằng cấp / Chuyên ngành"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor }}
//                       />
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={edu.institution}
//                           onChange={v => updArr("education", i, "institution", v)}
//                           placeholder="Tên trường"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 12, color: bodyTextColor + "99", flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={edu.year}
//                           onChange={v => updArr("education", i, "year", v)}
//                           placeholder="Năm"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 70 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={edu.gpa}
//                           onChange={v => updArr("education", i, "gpa", v)}
//                           placeholder="GPA"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 60 }}
//                         />
//                       </div>
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "awards") {
//               const arr = (localData.awards || []).filter(a => isEdit || hasContent(a.title));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((aw, i) => (
//                     <ItemRow key={i} section="awards" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={aw.title}
//                           onChange={v => updArr("awards", i, "title", v)}
//                           placeholder="Tên giải thưởng"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={aw.year}
//                           onChange={v => updArr("awards", i, "year", v)}
//                           placeholder="Năm"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 50 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={aw.issuer}
//                         onChange={v => updArr("awards", i, "issuer", v)}
//                         placeholder="Tổ chức trao giải"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         value={aw.description}
//                         onChange={v => updArr("awards", i, "description", v)}
//                         placeholder="Mô tả..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: bodyTextColor + "99", marginTop: 2 }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "activities") {
//               const arr = (localData.activities || []).filter(a => isEdit || hasContent(a.role) || hasContent(a.organization));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((act, i) => (
//                     <ItemRow key={i} section="activities" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={act.role}
//                           onChange={v => updArr("activities", i, "role", v)}
//                           placeholder="Vai trò / Dự án"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={act.duration}
//                           onChange={v => updArr("activities", i, "duration", v)}
//                           placeholder="Thời gian"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 110 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={act.organization}
//                         onChange={v => updArr("activities", i, "organization", v)}
//                         placeholder="Tổ chức / CLB"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         multiline={true}
//                         value={act.description}
//                         onChange={v => updArr("activities", i, "description", v)}
//                         placeholder="Mô tả hoạt động..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             return null;
//           })}
//         </div>
//       </div>
//       <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//     </div>
//   );
// }



// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "./../common/ItemControls/ItemControls";
// import EditableField from "./../common/EditField/EditableField";

// const SAMPLE_DATA = {
//   personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Creative Director / UX Designer", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//   summary: "Creative Director với 5 năm kinh nghiệm xây dựng thương hiệu và thiết kế trải nghiệm người dùng. Kết hợp tư duy chiến lược và khả năng sáng tạo để tạo ra các sản phẩm số ấn tượng.",
//   experiences: [
//     { company: "Studio Creative XYZ", position: "Creative Director", duration: "01/2022 – Hiện tại", description: "• Lãnh đạo team 8 designer thực hiện các dự án thương hiệu lớn\n• Phát triển hệ thống nhận diện thương hiệu cho 20+ khách hàng" },
//     { company: "Agency ABC", position: "Senior UI/UX Designer", duration: "03/2019 – 12/2021", description: "• Thiết kế UX/UI cho 15+ ứng dụng mobile và web\n• Tăng 40% tỷ lệ chuyển đổi nhờ tối ưu trải nghiệm người dùng" }
//   ],
//   education: [{ institution: "Đại học Mỹ thuật TP. Hồ Chí Minh", degree: "Cử nhân Thiết kế Đồ họa", year: "2015 – 2019", gpa: "GPA: 3.8/4.0" }],
//   skills: [
//     { category: "Thiết kế", items: "Figma, Adobe XD, Illustrator, Photoshop, After Effects" },
//     { category: "Branding", items: "Brand Strategy, Visual Identity, Typography, Color Theory" },
//     { category: "Digital", items: "HTML/CSS, Motion Design, 3D Modeling" },
//     { category: "Ngoại ngữ", items: "Tiếng Anh (Fluent), Tiếng Pháp (A2)" }
//   ],
//   awards: [
//     { title: "Best Design Agency of the Year", issuer: "Vietnam Creative Awards", year: "2023", description: "Dự án rebranding cho thương hiệu F&B hàng đầu Việt Nam" },
//     { title: "Gold Award – Brand Identity", issuer: "Asia Design Federation", year: "2022", description: "Thiết kế nhận diện thương hiệu cho startup công nghệ" }
//   ],
//   certifications: [
//     { name: "Google UX Design Certificate", issuer: "Google / Coursera", year: "2022", score: "Distinction" },
//     { name: "Adobe Certified Expert", issuer: "Adobe", year: "2021", score: "Pass" }
//   ],
//   activities: [{ organization: "Vietnam Designers Community", role: "Mentor & Speaker", duration: "2020 – nay", description: "• Hướng dẫn 50+ designer junior về career path\n• Diễn giả tại 10+ workshop và hội thảo thiết kế" }]
// };

// const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
// const SAMPLE_SECTION_TITLES = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };

// const hasContent = (v) => {
//   if (!v) return false;
//   if (typeof v === "string") return v.trim() !== "";
//   if (Array.isArray(v)) return v.some(hasContent);
//   if (typeof v === "object") return Object.values(v).some(hasContent);
//   return false;
// };

// // ─── Stable inputs (defined OUTSIDE) ─────────────────────────────────────────
// const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);

//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//   const base = { background: "transparent", border: "none", outline: "none", fontFamily: "inherit", width: "100%", ...style };
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ ...base, resize: "vertical", minHeight: 60, border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", boxSizing: "border-box", lineHeight: 1.5 }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
// });

// const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);

//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//   if (!isEdit) return hasContent(value) ? <div style={style}>{value}</div> : null;
//   const base = { background: "transparent", border: "none", borderBottom: "1px dashed #ddd", outline: "none", fontFamily: "inherit", ...style };
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ width: "100%", border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", fontSize: 12, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5, background: "transparent" }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
// });

// // ─── Section Headers (SỬA ĐỂ NHẬN styleConfig) ─────────────────────────────
// const SHead = memo(({ sectionKey, icon, idx, isEdit, accent, getTitle, updateTitle, moveSection, totalSections, onAdd, styleConfig = {} }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   const titleColor = styleConfig.accentColor || accent;
//   const fontSize = (styleConfig.baseFontSize || 13) + 2;
//   const fontFamily = styleConfig.fontFamily || "inherit";

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, position: "relative", zIndex: 2 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//         <div style={{ width: 24, height: 24, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: titleColor }}>{icon}</div>
//         {isEdit ? (
//           <input ref={inputRef} value={local}
//             onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//             onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//             style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, background: "transparent", border: "none", borderBottom: "1px dashed " + titleColor + "66", outline: "none" }} />
//         ) : (
//           <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>{getTitle(sectionKey)}</div>
//         )}
//       </div>
//       {isEdit && (
//         <div style={{ display: "flex", gap: 3 }}>
//           {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>+ Thêm</button>}
//           {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
//             const dis = dir === -1 ? idx === 0 : idx === totalSections - 1;
//             return (
//               <button key={lbl} onClick={() => moveSection(idx, dir)} disabled={dis}
//                 style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${titleColor}33`, borderRadius: 3, color: titleColor, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// });

// const SideHead = memo(({ sectionKey, icon, isEdit, accent, getTitle, updateTitle, onAdd, styleConfig = {} }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   const titleColor = styleConfig.accentColor || accent;
//   const fontSize = (styleConfig.baseFontSize || 13) + 1;
//   const fontFamily = styleConfig.fontFamily || "inherit";

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <div style={{ width: 20, height: 20, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: titleColor }}>{icon}</div>
//         {isEdit ? (
//           <input ref={inputRef} value={local}
//             onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//             onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//             style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, background: "transparent", border: "none", borderBottom: "1px dashed " + titleColor + "55", outline: "none" }} />
//         ) : (
//           <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>{getTitle(sectionKey)}</div>
//         )}
//       </div>
//       {isEdit && onAdd && <button onClick={onAdd} style={{ fontSize: 10, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 6, padding: "1px 6px", cursor: "pointer" }}>+</button>}
//     </div>
//   );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, rowStyle = {}, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", padding: "8px 12px", borderLeft: `3px solid ${accent}`, background: accent + "04", borderRadius: "0 6px 6px 0", marginBottom: 10, paddingRight: isEdit ? 100 : 12, ...rowStyle }}>
//     {isEdit && <div style={{ position: "absolute", top: 4, right: 4, zIndex: 1 }}>
//       <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)} isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//     </div>}
//     {children}
//   </div>
// ));

// const SidebarItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", marginBottom: 8, paddingBottom: 8, borderBottom: "1px dashed #eee", paddingRight: isEdit ? 60 : 0 }}>
//     {isEdit && <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2 }}>
//       <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
//       <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === total - 1 ? 0.3 : 1 }}>↓</button>
//       <button onClick={() => delItem(section, idx)} style={{ width: 16, height: 16, border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 2, fontSize: 8, cursor: "pointer" }}>×</button>
//     </div>}
//     {children}
//   </div>
// ));

// // ─── Avatar Editor (defined OUTSIDE) ─────────────────────────────────────────
// const AvatarEditor = memo(({ avatarUrl, isEdit, onAvatarChange, accent }) => {
//   const fileInputRef = useRef(null);
//   const handleFileChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onAvatarChange(ev.target.result);
//     reader.readAsDataURL(file);
//   }, [onAvatarChange]);

//   return (
//     <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
//       <div style={{ width: 70, height: 70, borderRadius: "50%", background: avatarUrl ? "transparent" : "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
//         {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "✦"}
//       </div>
//       {isEdit && (
//         <>
//           <button onClick={() => fileInputRef.current?.click()} style={{
//             position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%",
//             background: "white", border: "none", cursor: "pointer", fontSize: 11,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
//           }} title="Đổi ảnh">📷</button>
//           <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
//         </>
//       )}
//     </div>
//   );
// });

// function getContrastColor(hexColor) {
//   const hex = hexColor.replace('#', '');
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
//   return yiq >= 128 ? '#1a1a1a' : '#ffffff';
// }

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function CreativeCV({
//   data, onChange, isEdit,
//   accent = "#5B2D8E",
//   styleConfig = {},
//   sectionOrder = ["summary", "experiences", "education", "awards", "activities"],
//   setSectionOrder,
//   sectionTitles = {},
//   setSectionTitles,
//   useSampleData = false,
// }) {
//   const shouldUseSample = useMemo(() => {
//     if (useSampleData) return true;
//     if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
//     return false;
//   }, [useSampleData, isEdit, data]);

//   const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
//   const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
//   const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
//   const isUserEditing = useRef(false);

//   const contrastColor = getContrastColor(styleConfig.accentColor || accent);
//   const headerTextColor = contrastColor;
//   const bodyTextColor = styleConfig.textColor || "#333333";
//   const bodyBgColor = styleConfig.backgroundColor || "#ffffff";

//   useEffect(() => {
//     if (isUserEditing.current) return;
//     if (shouldUseSample) return;
//     setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
//   }, [data, sectionOrder, sectionTitles, shouldUseSample]);

//   const pi = localData.personalInfo || {};

//   const upd = useCallback((section, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => ({ ...d, [section]: val }));
//     onChange(section, val);
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const updPi = useCallback((key, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => { const np = { ...(d.personalInfo || {}), [key]: val }; onChange("personalInfo", np); return { ...d, personalInfo: np }; });
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const updArr = useCallback((section, idx, key, val) => {
//     isUserEditing.current = true;
//     setLocalData(d => { const arr = [...(d[section] || [])]; arr[idx] = { ...arr[idx], [key]: val }; onChange(section, arr); return { ...d, [section]: arr }; });
//     setTimeout(() => { isUserEditing.current = false; }, 0);
//   }, [onChange]);

//   const addItem = useCallback((section, empty) => {
//     setLocalData(d => { const arr = [...(d[section] || []), { ...empty }]; onChange(section, arr); return { ...d, [section]: arr }; });
//   }, [onChange]);

//   const delItem = useCallback((section, idx) => {
//     setLocalData(d => { const arr = (d[section] || []).filter((_, i) => i !== idx); onChange(section, arr); return { ...d, [section]: arr }; });
//   }, [onChange]);

//   const moveItem = useCallback((section, idx, dir) => {
//     setLocalData(d => {
//       const arr = [...(d[section] || [])]; const ni = idx + dir;
//       if (ni < 0 || ni >= arr.length) return d;
//       [arr[idx], arr[ni]] = [arr[ni], arr[idx]]; onChange(section, arr); return { ...d, [section]: arr };
//     });
//   }, [onChange]);

//   const moveSection = useCallback((idx, dir) => {
//     const ni = idx + dir; if (ni < 0 || ni >= localOrder.length) return;
//     const arr = [...localOrder];[arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//     setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//   }, [localOrder, setSectionOrder]);

//   const updateTitle = useCallback((key, title) => {
//     const nt = { ...localTitles, [key]: title };
//     setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//   }, [localTitles, setSectionTitles]);

//   const DEFAULTS = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };
//   const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//   const handleAvatarChange = useCallback((url) => updPi("avatar", url), [updPi]);

//   const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
//   const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));
//   const sectionIconMap = { summary: "◑", experiences: "⧖", education: "◻", awards: "★", activities: "◉", skills: "◈", certifications: "◎" };

//   return (
//     <div id="cv-paper" className="cv-paper" style={{
//       width: "100%",
//       maxWidth: "800px",
//       minHeight: "1123px",
//       background: bodyBgColor,
//       fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif",
//       fontSize: styleConfig.baseFontSize || 14,
//       lineHeight: styleConfig.lineHeight || 1.6,
//       color: bodyTextColor,
//     }}>
//       {/* Header */}
//       <div style={{
//         background: `linear-gradient(120deg, ${styleConfig.accentColor || accent}, ${(styleConfig.accentColor || accent)}cc)`,
//         padding: "32px 40px",
//         position: "relative",
//         overflow: "hidden",
//         color: headerTextColor
//       }}>
//         <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
//         <div style={{ position: "absolute", right: 60, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
//         <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
//           <AvatarEditor avatarUrl={pi.avatar} isEdit={isEdit} onAvatarChange={handleAvatarChange} accent={styleConfig.accentColor || accent} />
//           <div style={{ flex: 1 }}>
//             <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//               style={{ fontSize: 28, fontWeight: "bold", color: headerTextColor, marginBottom: 4, borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.4)" : "none" }} />
//             <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh sáng tạo"
//               style={{ fontSize: 14, color: headerTextColor + "cc", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.3)" : "none", width: "70%" }} />
//           </div>
//         </div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 16, position: "relative" }}>
//           {[["email", "✉ ", "Email"], ["phone", "☎ ", "Điện thoại"], ["linkedin", "⊕ ", "LinkedIn"], ["address", "◎ ", "Địa chỉ"]].map(([key, icon, ph]) => (
//             <div key={key} style={{ display: "flex", width: "fit-content", alignItems: "center", gap: 3, fontSize: 11, color: headerTextColor + "cc", background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 12 }}>
//               <span>{icon}</span>
//               {isEdit
//                 ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 11, color: headerTextColor + "cc", width: 120, borderBottom: "none" }} />
//                 : <span>{pi[key] || ph}</span>}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ display: "flex" }}>
//         {/* Left sidebar */}
//         <div style={{
//           width: "40%",
//           padding: "20px 16px 20px 24px",
//           background: bodyBgColor === "#ffffff" ? "#FAFAFA" : bodyBgColor + "f5",
//           borderRight: `1px solid ${bodyTextColor}15`,
//           flexShrink: 0,
//           color: bodyTextColor,
//         }}>
//           {(isEdit || hasContent(localData.summary)) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="summary"
//                 icon="◑"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               <EditableField
//                 richText={true}
//                 multiline={true}
//                 value={localData.summary || ""}
//                 onChange={v => upd("summary", v)}
//                 placeholder="Mô tả sáng tạo về bản thân..."
//                 isEdit={isEdit}
//                 styleConfig={styleConfig}
//                 style={{ fontSize: 12, color: bodyTextColor }}
//               />
//             </div>
//           )}

//           {(isEdit || filteredSkills.length > 0) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="skills"
//                 icon="◈"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 onAdd={() => addItem("skills", { category: "", items: "" })}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               {filteredSkills.map((sk, idx) => (
//                 <SidebarItemRow key={idx} section="skills" idx={idx} total={filteredSkills.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                   <EditableField
//                     richText={false}
//                     value={sk.category}
//                     onChange={v => updArr("skills", idx, "category", v)}
//                     placeholder="Nhóm kỹ năng"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 11, fontWeight: "bold", color: styleConfig.accentColor || accent, marginBottom: 3 }}
//                   />
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: isEdit ? 4 : 0 }}>
//                     {(sk.items || "").split(",").filter(Boolean).map((item, i) => (
//                       <span key={i} style={{ fontSize: 10, background: (styleConfig.accentColor || accent) + "12", color: styleConfig.accentColor || accent, padding: "2px 6px", borderRadius: 8 }}>{item.trim()}</span>
//                     ))}
//                   </div>
//                   {isEdit && (
//                     <EditableField
//                       richText={false}
//                       multiline={true}
//                       value={sk.items || ""}
//                       onChange={v => updArr("skills", idx, "items", v)}
//                       placeholder="skill1, skill2, ..."
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: bodyTextColor + "99" }}
//                     />
//                   )}
//                 </SidebarItemRow>
//               ))}
//             </div>
//           )}

//           {(isEdit || filteredCerts.length > 0) && (
//             <div style={{ marginBottom: 20 }}>
//               <SideHead
//                 sectionKey="certifications"
//                 icon="◎"
//                 isEdit={isEdit}
//                 accent={accent}
//                 getTitle={getTitle}
//                 updateTitle={updateTitle}
//                 onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })}
//                 styleConfig={styleConfig}  // ← THÊM
//               />
//               {filteredCerts.map((cert, idx) => (
//                 <SidebarItemRow key={idx} section="certifications" idx={idx} total={filteredCerts.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                   <EditableField
//                     richText={false}
//                     value={cert.name}
//                     onChange={v => updArr("certifications", idx, "name", v)}
//                     placeholder="Tên chứng chỉ"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 11, fontWeight: "bold", color: bodyTextColor }}
//                   />
//                   <EditableField
//                     richText={false}
//                     value={cert.issuer}
//                     onChange={v => updArr("certifications", idx, "issuer", v)}
//                     placeholder="Tổ chức"
//                     isEdit={isEdit}
//                     styleConfig={styleConfig}
//                     style={{ fontSize: 10, color: bodyTextColor + "99", display: "block" }}
//                   />
//                   {(isEdit || hasContent(cert.year)) && (
//                     <EditableField
//                       richText={false}
//                       value={cert.year}
//                       onChange={v => updArr("certifications", idx, "year", v)}
//                       placeholder="Năm"
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: bodyTextColor + "88" }}
//                     />
//                   )}
//                   {(isEdit || hasContent(cert.score)) && (
//                     <EditableField
//                       richText={false}
//                       value={cert.score}
//                       onChange={v => updArr("certifications", idx, "score", v)}
//                       placeholder="Score"
//                       isEdit={isEdit}
//                       styleConfig={styleConfig}
//                       style={{ fontSize: 10, color: styleConfig.accentColor || accent, fontWeight: 600 }}
//                     />
//                   )}
//                 </SidebarItemRow>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Main content */}
//         <div style={{ flex: 1, padding: "20px 28px 20px 20px", color: bodyTextColor }}>
//           {localOrder.map((key, idx) => {
//             if (key === "summary") return null;

//             if (key === "experiences") {
//               const arr = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((exp, i) => (
//                     <ItemRow key={i} section="experiences" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 6 }}>
//                         <EditableField
//                           richText={false}
//                           value={exp.position}
//                           onChange={v => updArr("experiences", i, "position", v)}
//                           placeholder="Vị trí công việc"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={exp.duration}
//                           onChange={v => updArr("experiences", i, "duration", v)}
//                           placeholder="Thời gian"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 120 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={exp.company}
//                         onChange={v => updArr("experiences", i, "company", v)}
//                         placeholder="Công ty"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         multiline={true}
//                         value={exp.description}
//                         onChange={v => updArr("experiences", i, "description", v)}
//                         placeholder="Mô tả công việc..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "education") {
//               const arr = (localData.education || []).filter(e => isEdit || hasContent(e.degree) || hasContent(e.institution));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((edu, i) => (
//                     <ItemRow key={i} section="education" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem} rowStyle={{ borderLeftColor: (styleConfig.accentColor || accent) + "55", background: "#fafafa" }}>
//                       <EditableField
//                         richText={false}
//                         value={edu.degree}
//                         onChange={v => updArr("education", i, "degree", v)}
//                         placeholder="Bằng cấp / Chuyên ngành"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor }}
//                       />
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={edu.institution}
//                           onChange={v => updArr("education", i, "institution", v)}
//                           placeholder="Tên trường"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 12, color: bodyTextColor + "99", flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={edu.year}
//                           onChange={v => updArr("education", i, "year", v)}
//                           placeholder="Năm"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 70 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={edu.gpa}
//                           onChange={v => updArr("education", i, "gpa", v)}
//                           placeholder="GPA"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 60 }}
//                         />
//                       </div>
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "awards") {
//               const arr = (localData.awards || []).filter(a => isEdit || hasContent(a.title));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((aw, i) => (
//                     <ItemRow key={i} section="awards" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={aw.title}
//                           onChange={v => updArr("awards", i, "title", v)}
//                           placeholder="Tên giải thưởng"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={aw.year}
//                           onChange={v => updArr("awards", i, "year", v)}
//                           placeholder="Năm"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 50 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={aw.issuer}
//                         onChange={v => updArr("awards", i, "issuer", v)}
//                         placeholder="Tổ chức trao giải"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         value={aw.description}
//                         onChange={v => updArr("awards", i, "description", v)}
//                         placeholder="Mô tả..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: bodyTextColor + "99", marginTop: 2 }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             if (key === "activities") {
//               const arr = (localData.activities || []).filter(a => isEdit || hasContent(a.role) || hasContent(a.organization));
//               if (!isEdit && arr.length === 0) return null;
//               return (
//                 <div key={key} style={{ marginBottom: 20 }}>
//                   <SHead
//                     sectionKey={key}
//                     icon={sectionIconMap[key]}
//                     idx={idx}
//                     isEdit={isEdit}
//                     accent={accent}
//                     getTitle={getTitle}
//                     updateTitle={updateTitle}
//                     moveSection={moveSection}
//                     totalSections={localOrder.length}
//                     onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })}
//                     styleConfig={styleConfig}  // ← THÊM
//                   />
//                   {arr.map((act, i) => (
//                     <ItemRow key={i} section="activities" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <EditableField
//                           richText={false}
//                           value={act.role}
//                           onChange={v => updArr("activities", i, "role", v)}
//                           placeholder="Vai trò / Dự án"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
//                         />
//                         <EditableField
//                           richText={false}
//                           value={act.duration}
//                           onChange={v => updArr("activities", i, "duration", v)}
//                           placeholder="Thời gian"
//                           isEdit={isEdit}
//                           styleConfig={styleConfig}
//                           style={{ fontSize: 11, color: bodyTextColor + "88", width: 110 }}
//                         />
//                       </div>
//                       <EditableField
//                         richText={false}
//                         value={act.organization}
//                         onChange={v => updArr("activities", i, "organization", v)}
//                         placeholder="Tổ chức / CLB"
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
//                       />
//                       <EditableField
//                         richText={true}
//                         multiline={true}
//                         value={act.description}
//                         onChange={v => updArr("activities", i, "description", v)}
//                         placeholder="Mô tả hoạt động..."
//                         isEdit={isEdit}
//                         styleConfig={styleConfig}
//                         style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
//                       />
//                     </ItemRow>
//                   ))}
//                 </div>
//               );
//             }

//             return null;
//           })}
//         </div>
//       </div>
//       <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//     </div>
//   );
// }



import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "./../common/ItemControls/ItemControls";
import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";
import RichTextField from "../common/EditField/RichTextField";

const SAMPLE_DATA = {
  personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Creative Director / UX Designer", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
  summary: "Creative Director với 5 năm kinh nghiệm xây dựng thương hiệu và thiết kế trải nghiệm người dùng. Kết hợp tư duy chiến lược và khả năng sáng tạo để tạo ra các sản phẩm số ấn tượng.",
  experiences: [
    { company: "Studio Creative XYZ", position: "Creative Director", duration: "01/2022 – Hiện tại", description: "• Lãnh đạo team 8 designer thực hiện các dự án thương hiệu lớn\n• Phát triển hệ thống nhận diện thương hiệu cho 20+ khách hàng" },
    { company: "Agency ABC", position: "Senior UI/UX Designer", duration: "03/2019 – 12/2021", description: "• Thiết kế UX/UI cho 15+ ứng dụng mobile và web\n• Tăng 40% tỷ lệ chuyển đổi nhờ tối ưu trải nghiệm người dùng" }
  ],
  education: [{ institution: "Đại học Mỹ thuật TP. Hồ Chí Minh", degree: "Cử nhân Thiết kế Đồ họa", year: "2015 – 2019", gpa: "GPA: 3.8/4.0" }],
  skills: [
    { category: "Thiết kế", items: "Figma, Adobe XD, Illustrator, Photoshop, After Effects" },
    { category: "Branding", items: "Brand Strategy, Visual Identity, Typography, Color Theory" },
    { category: "Digital", items: "HTML/CSS, Motion Design, 3D Modeling" },
    { category: "Ngoại ngữ", items: "Tiếng Anh (Fluent), Tiếng Pháp (A2)" }
  ],
  awards: [
    { title: "Best Design Agency of the Year", issuer: "Vietnam Creative Awards", year: "2023", description: "Dự án rebranding cho thương hiệu F&B hàng đầu Việt Nam" },
    { title: "Gold Award – Brand Identity", issuer: "Asia Design Federation", year: "2022", description: "Thiết kế nhận diện thương hiệu cho startup công nghệ" }
  ],
  certifications: [
    { name: "Google UX Design Certificate", issuer: "Google / Coursera", year: "2022", score: "Distinction" },
    { name: "Adobe Certified Expert", issuer: "Adobe", year: "2021", score: "Pass" }
  ],
  activities: [{ organization: "Vietnam Designers Community", role: "Mentor & Speaker", duration: "2020 – nay", description: "• Hướng dẫn 50+ designer junior về career path\n• Diễn giả tại 10+ workshop và hội thảo thiết kế" }]
};

const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
const SAMPLE_SECTION_TITLES = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };

const hasContent = (v) => {
  if (!v) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.some(hasContent);
  if (typeof v === "object") return Object.values(v).some(hasContent);
  return false;
};

const isHTML = (str) => typeof str === 'string' && /<[a-z][\s\S]*>/i.test(str);

// ─── InlineEdit: contenteditable với toolbar support ─────────────────────────
const InlineEdit = memo(({ value = "", onChange, placeholder, style, styleConfig = {}, onStyleChange, multiline = false }) => {
  const ref = useRef(null);
  const [html, setHtml] = useState(value);
  const savedSelRef = useRef(null);

  useEffect(() => {
    if (document.activeElement !== ref.current && value !== html) {
      setHtml(value);
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const newHtml = ref.current.innerHTML;
    setHtml(newHtml);
    onChange(newHtml);
  }, [onChange]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      savedSelRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement;
      const inToolbar = active?.closest(".selection-toolbar");
      const inEditor = active === ref.current || ref.current?.contains(active);
      if (!inToolbar && !inEditor) {
        clearActiveField();
        savedSelRef.current = null;
      }
    }, 200);
  }, []);

  const handleMouseUp = useCallback(() => {
    saveSelection();
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig, saveSelection]);

  const handleKeyUp = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  const sc = styleConfig || {};
  return (
    <div
      ref={ref}
      data-rich-editor="true"
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        outline: "none",
        minHeight: multiline ? 60 : 20,
        fontFamily: sc.fontFamily || "inherit",
        fontSize: sc.baseFontSize || "inherit",
        lineHeight: sc.lineHeight || "inherit",
        fontWeight: sc.fontWeight || "normal",
        fontStyle: sc.fontStyle || "normal",
        textDecoration: sc.textDecoration || "none",
        color: sc.textColor || "inherit",
        whiteSpace: multiline ? "pre-wrap" : "normal",
        ...style,
      }}
    />
  );
});

// ─── HeaderEdit: InlineEdit cho header info ─────────────────────────────────
const HeaderEdit = memo(({ value = "", onChange, placeholder, style, styleConfig = {}, onStyleChange }) => {
  const ref = useRef(null);
  const [html, setHtml] = useState(value);
  const savedSelRef = useRef(null);

  useEffect(() => {
    if (document.activeElement !== ref.current && value !== html) {
      setHtml(value);
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const newHtml = ref.current.innerHTML;
    setHtml(newHtml);
    onChange(newHtml);
  }, [onChange]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      savedSelRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement;
      const inToolbar = active?.closest(".selection-toolbar");
      const inEditor = active === ref.current || ref.current?.contains(active);
      if (!inToolbar && !inEditor) {
        clearActiveField();
        savedSelRef.current = null;
      }
    }, 200);
  }, []);

  const handleMouseUp = useCallback(() => {
    saveSelection();
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig, saveSelection]);

  const handleKeyUp = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  const sc = styleConfig || {};
  return (
    <div
      ref={ref}
      data-rich-editor="true"
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        outline: "none",
        minHeight: 20,
        fontFamily: sc.fontFamily || "inherit",
        fontSize: sc.baseFontSize || "inherit",
        fontWeight: sc.fontWeight || "normal",
        fontStyle: sc.fontStyle || "normal",
        textDecoration: sc.textDecoration || "none",
        color: sc.textColor || "inherit",
        ...style,
      }}
    />
  );
});

// ─── EF: Editable Field ──────────────────────────────────────────────────────
const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit, richText = false, styleConfig = {}, onStyleChange }) => {
  if (!isEdit) {
    if (isHTML(value)) {
      return <div dangerouslySetInnerHTML={{ __html: value }} style={{ whiteSpace: "pre-wrap", ...style }} />;
    }
    if (!value) return null;
    return multiline ? <div style={{ whiteSpace: "pre-line", ...style }}>{value}</div> : <span style={style}>{value}</span>;
  }
  if (richText) {
    return <RichTextField value={value} onChange={onChange} placeholder={placeholder} multiline={multiline} style={style} isEdit={isEdit} />;
  }
  return <InlineEdit value={value} onChange={onChange} placeholder={placeholder} style={style} multiline={multiline} styleConfig={styleConfig} onStyleChange={onStyleChange} />;
});

// ─── TitleEdit: contenteditable cho section titles ───────────────────────────
const TitleEdit = memo(({ value, onChange, style, textColor, styleConfig = {}, onStyleChange }) => {
  const ref = useRef(null);
  const [html, setHtml] = useState(value);
  const savedSelRef = useRef(null);

  useEffect(() => {
    if (document.activeElement !== ref.current && value !== html) {
      setHtml(value);
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const newHtml = ref.current.innerHTML;
    setHtml(newHtml);
    onChange(newHtml);
  }, [onChange]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      savedSelRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement;
      const inToolbar = active?.closest(".selection-toolbar");
      const inEditor = active === ref.current || ref.current?.contains(active);
      if (!inToolbar && !inEditor) {
        clearActiveField();
        savedSelRef.current = null;
      }
    }, 200);
  }, []);

  const handleMouseUp = useCallback(() => {
    saveSelection();
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig, saveSelection]);

  const handleKeyUp = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  return (
    <div
      ref={ref}
      data-rich-editor="true"
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
      onKeyUp={handleKeyUp}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        outline: "none",
        fontFamily: styleConfig?.fontFamily || "inherit",
        color: textColor,
        flex: 1,
        width: "100%",
        ...style
      }}
    />
  );
});

// ─── Section Header (Main) ───────────────────────────────────────────────────
const SHead = memo(({ sectionKey, icon, idx, isEdit, accent, getTitle, updateTitle, moveSection, totalSections, onAdd, styleConfig = {}, onStyleChange }) => {
  const titleColor = styleConfig.accentColor || accent;
  const fontSize = (styleConfig.baseFontSize || 13) + 2;
  const fontFamily = styleConfig.fontFamily || "inherit";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, position: "relative", zIndex: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: titleColor }}>{icon}</div>
        {isEdit ? (
          <TitleEdit
            value={getTitle(sectionKey)}
            onChange={v => updateTitle(sectionKey, v)}
            style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, borderBottom: "1px dashed " + titleColor + "66" }}
            textColor={titleColor}
            styleConfig={styleConfig}
            onStyleChange={onStyleChange}
          />
        ) : (
          <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>
            {isHTML(getTitle(sectionKey)) ? <span dangerouslySetInnerHTML={{ __html: getTitle(sectionKey) }} /> : getTitle(sectionKey)}
          </div>
        )}
      </div>
      {isEdit && (
        <div style={{ display: "flex", gap: 3 }}>
          {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>+ Thêm</button>}
          {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
            const dis = dir === -1 ? idx === 0 : idx === totalSections - 1;
            return (
              <button key={lbl} onClick={() => moveSection(idx, dir)} disabled={dis}
                style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${titleColor}33`, borderRadius: 3, color: titleColor, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            );
          })}
        </div>
      )}
    </div>
  );
});

// ─── Section Header (Sidebar) ──────────────────────────────────────────────────
const SideHead = memo(({ sectionKey, icon, isEdit, accent, getTitle, updateTitle, onAdd, styleConfig = {}, onStyleChange }) => {
  const titleColor = styleConfig.accentColor || accent;
  const fontSize = (styleConfig.baseFontSize || 13) + 1;
  const fontFamily = styleConfig.fontFamily || "inherit";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: titleColor + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: titleColor }}>{icon}</div>
        {isEdit ? (
          <TitleEdit
            value={getTitle(sectionKey)}
            onChange={v => updateTitle(sectionKey, v)}
            style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily, borderBottom: "1px dashed " + titleColor + "55" }}
            textColor={titleColor}
            styleConfig={styleConfig}
            onStyleChange={onStyleChange}
          />
        ) : (
          <div style={{ fontSize, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: titleColor, fontFamily }}>
            {isHTML(getTitle(sectionKey)) ? <span dangerouslySetInnerHTML={{ __html: getTitle(sectionKey) }} /> : getTitle(sectionKey)}
          </div>
        )}
      </div>
      {isEdit && onAdd && <button onClick={onAdd} style={{ fontSize: 10, color: titleColor, background: titleColor + "10", border: `1px solid ${titleColor}33`, borderRadius: 6, padding: "1px 6px", cursor: "pointer" }}>+</button>}
    </div>
  );
});

// ─── ItemRow (Main) ────────────────────────────────────────────────────────
const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, rowStyle = {}, children }) => (
  <div className="item-wrapper" style={{ position: "relative", padding: "8px 12px", borderLeft: `3px solid ${accent}`, background: accent + "04", borderRadius: "0 6px 6px 0", marginBottom: 10, paddingRight: isEdit ? 100 : 12, ...rowStyle }}>
    {isEdit && <div style={{ position: "absolute", top: 4, right: 4, zIndex: 1 }}>
      <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)} isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
    </div>}
    {children}
  </div>
));

// ─── SidebarItemRow ─────────────────────────────────────────────────────────
const SidebarItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
  <div className="item-wrapper" style={{ position: "relative", marginBottom: 8, paddingBottom: 8, borderBottom: "1px dashed #eee", paddingRight: isEdit ? 60 : 0 }}>
    {isEdit && <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2 }}>
      <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
      <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === total - 1 ? 0.3 : 1 }}>↓</button>
      <button onClick={() => delItem(section, idx)} style={{ width: 16, height: 16, border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 2, fontSize: 8, cursor: "pointer" }}>×</button>
    </div>}
    {children}
  </div>
));

// ─── Avatar Editor ──────────────────────────────────────────────────────────
const AvatarEditor = memo(({ avatarUrl, isEdit, onAvatarChange, accent }) => {
  const fileInputRef = useRef(null);
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAvatarChange(ev.target.result);
    reader.readAsDataURL(file);
  }, [onAvatarChange]);

  return (
    <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: avatarUrl ? "transparent" : "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
        {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "✦"}
      </div>
      {isEdit && (
        <>
          <button onClick={() => fileInputRef.current?.click()} style={{
            position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%",
            background: "white", border: "none", cursor: "pointer", fontSize: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }} title="Đổi ảnh">📷</button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        </>
      )}
    </div>
  );
});

function getContrastColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#1a1a1a' : '#ffffff';
}

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function CreativeCV({
  data, onChange, isEdit,
  accent = "#5B2D8E",
  styleConfig = {},
  onStyleChange,
  sectionOrder = ["summary", "experiences", "education", "awards", "activities"],
  setSectionOrder,
  sectionTitles = {},
  setSectionTitles,
  useSampleData = false,
}) {
  const shouldUseSample = useMemo(() => {
    if (useSampleData) return true;
    if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
    return false;
  }, [useSampleData, isEdit, data]);

  const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
  const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
  const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
  const isUserEditing = useRef(false);

  const contrastColor = getContrastColor(styleConfig.accentColor || accent);
  const headerTextColor = contrastColor;
  const bodyTextColor = styleConfig.textColor || "#333333";
  const bodyBgColor = styleConfig.backgroundColor || "#ffffff";

  useEffect(() => {
    if (isUserEditing.current) return;
    if (shouldUseSample) return;
    setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
  }, [data, sectionOrder, sectionTitles, shouldUseSample]);

  const pi = localData.personalInfo || {};

  const upd = useCallback((section, val) => {
    isUserEditing.current = true;
    setLocalData(d => ({ ...d, [section]: val }));
    onChange(section, val);
    setTimeout(() => { isUserEditing.current = false; }, 0);
  }, [onChange]);

  const updPi = useCallback((key, val) => {
    isUserEditing.current = true;
    setLocalData(d => { const np = { ...(d.personalInfo || {}), [key]: val }; onChange("personalInfo", np); return { ...d, personalInfo: np }; });
    setTimeout(() => { isUserEditing.current = false; }, 0);
  }, [onChange]);

  const updArr = useCallback((section, idx, key, val) => {
    isUserEditing.current = true;
    setLocalData(d => { const arr = [...(d[section] || [])]; arr[idx] = { ...arr[idx], [key]: val }; onChange(section, arr); return { ...d, [section]: arr }; });
    setTimeout(() => { isUserEditing.current = false; }, 0);
  }, [onChange]);

  const addItem = useCallback((section, empty) => {
    setLocalData(d => { const arr = [...(d[section] || []), { ...empty }]; onChange(section, arr); return { ...d, [section]: arr }; });
  }, [onChange]);

  const delItem = useCallback((section, idx) => {
    setLocalData(d => { const arr = (d[section] || []).filter((_, i) => i !== idx); onChange(section, arr); return { ...d, [section]: arr }; });
  }, [onChange]);

  const moveItem = useCallback((section, idx, dir) => {
    setLocalData(d => {
      const arr = [...(d[section] || [])]; const ni = idx + dir;
      if (ni < 0 || ni >= arr.length) return d;
      [arr[idx], arr[ni]] = [arr[ni], arr[idx]]; onChange(section, arr); return { ...d, [section]: arr };
    });
  }, [onChange]);

  const moveSection = useCallback((idx, dir) => {
    const ni = idx + dir; if (ni < 0 || ni >= localOrder.length) return;
    const arr = [...localOrder];[arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
  }, [localOrder, setSectionOrder]);

  const updateTitle = useCallback((key, title) => {
    const nt = { ...localTitles, [key]: title };
    setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
  }, [localTitles, setSectionTitles]);

  const DEFAULTS = { summary: "Về tôi", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ" };
  const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

  const handleAvatarChange = useCallback((url) => updPi("avatar", url), [updPi]);

  const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
  const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));
  const sectionIconMap = { summary: "◑", experiences: "⧖", education: "◻", awards: "★", activities: "◉", skills: "◈", certifications: "◎" };

  return (
    <div id="cv-paper" className="cv-paper" style={{
      width: "100%",
      maxWidth: "800px",
      minHeight: "1123px",
      background: bodyBgColor,
      fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif",
      fontSize: styleConfig.baseFontSize || 14,
      lineHeight: styleConfig.lineHeight || 1.6,
      color: bodyTextColor,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(120deg, ${styleConfig.accentColor || accent}, ${(styleConfig.accentColor || accent)}cc)`,
        padding: "32px 40px",
        position: "relative",
        overflow: "hidden",
        color: headerTextColor
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          <AvatarEditor avatarUrl={pi.avatar} isEdit={isEdit} onAvatarChange={handleAvatarChange} accent={styleConfig.accentColor || accent} />
          <div style={{ flex: 1 }}>
            <HeaderEdit
              value={pi.fullName || ""}
              onChange={v => updPi("fullName", v)}
              placeholder="Họ và tên"
              styleConfig={styleConfig}
              onStyleChange={onStyleChange}
              style={{ fontSize: 28, fontWeight: "bold", color: headerTextColor, marginBottom: 4 }}
            />
            <HeaderEdit
              value={pi.portfolio || ""}
              onChange={v => updPi("portfolio", v)}
              placeholder="Chức danh sáng tạo"
              styleConfig={styleConfig}
              onStyleChange={onStyleChange}
              style={{ fontSize: 14, color: headerTextColor + "cc", width: "70%" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 16, position: "relative" }}>
          {[["email", "✉ ", "Email"], ["phone", "☎ ", "Điện thoại"], ["linkedin", "⊕ ", "LinkedIn"], ["address", "◎ ", "Địa chỉ"]].map(([key, icon, ph]) => (
            <div key={key} style={{ display: "flex", width: "fit-content", alignItems: "center", gap: 3, fontSize: 11, color: headerTextColor + "cc", background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 12 }}>
              <span>{icon}</span>
              {isEdit ? (
                <HeaderEdit
                  value={pi[key] || ""}
                  onChange={v => updPi(key, v)}
                  placeholder={ph}
                  styleConfig={styleConfig}
                  onStyleChange={onStyleChange}
                  style={{ fontSize: 11, color: headerTextColor + "cc", width: 120 }}
                />
              ) : (
                <span>{pi[key] || ph}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Left sidebar */}
        <div style={{
          width: "40%",
          padding: "20px 16px 20px 24px",
          background: bodyBgColor === "#ffffff" ? "#FAFAFA" : bodyBgColor + "f5",
          borderRight: `1px solid ${bodyTextColor}15`,
          flexShrink: 0,
          color: bodyTextColor,
        }}>
          {(isEdit || hasContent(localData.summary)) && (
            <div style={{ marginBottom: 20 }}>
              <SideHead
                sectionKey="summary"
                icon="◑"
                isEdit={isEdit}
                accent={accent}
                getTitle={getTitle}
                updateTitle={updateTitle}
                styleConfig={styleConfig}
                onStyleChange={onStyleChange}
              />
              <EF
                richText={false}
                multiline={true}
                value={localData.summary || ""}
                onChange={v => upd("summary", v)}
                placeholder="Mô tả sáng tạo về bản thân..."
                isEdit={isEdit}
                styleConfig={styleConfig}
                onStyleChange={onStyleChange}
                style={{ fontSize: 12, color: bodyTextColor }}
              />
            </div>
          )}

          {(isEdit || filteredSkills.length > 0) && (
            <div style={{ marginBottom: 20 }}>
              <SideHead
                sectionKey="skills"
                icon="◈"
                isEdit={isEdit}
                accent={accent}
                getTitle={getTitle}
                updateTitle={updateTitle}
                onAdd={() => addItem("skills", { category: "", items: "" })}
                styleConfig={styleConfig}
                onStyleChange={onStyleChange}
              />
              {filteredSkills.map((sk, idx) => (
                <SidebarItemRow key={idx} section="skills" idx={idx} total={filteredSkills.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
                  <EF
                    richText={false}
                    value={sk.category}
                    onChange={v => updArr("skills", idx, "category", v)}
                    placeholder="Nhóm kỹ năng"
                    isEdit={isEdit}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                    style={{ fontSize: 11, fontWeight: "bold", color: styleConfig.accentColor || accent, marginBottom: 3 }}
                  />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: isEdit ? 4 : 0 }}>
                    {(sk.items || "").split(",").filter(Boolean).map((item, i) => (
                      <span key={i} style={{ fontSize: 10, background: (styleConfig.accentColor || accent) + "12", color: styleConfig.accentColor || accent, padding: "2px 6px", borderRadius: 8 }}>{item.trim()}</span>
                    ))}
                  </div>
                  {isEdit && (
                    <EF
                      richText={false}
                      multiline={true}
                      value={sk.items || ""}
                      onChange={v => updArr("skills", idx, "items", v)}
                      placeholder="skill1, skill2, ..."
                      isEdit={isEdit}
                      styleConfig={styleConfig}
                      onStyleChange={onStyleChange}
                      style={{ fontSize: 10, color: bodyTextColor + "99" }}
                    />
                  )}
                </SidebarItemRow>
              ))}
            </div>
          )}

          {(isEdit || filteredCerts.length > 0) && (
            <div style={{ marginBottom: 20 }}>
              <SideHead
                sectionKey="certifications"
                icon="◎"
                isEdit={isEdit}
                accent={accent}
                getTitle={getTitle}
                updateTitle={updateTitle}
                onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })}
                styleConfig={styleConfig}
                onStyleChange={onStyleChange}
              />
              {filteredCerts.map((cert, idx) => (
                <SidebarItemRow key={idx} section="certifications" idx={idx} total={filteredCerts.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
                  <EF
                    richText={false}
                    value={cert.name}
                    onChange={v => updArr("certifications", idx, "name", v)}
                    placeholder="Tên chứng chỉ"
                    isEdit={isEdit}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                    style={{ fontSize: 11, fontWeight: "bold", color: bodyTextColor }}
                  />
                  <EF
                    richText={false}
                    value={cert.issuer}
                    onChange={v => updArr("certifications", idx, "issuer", v)}
                    placeholder="Tổ chức"
                    isEdit={isEdit}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                    style={{ fontSize: 10, color: bodyTextColor + "99", display: "block" }}
                  />
                  {(isEdit || hasContent(cert.year)) && (
                    <EF
                      richText={false}
                      value={cert.year}
                      onChange={v => updArr("certifications", idx, "year", v)}
                      placeholder="Năm"
                      isEdit={isEdit}
                      styleConfig={styleConfig}
                      onStyleChange={onStyleChange}
                      style={{ fontSize: 10, color: bodyTextColor + "88" }}
                    />
                  )}
                  {(isEdit || hasContent(cert.score)) && (
                    <EF
                      richText={false}
                      value={cert.score}
                      onChange={v => updArr("certifications", idx, "score", v)}
                      placeholder="Score"
                      isEdit={isEdit}
                      styleConfig={styleConfig}
                      onStyleChange={onStyleChange}
                      style={{ fontSize: 10, color: styleConfig.accentColor || accent, fontWeight: 600 }}
                    />
                  )}
                </SidebarItemRow>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px 28px 20px 20px", color: bodyTextColor }}>
          {localOrder.map((key, idx) => {
            if (key === "summary") return null;

            if (key === "experiences") {
              const arr = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
              if (!isEdit && arr.length === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <SHead
                    sectionKey={key}
                    icon={sectionIconMap[key]}
                    idx={idx}
                    isEdit={isEdit}
                    accent={accent}
                    getTitle={getTitle}
                    updateTitle={updateTitle}
                    moveSection={moveSection}
                    totalSections={localOrder.length}
                    onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                  />
                  {arr.map((exp, i) => (
                    <ItemRow key={i} section="experiences" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <EF
                          richText={false}
                          value={exp.position}
                          onChange={v => updArr("experiences", i, "position", v)}
                          placeholder="Vị trí công việc"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
                        />
                        <EF
                          richText={false}
                          value={exp.duration}
                          onChange={v => updArr("experiences", i, "duration", v)}
                          placeholder="Thời gian"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontSize: 11, color: bodyTextColor + "88", width: 120 }}
                        />
                      </div>
                      <EF
                        richText={false}
                        value={exp.company}
                        onChange={v => updArr("experiences", i, "company", v)}
                        placeholder="Công ty"
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
                      />
                      <EF
                        richText={false}
                        multiline={true}
                        value={exp.description}
                        onChange={v => updArr("experiences", i, "description", v)}
                        placeholder="Mô tả công việc..."
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
                      />
                    </ItemRow>
                  ))}
                </div>
              );
            }

            if (key === "education") {
              const arr = (localData.education || []).filter(e => isEdit || hasContent(e.degree) || hasContent(e.institution));
              if (!isEdit && arr.length === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <SHead
                    sectionKey={key}
                    icon={sectionIconMap[key]}
                    idx={idx}
                    isEdit={isEdit}
                    accent={accent}
                    getTitle={getTitle}
                    updateTitle={updateTitle}
                    moveSection={moveSection}
                    totalSections={localOrder.length}
                    onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                  />
                  {arr.map((edu, i) => (
                    <ItemRow key={i} section="education" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem} rowStyle={{ borderLeftColor: (styleConfig.accentColor || accent) + "55", background: "#fafafa" }}>
                      <EF
                        richText={false}
                        value={edu.degree}
                        onChange={v => updArr("education", i, "degree", v)}
                        placeholder="Bằng cấp / Chuyên ngành"
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <EF
                          richText={false}
                          value={edu.institution}
                          onChange={v => updArr("education", i, "institution", v)}
                          placeholder="Tên trường"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontSize: 12, color: bodyTextColor + "99", flex: 1 }}
                        />
                        <EF
                          richText={false}
                          value={edu.year}
                          onChange={v => updArr("education", i, "year", v)}
                          placeholder="Năm"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontSize: 11, color: bodyTextColor + "88", width: 70 }}
                        />
                        <EF
                          richText={false}
                          value={edu.gpa}
                          onChange={v => updArr("education", i, "gpa", v)}
                          placeholder="GPA"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontSize: 11, color: bodyTextColor + "88", width: 60 }}
                        />
                      </div>
                    </ItemRow>
                  ))}
                </div>
              );
            }

            if (key === "awards") {
              const arr = (localData.awards || []).filter(a => isEdit || hasContent(a.title));
              if (!isEdit && arr.length === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <SHead
                    sectionKey={key}
                    icon={sectionIconMap[key]}
                    idx={idx}
                    isEdit={isEdit}
                    accent={accent}
                    getTitle={getTitle}
                    updateTitle={updateTitle}
                    moveSection={moveSection}
                    totalSections={localOrder.length}
                    onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                  />
                  {arr.map((aw, i) => (
                    <ItemRow key={i} section="awards" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <EF
                          richText={false}
                          value={aw.title}
                          onChange={v => updArr("awards", i, "title", v)}
                          placeholder="Tên giải thưởng"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
                        />
                        <EF
                          richText={false}
                          value={aw.year}
                          onChange={v => updArr("awards", i, "year", v)}
                          placeholder="Năm"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontSize: 11, color: bodyTextColor + "88", width: 50 }}
                        />
                      </div>
                      <EF
                        richText={false}
                        value={aw.issuer}
                        onChange={v => updArr("awards", i, "issuer", v)}
                        placeholder="Tổ chức trao giải"
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
                      />
                      <EF
                        richText={false}
                        value={aw.description}
                        onChange={v => updArr("awards", i, "description", v)}
                        placeholder="Mô tả..."
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontSize: 12, color: bodyTextColor + "99", marginTop: 2 }}
                      />
                    </ItemRow>
                  ))}
                </div>
              );
            }

            if (key === "activities") {
              const arr = (localData.activities || []).filter(a => isEdit || hasContent(a.role) || hasContent(a.organization));
              if (!isEdit && arr.length === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <SHead
                    sectionKey={key}
                    icon={sectionIconMap[key]}
                    idx={idx}
                    isEdit={isEdit}
                    accent={accent}
                    getTitle={getTitle}
                    updateTitle={updateTitle}
                    moveSection={moveSection}
                    totalSections={localOrder.length}
                    onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                  />
                  {arr.map((act, i) => (
                    <ItemRow key={i} section="activities" idx={i} total={arr.length} isEdit={isEdit} accent={styleConfig.accentColor || accent} moveItem={moveItem} delItem={delItem}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <EF
                          richText={false}
                          value={act.role}
                          onChange={v => updArr("activities", i, "role", v)}
                          placeholder="Vai trò / Dự án"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontWeight: "bold", fontSize: 13, color: bodyTextColor, flex: 1 }}
                        />
                        <EF
                          richText={false}
                          value={act.duration}
                          onChange={v => updArr("activities", i, "duration", v)}
                          placeholder="Thời gian"
                          isEdit={isEdit}
                          styleConfig={styleConfig}
                          onStyleChange={onStyleChange}
                          style={{ fontSize: 11, color: bodyTextColor + "88", width: 110 }}
                        />
                      </div>
                      <EF
                        richText={false}
                        value={act.organization}
                        onChange={v => updArr("activities", i, "organization", v)}
                        placeholder="Tổ chức / CLB"
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontSize: 12, color: styleConfig.accentColor || accent, fontWeight: 500 }}
                      />
                      <EF
                        richText={false}
                        multiline={true}
                        value={act.description}
                        onChange={v => updArr("activities", i, "description", v)}
                        placeholder="Mô tả hoạt động..."
                        isEdit={isEdit}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{ fontSize: 12, marginTop: 4, color: bodyTextColor }}
                      />
                    </ItemRow>
                  ))}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
      <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
    </div>
  );
}