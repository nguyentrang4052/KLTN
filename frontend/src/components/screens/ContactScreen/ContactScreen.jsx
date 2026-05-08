import { useState } from 'react';
import './ContactScreen.css';

const faqs = [
  {
    category: "Tài khoản & Đăng ký",
    icon: "👤",
    questions: [
      {
        q: "Làm thế nào để tạo tài khoản GZCONNECT?",
        a: "Nhấn nút 'Bắt đầu miễn phí' ở trang chủ, điền email và mật khẩu, sau đó xác nhận qua email. Chỉ mất khoảng 1 phút để hoàn tất đăng ký.",
      },
      {
        q: "Tôi có thể đăng nhập bằng tài khoản mạng xã hội không?",
        a: "Có, GZCONNECT hỗ trợ đăng nhập qua Google và Facebook. Bạn cũng có thể liên kết nhiều phương thức đăng nhập trong phần Cài đặt tài khoản.",
      },
      {
        q: "Tôi quên mật khẩu phải làm gì?",
        a: "Nhấn 'Quên mật khẩu?' trên trang đăng nhập, nhập email đăng ký — bạn sẽ nhận được link đặt lại mật khẩu trong vòng vài phút.",
      },
    ],
  },
  {
    category: "Tìm việc & AI Gợi ý",
    icon: "🤖",
    questions: [
      {
        q: "AI gợi ý việc làm hoạt động như thế nào?",
        a: "Hệ thống AI phân tích hồ sơ, hành vi tìm kiếm (việc làm đã xem, lưu, click) và thông tin cá nhân để học và dự đoán những công việc phù hợp nhất. Càng dùng nhiều, AI càng hiểu bạn hơn.",
      },
      {
        q: "Dữ liệu được tổng hợp từ bao nhiêu nền tảng?",
        a: "GZCONNECT hiện tổng hợp tin tuyển dụng từ TopCV, CareerLink, CareerViet và nhiều nền tảng khác. Tổng cộng hơn 50,000 tin tuyển dụng được cập nhật hàng ngày.",
      },
      {
        q: "Tôi có thể tắt tính năng theo dõi hành vi không?",
        a: "Có. Vào Cài đặt → Quyền riêng tư → Tắt 'Theo dõi hành vi để cá nhân hóa'. Lưu ý điều này sẽ làm giảm độ chính xác của gợi ý AI.",
      },
    ],
  },
  {
    category: "Ứng tuyển",
    icon: "🚀",
    questions: [
      {
        q: "Nhấn Apply sẽ xảy ra điều gì?",
        a: "Khi nhấn Apply, bạn sẽ được chuyển trực tiếp đến trang tuyển dụng gốc (TopCV, CareerLink...) để hoàn tất nộp hồ sơ. GZCONNECT không quản lý quá trình ứng tuyển trực tiếp.",
      },
      {
        q: "Tôi có thể theo dõi trạng thái ứng tuyển không?",
        a: "Có, vào mục 'Đơn ứng tuyển' để xem lịch sử các vị trí bạn đã click Apply. Trạng thái chi tiết cần kiểm tra trực tiếp trên từng nền tảng gốc.",
      },
    ],
  },
  {
    category: "CV Builder",
    icon: "📄",
    questions: [
      {
        q: "Công cụ tạo CV có gì đặc biệt?",
        a: "CV Builder của GZCONNECT có 20+ mẫu chuyên nghiệp, hỗ trợ ATS optimization, gợi ý từ khóa theo ngành, dịch CV Anh–Việt và xuất PDF chuẩn.",
      },
      {
        q: "Tôi có thể tạo bao nhiêu CV?",
        a: "Tài khoản miễn phí tạo được tối đa 2 CV. Tài khoản Premium không giới hạn và cho phép tạo nhiều phiên bản cho từng vị trí ứng tuyển.",
      },
    ],
  },
];

const contactCards = [
  {
    icon: "📧",
    title: "Email hỗ trợ",
    desc: "support@gzconnect.vn",
    accentLight: "rgba(192,65,42,0.08)",
    accentBorder: "rgba(192,65,42,0.2)",
    accentText: "var(--rust2)",
    btnBg: "linear-gradient(135deg, rgb(192,65,42) 0%, rgb(210,90,60) 100%)",
  },
  {
    icon: "📞",
    title: "Hotline",
    desc: "1800 1234 (8:00 – 22:00)",
    accentLight: "rgba(180,130,20,0.08)",
    accentBorder: "rgba(180,130,20,0.2)",
    accentText: "var(--amber2)",
    btnBg: "linear-gradient(135deg, #B48214 0%, #D4A020 100%)",
  },
];

export default function ContactScreen() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div className="cf-root">
      {/* HERO */}
      <div className="cf-hero">
        <div className="land-noise" />
        <div className="land-glow" style={{ background: 'radial-gradient(ellipse, rgba(180,130,20,0.14) 0%, transparent 70%)' }} />
        <div className="cf-hero-inner">
          
          <h1 className="hero-title" style={{ fontSize: 48 }}>
            Chúng tôi luôn<br /><em>sẵn sàng hỗ trợ</em>
          </h1>
          <p className="hero-sub">
            Có câu hỏi về tính năng, tài khoản hay cần hỗ trợ kỹ thuật?
            Đội ngũ GZCONNECT sẵn sàng giúp bạn mọi lúc.
          </p>
        </div>
      </div>

      {/* CONTACT CARDS */}
      <div className="feat-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="sect-eye">Kênh hỗ trợ</div>
        <h2 className="sect-title" style={{ marginBottom: 32 }}>Chọn cách liên hệ<br />phù hợp với bạn</h2>
        <div className="cf-contact-cards">
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="cf-contact-card"
              style={{ '--card-accent-light': card.accentLight, '--card-accent-border': card.accentBorder }}
            >
              <div className="cf-card-icon-wrap">
                <span className="cf-card-icon">{card.icon}</span>
              </div>
              <div className="cf-card-title">{card.title}</div>
              <div className="cf-card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ + FORM */}
      <div className="intro-section" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="cf-two-col">

          {/* FAQ */}
          <div className="cf-faq-col">
            <div className="intro-eyebrow">Giải đáp thắc mắc</div>
            <h2 className="intro-title" style={{ marginBottom: 8 }}>Câu hỏi thường gặp</h2>
            <p className="intro-sub" style={{ marginBottom: 40 }}>
              Tìm câu trả lời nhanh cho những vấn đề phổ biến nhất.
            </p>

            {faqs.map((cat) => (
              <div key={cat.category} className="cf-faq-cat">
                <div className="cf-faq-cat-header">
                  <span className="cf-faq-cat-icon">{cat.icon}</span>
                  <span>{cat.category}</span>
                </div>
                {cat.questions.map((faq, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openFaq === key;
                  return (
                    <div key={key} className={`cf-faq-item ${isOpen ? 'open' : ''}`}>
                      <div
                        className="cf-faq-q"
                        onClick={() => setOpenFaq(isOpen ? null : key)}
                      >
                        <span>{faq.q}</span>
                        <span className={`cf-faq-arrow ${isOpen ? 'open' : ''}`}>▼</span>
                      </div>
                      <div className={`cf-faq-a ${isOpen ? 'open' : ''}`}>{faq.a}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}