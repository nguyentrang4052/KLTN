import { useState } from "react";
import "./Footer.css";

const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,12 2,6" />
  </svg>
);

const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.5 2a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.5 9.5a16 16 0 0 0 6 6l1.27-.75a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMapPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ─── Data ───────────────────────────────────────────────────── */
const FOOTER_LINKS = {
  "Tìm việc làm": [
    { label: "Việc làm IT / Tech", href: "/jobs/it" },
    { label: "Việc làm Marketing", href: "/jobs/marketing" },
    { label: "Việc làm Tài chính", href: "/jobs/finance" },
    { label: "Việc làm Thiết kế", href: "/jobs/design" },
    { label: "Việc làm Remote", href: "/jobs/remote" },
    { label: "Việc làm Fresher", href: "/jobs/fresher" },
  ],
  "Công cụ": [
    { label: "CV Builder AI", href: "/cv-builder"},
    { label: "AI Match Score", href: "/ai-match" },
    { label: "Auto Apply", href: "/auto-apply"},
    { label: "Salary Insights", href: "/salary" },
    { label: "Interview Prep AI", href: "/interview-prep" },
    { label: "Career Roadmap", href: "/career-roadmap" },
  ],
  "Công ty": [
    { label: "Về GZCONNECT", href: "/about" },
    { label: "Đội ngũ", href: "/team" },
    { label: "Blog & Tin tức", href: "/blog" },
    { label: "Tuyển dụng nội bộ", href: "/careers" },
    { label: "Quan hệ báo chí", href: "/press" },
    { label: "Liên hệ", href: "/contact" },
  ],
  "Hỗ trợ": [
    { label: "Trung tâm trợ giúp", href: "/help" },
    { label: "Hướng dẫn sử dụng", href: "/guide" },
    { label: "Câu hỏi thường gặp", href: "/faq" },
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Chính sách Cookie", href: "/cookies" },
  ],
};


const STATS = [
  { value: "200K+", label: "Người dùng đang tìm việc" },
  { value: "50K+", label: "Việc làm mới mỗi ngày" },
  { value: "15+", label: "Nền tảng tích hợp" },
  { value: "92%", label: "Độ chính xác AI Match" },
];

const PLATFORMS = [
  "TopCV", "CareerLink", "CareerViet", "VietnamWorks"];

const BOTTOM_LINKS = [
  { label: "Chính sách bảo mật", href: "/privacy" },
  { label: "Điều khoản", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

/* ─── Main component ─────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 5000);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="f">
      <div className="f__noise" />



      <div className="f__wrap">
        <div className="f__body">

          <div>
            <div className="f__logo"><span>GZCONNECT</span></div>
            <div className="f__desc">
              Nền tảng tìm việc thông minh đầu tiên tại Việt Nam. AI học theo hành vi
              của bạn để gợi ý việc làm phù hợp nhất.
            </div>
          </div>

          <div className="f__links">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <div className="f__col-title">{group}</div>
                <ul className="f__list">
                  {links.map((link) => (
                    <li className="f__list-item" key={link.label}>
                      <a href={link.href}>
                        <span style={{ flex: 1 }}>{link.label}</span>
                        {link.badge && (
                          <span className={`f__badge f__badge--${link.badge === "Hot" ? "hot" : "new"}`}>
                            {link.badge}
                          </span>
                        )}
                        <span className="f__arr"><IconChevron /></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="f__wrap">
        <div className="f__contact">
          <div className="f__contact-item">
            <span className="f__contact-icon"><IconMail /></span>
            <a href="mailto:gzconnect.team@gmail.com">gzconnect.team@gmail.com</a>
          </div>
          <div className="f__contact-item">
            <span className="f__contact-icon"><IconPhone /></span>
            <a href="tel:+842812345678">0123 456 789</a>
          </div>
          <div className="f__contact-item">
            <span className="f__contact-icon"><IconMapPin /></span>
            <span>Số 1 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh</span>
          </div>
        </div>
      </div>

      <div className="f__platforms">
        <div className="f__wrap">
          <div className="f__platforms-label">Dữ liệu việc làm được tổng hợp từ</div>
          <div className="f__platforms-row">
            {PLATFORMS.map((p) => (
              <div className="f__platform-pill" key={p}>{p}</div>
            ))}
          </div>
        </div>
      </div>  
      <div className="f__wrap">
        <div className="f__bottom">
          <div className="f__copy">
            © {year} <strong>GZCONNECT</strong>. Bảo lưu mọi quyền. Được tạo với ♥ tại Việt Nam.
          </div>
          <div className="f__bottom-links">
            {BOTTOM_LINKS.map((l) => (
              <a key={l.label} href={l.href}>{l.label}</a>
            ))}
          </div>
          <div className="f__bottom-right">
            {/* <button className="f__lang-btn">🌐 Tiếng Việt ▾</button> */}
            <button className="f__top-btn" onClick={scrollTop}>↑ Lên đầu</button>
          </div>
        </div>
      </div>
    </footer>
  );
}