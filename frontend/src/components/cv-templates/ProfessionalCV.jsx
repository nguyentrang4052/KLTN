// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "../common/ItemControls/ItemControls";
// import RichTextField from "../common/EditField/RichTextField";

// const SAMPLE_DATA = {
//     personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Chuyên viên Marketing / Product Manager", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//     summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả. Tìm kiếm cơ hội phát triển trong môi trường chuyên nghiệp, năng động.",
//     experiences: [
//         { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể cho công ty\n• Quản lý ngân sách marketing 2 tỷ đồng/năm, tối ưu ROI đạt 150%\n• Dẫn dắt team 5 người thực hiện các chiến dịch digital marketing" },
//         { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo trên Facebook Ads và Google Ads\n• Phân tích dữ liệu khách hàng và đề xuất chiến lược tối ưu" }
//     ],
//     education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
//     skills: [
//         { category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads, Content Marketing" },
//         { category: "Thiết kế", items: "Photoshop, Illustrator, Figma, Canva" },
//         { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio, SQL cơ bản" },
//         { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }
//     ],
//     awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc trong việc triển khai chiến dịch marketing Q4/2023" }],
//     certifications: [
//         { name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" },
//         { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" },
//         { name: "IELTS Academic", issuer: "British Council", year: "2021", score: "7.5" }
//     ],
//     activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên sản xuất nội dung cho fanpage CLB\n• Tổ chức các sự kiện workshop về Marketing với quy mô 200+ người tham dự" }]
// };

// const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"];
// const SAMPLE_SECTION_TITLES = { summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc", education: "Học vấn", skills: "Kỹ năng", certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa" };

// const hasContent = (v) => {
//     if (!v) return false;
//     if (typeof v === "string") return v.trim() !== "";
//     if (Array.isArray(v)) return v.some(hasContent);
//     if (typeof v === "object") return Object.values(v).some(hasContent);
//     return false;
// };

// // ─── Stable inputs (defined OUTSIDE) ─────────────────────────────────────────
// const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
//     const [local, setLocal] = useState(value);
//     const t = useRef(null);
//     const onChangeRef = useRef(onChange);
//     const inputRef = useRef(null);

//     useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//     useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//     const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//     const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//     const base = { width: "100%", background: "transparent", outline: "none", fontFamily: "inherit", ...style };
//     if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//         style={{ ...base, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px 10px", fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }} />;
//     return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//         style={{ ...base, border: "none", borderBottom: "1px dashed #ccc", padding: "0 0 2px 0" }} />;
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

// // ─── SectionHeader (defined OUTSIDE to prevent remounting) ────────────────────
// const SectionHeader = memo(({ sectionKey, index, isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections }) => {
//     const [local, setLocal] = useState(() => getTitle(sectionKey));
//     const t = useRef(null);
//     const inputRef = useRef(null);

//     useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//     return (
//         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, borderBottom: `1px solid ${accent}22`, paddingBottom: 6, minHeight: 32 }}>
//             <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
//             <div style={{ flex: 1, minWidth: 0 }}>
//                 {isEdit ? (
//                     <input ref={inputRef} value={local}
//                         onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//                         onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//                         style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent, background: "transparent", border: "none", borderBottom: "1px dashed #ccc", width: "100%", outline: "none", padding: "2px 0", fontFamily: "inherit" }} />
//                 ) : (
//                     <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>{getTitle(sectionKey)}</div>
//                 )}
//             </div>
//             {isEdit && (
//                 <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
//                     {[["↑", () => moveSection(index, -1), index === 0], ["↓", () => moveSection(index, 1), index === totalSections - 1], ["×", () => deleteSection(index), false]].map(([lbl, fn, dis], i) => (
//                         <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 6px", fontSize: 11, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//     <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 30 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
//         {isEdit && (
//             <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: `1px solid ${accent}22` }}>
//                 <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
//                     isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//             </div>
//         )}
//         {children}
//     </div>
// ));

// const AddBtn = ({ onClick, accent }) => (
//     <button onClick={onClick} style={{ fontSize: 12, color: accent, background: "#fff", border: `1px dashed ${accent}`, borderRadius: 4, padding: "6px 12px", cursor: "pointer", marginTop: 8, width: "100%" }}>+ Thêm</button>
// );

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function ProfessionalCV({
//     data, onChange, isEdit,
//     accent = "#8B1A1A",
//     styleConfig = {},
//     sectionOrder = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"],
//     setSectionOrder,
//     sectionTitles = {},
//     setSectionTitles,
//     useSampleData = false,
// }) {
//     const shouldUseSample = useMemo(() => {
//         if (useSampleData) return true;
//         if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
//         return false;
//     }, [useSampleData, isEdit, data]);

//     const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
//     const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
//     const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
//     const isUserEditing = useRef(false);

//     useEffect(() => {
//         if (isUserEditing.current) return;
//         if (shouldUseSample) return;
//         setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
//     }, [data, sectionOrder, sectionTitles, shouldUseSample]);

//     const pi = localData.personalInfo || {};

//     const upd = useCallback((section, val) => {
//         isUserEditing.current = true;
//         setLocalData(d => ({ ...d, [section]: val }));
//         onChange(section, val);
//         setTimeout(() => { isUserEditing.current = false; }, 0);
//     }, [onChange]);

//     const updPi = useCallback((key, val) => {
//         isUserEditing.current = true;
//         setLocalData(d => { const np = { ...(d.personalInfo || {}), [key]: val }; onChange("personalInfo", np); return { ...d, personalInfo: np }; });
//         setTimeout(() => { isUserEditing.current = false; }, 0);
//     }, [onChange]);

//     const updArr = useCallback((section, idx, key, val) => {
//         isUserEditing.current = true;
//         setLocalData(d => { const arr = [...(d[section] || [])]; arr[idx] = { ...arr[idx], [key]: val }; onChange(section, arr); return { ...d, [section]: arr }; });
//         setTimeout(() => { isUserEditing.current = false; }, 0);
//     }, [onChange]);

//     const addItem = useCallback((section, empty) => {
//         setLocalData(d => { const arr = [...(d[section] || []), { ...empty }]; onChange(section, arr); return { ...d, [section]: arr }; });
//     }, [onChange]);

//     const delItem = useCallback((section, idx) => {
//         setLocalData(d => { const arr = (d[section] || []).filter((_, i) => i !== idx); onChange(section, arr); return { ...d, [section]: arr }; });
//     }, [onChange]);

//     const moveItem = useCallback((section, idx, dir) => {
//         setLocalData(d => {
//             const arr = [...(d[section] || [])]; const ni = idx + dir;
//             if (ni < 0 || ni >= arr.length) return d;
//             [arr[idx], arr[ni]] = [arr[ni], arr[idx]]; onChange(section, arr); return { ...d, [section]: arr };
//         });
//     }, [onChange]);

//     const moveSection = useCallback((idx, dir) => {
//         const ni = idx + dir; if (ni < 0 || ni >= localOrder.length) return;
//         const arr = [...localOrder];[arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//         setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//     }, [localOrder, setSectionOrder]);

//     const deleteSection = useCallback((idx) => {
//         const arr = localOrder.filter((_, i) => i !== idx);
//         setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//     }, [localOrder, setSectionOrder]);

//     const updateTitle = useCallback((key, title) => {
//         const nt = { ...localTitles, [key]: title };
//         setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//     }, [localTitles, setSectionTitles]);

//     const DEFAULTS = { summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc", education: "Học vấn", skills: "Kỹ năng", certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa" };
//     const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//     const renderSection = useCallback((type, index) => {
//         const secProps = { isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections: localOrder.length };
//         const itemProps = { isEdit, accent, moveItem, delItem };

//         switch (type) {
//             case "summary":
//                 return (!isEdit && !hasContent(localData.summary)) ? null : (
//                     <div key={type} style={{ marginBottom: 20, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {isEdit
//                             ? <DI multiline value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Mô tả kinh nghiệm và chuyên môn..." />
//                             : <p style={{ color: "#444", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{localData.summary}</p>}
//                     </div>
//                 );

//             case "experiences":
//                 return (!isEdit && !hasContent(localData.experiences)) ? null : (
//                     <div key={type} style={{ marginBottom: 20, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.experiences || []).map((exp, idx) => (
//                             <div key={idx} style={{ position: "relative", paddingLeft: 16, borderLeft: `3px solid ${accent}22`, marginBottom: 16, paddingRight: isEdit ? 80 : 0, paddingTop: isEdit ? 30 : 0, boxSizing: "border-box" }}>
//                                 {isEdit && <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//                                     <ItemControls onUp={() => moveItem("experiences", idx, -1)} onDown={() => moveItem("experiences", idx, 1)} onDelete={() => delItem("experiences", idx)} isFirst={idx === 0} isLast={idx === (localData.experiences || []).length - 1} accent={accent} /></div>}
//                                 <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
//                                     <EF value={exp.position} onChange={v => updArr("experiences", idx, "position", v)} placeholder="Vị trí công việc" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 14, flex: 1 }} />
//                                     <EF value={exp.duration} onChange={v => updArr("experiences", idx, "duration", v)} placeholder="Thời gian" isEdit={isEdit} style={{ fontSize: 11, color: "#888", minWidth: 100 }} />
//                                 </div>
//                                 <EF value={exp.company} onChange={v => updArr("experiences", idx, "company", v)} placeholder="Tên công ty" isEdit={isEdit} style={{ fontSize: 13, color: accent, marginTop: 2 }} />
//                                 <EF value={exp.description} onChange={v => updArr("experiences", idx, "description", v)} placeholder="Mô tả công việc..." multiline richText={true} isEdit={isEdit} style={{ marginTop: 4, fontSize: 13 }} />
//                             </div>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "education":
//                 return (!isEdit && !hasContent(localData.education)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.education || []).map((edu, idx) => (
//                             <ItemRow key={idx} section="education" idx={idx} total={(localData.education || []).length} {...itemProps}>
//                                 <EF value={edu.degree} onChange={v => updArr("education", idx, "degree", v)} placeholder="Bằng cấp" isEdit={isEdit} style={{ fontWeight: "bold" }} />
//                                 <EF value={edu.institution} onChange={v => updArr("education", idx, "institution", v)} placeholder="Tên trường" isEdit={isEdit} style={{ fontSize: 13, color: "#666", marginTop: 2 }} />
//                                 <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
//                                     <EF value={edu.year} onChange={v => updArr("education", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 80 }} />
//                                     <EF value={edu.gpa} onChange={v => updArr("education", idx, "gpa", v)} placeholder="GPA" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 60 }} />
//                                 </div>
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "skills":
//                 return (!isEdit && !hasContent(localData.skills)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.skills || []).map((sk, idx) => (
//                             <ItemRow key={idx} section="skills" idx={idx} total={(localData.skills || []).length} {...itemProps}>
//                                 <EF value={sk.category} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 13 }} />
//                                 <EF value={sk.items} onChange={v => updArr("skills", idx, "items", v)} placeholder="Các kỹ năng..." isEdit={isEdit} style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("skills", { category: "", items: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "certifications":
//                 return (!isEdit && !hasContent(localData.certifications)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.certifications || []).map((cert, idx) => (
//                             <ItemRow key={idx} section="certifications" idx={idx} total={(localData.certifications || []).length} {...itemProps}>
//                                 <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
//                                     <EF value={cert.name} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit} style={{ fontWeight: "bold", flex: 1 }} />
//                                     <EF value={cert.year} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 11, color: "#888", width: 50, flexShrink: 0 }} />
//                                 </div>
//                                 <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
//                                     <EF value={cert.issuer} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Cấp bởi" isEdit={isEdit} style={{ fontSize: 12, color: "#666", flex: 1 }} />
//                                     <EF value={cert.score} onChange={v => updArr("certifications", idx, "score", v)} placeholder="Điểm" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 60 }} />
//                                 </div>
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "awards":
//                 return (!isEdit && !hasContent(localData.awards)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.awards || []).map((aw, idx) => (
//                             <ItemRow key={idx} section="awards" idx={idx} total={(localData.awards || []).length} {...itemProps}>
//                                 <div style={{ display: "flex", gap: 8 }}>
//                                     <EF value={aw.title} onChange={v => updArr("awards", idx, "title", v)} placeholder="Tên giải thưởng" isEdit={isEdit} style={{ fontWeight: "bold", flex: 1 }} />
//                                     <EF value={aw.year} onChange={v => updArr("awards", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 11, color: "#888", width: 50 }} />
//                                 </div>
//                                 <EF value={aw.issuer} onChange={v => updArr("awards", idx, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
//                                 <EF value={aw.description} onChange={v => updArr("awards", idx, "description", v)} placeholder="Mô tả..." richText={true} isEdit={isEdit} style={{ fontSize: 12, color: "#777", marginTop: 2 }} />
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "activities":
//                 return (!isEdit && !hasContent(localData.activities)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.activities || []).map((act, idx) => (
//                             <ItemRow key={idx} section="activities" idx={idx} total={(localData.activities || []).length} {...itemProps}>
//                                 <div style={{ display: "flex", gap: 8 }}>
//                                     <EF value={act.role} onChange={v => updArr("activities", idx, "role", v)} placeholder="Vai trò" isEdit={isEdit} style={{ fontWeight: "bold", flex: 1 }} />
//                                     <EF value={act.duration} onChange={v => updArr("activities", idx, "duration", v)} placeholder="Thời gian" isEdit={isEdit} style={{ fontSize: 11, color: "#888", width: 90 }} />
//                                 </div>
//                                 <EF value={act.organization} onChange={v => updArr("activities", idx, "organization", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
//                                 <EF value={act.description} onChange={v => updArr("activities", idx, "description", v)} placeholder="Mô tả..." multiline richText={true} isEdit={isEdit} style={{ marginTop: 4, fontSize: 12 }} />
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} accent={accent} />}
//                     </div>
//                 );

//             default: return null;
//         }
//     }, [localData, isEdit, accent, updArr, addItem, delItem, moveItem, moveSection, deleteSection, getTitle, updateTitle, localOrder.length, upd]);

//     const fullWidth = localOrder.filter(s => ["summary", "experiences"].includes(s));
//     const leftSections = localOrder.filter(s => ["education", "skills"].includes(s));
//     const rightSections = localOrder.filter(s => ["certifications", "awards", "activities"].includes(s));

//     return (
//         <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Lato', sans-serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, boxSizing: "border-box", margin: "0 auto" }}>
//             <div style={{ height: 8, background: accent }} />
//             <div style={{ padding: "24px 40px 16px", borderBottom: `2px solid ${accent}`, boxSizing: "border-box" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                         <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//                             style={{ fontSize: 28, fontWeight: "bold", color: accent, marginBottom: 6, fontFamily: "'Playfair Display', serif", border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", background: "transparent", padding: "0" }} />
//                         <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh"
//                             style={{ fontSize: 14, color: "#666", maxWidth: 300, border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", background: "transparent", padding: "0" }} />
//                     </div>
//                     <div style={{ textAlign: "right", fontSize: 12, lineHeight: 1.8, color: "#555", flexShrink: 0 }}>
//                         {[["email", "Email"], ["phone", "Phone"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
//                             <div key={key}>
//                                 {isEdit
//                                     ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph}
//                                         style={{ fontSize: 12, color: "#555", textAlign: "right", width: 180, border: "none", borderBottom: "1px dashed #ccc", background: "transparent", padding: "0 0 2px 0" }} />
//                                     : pi[key] ? <span>{pi[key]}</span> : null}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div style={{ padding: "24px 40px", boxSizing: "border-box" }}>
//                 {fullWidth.map(s => renderSection(s, localOrder.indexOf(s)))}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
//                     <div>{leftSections.map(s => renderSection(s, localOrder.indexOf(s)))}</div>
//                     <div>{rightSections.map(s => renderSection(s, localOrder.indexOf(s)))}</div>
//                 </div>
//             </div>
//             <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//         </div>
//     );
// }


// import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
// import ItemControls from "../common/ItemControls/ItemControls";
// import RichTextField from "../common/EditField/RichTextField";
// import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";

// const SAMPLE_DATA = {
//     personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Chuyên viên Marketing / Product Manager", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
//     summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả. Tìm kiếm cơ hội phát triển trong môi trường chuyên nghiệp, năng động.",
//     experiences: [
//         { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể cho công ty\n• Quản lý ngân sách marketing 2 tỷ đồng/năm, tối ưu ROI đạt 150%\n• Dẫn dắt team 5 người thực hiện các chiến dịch digital marketing" },
//         { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo trên Facebook Ads và Google Ads\n• Phân tích dữ liệu khách hàng và đề xuất chiến lược tối ưu" }
//     ],
//     education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
//     skills: [
//         { category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads, Content Marketing" },
//         { category: "Thiết kế", items: "Photoshop, Illustrator, Figma, Canva" },
//         { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio, SQL cơ bản" },
//         { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }
//     ],
//     awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc trong việc triển khai chiến dịch marketing Q4/2023" }],
//     certifications: [
//         { name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" },
//         { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" },
//         { name: "IELTS Academic", issuer: "British Council", year: "2021", score: "7.5" }
//     ],
//     activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên sản xuất nội dung cho fanpage CLB\n• Tổ chức các sự kiện workshop về Marketing với quy mô 200+ người tham dự" }]
// };

// const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"];
// const SAMPLE_SECTION_TITLES = { summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc", education: "Học vấn", skills: "Kỹ năng", certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa" };

// const hasContent = (v) => {
//     if (!v) return false;
//     if (typeof v === "string") return v.trim() !== "";
//     if (Array.isArray(v)) return v.some(hasContent);
//     if (typeof v === "object") return Object.values(v).some(hasContent);
//     return false;
// };

// // ─── Stable inputs (defined OUTSIDE) ─────────────────────────────────────────
// const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
//     const [local, setLocal] = useState(value);
//     const t = useRef(null);
//     const onChangeRef = useRef(onChange);
//     const inputRef = useRef(null);

//     useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
//     useEffect(() => { if (value !== local && document.activeElement !== inputRef.current) setLocal(value); }, [value]);

//     const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
//     const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

//     const base = { width: "100%", background: "transparent", outline: "none", fontFamily: "inherit", ...style };
//     if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//         style={{ ...base, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px 10px", fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }} />;
//     return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
//         style={{ ...base, border: "none", borderBottom: "1px dashed #ccc", padding: "0 0 2px 0" }} />;
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

// // ─── SectionHeader (defined OUTSIDE to prevent remounting) ────────────────────
// const SectionHeader = memo(({ sectionKey, index, isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections }) => {
//     const [local, setLocal] = useState(() => getTitle(sectionKey));
//     const t = useRef(null);
//     const inputRef = useRef(null);

//     useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, getTitle]);

//     return (
//         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, borderBottom: `1px solid ${accent}22`, paddingBottom: 6, minHeight: 32 }}>
//             <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
//             <div style={{ flex: 1, minWidth: 0 }}>
//                 {isEdit ? (
//                     <input ref={inputRef} value={local}
//                         onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
//                         onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
//                         style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent, background: "transparent", border: "none", borderBottom: "1px dashed #ccc", width: "100%", outline: "none", padding: "2px 0", fontFamily: "inherit" }} />
//                 ) : (
//                     <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>{getTitle(sectionKey)}</div>
//                 )}
//             </div>
//             {isEdit && (
//                 <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
//                     {[["↑", () => moveSection(index, -1), index === 0], ["↓", () => moveSection(index, 1), index === totalSections - 1], ["×", () => deleteSection(index), false]].map(([lbl, fn, dis], i) => (
//                         <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 6px", fontSize: 11, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// });

// // ─── ItemRow (defined OUTSIDE) ────────────────────────────────────────────────
// const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
//     <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 30 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
//         {isEdit && (
//             <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: `1px solid ${accent}22` }}>
//                 <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
//                     isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
//             </div>
//         )}
//         {children}
//     </div>
// ));

// const AddBtn = ({ onClick, accent }) => (
//     <button onClick={onClick} style={{ fontSize: 12, color: accent, background: "#fff", border: `1px dashed ${accent}`, borderRadius: 4, padding: "6px 12px", cursor: "pointer", marginTop: 8, width: "100%" }}>+ Thêm</button>
// );

// // ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
// export default function ProfessionalCV({
//     data, onChange, isEdit,
//     accent = "#8B1A1A",
//     styleConfig = {},
//     sectionOrder = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"],
//     setSectionOrder,
//     sectionTitles = {},
//     setSectionTitles,
//     useSampleData = false,
// }) {
//     const shouldUseSample = useMemo(() => {
//         if (useSampleData) return true;
//         if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) return true;
//         return false;
//     }, [useSampleData, isEdit, data]);

//     const [localData, setLocalData] = useState(() => shouldUseSample ? SAMPLE_DATA : (data || {}));
//     const [localOrder, setLocalOrder] = useState(() => shouldUseSample ? SAMPLE_SECTION_ORDER : sectionOrder);
//     const [localTitles, setLocalTitles] = useState(() => shouldUseSample ? SAMPLE_SECTION_TITLES : sectionTitles);
//     const isUserEditing = useRef(false);

//     useEffect(() => {
//         if (isUserEditing.current) return;
//         if (shouldUseSample) return;
//         setLocalData(data || {}); setLocalOrder(sectionOrder); setLocalTitles(sectionTitles);
//     }, [data, sectionOrder, sectionTitles, shouldUseSample]);

//     const pi = localData.personalInfo || {};

//     const upd = useCallback((section, val) => {
//         isUserEditing.current = true;
//         setLocalData(d => ({ ...d, [section]: val }));
//         onChange(section, val);
//         setTimeout(() => { isUserEditing.current = false; }, 0);
//     }, [onChange]);

//     const updPi = useCallback((key, val) => {
//         isUserEditing.current = true;
//         setLocalData(d => { const np = { ...(d.personalInfo || {}), [key]: val }; onChange("personalInfo", np); return { ...d, personalInfo: np }; });
//         setTimeout(() => { isUserEditing.current = false; }, 0);
//     }, [onChange]);

//     const updArr = useCallback((section, idx, key, val) => {
//         isUserEditing.current = true;
//         setLocalData(d => { const arr = [...(d[section] || [])]; arr[idx] = { ...arr[idx], [key]: val }; onChange(section, arr); return { ...d, [section]: arr }; });
//         setTimeout(() => { isUserEditing.current = false; }, 0);
//     }, [onChange]);

//     const addItem = useCallback((section, empty) => {
//         setLocalData(d => { const arr = [...(d[section] || []), { ...empty }]; onChange(section, arr); return { ...d, [section]: arr }; });
//     }, [onChange]);

//     const delItem = useCallback((section, idx) => {
//         setLocalData(d => { const arr = (d[section] || []).filter((_, i) => i !== idx); onChange(section, arr); return { ...d, [section]: arr }; });
//     }, [onChange]);

//     const moveItem = useCallback((section, idx, dir) => {
//         setLocalData(d => {
//             const arr = [...(d[section] || [])]; const ni = idx + dir;
//             if (ni < 0 || ni >= arr.length) return d;
//             [arr[idx], arr[ni]] = [arr[ni], arr[idx]]; onChange(section, arr); return { ...d, [section]: arr };
//         });
//     }, [onChange]);

//     const moveSection = useCallback((idx, dir) => {
//         const ni = idx + dir; if (ni < 0 || ni >= localOrder.length) return;
//         const arr = [...localOrder];[arr[idx], arr[ni]] = [arr[ni], arr[idx]];
//         setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//     }, [localOrder, setSectionOrder]);

//     const deleteSection = useCallback((idx) => {
//         const arr = localOrder.filter((_, i) => i !== idx);
//         setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
//     }, [localOrder, setSectionOrder]);

//     const updateTitle = useCallback((key, title) => {
//         const nt = { ...localTitles, [key]: title };
//         setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
//     }, [localTitles, setSectionTitles]);

//     const DEFAULTS = { summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc", education: "Học vấn", skills: "Kỹ năng", certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa" };
//     const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

//     const renderSection = useCallback((type, index) => {
//         const secProps = { isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections: localOrder.length };
//         const itemProps = { isEdit, accent, moveItem, delItem };

//         switch (type) {
//             case "summary":
//                 return (!isEdit && !hasContent(localData.summary)) ? null : (
//                     <div key={type} style={{ marginBottom: 20, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {isEdit
//                             ? <DI multiline value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Mô tả kinh nghiệm và chuyên môn..." />
//                             : <p style={{ color: "#444", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{localData.summary}</p>}
//                     </div>
//                 );

//             case "experiences":
//                 return (!isEdit && !hasContent(localData.experiences)) ? null : (
//                     <div key={type} style={{ marginBottom: 20, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.experiences || []).map((exp, idx) => (
//                             <div key={idx} style={{ position: "relative", paddingLeft: 16, borderLeft: `3px solid ${accent}22`, marginBottom: 16, paddingRight: isEdit ? 80 : 0, paddingTop: isEdit ? 30 : 0, boxSizing: "border-box" }}>
//                                 {isEdit && <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
//                                     <ItemControls onUp={() => moveItem("experiences", idx, -1)} onDown={() => moveItem("experiences", idx, 1)} onDelete={() => delItem("experiences", idx)} isFirst={idx === 0} isLast={idx === (localData.experiences || []).length - 1} accent={accent} /></div>}
//                                 <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
//                                     <EF value={exp.position} onChange={v => updArr("experiences", idx, "position", v)} placeholder="Vị trí công việc" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 14, flex: 1 }} />
//                                     <EF value={exp.duration} onChange={v => updArr("experiences", idx, "duration", v)} placeholder="Thời gian" isEdit={isEdit} style={{ fontSize: 11, color: "#888", minWidth: 100 }} />
//                                 </div>
//                                 <EF value={exp.company} onChange={v => updArr("experiences", idx, "company", v)} placeholder="Tên công ty" isEdit={isEdit} style={{ fontSize: 13, color: accent, marginTop: 2 }} />
//                                 <EF value={exp.description} onChange={v => updArr("experiences", idx, "description", v)} placeholder="Mô tả công việc..." multiline richText={true} isEdit={isEdit} style={{ marginTop: 4, fontSize: 13 }} />
//                             </div>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "education":
//                 return (!isEdit && !hasContent(localData.education)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.education || []).map((edu, idx) => (
//                             <ItemRow key={idx} section="education" idx={idx} total={(localData.education || []).length} {...itemProps}>
//                                 <EF value={edu.degree} onChange={v => updArr("education", idx, "degree", v)} placeholder="Bằng cấp" isEdit={isEdit} style={{ fontWeight: "bold" }} />
//                                 <EF value={edu.institution} onChange={v => updArr("education", idx, "institution", v)} placeholder="Tên trường" isEdit={isEdit} style={{ fontSize: 13, color: "#666", marginTop: 2 }} />
//                                 <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
//                                     <EF value={edu.year} onChange={v => updArr("education", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 80 }} />
//                                     <EF value={edu.gpa} onChange={v => updArr("education", idx, "gpa", v)} placeholder="GPA" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 60 }} />
//                                 </div>
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "skills":
//                 return (!isEdit && !hasContent(localData.skills)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.skills || []).map((sk, idx) => (
//                             <ItemRow key={idx} section="skills" idx={idx} total={(localData.skills || []).length} {...itemProps}>
//                                 <EF value={sk.category} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng" isEdit={isEdit} style={{ fontWeight: "bold", fontSize: 13 }} />
//                                 <EF value={sk.items} onChange={v => updArr("skills", idx, "items", v)} placeholder="Các kỹ năng..." isEdit={isEdit} style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("skills", { category: "", items: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "certifications":
//                 return (!isEdit && !hasContent(localData.certifications)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.certifications || []).map((cert, idx) => (
//                             <ItemRow key={idx} section="certifications" idx={idx} total={(localData.certifications || []).length} {...itemProps}>
//                                 <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
//                                     <EF value={cert.name} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit} style={{ fontWeight: "bold", flex: 1 }} />
//                                     <EF value={cert.year} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 11, color: "#888", width: 50, flexShrink: 0 }} />
//                                 </div>
//                                 <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
//                                     <EF value={cert.issuer} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Cấp bởi" isEdit={isEdit} style={{ fontSize: 12, color: "#666", flex: 1 }} />
//                                     <EF value={cert.score} onChange={v => updArr("certifications", idx, "score", v)} placeholder="Điểm" isEdit={isEdit} style={{ fontSize: 12, color: "#888", width: 60 }} />
//                                 </div>
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "awards":
//                 return (!isEdit && !hasContent(localData.awards)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.awards || []).map((aw, idx) => (
//                             <ItemRow key={idx} section="awards" idx={idx} total={(localData.awards || []).length} {...itemProps}>
//                                 <div style={{ display: "flex", gap: 8 }}>
//                                     <EF value={aw.title} onChange={v => updArr("awards", idx, "title", v)} placeholder="Tên giải thưởng" isEdit={isEdit} style={{ fontWeight: "bold", flex: 1 }} />
//                                     <EF value={aw.year} onChange={v => updArr("awards", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 11, color: "#888", width: 50 }} />
//                                 </div>
//                                 <EF value={aw.issuer} onChange={v => updArr("awards", idx, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
//                                 <EF value={aw.description} onChange={v => updArr("awards", idx, "description", v)} placeholder="Mô tả..." richText={true} isEdit={isEdit} style={{ fontSize: 12, color: "#777", marginTop: 2 }} />
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} accent={accent} />}
//                     </div>
//                 );

//             case "activities":
//                 return (!isEdit && !hasContent(localData.activities)) ? null : (
//                     <div key={type} style={{ marginBottom: 16, width: "100%" }}>
//                         <SectionHeader sectionKey={type} index={index} {...secProps} />
//                         {(localData.activities || []).map((act, idx) => (
//                             <ItemRow key={idx} section="activities" idx={idx} total={(localData.activities || []).length} {...itemProps}>
//                                 <div style={{ display: "flex", gap: 8 }}>
//                                     <EF value={act.role} onChange={v => updArr("activities", idx, "role", v)} placeholder="Vai trò" isEdit={isEdit} style={{ fontWeight: "bold", flex: 1 }} />
//                                     <EF value={act.duration} onChange={v => updArr("activities", idx, "duration", v)} placeholder="Thời gian" isEdit={isEdit} style={{ fontSize: 11, color: "#888", width: 90 }} />
//                                 </div>
//                                 <EF value={act.organization} onChange={v => updArr("activities", idx, "organization", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
//                                 <EF value={act.description} onChange={v => updArr("activities", idx, "description", v)} placeholder="Mô tả..." multiline richText={true} isEdit={isEdit} style={{ marginTop: 4, fontSize: 12 }} />
//                             </ItemRow>
//                         ))}
//                         {isEdit && <AddBtn onClick={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} accent={accent} />}
//                     </div>
//                 );

//             default: return null;
//         }
//     }, [localData, isEdit, accent, updArr, addItem, delItem, moveItem, moveSection, deleteSection, getTitle, updateTitle, localOrder.length, upd]);

//     const fullWidth = localOrder.filter(s => ["summary", "experiences"].includes(s));
//     const leftSections = localOrder.filter(s => ["education", "skills"].includes(s));
//     const rightSections = localOrder.filter(s => ["certifications", "awards", "activities"].includes(s));

//     return (
//         <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Lato', sans-serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, boxSizing: "border-box", margin: "0 auto" }}>
//             <div style={{ height: 8, background: accent }} />
//             <div style={{ padding: "24px 40px 16px", borderBottom: `2px solid ${accent}`, boxSizing: "border-box" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                         <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
//                             style={{ fontSize: 28, fontWeight: "bold", color: accent, marginBottom: 6, fontFamily: "'Playfair Display', serif", border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", background: "transparent", padding: "0" }} />
//                         <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh"
//                             style={{ fontSize: 14, color: "#666", maxWidth: 300, border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", background: "transparent", padding: "0" }} />
//                     </div>
//                     <div style={{ textAlign: "right", fontSize: 12, lineHeight: 1.8, color: "#555", flexShrink: 0 }}>
//                         {[["email", "Email"], ["phone", "Phone"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
//                             <div key={key}>
//                                 {isEdit
//                                     ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph}
//                                         style={{ fontSize: 12, color: "#555", textAlign: "right", width: 180, border: "none", borderBottom: "1px dashed #ccc", background: "transparent", padding: "0 0 2px 0" }} />
//                                     : pi[key] ? <span>{pi[key]}</span> : null}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div style={{ padding: "24px 40px", boxSizing: "border-box" }}>
//                 {fullWidth.map(s => renderSection(s, localOrder.indexOf(s)))}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
//                     <div>{leftSections.map(s => renderSection(s, localOrder.indexOf(s)))}</div>
//                     <div>{rightSections.map(s => renderSection(s, localOrder.indexOf(s)))}</div>
//                 </div>
//             </div>
//             <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
//         </div>
//     );
// }


import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "../common/ItemControls/ItemControls";
import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";

const SAMPLE_DATA = {
    personalInfo: { fullName: "NGUYỄN VĂN A", portfolio: "Chuyên viên Marketing / Product Manager", email: "nguyenvana@email.com", phone: "0912 345 678", address: "Quận 1, TP. Hồ Chí Minh", linkedin: "linkedin.com/in/nguyenvana" },
    summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả. Tìm kiếm cơ hội phát triển trong môi trường chuyên nghiệp, năng động.",
    experiences: [
        { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể cho công ty\n• Quản lý ngân sách marketing 2 tỷ đồng/năm, tối ưu ROI đạt 150%\n• Dẫn dắt team 5 người thực hiện các chiến dịch digital marketing" },
        { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo trên Facebook Ads và Google Ads\n• Phân tích dữ liệu khách hàng và đề xuất chiến lược tối ưu" }
    ],
    education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
    skills: [
        { category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads, Content Marketing" },
        { category: "Thiết kế", items: "Photoshop, Illustrator, Figma, Canva" },
        { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio, SQL cơ bản" },
        { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }
    ],
    awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc trong việc triển khai chiến dịch marketing Q4/2023" }],
    certifications: [
        { name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" },
        { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" },
        { name: "IELTS Academic", issuer: "British Council", year: "2021", score: "7.5" }
    ],
    activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên sản xuất nội dung cho fanpage CLB\n• Tổ chức các sự kiện workshop về Marketing với quy mô 200+ người tham dự" }]
};

const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"];
const SAMPLE_SECTION_TITLES = { summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc", education: "Học vấn", skills: "Kỹ năng", certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa" };

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
        if (sel.rangeCount > 0) sel.getRangeAt(0).cloneRange();
    }, []);

    const handleFocus = useCallback(() => {
        if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
    }, [onStyleChange, styleConfig]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            const active = document.activeElement;
            const inToolbar = active?.closest(".selection-toolbar");
            const inEditor = active === ref.current || ref.current?.contains(active);
            if (!inToolbar && !inEditor) clearActiveField();
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

// ─── DI: debounced input cho header ──────────────────────────────────────────
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

// ─── EF: Editable Field ───────────────────────────────────────────────────────
const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit, richText = false, styleConfig = {}, onStyleChange, textColor }) => {
    if (!isEdit) {
        if (isHTML(value)) return <div dangerouslySetInnerHTML={{ __html: value }} style={{ color: textColor, whiteSpace: "pre-wrap", ...style }} />;
        if (!value) return null;
        return multiline
            ? <div style={{ color: textColor, whiteSpace: "pre-line", ...style }}>{value}</div>
            : <span style={{ color: textColor, ...style }}>{value}</span>;
    }
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
        if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
    }, [onStyleChange, styleConfig]);

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
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ outline: "none", fontFamily: styleConfig?.fontFamily || "inherit", flex: 1, width: "100%", ...style }}
        />
    );
});

// ─── SectionHeader ────────────────────────────────────────────────────────────
const SectionHeader = memo(({ sectionKey, index, isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections, styleConfig, onStyleChange }) => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, borderBottom: `1px solid ${accent}22`, paddingBottom: 6, minHeight: 32 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                {isEdit ? (
                    <TitleEdit
                        value={getTitle(sectionKey)}
                        onChange={v => updateTitle(sectionKey, v)}
                        style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent, padding: "2px 0" }}
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                    />
                ) : (
                    <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>
                        {isHTML(getTitle(sectionKey))
                            ? <span dangerouslySetInnerHTML={{ __html: getTitle(sectionKey) }} />
                            : getTitle(sectionKey)}
                    </div>
                )}
            </div>
            {isEdit && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {[["↑", () => moveSection(index, -1), index === 0], ["↓", () => moveSection(index, 1), index === totalSections - 1], ["×", () => deleteSection(index), false]].map(([lbl, fn, dis], i) => (
                        <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 6px", fontSize: 11, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
                    ))}
                </div>
            )}
        </div>
    );
});

// ─── ItemRow ─────────────────────────────────────────────────────────────────
const ItemRow = memo(({ section, idx, total, isEdit, accent, moveItem, delItem, children }) => (
    <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 30 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
        {isEdit && (
            <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: `1px solid ${accent}22` }}>
                <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
                    isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
            </div>
        )}
        {children}
    </div>
));

const AddBtn = ({ onClick, accent }) => (
    <button onClick={onClick} style={{ fontSize: 12, color: accent, background: "#fff", border: `1px dashed ${accent}`, borderRadius: 4, padding: "6px 12px", cursor: "pointer", marginTop: 8, width: "100%" }}>+ Thêm</button>
);

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function ProfessionalCV({
    data, onChange, isEdit,
    accent = "#8B1A1A",
    styleConfig = {},
    onStyleChange,
    sectionOrder = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"],
    setSectionOrder,
    sectionTitles = {},
    setSectionTitles,
    useSampleData = false,
    forceReset,
}) {
    const textColor = styleConfig.textColor || "#222";

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

    const DEFAULTS = { summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc", education: "Học vấn", skills: "Kỹ năng", certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa" };
    const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

    const renderSection = useCallback((type, index) => {
        const secProps = { isEdit, accent, getTitle, updateTitle, moveSection, deleteSection, totalSections: localOrder.length, styleConfig, onStyleChange };
        const itemProps = { isEdit, accent, moveItem, delItem };

        switch (type) {
            case "summary":
                return (!isEdit && !hasContent(localData.summary)) ? null : (
                    <div key={type} style={{ marginBottom: 20, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        <EF value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Mô tả kinh nghiệm và chuyên môn..." multiline richText isEdit={isEdit} textColor={textColor} style={{ fontSize: 13, lineHeight: 1.7 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                );

            case "experiences":
                return (!isEdit && !hasContent(localData.experiences)) ? null : (
                    <div key={type} style={{ marginBottom: 20, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        {(localData.experiences || []).map((exp, idx) => (
                            <div key={idx} style={{ position: "relative", paddingLeft: 16, borderLeft: `3px solid ${accent}22`, marginBottom: 16, paddingRight: isEdit ? 80 : 0, paddingTop: isEdit ? 30 : 0, boxSizing: "border-box" }}>
                                {isEdit && <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                                    <ItemControls onUp={() => moveItem("experiences", idx, -1)} onDown={() => moveItem("experiences", idx, 1)} onDelete={() => delItem("experiences", idx)} isFirst={idx === 0} isLast={idx === (localData.experiences || []).length - 1} accent={accent} /></div>}
                                <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                                    <EF value={exp.position} onChange={v => updArr("experiences", idx, "position", v)} placeholder="Vị trí công việc" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontSize: 14, flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    <EF value={exp.duration} onChange={v => updArr("experiences", idx, "duration", v)} placeholder="Thời gian" isEdit={isEdit} textColor={textColor} style={{ fontSize: 11, color: "#888", minWidth: 100 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                </div>
                                <EF value={exp.company} onChange={v => updArr("experiences", idx, "company", v)} placeholder="Tên công ty" isEdit={isEdit} textColor={textColor} style={{ fontSize: 13, color: accent, marginTop: 2 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                <EF value={exp.description} onChange={v => updArr("experiences", idx, "description", v)} placeholder="Mô tả công việc..." multiline richText isEdit={isEdit} textColor={textColor} style={{ marginTop: 4, fontSize: 13 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                            </div>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} accent={accent} />}
                    </div>
                );

            case "education":
                return (!isEdit && !hasContent(localData.education)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        {(localData.education || []).map((edu, idx) => (
                            <ItemRow key={idx} section="education" idx={idx} total={(localData.education || []).length} {...itemProps}>
                                <EF value={edu.degree} onChange={v => updArr("education", idx, "degree", v)} placeholder="Bằng cấp" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                <EF value={edu.institution} onChange={v => updArr("education", idx, "institution", v)} placeholder="Tên trường" isEdit={isEdit} textColor={textColor} style={{ fontSize: 13, color: "#666", marginTop: 2 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                                    <EF value={edu.year} onChange={v => updArr("education", idx, "year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#888", width: 80 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    <EF value={edu.gpa} onChange={v => updArr("education", idx, "gpa", v)} placeholder="GPA" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#888", width: 60 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                </div>
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} accent={accent} />}
                    </div>
                );

            case "skills":
                return (!isEdit && !hasContent(localData.skills)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        {(localData.skills || []).map((sk, idx) => (
                            <ItemRow key={idx} section="skills" idx={idx} total={(localData.skills || []).length} {...itemProps}>
                                <EF value={sk.category} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontSize: 13 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                <EF value={sk.items} onChange={v => updArr("skills", idx, "items", v)} placeholder="Các kỹ năng..." isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#666", marginTop: 2 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("skills", { category: "", items: "" })} accent={accent} />}
                    </div>
                );

            case "certifications":
                return (!isEdit && !hasContent(localData.certifications)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        {(localData.certifications || []).map((cert, idx) => (
                            <ItemRow key={idx} section="certifications" idx={idx} total={(localData.certifications || []).length} {...itemProps}>
                                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <EF value={cert.name} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    <EF value={cert.year} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ fontSize: 11, color: "#888", width: 50, flexShrink: 0 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                                    <EF value={cert.issuer} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Cấp bởi" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#666", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    <EF value={cert.score} onChange={v => updArr("certifications", idx, "score", v)} placeholder="Điểm" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#888", width: 60 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                </div>
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} accent={accent} />}
                    </div>
                );

            case "awards":
                return (!isEdit && !hasContent(localData.awards)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        {(localData.awards || []).map((aw, idx) => (
                            <ItemRow key={idx} section="awards" idx={idx} total={(localData.awards || []).length} {...itemProps}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <EF value={aw.title} onChange={v => updArr("awards", idx, "title", v)} placeholder="Tên giải thưởng" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    <EF value={aw.year} onChange={v => updArr("awards", idx, "year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ fontSize: 11, color: "#888", width: 50 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                </div>
                                <EF value={aw.issuer} onChange={v => updArr("awards", idx, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#666", marginTop: 2 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                <EF value={aw.description} onChange={v => updArr("awards", idx, "description", v)} placeholder="Mô tả..." richText isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#777", marginTop: 2 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} accent={accent} />}
                    </div>
                );

            case "activities":
                return (!isEdit && !hasContent(localData.activities)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} {...secProps} />
                        {(localData.activities || []).map((act, idx) => (
                            <ItemRow key={idx} section="activities" idx={idx} total={(localData.activities || []).length} {...itemProps}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <EF value={act.role} onChange={v => updArr("activities", idx, "role", v)} placeholder="Vai trò" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    <EF value={act.duration} onChange={v => updArr("activities", idx, "duration", v)} placeholder="Thời gian" isEdit={isEdit} textColor={textColor} style={{ fontSize: 11, color: "#888", width: 90 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                </div>
                                <EF value={act.organization} onChange={v => updArr("activities", idx, "organization", v)} placeholder="Tổ chức" isEdit={isEdit} textColor={textColor} style={{ fontSize: 12, color: "#666", marginTop: 2 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                <EF value={act.description} onChange={v => updArr("activities", idx, "description", v)} placeholder="Mô tả..." multiline richText isEdit={isEdit} textColor={textColor} style={{ marginTop: 4, fontSize: 12 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} accent={accent} />}
                    </div>
                );

            default: return null;
        }
    }, [localData, isEdit, accent, updArr, addItem, delItem, moveItem, moveSection, deleteSection, getTitle, updateTitle, localOrder.length, upd, textColor, styleConfig, onStyleChange]);

    const fullWidth = localOrder.filter(s => ["summary", "experiences"].includes(s));
    const leftSections = localOrder.filter(s => ["education", "skills"].includes(s));
    const rightSections = localOrder.filter(s => ["certifications", "awards", "activities"].includes(s));

    return (
        <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Lato', sans-serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, boxSizing: "border-box", margin: "0 auto" }}>
            <div style={{ height: 8, background: accent }} />
            <div style={{ padding: "24px 40px 16px", borderBottom: `2px solid ${accent}`, boxSizing: "border-box" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
                            style={{ fontSize: 28, fontWeight: "bold", color: accent, marginBottom: 6, fontFamily: "'Playfair Display', serif", border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", padding: "0" }}
                            textColor={accent} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                        <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh"
                            style={{ fontSize: 14, color: "#666", maxWidth: 300, border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", padding: "0" }}
                            textColor="#666" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12, lineHeight: 1.8, color: "#555", flexShrink: 0 }}>
                        {[["email", "Email"], ["phone", "Phone"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
                            <div key={key}>
                                {isEdit
                                    ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph}
                                        style={{ fontSize: 12, color: "#555", textAlign: "right", width: 180, border: "none", borderBottom: "1px dashed #ccc", padding: "0 0 2px 0" }}
                                        textColor="#555" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                                    : pi[key] ? <span>{pi[key]}</span> : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ padding: "24px 40px", boxSizing: "border-box" }}>
                {fullWidth.map(s => renderSection(s, localOrder.indexOf(s)))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                    <div>{leftSections.map(s => renderSection(s, localOrder.indexOf(s)))}</div>
                    <div>{rightSections.map(s => renderSection(s, localOrder.indexOf(s)))}</div>
                </div>
            </div>
            <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
        </div>
    );
}