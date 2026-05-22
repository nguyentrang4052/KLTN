import { useState, useEffect, useRef, useCallback } from "react";
import { loadState, saveState } from "./../../../utils/storage";
import { exportToPDF } from "./../../../utils/pdfExport";
import CVRenderer from "../../cv-templates/CVRenderer";
import UnifiedToolbar from "../../common/UnifiedToolbar/UnifiedToolbar";
import { getToken } from '../../../utils/auth'

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
    const [activeTab, setActiveTab] = useState("font");

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

            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                {activeTab === "font" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

                {activeTab === "design" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

const EMPTY_CV_DATA = {
    personalInfo: {
        fullName: "", portfolio: "", email: "", phone: "", address: "", linkedin: "", avatar: ""
    },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    awards: [],
    certifications: [],
    activities: []
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper gọi API trực tiếp
async function callApi(endpoint, method, body) {

    const cleanBody = { ...body };
    if (cleanBody.cvData?.personalInfo?.avatar) {
        cleanBody.cvData = {
            ...cleanBody.cvData,
            personalInfo: {
                ...cleanBody.cvData.personalInfo,
                avatar: undefined  // loại bỏ avatar
            }
        };
    }

    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `API error: ${res.status}`);
    }
    return res.json();
}

export default function EditorScreen({ templateId, initialData, cvId, onBack, forceReset = false, resetTimestamp }) {
    const [editorResetKey, setEditorResetKey] = useState(0);
    const isResettingRef = useRef(false);
    const appliedResetTimestampRef = useRef(null);

    const [data, setData] = useState(() => {
        if (forceReset) return EMPTY_CV_DATA;
        return initialData || {};
    });
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

    // ---- Tính năng dịch thuật ----
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedData, setTranslatedData] = useState(null);
    const [showTranslated, setShowTranslated] = useState(false);
    const [targetLang, setTargetLang] = useState('en');

    // ---- Tính năng AI Assist ----
    const [assistModalOpen, setAssistModalOpen] = useState(false);
    const [assistPrompt, setAssistPrompt] = useState('');
    const [assistSuggestions, setAssistSuggestions] = useState(null);
    const [isAssisting, setIsAssisting] = useState(false);
    const [activeSection, setActiveSection] = useState(null); // null = tổng thể
    const [selectedSuggestions, setSelectedSuggestions] = useState({});


    const getSelectableSuggestionItems = (suggestions) => {
        const items = [];
        if (suggestions.summary) {
            items.push({ path: 'summary', label: '📝 Mục tiêu nghề nghiệp (Summary)', value: suggestions.summary, type: 'summary' });
        }
        if (suggestions.skills && Array.isArray(suggestions.skills)) {
            suggestions.skills.forEach((skill, idx) => {
                items.push({ path: `skills.${idx}`, label: `🔧 Kỹ năng: ${skill.category || 'General'}`, value: skill, type: 'skills', index: idx });
            });
        }
        if (suggestions.experiences && Array.isArray(suggestions.experiences)) {
            suggestions.experiences.forEach((exp, idx) => {
                items.push({ path: `experiences.${idx}`, label: `💼 Kinh nghiệm: ${exp.position} tại ${exp.company}`, value: exp, type: 'experiences', index: idx });
            });
        }
        if (suggestions.education && Array.isArray(suggestions.education)) {
            suggestions.education.forEach((edu, idx) => {
                items.push({ path: `education.${idx}`, label: `🎓 Học vấn: ${edu.degree} tại ${edu.institution}`, value: edu, type: 'education', index: idx });
            });
        }
        if (suggestions.certifications && Array.isArray(suggestions.certifications)) {
            suggestions.certifications.forEach((cert, idx) => {
                items.push({ path: `certifications.${idx}`, label: `📜 Chứng chỉ: ${cert.name}`, value: cert, type: 'certifications', index: idx });
            });
        }
        if (suggestions.awards && Array.isArray(suggestions.awards)) {
            suggestions.awards.forEach((award, idx) => {
                items.push({ path: `awards.${idx}`, label: `🏆 Giải thưởng: ${award.title}`, value: award, type: 'awards', index: idx });
            });
        }
        if (suggestions.activities && Array.isArray(suggestions.activities)) {
            suggestions.activities.forEach((act, idx) => {
                items.push({ path: `activities.${idx}`, label: `🌟 Hoạt động: ${act.role} tại ${act.organization}`, value: act, type: 'activities', index: idx });
            });
        }
        return items;
    };


    useEffect(() => {
        if (assistSuggestions) {
            const items = getSelectableSuggestionItems(assistSuggestions);
            const initialSelected = {};
            items.forEach(item => { initialSelected[item.path] = true; });
            setSelectedSuggestions(initialSelected);
        }
    }, [assistSuggestions]);


    const applySelectedSuggestions = () => {
        if (!assistSuggestions) return;
        const items = getSelectableSuggestionItems(assistSuggestions);
        const newData = JSON.parse(JSON.stringify(data));
        let hasChanges = false;

        items.forEach(item => {
            if (selectedSuggestions[item.path]) {
                switch (item.type) {
                    case 'summary':
                        newData.summary = item.value;
                        hasChanges = true;
                        break;
                    case 'skills':
                        if (!newData.skills) newData.skills = [];
                        newData.skills[item.index] = item.value;
                        hasChanges = true;
                        break;
                    case 'experiences':
                        if (!newData.experiences) newData.experiences = [];
                        newData.experiences[item.index] = item.value;
                        hasChanges = true;
                        break;
                    case 'education':
                        if (!newData.education) newData.education = [];
                        newData.education[item.index] = item.value;
                        hasChanges = true;
                        break;
                    case 'certifications':
                        if (!newData.certifications) newData.certifications = [];
                        newData.certifications[item.index] = item.value;
                        hasChanges = true;
                        break;
                    case 'awards':
                        if (!newData.awards) newData.awards = [];
                        newData.awards[item.index] = item.value;
                        hasChanges = true;
                        break;
                    case 'activities':
                        if (!newData.activities) newData.activities = [];
                        newData.activities[item.index] = item.value;
                        hasChanges = true;
                        break;
                    default:
                        break;
                }
            }
        });

        if (hasChanges) {
            setData(newData);
        }
        setAssistModalOpen(false);
    };


    // ---------- Effect xử lý reset (giữ nguyên) ----------
    useEffect(() => {
        if (!resetTimestamp) return;
        if (appliedResetTimestampRef.current === resetTimestamp) return;

        appliedResetTimestampRef.current = resetTimestamp;
        isResettingRef.current = true;

        try {
            const state = loadState() || {};
            if (state[cvId]) {
                delete state[cvId];
                saveState(state);
            }
        } catch (e) { }

        setData(EMPTY_CV_DATA);
        setSectionOrder(DEFAULT_SECTION_ORDER);
        setSectionTitles(DEFAULT_SECTION_TITLES);
        setStyleConfig({ ...DEFAULT_STYLE_CONFIG, accentColor: getTemplateAccent(templateId) });
        setCvName("CV của tôi");
        setLastSaved(null);
        setEditorResetKey(prev => prev + 1);

        setTimeout(() => { isResettingRef.current = false; }, 0);
    }, [resetTimestamp, cvId, templateId]);

    useEffect(() => {
        const loadCVFromAPI = async () => {
            if (!cvId) return;
            try {
                const token = getToken();
                const res = await fetch(`${API_BASE}/cv-builder/detail/${cvId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load CV');
                const full = await res.json();
                const saved = full.data || {};
                if (saved.cvData) setData(saved.cvData);
                if (saved.sectionOrder) setSectionOrder(saved.sectionOrder);
                if (saved.sectionTitles) setSectionTitles(saved.sectionTitles);
                if (saved.styleConfig) {
                    setStyleConfig(prev => ({ ...DEFAULT_STYLE_CONFIG, ...saved.styleConfig }));
                }
                if (full.name) setCvName(full.name);
                if (full.updatedAt) setLastSaved(full.updatedAt);
            } catch (err) {
                console.error("Error loading CV from API:", err);
            }
        };
        loadCVFromAPI();
    }, [cvId]);

    useEffect(() => () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); }, []);

    const performSave = async (dataToSave, titles, order, config, name) => {
        try {
            const token = getToken();
            const res = await fetch(`${API_BASE}/cv-builder/update/${cvId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    data: {
                        cvData: dataToSave,
                        sectionTitles: titles,
                        sectionOrder: order,
                        styleConfig: config
                    }
                })
            });
            if (!res.ok) throw new Error('Save failed');
            setLastSaved(new Date().toISOString());
            return true;
        } catch (err) {
            console.error("Save error:", err);
            return false;
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await performSave(data, sectionTitles, sectionOrder, styleConfig, cvName);
        setIsSaving(false);
    };

    // Auto-save effect (same as before but using performSave)
    useEffect(() => {
        if (!isAutoSaveEnabled) return;
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        setAutoSaveStatus('saving');
        autoSaveTimerRef.current = setTimeout(async () => {
            const success = await performSave(data, sectionTitles, sectionOrder, styleConfig, cvName);
            setAutoSaveStatus(success ? 'saved' : 'error');
            setTimeout(() => setAutoSaveStatus(prev => prev === 'saved' ? '' : prev), 3000);
        }, 2000);
        return () => clearTimeout(autoSaveTimerRef.current);
    }, [data, sectionOrder, sectionTitles, styleConfig, cvName, cvId, isAutoSaveEnabled]);

    const toggleAutoSave = () => {
        const newValue = !isAutoSaveEnabled;
        setIsAutoSaveEnabled(newValue);
        try { localStorage.setItem('cv_autosave_enabled', JSON.stringify(newValue)); } catch (e) { }
        if (!newValue && autoSaveTimerRef.current) { clearTimeout(autoSaveTimerRef.current); setAutoSaveStatus(''); }
    };

    const handleChange = (section, val) => setData(prev => ({ ...prev, [section]: val }));

    const handleExportPDF = async () => {
        setIsExporting(true);
        await new Promise(r => setTimeout(r, 500));
        const paperEl = document.getElementById("cv-paper");
        if (paperEl) {
            const parent = paperEl.parentElement;
            const prevTransform = parent?.style.transform;
            if (parent) parent.style.transform = "scale(1)";
            await exportToPDF("cv-paper", `${cvName || "CV"}.pdf`);
            if (parent && prevTransform !== undefined) {
                parent.style.transform = prevTransform;
            }
        } else {
            await exportToPDF("cv-paper", `${cvName || "CV"}.pdf`);
        }
        setIsExporting(false);
    };

    const getStatusText = () => {
        if (isSaving) return "⏳ Đang lưu...";
        if (autoSaveStatus === 'saving') return "💾 Đang tự động lưu...";
        if (autoSaveStatus === 'saved') return "✓ Đã tự động lưu";
        if (lastSaved) return `Lưu lần cuối: ${new Date(lastSaved).toLocaleTimeString()}`;
        return "Chưa lưu";
    };

    // ---------- API handlers ----------
    const [translatedSectionTitles, setTranslatedSectionTitles] = useState(null);
    const handleTranslate = async () => {
        if (!data) return;
        setIsTranslating(true);
        try {
            // Gửi kèm cả sectionTitles và sectionOrder (nếu cần)
            const payload = {
                cvData: data,
                targetLang,
                sectionTitles,   // thêm dòng này
                // sectionOrder    // có thể cần để giữ thứ tự
            };
            const result = await callApi('/cv-assistant/translate', 'POST', payload);
            setTranslatedData(result.data.cvData);
            // Cập nhật cả sectionTitles đã dịch nếu có
            if (result.data.sectionTitles) {
                setTranslatedSectionTitles(result.data.sectionTitles);
            }
            setShowTranslated(true);
        } catch (error) {
            console.error('Translation failed:', error);
            alert('Dịch CV thất bại: ' + error.message);
        } finally {
            setIsTranslating(false);
        }
    };

    const applyTranslation = () => {
        if (!translatedData) return;

        // Merge dữ liệu: giữ lại field nào của translated, nếu thiếu thì dùng data gốc
        const mergedData = { ...data };
        const deepMerge = (target, source) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else if (source[key] !== undefined && source[key] !== null) {
                    target[key] = source[key];
                }
            }
        };
        deepMerge(mergedData, translatedData);

        setData(mergedData);
        if (translatedSectionTitles) {
            setSectionTitles(translatedSectionTitles);
        }
        setShowTranslated(false);
        setTranslatedData(null);
        setTranslatedSectionTitles(null);
    };

    const openAssistModal = (section = null) => {
        setActiveSection(section);
        setAssistPrompt('');
        setAssistSuggestions(null);
        setAssistModalOpen(true);
    };

    const generateSuggestions = async () => {
        if (!assistPrompt.trim()) return;
        setIsAssisting(true);
        try {
            const result = await callApi('/cv-assistant/suggest', 'POST', {
                cvData: data,
                prompt: assistPrompt,
                section: activeSection,
            });
            // Kiểm tra cấu trúc response
            console.log('API response:', result);
            if (result.data) {
                setAssistSuggestions(result.data);
            } else {
                setAssistSuggestions(result);
            }
        } catch (error) {
            console.error('Suggestion failed:', error);
            alert('Lỗi: ' + (error.message || 'Không thể tạo gợi ý'));
        } finally {
            setIsAssisting(false);
        }
    };

    const applySuggestions = () => {
        if (!assistSuggestions) {
            console.warn('No suggestions to apply');
            return;
        }

        console.log('Applying suggestions:', assistSuggestions);

        // Clone sâu để tránh mutation
        const newData = JSON.parse(JSON.stringify(data));
        let hasChanges = false;

        // Cập nhật từng trường nếu có
        if (assistSuggestions.summary) {
            newData.summary = assistSuggestions.summary;
            hasChanges = true;
        }
        if (assistSuggestions.skills && Array.isArray(assistSuggestions.skills)) {
            newData.skills = assistSuggestions.skills;
            hasChanges = true;
        }
        if (assistSuggestions.experiences && Array.isArray(assistSuggestions.experiences)) {
            newData.experiences = assistSuggestions.experiences;
            hasChanges = true;
        }
        if (assistSuggestions.education && Array.isArray(assistSuggestions.education)) {
            newData.education = assistSuggestions.education;
            hasChanges = true;
        }
        if (assistSuggestions.certifications && Array.isArray(assistSuggestions.certifications)) {
            newData.certifications = assistSuggestions.certifications;
            hasChanges = true;
        }
        if (assistSuggestions.awards && Array.isArray(assistSuggestions.awards)) {
            newData.awards = assistSuggestions.awards;
            hasChanges = true;
        }
        if (assistSuggestions.activities && Array.isArray(assistSuggestions.activities)) {
            newData.activities = assistSuggestions.activities;
            hasChanges = true;
        }

        if (hasChanges) {
            setData(newData);
            console.log('CV updated successfully');
        } else {
            console.warn('No valid fields to update from suggestions');
        }

        setAssistModalOpen(false);
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
                    {/* Nhóm nút Dịch thuật */}
                    <div style={{ display: "flex", gap: 6, alignItems: "center", background: "#f3f4f6", borderRadius: 8, padding: "2px 6px" }}>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 4, background: "white" }}
                        >
                            <option value="en">English</option>
                            <option value="vi">Tiếng Việt</option>
                        </select>
                        <button
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            style={{
                                padding: "4px 12px",
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: isTranslating ? "not-allowed" : "pointer",
                                opacity: isTranslating ? 0.6 : 1,
                            }}
                        >
                            {isTranslating ? "Đang dịch..." : (showTranslated ? "Đang xem bản dịch" : "Dịch")}
                        </button>
                        {showTranslated && (
                            <>
                                <button onClick={applyTranslation} style={{ padding: "4px 12px", background: "#16a34a", color: "white", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
                                    Áp dụng
                                </button>
                                <button onClick={() => setShowTranslated(false)} style={{ padding: "4px 12px", background: "#6b7280", color: "white", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
                                    Hủy
                                </button>
                            </>
                        )}
                    </div>

                    {/* Nút AI Assist tổng thể */}
                    {/* <button
                        onClick={() => openAssistModal(null)}
                        style={{
                            padding: "4px 12px",
                            background: "#8b5cf6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        ✨ AI Assist
                    </button> */}

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

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
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
                            data={showTranslated && translatedData ? translatedData : data}
                            onChange={handleChange}
                            isEdit={!isPreviewMode && !isExporting}
                            accent={safeStyleConfig.accentColor}
                            styleConfig={safeStyleConfig}
                            onStyleChange={patch => setStyleConfig(prev => ({ ...prev, ...patch }))}
                            sectionOrder={sectionOrder}
                            setSectionOrder={setSectionOrder}
                            sectionTitles={sectionTitles}
                            setSectionTitles={setSectionTitles}
                            editorResetKey={editorResetKey}
                            onAIAssist={openAssistModal}
                            data={showTranslated && translatedData ? translatedData : data}
                            sectionTitles={showTranslated && translatedSectionTitles ? translatedSectionTitles : sectionTitles}
                        />
                    </div>
                </div>
            </div>

            {/* Modal AI Assist */}
            {assistModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{
                        background: "white", padding: 24, borderRadius: 12, maxWidth: 600, width: "90%", maxHeight: "80vh", overflow: "auto"
                    }}>

                        <h3 style={{ marginBottom: 12 }}>✨ AI chỉnh sửa CV</h3>
                        {activeSection && (
                            <p style={{ marginBottom: 12, color: "#6b21a5" }}>
                                Đang cải thiện phần: <strong>{sectionTitles[activeSection] || activeSection}</strong>
                            </p>
                        )}
                        <textarea
                            rows={4}
                            placeholder='Ví dụ: "Tôi là frontend dev, 2 năm kinh nghiệm, dùng React, muốn apply product company"'
                            value={assistPrompt}
                            onChange={(e) => setAssistPrompt(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 12, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }}
                        />
                        <button
                            onClick={generateSuggestions}
                            disabled={isAssisting || !assistPrompt.trim()}
                            style={{
                                padding: "8px 16px",
                                background: "#8b5cf6",
                                color: "white",
                                border: "none",
                                borderRadius: 6,
                                cursor: (isAssisting || !assistPrompt.trim()) ? "not-allowed" : "pointer",
                                opacity: (isAssisting || !assistPrompt.trim()) ? 0.6 : 1,
                                marginBottom: 16,
                            }}
                        >
                            {isAssisting ? "Đang suy nghĩ..." : "Gợi ý"}
                        </button>
                        <button onClick={() => setAssistModalOpen(false)} style={{ padding: "8px 16px", background: "#6b7280", color: "white", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: "10px" }}>
                            ❌ Đóng
                        </button>

                        {assistSuggestions && (
                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
                                <h4 style={{ marginBottom: 12 }}>✨ Chọn các đề xuất muốn áp dụng</h4>
                                <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
                                    {getSelectableSuggestionItems(assistSuggestions).map(item => (
                                        <label key={item.path} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12, fontSize: 13 }}>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedSuggestions[item.path]}
                                                onChange={(e) => setSelectedSuggestions(prev => ({ ...prev, [item.path]: e.target.checked }))}
                                                style={{ marginTop: 2 }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 500 }}>{item.label}</div>
                                                <div style={{ background: '#f3f4f6', padding: 6, borderRadius: 4, marginTop: 4, fontSize: 12, whiteSpace: 'pre-wrap' }}>
                                                    {typeof item.value === 'string' ? item.value : JSON.stringify(item.value, null, 2)}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {/* Lời khuyên bổ sung - không có checkbox */}
                                {assistSuggestions.suggestions && (
                                    <div style={{ marginBottom: 16, background: '#fef3c7', padding: 10, borderRadius: 6 }}>
                                        <strong>💡 Lời khuyên thêm:</strong>
                                        <p style={{ marginTop: 6, fontSize: 13 }}>{assistSuggestions.suggestions}</p>
                                    </div>
                                )}
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button onClick={applySelectedSuggestions} style={{ padding: "8px 16px", background: "#16a34a", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                                        ✅ Áp dụng mục đã chọn
                                    </button>
                                    <button onClick={() => setAssistModalOpen(false)} style={{ padding: "8px 16px", background: "#6b7280", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                                        ❌ Đóng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}