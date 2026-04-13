import { useState, useEffect, useRef } from "react";
import { loadState, saveState } from "./../../../utils/storage";
import { exportToPDF } from "./../../../utils/pdfExport";
import StyleControls from "./../../controls/StyleControls";
import CVRenderer from "../../cv-templates/CVRenderer";

export default function EditorScreen({ templateId, initialData, cvId, onBack }) {
    const [data, setData] = useState(initialData);
    const [zoom, setZoom] = useState(100);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [cvName, setCvName] = useState("CV của tôi");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const AUTO_SAVE_DELAY = 2000;

    // ─── AUTO-SAVE STATE ──────────────────────────────────────────────
    const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(() => {
        // Load preference from localStorage
        const saved = localStorage.getItem('cv_autosave_enabled');
        return saved ? JSON.parse(saved) : false;
    });
    const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
    const autoSaveTimerRef = useRef(null);

    // State cho style và section order
    const [sectionOrder, setSectionOrder] = useState([
        "experiences", "education", "skills", "awards", "certifications", "activities"
    ]);
    const [sectionTitles, setSectionTitles] = useState({
        experiences: "Kinh nghiệm làm việc",
        education: "Học vấn",
        skills: "Kỹ năng",
        activities: "Hoạt động ngoại khóa",
        awards: "Thành tích & Giải thưởng",
        certifications: "Chứng chỉ",
        summary: "Mục tiêu nghề nghiệp"
    });
    const [styleConfig, setStyleConfig] = useState({
        fontFamily: "'DM Sans', sans-serif",
        baseFontSize: 13,
        lineHeight: 1.6,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        accentColor: getTemplateAccent(templateId),
        textColor: "#111111", 
        backgroundColor: "#ffffff"
    });

    function getTemplateAccent(id) {
        const colors = {
            classic: "#2C3E6B",
            modern: "#1A6B5A",
            minimal: "#1C1C1C",
            professional: "#8B1A1A",
            creative: "#5B2D8E"
        };
        return colors[id] || "#2C3E6B";
    }

    // Load saved data
    useEffect(() => {
        const state = loadState();
        if (state[cvId]) {
            if (state[cvId].data) setData(state[cvId].data);
            if (state[cvId].sectionOrder) setSectionOrder(state[cvId].sectionOrder);
            if (state[cvId].sectionTitles) setSectionTitles(state[cvId].sectionTitles);
            if (state[cvId].styleConfig) setStyleConfig(state[cvId].styleConfig);
            if (state[cvId].cvName) setCvName(state[cvId].cvName);
            setLastSaved(state[cvId].updatedAt);
        }
    }, [cvId]);

    // ─── AUTO-SAVE EFFECT ─────────────────────────────────────────────
    useEffect(() => {
        if (!isAutoSaveEnabled) {
            setAutoSaveStatus('');
            return;
        }

        // Clear existing timer
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        setAutoSaveStatus('saving');

        // Debounce save after 2 seconds of inactivity
        autoSaveTimerRef.current = setTimeout(() => {
            const state = loadState();
            const now = new Date().toISOString();

            state[cvId] = {
                templateId,
                data,
                cvName,
                sectionOrder,
                sectionTitles,
                styleConfig,
                updatedAt: now
            };

            state._cvList = state._cvList || [];
            const existingIndex = state._cvList.findIndex(cv => cv.id === cvId);
            if (existingIndex >= 0) {
                state._cvList[existingIndex] = {
                    id: cvId,
                    templateId,
                    name: cvName,
                    accent: styleConfig.accentColor,
                    updatedAt: "Vừa xong"
                };
            } else {
                state._cvList.push({
                    id: cvId,
                    templateId,
                    name: cvName,
                    accent: styleConfig.accentColor,
                    updatedAt: "Vừa xong"
                });
            }

            saveState(state);
            setLastSaved(now);
            setAutoSaveStatus('saved');

            // Clear status after 3 seconds
            setTimeout(() => {
                setAutoSaveStatus(prev => prev === 'saved' ? '' : prev);
            }, 3000);

        }, AUTO_SAVE_DELAY); // 2 seconds delay

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [data, sectionOrder, sectionTitles, styleConfig, cvName, cvId, templateId, isAutoSaveEnabled, styleConfig.accentColor]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, []);

    // Hàm LƯU THỦ CÔNG
    const handleSave = () => {
        setIsSaving(true);
        const state = loadState();
        const now = new Date().toISOString();

        state[cvId] = {
            templateId,
            data,
            cvName,
            sectionOrder,
            sectionTitles,
            styleConfig,
            updatedAt: now
        };
        state._cvList = state._cvList || [];
        const existingIndex = state._cvList.findIndex(cv => cv.id === cvId);
        if (existingIndex >= 0) {
            state._cvList[existingIndex] = { id: cvId, templateId, name: cvName, accent: styleConfig.accentColor, updatedAt: "Vừa xong" };
        } else {
            state._cvList.push({ id: cvId, templateId, name: cvName, accent: styleConfig.accentColor, updatedAt: "Vừa xong" });
        }
        saveState(state);
        setLastSaved(now);
        setTimeout(() => setIsSaving(false), 500);
    };

    // Toggle Auto-save
    const toggleAutoSave = () => {
        const newValue = !isAutoSaveEnabled;
        setIsAutoSaveEnabled(newValue);
        localStorage.setItem('cv_autosave_enabled', JSON.stringify(newValue));

        if (!newValue && autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            setAutoSaveStatus('');
        }
    };

    const handleChange = (section, val) => {
        setData(prev => ({ ...prev, [section]: val }));
    };

    // Cập nhật tiêu đề section
    const handleTitleChange = (sectionKey, newTitle) => {
        setSectionTitles(prev => ({ ...prev, [sectionKey]: newTitle }));
    };

    const handleExportPDF = () => {
        exportToPDF("cv-paper", `${cvName || "CV"}.pdf`);
    };

    // Helper để hiển thị status
    const getStatusText = () => {
        if (isSaving) return "⏳ Đang lưu...";
        if (autoSaveStatus === 'saving') return "💾 Đang tự động lưu...";
        if (autoSaveStatus === 'saved') return "✓ Đã tự động lưu";
        if (lastSaved) return `Lưu lần cuối: ${new Date(lastSaved).toLocaleTimeString()}`;
        return "Chưa lưu";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#e8e8e8" }}>
            {/* Toolbar */}
            <div style={{
                height: 60,
                background: "white",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                zIndex: 100
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <button onClick={onBack} style={{
                        padding: "8px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        background: "white",
                        fontSize: 13,
                        cursor: "pointer",
                        color: "#555"
                    }}>← Quay lại</button>

                    <div>
                        <input
                            value={cvName}
                            onChange={e => setCvName(e.target.value)}
                            style={{
                                border: "none",
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#111",
                                outline: "none",
                                background: "transparent",
                                width: 200
                            }}
                        />
                        <div style={{ fontSize: 12, color: "#aaa", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                            {templateId} · <span style={{
                                color: autoSaveStatus === 'saved' ? '#10b981' : (autoSaveStatus === 'saving' ? '#f59e0b' : '#aaa'),
                                fontWeight: autoSaveStatus ? 500 : 400
                            }}>{getStatusText()}</span>
                        </div>
                    </div>
                </div>

                {/* Mode toggle */}
                <div style={{
                    display: "flex",
                    background: "#f3f4f6",
                    borderRadius: 8,
                    padding: 3,
                    gap: 2
                }}>
                    <button
                        onClick={() => setIsPreviewMode(false)}
                        style={{
                            padding: "8px 20px",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 13,
                            background: !isPreviewMode ? "white" : "transparent",
                            color: "#888",
                            fontWeight: !isPreviewMode ? 600 : 400,
                            boxShadow: !isPreviewMode ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                        }}
                    >
                        ✏️ Chỉnh sửa
                    </button>
                    <button
                        onClick={() => setIsPreviewMode(true)}
                        style={{
                            padding: "8px 20px",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 13,
                            background: isPreviewMode ? "white" : "transparent",
                            color: "#888",
                            fontWeight: isPreviewMode ? 600 : 400,
                            boxShadow: isPreviewMode ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                        }}
                    >
                        👁 Xem trước
                    </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Zoom */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#f3f4f6",
                        borderRadius: 6,
                        padding: "2px",
                        border: "1px solid #e5e7eb"
                    }}>
                        <button onClick={() => setZoom(z => Math.max(40, z - 10))} style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", fontSize: 16 }}>−</button>
                        <span style={{ fontSize: 12, minWidth: 40, textAlign: "center", fontWeight: 500 }}>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(150, z + 10))} style={{ width: 28, height: 28, border: "none", background: "transparent", cursor: "pointer", fontSize: 16 }}>+</button>
                    </div>

                    {/* AUTO-SAVE TOGGLE */}
                    <button
                        onClick={toggleAutoSave}
                        title={isAutoSaveEnabled ? "Tự động lưu đang BẬT" : "Tự động lưu đang TẮT"}
                        style={{
                            padding: "8px 16px",
                            background: isAutoSaveEnabled ? "#dcfce7" : "#f3f4f6",
                            color: isAutoSaveEnabled ? "#166534" : "#666",
                            border: `1px solid ${isAutoSaveEnabled ? "#86efac" : "#e5e7eb"}`,
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.2"
                        }}
                    >
                        <span style={{ fontSize: 14 }}>{isAutoSaveEnabled ? "⚡" : "💤"}</span>
                        <span>Tự động lưu</span>
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: isAutoSaveEnabled ? "#22c55e" : "#9ca3af",
                            marginLeft: 4
                        }} />
                    </button>

                    {/* NÚT LƯU THỦ CÔNG */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            padding: "8px 20px",
                            background: "#736b6b",
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

                    {/* Export PDF */}
                    <button
                        onClick={handleExportPDF}
                        style={{
                            padding: "8px 20px",
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

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Style Controls */}
                {!isPreviewMode && (
                    <StyleControls
                        styleConfig={styleConfig}
                        onChange={setStyleConfig}
                        accent={styleConfig.accentColor}
                        sectionOrder={sectionOrder}          // 👈 bắt buộc
                        setSectionOrder={setSectionOrder}
                    />
                )}

                {/* Preview area */}
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
                            isEdit={!isPreviewMode}
                            accent={styleConfig.accentColor}
                            styleConfig={styleConfig}
                            sectionOrder={sectionOrder}
                            setSectionOrder={setSectionOrder}
                            sectionTitles={sectionTitles}
                            setSectionTitles={setSectionTitles}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}