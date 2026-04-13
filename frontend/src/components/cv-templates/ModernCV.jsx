import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import ItemControls from "../common/ItemControls/ItemControls";

// ─── DỮ LIỆU MẪU (SAMPLE DATA) ───────────────────────────────────────────────
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
    {
      company: "Công ty TNHH ABC",
      position: "Senior Marketing Specialist",
      duration: "01/2022 – Hiện tại",
      description: "• Xây dựng và triển khai chiến lược marketing tổng thể\n• Quản lý ngân sách marketing 2 tỷ đồng/năm, tối ưu ROI đạt 150%\n• Dẫn dắt team 5 người thực hiện các chiến dịch digital marketing"
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
    { category: "Phân tích", items: "Excel, PowerBI, Google Data Studio" },
    { category: "Ngoại ngữ", items: "Tiếng Anh (IELTS 7.5), Tiếng Nhật (N3)" }
  ],
  awards: [
    {
      title: "Nhân viên xuất sắc của năm",
      issuer: "Công ty TNHH ABC",
      year: "2023",
      description: "Đạt thành tích xuất sắc trong việc triển khai chiến dịch marketing"
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
      description: "• Quản lý team 10 thành viên sản xuất nội dung\n• Tổ chức các sự kiện workshop với quy mô 200+ người tham dự"
    }
  ]
};

const SAMPLE_SECTION_ORDER = ["summary", "experiences", "education", "awards", "activities"];
const SAMPLE_SECTION_TITLES = {
  summary: "Giới thiệu",
  experiences: "Kinh nghiệm làm việc",
  education: "Học vấn",
  awards: "Giải thưởng",
  activities: "Hoạt động ngoại khóa",
  contact: "Liên hệ",
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

// ─── INPUT COMPONENT (GIỮ FOCUS) ─────────────────────────────────────────────
const DI = memo(({ value = "", onChange, placeholder, style, multiline }) => {
  const [local, setLocal] = useState(value);
  const t = useRef(null);
  const onChangeRef = useRef(onChange);
  const inputRef = useRef(null);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    // Chỉ sync khi không đang focus và value từ props khác local
    if (value !== local && document.activeElement !== inputRef.current) {
      setLocal(value);
    }
  }, [value]);

  const commit = useCallback((v) => {
    if (t.current) clearTimeout(t.current);
    onChangeRef.current(v);
  }, []);

  const change = useCallback((v) => {
    setLocal(v);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => onChangeRef.current(v), 300);
  }, []);

  const base = { background: "transparent", border: "none", outline: "none", fontFamily: "inherit", width: "100%", ...style };

  if (multiline) {
    return (
      <textarea
        ref={inputRef}
        value={local}
        onChange={e => change(e.target.value)}
        onBlur={e => commit(e.target.value)}
        placeholder={placeholder}
        style={{
          ...base,
          resize: "vertical",
          minHeight: 60,
          border: "1px dashed rgba(255,255,255,0.3)",
          borderRadius: 4,
          padding: "6px",
          boxSizing: "border-box",
          lineHeight: 1.5
        }}
      />
    );
  }

  return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
});

// Input cho main area
const EF = memo(({ value = "", onChange, placeholder, style, multiline, isEdit }) => {
  const [local, setLocal] = useState(value);
  const t = useRef(null);
  const onChangeRef = useRef(onChange);
  const inputRef = useRef(null);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => {
    if (value !== local && document.activeElement !== inputRef.current) {
      setLocal(value);
    }
  }, [value]);

  const commit = useCallback((v) => { if (t.current) clearTimeout(t.current); onChangeRef.current(v); }, []);
  const change = useCallback((v) => { setLocal(v); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => onChangeRef.current(v), 300); }, []);

  if (!isEdit) return hasContent(value) ? <div style={style}>{value}</div> : null;

  const base = { background: "transparent", border: "none", borderBottom: "1px dashed #ccc", outline: "none", fontFamily: "inherit", ...style };

  if (multiline) {
    return (
      <textarea
        ref={inputRef}
        value={local}
        onChange={e => change(e.target.value)}
        onBlur={e => commit(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          border: "1.5px dashed #ccc",
          borderRadius: 4,
          padding: "8px",
          fontSize: 13,
          resize: "vertical",
          minHeight: 60,
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
          lineHeight: 1.5,
          ...style
        }}
      />
    );
  }

  return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
});

// ─── COMPONENT CHÍNH ───────────────────────────────────────────────────────
export default function ModernCV({
  data, onChange, isEdit,
  accent = "#1A6B5A",
  styleConfig = {},
  sectionOrder = ["summary", "experiences", "education", "awards", "activities"],
  setSectionOrder,
  sectionTitles = {},
  setSectionTitles,
  useSampleData = false,
}) {
  // Quyết định dùng sample data hay data thật
  const shouldUseSample = useMemo(() => {
    if (useSampleData) return true;
    // Nếu không ở edit mode và không có dữ liệu thật -> dùng sample
    if (!isEdit && !hasContent(data?.personalInfo) && !hasContent(data?.summary)) {
      return true;
    }
    return false;
  }, [useSampleData, isEdit, data]);

  // Khởi tạo state
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

  const deleteSection = useCallback((idx) => {
    const arr = localOrder.filter((_, i) => i !== idx);
    setLocalOrder(arr);
    if (setSectionOrder) setSectionOrder(arr);
  }, [localOrder, setSectionOrder]);

  const updateTitle = useCallback((key, t) => {
    const nt = { ...localTitles, [key]: t };
    setLocalTitles(nt);
    if (setSectionTitles) setSectionTitles(nt);
  }, [localTitles, setSectionTitles]);

  const defaults = {
    summary: "Giới thiệu", experiences: "Kinh nghiệm làm việc",
    education: "Học vấn", awards: "Giải thưởng",
    activities: "Hoạt động ngoại khóa", contact: "Liên hệ",
    skills: "Kỹ năng", certifications: "Chứng chỉ",
  };

  const getTitle = useCallback((k) => localTitles?.[k] ?? defaults[k], [localTitles]);
  const F = useCallback((props) => <EF {...props} isEdit={isEdit} />, [isEdit]);

  // ── Sidebar section header ─────────────────────────────────────────────────
  const SideHead = memo(({ sectionKey, onAdd }) => {
    const [local, setLocal] = useState(getTitle(sectionKey));
    const t = useRef(null);
    useEffect(() => { setLocal(getTitle(sectionKey)); }, [sectionKey, localTitles]);
    const idx = localOrder.indexOf(sectionKey);

    const handleChange = useCallback((e) => {
      setLocal(e.target.value);
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300);
    }, [sectionKey]);

    const handleBlur = useCallback((e) => {
      if (t.current) clearTimeout(t.current);
      updateTitle(sectionKey, e.target.value);
    }, [sectionKey]);

    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 4 }}>
        {isEdit ? (
          <input
            value={local}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 2, color: "rgba(255,255,255,0.9)", textTransform: "uppercase", background: "transparent", border: "none", borderBottom: "1px dashed rgba(255,255,255,0.3)", outline: "none", flex: 1 }}
          />
        ) : (
          <div style={{ fontSize: 11, fontWeight: "bold", letterSpacing: 2, color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>{getTitle(sectionKey)}</div>
        )}
        {isEdit && (
          <div style={{ display: "flex", gap: 3, marginLeft: 6 }}>
            {/* {[["↑", () => moveSection(idx, -1), idx === 0], ["↓", () => moveSection(idx, 1), idx === localOrder.length - 1]].map(([lbl, fn, dis], i) => (
              <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 3, color: "white", cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            ))} */}
            {onAdd && <button onClick={onAdd} style={{ padding: "2px 6px", fontSize: 10, background: "rgba(255,255,255,0.15)", border: "1px dashed rgba(255,255,255,0.3)", borderRadius: 3, color: "white", marginLeft: 2, cursor: "pointer" }}>+</button>}
          </div>
        )}
      </div>
    );
  });

  // ── Main section header ────────────────────────────────────────────────────
  const MainHead = memo(({ sectionKey, idx, onAdd }) => {
    const [local, setLocal] = useState(getTitle(sectionKey));
    const t = useRef(null);
    useEffect(() => { setLocal(getTitle(sectionKey)); }, [sectionKey, localTitles]);

    const handleChange = useCallback((e) => {
      setLocal(e.target.value);
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300);
    }, [sectionKey]);

    const handleBlur = useCallback((e) => {
      if (t.current) clearTimeout(t.current);
      updateTitle(sectionKey, e.target.value);
    }, [sectionKey]);

    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div style={{ width: 4, height: 20, background: accent, borderRadius: 2 }} />
          {isEdit ? (
            <input
              value={local}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1.5, color: accent, textTransform: "uppercase", background: "transparent", border: "none", borderBottom: "1px dashed #ccc", outline: "none", flex: 1 }}
            />
          ) : (
            <div style={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1.5, color: accent, textTransform: "uppercase" }}>{getTitle(sectionKey)}</div>
          )}
        </div>
        {isEdit && (
          <div style={{ display: "flex", gap: 4 }}>
            {onAdd && <button onClick={onAdd} style={{ fontSize: 11, color: accent, background: "white", border: `1px solid ${accent}44`, borderRadius: 4, padding: "3px 10px", cursor: "pointer" }}>+ Thêm</button>}
            {[["↑", () => moveSection(idx, -1), idx === 0], ["↓", () => moveSection(idx, 1), idx === localOrder.length - 1]].map(([lbl, fn, dis], i) => (
              <button key={i} onClick={fn} disabled={dis} style={{ padding: "3px 7px", fontSize: 11, opacity: dis ? 0.3 : 1, background: "#fff", border: `1px solid ${accent}44`, borderRadius: 3, color: accent, cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            ))}
          </div>
        )}
      </div>
    );
  });

  const ItemRow = useCallback(({ section, idx, total, children }) => (
    <div className="item-wrapper" style={{ position: "relative", borderLeft: `3px solid ${accent}33`, paddingLeft: 12, marginBottom: 16, paddingTop: isEdit ? 4 : 0, paddingRight: isEdit ? 85 : 0 }}>
      {isEdit && <div style={{ position: "absolute", top: 0, right: 0 }}><ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)} isFirst={idx === 0} isLast={idx === total - 1} accent={accent} /></div>}
      {children}
    </div>
  ), [isEdit, accent, moveItem, delItem]);

  // Sidebar item với controls
  const SidebarItem = memo(({ section, item, idx, total, renderContent }) => (
    <div style={{ marginBottom: 12, position: "relative", background: isEdit ? "rgba(255,255,255,0.05)" : "transparent", borderRadius: 4, padding: isEdit ? "8px 34px 8px 8px" : "4px 0" }}>
      {isEdit && (
        <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 2 }}>
          <button onClick={() => moveItem(section, idx, -1)} disabled={idx === 0} style={{ width: 18, height: 18, border: "none", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 2, fontSize: 9, cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
          <button onClick={() => moveItem(section, idx, 1)} disabled={idx === total - 1} style={{ width: 18, height: 18, border: "none", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: 2, fontSize: 9, cursor: idx === total - 1 ? "not-allowed" : "pointer", opacity: idx === total - 1 ? 0.4 : 1 }}>↓</button>
          <button onClick={() => delItem(section, idx)} style={{ width: 18, height: 18, border: "none", background: "rgba(255,100,100,0.6)", color: "white", borderRadius: 2, fontSize: 9, cursor: "pointer" }}>×</button>
        </div>
      )}
      {renderContent(item, idx)}
    </div>
  ));

  const filteredSkills = (localData.skills || []).filter(sk => isEdit || hasContent(sk.category) || hasContent(sk.items));
  const filteredCerts = (localData.certifications || []).filter(c => isEdit || hasContent(c.name));
  const filteredExp = (localData.experiences || []).filter(e => isEdit || hasContent(e.position) || hasContent(e.company));
  const filteredEdu = (localData.education || []).filter(e => isEdit || hasContent(e.degree) || hasContent(e.institution));
  const filteredAwards = (localData.awards || []).filter(a => isEdit || hasContent(a.title));
  const filteredActs = (localData.activities || []).filter(a => isEdit || hasContent(a.role) || hasContent(a.organization));
  const hasContact = ['email', 'phone', 'address', 'linkedin'].some(k => hasContent(pi[k]));

  return (
    <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", display: "flex", fontFamily: styleConfig.fontFamily || "'DM Sans', sans-serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      {/* Sidebar */}
      <div style={{ width: "40%", background: accent, padding: "32px 20px", color: "white", flexShrink: 0 }}>
        {/* Avatar */}
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.3)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👤</div>

        {/* Name */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên" style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 6, color: "white", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.4)" : "none" }} />
          <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Vị trí ứng tuyển" style={{ fontSize: 12, textAlign: "center", color: "rgba(255,255,255,0.8)", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.3)" : "none" }} />
        </div>

        {/* Contact */}
        {(isEdit || hasContact) && (
          <div style={{ marginBottom: 20 }}>
            <SideHead sectionKey="contact" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["✉", "email"], ["📱", "phone"], ["📍", "address"], ["🔗", "linkedin"]].map(([icon, key]) => {
                if (!isEdit && !hasContent(pi[key])) return null;
                return (
                  <div key={key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12 }}>{icon}</span>
                    <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={key} style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", borderBottom: isEdit ? "1px dashed rgba(255,255,255,0.25)" : "none" }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills */}
        {(isEdit || filteredSkills.length > 0) && (
          <div style={{ marginBottom: 20 }}>
            <SideHead sectionKey="skills" onAdd={() => addItem("skills", { category: "", items: "" })} />
            {filteredSkills.map((sk, idx) => (
              <SidebarItem key={idx} section="skills" item={sk} idx={idx} total={filteredSkills.length} renderContent={(item) => (
                <>
                  <DI value={item.category || ""} onChange={v => updArr("skills", idx, "category", v)} placeholder="Nhóm kỹ năng" style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, color: "rgba(255,255,255,0.95)" }} />
                  <DI multiline value={item.items || ""} onChange={v => updArr("skills", idx, "items", v)} placeholder="Kỹ năng..." style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", minHeight: 40 }} />
                </>
              )} />
            ))}
          </div>
        )}

        {/* Certifications */}
        {(isEdit || filteredCerts.length > 0) && (
          <div style={{ marginBottom: 20 }}>
            <SideHead sectionKey="certifications" onAdd={() => addItem("certifications", { name: "", issuer: "", year: "", score: "" })} />
            {filteredCerts.map((cert, idx) => (
              <SidebarItem key={idx} section="certifications" item={cert} idx={idx} total={filteredCerts.length} renderContent={(item) => (
                <div>
                  <DI value={item.name || ""} onChange={v => updArr("certifications", idx, "name", v)} placeholder="Tên chứng chỉ" style={{ fontSize: 12, fontWeight: "bold", color: "rgba(255,255,255,0.95)" }} />
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <DI value={item.issuer || ""} onChange={v => updArr("certifications", idx, "issuer", v)} placeholder="Tổ chức" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", flex: 1 }} />
                    <DI value={item.year || ""} onChange={v => updArr("certifications", idx, "year", v)} placeholder="Năm" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", width: 50 }} />
                  </div>
                </div>
              )} />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, width: "100%", maxWidth: "784px", padding: "32px 28px" }}>
        {localOrder.map((key, idx) => {
          // Summary
          if (key === "summary" && (isEdit || hasContent(localData.summary))) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="summary" idx={idx} />
                <F value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Tóm tắt bản thân..." multiline style={{ color: "#444", lineHeight: 1.7 }} />
              </div>
            );
          }

          // Experiences
          if (key === "experiences" && (isEdit || filteredExp.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="experiences" idx={idx} onAdd={() => addItem("experiences", { company: "", position: "", duration: "", description: "" })} />
                {filteredExp.map((exp, i) => (
                  <ItemRow key={i} section="experiences" idx={i} total={filteredExp.length}>
                    <F value={exp.position} onChange={v => updArr("experiences", i, "position", v)} placeholder="Vị trí" style={{ fontWeight: "bold", fontSize: 15, color: "#222", marginBottom: 4 }} />
                    <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                      <F value={exp.company} onChange={v => updArr("experiences", i, "company", v)} placeholder="Công ty" style={{ color: accent, fontWeight: 500, flex: 1 }} />
                      <F value={exp.duration} onChange={v => updArr("experiences", i, "duration", v)} placeholder="Thời gian" style={{ color: "#888", width: 140 }} />
                    </div>
                    <F value={exp.description} onChange={v => updArr("experiences", i, "description", v)} placeholder="Mô tả..." multiline style={{ color: "#555" }} />
                  </ItemRow>
                ))}
              </div>
            );
          }

          // Education
          if (key === "education" && (isEdit || filteredEdu.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="education" idx={idx} onAdd={() => addItem("education", { institution: "", degree: "", year: "", gpa: "" })} />
                {filteredEdu.map((edu, i) => (
                  <ItemRow key={i} section="education" idx={i} total={filteredEdu.length}>
                    <F value={edu.degree} onChange={v => updArr("education", i, "degree", v)} placeholder="Bằng cấp" style={{ fontWeight: "bold", marginBottom: 4 }} />
                    <div style={{ display: "flex", gap: 12 }}>
                      <F value={edu.institution} onChange={v => updArr("education", i, "institution", v)} placeholder="Trường" style={{ flex: 1, color: "#555" }} />
                      <F value={edu.year} onChange={v => updArr("education", i, "year", v)} placeholder="Năm" style={{ width: 80, color: "#888" }} />
                      <F value={edu.gpa} onChange={v => updArr("education", i, "gpa", v)} placeholder="GPA" style={{ width: 70, color: "#888" }} />
                    </div>
                  </ItemRow>
                ))}
              </div>
            );
          }

          // Awards
          if (key === "awards" && (isEdit || filteredAwards.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="awards" idx={idx} onAdd={() => addItem("awards", { title: "", issuer: "", year: "", description: "" })} />
                {filteredAwards.map((aw, i) => (
                  <ItemRow key={i} section="awards" idx={i} total={filteredAwards.length}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                      <F value={aw.title} onChange={v => updArr("awards", i, "title", v)} placeholder="Giải thưởng" style={{ fontWeight: "bold", flex: 1 }} />
                      <F value={aw.year} onChange={v => updArr("awards", i, "year", v)} placeholder="Năm" style={{ width: 60, color: "#888" }} />
                    </div>
                    <F value={aw.issuer} onChange={v => updArr("awards", i, "issuer", v)} placeholder="Tổ chức" style={{ color: "#666" }} />
                    <F value={aw.description} onChange={v => updArr("awards", i, "description", v)} placeholder="Mô tả..." style={{ color: "#777", fontSize: 12 }} />
                  </ItemRow>
                ))}
              </div>
            );
          }

          // Activities
          if (key === "activities" && (isEdit || filteredActs.length > 0)) {
            return (
              <div key={key} style={{ marginBottom: 24 }}>
                <MainHead sectionKey="activities" idx={idx} onAdd={() => addItem("activities", { organization: "", role: "", duration: "", description: "" })} />
                {filteredActs.map((act, i) => (
                  <ItemRow key={i} section="activities" idx={i} total={filteredActs.length}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
                      <F value={act.role} onChange={v => updArr("activities", i, "role", v)} placeholder="Vai trò" style={{ fontWeight: "bold", flex: 1 }} />
                      <F value={act.duration} onChange={v => updArr("activities", i, "duration", v)} placeholder="Thời gian" style={{ width: 120, color: "#888" }} />
                    </div>
                    <F value={act.organization} onChange={v => updArr("activities", i, "organization", v)} placeholder="Tổ chức" style={{ color: "#666", marginBottom: 4 }} />
                    <F value={act.description} onChange={v => updArr("activities", i, "description", v)} placeholder="Mô tả..." multiline style={{ color: "#555" }} />
                  </ItemRow>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
      <style>{`.item-wrapper:hover .item-controls { opacity: 1 !important; }`}</style>
    </div>
  );
}