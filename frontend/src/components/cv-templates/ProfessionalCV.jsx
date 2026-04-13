import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "../common/ItemControls/ItemControls";

// ─── DỮ LIỆU MẪU ─────────────────────────────────────────────────────────────
const SAMPLE_DATA = {
    personalInfo: {
        fullName: "NGUYỄN VĂN A",
        portfolio: "Chuyên viên Marketing / Product Manager",
        email: "nguyenvana@email.com",
        phone: "0912 345 678",
        address: "Quận 1, TP. Hồ Chí Minh",
        linkedin: "linkedin.com/in/nguyenvana"
    },
    summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả. Tìm kiếm cơ hội phát triển trong môi trường chuyên nghiệp, năng động.",
    experiences: [
        {
            company: "Công ty TNHH ABC",
            position: "Senior Marketing Specialist",
            duration: "01/2022 – Hiện tại",
            description: "• Xây dựng và triển khai chiến lược marketing tổng thể cho công ty\n• Quản lý ngân sách marketing 2 tỷ đồng/năm, tối ưu ROI đạt 150%\n• Dẫn dắt team 5 người thực hiện các chiến dịch digital marketing"
        },
        {
            company: "Công ty XYZ",
            position: "Marketing Executive",
            duration: "06/2020 – 12/2021",
            description: "• Thực hiện các chiến dịch quảng cáo trên Facebook Ads và Google Ads\n• Phân tích dữ liệu khách hàng và đề xuất chiến lược tối ưu"
        }
    ],
    education: [
        {
            institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)",
            degree: "Cử nhân Quản trị Kinh doanh",
            year: "2016 – 2020",
            gpa: "GPA: 3.6/4.0"
        }
    ],
    skills: [
        { category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads, Content Marketing" },
        { category: "Thiết kế", items: "Photoshop, Illustrator, Figma, Canva" },
        { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio, SQL cơ bản" },
        { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }
    ],
    awards: [
        {
            title: "Nhân viên xuất sắc của năm",
            issuer: "Công ty TNHH ABC",
            year: "2023",
            description: "Đạt thành tích xuất sắc trong việc triển khai chiến dịch marketing Q4/2023"
        }
    ],
    certifications: [
        { name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" },
        { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" },
        { name: "IELTS Academic", issuer: "British Council", year: "2021", score: "7.5" }
    ],
    activities: [
        {
            organization: "CLB Marketing UEH",
            role: "Trưởng ban Nội dung",
            duration: "2018 – 2020",
            description: "• Quản lý team 10 thành viên sản xuất nội dung cho fanpage CLB\n• Tổ chức các sự kiện workshop về Marketing với quy mô 200+ người tham dự"
        }
    ]
};

const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"];
const SAMPLE_SECTION_TITLES = {
    summary: "Tóm tắt chuyên môn",
    experiences: "Kinh nghiệm làm việc",
    education: "Học vấn",
    skills: "Kỹ năng",
    certifications: "Chứng chỉ",
    awards: "Giải thưởng",
    activities: "Hoạt động ngoại khóa",
};

const hasContent = (v) => {
    if (!v) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.some(hasContent);
    if (typeof v === "object") return Object.values(v).some(hasContent);
    return false;
};

// ─── INPUT GIỮ FOCUS ─────────────────────────────────────────────────────────
const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
    const [local, setLocal] = useState(value);
    const t = useRef(null);
    const onChangeRef = useRef(onChange);
    const inputRef = useRef(null);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => {
        if (value !== local && document.activeElement !== inputRef.current) setLocal(value);
    }, [value]);

    const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
    const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

    const base = { width: "100%", background: "transparent", outline: "none", fontFamily: "inherit", ...style };
    if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
        style={{ ...base, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px 10px", fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }} />;
    return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
        style={{ ...base, border: "none", borderBottom: "1px dashed #ccc", padding: "0 0 2px 0" }} />;
});

const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit }) => {
    const [local, setLocal] = useState(value);
    const t = useRef(null);
    const onChangeRef = useRef(onChange);
    const inputRef = useRef(null);

    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
    useEffect(() => {
        if (value !== local && document.activeElement !== inputRef.current) setLocal(value);
    }, [value]);

    const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
    const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

    if (!isEdit) return hasContent(value) ? (multiline ? <p style={{ margin: 0, whiteSpace: "pre-line", ...style }}>{value}</p> : <div style={style}>{value}</div>) : null;
    const base = { border: "none", borderBottom: "1px dashed #ccc", background: "transparent", outline: "none", fontFamily: "inherit", ...style };
    if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", fontSize: 13, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />;
    return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
});

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function ProfessionalCV({
    data, onChange, isEdit,
    accent = "#8B1A1A",
    styleConfig = {},
    sectionOrder = ["summary", "experiences", "education", "skills", "certifications", "awards", "activities"],
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
    const lastPropData = useRef(data);

    useEffect(() => {
        if (isUserEditing.current) return;
        if (shouldUseSample) return;

        // Luôn cập nhật titles và order từ props
        setLocalData(data || {});
        setLocalOrder(sectionOrder);
        setLocalTitles(sectionTitles);
        lastPropData.current = data;
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
        const np = { ...pi, [key]: val };
        setLocalData(d => ({ ...d, personalInfo: np }));
        onChange("personalInfo", np);
        setTimeout(() => { isUserEditing.current = false; }, 0);
    }, [pi, onChange]);

    const updArr = useCallback((section, idx, key, val) => {
        setLocalData(d => {
            const arr = [...(d[section] || [])];
            arr[idx] = { ...arr[idx], [key]: val };
            isUserEditing.current = true;
            onChange(section, arr);
            setTimeout(() => { isUserEditing.current = false; }, 0);
            return { ...d, [section]: arr };
        });
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

    const deleteSection = useCallback((idx) => {
        const arr = localOrder.filter((_, i) => i !== idx);
        setLocalOrder(arr); if (setSectionOrder) setSectionOrder(arr);
    }, [localOrder, setSectionOrder]);

    const updateTitle = useCallback((key, title) => {
        const nt = { ...localTitles, [key]: title };
        setLocalTitles(nt); if (setSectionTitles) setSectionTitles(nt);
    }, [localTitles, setSectionTitles]);

    const defaults = {
        summary: "Tóm tắt chuyên môn", experiences: "Kinh nghiệm làm việc",
        education: "Học vấn", skills: "Kỹ năng",
        certifications: "Chứng chỉ", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa",
    };
    const getTitle = useCallback((k) => localTitles?.[k] ?? defaults[k], [localTitles]);

    const F = useCallback((props) => <EF {...props} isEdit={isEdit} />, [isEdit]);

    const SectionHeader = memo(({ sectionKey, index }) => {
        const [local, setLocal] = useState(() => getTitle(sectionKey));
        const t = useRef(null);
        const inputRef = useRef(null);
        useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, localTitles]);
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, borderBottom: `1px solid ${accent}22`, paddingBottom: 6, minHeight: 32 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    {isEdit ? (
                        <input ref={inputRef} value={local}
                            onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
                            onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
                            style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent, background: "transparent", border: "none", borderBottom: "1px dashed #ccc", width: "100%", outline: "none", padding: "2px 0", fontFamily: "inherit" }} />
                    ) : (
                        <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>{getTitle(sectionKey)}</div>
                    )}
                </div>
                {isEdit && (
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        {[["↑", () => moveSection(index, -1), index === 0], ["↓", () => moveSection(index, 1), index === localOrder.length - 1], ["×", () => deleteSection(index), false]].map(([lbl, fn, dis], i) => (
                            <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 6px", fontSize: 11, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
                        ))}
                    </div>
                )}
            </div>
        );
    });

    const ItemRow = memo(({ section, idx, total, children }) => (
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

    const AddBtn = ({ onClick }) => (
        <button onClick={onClick} style={{ fontSize: 12, color: accent, background: "#fff", border: `1px dashed ${accent}`, borderRadius: 4, padding: "6px 12px", cursor: "pointer", marginTop: 8, width: "100%" }}>+ Thêm</button>
    );

    const renderSection = (type, index) => {
        switch (type) {
            case "summary":
                return (!isEdit && !hasContent(localData.summary)) ? null : (
                    <div key={type} style={{ marginBottom: 20, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {isEdit
                            ? <DI multiline value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Mô tả kinh nghiệm và chuyên môn..." />
                            : <p style={{ color: "#444", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{localData.summary}</p>}
                    </div>
                );

            case "experiences":
                return (!isEdit && !hasContent(localData.experiences)) ? null : (
                    <div key={type} style={{ marginBottom: 20, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {(localData.experiences || []).map((exp, idx) => (
                            <div key={idx} style={{ position: "relative", paddingLeft: 16, borderLeft: `3px solid ${accent}22`, marginBottom: 16, paddingRight: isEdit ? 80 : 0, paddingTop: isEdit ? 30 : 0, boxSizing: "border-box" }}>
                                {isEdit && <div style={{ position: "absolute", top: 4, right: 0, background: "rgba(255,255,255,0.95)", borderRadius: 6, padding: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                                    <ItemControls onUp={() => moveItem("experiences", idx, -1)} onDown={() => moveItem("experiences", idx, 1)} onDelete={() => delItem("experiences", idx)} isFirst={idx === 0} isLast={idx === (localData.experiences || []).length - 1} accent={accent} /></div>}
                                <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                                    <F value={exp.position} onChange={v => updArr("experiences", idx, "position", v)} placeholder="Vị trí công việc" style={{ fontWeight: "bold", fontSize: 14, flex: 1 }} />
                                    <F value={exp.duration} onChange={v => updArr("experiences", idx, "duration", v)} placeholder="Thời gian" style={{ fontSize: 11, color: "#888", minWidth: 100 }} />
                                </div>
                                <F value={exp.company} onChange={v => updArr("experiences", idx, "company", v)} placeholder="Tên công ty" style={{ fontSize: 13, color: accent, marginTop: 2 }} />
                                <F value={exp.description} onChange={v => updArr("experiences", idx, "description", v)} placeholder="Mô tả công việc..." multiline style={{ marginTop: 4, fontSize: 13 }} />
                            </div>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} />}
                    </div>
                );

            case "education":
                return (!isEdit && !hasContent(localData.education)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {(localData.education || []).map((edu, idx) => (
                            <ItemRow key={idx} section="education" idx={idx} total={(localData.education || []).length}>
                                <F value={edu.degree} onChange={v => updArr("education", idx, "degree", v)} placeholder="Bằng cấp" style={{ fontWeight: "bold" }} />
                                <F value={edu.institution} onChange={v => updArr("education", idx, "institution", v)} placeholder="Tên trường" style={{ fontSize: 13, color: "#666", marginTop: 2 }} />
                                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                                    <F value={edu.year} onChange={v => updArr("education", idx, "year", v)} placeholder="Năm" style={{ fontSize: 12, color: "#888", width: 80 }} />
                                    <F value={edu.gpa} onChange={v => updArr("education", idx, "gpa", v)} placeholder="GPA" style={{ fontSize: 12, color: "#888", width: 60 }} />
                                </div>
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} />}
                    </div>
                );

            case "skills":
                return (!isEdit && !hasContent(localData.skills)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {(localData.skills || []).map((sk, idx) => (
                            <ItemRow key={idx} section="skills" idx={idx} total={(localData.skills || []).length}>
                                <F value={sk.category} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng" style={{ fontWeight: "bold", fontSize: 13 }} />
                                <F value={sk.items} onChange={v => updArr("skills", idx, "items", v)} placeholder="Các kỹ năng..." style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("skills", { category: "", items: "" })} />}
                    </div>
                );

            case "certifications":
                return (!isEdit && !hasContent(localData.certifications)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {(localData.certifications || []).map((cert, idx) => (
                            <ItemRow key={idx} section="certifications" idx={idx} total={(localData.certifications || []).length}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <F value={cert.name} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ" style={{ fontWeight: "bold", flex: 1 }} />
                                    <F value={cert.year} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm" style={{ fontSize: 11, color: "#888", width: 50 }} />
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                                    <F value={cert.issuer} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Cấp bởi" style={{ fontSize: 12, color: "#666", flex: 1 }} />
                                    <F value={cert.score} onChange={v => updArr("certifications", idx, "score", v)} placeholder="Điểm" style={{ fontSize: 12, color: "#888", width: 60 }} />
                                </div>
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} />}
                    </div>
                );

            case "awards":
                return (!isEdit && !hasContent(localData.awards)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {(localData.awards || []).map((aw, idx) => (
                            <ItemRow key={idx} section="awards" idx={idx} total={(localData.awards || []).length}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <F value={aw.title} onChange={v => updArr("awards", idx, "title", v)} placeholder="Tên giải thưởng" style={{ fontWeight: "bold", flex: 1 }} />
                                    <F value={aw.year} onChange={v => updArr("awards", idx, "year", v)} placeholder="Năm" style={{ fontSize: 11, color: "#888", width: 50 }} />
                                </div>
                                <F value={aw.issuer} onChange={v => updArr("awards", idx, "issuer", v)} placeholder="Tổ chức" style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
                                <F value={aw.description} onChange={v => updArr("awards", idx, "description", v)} placeholder="Mô tả..." style={{ fontSize: 12, color: "#777", marginTop: 2 }} />
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} />}
                    </div>
                );

            case "activities":
                return (!isEdit && !hasContent(localData.activities)) ? null : (
                    <div key={type} style={{ marginBottom: 16, width: "100%" }}>
                        <SectionHeader sectionKey={type} index={index} />
                        {(localData.activities || []).map((act, idx) => (
                            <ItemRow key={idx} section="activities" idx={idx} total={(localData.activities || []).length}>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <F value={act.role} onChange={v => updArr("activities", idx, "role", v)} placeholder="Vai trò" style={{ fontWeight: "bold", flex: 1 }} />
                                    <F value={act.duration} onChange={v => updArr("activities", idx, "duration", v)} placeholder="Thời gian" style={{ fontSize: 11, color: "#888", width: 90 }} />
                                </div>
                                <F value={act.organization} onChange={v => updArr("activities", idx, "organization", v)} placeholder="Tổ chức" style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
                                <F value={act.description} onChange={v => updArr("activities", idx, "description", v)} placeholder="Mô tả..." multiline style={{ marginTop: 4, fontSize: 12 }} />
                            </ItemRow>
                        ))}
                        {isEdit && <AddBtn onClick={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} />}
                    </div>
                );

            default: return null;
        }
    };

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
                            style={{ fontSize: 28, fontWeight: "bold", color: accent, marginBottom: 6, fontFamily: "'Playfair Display', serif", border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", background: "transparent", padding: "0" }} />
                        <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh"
                            style={{ fontSize: 14, color: "#666", maxWidth: 300, border: "none", borderBottom: isEdit ? "1px dashed #ccc" : "none", background: "transparent", padding: "0" }} />
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12, lineHeight: 1.8, color: "#555", flexShrink: 0 }}>
                        {[["email", "Email"], ["phone", "Phone"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
                            <div key={key}>
                                {isEdit
                                    ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph}
                                        style={{ fontSize: 12, color: "#555", textAlign: "right", width: 180, border: "none", borderBottom: "1px dashed #ccc", background: "transparent", padding: "0 0 2px 0" }} />
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