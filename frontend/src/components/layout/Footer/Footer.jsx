import { useState } from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { getToken } from '../../../utils/auth'

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
const token = getToken()

const FOOTER_LINKS = {
  "Tìm việc làm": [
    { label: "Việc làm IT / Tech", href: "/jobs?keyword=it" },
    { label: "Việc làm Marketing", href: "/jobs?keyword=marketing" },
    { label: "Việc làm Tài chính", href: "/jobs?keyword=Tài chính" },
    { label: "Việc làm Remote", href: "/jobs?keyword=remote" },
    { label: "Việc làm Fresher", href: "/jobs?keyword=fresher" },
  ],
  "Công cụ": [
    { label: "CV Builder AI", href: "/cv-templates" },
    {
      label: "AI Match Score",
      href: token ? "/ai-assistant" : "/login",
    },
  ],
  "Giới thiệu": [
    { label: "Về GZCONNECT", href: "/about" },
    // { label: "Blog & Tin tức", href: "/blog" },
    { label: "Liên hệ", href: "/contact" },
  ],
  "Hỗ trợ": [
    // { label: "Câu hỏi thường gặp", href: "/faq" },
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Điều khoản sử dụng", href: "/term" },
  ],
};

const PLATFORMS = [
  "TopCV", "CareerLink", "CareerViet"];

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
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 5000);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavigate = (href) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                      <span
                        onClick={() => handleNavigate(link.href)}
                        style={{ cursor: "pointer", flex: 1 }}
                      >
                        {link.label}
                      </span>
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
              <span
                key={l.label}
                onClick={() => handleNavigate(l.href)}
                style={{ cursor: "pointer" }}
              >
                {l.label}
              </span>
            ))}
          </div>
          <div className="f__bottom-right">
            <button className="f__top-btn" onClick={scrollTop}>↑ Lên đầu</button>
          </div>
        </div>
      </div>
    </footer>
  );
}