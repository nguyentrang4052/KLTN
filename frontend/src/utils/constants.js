export const EMPTY_CV = {
  personalInfo: { 
    fullName: "", email: "", phone: "", address: "", linkedin: "", portfolio: "" 
  },
  summary: "",
  experiences: [{ company: "", position: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "", gpa: "" }],
  skills: [{ category: "", items: "" }],
  activities: [{ organization: "", role: "", duration: "", description: "" }],
  awards: [{ title: "", issuer: "", year: "", description: "" }],
  certifications: [{ name: "", issuer: "", year: "", score: "" }],
};

export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    subtitle: "Truyền thống · Chuyên nghiệp",
    accent: "#2C3E6B",
    bg: "#F8F7F4",
    tags: ["Phù hợp mọi ngành", "ATS Friendly", "Trang trọng"],
  },
  {
    id: "modern",
    name: "Modern",
    subtitle: "Hiện đại · Hai cột",
    accent: "#1A6B5A",
    bg: "#F0F7F5",
    tags: ["Tech & Design", "Nổi bật", "Hai cột"],
  },
  {
    id: "minimal",
    name: "Minimal",
    subtitle: "Tối giản · Thanh lịch",
    accent: "#1C1C1C",
    bg: "#FAFAFA",
    tags: ["Clean", "Typography", "Mọi ngành"],
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "Chuyên nghiệp · Corporate",
    accent: "#8B1A1A",
    bg: "#FDF9F9",
    tags: ["Finance & Law", "Formal", "Cấp cao"],
  },
  {
    id: "creative",
    name: "Creative",
    subtitle: "Sáng tạo · Nghệ thuật",
    accent: "#5B2D8E",
    bg: "#F8F4FD",
    tags: ["Design & Art", "Unique", "Portfolio"],
  },
];

export const FONT_OPTIONS = [
  { value: "'DM Sans', sans-serif", label: "DM Sans" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
];

export const DEFAULT_STYLE_CONFIG = {
  fontFamily: "'DM Sans', sans-serif",
  baseFontSize: 13,
  lineHeight: 1.6,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  accentColor: "#2C3E6B",
};

export const STORAGE_KEY = "cv_builder_state";

// Thêm default section titles để có thể customize
export const DEFAULT_SECTION_TITLES = {
  experiences: "Kinh nghiệm làm việc",
  education: "Học vấn",
  skills: "Kỹ năng",
  activities: "Hoạt động ngoại khóa",
  awards: "Thành tích & Giải thưởng",
  certifications: "Chứng chỉ",
  summary: "Mục tiêu nghề nghiệp"
};