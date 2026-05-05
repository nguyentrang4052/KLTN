import { useState } from "react";
import './BlogScreen.css';

const blogData = [
  {
    id: 1,
    category: "Xu hướng tuyển dụng",
    tag: "HOT",
    tagColor: "rust",
    title: "Top 10 ngành nghề có nhu cầu tuyển dụng cao nhất năm 2025",
    excerpt: "Thị trường lao động đang chứng kiến sự bùng nổ nhu cầu tuyển dụng trong các lĩnh vực công nghệ, y tế và năng lượng xanh. Khám phá những cơ hội vàng đang chờ đón bạn.",
    author: "Nguyễn Minh Anh", authorInitials: "NA",
    date: "28 Tháng 4, 2025", readTime: "5 phút đọc", views: "12.4K",
    accentColor: "#527CE6", featured: true,
  },
  {
    id: 2,
    category: "Kỹ năng nghề nghiệp",
    tag: "MỚI",
    tagColor: "navy",
    title: "7 kỹ năng AI mà mọi nhân viên văn phòng cần biết trong năm 2025",
    excerpt: "Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc. Đây là những kỹ năng AI thiết yếu giúp bạn không bị bỏ lại phía sau trong cuộc cách mạng công nghiệp 4.0.",
    author: "Trần Bảo Long", authorInitials: "TL",
    date: "25 Tháng 4, 2025", readTime: "7 phút đọc", views: "8.9K",
    accentColor: "rgb(35,42,162)", featured: true,
  },
  {
    id: 3,
    category: "CV & Hồ sơ",
    tag: "TIPS",
    tagColor: "amber",
    title: "Bí quyết viết CV vượt qua hệ thống ATS và chinh phục nhà tuyển dụng",
    excerpt: "95% CV bị loại trước khi đến tay nhà tuyển dụng vì hệ thống ATS. Tìm hiểu cách tối ưu CV để tăng cơ hội phỏng vấn lên gấp 3 lần.",
    author: "Lê Thu Hương", authorInitials: "LH",
    date: "22 Tháng 4, 2025", readTime: "6 phút đọc", views: "15.2K",
    accentColor: "#C0412A", featured: false,
  },
  {
    id: 4,
    category: "Phỏng vấn",
    tag: "GUIDE",
    tagColor: "navy",
    title: "Cách trả lời 20 câu hỏi phỏng vấn khó nhất mà không bị mất điểm",
    excerpt: "Từ 'Điểm yếu của bạn là gì?' đến 'Bạn mong đợi mức lương bao nhiêu?', đây là hướng dẫn xử lý những câu hỏi hóc búa nhất trong buổi phỏng vấn.",
    author: "Phạm Việt Hùng", authorInitials: "PH",
    date: "20 Tháng 4, 2025", readTime: "10 phút đọc", views: "20.1K",
    accentColor: "#527CE6", featured: false,
  },
  {
    id: 5,
    category: "Lương & Đãi ngộ",
    tag: "KHẢO SÁT",
    tagColor: "amber",
    title: "Báo cáo lương ngành IT Việt Nam Q1/2025: Mức nào là cạnh tranh?",
    excerpt: "Phân tích chi tiết mức lương theo vị trí, kinh nghiệm và công ty trong ngành IT. Biết vị trí của bạn trên thị trường để đàm phán hiệu quả hơn.",
    author: "Vũ Thanh Tùng", authorInitials: "VT",
    date: "18 Tháng 4, 2025", readTime: "8 phút đọc", views: "18.7K",
    accentColor: "#C0412A", featured: false,
  },
  {
    id: 6,
    category: "Phát triển sự nghiệp",
    tag: "STORY",
    tagColor: "rust",
    title: "Từ fresher đến senior: Lộ trình 3 năm của một Frontend Developer",
    excerpt: "Câu chuyện thực tế từ anh Hải — người đã tăng lương từ 7 triệu lên 45 triệu trong 3 năm. Những bài học xương máu và chiến lược phát triển trong ngành lập trình.",
    author: "Ngô Minh Hải", authorInitials: "NH",
    date: "15 Tháng 4, 2025", readTime: "12 phút đọc", views: "25.3K",
    accentColor: "rgb(35,42,162)", featured: false,
  },
];

const CATEGORIES = ["Tất cả", "Xu hướng tuyển dụng", "Kỹ năng nghề nghiệp", "CV & Hồ sơ", "Phỏng vấn", "Lương & Đãi ngộ", "Phát triển sự nghiệp"];

const CARD_BG = {
  "#527CE6": "linear-gradient(145deg, rgba(82,124,230,0.2) 0%, rgba(82,124,230,0.04) 100%)",
  "rgb(35,42,162)": "linear-gradient(145deg, rgba(35,42,162,0.28) 0%, rgba(18,22,105,0.06) 100%)",
  "#C0412A": "linear-gradient(145deg, rgba(192,65,42,0.22) 0%, rgba(192,65,42,0.04) 100%)",
};

export default function BlogScreen() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogData.filter((p) => {
    const matchCat = activeCategory === "Tất cả" || p.category === activeCategory;
    const matchQ = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <div className="blog-root">


      {/* HERO */}
      <div className="blog-hero">
        <div className="land-noise" />
        <div className="land-glow" />
        <div className="blog-hero-inner">
          <div className="hero-eyebrow">
            <span className="eyebrow-pulse" />
            Cập nhật hàng ngày
          </div>
          <h1 className="hero-title" style={{ fontSize: 52 }}>
            Blog nghề nghiệp &amp;<br /><em>Tin tức tuyển dụng</em>
          </h1>
          <p className="hero-sub">Kiến thức, kỹ năng và xu hướng mới nhất giúp bạn phát triển sự nghiệp vượt bậc.</p>

          <div className="blog-search-row">
            <div className="blog-search-wrap">
              <span className="blog-search-icon">🔍</span>
              <input
                className="blog-search-input"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="blog-search-btn">Tìm kiếm</button>
          </div>

          <div className="blog-hero-stats">
            {[["150+", "Bài viết"], ["12", "Chủ đề"], ["50K+", "Lượt đọc / tháng"]].map(([num, lbl]) => (
              <div key={lbl} className="bhs-item">
                <div className="bhs-num">{num}</div>
                <div className="bhs-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="blog-cats-section">
        <div className="blog-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`blog-cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      {featured.length > 0 && (
        <div className="blog-section blog-section--dark">
          <div className="blog-section-label">
            <span className="sect-eye">⭐ BÀI VIẾT NỔI BẬT</span>
            <div className="section-divider" />
            <span className="section-count-badge">{featured.length} bài</span>
          </div>
          <div className="blog-featured-grid">
            {featured.map((post) => (
              <div key={post.id} className="blog-feat-card">
                <div className="bfc-thumb" style={{ background: CARD_BG[post.accentColor] || CARD_BG["#527CE6"] }}>
                  <span className={`bfc-tag bfc-tag--${post.tagColor}`}>{post.tag}</span>
                  <div className="bfc-thumb-cat">{post.category}</div>
                </div>
                <div className="bfc-body">
                  <div className="bfc-category" style={{ color: post.accentColor }}>{post.category}</div>
                  <h3 className="bfc-title">{post.title}</h3>
                  <p className="bfc-excerpt">{post.excerpt}</p>
                  <div className="bfc-meta">
                    <div className="bfc-avatar" style={{ background: `linear-gradient(135deg, ${post.accentColor} 0%, rgb(18,22,105) 100%)` }}>
                      {post.authorInitials}
                    </div>
                    <div>
                      <div className="bfc-author">{post.author}</div>
                      <div className="bfc-date">{post.date}</div>
                    </div>
                    <div className="bfc-meta-right">
                      <div className="bfc-read">{post.readTime}</div>
                      <div className="bfc-views">👁 {post.views}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REGULAR */}
      {regular.length > 0 && (
        <div className="blog-section blog-section--light">
          <div className="blog-section-label blog-section-label--light">
            <span className="sect-eye" style={{ color: 'var(--rust)' }}>📰 TẤT CẢ BÀI VIẾT</span>
            <div className="section-divider section-divider--light" />
            <span className="section-count-badge section-count-badge--light">{regular.length} bài</span>
          </div>
          <div className="blog-reg-grid">
            {regular.map((post) => (
              <div key={post.id} className="blog-reg-card">
                <div className="brc-thumb" style={{ background: CARD_BG[post.accentColor] || CARD_BG["#527CE6"] }}>
                  <span className={`bfc-tag bfc-tag--${post.tagColor}`}>{post.tag}</span>
                </div>
                <div className="brc-body">
                  <div className="brc-cat" style={{ color: post.accentColor }}>{post.category}</div>
                  <h3 className="brc-title">{post.title}</h3>
                  <div className="brc-meta">
                    <div className="bfc-avatar bfc-avatar--sm" style={{ background: `linear-gradient(135deg, ${post.accentColor} 0%, rgb(18,22,105) 100%)` }}>
                      {post.authorInitials}
                    </div>
                    <div>
                      <div className="bfc-author">{post.author}</div>
                      <div className="bfc-date">{post.date}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink3)' }}>{post.readTime}</div>
                  </div>
                  <div className="brc-readmore">Đọc thêm →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="blog-empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p>Không tìm thấy bài viết phù hợp. Thử từ khóa khác nhé!</p>
        </div>
      )}

      {/* NEWSLETTER — reuse intro-banner from Landing */}
      <div className="intro-section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="intro-banner">
          <div className="intro-banner-left">
            <div className="intro-banner-tag">Bản tin hàng tuần</div>
            <div className="intro-banner-title">📬 Nhận bài viết mới nhất</div>
            <div className="intro-banner-sub">Đăng ký nhận bản tin hàng tuần với những insights nghề nghiệp hữu ích — không spam, không rác.</div>
          </div>
          <div className="blog-nl-form">
            <input className="blog-nl-input" placeholder="email@example.com" />
            <button className="intro-banner-btn">Đăng ký →</button>
          </div>
        </div>
      </div>
    </div>
  );
}