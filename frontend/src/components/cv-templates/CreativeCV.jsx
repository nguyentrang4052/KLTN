import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "./../common/ItemControls/ItemControls";

// ─── DỮ LIỆU MẪU ─────────────────────────────────────────────────────────────
const SAMPLE_DATA = {
  personalInfo: {
    fullName: "NGUYỄN VĂN A",
    portfolio: "Creative Director / UX Designer",
    email: "nguyenvana@email.com",
    phone: "0912 345 678",
    address: "Quận 1, TP. Hồ Chí Minh",
    linkedin: "linkedin.com/in/nguyenvana"
  },
  summary: "Creative Director với 5 năm kinh nghiệm xây dựng thương hiệu và thiết kế trải nghiệm người dùng. Kết hợp tư duy chiến lược và khả năng sáng tạo để tạo ra các sản phẩm số ấn tượng. Đam mê kể chuyện thương hiệu qua hình ảnh và giao diện.",
  experiences: [
    {
      company: "Studio Creative XYZ",
      position: "Creative Director",
      duration: "01/2022 – Hiện tại",
      description: "• Lãnh đạo team 8 designer thực hiện các dự án thương hiệu lớn\n• Phát triển hệ thống nhận diện thương hiệu cho 20+ khách hàng\n• Tăng 60% độ hài lòng khách hàng nhờ cải tiến quy trình sáng tạo"
    },
    {
      company: "Agency ABC",
      position: "Senior UI/UX Designer",
      duration: "03/2019 – 12/2021",
      description: "• Thiết kế UX/UI cho 15+ ứng dụng mobile và web\n• Tăng 40% tỷ lệ chuyển đổi nhờ tối ưu trải nghiệm người dùng"
    }
  ],
  education: [
    {
      institution: "Đại học Mỹ thuật TP. Hồ Chí Minh",
      degree: "Cử nhân Thiết kế Đồ họa",
      year: "2015 – 2019",
      gpa: "GPA: 3.8/4.0"
    }
  ],
  skills: [
    { category: "Thiết kế", items: "Figma, Adobe XD, Illustrator, Photoshop, After Effects" },
    { category: "Branding", items: "Brand Strategy, Visual Identity, Typography, Color Theory" },
    { category: "Digital", items: "HTML/CSS, Motion Design, 3D Modeling (Cinema 4D)" },
    { category: "Ngoại ngữ", items: "Tiếng Anh (Fluent), Tiếng Pháp (A2)" }
  ],
  awards: [
    {
      title: "Best Design Agency of the Year",
      issuer: "Vietnam Creative Awards",
      year: "2023",
      description: "Dự án rebranding cho thương hiệu F&B hàng đầu Việt Nam"
    },
    {
      title: "Gold Award – Brand Identity",
      issuer: "Asia Design Federation",
      year: "2022",
      description: "Thiết kế nhận diện thương hiệu cho startup công nghệ"
    }
  ],
  certifications: [
    { name: "Google UX Design Certificate", issuer: "Google / Coursera", year: "2022", score: "Distinction" },
    { name: "Adobe Certified Expert", issuer: "Adobe", year: "2021", score: "Pass" }
  ],
  activities: [
    {
      organization: "Vietnam Designers Community",
      role: "Mentor & Speaker",
      duration: "2020 – nay",
      description: "• Hướng dẫn 50+ designer junior về career path và kỹ năng\n• Diễn giả tại 10+ workshop và hội thảo thiết kế toàn quốc"
    }
  ]
};

const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
const SAMPLE_SECTION_TITLES = {
  summary: "Về tôi",
  experiences: "Kinh nghiệm làm việc",
  education: "Học vấn",
  awards: "Giải thưởng",
  activities: "Hoạt động & Dự án",
  skills: "Kỹ năng",
  certifications: "Chứng chỉ",
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

  const base = { background: "transparent", border: "none", outline: "none", fontFamily: "inherit", width: "100%", ...style };
  if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
    style={{ ...base, resize: "vertical", minHeight: 60, border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", boxSizing: "border-box", lineHeight: 1.5 }} />;
  return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
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

  if (!isEdit) return hasContent(value) ? <div style={style}>{value}</div> : null;
  const base = { background: "transparent", border: "none", borderBottom: "1px dashed #ddd", outline: "none", fontFamily: "inherit", ...style };
  if (multiline) return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", border: "1.5px dashed #ddd", borderRadius: 4, padding: "6px", fontSize: 12, resize: "vertical", minHeight: 60, outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.5, background: "transparent" }} />;
  return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
});

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function CreativeCV({
  data, onChange, isEdit,
  accent = "#5B2D8E",
  styleConfig = {},
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

  const defaults = {
    summary: "Về tôi", experiences: "Kinh nghiệm làm việc",
    education: "Học vấn", awards: "Giải thưởng",
    activities: "Hoạt động & Dự án", skills: "Kỹ năng", certifications: "Chứng chỉ",
  };
  const getTitle = useCallback((k) => localTitles?.[k] ?? defaults[k], [localTitles]);

  // Section header với icon trang trí + editable title
  const SHead = memo(({ sectionKey, icon, idx, onAdd }) => {
    const [local, setLocal] = useState(() => getTitle(sectionKey));
    const t = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, localTitles]);

    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10,position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: accent }}>{icon}</div>
          {isEdit ? (
            <input ref={inputRef} value={local}
              onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
              onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
              style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent, background: "transparent", border: "none", borderBottom: "1px dashed " + accent + "66", outline: "none" }} />
          ) : (
            <div style={{ fontSize: 12, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>{getTitle(sectionKey)}</div>
          )}
        </div>
        {isEdit && (
          <div style={{ display: "flex", gap: 3 }}>
            {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: accent, background: accent + "10", border: `1px solid ${accent}33`, borderRadius: 8, padding: "2px 8px", cursor: "pointer" }}>+ Thêm</button>}
            {[["↑", () => moveSection(idx, -1), idx === 0], ["↓", () => moveSection(idx, 1), idx === localOrder.length - 1]].map(([lbl, fn, dis], i) => (
              <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}33`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            ))}
          </div>
        )}
      </div>
    );
  });

  // Sidebar section header (không có move buttons)
  const SideHead = memo(({ sectionKey, icon, onAdd }) => {
    const [local, setLocal] = useState(() => getTitle(sectionKey));
    const t = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, localTitles]);

    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: accent }}>{icon}</div>
          {isEdit ? (
            <input ref={inputRef} value={local}
              onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
              onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
              style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent, background: "transparent", border: "none", borderBottom: "1px dashed " + accent + "55", outline: "none" }} />
          ) : (
            <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", color: accent }}>{getTitle(sectionKey)}</div>
          )}
        </div>
        {isEdit && onAdd && <button onClick={onAdd} style={{ fontSize: 10, color: accent, background: accent + "10", border: `1px solid ${accent}33`, borderRadius: 6, padding: "1px 6px", cursor: "pointer" }}>+</button>}
      </div>
    );
  });

  const ItemRow = useCallback(({ section, idx, total, style: rowStyle = {}, children }) => (
    <div className="item-wrapper" style={{ position: "relative", padding: "8px 12px", borderLeft: `3px solid ${accent}`, background: accent + "04", borderRadius: "0 6px 6px 0", marginBottom: 10, paddingRight: isEdit ? 100 : 12, ...rowStyle }}>
      {isEdit && <div style={{ position: "absolute", top: 4, right: 4,   zIndex: 1 }}>
        <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)} isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
      </div>}
      {children}
    </div>
  ), [isEdit, accent, moveItem, delItem]);

  const SidebarItemRow = useCallback(({ section, idx, total, children }) => (
    <div className="item-wrapper" style={{ position: "relative", marginBottom: 8, paddingBottom: 8, borderBottom: "1px dashed #eee", paddingRight: isEdit ? 60 : 0 }}>
      {isEdit && <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 2 }}>
        <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
        <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1} style={{ width: 16, height: 16, border: "none", background: accent + "22", color: accent, borderRadius: 2, fontSize: 8, cursor: "pointer", opacity: idx === total - 1 ? 0.3 : 1 }}>↓</button>
        <button onClick={() => delItem(section, idx)} style={{ width: 16, height: 16, border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 2, fontSize: 8, cursor: "pointer" }}>×</button>
      </div>}
      {children}
    </div>
  ), [isEdit, accent, moveItem, delItem]);

  const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
  const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));

  const sectionIconMap = { summary: "◑", experiences: "⧖", education: "◻", awards: "★", activities: "◉", skills: "◈", certifications: "◎" };

  return (
    <div id="cv-paper" className="cv-paper" style={{width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif", fontSize: styleConfig.baseFontSize || 14, lineHeight: styleConfig.lineHeight || 1.6 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(120deg, ${accent}, ${accent}cc)`, padding: "32px 40px", position: "relative", overflow: "hidden", color: "white" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✦</div>
          <div style={{ flex: 1 }}>
            <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
              style={{ fontSize: 28, fontWeight: "bold", color: "white", marginBottom: 4, borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.4)" : "none" }} />
            <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh sáng tạo"
              style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.3)" : "none", width: "70%" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 16, position: "relative" }}>
          {[["email", "✉ ", "Email"], ["phone", "☎ ", "Điện thoại"], ["linkedin", "⊕ ", "LinkedIn"], ["address", "◎ ", "Địa chỉ"]].map(([key, icon, ph]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: 12 }}>
              <span>{icon}</span>
              {isEdit
                ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 11, color: "white", width: 120, borderBottom: "none" }} />
                : <span>{pi[key] || ph}</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Left sidebar */}
        <div style={{ width: "40%", padding: "20px 16px 20px 24px", background: "#FAFAFA", borderRight: "1px solid #f0f0f0", flexShrink: 0 }}>
          {/* Summary in sidebar */}
          {(isEdit || hasContent(localData.summary)) && (
            <div style={{ marginBottom: 20 }}>
              <SideHead sectionKey="summary" icon="◑" />
              {isEdit
                ? <DI multiline value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Mô tả sáng tạo về bản thân..."
                    style={{ fontSize: 12, color: "#555" }} />
                : <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: 0 }}>{localData.summary}</p>}
            </div>
          )}

          {/* Skills */}
          {(isEdit || filteredSkills.length > 0) && (
            <div style={{ marginBottom: 20 }}>
              <SideHead sectionKey="skills" icon="◈" onAdd={() => addItem("skills", { category: "", items: "" })} />
              {filteredSkills.map((sk, idx) => (
                <SidebarItemRow key={idx} section="skills" idx={idx} total={filteredSkills.length}>
                  <EF value={sk.category} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng" isEdit={isEdit}
                    style={{ fontSize: 11, fontWeight: "bold", color: accent, marginBottom: 3 }} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: isEdit ? 4 : 0 }}>
                    {(sk.items || "").split(",").filter(Boolean).map((item, i) => (
                      <span key={i} style={{ fontSize: 10, background: accent + "12", color: accent, padding: "2px 6px", borderRadius: 8 }}>{item.trim()}</span>
                    ))}
                  </div>
                  {isEdit && <DI multiline value={sk.items || ""} onChange={v => updArr("skills", idx, "items", v)} placeholder="skill1, skill2, ..." style={{ fontSize: 10, color: "#888" }} />}
                </SidebarItemRow>
              ))}
            </div>
          )}

          {/* Certifications */}
          {(isEdit || filteredCerts.length > 0) && (
            <div style={{ marginBottom: 20 }}>
              <SideHead sectionKey="certifications" icon="◎" onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} />
              {filteredCerts.map((cert, idx) => (
                <SidebarItemRow key={idx} section="certifications" idx={idx} total={filteredCerts.length}>
                  <EF value={cert.name} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ" isEdit={isEdit}
                    style={{ fontSize: 11, fontWeight: "bold" }} />
                  <div style={{ fontSize: 10, color: "#888" }}>
                    <EF value={cert.issuer} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Tổ chức" isEdit={isEdit} style={{ fontSize: 10, color: "#888" }} />
                    {(isEdit || hasContent(cert.year)) && (
                      <EF value={cert.year} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm" isEdit={isEdit} style={{ fontSize: 10, color: "#aaa" }} />
                    )}
                  </div>
                  {(isEdit || hasContent(cert.score)) && (
                    <EF value={cert.score} onChange={v => updArr("certifications", idx, "score", v)} placeholder="Score" isEdit={isEdit} style={{ fontSize: 10, color: accent, fontWeight: 600 }} />
                  )}
                </SidebarItemRow>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "20px 28px 20px 20px" }}>
          {localOrder.map((key, idx) => {
            if (key === "summary") return null; // Summary is in sidebar

            if (key === "experiences") {
              const arr = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
              if (!isEdit && arr.length === 0) return null;
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <SHead sectionKey={key} icon={sectionIconMap[key]} idx={idx} onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} />
                  {arr.map((exp, i) => (
                    <ItemRow key={i} section="experiences" idx={i} total={arr.length}>
                      <div style={{ display: "flex", gap: 6  }}>
                        <EF value={exp.position} onChange={v => updArr("experiences", i, "position", v)} placeholder="Vị trí công việc" isEdit={isEdit}
                          style={{ fontWeight: "bold", fontSize: 13, color: "#111", flex: 1  }} />
                        <EF value={exp.duration} onChange={v => updArr("experiences", i, "duration", v)} placeholder="Thời gian" isEdit={isEdit}
                          style={{ fontSize: 11, color: "#888", width: 120 }} />
                      </div>
                      <EF value={exp.company} onChange={v => updArr("experiences", i, "company", v)} placeholder="Công ty" isEdit={isEdit}
                        style={{ fontSize: 12, color: accent, fontWeight: 500 }} />
                      <EF value={exp.description} onChange={v => updArr("experiences", i, "description", v)} placeholder="Mô tả công việc..." multiline isEdit={isEdit}
                        style={{ fontSize: 12, marginTop: 4 }} />
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
                  <SHead sectionKey={key} icon={sectionIconMap[key]} idx={idx} onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} />
                  {arr.map((edu, i) => (
                    <ItemRow key={i} section="education" idx={i} total={arr.length} style={{ borderLeftColor: accent + "55", background: "#fafafa" }}>
                      <EF value={edu.degree} onChange={v => updArr("education", i, "degree", v)} placeholder="Bằng cấp / Chuyên ngành" isEdit={isEdit}
                        style={{ fontWeight: "bold", fontSize: 13 }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <EF value={edu.institution} onChange={v => updArr("education", i, "institution", v)} placeholder="Tên trường" isEdit={isEdit}
                          style={{ fontSize: 12, color: "#666", flex: 1 }} />
                        <EF value={edu.year} onChange={v => updArr("education", i, "year", v)} placeholder="Năm" isEdit={isEdit}
                          style={{ fontSize: 11, color: "#aaa", width: 70 }} />
                        <EF value={edu.gpa} onChange={v => updArr("education", i, "gpa", v)} placeholder="GPA" isEdit={isEdit}
                          style={{ fontSize: 11, color: "#aaa", width: 60 }} />
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
                  <SHead sectionKey={key} icon={sectionIconMap[key]} idx={idx} onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} />
                  {arr.map((aw, i) => (
                    <ItemRow key={i} section="awards" idx={i} total={arr.length}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <EF value={aw.title} onChange={v => updArr("awards", i, "title", v)} placeholder="Tên giải thưởng" isEdit={isEdit}
                          style={{ fontWeight: "bold", fontSize: 13, flex: 1 }} />
                        <EF value={aw.year} onChange={v => updArr("awards", i, "year", v)} placeholder="Năm" isEdit={isEdit}
                          style={{ fontSize: 11, color: "#888", width: 50 }} />
                      </div>
                      <EF value={aw.issuer} onChange={v => updArr("awards", i, "issuer", v)} placeholder="Tổ chức trao giải" isEdit={isEdit}
                        style={{ fontSize: 12, color: accent, fontWeight: 500 }} />
                      <EF value={aw.description} onChange={v => updArr("awards", i, "description", v)} placeholder="Mô tả..." isEdit={isEdit}
                        style={{ fontSize: 12, color: "#666", marginTop: 2 }} />
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
                  <SHead sectionKey={key} icon={sectionIconMap[key]} idx={idx} onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} />
                  {arr.map((act, i) => (
                    <ItemRow key={i} section="activities" idx={i} total={arr.length}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <EF value={act.role} onChange={v => updArr("activities", i, "role", v)} placeholder="Vai trò / Dự án" isEdit={isEdit}
                          style={{ fontWeight: "bold", fontSize: 13, flex: 1 }} />
                        <EF value={act.duration} onChange={v => updArr("activities", i, "duration", v)} placeholder="Thời gian" isEdit={isEdit}
                          style={{ fontSize: 11, color: "#888", width: 110 }} />
                      </div>
                      <EF value={act.organization} onChange={v => updArr("activities", i, "organization", v)} placeholder="Tổ chức / CLB" isEdit={isEdit}
                        style={{ fontSize: 12, color: accent, fontWeight: 500 }} />
                      <EF value={act.description} onChange={v => updArr("activities", i, "description", v)} placeholder="Mô tả hoạt động..." multiline isEdit={isEdit}
                        style={{ fontSize: 12, marginTop: 4 }} />
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