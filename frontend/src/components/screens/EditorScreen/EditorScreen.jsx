import { useState, useEffect, useRef } from "react";
import { loadState, saveState } from "./../../../utils/storage";
import { exportToPDF } from "./../../../utils/pdfExport";
import CVRenderer from "../../cv-templates/CVRenderer";
import UnifiedToolbar from "../../common/UnifiedToolbar/UnifiedToolbar";

const DEFAULT_STYLE_CONFIG = {
    fontFamily: "'DM Sans', sans-serif",
    baseFontSize: 13,
    lineHeight: 1.6,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    accentColor: "#2C3E6B",
    textColor: "#111111",
    backgroundColor: "#ffffff"
};

const DEFAULT_SECTION_ORDER = [
    "experiences", "education", "skills", "awards", "certifications", "activities"
];

const DEFAULT_SECTION_TITLES = {
    experiences: "Kinh nghiệm làm việc",
    education: "Học vấn",
    skills: "Kỹ năng",
    activities: "Hoạt động ngoại khóa",
    awards: "Thành tích & Giải thưởng",
    certifications: "Chứng chỉ",
    summary: "Mục tiêu nghề nghiệp"
};

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

const ACCENT_COLORS = [
    "#2C3E6B", "#1A6B5A", "#1C1C1C", "#8B1A1A",
    "#5B2D8E", "#D97706", "#059669", "#DC2626",
    "#0369A1", "#92400E", "#065F46", "#4C1D95"
];

const TEXT_COLORS = [
    "#111111", "#333333", "#1f2937", "#374151", "#000000"
];

function getTemplateAccent(id) {
    const colors = {
        classic: "#2C3E6B", modern: "#1A6B5A",
        minimal: "#1C1C1C", professional: "#8B1A1A", creative: "#5B2D8E"
    };
    return colors[id] || "#2C3E6B";
}

function SidebarControlPanel({ styleConfig, onStyleChange, sectionOrder, setSectionOrder, sectionTitles, setSectionTitles, data, onDataChange }) {
    const [activeTab, setActiveTab] = useState("font"); // font | design | sections

    const updateStyle = (key, val) => onStyleChange({ ...styleConfig, [key]: val });

    const isBold = styleConfig.fontWeight === "bold";
    const isItalic = styleConfig.fontStyle === "italic";
    const isUnderline = styleConfig.textDecoration === "underline";

    const btnBase = {
        border: "1px solid #d1d5db",
        borderRadius: 4,
        background: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.1s",
        fontSize: 13,
        height: 32,
    };
    const btnActive = { ...btnBase, background: "#e0e7ff", borderColor: "#6366f1", color: "#4338ca" };

    const toggleSection = (key) => {
        const newOrder = sectionOrder.includes(key)
            ? sectionOrder.filter(k => k !== key)
            : [...sectionOrder, key];
        setSectionOrder(newOrder);
    };

    const moveSection = (index, direction) => {
        const newOrder = [...sectionOrder];
        const target = index + direction;
        if (target >= 0 && target < newOrder.length) {
            [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
            setSectionOrder(newOrder);
        }
    };

    return (
        <div style={{
            width: 280,
            background: "#f9fafb",
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            overflow: "hidden",
        }}>
            {}
            <div style={{
                display: "flex",
                borderBottom: "1px solid #e5e7eb",
                background: "white",
            }}>
                {[
                    { id: "font", label: "📝 Font", title: "Font chữ" },
                    { id: "design", label: "🎨 Màu", title: "Màu sắc" },
                    { id: "sections", label: "📑 Mục", title: "Sắp xếp mục" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        title={tab.title}
                        style={{
                            flex: 1,
                            padding: "10px 4px",
                            border: "none",
                            borderBottom: activeTab === tab.id ? "2px solid #4338ca" : "2px solid transparent",
                            background: "transparent",
                            fontSize: 12,
                            fontWeight: activeTab === tab.id ? 700 : 400,
                            color: activeTab === tab.id ? "#4338ca" : "#6b7280",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <span style={{ fontSize: 16 }}>{tab.label.split(" ")[0]}</span>
                        <span>{tab.label.split(" ")[1]}</span>
                    </button>
                ))}
            </div>

            {}
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>

                {}
                {activeTab === "font" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                                Font chữ
                            </label>
                            <select
                                value={styleConfig.fontFamily}
                                onChange={e => updateStyle("fontFamily", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "8px 10px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: 6,
                                    fontSize: 13,
                                    background: "white",
                                    cursor: "pointer",
                                }}
                            >
                                {FONT_OPTIONS.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>
                        </div>

                        {}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                                Cỡ chữ: {styleConfig.baseFontSize}px
                            </label>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button
                                    onClick={() => updateStyle("baseFontSize", Math.max(10, styleConfig.baseFontSize - 1))}
                                    style={{ ...btnBase, width: 28, fontSize: 16 }}
                                >−</button>
                                <input
                                    type="number"
                                    min={10}
                                    max={20}
                                    value={styleConfig.baseFontSize}
                                    onChange={e => {
                                        const v = parseInt(e.target.value);
                                        if (v >= 10 && v <= 20) updateStyle("baseFontSize", v);
                                    }}
                                    style={{
                                        width: 50,
                                        textAlign: "center",
                                        padding: "4px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: 4,
                                        fontSize: 13,
                                    }}
                                />
                                <button
                                    onClick={() => updateStyle("baseFontSize", Math.min(20, styleConfig.baseFontSize + 1))}
                                    style={{ ...btnBase, width: 28, fontSize: 16 }}
                                >+</button>
                            </div>
                        </div>

                        {}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                                Kiểu chữ
                            </label>
                            <div style={{ display: "flex", gap: 6 }}>
                                <button
                                    onClick={() => updateStyle("fontWeight", isBold ? "normal" : "bold")}
                                    style={{ ...(isBold ? btnActive : btnBase), width: 40, fontWeight: "bold", fontSize: 14 }}
                                    title="Đậm"
                                >B</button>
                                <button
                                    onClick={() => updateStyle("fontStyle", isItalic ? "normal" : "italic")}
                                    style={{ ...(isItalic ? btnActive : btnBase), width: 40, fontStyle: "italic", fontSize: 14 }}
                                    title="Nghiêng"
                                >I</button>
                                <button
                                    onClick={() => updateStyle("textDecoration", isUnderline ? "none" : "underline")}
                                    style={{ ...(isUnderline ? btnActive : btnBase), width: 40, textDecoration: "underline", fontSize: 14 }}
                                    title="Gạch chân"
                                >U</button>
                            </div>
                        </div>

                        {}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                                Khoảng cách dòng: {styleConfig.lineHeight}
                            </label>
                            <input
                                type="range"
                                min="1.2"
                                max="2.0"
                                step="0.1"
                                value={styleConfig.lineHeight}
                                onChange={e => updateStyle("lineHeight", parseFloat(e.target.value))}
                                style={{ width: "100%" }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                                <span>1.2</span>
                                <span>1.6</span>
                                <span>2.0</span>
                            </div>
                        </div>
                    </div>
                )}

                {}
                {activeTab === "design" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                        {}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>
                                Màu chủ đề
                            </label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {ACCENT_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => updateStyle("accentColor", c)}
                                        title={c}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: c,
                                            border: styleConfig.accentColor === c ? "3px solid white" : "2px solid transparent",
                                            boxShadow: styleConfig.accentColor === c ? `0 0 0 2px ${c}` : "0 1px 3px rgba(0,0,0,0.2)",
                                            cursor: "pointer",
                                        }}
                                    />
                                ))}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                                    <input
                                        type="color"
                                        value={styleConfig.accentColor}
                                        onChange={e => updateStyle("accentColor", e.target.value)}
                                        style={{ width: 28, height: 28, border: "none", padding: 0, cursor: "pointer", borderRadius: "50%" }}
                                    />
                                    <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{styleConfig.accentColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* {}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>
                                Màu chữ
                            </label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {TEXT_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => updateStyle("textColor", c)}
                                        title={c}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: c,
                                            border: styleConfig.textColor === c ? "3px solid white" : "2px solid transparent",
                                            boxShadow: styleConfig.textColor === c ? `0 0 0 2px ${c}` : "0 1px 3px rgba(0,0,0,0.2)",
                                            cursor: "pointer",
                                        }}
                                    />
                                ))}
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
                                    <input
                                        type="color"
                                        value={styleConfig.textColor}
                                        onChange={e => updateStyle("textColor", e.target.value)}
                                        style={{ width: 28, height: 28, border: "none", padding: 0, cursor: "pointer", borderRadius: "50%" }}
                                    />
                                    <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{styleConfig.textColor}</span>
                                </div>
                            </div>
                        </div>

                        {} */}
                        <button
                            onClick={() => onStyleChange({
                                ...DEFAULT_STYLE_CONFIG,
                                accentColor: getTemplateAccent("classic")
                            })}
                            style={{
                                width: "100%",
                                padding: "10px",
                                background: "#f3f4f6",
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: 12,
                                color: "#374151",
                                marginTop: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                            }}
                        >
                            ↺ Đặt lại mặc định
                        </button>
                    </div>
                )}

                {}
                {activeTab === "sections" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 }}>
                            Sắp xếp & Hiển thị
                        </label>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px 0", lineHeight: 1.5 }}>
                            Bật/tắt để ẩn/hiện mục. Kéo thả hoặc dùng ↑↓ để sắp xếp.
                        </p>

                        {sectionOrder.map((key, index) => (
                            <div
                                key={key}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 10px",
                                    background: "white",
                                    borderRadius: 6,
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleSection(key)}
                                    style={{ cursor: "pointer" }}
                                />
                                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#374151" }}>
                                    {sectionTitles[key] || key}
                                </span>
                                <div style={{ display: "flex", gap: 2 }}>
                                    <button
                                        onClick={() => moveSection(index, -1)}
                                        disabled={index === 0}
                                        style={{
                                            width: 24, height: 24, border: "none", borderRadius: 4,
                                            background: index === 0 ? "#f3f4f6" : "#e5e7eb",
                                            color: index === 0 ? "#d1d5db" : "#374151",
                                            cursor: index === 0 ? "not-allowed" : "pointer",
                                            fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
                                        }}
                                    >↑</button>
                                    <button
                                        onClick={() => moveSection(index, 1)}
                                        disabled={index === sectionOrder.length - 1}
                                        style={{
                                            width: 24, height: 24, border: "none", borderRadius: 4,
                                            background: index === sectionOrder.length - 1 ? "#f3f4f6" : "#e5e7eb",
                                            color: index === sectionOrder.length - 1 ? "#d1d5db" : "#374151",
                                            cursor: index === sectionOrder.length - 1 ? "not-allowed" : "pointer",
                                            fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
                                        }}
                                    >↓</button>
                                </div>
                            </div>
                        ))}

                        {}
                        {Object.keys(sectionTitles)
                            .filter(key => !sectionOrder.includes(key) && key !== "summary")
                            .map(key => (
                                <div
                                    key={key}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "8px 10px",
                                        background: "#f3f4f6",
                                        borderRadius: 6,
                                        border: "1px dashed #d1d5db",
                                        opacity: 0.7,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        onChange={() => toggleSection(key)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <span style={{ flex: 1, fontSize: 13, color: "#6b7280" }}>
                                        {sectionTitles[key] || key}
                                    </span>
                                    <span style={{ fontSize: 11, color: "#9ca3af" }}>Ẩn</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EditorScreen({ templateId, initialData, cvId, onBack, forceReset = false }) {
    const [data, setData] = useState(() => forceReset ? {} : (initialData || {}));
    const [zoom, setZoom] = useState(100);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [cvName, setCvName] = useState("CV của tôi");
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [autoSaveStatus, setAutoSaveStatus] = useState('');
    const autoSaveTimerRef = useRef(null);

    const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(() => {
        try {
            const saved = localStorage.getItem('cv_autosave_enabled');
            return saved ? JSON.parse(saved) : false;
        } catch {
            return false;
        }
    });

    const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
    const [sectionTitles, setSectionTitles] = useState(DEFAULT_SECTION_TITLES);

    const [styleConfig, setStyleConfig] = useState(() => {
        const defaultAccent = getTemplateAccent(templateId);
        return { ...DEFAULT_STYLE_CONFIG, accentColor: defaultAccent };
    });

    useEffect(() => {
        if (forceReset) {
            try {
                const state = loadState() || {};
                if (state[cvId]) {
                    delete state[cvId];
                    saveState(state);
                }
            } catch (e) {}
            setData({});
            setSectionOrder(DEFAULT_SECTION_ORDER);
            setSectionTitles(DEFAULT_SECTION_TITLES);
            setStyleConfig({ ...DEFAULT_STYLE_CONFIG, accentColor: getTemplateAccent(templateId) });
            setCvName("CV của tôi");
            setLastSaved(null);
            return;
        }
        try {
            const state = loadState() || {};
            const savedCv = state[cvId];
            if (savedCv) {
                if (savedCv.data) setData(savedCv.data);
                if (savedCv.sectionOrder) setSectionOrder(savedCv.sectionOrder);
                if (savedCv.sectionTitles) setSectionTitles(savedCv.sectionTitles);
                if (savedCv.styleConfig) {
                    setStyleConfig(prev => ({
                        ...DEFAULT_STYLE_CONFIG,
                        ...savedCv.styleConfig,
                        accentColor: savedCv.styleConfig.accentColor || getTemplateAccent(templateId)
                    }));
                }
                if (savedCv.cvName) setCvName(savedCv.cvName);
                if (savedCv.updatedAt) setLastSaved(savedCv.updatedAt);
            }
        } catch (err) {
            console.error("Error loading saved state:", err);
        }
    }, [cvId, templateId, forceReset]);

    useEffect(() => {
        if (!isAutoSaveEnabled) {
            setAutoSaveStatus('');
            return;
        }
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        setAutoSaveStatus('saving');
        autoSaveTimerRef.current = setTimeout(() => {
            try {
                const state = loadState() || {};
                const now = new Date().toISOString();
                state[cvId] = {
                    templateId, data, cvName, sectionOrder,
                    sectionTitles, styleConfig, updatedAt: now
                };
                state._cvList = state._cvList || [];
                const existingIndex = state._cvList.findIndex(cv => cv.id === cvId);
                const listItem = {
                    id: cvId, templateId, name: cvName,
                    accent: styleConfig?.accentColor || getTemplateAccent(templateId),
                    updatedAt: "Vừa xong"
                };
                if (existingIndex >= 0) state._cvList[existingIndex] = listItem;
                else state._cvList.push(listItem);
                saveState(state);
                setLastSaved(now);
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus(prev => prev === 'saved' ? '' : prev), 3000);
            } catch (err) {
                console.error("Auto-save error:", err);
            }
        }, 2000);
        return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
    }, [data, sectionOrder, sectionTitles, styleConfig, cvName, cvId, templateId, isAutoSaveEnabled]);

    useEffect(() => () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); }, []);

    const handleSave = () => {
        setIsSaving(true);
        try {
            const state = loadState() || {};
            const now = new Date().toISOString();
            state[cvId] = {
                templateId, data, cvName, sectionOrder,
                sectionTitles, styleConfig, updatedAt: now
            };
            state._cvList = state._cvList || [];
            const existingIndex = state._cvList.findIndex(cv => cv.id === cvId);
            const listItem = {
                id: cvId, templateId, name: cvName,
                accent: styleConfig?.accentColor || getTemplateAccent(templateId),
                updatedAt: "Vừa xong"
            };
            if (existingIndex >= 0) state._cvList[existingIndex] = listItem;
            else state._cvList.push(listItem);
            saveState(state);
            setLastSaved(now);
        } catch (err) {
            console.error("Save error:", err);
        }
        setTimeout(() => setIsSaving(false), 500);
    };

    const toggleAutoSave = () => {
        const newValue = !isAutoSaveEnabled;
        setIsAutoSaveEnabled(newValue);
        try { localStorage.setItem('cv_autosave_enabled', JSON.stringify(newValue)); } catch (e) {}
        if (!newValue && autoSaveTimerRef.current) { clearTimeout(autoSaveTimerRef.current); setAutoSaveStatus(''); }
    };

    const handleChange = (section, val) => setData(prev => ({ ...prev, [section]: val }));

    const handleExportPDF = async () => {
        setIsExporting(true);
        await new Promise(r => setTimeout(r, 350));
        await exportToPDF("cv-paper", `${cvName || "CV"}.pdf`);
        setIsExporting(false);
    };

    const getStatusText = () => {
        if (isSaving) return "⏳ Đang lưu...";
        if (autoSaveStatus === 'saving') return "💾 Đang tự động lưu...";
        if (autoSaveStatus === 'saved') return "✓ Đã tự động lưu";
        if (lastSaved) return `Lưu lần cuối: ${new Date(lastSaved).toLocaleTimeString()}`;
        return "Chưa lưu";
    };

    const safeStyleConfig = styleConfig || DEFAULT_STYLE_CONFIG;

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
            background: "#e8e8e8"
        }}>
            {!isPreviewMode && <UnifiedToolbar />}
            <div style={{
                background: "white",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                height: 52,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                zIndex: 100,
                flexShrink: 0,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={onBack} style={{
                        padding: "6px 14px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        background: "white",
                        fontSize: 13,
                        cursor: "pointer",
                        color: "#555"
                    }}>
                        ← Quay lại
                    </button>
                    <div>
                        <input
                            value={cvName}
                            onChange={e => setCvName(e.target.value)}
                            style={{
                                border: "none",
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#111",
                                outline: "none",
                                background: "transparent",
                                width: 180
                            }}
                        />
                        <div style={{
                            fontSize: 11,
                            color: "#aaa",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        }}>
                            {templateId} · <span style={{
                                color: autoSaveStatus === 'saved' ? '#10b981' : (autoSaveStatus === 'saving' ? '#f59e0b' : '#aaa'),
                                fontWeight: autoSaveStatus ? 500 : 400
                            }}>
                                {getStatusText()}
                            </span>
                        </div>
                    </div>
                </div>

                {}
                <div style={{
                    display: "flex",
                    background: "#f3f4f6",
                    borderRadius: 8,
                    padding: 3,
                    gap: 2
                }}>
                    {[
                        ["✏️ Chỉnh sửa", false],
                        ["👁 Xem trước", true]
                    ].map(([label, mode]) => (
                        <button
                            key={String(mode)}
                            onClick={() => setIsPreviewMode(mode)}
                            style={{
                                padding: "6px 18px",
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: 13,
                                background: isPreviewMode === mode ? "white" : "transparent",
                                color: "#888",
                                fontWeight: isPreviewMode === mode ? 600 : 400,
                                boxShadow: isPreviewMode === mode ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f3f4f6",
                        borderRadius: 6,
                        padding: "2px",
                        border: "1px solid #e5e7eb"
                    }}>
                        <button onClick={() => setZoom(z => Math.max(40, z - 10))} style={{
                            width: 26, height: 26, border: "none",
                            background: "transparent", cursor: "pointer", fontSize: 16
                        }}>−</button>
                        <span style={{
                            fontSize: 12, minWidth: 38, textAlign: "center", fontWeight: 500
                        }}>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={{
                            width: 26, height: 26, border: "none",
                            background: "transparent", cursor: "pointer", fontSize: 16
                        }}>+</button>
                    </div>

                    <button
                        onClick={toggleAutoSave}
                        title={isAutoSaveEnabled ? "Tự động lưu đang BẬT" : "Tự động lưu đang TẮT"}
                        style={{
                            padding: "6px 12px",
                            background: isAutoSaveEnabled ? "#dcfce7" : "#f3f4f6",
                            color: isAutoSaveEnabled ? "#166534" : "#666",
                            border: `1px solid ${isAutoSaveEnabled ? "#86efac" : "#e5e7eb"}`,
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 5
                        }}
                    >
                        <span>{isAutoSaveEnabled ? "⚡" : "💤"}</span>
                        <span>Tự động lưu</span>
                        <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: isAutoSaveEnabled ? "#22c55e" : "#9ca3af"
                        }} />
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            padding: "6px 16px",
                            background: "#374151",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity: isSaving ? 0.7 : 1
                        }}
                    >
                        {isSaving ? "⏳ Đang lưu..." : "💾 Lưu"}
                    </button>

                    <button
                        onClick={handleExportPDF}
                        style={{
                            padding: "6px 20px",
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        📄 PDF
                    </button>
                </div>
            </div>

            {}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {}
                {!isPreviewMode && (
                    <SidebarControlPanel
                        styleConfig={safeStyleConfig}
                        onStyleChange={setStyleConfig}
                        sectionOrder={sectionOrder}
                        setSectionOrder={setSectionOrder}
                        sectionTitles={sectionTitles}
                        setSectionTitles={setSectionTitles}
                        data={data}
                        onDataChange={setData}
                    />
                )}

                {}
                <div style={{
                    flex: 1,
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "center",
                    padding: "40px",
                    background: "#e8e8e8"
                }}>
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
                        <CVRenderer
                            templateId={templateId}
                            data={data}
                            onChange={handleChange}
                            isEdit={!isPreviewMode && !isExporting}
                            accent={safeStyleConfig.accentColor}
                            styleConfig={safeStyleConfig}
                            onStyleChange={patch => setStyleConfig(prev => ({ ...prev, ...patch }))}
                            sectionOrder={sectionOrder}
                            setSectionOrder={setSectionOrder}
                            sectionTitles={sectionTitles}
                            setSectionTitles={setSectionTitles}
                        
                            forceReset={forceReset}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}