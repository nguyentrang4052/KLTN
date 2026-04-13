// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { TEMPLATES, EMPTY_CV } from "../../../utils/constants"
// import CVRenderer from "./../../cv-templates/CVRenderer"
// import { getToken } from '../../../utils/auth'
// import ReturnDialog from "../ReturnDialog/ReturnDialog";

// const API = 'http://localhost:3000/api'

// const THUMB_COMPONENTS = {
//   classic: ({ accent }) => (
//     <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column" }}>
//       <div style={{ background: accent, padding: "20px 24px 16px", color: "white" }}>
//         <div style={{ width: 120, height: 14, background: "rgba(255,255,255,0.9)", borderRadius: 2, marginBottom: 8 }} />
//         <div style={{ width: 80, height: 9, background: "rgba(255,255,255,0.5)", borderRadius: 2, marginBottom: 12 }} />
//         <div style={{ display: "flex", gap: 16 }}>
//           {[70, 90, 60].map((w, i) => (
//             <div key={i} style={{ width: w, height: 7, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
//           ))}
//         </div>
//       </div>
//       <div style={{ padding: "12px 24px", flex: 1 }}>
//         {[["Kinh nghiệm", [100, 85, 90, 70]], ["Học vấn", [100, 75]], ["Kỹ năng", [60, 80, 50, 70]]].map(([label, widths], si) => (
//           <div key={si} style={{ marginBottom: 12 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//               <div style={{ width: 60, height: 8, background: accent, borderRadius: 1, opacity: 0.85 }} />
//               <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               {widths.map((w, i) => (
//                 <div key={i} style={{ width: `${w}%`, height: 6, background: "#e8e8e8", borderRadius: 2 }} />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   ),

//   modern: ({ accent }) => (
//     <div style={{ width: "100%", height: "100%", background: "white", display: "flex" }}>
//       <div style={{ width: "38%", background: accent, padding: "20px 12px", color: "white" }}>
//         <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", margin: "0 auto 10px" }} />
//         <div style={{ width: "90%", height: 8, background: "rgba(255,255,255,0.8)", borderRadius: 2, marginBottom: 5 }} />
//         <div style={{ width: "70%", height: 6, background: "rgba(255,255,255,0.4)", borderRadius: 2, marginBottom: 16 }} />
//         {[70, 85, 60, 75, 50].map((w, i) => (
//           <div key={i} style={{ width: `${w}%`, height: 5, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginBottom: 4 }} />
//         ))}
//       </div>
//       <div style={{ flex: 1, padding: "16px 12px" }}>
//         {[["Kinh nghiệm", 3], ["Học vấn", 2]].map(([label, rows], si) => (
//           <div key={si} style={{ marginBottom: 12 }}>
//             <div style={{ width: 70, height: 7, background: accent, borderRadius: 1, marginBottom: 6, opacity: 0.9 }} />
//             {Array(rows).fill(0).map((_, i) => (
//               <div key={i} style={{ marginBottom: 4 }}>
//                 <div style={{ width: "80%", height: 5, background: "#ddd", borderRadius: 2, marginBottom: 2 }} />
//                 <div style={{ width: "60%", height: 4, background: "#eee", borderRadius: 2 }} />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   ),

//   minimal: () => (
//     <div style={{ width: "100%", height: "100%", background: "white", padding: "20px 24px" }}>
//       <div style={{ borderBottom: "2px solid #1C1C1C", paddingBottom: 12, marginBottom: 14 }}>
//         <div style={{ width: 130, height: 16, background: "#1C1C1C", borderRadius: 2, marginBottom: 6 }} />
//         <div style={{ width: 90, height: 9, background: "#999", borderRadius: 2, marginBottom: 8 }} />
//         <div style={{ display: "flex", gap: 12 }}>
//           {[60, 70, 50].map((w, i) => (
//             <div key={i} style={{ width: w, height: 6, background: "#ccc", borderRadius: 2 }} />
//           ))}
//         </div>
//       </div>
//       {[["EXPERIENCE", 3], ["EDUCATION", 2], ["SKILLS", 1]].map(([label, rows], si) => (
//         <div key={si} style={{ marginBottom: 12 }}>
//           <div style={{ width: 70, height: 6, background: "#1C1C1C", borderRadius: 1, marginBottom: 7 }} />
//           {Array(rows).fill(0).map((_, i) => (
//             <div key={i} style={{ display: "flex", gap: 12, marginBottom: 5 }}>
//               <div style={{ width: 40, height: 5, background: "#ccc", borderRadius: 2, flexShrink: 0 }} />
//               <div style={{ flex: 1 }}>
//                 <div style={{ width: "70%", height: 5, background: "#ddd", borderRadius: 2, marginBottom: 2 }} />
//                 <div style={{ width: "50%", height: 4, background: "#eee", borderRadius: 2 }} />
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   ),

//   professional: ({ accent }) => (
//     <div style={{ width: "100%", height: "100%", background: "white" }}>
//       <div style={{ background: accent, height: 6 }} />
//       <div style={{ padding: "16px 20px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${accent}` }}>
//           <div>
//             <div style={{ width: 120, height: 14, background: accent, borderRadius: 2, marginBottom: 5 }} />
//             <div style={{ width: 80, height: 8, background: "#bbb", borderRadius: 2 }} />
//           </div>
//           <div style={{ textAlign: "right" }}>
//             {[65, 75, 55].map((w, i) => (
//               <div key={i} style={{ width: w, height: 5, background: "#ddd", borderRadius: 2, marginBottom: 3, marginLeft: "auto" }} />
//             ))}
//           </div>
//         </div>
//         {[["EXPERIENCE", 3], ["EDUCATION", 2]].map(([label, rows], si) => (
//           <div key={si} style={{ marginBottom: 12 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//               <div style={{ width: 6, height: 6, background: accent, borderRadius: "50%" }} />
//               <div style={{ width: 70, height: 6, background: accent, borderRadius: 1 }} />
//             </div>
//             {Array(rows).fill(0).map((_, i) => (
//               <div key={i} style={{ paddingLeft: 14, marginBottom: 5 }}>
//                 <div style={{ width: "80%", height: 5, background: "#ddd", borderRadius: 2, marginBottom: 2 }} />
//                 <div style={{ width: "55%", height: 4, background: "#eee", borderRadius: 2 }} />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   ),

//   creative: ({ accent }) => (
//     <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column" }}>
//       <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
//         <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
//         <div style={{ position: "absolute", right: 10, bottom: -30, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
//         <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.5)", marginBottom: 8 }} />
//         <div style={{ width: 110, height: 12, background: "rgba(255,255,255,0.9)", borderRadius: 2, marginBottom: 5 }} />
//         <div style={{ width: 70, height: 7, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
//       </div>
//       <div style={{ padding: "12px 20px", flex: 1 }}>
//         {[["Kỹ năng", true], ["Kinh nghiệm", false], ["Học vấn", false]].map(([label, hasBars], si) => (
//           <div key={si} style={{ marginBottom: 10 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
//               <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
//               </div>
//               <div style={{ width: 55, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
//             </div>
//             {hasBars ? (
//               <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
//                 {[85, 70, 90, 60].map((v, i) => (
//                   <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
//                     <div style={{ width: 40, height: 4, background: "#eee", borderRadius: 2, flex: 1 }}>
//                       <div style={{ width: `${v}%`, height: "100%", background: `${accent}88`, borderRadius: 2 }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div style={{ paddingLeft: 22 }}>
//                 {[80, 60, 70].map((w, i) => (
//                   <div key={i} style={{ width: `${w}%`, height: 4, background: "#eee", borderRadius: 2, marginBottom: 3 }} />
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   ),
// };

// export default function TemplatePickerScreen({ onSelect, existingCVs, onBack }) {
//   const [previewId, setPreviewId] = useState(null);
//   const [hoveredId, setHoveredId] = useState(null);
//   const previewTemplate = TEMPLATES.find(t => t.id === previewId);
//   const navigate = useNavigate();
//   const token = getToken();
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [showDialog, setShowDialog] = useState(false);
//   const [hasExistingCV, setHasExistingCV] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);


//   // Render thumbnail với accent color
//   const renderThumb = (template) => {
//     const ThumbComp = THUMB_COMPONENTS[template.id];
//     return <ThumbComp accent={template.accent} />;
//   };

//   const handleUseTemplate = (template) => {
//     if (!template) return;
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     // Kiểm tra đã từng tạo chưa
//     const existing = existingCVs?.find((cv) => cv.templateId === template.id);

//     // Luôn hiện dialog, bất kể đã tạo hay chưa
//     setSelectedTemplate(template);
//     setHasExistingCV(!!existing);
//     setShowDialog(true);
//     setUploadError(null);
//   };

//   const handleContinue = () => {
//     const existing = existingCVs.find((cv) => cv.templateId === selectedTemplate.id);
//     if (typeof onSelect === "function") {
//       onSelect({
//         templateId: selectedTemplate.id,
//         _action: 'continue',
//         _existingId: existing?.id
//       });
//     }
//     setShowDialog(false);
//   };

//   const handleFresh = () => {
//     const existing = existingCVs.find((cv) => cv.templateId === selectedTemplate.id);
//     if (typeof onSelect === "function") {
//       onSelect({
//         templateId: selectedTemplate.id,
//         _action: 'fresh',
//         _existingId: existing?.id
//       });
//     }
//     setShowDialog(false);
//   };


//   const handleCreateNew = () => {
//     if (typeof onSelect === "function") {
//       onSelect({
//         templateId: selectedTemplate.id,
//         _action: 'create'
//       });
//     }
//     setShowDialog(false);
//   };


//   const handleUpload = async (files) => {
//     if (!files || files.length === 0) return;

//     setIsUploading(true);
//     setUploadError(null);

//     try {
//       const formData = new FormData();
//       Array.from(files).forEach(file => {
//         formData.append('files', file);
//       });

//       const response = await fetch(`${API}/cv-analyzer/analyze`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Upload failed: ${response.status}`);
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || 'Phân tích CV thất bại');
//       }

//       // QUAN TRỌNG: result.data là object DTO, KHÔNG phải array
//       const analyzedData = result.data; // Bỏ [0] đi!

//       if (!analyzedData || typeof analyzedData !== 'object') {
//         throw new Error('Không có dữ liệu trả về từ server');
//       }

//       console.log("Analyzed Data:", analyzedData);

//       // Map dữ liệu (đã có personalInfo nested)
//       const mappedData = mapAnalyzedDataToCV(analyzedData);
//       const cvName = analyzedData.personalInfo?.fullName || `CV ${selectedTemplate.name}`;

//       if (typeof onSelect === "function") {
//         onSelect({
//           templateId: selectedTemplate.id,
//           _action: 'upload',
//           data: mappedData,
//           name: cvName,
//           rawData: analyzedData
//         });
//       }

//       setShowDialog(false);
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadError(error.message || 'Có lỗi xảy ra khi tải lên CV');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Hàm map dữ liệu từ backend sang format CV frontend
//   const mapAnalyzedDataToCV = (dto) => {
//     // dto có cấu trúc: { personalInfo: {...}, experiences: [...], ... }
//     return {
//       personalInfo: {
//         fullName: dto.personalInfo?.fullName || "",
//         portfolio: dto.personalInfo?.portfolio || "",
//         email: dto.personalInfo?.email || "",
//         phone: dto.personalInfo?.phone || "",
//         address: dto.personalInfo?.address || "",
//         linkedin: dto.personalInfo?.linkedin || ""
//       },
//       summary: dto.summary || "",
//       experiences: Array.isArray(dto.experiences) ? dto.experiences.map(exp => ({
//         company: exp.company || "",
//         position: exp.position || "",
//         duration: exp.duration || "",
//         description: exp.description || ""
//       })) : [],
//       education: Array.isArray(dto.education) ? dto.education.map(edu => ({
//         institution: edu.institution || "",
//         degree: edu.degree || "",
//         year: edu.year || "",
//         gpa: edu.gpa || ""
//       })) : [],
//       skills: Array.isArray(dto.skills) ? dto.skills.map(skill => ({
//         category: skill.category || "Kỹ năng",
//         items: skill.items || ""
//       })) : [],
//       awards: Array.isArray(dto.awards) ? dto.awards.map(award => ({
//         title: award.title || "",
//         issuer: award.issuer || "",
//         year: award.year || "",
//         description: award.description || ""
//       })) : [],
//       certifications: Array.isArray(dto.certifications) ? dto.certifications.map(cert => ({
//         name: cert.name || "",
//         issuer: cert.issuer || "",
//         year: cert.year || "",
//         score: cert.score || ""
//       })) : [],
//       activities: Array.isArray(dto.activities) ? dto.activities.map(act => ({
//         organization: act.organization || "",
//         role: act.role || "",
//         duration: act.duration || "",
//         description: act.description || ""
//       })) : []
//     };
//   };

//   const handleCancel = () => {
//     setShowDialog(false);
//     setSelectedTemplate(null);
//     setUploadError(null);
//     setIsUploading(false);
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#F2F1EE" }}>
//       <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "20px 40px", display: "flex", alignItems: "center", gap: 20 }}>
//         {/* {onBack && <button onClick={onBack} style={{ padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 14, cursor: "pointer", color: "#555" }}>← Quay lại</button>} */}
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0, fontFamily: "Playfair Display, serif" }}>Chọn mẫu CV</h1>
//           <p style={{ color: "#888", fontSize: 14, margin: "4px 0 0" }}>Chọn template phù hợp với phong cách của bạn</p>
//         </div>
//       </div>

//       <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
//           {TEMPLATES.map(template => {
//             const hasPrev = existingCVs?.some(cv => cv.templateId === template.id);
//             return (
//               <div key={template.id}
//                 onMouseEnter={() => setHoveredId(template.id)}
//                 onMouseLeave={() => setHoveredId(null)}
//                 style={{ borderRadius: 12, overflow: "hidden", background: "white", boxShadow: hoveredId === template.id ? "0 12px 32px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.25s", transform: hoveredId === template.id ? "translateY(-4px)" : "none", cursor: "pointer" }}>
//                 <div style={{ height: 300, position: "relative", overflow: "hidden", background: template.bg }}>
//                   {renderThumb(template)}
//                   <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: hoveredId === template.id ? 1 : 0, transition: "opacity 0.2s" }}>
//                     <button onClick={() => setPreviewId(template.id)} style={{ padding: "10px 22px", border: "2px solid white", background: "transparent", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", width: 150 }}>👁 Xem thử</button>
//                     <button onClick={() => handleUseTemplate(template)} style={{ padding: "10px 22px", background: template.accent, border: "none", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", width: 150 }}>✦ Dùng mẫu này</button>
//                   </div>
//                   {hasPrev && <div style={{ position: "absolute", top: 8, right: 8, background: "#16a34a", color: "white", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 8 }}>Đã tạo</div>}
//                 </div>
//                 <div style={{ padding: "14px 16px" }}>
//                   <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 2 }}>{template.name}</div>
//                   <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{template.subtitle}</div>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
//                     {template.tags.map(tag => <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: template.accent + "14", color: template.accent, borderRadius: 6, fontWeight: 500 }}>{tag}</span>)}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {previewTemplate && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 40 }} onClick={() => setPreviewId(null)}>
//           <div style={{ background: "white", borderRadius: 16, width: "90%", maxWidth: 900, height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
//             <div style={{ padding: "16px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div>
//                 <div style={{ fontWeight: 700, fontSize: 16 }}>{previewTemplate.name}</div>
//                 <div style={{ fontSize: 12, color: "#888" }}>{previewTemplate.subtitle}</div>
//               </div>
//               <button onClick={() => setPreviewId(null)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9f9f9", cursor: "pointer", fontSize: 16, color: "#666" }}>✕</button>
//             </div>
//             <div style={{ flex: 1, overflow: "auto", background: "#f3f4f6", display: "flex", justifyContent: "center", padding: 20 }}>
//               <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
//                 <CVRenderer
//                   templateId={previewTemplate.id}
//                   data={EMPTY_CV}
//                   onChange={() => { }}
//                   isEdit={false}
//                   accent={previewTemplate.accent}
//                   styleConfig={{
//                     fontFamily: "'DM Sans', sans-serif",
//                     baseFontSize: 13,
//                     lineHeight: 1.6,
//                     accentColor: previewTemplate.accent
//                   }}
//                   sectionOrder={["experiences", "education", "skills", "awards", "certifications", "activities"]}
//                   setSectionOrder={() => { }}
//                 />
//                 {/* Hiển thị preview ở đây nếu cần */}
//               </div>
//             </div>
//             <div style={{ padding: "14px 24px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 12 }}>
//               <button onClick={() => setPreviewId(null)} style={{ padding: "9px 20px", border: "1px solid #ddd", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, color: "#555" }}>Đóng</button>
//               <button onClick={() => { setPreviewId(null); handleUseTemplate(previewTemplate); }} style={{ padding: "9px 20px", background: previewTemplate.accent, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✦ Dùng mẫu này</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDialog && selectedTemplate && (
//         <ReturnDialog
//           template={selectedTemplate}
//           hasExistingCV={hasExistingCV}
//           onContinue={handleContinue}
//           onFresh={handleFresh}
//           onCreateNew={handleCreateNew}
//           onUpload={handleUpload}
//           onCancel={handleCancel}
//         />
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES, EMPTY_CV } from "../../../utils/constants"
import CVRenderer from "./../../cv-templates/CVRenderer"
import { getToken } from '../../../utils/auth'
import ReturnDialog from "../ReturnDialog/ReturnDialog"

const API = "http://localhost:3000/api";

const THUMB_COMPONENTS = {
  classic: ({accent}) => (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ background: accent, padding: "20px 24px 16px", color: "white" }}>
        <div style={{ width: 120, height: 14, background: "rgba(255,255,255,0.9)", borderRadius: 2, marginBottom: 8 }} />
        <div style={{ width: 80, height: 9, background: "rgba(255,255,255,0.5)", borderRadius: 2, marginBottom: 12 }} />
        <div style={{ display: "flex", gap: 16 }}>
          {[70, 90, 60].map((w, i) => (
            <div key={i} style={{ width: w, height: 7, background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 24px", flex: 1 }}>
        {[["Kinh nghiệm", [100, 85, 90, 70]], ["Học vấn", [100, 75]], ["Kỹ năng", [60, 80, 50, 70]]].map(([label, widths], si) => (
          <div key={si} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 60, height: 8, background: accent, borderRadius: 1, opacity: 0.85 }} />
              <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {widths.map((w, i) => (
                <div key={i} style={{ width: `${w}%`, height: 6, background: "#e8e8e8", borderRadius: 2 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  
  modern: ({accent}) => (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex" }}>
      <div style={{ width: "38%", background: accent, padding: "20px 12px", color: "white" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", margin: "0 auto 10px" }} />
        <div style={{ width: "90%", height: 8, background: "rgba(255,255,255,0.8)", borderRadius: 2, marginBottom: 5 }} />
        <div style={{ width: "70%", height: 6, background: "rgba(255,255,255,0.4)", borderRadius: 2, marginBottom: 16 }} />
        {[70, 85, 60, 75, 50].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 5, background: "rgba(255,255,255,0.3)", borderRadius: 2, marginBottom: 4 }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: "16px 12px" }}>
        {[["Kinh nghiệm", 3], ["Học vấn", 2]].map(([label, rows], si) => (
          <div key={si} style={{ marginBottom: 12 }}>
            <div style={{ width: 70, height: 7, background: accent, borderRadius: 1, marginBottom: 6, opacity: 0.9 }} />
            {Array(rows).fill(0).map((_, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                <div style={{ width: "80%", height: 5, background: "#ddd", borderRadius: 2, marginBottom: 2 }} />
                <div style={{ width: "60%", height: 4, background: "#eee", borderRadius: 2 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),

  minimal: () => (
    <div style={{ width: "100%", height: "100%", background: "white", padding: "20px 24px" }}>
      <div style={{ borderBottom: "2px solid #1C1C1C", paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ width: 130, height: 16, background: "#1C1C1C", borderRadius: 2, marginBottom: 6 }} />
        <div style={{ width: 90, height: 9, background: "#999", borderRadius: 2, marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 12 }}>
          {[60, 70, 50].map((w, i) => (
            <div key={i} style={{ width: w, height: 6, background: "#ccc", borderRadius: 2 }} />
          ))}
        </div>
      </div>
      {[["EXPERIENCE", 3], ["EDUCATION", 2], ["SKILLS", 1]].map(([label, rows], si) => (
        <div key={si} style={{ marginBottom: 12 }}>
          <div style={{ width: 70, height: 6, background: "#1C1C1C", borderRadius: 1, marginBottom: 7 }} />
          {Array(rows).fill(0).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 5 }}>
              <div style={{ width: 40, height: 5, background: "#ccc", borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: "70%", height: 5, background: "#ddd", borderRadius: 2, marginBottom: 2 }} />
                <div style={{ width: "50%", height: 4, background: "#eee", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),

  professional: ({accent}) => (
    <div style={{ width: "100%", height: "100%", background: "white" }}>
      <div style={{ background: accent, height: 6 }} />
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${accent}` }}>
          <div>
            <div style={{ width: 120, height: 14, background: accent, borderRadius: 2, marginBottom: 5 }} />
            <div style={{ width: 80, height: 8, background: "#bbb", borderRadius: 2 }} />
          </div>
          <div style={{ textAlign: "right" }}>
            {[65, 75, 55].map((w, i) => (
              <div key={i} style={{ width: w, height: 5, background: "#ddd", borderRadius: 2, marginBottom: 3, marginLeft: "auto" }} />
            ))}
          </div>
        </div>
        {[["EXPERIENCE", 3], ["EDUCATION", 2]].map(([label, rows], si) => (
          <div key={si} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, background: accent, borderRadius: "50%" }} />
              <div style={{ width: 70, height: 6, background: accent, borderRadius: 1 }} />
            </div>
            {Array(rows).fill(0).map((_, i) => (
              <div key={i} style={{ paddingLeft: 14, marginBottom: 5 }}>
                <div style={{ width: "80%", height: 5, background: "#ddd", borderRadius: 2, marginBottom: 2 }} />
                <div style={{ width: "55%", height: 4, background: "#eee", borderRadius: 2 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),

  creative: ({accent}) => (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", right: 10, bottom: -30, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.5)", marginBottom: 8 }} />
        <div style={{ width: 110, height: 12, background: "rgba(255,255,255,0.9)", borderRadius: 2, marginBottom: 5 }} />
        <div style={{ width: 70, height: 7, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
      </div>
      <div style={{ padding: "12px 20px", flex: 1 }}>
        {[["Kỹ năng", true], ["Kinh nghiệm", false], ["Học vấn", false]].map(([label, hasBars], si) => (
          <div key={si} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
              </div>
              <div style={{ width: 55, height: 6, background: accent, borderRadius: 1, opacity: 0.8 }} />
            </div>
            {hasBars ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[85, 70, 90, 60].map((v, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ width: 40, height: 4, background: "#eee", borderRadius: 2, flex: 1 }}>
                      <div style={{ width: `${v}%`, height: "100%", background: `${accent}88`, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ paddingLeft: 22 }}>
                {[80, 60, 70].map((w, i) => (
                  <div key={i} style={{ width: `${w}%`, height: 4, background: "#eee", borderRadius: 2, marginBottom: 3 }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ),
};

export default function TemplatePickerScreen({ onSelect, existingCVs, onBack }) {
  const [previewId, setPreviewId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hasExistingCV, setHasExistingCV] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const previewTemplate = TEMPLATES.find(t => t.id === previewId);
  const navigate = useNavigate();
  const token = getToken();

  const renderThumb = (template) => {
    const ThumbComp = THUMB_COMPONENTS[template.id];
    return ThumbComp ? <ThumbComp accent={template.accent} /> : null;
  };

  const handleUseTemplate = (template) => {
    if (!template) return;
    if (!token) {
      navigate("/login");
      return;
    }

    const existing = existingCVs?.find((cv) => cv.templateId === template.id);
    setSelectedTemplate(template);
    setHasExistingCV(!!existing);
    setShowDialog(true);
    setUploadError(null);
  };

  const handleContinue = () => {
    const existing = existingCVs.find((cv) => cv.templateId === selectedTemplate.id);
    if (typeof onSelect === "function") {
      onSelect({ 
        templateId: selectedTemplate.id, 
        _action: 'continue',
        _existingId: existing?.id
      });
    }
    setShowDialog(false);
  };

  const handleFresh = () => {
    const existing = existingCVs.find((cv) => cv.templateId === selectedTemplate.id);
    if (typeof onSelect === "function") {
      onSelect({ 
        templateId: selectedTemplate.id, 
        _action: 'fresh',
        _existingId: existing?.id
      });
    }
    setShowDialog(false);
  };

  const handleCreateNew = () => {
    if (typeof onSelect === "function") {
      onSelect({ 
        templateId: selectedTemplate.id, 
        _action: 'create'
      });
    }
    setShowDialog(false);
  };

  const mapAnalyzedDataToCV = (dto) => {
    return {
      personalInfo: {
        fullName: dto.personalInfo?.fullName || "",
        portfolio: dto.personalInfo?.portfolio || "",
        email: dto.personalInfo?.email || "",
        phone: dto.personalInfo?.phone || "",
        address: dto.personalInfo?.address || "",
        linkedin: dto.personalInfo?.linkedin || ""
      },
      summary: dto.summary || "",
      experiences: Array.isArray(dto.experiences) ? dto.experiences.map(exp => ({
        company: exp.company || "",
        position: exp.position || "",
        duration: exp.duration || "",
        description: exp.description || ""
      })) : [],
      education: Array.isArray(dto.education) ? dto.education.map(edu => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        year: edu.year || "",
        gpa: edu.gpa || ""
      })) : [],
      skills: Array.isArray(dto.skills) ? dto.skills.map(skill => ({
        category: skill.category || "Kỹ năng",
        items: skill.items || ""
      })) : [],
      awards: Array.isArray(dto.awards) ? dto.awards.map(award => ({
        title: award.title || "",
        issuer: award.issuer || "",
        year: award.year || "",
        description: award.description || ""
      })) : [],
      certifications: Array.isArray(dto.certifications) ? dto.certifications.map(cert => ({
        name: cert.name || "",
        issuer: cert.issuer || "",
        year: cert.year || "",
        score: cert.score || ""
      })) : [],
      activities: Array.isArray(dto.activities) ? dto.activities.map(act => ({
        organization: act.organization || "",
        role: act.role || "",
        duration: act.duration || "",
        description: act.description || ""
      })) : []
    };
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`${API}/cv-analyzer/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Phân tích CV thất bại');
      }

      // result.data là object DTO (KHÔNG phải array)
      const analyzedData = result.data;

      if (!analyzedData || typeof analyzedData !== 'object') {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }

      const mappedData = mapAnalyzedDataToCV(analyzedData);
      const cvName = analyzedData.personalInfo?.fullName || `CV ${selectedTemplate.name}`;

      if (typeof onSelect === "function") {
        onSelect({
          templateId: selectedTemplate.id,
          _action: 'upload',
          data: mappedData,
          name: cvName,
          rawData: analyzedData
        });
      }
      
      setShowDialog(false);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Có lỗi xảy ra khi tải lên CV');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setSelectedTemplate(null);
    setUploadError(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F2F1EE" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "20px 40px", display: "flex", alignItems: "center", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: 0, fontFamily: "Playfair Display, serif" }}>Chọn mẫu CV</h1>
          <p style={{ color: "#888", fontSize: 14, margin: "4px 0 0" }}>Chọn template phù hợp với phong cách của bạn</p>
        </div>
      </div>

      <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
          {TEMPLATES.map(template => {
            const hasPrev = existingCVs?.some(cv => cv.templateId === template.id);
            return (
              <div key={template.id}
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ borderRadius: 12, overflow: "hidden", background: "white", boxShadow: hoveredId === template.id ? "0 12px 32px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.25s", transform: hoveredId === template.id ? "translateY(-4px)" : "none", cursor: "pointer" }}>
                <div style={{ height: 300, position: "relative", overflow: "hidden", background: template.bg }}>
                  {renderThumb(template)}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: hoveredId === template.id ? 1 : 0, transition: "opacity 0.2s" }}>
                    <button onClick={() => setPreviewId(template.id)} style={{ padding: "10px 22px", border: "2px solid white", background: "transparent", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", width: 150 }}>👁 Xem thử</button>
                    <button onClick={() => handleUseTemplate(template)} style={{ padding: "10px 22px", background: template.accent, border: "none", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", width: 150 }}>✦ Dùng mẫu này</button>
                  </div>
                  {hasPrev && <div style={{ position: "absolute", top: 8, right: 8, background: "#16a34a", color: "white", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 8 }}>Đã tạo</div>}
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 2 }}>{template.name}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{template.subtitle}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {template.tags.map(tag => <span key={tag} style={{ fontSize: 10, padding: "2px 7px", background: template.accent + "14", color: template.accent, borderRadius: 6, fontWeight: 500 }}>{tag}</span>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {previewTemplate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 40 }} onClick={() => setPreviewId(null)}>
          <div style={{ background: "white", borderRadius: 16, width: "90%", maxWidth: 900, height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{previewTemplate.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{previewTemplate.subtitle}</div>
              </div>
              <button onClick={() => setPreviewId(null)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9f9f9", cursor: "pointer", fontSize: 16, color: "#666" }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: "auto", background: "#f3f4f6", display: "flex", justifyContent: "center", padding: 20 }}>
              <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
                <CVRenderer
                  templateId={previewTemplate.id}
                  data={EMPTY_CV}
                  onChange={() => {}}
                  isEdit={false}
                  accent={previewTemplate.accent}
                  styleConfig={{
                    fontFamily: "'DM Sans', sans-serif",
                    baseFontSize: 13,
                    lineHeight: 1.6,
                    accentColor: previewTemplate.accent
                  }}
                  sectionOrder={["experiences", "education", "skills", "awards", "certifications", "activities"]}
                  setSectionOrder={() => {}}
                />
              </div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setPreviewId(null)} style={{ padding: "9px 20px", border: "1px solid #ddd", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, color: "#555" }}>Đóng</button>
              <button onClick={() => { setPreviewId(null); handleUseTemplate(previewTemplate); }} style={{ padding: "9px 20px", background: previewTemplate.accent, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✦ Dùng mẫu này</button>
            </div>
          </div>
        </div>
      )}

      {showDialog && selectedTemplate && (
        <ReturnDialog
          template={selectedTemplate}
          hasExistingCV={hasExistingCV}
          onContinue={handleContinue}
          onFresh={handleFresh}
          onCreateNew={handleCreateNew}
          onUpload={handleUpload}
          onCancel={handleCancel}
          isUploading={isUploading}
          uploadError={uploadError}
        />
      )}
    </div>
  );
}