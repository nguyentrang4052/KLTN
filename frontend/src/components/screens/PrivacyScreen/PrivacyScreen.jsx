import './PrivacyScreen.css';

const sections = [
  {
    icon: "📋", num: "1",
    title: "Thông tin chúng tôi thu thập",
    items: [
      { sub: "Thông tin bạn cung cấp trực tiếp", text: "Khi đăng ký tài khoản, chúng tôi thu thập: họ tên, địa chỉ email, số điện thoại, thông tin hồ sơ nghề nghiệp (kinh nghiệm, học vấn, kỹ năng), CV và tài liệu đính kèm." },
      { sub: "Thông tin thu thập", text: "Khi bạn truy cập nền tảng, chúng tôi tự động thu thập: lịch sử tìm kiếm, việc làm đã xem/lưu, tương tác giao diện." },
      { sub: "Dữ liệu AI & cá nhân hóa", text: "Hệ thống AI phân tích hành vi tương tác để xây dựng mô hình sở thích cá nhân, từ đó đưa ra gợi ý việc làm phù hợp." },
    ]
  },
  {
    icon: "🎯", num: "2",
    title: "Mục đích sử dụng thông tin",
    items: [
      { sub: "Cung cấp dịch vụ cốt lõi", text: "Hiển thị và gợi ý việc làm phù hợp, hỗ trợ quy trình ứng tuyển, tổng hợp từ các nền tảng TopCV, CareerLink, CareerViet." },
      { sub: "Cải thiện trải nghiệm", text: "Cá nhân hóa giao diện và nội dung, phân tích và cải thiện tính năng sản phẩm, nghiên cứu và phát triển AI." },
      { sub: "Liên lạc & thông báo", text: "Gửi thông báo về cơ hội việc làm mới." },
    ]
  },
  {
    icon: "⚙️", num: "3",
    title: "Quyền của bạn",
    items: [
      { sub: "Truy cập & Chỉnh sửa", text: "Bạn có quyền xem, cập nhật hoặc chỉnh sửa thông tin cá nhân bất kỳ lúc nào trong phần Cài đặt tài khoản." },
      { sub: "Xóa dữ liệu", text: "Bạn có thể yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan." },
    ]
  },
  {
    icon: "🍪", num: "4",
    title: "Cookie & Công nghệ theo dõi",
    items: [
      { sub: "Cookie cần thiết", text: "Duy trì phiên đăng nhập và bảo mật. Không thể tắt vì đây là yêu cầu kỹ thuật cơ bản của nền tảng." },
      { sub: "Cookie phân tích", text: "Giúp chúng tôi hiểu cách người dùng tương tác với nền tảng để cải thiện trải nghiệm." },
      { sub: "Cookie cá nhân hóa", text: "Lưu trữ sở thích và hành vi để cá nhân hóa gợi ý việc làm. Quản lý trong phần Cài đặt bảo mật." },
    ]
  },
];

export default function PrivacyScreen() {
  return (
    <div className="pp-root">

      {/* HERO */}
      <div className="pp-hero">
        <div className="land-noise" />
        <div className="land-glow" style={{ background: 'radial-gradient(ellipse, rgba(35,42,162,0.18) 0%, transparent 70%)' }} />
        <div className="pp-hero-inner">
          <h1 className="hero-title" style={{ fontSize: 48 }}>
            Dữ liệu của bạn,<br /><em>quyền của bạn</em>
          </h1>
          <p className="hero-sub">Chúng tôi coi trọng quyền riêng tư. Tài liệu này giải thích cách GZCONNECT thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.</p>
        </div>
      </div>

      {/* TOC */}
      <div className="feat-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="pp-toc-label">📑 Mục lục nhanh</div>
        <div className="pp-toc-grid">
          {sections.map((s) => (
            <div key={s.num} className="pp-toc-item">
              <span className="pp-toc-num">{s.num}</span>
              <span className="pp-toc-text">{s.icon} {s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="intro-section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="pp-sections">
          {sections.map((section) => (
            <div key={section.num} className="pp-section">
              <div className="pp-section-header">
                <div className="pp-section-icon">{section.icon}</div>
                <div>
                  {/* <div className="intro-eyebrow">{section.num}</div> */}
                  <div className="intro-step-title"> {section.num}. {section.title}</div>
                </div>
              </div>
              <div className="pp-items">
                {section.items.map((item) => (
                  <div key={item.sub} className="pp-item">
                    <div className="pp-item-sub">➮ {item.sub}</div>
                    <div className="pp-item-text">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}