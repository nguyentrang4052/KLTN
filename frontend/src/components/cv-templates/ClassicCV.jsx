import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "./../common/ItemControls/ItemControls";
import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
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
            description: "• Thực hiện các chiến dịch quảng cáo trên Facebook Ads và Google Ads\n• Phân tích dữ liệu khách hàng và đề xuất chiến lược tối ưu\n• Quản lý fanpage và website công ty, tăng 50% tương tác"
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
        { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" }
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

const SAMPLE_SECTION_ORDER = ["experiences", "education", "skills", "awards", "certifications", "activities"];
const SAMPLE_SECTION_TITLES = {
    summary: "Mục tiêu nghề nghiệp",
    experiences: "Kinh nghiệm làm việc",
    education: "Học vấn",
    skills: "Kỹ năng",
    awards: "Thành tích & Giải thưởng",
    certifications: "Chứng chỉ",
    activities: "Hoạt động ngoại khóa"
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const isHTML = (str) => typeof str === 'string' && /<[a-z][\s\S]*>/i.test(str);

const hasContent = (v) => {
    if (!v) return false;
    if (typeof v === "string") {
        const stripped = v.replace(/<[^>]*>/g, '').trim();
        return stripped !== "";
    }
    if (Array.isArray(v)) return v.some(i => hasContent(i));
    if (typeof v === "object") return Object.values(v).some(hasContent);
    return false;
};

// ─── INLINE EDIT ───────────────────────────────────────────────────────────────
const InlineEdit = memo(({ value = "", onChange, placeholder, style, styleConfig = {}, onStyleChange, multiline = false }) => {
    const ref = useRef(null);
    const isComposing = useRef(false);

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = value || "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]); // chỉ chạy 1 lần khi mount

    useEffect(() => {
        if (!ref.current) return;
        if (document.activeElement === ref.current) return;
        const current = ref.current.innerHTML;
        const incoming = value || "";
        if (current !== incoming) {
            ref.current.innerHTML = incoming;
        }
    }, [value]);

    const handleInput = useCallback(() => {
        if (isComposing.current) return;
        if (!ref.current) return;
        const newHtml = ref.current.innerHTML;
        onChange(newHtml);
    }, [onChange]);

    const handleCompositionStart = useCallback(() => { isComposing.current = true; }, []);
    const handleCompositionEnd = useCallback(() => {
        isComposing.current = false;
        handleInput();
    }, [handleInput]);

    const handleFocus = useCallback(() => {
        if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
    }, [onStyleChange, styleConfig]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            const active = document.activeElement;
            if (active?.closest(".selection-toolbar")) return;
            if (active === ref.current || ref.current?.contains(active)) return;
            clearActiveField();
        }, 200);
    }, []);

    const handleMouseUp = useCallback(() => {
        if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
    }, [onStyleChange, styleConfig]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
        }
    }, [multiline]);

    const sc = styleConfig || {};

    return (
        <div
            ref={ref}
            data-rich-editor="true"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            data-placeholder={placeholder}
            style={{
                outline: "none",
                minHeight: multiline ? 60 : 20,
                whiteSpace: multiline ? "pre-wrap" : "normal",
                wordBreak: "break-word",
                fontFamily: sc.fontFamily || "inherit",
                fontSize: sc.baseFontSize || "inherit",
                lineHeight: sc.lineHeight || "inherit",
                fontWeight: sc.fontWeight || "normal",
                fontStyle: sc.fontStyle || "normal",
                textDecoration: sc.textDecoration || "none",
                color: sc.textColor || "inherit",
                ...style,
            }}
        />
    );
});

// ─── TITLE EDIT ─────────────────────────────────────────────────────────────
const TitleEdit = memo(({ value, onChange, style, textColor, styleConfig = {}, onStyleChange }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && document.activeElement !== ref.current) {
            ref.current.innerHTML = value || "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (!ref.current) return;
        if (document.activeElement === ref.current) return;
        const incoming = value || "";
        if (ref.current.innerHTML !== incoming) {
            ref.current.innerHTML = incoming;
        }
    }, [value]);

    const handleInput = useCallback(() => {
        if (!ref.current) return;
        onChange(ref.current.innerHTML);
    }, [onChange]);

    const handleFocus = useCallback(() => {
        if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
    }, [onStyleChange, styleConfig]);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            const active = document.activeElement;
            if (active?.closest(".selection-toolbar")) return;
            if (active === ref.current || ref.current?.contains(active)) return;
            clearActiveField();
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

// ─── EF: Editable Field wrapper ───────────────────────────────────────────────
const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit, textColor, styleConfig = {}, onStyleChange }) => {
    if (!isEdit) {
        if (isHTML(value)) {
            return <div dangerouslySetInnerHTML={{ __html: value }} style={{ color: textColor, whiteSpace: "pre-wrap", ...style }} />;
        }
        return value ? <div style={{ color: textColor, whiteSpace: "pre-line", ...style }}>{value}</div> : null;
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

// ─── SECTION ITEM ─────────────────────────────────────────────────────────────
const SectionItem = memo(({ section, item, index, total, isEdit, accent, onUpdate, onMove, onDelete, renderConfig }) => {
    const handleChange = useCallback((key, val) => {
        onUpdate(section, index, key, val);
    }, [section, index, onUpdate]);

    const renderContent = useMemo(() => {
        return renderConfig.render(item, index, handleChange);
    }, [renderConfig, item, index, handleChange]);

    if (!isEdit) {
        return <div style={{ padding: "6px 0", borderBottom: "1px dashed #eee" }}>{renderContent}</div>;
    }

    return (
        <div className="item-wrapper" style={{ position: "relative", padding: "28px 80px 8px 0", borderBottom: "1px dashed #eee", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", top: 4, right: 0 }}>
                <ItemControls
                    onUp={() => onMove(section, index, -1)}
                    onDown={() => onMove(section, index, 1)}
                    onDelete={() => onDelete(section, index)}
                    isFirst={index === 0}
                    isLast={index === total - 1}
                    accent={accent}
                />
            </div>
            {renderContent}
        </div>
    );
});

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = memo(({ sectionKey,
    title,
    isEdit,
    index, total, accent, textColor, 
    onTitleChange, onMove, 
    styleConfig = {}, 
    onStyleChange,
    onAIAssist }) => {
    const sectionTitleStyle = {
        fontSize: 13,
        fontWeight: "bold",
        color: textColor,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        borderBottom: `2px solid ${accent}`,
        paddingBottom: 4,
        marginBottom: 10,
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            {isEdit ? (
                <TitleEdit
                    value={title}
                    onChange={v => onTitleChange(sectionKey, v)}
                    style={{ ...sectionTitleStyle, flex: 1, width: "auto", color: textColor }}
                    textColor={textColor}
                    styleConfig={styleConfig}
                    onStyleChange={onStyleChange}
                />
            ) : (
                <div style={{ ...sectionTitleStyle, flex: 1 }}>
                    {isHTML(title) ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
                </div>
            )}

            {/* Thêm AI button */}
            {isEdit && onAIAssist && (
                <button
                    onClick={() => onAIAssist(sectionKey)}
                    style={{
                        background: '#f3e8ff',
                        border: 'none',
                        borderRadius: 20,
                        padding: '4px 12px',
                        fontSize: 12,
                        cursor: 'pointer',
                        color: '#6b21a5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        flexShrink: 0,
                    }}
                >
                    ✨ AI
                </button>
            )}

            {isEdit && (
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    <button onClick={() => onMove(index, -1)} disabled={index === 0} style={btnS(index === 0, "black")}>↑</button>
                    <button onClick={() => onMove(index, 1)} disabled={index === total - 1} style={btnS(index === total - 1, "black")}>↓</button>
                </div>
            )}
        </div>
    );
});

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ClassicCV({
    data,
    onChange,
    forceReset,
    editorResetKey,
    isEdit,
    accent = "#696262",
    styleConfig = {},
    onStyleChange,
    sectionOrder = ["experiences", "education", "skills", "awards", "certifications", "activities"],
    setSectionOrder,
    sectionTitles = {},
    setSectionTitles,
    useSampleData = false,
    onAIAssist
}) {
    const shouldUseSampleData = useMemo(() => {
        if (forceReset) return false;
        if (useSampleData) return true;
        if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) {
            return true;
        }
        return false;
    }, [useSampleData, isEdit, data, forceReset]);

    // SỬA: Khởi tạo state từ props.data thay vì SAMPLE_DATA khi không cần
    const [localData, setLocalData] = useState(() => {
        if (shouldUseSampleData) return SAMPLE_DATA;
        return data || {};
    });
    const [localOrder, setLocalOrder] = useState(() =>
        shouldUseSampleData ? SAMPLE_SECTION_ORDER : sectionOrder
    );
    const [localTitles, setLocalTitles] = useState(() =>
        shouldUseSampleData ? SAMPLE_SECTION_TITLES : sectionTitles
    );

    const isUserEditing = useRef(false);

    useEffect(() => {
        if (isUserEditing.current) return;
        if (shouldUseSampleData) return;
        setLocalData(data || {});
        setLocalOrder(sectionOrder);
        setLocalTitles(sectionTitles);
    }, [data, sectionOrder, sectionTitles, shouldUseSampleData, editorResetKey]); // ← Thêm editorResetKey

    const textColor = styleConfig.textColor || "#111";
    const bgColor = styleConfig.backgroundColor || "white";
    const accentColor = accent;

    const pi = localData.personalInfo || {};

    const upd = useCallback((section, val) => {
        isUserEditing.current = true;
        const nd = { ...localData, [section]: val };
        setLocalData(nd);
        onChange(section, val);
        setTimeout(() => { isUserEditing.current = false; }, 0);
    }, [localData, onChange]);

    const updPi = useCallback((key, val) => {
        isUserEditing.current = true;
        const np = { ...pi, [key]: val };
        const nd = { ...localData, personalInfo: np };
        setLocalData(nd);
        onChange("personalInfo", np);
        setTimeout(() => { isUserEditing.current = false; }, 0);
    }, [pi, localData, onChange]);

    const updArr = useCallback((section, idx, key, val) => {
        const arr = [...(localData[section] || [])];
        arr[idx] = { ...arr[idx], [key]: val };
        upd(section, arr);
    }, [localData, upd]);

    const addItem = useCallback((section, empty) => {
        const arr = [...(localData[section] || []), { ...empty }];
        upd(section, arr);
    }, [localData, upd]);

    const delItem = useCallback((section, idx) => {
        const arr = (localData[section] || []).filter((_, i) => i !== idx);
        upd(section, arr);
    }, [localData, upd]);

    const moveItem = useCallback((section, idx, dir) => {
        const arr = [...(localData[section] || [])];
        const ni = idx + dir;
        if (ni < 0 || ni >= arr.length) return;
        [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
        upd(section, arr);
    }, [localData, upd]);

    const moveSection = useCallback((idx, dir) => {
        const ni = idx + dir;
        if (ni < 0 || ni >= localOrder.length) return;
        const arr = [...localOrder];
        [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
        setLocalOrder(arr);
        if (setSectionOrder) setSectionOrder(arr);
    }, [localOrder, setSectionOrder]);

    const updateTitle = useCallback((key, t) => {
        const nt = { ...localTitles, [key]: t };
        setLocalTitles(nt);
        if (setSectionTitles) setSectionTitles(nt);
    }, [localTitles, setSectionTitles]);

    const defaults = {
        summary: "Mục tiêu nghề nghiệp",
        experiences: "Kinh nghiệm làm việc",
        education: "Học vấn",
        skills: "Kỹ năng",
        awards: "Thành tích & Giải thưởng",
        certifications: "Chứng chỉ",
        activities: "Hoạt động ngoại khóa",
    };

    const getTitle = useCallback((k) => localTitles?.[k] ?? defaults[k], [localTitles]);

    const configs = useMemo(() => ({
        experiences: {
            empty: { company: "", position: "", duration: "", description: "" },
            render: (exp, i, onChange) => (
                <>
                    <EF value={exp.position} onChange={v => onChange("position", v)} placeholder="Vị trí công việc" style={{ fontWeight: "bold", fontSize: 14, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <div style={{ display: "flex", gap: 8 }}>
                        <EF value={exp.company} onChange={v => onChange("company", v)} placeholder="Tên công ty" style={{ color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                        <span style={{ color: textColor }}>·</span>
                        <EF value={exp.duration} onChange={v => onChange("duration", v)} placeholder="01/2023 – Hiện tại" style={{ color: textColor, width: 160 }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <EF value={exp.description} onChange={v => onChange("description", v)} placeholder="Mô tả công việc..." multiline style={{ marginTop: 4, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                </>
            )
        },
        education: {
            empty: { institution: "", degree: "", year: "", gpa: "" },
            render: (edu, i, onChange) => {
                const hasInstitution = hasContent(edu.institution);
                const hasYear = hasContent(edu.year);
                const hasGpa = hasContent(edu.gpa);
                return (
                    <>
                        <EF value={edu.degree} onChange={v => onChange("degree", v)} placeholder="Bằng cấp / Chuyên ngành" style={{ fontWeight: "bold", color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <EF value={edu.institution} onChange={v => onChange("institution", v)} placeholder="Tên trường" style={{ color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                            {hasInstitution && (hasYear || hasGpa) && <span style={{ color: textColor }}>|</span>}
                            <EF value={edu.year} onChange={v => onChange("year", v)} placeholder="2020 – 2024" style={{ width: 100, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                            {hasYear && hasGpa && <span style={{ color: textColor }}>|</span>}
                            <EF value={edu.gpa} onChange={v => onChange("gpa", v)} placeholder="GPA: 3.5" style={{ width: 80, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                        </div>
                    </>
                );
            }
        },
        skills: {
            empty: { category: "", items: "" },
            render: (sk, i, onChange) => (
                <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    <EF value={sk.category} onChange={v => onChange("category", v)} placeholder="Nhóm kỹ năng" style={{ fontWeight: "bold", width: 140, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <span style={{ color: textColor }}>:</span>
                    <EF value={sk.items} onChange={v => onChange("items", v)} placeholder="Kỹ năng 1, Kỹ năng 2..." style={{ flex: 1, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                </div>
            )
        },
        awards: {
            empty: { title: "", issuer: "", year: "", description: "" },
            render: (aw, i, onChange) => (
                <>
                    <div style={{ display: "flex", gap: 8 }}>
                        <EF value={aw.title} onChange={v => onChange("title", v)} placeholder="Tên giải thưởng" style={{ fontWeight: "bold", flex: 1, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                        <EF value={aw.year} onChange={v => onChange("year", v)} placeholder="2023" style={{ width: 60, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <EF value={aw.issuer} onChange={v => onChange("issuer", v)} placeholder="Tổ chức trao giải" style={{ color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={aw.description} onChange={v => onChange("description", v)} placeholder="Mô tả..." style={{ color: textColor, fontSize: 12 }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                </>
            )
        },
        certifications: {
            empty: { name: "", issuer: "", year: "", score: "" },
            render: (cert, i, onChange) => (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: "100%" }}>
                    <EF value={cert.name} onChange={v => onChange("name", v)} placeholder="Tên chứng chỉ" style={{ fontWeight: "bold", flex: 1, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={cert.issuer} onChange={v => onChange("issuer", v)} placeholder="Tổ chức cấp" style={{ width: 120, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={cert.year} onChange={v => onChange("year", v)} placeholder="2023" style={{ width: 60, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={cert.score} onChange={v => onChange("score", v)} placeholder="Score" style={{ width: 80, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                </div>
            )
        },
        activities: {
            empty: { organization: "", role: "", duration: "", description: "" },
            render: (act, i, onChange) => (
                <>
                    <div style={{ display: "flex", gap: 8 }}>
                        <EF value={act.role} onChange={v => onChange("role", v)} placeholder="Vai trò" style={{ fontWeight: "bold", flex: 1, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                        <EF value={act.duration} onChange={v => onChange("duration", v)} placeholder="Thời gian" style={{ width: 130, color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <EF value={act.organization} onChange={v => onChange("organization", v)} placeholder="Tên tổ chức / CLB" style={{ color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={act.description} onChange={v => onChange("description", v)} placeholder="Mô tả hoạt động..." multiline style={{ color: textColor }} isEdit={isEdit} textColor={textColor} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                </>
            )
        },
    }), [isEdit, accent, textColor, styleConfig, onStyleChange]);

    const AddBtn = useCallback(({ onClick, label = "+ Thêm" }) => (
        <button onClick={onClick} style={{
            fontSize: 11, color: textColor, background: "#fff",
            border: `1px dashed ${accent}`, borderRadius: 4,
            padding: "4px 10px", cursor: "pointer", marginTop: 4, width: "100%"
        }}>
            {label}
        </button>
    ), [accent, textColor]);

    // SỬA: Thêm key={editorResetKey} để force remount toàn bộ component khi reset
    return (
        <div
            key={editorResetKey}
            id="cv-paper"
            className="cv-paper"
            style={{
                width: "100%",
                maxWidth: "794px",
                minHeight: "1123px",
                background: bgColor,
                fontFamily: styleConfig.fontFamily || "Lato, sans-serif",
                fontSize: styleConfig.baseFontSize || 13,
                lineHeight: styleConfig.lineHeight || 1.6
            }}
        >
            {/* ── HEADER ── */}
            <div style={{ background: accentColor, padding: "32px 40px 24px", color: "#fff" }}>
                {isEdit ? (
                    <InlineEdit
                        value={pi.fullName || ""}
                        onChange={v => updPi("fullName", v)}
                        placeholder="Họ và tên đầy đủ"
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{
                            fontSize: 28, fontWeight: "bold",
                            color: styleConfig.textColor === "#ffffff" ? "white" : (styleConfig.textColor || "#fff"),
                            marginBottom: 6,
                            borderBottom: "1.5px dashed rgba(255,255,255,0.4)"
                        }}
                    />
                ) : pi.fullName ? (
                    <div style={{ fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>
                        {isHTML(pi.fullName) ? <span dangerouslySetInnerHTML={{ __html: pi.fullName }} /> : pi.fullName}
                    </div>
                ) : null}

                {isEdit ? (
                    <InlineEdit
                        value={pi.portfolio || ""}
                        onChange={v => updPi("portfolio", v)}
                        placeholder="Vị trí ứng tuyển / Portfolio"
                        styleConfig={styleConfig}
                        onStyleChange={onStyleChange}
                        style={{
                            fontSize: 14, color: "rgba(255,255,255,0.85)",
                            marginBottom: 12, borderBottom: "1px dashed rgba(255,255,255,0.3)",
                            width: "60%"
                        }}
                    />
                ) : pi.portfolio ? (
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 12 }}>
                        {isHTML(pi.portfolio) ? <span dangerouslySetInnerHTML={{ __html: pi.portfolio }} /> : pi.portfolio}
                    </div>
                ) : null}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
                    {[
                        ["📧", "email", "email@example.com"],
                        ["📱", "phone", "0912 345 678"],
                        ["📍", "address", "Địa chỉ"],
                        ["🔗", "linkedin", "LinkedIn"]
                    ].map(([icon, key, ph]) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                            <span>{icon}</span>
                            {isEdit ? (
                                <InlineEdit
                                    value={pi[key] || ""}
                                    onChange={v => updPi(key, v)}
                                    placeholder={ph}
                                    styleConfig={styleConfig}
                                    onStyleChange={onStyleChange}
                                    style={{
                                        fontSize: 12, color: "rgba(255,255,255,0.85)",
                                        borderBottom: "1px dashed rgba(255,255,255,0.3)", width: 150
                                    }}
                                />
                            ) : pi[key] ? (
                                <span>{isHTML(pi[key]) ? <span dangerouslySetInnerHTML={{ __html: pi[key] }} /> : pi[key]}</span>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── BODY ── */}
            <div style={{ padding: "24px 40px" }}>
                {/* Summary */}
                {(isEdit || hasContent(localData.summary)) && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            {isEdit ? (
                                <TitleEdit
                                    value={getTitle("summary")}
                                    onChange={v => updateTitle("summary", v)}
                                    style={{
                                        fontSize: 13, fontWeight: "bold", letterSpacing: 1.5,
                                        textTransform: "uppercase", borderBottom: `2px solid ${accent}`,
                                        paddingBottom: 4, flex: 1
                                    }}
                                    textColor={textColor}
                                    styleConfig={styleConfig}
                                    onStyleChange={onStyleChange}
                                />
                            ) : (
                                <div style={{
                                    fontSize: 13, fontWeight: "bold", letterSpacing: 1.5,
                                    textTransform: "uppercase", borderBottom: `2px solid ${accent}`,
                                    paddingBottom: 4, flex: 1
                                }}>
                                    {isHTML(getTitle("summary")) ? <span dangerouslySetInnerHTML={{ __html: getTitle("summary") }} /> : getTitle("summary")}
                                </div>
                            )}
                        </div>
                        <EF
                            value={localData.summary || ""}
                            onChange={v => upd("summary", v)}
                            placeholder="Mô tả ngắn gọn mục tiêu và điểm mạnh của bạn..."
                            multiline
                            style={{ color: textColor }}
                            isEdit={isEdit}
                            textColor={textColor}
                            styleConfig={styleConfig}
                            onStyleChange={onStyleChange}
                        />
                    </div>
                )}

                {/* Dynamic Sections */}
                {localOrder.map((key, idx) => {
                    const arr = localData[key] || [];
                    if (!isEdit && !hasContent(arr)) return null;
                    const cfg = configs[key];
                    if (!cfg) return null;

                    return (
                        <div key={key} style={{ marginBottom: 20 }}>
                            <SectionHeader
                                sectionKey={key}
                                title={getTitle(key)}
                                isEdit={isEdit}
                                index={idx}
                                total={localOrder.length}
                                accent={accent}
                                textColor={textColor}
                                onTitleChange={updateTitle}
                                onMove={moveSection}
                                styleConfig={styleConfig}
                                onStyleChange={onStyleChange}
                                onAIAssist={onAIAssist}
                            />
                            {arr.map((item, i) => (
                                <SectionItem
                                    key={`${key}-${i}`}
                                    section={key}
                                    item={item}
                                    index={i}
                                    total={arr.length}
                                    isEdit={isEdit}
                                    accent={accent}
                                    onUpdate={updArr}
                                    onMove={moveItem}
                                    onDelete={delItem}
                                    renderConfig={cfg}
                                />
                            ))}
                            {isEdit && <AddBtn onClick={() => addItem(key, cfg.empty)} />}
                        </div>
                    );
                })}
            </div>

            <style>{`
                /* Placeholder cho contenteditable */
                [data-rich-editor][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #bbb;
                    pointer-events: none;
                    font-style: italic;
                }
                [data-rich-editor][data-placeholder]:focus:empty:before {
                    color: #ccc;
                }
                /* Hover controls */
                .item-wrapper:hover .item-controls { opacity: 1 !important; }
            `}</style>
        </div>
    );
}

const btnS = (disabled, accent) => ({
    padding: "2px 6px", fontSize: 11, borderRadius: 3,
    border: `1px solid ${accent}44`, background: "#fff",
    color: disabled ? "#ccc" : accent,
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer"
});