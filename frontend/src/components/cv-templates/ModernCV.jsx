import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "../common/ItemControls/ItemControls";
import { registerActiveField, clearActiveField } from "../common/UnifiedToolbar/UnifiedToolbar";

const SAMPLE_DATA = {
  personalInfo: {
    fullName: "NGUYỄN VĂN A",
    portfolio: "Chuyên viên Marketing / Product Manager",
    email: "nguyenvana@email.com",
    phone: "0912 345 678",
    address: "Quận 1, TP. Hồ Chí Minh",
    linkedin: "linkedin.com/in/nguyenvana"
  },
  summary: "Chuyên viên Marketing với 5 năm kinh nghiệm trong lĩnh vực Digital Marketing và Brand Management. Có khả năng phân tích thị trường, xây dựng chiến lược thương hiệu và quản lý dự án hiệu quả.",
  experiences: [
    { company: "Công ty TNHH ABC", position: "Senior Marketing Specialist", duration: "01/2022 – Hiện tại", description: "• Xây dựng và triển khai chiến lược marketing tổng thể\n• Quản lý ngân sách marketing 2 tỷ đồng/năm, tối ưu ROI đạt 150%\n• Dẫn dắt team 5 người thực hiện các chiến dịch digital marketing" },
    { company: "Công ty XYZ", position: "Marketing Executive", duration: "06/2020 – 12/2021", description: "• Thực hiện các chiến dịch quảng cáo trên Facebook Ads và Google Ads\n• Phân tích dữ liệu khách hàng và đề xuất chiến lược tối ưu" }
  ],
  education: [{ institution: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)", degree: "Cử nhân Quản trị Kinh doanh", year: "2016 – 2020", gpa: "GPA: 3.6/4.0" }],
  skills: [
    { category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads, Content Marketing" },
    { category: "Thiết kế", items: "Photoshop, Illustrator, Figma, Canva" },
    { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio" },
    { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }
  ],
  awards: [{ title: "Nhân viên xuất sắc của năm", issuer: "Công ty TNHH ABC", year: "2023", description: "Đạt thành tích xuất sắc trong việc triển khai chiến dịch marketing" }],
  certifications: [
    { name: "Google Analytics Certification", issuer: "Google", year: "2023", score: "Pass" },
    { name: "Facebook Blueprint", issuer: "Meta", year: "2022", score: "Pass" }
  ],
  activities: [{ organization: "CLB Marketing UEH", role: "Trưởng ban Nội dung", duration: "2018 – 2020", description: "• Quản lý team 10 thành viên\n• Tổ chức các sự kiện workshop với quy mô 200+ người tham dự" }]
};

const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
const SAMPLE_SECTION_TITLES = {
  summary: "Giới thiệu", experiences: "Kinh nghiệm làm việc", education: "Học vấn",
  awards: "Giải thưởng", activities: "Hoạt động ngoại khóa", contact: "Liên hệ",
  skills: "Kỹ năng", certifications: "Chứng chỉ",
};

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
  const isComposing = useRef(false);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (document.activeElement === ref.current) return;
    const incoming = value || "";
    if (ref.current.innerHTML !== incoming) ref.current.innerHTML = incoming;
  }, [value]);

  const handleInput = useCallback(() => {
    if (isComposing.current || !ref.current) return;
    onChange(ref.current.innerHTML);
  }, [onChange]);

  const handleCompositionStart = useCallback(() => { isComposing.current = true; }, []);
  const handleCompositionEnd = useCallback(() => { isComposing.current = false; handleInput(); }, [handleInput]);

  const handleFocus = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement;
      if (active?.closest(".selection-toolbar")) return;
      if (active === ref.current || ref.current?.contains(active)) return;
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) return;
      clearActiveField();
    }, 200);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (onStyleChange) registerActiveField(onStyleChange, styleConfig);
  }, [onStyleChange, styleConfig]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !multiline) e.preventDefault();
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

// ─── DI: debounced input cho sidebar/header ───────────────────────────────────
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
      const _sel = window.getSelection();
      if (!document.activeElement?.closest(".selection-toolbar") && !(_sel && _sel.rangeCount > 0 && !_sel.isCollapsed)) clearActiveField();
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
        style={{ ...base, resize: "vertical", minHeight: 80, border: "1.5px dashed rgba(255,255,255,0.3)", borderRadius: 4, padding: "8px", boxSizing: "border-box" }} />
    );
  }
  return (
    <input ref={inputRef} type="text" value={local}
      onChange={e => change(e.target.value)}
      onFocus={handleFocus} onBlur={handleBlur}
      placeholder={placeholder}
      style={{ ...base, borderBottom: "1px dashed rgba(255,255,255,0.25)" }} />
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

// ─── TitleEdit: contenteditable cho titles ────────────────────────────────────
const TitleEdit = memo(({ value, onChange, style, styleConfig = {}, onStyleChange }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (document.activeElement === ref.current) return;
    const incoming = value || "";
    if (ref.current.innerHTML !== incoming) ref.current.innerHTML = incoming;
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
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) return;
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
      style={{ outline: "none", fontFamily: styleConfig?.fontFamily || "inherit", flex: 1, width: "100%", ...style }}
    />
  );
});

// ─── SideHead: sidebar section header ────────────────────────────────────────
const SideHead = memo(({ sectionKey, isEdit, getTitle, updateTitle, onAdd, styleConfig, onStyleChange, onAIAssist }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 4 }}>
      {isEdit ? (
        <TitleEdit
          value={getTitle(sectionKey)}
          onChange={v => updateTitle(sectionKey, v)}
          style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 2, color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}
          styleConfig={styleConfig}
          onStyleChange={onStyleChange}
        />
      ) : (
        <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 2, color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>
          {isHTML(getTitle(sectionKey))
            ? <span dangerouslySetInnerHTML={{ __html: getTitle(sectionKey) }} />
            : getTitle(sectionKey)}
        </div>
      )}
      {/* {isEdit && onAdd && (
        <button onClick={onAdd} style={{ padding: "2px 6px", fontSize: 10, background: "rgba(255,255,255,0.15)", border: "1px dashed rgba(255,255,255,0.3)", borderRadius: 3, color: "white", marginLeft: 6, cursor: "pointer" }}>+</button>
      )} */}
      {isEdit && (
        <div style={{ display: "flex", gap: 4 }}>
          {onAIAssist && (
            <button
              onClick={() => onAIAssist(sectionKey)}
              style={{ padding: "2px 6px", fontSize: 10, background: "rgba(255,255,255,0.15)", border: "1px dashed rgba(255,255,255,0.3)", borderRadius: 20, color: "white", cursor: "pointer", marginRight: 4 }}
            >
              ✨
            </button>
          )}
          {onAdd && <button onClick={onAdd} style={{ padding: "2px 6px", fontSize: 10, background: "rgba(255,255,255,0.15)", border: "1px dashed rgba(255,255,255,0.3)", borderRadius: 3, color: "white", cursor: "pointer" }}>+</button>}
        </div>
      )}
    </div>
  );
});

// ─── MainHead: main area section header ──────────────────────────────────────
const MainHead = memo(({
  sectionKey,
  idx,
  isEdit,
  accent,
  getTitle,
  updateTitle,
  moveSection,
  deleteSection,
  totalSections,
  onAdd,
  styleConfig,
  onStyleChange,
  onAIAssist }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        <div style={{ width: 4, height: 20, background: accent, borderRadius: 2 }} />
        {isEdit ? (
          <TitleEdit
            value={getTitle(sectionKey)}
            onChange={v => updateTitle(sectionKey, v)}
            style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1.5, color: accent, textTransform: "uppercase" }}
            styleConfig={styleConfig}
            onStyleChange={onStyleChange}
          />
        ) : (
          <div style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1.5, color: accent, textTransform: "uppercase" }}>
            {isHTML(getTitle(sectionKey))
              ? <span dangerouslySetInnerHTML={{ __html: getTitle(sectionKey) }} />
              : getTitle(sectionKey)}
          </div>
        )}
      </div>
      {isEdit && (
        <div style={{ display: "flex", gap: 4 }}>
           {/* AI button */}
          {onAIAssist && (
            <button
              onClick={() => onAIAssist(sectionKey)}
              style={{ fontSize: 11, color: accent, background: "white", border: `1px solid ${accent}44`, borderRadius: 20, padding: "3px 10px", cursor: "pointer", marginRight: 4 }}
            >
              ✨ AI
            </button>
          )}
          {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: accent, background: "white", border: `1px solid ${accent}44`, borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>+ Thêm</button>}
          {[["↑", -1], ["↓", 1], ["×", 0]].map(([lbl, dir]) => {
            if (lbl === "×") {
              return (
                <button key={lbl} onClick={() => deleteSection(idx)}
                  style={{ padding: "3px 7px", fontSize: 11, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: "pointer" }}>{lbl}</button>
              );
            }
            const dis = dir === -1 ? idx === 0 : idx === totalSections - 1;
            return (
              <button key={lbl} onClick={() => moveSection(idx, dir)} disabled={dis}
                style={{ padding: "3px 7px", fontSize: 11, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            );
          })}
        </div>
      )}
    </div>
  );
});

// ─── SidebarItem ─────────────────────────────────────────────────────────────
const SidebarItem = memo(({ section, idx, total, isEdit, moveItem, delItem, children }) => (
  <div style={{ marginBottom: 12, position: "relative", background: isEdit ? "rgba(255,255,255,0.05)" : "transparent", borderRadius: 4, padding: isEdit ? "8px 34px 8px 8px" : "4px 0" }}>
    {isEdit && (
      <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 2 }}>
        <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0}
          style={{ width: 18, height: 18, border: "none", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 2, fontSize: 9, cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
        <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1}
          style={{ width: 18, height: 18, border: "none", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 2, fontSize: 9, cursor: idx === total - 1 ? "not-allowed" : "pointer", opacity: idx === total - 1 ? 0.4 : 1 }}>↓</button>
        <button onClick={() => delItem(section, idx)}
          style={{ width: 18, height: 18, border: "none", background: "rgba(255,100,100,0.6)", color: "white", borderRadius: 2, fontSize: 9, cursor: "pointer" }}>×</button>
      </div>
    )}
    {children}
  </div>
));

// ─── AvatarEditor ─────────────────────────────────────────────────────────────
const AvatarEditor = memo(({ avatarUrl, isEdit, onAvatarChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAvatarChange(ev.target.result);
    reader.readAsDataURL(file);
  }, [onAvatarChange]);

  return (
    <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 20px" }}>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: avatarUrl ? "transparent" : "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.3)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
        {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
      </div>
      {isEdit && (
        <>
          <button onClick={() => fileInputRef.current?.click()} style={{
            position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%",
            background: "white", border: "none", cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }} title="Đổi ảnh đại diện">📷</button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
        </>
      )}
    </div>
  );
});

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function ModernCV({
  data, onChange, isEdit,
  accent = "#1A6B5A",
  styleConfig = {},
  onStyleChange,
  sectionOrder = ["summary", "experiences", "education", "awards", "activities"],
  setSectionOrder,
  sectionTitles = {},
  setSectionTitles,
  useSampleData = false,
  forceReset,
  editorResetKey = 0,
  onAIAssist,
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

  // editorResetKey từ EditorScreen — tăng khi user nhấn "Tạo lại từ đầu"
  const resetKey = editorResetKey;

  useEffect(() => {
    if (isUserEditing.current) return;
    if (shouldUseSample) return;
    setLocalData(data || {});
    setLocalOrder(sectionOrder);
    setLocalTitles(sectionTitles);
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
    setLocalData(d => {
      const np = { ...(d.personalInfo || {}), [key]: val };
      onChange("personalInfo", np);
      return { ...d, personalInfo: np };
    });
    setTimeout(() => { isUserEditing.current = false; }, 0);
  }, [onChange]);

  const updArr = useCallback((section, idx, key, val) => {
    isUserEditing.current = true;
    setLocalData(d => {
      const arr = [...(d[section] || [])];
      arr[idx] = { ...arr[idx], [key]: val };
      onChange(section, arr);
      return { ...d, [section]: arr };
    });
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
    const ni = idx + dir;
    if (ni < 0 || ni >= localOrder.length) return;
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

  const DEFAULTS = { summary: "Giới thiệu", experiences: "Kinh nghiệm làm việc", education: "Học vấn", awards: "Giải thưởng", activities: "Hoạt động ngoại khóa", contact: "Liên hệ", skills: "Kỹ năng", certifications: "Chứng chỉ" };
  const getTitle = useCallback((k) => localTitles?.[k] ?? DEFAULTS[k], [localTitles]);

  const handleAvatarChange = useCallback((url) => updPi("avatar", url), [updPi]);

  const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
  const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));
  const filteredExp = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
  const filteredEdu = (localData.education || []).filter(e => isEdit || hasContent(e.degree) || hasContent(e.institution));
  const filteredAwards = (localData.awards || []).filter(a => isEdit || hasContent(a.title));
  const filteredActs = (localData.activities || []).filter(a => isEdit || hasContent(a.role) || hasContent(a.organization));
  const hasContact = ['email', 'phone', 'address', 'linkedin'].some(k => hasContent(pi[k]));

  return (
    <div key={resetKey} id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", display: "flex", fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      {/* Sidebar */}
      <div style={{ width: "40%", background: accent, padding: "32px 20px", color: "white", flexShrink: 0 }}>
        {/* Avatar */}
        <AvatarEditor avatarUrl={pi.avatar} isEdit={isEdit} onAvatarChange={handleAvatarChange} accent={accent} />

        {/* Name */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
            style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 6, color: "white", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.4)" : "none" }}
            textColor="white" styleConfig={styleConfig} onStyleChange={onStyleChange} />
          <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Vị trí ứng tuyển"
            style={{ fontSize: 12, textAlign: "center", color: "rgba(255,255,255,0.8)", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.3)" : "none" }}
            textColor="rgba(255,255,255,0.8)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
        </div>

        {/* Contact */}
        {(isEdit || hasContact) && (
          <div style={{ marginBottom: 20 }}>
            <SideHead sectionKey="contact" isEdit={isEdit} getTitle={getTitle} updateTitle={updateTitle} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["✉", "email"], ["📱", "phone"], ["📍", "address"], ["🔗", "linkedin"]].map(([icon, key]) => {
                if (!isEdit && !hasContent(pi[key])) return null;
                return (
                  <div key={key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12 }}>{icon}</span>
                    <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={key}
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.25)" : "none" }}
                      textColor="rgba(255,255,255,0.9)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills */}
        {(isEdit || filteredSkills.length > 0) && (
          <div style={{ marginBottom: 20 }}>
            <SideHead sectionKey="skills" isEdit={isEdit} getTitle={getTitle} updateTitle={updateTitle} onAdd={() => addItem("skills", { category: "", items: "" })} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
            {filteredSkills.map((sk, idx) => (
              <SidebarItem key={idx} section="skills" idx={idx} total={filteredSkills.length} isEdit={isEdit} moveItem={moveItem} delItem={delItem}>
                <DI value={sk.category || ""} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng"
                  style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, color: "rgba(255,255,255,0.95)" }}
                  textColor="rgba(255,255,255,0.95)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                <DI multiline value={sk.items || ""} onChange={v => updArr("skills", idx, "items", v)} placeholder="Kỹ năng..."
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", minHeight: 40 }}
                  textColor="rgba(255,255,255,0.75)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
              </SidebarItem>
            ))}
          </div>
        )}

        {/* Certifications */}
        {(isEdit || filteredCerts.length > 0) && (
          <div style={{ marginBottom: 20 }}>
            <SideHead sectionKey="certifications" isEdit={isEdit} getTitle={getTitle} updateTitle={updateTitle} onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
            {filteredCerts.map((cert, idx) => (
              <SidebarItem key={idx} section="certifications" idx={idx} total={filteredCerts.length} isEdit={isEdit} moveItem={moveItem} delItem={delItem}>
                <DI value={cert.name || ""} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ"
                  style={{ fontSize: 12, fontWeight: "bold", color: "rgba(255,255,255,0.95)" }}
                  textColor="rgba(255,255,255,0.95)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                <div style={{ marginTop: 4 }}>
                  <DI value={cert.issuer || ""} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Tổ chức"
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", display: "block" }}
                    textColor="rgba(255,255,255,0.7)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                  <DI value={cert.year || ""} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm"
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}
                    textColor="rgba(255,255,255,0.6)" styleConfig={styleConfig} onStyleChange={onStyleChange} />
                </div>
              </SidebarItem>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "32px 28px", overflow: "hidden" }}>
        {localOrder.map((key, idx) => {
          // Summary
          if (key === "summary" && (isEdit || hasContent(localData.summary))) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="summary" idx={idx} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} deleteSection={deleteSection} totalSections={localOrder.length} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist}/>
                <EF value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Tóm tắt bản thân..." multiline richText isEdit={isEdit} textColor={textColor} style={{ color: "#444", lineHeight: 1.7 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
              </div>
            );
          }

          // Experiences
          if (key === "experiences" && (isEdit || filteredExp.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="experiences" idx={idx} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} deleteSection={deleteSection} totalSections={localOrder.length} onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
                {filteredExp.map((exp, i) => (
                  <div key={i} className="item-wrapper" style={{ position: "relative", borderLeft: `3px solid ${accent}33`, paddingLeft: 12, marginBottom: 16, paddingTop: isEdit ? 4 : 0, paddingRight: isEdit ? 90 : 0 }}>
                    {isEdit && <div style={{ position: "absolute", top: 0, right: 0 }}><ItemControls onUp={() => moveItem("experiences", i, -1)} onDown={() => moveItem("experiences", i, 1)} onDelete={() => delItem("experiences", i)} isFirst={i === 0} isLast={i === filteredExp.length - 1} accent={accent} /></div>}
                    <EF value={exp.position} onChange={v => updArr("experiences", i, "position", v)} placeholder="Vị trí" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", fontSize: 15, color: "#222", marginBottom: 4 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                      <EF value={exp.company} onChange={v => updArr("experiences", i, "company", v)} placeholder="Công ty" isEdit={isEdit} textColor={textColor} style={{ color: accent, fontWeight: 500, flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                      <EF value={exp.duration} onChange={v => updArr("experiences", i, "duration", v)} placeholder="Thời gian" isEdit={isEdit} textColor={textColor} style={{ color: "#888", width: 140 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <EF value={exp.description} onChange={v => updArr("experiences", i, "description", v)} placeholder="Mô tả..." multiline richText isEdit={isEdit} textColor={textColor} style={{ color: "#555" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                  </div>
                ))}
              </div>
            );
          }

          // Education
          if (key === "education" && (isEdit || filteredEdu.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="education" idx={idx} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} deleteSection={deleteSection} totalSections={localOrder.length} onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
                {filteredEdu.map((edu, i) => (
                  <div key={i} className="item-wrapper" style={{ position: "relative", borderLeft: `3px solid ${accent}33`, paddingLeft: 12, marginBottom: 16, paddingTop: isEdit ? 4 : 0, paddingRight: isEdit ? 90 : 0 }}>
                    {isEdit && <div style={{ position: "absolute", top: 0, right: 0 }}><ItemControls onUp={() => moveItem("education", i, -1)} onDown={() => moveItem("education", i, 1)} onDelete={() => delItem("education", i)} isFirst={i === 0} isLast={i === filteredEdu.length - 1} accent={accent} /></div>}
                    <EF value={edu.degree} onChange={v => updArr("education", i, "degree", v)} placeholder="Bằng cấp" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", marginBottom: 4 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <div style={{ display: "flex", gap: 12 }}>
                      <EF value={edu.institution} onChange={v => updArr("education", i, "institution", v)} placeholder="Trường" isEdit={isEdit} textColor={textColor} style={{ flex: 1, color: "#555" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                      <EF value={edu.year} onChange={v => updArr("education", i, "year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ width: 80, color: "#888" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                      <EF value={edu.gpa} onChange={v => updArr("education", i, "gpa", v)} placeholder="GPA" isEdit={isEdit} textColor={textColor} style={{ width: 70, color: "#888" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          // Awards
          if (key === "awards" && (isEdit || filteredAwards.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="awards" idx={idx} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} deleteSection={deleteSection} totalSections={localOrder.length} onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
                {filteredAwards.map((aw, i) => (
                  <div key={i} className="item-wrapper" style={{ position: "relative", borderLeft: `3px solid ${accent}33`, paddingLeft: 12, marginBottom: 16, paddingTop: isEdit ? 4 : 0, paddingRight: isEdit ? 90 : 0 }}>
                    {isEdit && <div style={{ position: "absolute", top: 0, right: 0 }}><ItemControls onUp={() => moveItem("awards", i, -1)} onDown={() => moveItem("awards", i, 1)} onDelete={() => delItem("awards", i)} isFirst={i === 0} isLast={i === filteredAwards.length - 1} accent={accent} /></div>}
                    <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                      <EF value={aw.title} onChange={v => updArr("awards", i, "title", v)} placeholder="Giải thưởng" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                      <EF value={aw.year} onChange={v => updArr("awards", i, "year", v)} placeholder="Năm" isEdit={isEdit} textColor={textColor} style={{ width: 60, color: "#888" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <EF value={aw.issuer} onChange={v => updArr("awards", i, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} textColor={textColor} style={{ color: "#666" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={aw.description} onChange={v => updArr("awards", i, "description", v)} placeholder="Mô tả..." richText isEdit={isEdit} textColor={textColor} style={{ color: "#777", fontSize: 12 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                  </div>
                ))}
              </div>
            );
          }

          // Activities
          if (key === "activities" && (isEdit || filteredActs.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="activities" idx={idx} isEdit={isEdit} accent={accent} getTitle={getTitle} updateTitle={updateTitle} moveSection={moveSection} deleteSection={deleteSection} totalSections={localOrder.length} onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} styleConfig={styleConfig} onStyleChange={onStyleChange} onAIAssist={onAIAssist} />
                {filteredActs.map((act, i) => (
                  <div key={i} className="item-wrapper" style={{ position: "relative", borderLeft: `3px solid ${accent}33`, paddingLeft: 12, marginBottom: 16, paddingTop: isEdit ? 4 : 0, paddingRight: isEdit ? 90 : 0 }}>
                    {isEdit && <div style={{ position: "absolute", top: 0, right: 0 }}><ItemControls onUp={() => moveItem("activities", i, -1)} onDown={() => moveItem("activities", i, 1)} onDelete={() => delItem("activities", i)} isFirst={i === 0} isLast={i === filteredActs.length - 1} accent={accent} /></div>}
                    <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                      <EF value={act.role} onChange={v => updArr("activities", i, "role", v)} placeholder="Vai trò" isEdit={isEdit} textColor={textColor} style={{ fontWeight: "bold", flex: 1 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                      <EF value={act.duration} onChange={v => updArr("activities", i, "duration", v)} placeholder="Thời gian" isEdit={isEdit} textColor={textColor} style={{ width: 120, color: "#888" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    </div>
                    <EF value={act.organization} onChange={v => updArr("activities", i, "organization", v)} placeholder="Tổ chức" isEdit={isEdit} textColor={textColor} style={{ color: "#666", marginBottom: 4 }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                    <EF value={act.description} onChange={v => updArr("activities", i, "description", v)} placeholder="Mô tả..." multiline richText isEdit={isEdit} textColor={textColor} style={{ color: "#555" }} styleConfig={styleConfig} onStyleChange={onStyleChange} />
                  </div>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
      <style>{`
          [data-rich-editor][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #bbb;
            pointer-events: none;
            font-style: italic;
          }
          [data-rich-editor][data-placeholder]:focus:empty:before { color: #ccc; }
          .item-wrapper:hover .item-controls { opacity: 1 !important; }
        `}</style>
    </div>
  );
}