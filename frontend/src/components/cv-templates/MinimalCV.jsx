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
    { category: "Digital Marketing", items: "SEO/SEM, Google Analytics, Facebook Ads" },
    { category: "Thiết kế", items: "Photoshop, Illustrator, Figma" },
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

const SAMPLE_SECTION_ORDER = ["experiences", "activities", "education", "skills", "awards", "certifications"];
const SAMPLE_SECTION_TITLES = {
  summary: "Mục tiêu nghề nghiệp",
  experiences: "Kinh nghiệm",
  activities: "Hoạt động",
  education: "Học vấn",
  skills: "Kỹ năng",
  awards: "Giải thưởng",
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

  const base = { background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", width: "100%", ...style };
  if (multiline) {
    return <textarea ref={inputRef} value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
      style={{ ...base, resize: "vertical", minHeight: 100, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", boxSizing: "border-box", lineHeight: 1.5 }} />;
  }
  return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder}
    style={{ ...base, borderBottom: "1px dashed #ccc" }} />;
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

  // ─── AUTO RESIZE ───────────────────────────────────────────────
  useEffect(() => {
    if (multiline && inputRef.current) {
      inputRef.current.style.height = "auto"; // reset trước
      inputRef.current.style.height = inputRef.current.scrollHeight + "px"; // tăng theo nội dung
    }
  }, [local, multiline]);

  if (!isEdit) return hasContent(value) ? <div style={style}>{value}</div> : null;

  const base = { background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", width: "100%", ...style };
  if (multiline) {
    return <textarea
      ref={inputRef}
      value={local}
      onChange={e => change(e.target.value)}
      onBlur={e => commit(e.target.value)}
      placeholder={placeholder}
      style={{ ...base, border: "1.5px dashed #ccc", borderRadius: 4, padding: "8px", boxSizing: "border-box", lineHeight: 1.5, overflow: "hidden", resize: "none" }}
    />;
  }
  return <input ref={inputRef} type="text" value={local} onChange={e => change(e.target.value)} onBlur={e => commit(e.target.value)} placeholder={placeholder} style={base} />;
});
// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function MinimalCV({
  data, onChange, isEdit,
  accent = "#1C1C1C",
  styleConfig = {},
  sectionOrder = ["experiences", "activities", "education", "skills", "awards", "certifications"],
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
    summary: "Mục tiêu nghề nghiệp", experiences: "Kinh nghiệm",
    activities: "Hoạt động", education: "Học vấn",
    skills: "Kỹ năng", awards: "Giải thưởng", certifications: "Chứng chỉ",
  };
  const getTitle = useCallback((k) => localTitles?.[k] ?? defaults[k], [localTitles]);

  const sHeadStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 15, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase", color: accent,
    borderBottom: `1px solid ${accent}`, paddingBottom: 4, marginBottom: 12
  };

  const SHead = memo(({ sectionKey, index }) => {
    const [local, setLocal] = useState(() => getTitle(sectionKey));
    const t = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { if (document.activeElement !== inputRef.current) setLocal(getTitle(sectionKey)); }, [sectionKey, localTitles]);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
        {isEdit ? (
          <input ref={inputRef} value={local}
            onChange={e => { setLocal(e.target.value); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => updateTitle(sectionKey, e.target.value), 300); }}
            onBlur={e => { if (t.current) clearTimeout(t.current); updateTitle(sectionKey, e.target.value); }}
            style={{ ...sHeadStyle, flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${accent}`, outline: "none", width: "auto" }} />
        ) : (
          <div style={{ ...sHeadStyle, flex: 1 }}>{getTitle(sectionKey)}</div>
        )}
        {isEdit && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {[["↑", () => moveSection(index, -1), index === 0], ["↓", () => moveSection(index, 1), index === localOrder.length - 1]].map(([lbl, fn, dis], i) => (
              <button key={i} onClick={fn} disabled={dis} style={{ padding: "2px 5px", fontSize: 10, opacity: dis ? 0.3 : 1, background: "#f5f5f5", border: "1px solid #ccc", borderRadius: 2, color: "#555", cursor: dis ? "not-allowed" : "pointer" }}>{lbl}</button>
            ))}
          </div>
        )}
      </div>
    );
  });

  const ItemRow = useCallback(({ section, idx, total, children }) => (
    <div className="item-wrapper" style={{ position: "relative", marginBottom: 12, paddingTop: isEdit ? 28 : 0, paddingRight: isEdit ? 80 : 0, boxSizing: "border-box" }}>
      {isEdit && (
        <div style={{ position: "absolute", top: 4, right: 0 }}>
          <ItemControls onUp={() => moveItem(section, idx, -1)} onDown={() => moveItem(section, idx, 1)} onDelete={() => delItem(section, idx)}
            isFirst={idx === 0} isLast={idx === total - 1} accent={accent} />
        </div>
      )}
      {children}
    </div>
  ), [isEdit, accent, moveItem, delItem]);

  const F = useCallback((props) => <EF {...props} isEdit={isEdit} />, [isEdit]);

  const configs = useMemo(() => ({
    experiences: {
      empty: { company: "", position: "", duration: "", description: "" },
      render: (exp, i) => (
        <>
          <F value={exp.position} onChange={v => updArr("experiences", i, "position", v)} placeholder="Vị trí"
            style={{ fontWeight: "bold", fontSize: 14, fontFamily: "'Cormorant Garamond', serif" }} />
          <div style={{ display: "flex", gap: 20 }}>
            <F value={exp.company} onChange={v => updArr("experiences", i, "company", v)} placeholder="Công ty" style={{ fontSize: 12, color: "#777" }} />
            <F value={exp.duration} onChange={v => updArr("experiences", i, "duration", v)} placeholder="Năm" style={{ fontSize: 12, color: "#aaa", width: 100 }} />
          </div>
          <F value={exp.description} onChange={v => updArr("experiences", i, "description", v)} placeholder="Mô tả..." multiline style={{ fontSize: 12 }} />
        </>
      )
    },
    activities: {
      empty: { organization: "", role: "", duration: "", description: "" },
      render: (act, i) => (
        <>
          <F value={act.role} onChange={v => updArr("activities", i, "role", v)} placeholder="Vai trò"
            style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
          <F value={act.organization} onChange={v => updArr("activities", i, "organization", v)} placeholder="Tổ chức" style={{ fontSize: 12, color: "#777" }} />
          <F value={act.duration} onChange={v => updArr("activities", i, "duration", v)} placeholder="Thời gian" style={{ fontSize: 11, color: "#aaa" }} />
          <F value={act.description} onChange={v => updArr("activities", i, "description", v)} placeholder="Mô tả..." multiline style={{ fontSize: 12 }} />
        </>
      )
    },
    education: {
      empty: { institution: "", degree: "", year: "", gpa: "" },
      render: (edu, i) => (
        <>
          <F value={edu.degree} onChange={v => updArr("education", i, "degree", v)} placeholder="Chuyên ngành"
            style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
          <F value={edu.institution} onChange={v => updArr("education", i, "institution", v)} placeholder="Trường" style={{ fontSize: 12, color: "#777" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <F value={edu.year} onChange={v => updArr("education", i, "year", v)} placeholder="Năm" style={{ fontSize: 12, color: "#aaa", width: 80 }} />
            <F value={edu.gpa} onChange={v => updArr("education", i, "gpa", v)} placeholder="GPA" style={{ fontSize: 12, color: "#aaa", width: 80 }} />
          </div>
        </>
      )
    },
    skills: {
      empty: { category: "", items: "" },
      render: (sk, i) => (
        <>
          <F value={sk.category} onChange={v => updArr("skills", i, "category", v)} placeholder="Nhóm"
            style={{ fontWeight: "bold", fontSize: 12, fontFamily: "'Cormorant Garamond', serif" }} />
          <F value={sk.items} onChange={v => updArr("skills", i, "items", v)} placeholder="Kỹ năng..." style={{ fontSize: 12, color: "#777" }} />
        </>
      )
    },
    awards: {
      empty: { title: "", issuer: "", year: "", description: "" },
      render: (aw, i) => (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <F value={aw.title} onChange={v => updArr("awards", i, "title", v)} placeholder="Tên giải"
              style={{ fontWeight: "bold", fontFamily: "'Cormorant Garamond', serif" }} />
            <F value={aw.year} onChange={v => updArr("awards", i, "year", v)} placeholder="Năm" style={{ width: 50, fontSize: 11, color: "#aaa" }} />
          </div>
          <F value={aw.issuer} onChange={v => updArr("awards", i, "issuer", v)} placeholder="Tổ chức" style={{ fontSize: 12, color: "#777" }} />
          <F value={aw.description} onChange={v => updArr("awards", i, "description", v)} placeholder="Mô tả..." style={{ fontSize: 12, color: "#888" }} />
        </>
      )
    },
    certifications: {
      empty: { name: "", issuer: "", year: "", score: "" },
      render: (cert, i) => (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <F value={cert.name} onChange={v => updArr("certifications", i, "name", v)} placeholder="Tên chứng chỉ"
              style={{ fontWeight: 600, fontFamily: "'Cormorant Garamond', serif" }} />
            <F value={cert.year} onChange={v => updArr("certifications", i, "year", v)} placeholder="Năm" style={{ width: 50, fontSize: 11, color: "#aaa" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <F value={cert.issuer} onChange={v => updArr("certifications", i, "issuer", v)} placeholder="Cấp bởi" style={{ fontSize: 12, color: "#777" }} />
            <F value={cert.score} onChange={v => updArr("certifications", i, "score", v)} placeholder="Score" style={{ fontSize: 12, color: "#888", width: 70 }} />
          </div>
        </>
      )
    },
  }), [isEdit, updArr, F]);

  const renderSection = useCallback((key, index) => {
    const arr = localData[key] || [];
    if (!isEdit && !hasContent(arr)) return null;
    const cfg = configs[key];
    if (!cfg) return null;
    return (
      <div key={key} style={{ marginBottom: 24 }}>
        <SHead sectionKey={key} index={index} />
        {arr.map((item, i) => (
          <ItemRow key={i} section={key} idx={i} total={arr.length}>{cfg.render(item, i)}</ItemRow>
        ))}
        {isEdit && (
          <button onClick={() => addItem(key, cfg.empty)}
            style={{ fontSize: 11, color: "#1C1C1C", background: "transparent", border: "1px dashed #ccc", borderRadius: 4, padding: "4px 10px", cursor: "pointer", marginTop: 4 }}>
            + Thêm
          </button>
        )}
      </div>
    );
  }, [localData, isEdit, configs, addItem]);

  const half = Math.ceil(localOrder.length / 2);

  const summaryHeadStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 15, fontWeight: 600, letterSpacing: 3,
    textTransform: "uppercase", color: accent,
    borderBottom: `1px solid ${accent}`, paddingBottom: 4,
    background: "transparent", border: "none", outline: "none", flex: 1
  };

  return (
    <div id="cv-paper" className="cv-paper" style={{ width: "100%", maxWidth: "794px", minHeight: "1123px", background: "white", fontFamily: styleConfig.fontFamily || "'Cormorant Garamond', serif", fontSize: styleConfig.baseFontSize || 13, lineHeight: styleConfig.lineHeight || 1.6, padding: "48px 52px", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 20, marginBottom: 28 }}>
        <DI value={pi.fullName || ""} onChange={v => updPi("fullName", v)} placeholder="Họ và tên"
          style={{ fontSize: 36, fontWeight: "bold", letterSpacing: 1, marginBottom: 6, borderBottom: isEdit ? "1px dashed #ccc" : "none", color: "#1C1C1C" }} />
        <DI value={pi.portfolio || ""} onChange={v => updPi("portfolio", v)} placeholder="Chức danh / Vị trí"
          style={{ fontSize: 16, color: "#777", letterSpacing: 2, marginBottom: 12, borderBottom: isEdit ? "1px dashed #ccc" : "none", width: "50%" }} />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: "#888" }}>
          {[["email", "email@example.com"], ["phone", "Điện thoại"], ["address", "Địa chỉ"], ["linkedin", "LinkedIn"]].map(([key, ph]) => (
            <span key={key}>
              {isEdit
                ? <DI value={pi[key] || ""} onChange={v => updPi(key, v)} placeholder={ph} style={{ fontSize: 12, color: "#999", borderBottom: "1px dashed #ddd", width: 130 }} />
                : pi[key] ? <span>{pi[key]}</span> : null}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(isEdit || hasContent(localData.summary)) && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <SHead sectionKey="summary" index={-1} />
          </div>
          <EF value={localData.summary || ""} onChange={v => upd("summary", v)} placeholder="Giới thiệu ngắn gọn..." multiline isEdit={isEdit}
            style={{ fontSize: 15, color: "#444", lineHeight: 1.7 }} />
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