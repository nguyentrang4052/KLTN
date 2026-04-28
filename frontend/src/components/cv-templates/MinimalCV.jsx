// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "../common/ItemControls/ItemControls";
// import RichTextField from "../common/EditField/RichTextField";

// const SAMPLE_DATA = {
//   personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Chuyên viên Marketing / Product Manager", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//   summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả.",
//   experiences: [
//     { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể\n• Quản lý ngân sách marketing 2 tỷ đồng/năm\n• Dẫn dắt team 5 người" },
//     { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo\n• Phân tích dữ liệu khách hàng" }
//   ],
//   education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
//   skills: [{ category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads" }, { category: "Thiết kế", items: "Photoshop, Illustrator, Figma" }, { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio" }, { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }],
//   awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc" }],
//   certifications: [{ name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" }, { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" }],
//   activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên\n• Tổ chức sự kiện workshop 200+ người" }]
// };

// const SAMPLE_SECTION_ORDER = ["experiences", "activities", "education", "skills", "awards", "certifications"];
// const SAMPLE_SECTION_TITLES = { summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm", activities: "Hoạt động", education: "Học vấn", skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ" };

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

//   const base = { background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", width: "100%", ...style };
//   if (multiline) {
//     return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//       style={{ ...base, resize: "vertical", minHeight: 100, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", boxSizing: "border-box", lineHeight: 1.5 }} />;
//   }
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ ...base, borderBottom: "1px dashed #ccc" }} />;
// });

// const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit, richText = false }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);
//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);
//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => {
//     setLocal(v);
//     if (t.current) clearTimeout(t.current);
//     t.current = setTimeout(() => onChangeRef.current(v), 300);
//   }, []);
//   if (!isEdit) {
//     if (richText && value) return <div dangerouslySetInnerHTML={{ __html: value }} style={{ whiteSpace: "pre-wrap", ...style }} />;
//     if (!hasContent(value)) return null;
//     return multiline ? <p style={{ margin: 0, whiteSpace: "pre-line", ...style }}>{value}</p> : <div style={style}>{value}</div>;
//   }
//   if (richText) return <RichTextField value={value} onChange={onChange} placeholder={placeholder} multiline={multiline} style={style} isEdit={isEdit} />;
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)}
//     placeholder={placeholder} style={{ width: "100%", border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", fontSize: 13, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5, ...style }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ background: "transparent", border: "none", borderBottom: "1px dashed #ccc", outline: "none", fontFamily: "inherit", ...style }} />;
// });

// // ─── SHead (defined OUTSIDE component to prevent remounting) ──────────────────
// const SHead = memo(({ sectionKey, index, isEdit, accent, getTitle, updateTitle, moveSection, totalSections }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   const sHeadStyle = {
//     fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, letterSpacing: 2,
//     textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: 4
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
//       {isEdit ? (
//         <input ref={inputRef} value={local}
//           onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//           onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//           style={{ ...sHeadStyle, flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${accent}`, outline: "none" }} />
//       ) : (
//         <div style={{ ...sHeadStyle, flex: 1 }}>{getTitle(sectionKey)}</div>
//       )}
//       {isEdit && index >= 0 && (
//         <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
//           {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
//             const dis = dir === -1 ? index === 0 : index === totalSections - 1;
//             return (
//               <button key={lbl} onClick={() => moveSection(index, dir)} disabled={dis}
//                 style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 2, color: "#555", cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 28 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
//     {isEdit && (
//       <div style={{ position: "absolute", top: 4, right: 0 }}>
//         <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
//           isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//       </div>
//     )}
//     {children}
//   </div>
// ));

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function MinimalCV({
//   data, onChange, isEdit,
//   accent = "#1C1C1C",
//   styleConfig = {},
//   sectionOrder = ["experiences", "activities", "education", "skills", "awards", "certifications"],
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
//     const arr = [...localOrder]; [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//     setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//   }, [localOrder, setSectionOrder]);

//   const updateTitle = useCallback((key, title) => {
//     const nt = { ...localTitles, [key]: title };
//     setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//   }, [localTitles, setSectionTitles]);

//   const DEFAULTS = { summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm", activities: "Hoạt động", education: "Học vấn", skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ" };
//   const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//   const renderSection = useCallback((key, index) => {
//     const arr = localData[key] || [];
//     if (!isEdit && !hasContent(arr)) return null;

//     const cfgMap = {
//       experiences: {
//         empty: { company: "", position: "", duration: "", description: "" },
//         render: (exp, i) => (
//           <>
//             <EF value={exp.position} onChange={v => updArr("experiences", i, "position", v)} placeholder="Vị trí" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 14, fontFamily: "'Cormorant Garamond', serif" }} />
//             <div style={{ display: "flex", gap: 20 }}>
//               <EF value={exp.company} onChange={v => updArr("experiences", i, "company", v)} placeholder="Công ty" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//               <EF value={exp.duration} onChange={v => updArr("experiences", i, "duration", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 12, color: "#aaa", width: 100 }} />
//             </div>
//             <EF value={exp.description} onChange={v => updArr("experiences", i, "description", v)} placeholder="Mô tả..." multiline richText={true} isEdit={isEdit} style={{ fontSize: 12 }} />
//           </>
//         )
//       },
//       activities: {
//         empty: { organization: "", role: "", duration: "", description: "" },
//         render: (act, i) => (
//           <>
//             <EF value={act.role} onChange={v => updArr("activities", i, "role", v)} placeholder="Vai trò" isEdit={isEdit} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
//             <EF value={act.organization} onChange={v => updArr("activities", i, "organization", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//             <EF value={act.duration} onChange={v => updArr("activities", i, "duration", v)} placeholder="Thời gian" isEdit={isEdit} style={{ fontSize: 11, color: "#aaa" }} />
//             <EF value={act.description} onChange={v => updArr("activities", i, "description", v)} placeholder="Mô tả..." multiline richText={true} isEdit={isEdit} style={{ fontSize: 12 }} />
//           </>
//         )
//       },
//       education: {
//         empty: { institution: "", degree: "", year: "", gpa: "" },
//         render: (edu, i) => (
//           <>
//             <EF value={edu.degree} onChange={v => updArr("education", i, "degree", v)} placeholder="Chuyên ngành" isEdit={isEdit} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
//             <EF value={edu.institution} onChange={v => updArr("education", i, "institution", v)} placeholder="Trường" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//             <div style={{ display: "flex", gap: 8 }}>
//               <EF value={edu.year} onChange={v => updArr("education", i, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 12, color: "#aaa", width: 80 }} />
//               <EF value={edu.gpa} onChange={v => updArr("education", i, "gpa", v)} placeholder="GPA" isEdit={isEdit} style={{ fontSize: 12, color: "#aaa", width: 80 }} />
//             </div>
//           </>
//         )
//       },
//       skills: {
//         empty: { category: "", items: "" },
//         render: (sk, i) => (
//           <>
//             <EF value={sk.category} onChange={v => updArr("skills", i, "category", v)} placeholder="Nhóm" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 12, fontFamily: "'Cormorant Garamond', serif" }} />
//             <EF value={sk.items} onChange={v => updArr("skills", i, "items", v)} placeholder="Kỹ năng..." isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//           </>
//         )
//       },
//       awards: {
//         empty: { title: "", issuer: "", year: "", description: "" },
//         render: (aw, i) => (
//           <>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <EF value={aw.title} onChange={v => updArr("awards", i, "title", v)} placeholder="Tên giải" isEdit={isEdit} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
//               <EF value={aw.year} onChange={v => updArr("awards", i, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ width: 50, fontSize: 11, color: "#aaa" }} />
//             </div>
//             <EF value={aw.issuer} onChange={v => updArr("awards", i, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//             <EF value={aw.description} onChange={v => updArr("awards", i, "description", v)} placeholder="Mô tả..." richText={true} isEdit={isEdit} style={{ fontSize: 12, color: "#888" }} />
//           </>
//         )
//       },
//       certifications: {
//         empty: { name: "", issuer: "", year: "", score: "" },
//         render: (cert, i) => (
//           <>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
//               <EF value={cert.name} onChange={v => updArr("certifications", i, "name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit} style={{ fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", flex: 1 }} />
//               <EF value={cert.year} onChange={v => updArr("certifications", i, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ width: 50, fontSize: 11, color: "#aaa", flexShrink: 0 }} />
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <EF value={cert.issuer} onChange={v => updArr("certifications", i, "issuer", v)} placeholder="Cấp bởi" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//               <EF value={cert.score} onChange={v => updArr("certifications", i, "score", v)} placeholder="Score" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 70 }} />
//             </div>
//           </>
//         )
//       },
//     };

//     const cfg = cfgMap[key];
//     if (!cfg) return null;

//     return (
//       <div key={key} style={{ marginBottom: 24 }}>
//         <SHead sectionKey={key} index={index} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} totalSections={localOrder.length} />
//         {arr.map((item, i) => (
//           <ItemRow key={i} section={key} idx={i} total={arr.length} isEdit={isEdit} accent={accent} moveItem={moveItem} delItem={delItem}>
//             {cfg.render(item, i)}
//           </ItemRow>
//         ))}
//         {isEdit && (
//           <button onClick={() => addItem(key, cfg.empty)}
//             style={{ fontSize: 11, color: "#1C1C1C", background: "transparent", border: "1px dashed #ccc", borderRadius: 4, padding: "4px 10px", cursor: "pointer", marginTop: 4 }}>
//             + Thêm
//           </button>
//         )}
//       </div>
//     );
//   }, [localData, isEdit, accent, updArr, addItem, delItem, moveItem, moveSection, getTitle, updateTitle, localOrder.length]);

//   const half = Math.ceil(localOrder.length / 2);

//   return (
//     <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Cormorant Garamond', serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, padding: "48px 52px", boxSizing: "border-box" }}>
//       {/* Header */}
//       <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 20, marginBottom: 28 }}>
//         <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//           style={{ fontSize: 36, fontWeight: "bold", letterSpacing: 1, marginBottom: 6, borderBottom: isEdit ? "1px dashed #ccc" : "none", color: "#1C1C1C" }} />
//         <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh / Vị trí"
//           style={{ fontSize: 16, color: "#777", letterSpacing: 2, marginBottom: 12, borderBottom: isEdit ? "1px dashed #ccc" : "none", width: "50%" }} />
//         <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#888" }}>
//           {[["email", "email@example.com"], ["phone", "Điện thoại"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
//             <span key={key}>
//               {isEdit
//                 ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 12, color: "#999", borderBottom: "1px dashed #ddd", width: 130 }} />
//                 : pi[key] ? <span>{pi[key]}</span> : null}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Summary */}
//       {(isEdit || hasContent(localData.summary)) && (
//         <div style={{ marginBottom: 28 }}>
//           <SHead sectionKey="summary" index={-1} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} totalSections={localOrder.length} />
//           <EF value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Giới thiệu ngắn gọn..." multiline richText={true} isEdit={isEdit}
//             style={{ fontSize: 15, color: "#444", lineHeight: 1.7 }} />
//         </div>
//       )}

//       {/* Two columns */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
//         <div>{localOrder.slice(0, half).map((key, idx) => renderSection(key, idx))}</div>
//         <div>{localOrder.slice(half).map((key, idx) => renderSection(key, idx + half))}</div>
//       </div>
//       <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//     </div>
//   );
// }


// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "../common/ItemControls/ItemControls";
// import RichTextField from "../common/EditField/RichTextField";
//import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";

// const SAMPLE_DATA = {
//   personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Chuyên viên Marketing / Product Manager", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//   summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả.",
//   experiences: [
//     { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể\n• Quản lý ngân sách marketing 2 tỷ đồng/năm\n• Dẫn dắt team 5 người" },
//     { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo\n• Phân tích dữ liệu khách hàng" }
//   ],
//   education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
//   skills: [{ category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads" }, { category: "Thiết kế", items: "Photoshop, Illustrator, Figma" }, { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio" }, { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }],
//   awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc" }],
//   certifications: [{ name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" }, { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" }],
//   activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên\n• Tổ chức sự kiện workshop 200+ người" }]
// };

// const SAMPLE_SECTION_ORDER = ["experiences", "activities", "education", "skills", "awards", "certifications"];
// const SAMPLE_SECTION_TITLES = { summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm", activities: "Hoạt động", education: "Học vấn", skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ" };

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

//   const base = { background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", width: "100%", ...style };
//   if (multiline) {
//     return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//       style={{ ...base, resize: "vertical", minHeight: 100, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", boxSizing: "border-box", lineHeight: 1.5 }} />;
//   }
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ ...base, borderBottom: "1px dashed #ccc" }} />;
// });

// const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit, richText = false }) => {
//   const [local, setLocal] = useState(value);
//   const t = useRef(null);
//   const onChangeRef = useRef(onChange);
//   const inputRef = useRef(null);
//   useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//   useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);
//   const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//   const change = useCallback((v) => {
//     setLocal(v);
//     if (t.current) clearTimeout(t.current);
//     t.current = setTimeout(() => onChangeRef.current(v), 300);
//   }, []);
//   if (!isEdit) {
//     if (richText && value) return <div dangerouslySetInnerHTML={{ __html: value }} style={{ whiteSpace: "pre-wrap", ...style }} />;
//     if (!hasContent(value)) return null;
//     return multiline ? <p style={{ margin: 0, whiteSpace: "pre-line", ...style }}>{value}</p> : <div style={style}>{value}</div>;
//   }
//   if (richText) return <RichTextField value={value} onChange={onChange} placeholder={placeholder} multiline={multiline} style={style} isEdit={isEdit} />;
//   if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)}
//     placeholder={placeholder} style={{ width: "100%", border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", fontSize: 13, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5, ...style }} />;
//   return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//     style={{ background: "transparent", border: "none", borderBottom: "1px dashed #ccc", outline: "none", fontFamily: "inherit", ...style }} />;
// });

// // ─── SHead (defined OUTSIDE component to prevent remounting) ──────────────────
// const SHead = memo(({ sectionKey, index, isEdit, accent, getTitle, updateTitle, moveSection, totalSections }) => {
//   const [local, setLocal] = useState(() => getTitle(sectionKey));
//   const t = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//   const sHeadStyle = {
//     fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, letterSpacing: 2,
//     textTransform: "uppercase", color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: 4
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
//       {isEdit ? (
//         <input ref={inputRef} value={local}
//           onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//           onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//           style={{ ...sHeadStyle, flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${accent}`, outline: "none" }} />
//       ) : (
//         <div style={{ ...sHeadStyle, flex: 1 }}>{getTitle(sectionKey)}</div>
//       )}
//       {isEdit && index >= 0 && (
//         <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
//           {[["↑", -1], ["↓", 1]].map(([lbl, dir]) => {
//             const dis = dir === -1 ? index === 0 : index === totalSections - 1;
//             return (
//               <button key={lbl} onClick={() => moveSection(index, dir)} disabled={dis}
//                 style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 2, color: "#555", cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//   <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 28 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
//     {isEdit && (
//       <div style={{ position: "absolute", top: 4, right: 0 }}>
//         <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
//           isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//       </div>
//     )}
//     {children}
//   </div>
// ));

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function MinimalCV({
//   data, onChange, isEdit,
//   accent = "#1C1C1C",
//   styleConfig = {},
//   sectionOrder = ["experiences", "activities", "education", "skills", "awards", "certifications"],
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
//     const arr = [...localOrder]; [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//     setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//   }, [localOrder, setSectionOrder]);

//   const updateTitle = useCallback((key, title) => {
//     const nt = { ...localTitles, [key]: title };
//     setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//   }, [localTitles, setSectionTitles]);

//   const DEFAULTS = { summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm", activities: "Hoạt động", education: "Học vấn", skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ" };
//   const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//   const renderSection = useCallback((key, index) => {
//     const arr = localData[key] || [];
//     if (!isEdit && !hasContent(arr)) return null;

//     const cfgMap = {
//       experiences: {
//         empty: { company: "", position: "", duration: "", description: "" },
//         render: (exp, i) => (
//           <>
//             <EF value={exp.position} onChange={v => updArr("experiences", i, "position", v)} placeholder="Vị trí" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 14, fontFamily: "'Cormorant Garamond', serif" }} />
//             <div style={{ display: "flex", gap: 20 }}>
//               <EF value={exp.company} onChange={v => updArr("experiences", i, "company", v)} placeholder="Công ty" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//               <EF value={exp.duration} onChange={v => updArr("experiences", i, "duration", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 12, color: "#aaa", width: 100 }} />
//             </div>
//             <EF value={exp.description} onChange={v => updArr("experiences", i, "description", v)} placeholder="Mô tả..." multiline richText={true} isEdit={isEdit} style={{ fontSize: 12 }} />
//           </>
//         )
//       },
//       activities: {
//         empty: { organization: "", role: "", duration: "", description: "" },
//         render: (act, i) => (
//           <>
//             <EF value={act.role} onChange={v => updArr("activities", i, "role", v)} placeholder="Vai trò" isEdit={isEdit} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
//             <EF value={act.organization} onChange={v => updArr("activities", i, "organization", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//             <EF value={act.duration} onChange={v => updArr("activities", i, "duration", v)} placeholder="Thời gian" isEdit={isEdit} style={{ fontSize: 11, color: "#aaa" }} />
//             <EF value={act.description} onChange={v => updArr("activities", i, "description", v)} placeholder="Mô tả..." multiline richText={true} isEdit={isEdit} style={{ fontSize: 12 }} />
//           </>
//         )
//       },
//       education: {
//         empty: { institution: "", degree: "", year: "", gpa: "" },
//         render: (edu, i) => (
//           <>
//             <EF value={edu.degree} onChange={v => updArr("education", i, "degree", v)} placeholder="Chuyên ngành" isEdit={isEdit} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
//             <EF value={edu.institution} onChange={v => updArr("education", i, "institution", v)} placeholder="Trường" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//             <div style={{ display: "flex", gap: 8 }}>
//               <EF value={edu.year} onChange={v => updArr("education", i, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 12, color: "#aaa", width: 80 }} />
//               <EF value={edu.gpa} onChange={v => updArr("education", i, "gpa", v)} placeholder="GPA" isEdit={isEdit} style={{ fontSize: 12, color: "#aaa", width: 80 }} />
//             </div>
//           </>
//         )
//       },
//       skills: {
//         empty: { category: "", items: "" },
//         render: (sk, i) => (
//           <>
//             <EF value={sk.category} onChange={v => updArr("skills", i, "category", v)} placeholder="Nhóm" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 12, fontFamily: "'Cormorant Garamond', serif" }} />
//             <EF value={sk.items} onChange={v => updArr("skills", i, "items", v)} placeholder="Kỹ năng..." isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//           </>
//         )
//       },
//       awards: {
//         empty: { title: "", issuer: "", year: "", description: "" },
//         render: (aw, i) => (
//           <>
//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <EF value={aw.title} onChange={v => updArr("awards", i, "title", v)} placeholder="Tên giải" isEdit={isEdit} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
//               <EF value={aw.year} onChange={v => updArr("awards", i, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ width: 50, fontSize: 11, color: "#aaa" }} />
//             </div>
//             <EF value={aw.issuer} onChange={v => updArr("awards", i, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//             <EF value={aw.description} onChange={v => updArr("awards", i, "description", v)} placeholder="Mô tả..." richText={true} isEdit={isEdit} style={{ fontSize: 12, color: "#888" }} />
//           </>
//         )
//       },
//       certifications: {
//         empty: { name: "", issuer: "", year: "", score: "" },
//         render: (cert, i) => (
//           <>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
//               <EF value={cert.name} onChange={v => updArr("certifications", i, "name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit} style={{ fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", flex: 1 }} />
//               <EF value={cert.year} onChange={v => updArr("certifications", i, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ width: 50, fontSize: 11, color: "#aaa", flexShrink: 0 }} />
//             </div>
//             <div style={{ display: "flex", gap: 8 }}>
//               <EF value={cert.issuer} onChange={v => updArr("certifications", i, "issuer", v)} placeholder="Cấp bởi" isEdit={isEdit} style={{ fontSize: 12, color: "#777" }} />
//               <EF value={cert.score} onChange={v => updArr("certifications", i, "score", v)} placeholder="Score" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 70 }} />
//             </div>
//           </>
//         )
//       },
//     };

//     const cfg = cfgMap[key];
//     if (!cfg) return null;

//     return (
//       <div key={key} style={{ marginBottom: 24 }}>
//         <SHead sectionKey={key} index={index} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} totalSections={localOrder.length} />
//         {arr.map((item, i) => (
//           <ItemRow key={i} section={key} idx={i} total={arr.length} isEdit={isEdit} accent={accent} moveItem={moveItem} delItem={delItem}>
//             {cfg.render(item, i)}
//           </ItemRow>
//         ))}
//         {isEdit && (
//           <button onClick={() => addItem(key, cfg.empty)}
//             style={{ fontSize: 11, color: "#1C1C1C", background: "transparent", border: "1px dashed #ccc", borderRadius: 4, padding: "4px 10px", cursor: "pointer", marginTop: 4 }}>
//             + Thêm
//           </button>
//         )}
//       </div>
//     );
//   }, [localData, isEdit, accent, updArr, addItem, delItem, moveItem, moveSection, getTitle, updateTitle, localOrder.length]);

//   const half = Math.ceil(localOrder.length / 2);

//   return (
//     <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Cormorant Garamond', serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, padding: "48px 52px", boxSizing: "border-box" }}>
//       {/* Header */}
//       <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 20, marginBottom: 28 }}>
//         <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//           style={{ fontSize: 36, fontWeight: "bold", letterSpacing: 1, marginBottom: 6, borderBottom: isEdit ? "1px dashed #ccc" : "none", color: "#1C1C1C" }} />
//         <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh / Vị trí"
//           style={{ fontSize: 16, color: "#777", letterSpacing: 2, marginBottom: 12, borderBottom: isEdit ? "1px dashed #ccc" : "none", width: "50%" }} />
//         <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#888" }}>
//           {[["email", "email@example.com"], ["phone", "Điện thoại"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
//             <span key={key}>
//               {isEdit
//                 ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 12, color: "#999", borderBottom: "1px dashed #ddd", width: 130 }} />
//                 : pi[key] ? <span>{pi[key]}</span> : null}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Summary */}
//       {(isEdit || hasContent(localData.summary)) && (
//         <div style={{ marginBottom: 28 }}>
//           <SHead sectionKey="summary" index={-1} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} totalSections={localOrder.length} />
//           <EF value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Giới thiệu ngắn gọn..." multiline richText={true} isEdit={isEdit}
//             style={{ fontSize: 15, color: "#444", lineHeight: 1.7 }} />
//         </div>
//       )}

//       {/* Two columns */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
//         <div>{localOrder.slice(0, half).map((key, idx) => renderSection(key, idx))}</div>
//         <div>{localOrder.slice(half).map((key, idx) => renderSection(key, idx + half))}</div>
//       </div>
//       <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//     </div>
//   );
// }

import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "../common/ItemControls/ItemControls";
import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";

const SAMPLE_DATA = {
  personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Chuyên viên Marketing / Product Manager", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
  summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả.",
  experiences: [
    { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể\n• Quản lý ngân sách marketing 2 tỷ đồng/năm\n• Dẫn dắt team 5 người" },
    { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo\n• Phân tích dữ liệu khách hàng" }
  ],
  education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
  skills: [{ category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads" }, { category: "Thiết kế", items: "Photoshop, Illustrator, Figma" }, { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio" }, { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }],
  awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc" }],
  certifications: [{ name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" }, { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" }],
  activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên\n• Tổ chức sự kiện workshop 200+ người" }]
};

const SAMPLE_SECTION_ORDER = ["experiences", "activities", "education", "skills", "awards", "certifications"];
const SAMPLE_SECTION_TITLES = { summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm", activities: "Hoạt động", education: "Học vấn", skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ" };

const isHTML = (str) => typeof str === 'string' && /<[a-z][\s\S]*>/i.test(str);

const hasContent = (v) => {
  if (!v) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.some(hasContent);
  if (typeof v === "object") return Object.values(v).some(hasContent);
  return false;
};

// ─── InlineEdit: contenteditable với UnifiedToolbar support ──────────────────
const InlineEdit = memo(({ value = "", onChange, placeholder, style, styleConfig = {}, onStyleChange, multiline = false }) => {
  const ref = useRef(null);
  const [html, setHtml] = useState(value);
  const savedSelRef = useRef(null);

  useEffect(() => {
    if (document.activeElement !== ref.current && value !== html) setHtml(value);
  }, [value]);

  const handleInput = useCallback(() => {
    const newHtml = ref.current.innerHTML;
    setHtml(newHtml);
    onChange(newHtml);
  }, [onChange]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) savedSelRef.current = sel.getRangeAt(0).cloneRange();
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

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') document.execCommand('defaultParagraphSeparator', false, 'div');
  }, []);

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
      onKeyUp={saveSelection}
      onKeyDown={handleKeyDown}
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

// ─── DI: simple debounced input cho header (không rich-text) ─────────────────
const DI = memo(({ value = "", onChange, placeholder, style, multiline, styleConfig = {}, onStyleChange, textColor }) => {
  const [local, setLocal] = useState(value);
  const t = useRef(null);
  const onChangeRef = useRef(onChange);
  const inputRef = useRef(null);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => {
    if (value !== local && document.activeElement !== inputRef.current) setLocal(value);
  }, [value]);

  const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
  const change = useCallback((v) => {
    setLocal(v);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => onChangeRef.current(v), 300);
  }, []);

  const handleFocus = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleBlur = useCallback((e) => {
    commit(e.target.value);
    setTimeout(() => {
      if (!document.activeElement?.closest(".selection-toolbar")) clearActiveField();
    }, 200);
  }, [commit]);

  const sc = styleConfig || {};
  const base = {
    background: "transparent", border: "none", outline: "none",
    fontFamily: sc.fontFamily || "inherit",
    fontSize: sc.baseFontSize || "inherit",
    lineHeight: sc.lineHeight || "inherit",
    fontWeight: sc.fontWeight || "normal",
    fontStyle: sc.fontStyle || "normal",
    textDecoration: sc.textDecoration || "none",
    color: textColor || sc.textColor || "inherit",
    width: "100%", ...style,
  };

  if (multiline) {
    return (
      <textarea ref={inputRef} value={local}
        onChange={e => change(e.target.value)}
        onFocus={handleFocus} onBlur={handleBlur}
        placeholder={placeholder}
        style={{ ...base, resize: "vertical", minHeight: 80, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", boxSizing: "border-box" }} />
    );
  }
  return (
    <input ref={inputRef} type="text" value={local}
      onChange={e => change(e.target.value)}
      onFocus={handleFocus} onBlur={handleBlur}
      placeholder={placeholder}
      style={{ ...base, borderBottom: "1px dashed #ccc" }} />
  );
});

// ─── EF: Editable Field – dùng InlineEdit cho mọi trường hợp edit ────────────
const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit, richText = false, styleConfig = {}, onStyleChange, textColor }) => {
  if (!isEdit) {
    if (isHTML(value)) return <div dangerouslySetInnerHTML={{ __html: value }} style={{ color: textColor, whiteSpace: "pre-wrap", ...style }} />;
    if (!value) return null;
    return multiline
      ? <div style={{ color: textColor, whiteSpace: "pre-line", ...style }}>{value}</div>
      : <span style={{ color: textColor, ...style }}>{value}</span>;
  }
  // Mọi field (kể cả richText) đều dùng InlineEdit → UnifiedToolbar
  return (
    <InlineEdit
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ color: textColor, ...style }}
      multiline={multiline}
      styleConfig={styleConfig}
      onStyleChange={onStyleChange}
    />
  );
});

// ─── TitleEdit: contenteditable cho section titles ────────────────────────────
const TitleEdit = memo(({ value, onChange, style, styleConfig = {}, onStyleChange }) => {
  const ref = useRef(null);
  const [html, setHtml] = useState(value);

  useEffect(() => {
    if (document.activeElement !== ref.current && value !== html) setHtml(value);
  }, [value]);

  const handleInput = useCallback(() => {
    const newHtml = ref.current.innerHTML;
    setHtml(newHtml);
    onChange(newHtml);
  }, [onChange]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      // saved for toolbar
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!active?.closest(".selection-toolbar") && active !== ref.current) clearActiveField();
    }, 200);
  }, []);

  const handleMouseUp = useCallback(() => {
    saveSelection();
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig, saveSelection]);

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
      onKeyUp={saveSelection}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ outline: "none", fontFamily: styleConfig?.fontFamily || "inherit", flex: 1, width: "100%", ...style }}
    />
  );
});

// ─── SHead: section header với TitleEdit ─────────────────────────────────────
const SHead = memo(({ sectionKey, index, isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections, styleConfig, onStyleChange }) => {
  const sHeadStyle = {
    fontFamily: styleConfig?.fontFamily || "'Cormorant Garamond', serif",
    fontSize: 15, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", color: accent,
    borderBottom: `1px solid ${accent}`, paddingBottom: 4,
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
      {isEdit ? (
        <TitleEdit
          value={getTitle(sectionKey)}
          onChange={v => updateTitle(sectionKey, v)}
          style={{ ...sHeadStyle, flex: 1, width: "auto" }}
          styleConfig={styleConfig}
          onStyleChange={onStyleChange}
        />
      ) : (
        <div style={{ ...sHeadStyle, flex: 1 }}>
          {isHTML(getTitle(sectionKey))
            ? <span dangerouslySetInnerHTML={{ __html: getTitle(sectionKey) }} />
            : getTitle(sectionKey)}
        </div>
      )}
      {isEdit && index >= 0 && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {[["↑", -1], ["↓", 1], ["×", 0]].map(([lbl, dir]) => {
            if (lbl === "×") {
              return (
                <button key={lbl} onClick={() => deleteSection(index)}
                  style={{ padding: "2px 5px", fontSize: 10, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 2, color: "#555", cursor: "pointer" }}>{lbl}</button>
              );
            }
            const dis = dir === -1 ? index === 0 : index === totalSections - 1;
            return (
              <button key={lbl} onClick={() => moveSection(index, dir)} disabled={dis}
                style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 2, color: "#555", cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            );
          })}
        </div>
      )}
    </div>
  );
});

// ─── ItemRow ─────────────────────────────────────────────────────────────────
const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
  <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 28 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
    {isEdit && (
      <div style={{ position: "absolute", top: 4, right: 0 }}>
        <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
          isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
      </div>
    )}
    {children}
  </div>
));

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function MinimalCV({
  data, onChange, isEdit,
  accent = "#1C1C1C",
  styleConfig = {},
  onStyleChange,
  sectionOrder = ["experiences", "activities", "education", "skills", "awards", "certifications"],
  setSectionOrder,
  sectionTitles = {},
  setSectionTitles,
  useSampleData = false,
  forceReset,
}) {
  const textColor = styleConfig.textColor || "#1C1C1C";

  const shouldUseSample = useMemo(() => {
    if (forceReset) return false;
    if (useSampleData) return true;
    if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
    return false;
  }, [useSampleData, isEdit, data, forceReset]);

  const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
  const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
  const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
  const isUserEditing = useRef(false);

  useEffect(() => {
    if (isUserEditing.current) return;
    if (shouldUseSample) return;
    setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
  }, [data, sectionOrder, sectionTitles, shouldUseSample, forceReset]);

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
    const arr = [...localOrder]; [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
  }, [localOrder, setSectionOrder]);

  const deleteSection = useCallback((idx) => {
    const arr = localOrder.filter((_, i) => i !== idx);
    setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
  }, [localOrder, setSectionOrder]);

  const updateTitle = useCallback((key, title) => {
    const nt = { ...localTitles, [key]: title };
    setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
  }, [localTitles, setSectionTitles]);

  const DEFAULTS = { summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm", activities: "Hoạt động", education: "Học vấn", skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ" };
  const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

  const configs = useMemo(() => ({
    experiences: {
      empty: { company: "", position: "", duration: "", description: "" },
      render: (exp, i, onChange) => (
        <>
          <EF value={exp.position} onChange={v => onChange("position", v)} placeholder="Vị trí" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontSize: 14, fontFamily: "'Cormorant Garamond', serif" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <div style={{ display: "flex", gap: 20 }}>
            <EF value={exp.company} onChange={v => onChange("company", v)} placeholder="Công ty" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
            <EF value={exp.duration} onChange={v => onChange("duration", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#aaa", width: 100 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          </div>
          <EF value={exp.description} onChange={v => onChange("description", v)} placeholder="Mô tả..." multiline richText isEdit={isEdit} textColor={textColor} style={{ fontSize: 12 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
        </>
      )
    },
    activities: {
      empty: { organization: "", role: "", duration: "", description: "" },
      render: (act, i, onChange) => (
        <>
          <EF value={act.role} onChange={v => onChange("role", v)} placeholder="Vai trò" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={act.organization} onChange={v => onChange("organization", v)} placeholder="Tổ chức" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={act.duration} onChange={v => onChange("duration", v)} placeholder="Thời gian" isEdit={isEdit} textColor={textColor} style={{ fontSize: 11, color: "#aaa" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={act.description} onChange={v => onChange("description", v)} placeholder="Mô tả..." multiline richText isEdit={isEdit} textColor={textColor} style={{ fontSize: 12 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
        </>
      )
    },
    education: {
      empty: { institution: "", degree: "", year: "", gpa: "" },
      render: (edu, i, onChange) => (
        <>
          <EF value={edu.degree} onChange={v => onChange("degree", v)} placeholder="Chuyên ngành" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={edu.institution} onChange={v => onChange("institution", v)} placeholder="Trường" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <div style={{ display: "flex", gap: 8 }}>
            <EF value={edu.year} onChange={v => onChange("year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#aaa", width: 80 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
            <EF value={edu.gpa} onChange={v => onChange("gpa", v)} placeholder="GPA" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#aaa", width: 80 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          </div>
        </>
      )
    },
    skills: {
      empty: { category: "", items: "" },
      render: (sk, i, onChange) => (
        <>
          <EF value={sk.category} onChange={v => onChange("category", v)} placeholder="Nhóm" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontSize: 12, fontFamily: "'Cormorant Garamond', serif" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={sk.items} onChange={v => onChange("items", v)} placeholder="Kỹ năng..." isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
        </>
      )
    },
    awards: {
      empty: { title: "", issuer: "", year: "", description: "" },
      render: (aw, i, onChange) => (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <EF value={aw.title} onChange={v => onChange("title", v)} placeholder="Tên giải" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
            <EF value={aw.year} onChange={v => onChange("year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ width: 50, fontSize: 11, color: "#aaa" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          </div>
          <EF value={aw.issuer} onChange={v => onChange("issuer", v)} placeholder="Tổ chức" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={aw.description} onChange={v => onChange("description", v)} placeholder="Mô tả..." richText isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#888" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
        </>
      )
    },
    certifications: {
      empty: { name: "", issuer: "", year: "", score: "" },
      render: (cert, i, onChange) => (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <EF value={cert.name} onChange={v => onChange("name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit} textColor={textColor} style={{ fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
            <EF value={cert.year} onChange={v => onChange("year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ width: 50, fontSize: 11, color: "#aaa", flexShrink: 0 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <EF value={cert.issuer} onChange={v => onChange("issuer", v)} placeholder="Cấp bởi" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
            <EF value={cert.score} onChange={v => onChange("score", v)} placeholder="Score" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#888", width: 70 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          </div>
        </>
      )
    },
  }), [isEdit, accent, textColor, styleConfig, onStyleChange]);

  const renderSection = useCallback((key, index) => {
    const arr = localData[key] || [];
    if (!isEdit && !hasContent(arr)) return null;
    const cfg = configs[key];
    if (!cfg) return null;

    return (
      <div key={key} style={{ marginBottom: 24 }}>
        <SHead sectionKey={key} index={index} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} deleteSection={deleteSection} totalSections={localOrder.length} styleConfig={styleConfig} onStyleChange={onStyleChange} />
        {arr.map((item, i) => (
          <ItemRow key={i} section={key} idx={i} total={arr.length} isEdit={isEdit} accent={accent} moveItem={moveItem} delItem={delItem}>
            {cfg.render(item, i, (k, v) => updArr(key, i, k, v))}
          </ItemRow>
        ))}
        {isEdit && (
          <button onClick={() => addItem(key, cfg.empty)}
            style={{ fontSize: 11, color: "#1C1C1C", background: "transparent", border: "1px dashed #ccc", borderRadius: 4, padding: "4px 10px", cursor: "pointer", marginTop: 4 }}>
            + Thêm
          </button>
        )}
      </div>
    );
  }, [localData, isEdit, accent, configs, updArr, addItem, delItem, moveItem, moveSection, deleteSection, getTitle, updateTitle, localOrder.length, styleConfig, onStyleChange]);

  const half = Math.ceil(localOrder.length / 2);

  return (
    <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Cormorant Garamond', serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, padding: "48px 52px", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 20, marginBottom: 28 }}>
        <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
          style={{ fontSize: 36, fontWeight: "bold", letterSpacing: 1, marginBottom: 6, borderBottom: isEdit ? "1px dashed #ccc" : "none", color: textColor }}
          styleConfig={styleConfig} onStyleChange={onStyleChange} textColor={textColor} />
        <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh / Vị trí"
          style={{ fontSize: 16, color: "#777", letterSpacing: 2, marginBottom: 12, borderBottom: isEdit ? "1px dashed #ccc" : "none", width: "50%" }}
          styleConfig={styleConfig} onStyleChange={onStyleChange} textColor="#777" />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#888" }}>
          {[["email", "email@example.com"], ["phone", "Điện thoại"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
            <span key={key}>
              {isEdit
                ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 12, color: "#999", borderBottom: "1px dashed #ddd", width: 130 }} styleConfig={styleConfig} onStyleChange={onStyleChange} textColor="#999" />
                : pi[key] ? <span>{pi[key]}</span> : null}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(isEdit || hasContent(localData.summary)) && (
        <div style={{ marginBottom: 28 }}>
          <SHead sectionKey="summary" index={-1} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} totalSections={localOrder.length} styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <EF value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Giới thiệu ngắn gọn..." multiline richText isEdit={isEdit} textColor={textColor}
            style={{ fontSize: 15, color: "#444", lineHeight: 1.7 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
        <div>{localOrder.slice(0, half).map((key, idx) => renderSection(key, idx))}</div>
        <div>{localOrder.slice(half).map((key, idx) => renderSection(key, idx + half))}</div>
      </div>
      <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
    </div>
  );
}