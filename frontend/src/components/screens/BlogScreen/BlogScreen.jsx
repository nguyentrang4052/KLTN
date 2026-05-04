import { useState } from "react";

const blogData = [
  {
    id: 1,
    category: "Xu hướng tuyển dụng",
    tag: "HOT",
    tagColor: "#FF4D4F",
    title: "Top 10 ngành nghề có nhu cầu tuyển dụng cao nhất năm 2025",
    excerpt:
      "Thị trường lao động đang chứng kiến sự bùng nổ nhu cầu tuyển dụng trong các lĩnh vực công nghệ, y tế và năng lượng xanh. Khám phá những cơ hội vàng đang chờ đón bạn.",
    author: "Nguyễn Minh Anh",
    authorAvatar: "NMA",
    date: "28 Tháng 4, 2025",
    readTime: "5 phút đọc",
    views: "12.4K",
    image: null,
    color: "#667EEA",
    featured: true,
  },
  {
    id: 2,
    category: "Kỹ năng nghề nghiệp",
    tag: "MỚI",
    tagColor: "#52C41A",
    title: "7 kỹ năng AI mà mọi nhân viên văn phòng cần biết trong năm 2025",
    excerpt:
      "Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc. Đây là những kỹ năng AI thiết yếu giúp bạn không bị bỏ lại phía sau trong cuộc cách mạng công nghiệp 4.0.",
    author: "Trần Bảo Long",
    authorAvatar: "TBL",
    date: "25 Tháng 4, 2025",
    readTime: "7 phút đọc",
    views: "8.9K",
    image: null,
    color: "#F093FB",
    featured: true,
  },
  {
    id: 3,
    category: "CV & Hồ sơ",
    tag: "TIPS",
    tagColor: "#1890FF",
    title: "Bí quyết viết CV vượt qua hệ thống ATS và chinh phục nhà tuyển dụng",
    excerpt:
      "95% CV bị loại trước khi đến tay nhà tuyển dụng vì hệ thống ATS. Tìm hiểu cách tối ưu CV của bạn để vượt qua rào cản này và tăng cơ hội phỏng vấn lên gấp 3 lần.",
    author: "Lê Thu Hương",
    authorAvatar: "LTH",
    date: "22 Tháng 4, 2025",
    readTime: "6 phút đọc",
    views: "15.2K",
    image: null,
    color: "#4FACFE",
    featured: false,
  },
  {
    id: 4,
    category: "Phỏng vấn",
    tag: "GUIDE",
    tagColor: "#722ED1",
    title: "Cách trả lời 20 câu hỏi phỏng vấn khó nhất mà không bị mất điểm",
    excerpt:
      "Từ 'Điểm yếu của bạn là gì?' đến 'Bạn mong đợi mức lương bao nhiêu?', đây là hướng dẫn chi tiết cách xử lý những câu hỏi hóc búa nhất trong buổi phỏng vấn.",
    author: "Phạm Việt Hùng",
    authorAvatar: "PVH",
    date: "20 Tháng 4, 2025",
    readTime: "10 phút đọc",
    views: "20.1K",
    image: null,
    color: "#43E97B",
    featured: false,
  },
  {
    id: 5,
    category: "Lương & Đãi ngộ",
    tag: "KHẢO SÁT",
    tagColor: "#FA8C16",
    title: "Báo cáo lương ngành IT Việt Nam Q1/2025: Mức nào là cạnh tranh?",
    excerpt:
      "Phân tích chi tiết mức lương theo vị trí, kinh nghiệm và công ty trong ngành IT. Biết được vị trí của bạn trên thị trường để đàm phán lương hiệu quả hơn.",
    author: "Vũ Thanh Tùng",
    authorAvatar: "VTT",
    date: "18 Tháng 4, 2025",
    readTime: "8 phút đọc",
    views: "18.7K",
    image: null,
    color: "#F7971E",
    featured: false,
  },
  {
    id: 6,
    category: "Phát triển sự nghiệp",
    tag: "STORY",
    tagColor: "#EB2F96",
    title: "Từ fresher đến senior: Lộ trình 3 năm của một Frontend Developer",
    excerpt:
      "Câu chuyện thực tế từ anh Hải - người đã tăng lương từ 7 triệu lên 45 triệu trong 3 năm. Những bài học xương máu và chiến lược phát triển sự nghiệp trong ngành lập trình.",
    author: "Ngô Minh Hải",
    authorAvatar: "NMH",
    date: "15 Tháng 4, 2025",
    readTime: "12 phút đọc",
    views: "25.3K",
    image: null,
    color: "#FF6B9D",
    featured: false,
  },
];

const categories = ["Tất cả", "Xu hướng tuyển dụng", "Kỹ năng nghề nghiệp", "CV & Hồ sơ", "Phỏng vấn", "Lương & Đãi ngộ", "Phát triển sự nghiệp"];

const GradientCard = ({ color }) => {
  const gradients = {
    "#667EEA": "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    "#F093FB": "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
    "#4FACFE": "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
    "#43E97B": "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
    "#F7971E": "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)",
    "#FF6B9D": "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)",
  };
  return (
    <div style={{ background: gradients[color] || gradients["#667EEA"], width: "100%", height: "100%", borderRadius: "12px 12px 0 0" }} />
  );
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = blogData.filter((post) => {
    const matchCat = activeCategory === "Tất cả" || post.category === activeCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured).slice(0, 2);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .blog-hero { 
          padding: 80px 0 60px;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(102,126,234,0.25) 0%, transparent 70%);
          position: relative;
          overflow: hidden;
        }
        .blog-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667EEA' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(102,126,234,0.15); border: 1px solid rgba(102,126,234,0.3);
          padding: 6px 16px; border-radius: 100px;
          font-size: 13px; font-weight: 500; color: #8B9CF8;
          margin-bottom: 24px;
        }
        .hero-badge span { width: 6px; height: 6px; background: #667EEA; border-radius: 50%; animation: pulse 2s infinite; }

        .hero-title {
          font-size: clamp(36px, 5vw, 60px); font-weight: 800; line-height: 1.1;
          background: linear-gradient(135deg, #fff 0%, #8B9CF8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 16px;
        }
        .hero-sub { font-size: 18px; color: rgba(255,255,255,0.5); max-width: 500px; line-height: 1.6; margin-bottom: 40px; }

        .search-wrap {
          display: flex; gap: 12px; max-width: 600px;
        }
        .search-input {
          flex: 1; padding: 14px 20px 14px 48px; border-radius: 14px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 15px; font-family: inherit; outline: none;
          transition: all 0.2s;
        }
        .search-input:focus { border-color: rgba(102,126,234,0.6); background: rgba(255,255,255,0.1); }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-wrap-inner { position: relative; flex: 1; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.4; font-size: 18px; }
        .search-btn {
          padding: 14px 28px; border-radius: 14px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          border: none; color: #fff; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: inherit; white-space: nowrap;
          transition: opacity 0.2s; box-shadow: 0 4px 20px rgba(102,126,234,0.4);
        }
        .search-btn:hover { opacity: 0.85; }

        .stats-row { display: flex; gap: 32px; margin-top: 40px; }
        .stat-item { }
        .stat-num { font-size: 26px; font-weight: 800; color: #fff; }
        .stat-lbl { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        .section { padding: 60px 0; }
        .section-label {
          display: flex; align-items: center; gap: 12px; margin-bottom: 32px;
        }
        .section-label h2 { font-size: 24px; font-weight: 700; }
        .section-label .line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .section-label .count { 
          background: rgba(102,126,234,0.15); border: 1px solid rgba(102,126,234,0.25);
          padding: 3px 10px; border-radius: 6px; font-size: 13px; color: #8B9CF8; font-weight: 500;
        }

        .cats-bar {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 40px;
        }
        .cat-btn {
          padding: 8px 18px; border-radius: 100px; font-size: 14px; font-weight: 500;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6);
          transition: all 0.2s; font-family: inherit;
        }
        .cat-btn:hover { border-color: rgba(102,126,234,0.4); color: #8B9CF8; }
        .cat-btn.active {
          background: linear-gradient(135deg, #667EEA, #764BA2);
          border-color: transparent; color: #fff;
          box-shadow: 0 4px 15px rgba(102,126,234,0.35);
        }

        .featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        @media(max-width: 768px) { .featured-grid { grid-template-columns: 1fr; } }

        .featured-card {
          border-radius: 20px; overflow: hidden;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .featured-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }

        .card-img { height: 220px; position: relative; overflow: hidden; }
        .card-tag {
          position: absolute; top: 16px; left: 16px; z-index: 2;
          padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700;
          letter-spacing: 0.05em;
        }
        .card-body { padding: 24px; }
        .card-category { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .card-title { font-size: 18px; font-weight: 700; line-height: 1.45; margin-bottom: 12px; }
        .card-excerpt { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 20px; }
        .card-meta { display: flex; align-items: center; gap: 16px; }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
        }
        .meta-info { flex: 1; }
        .meta-name { font-size: 13px; font-weight: 600; }
        .meta-date { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 1px; }
        .meta-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .meta-read { font-size: 12px; color: rgba(255,255,255,0.4); }
        .meta-views { font-size: 12px; color: rgba(255,255,255,0.4); }

        .regular-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media(max-width: 1024px) { .regular-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width: 640px) { .regular-grid { grid-template-columns: 1fr; } }

        .reg-card {
          border-radius: 16px; overflow: hidden;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .reg-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
        .reg-card .card-img { height: 160px; }
        .reg-card .card-body { padding: 18px; }
        .reg-card .card-title { font-size: 16px; }

        .read-more {
          display: inline-flex; align-items: center; gap: 6px;
          color: #8B9CF8; font-size: 13px; font-weight: 600; margin-top: 12px;
          transition: gap 0.2s;
        }
        .reg-card:hover .read-more { gap: 10px; }

        .newsletter {
          background: linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%);
          border: 1px solid rgba(102,126,234,0.2); border-radius: 24px;
          padding: 60px; text-align: center; margin: 40px 0;
        }
        .newsletter h2 { font-size: 32px; font-weight: 800; margin-bottom: 12px; }
        .newsletter p { color: rgba(255,255,255,0.5); margin-bottom: 32px; font-size: 16px; }
        .nl-form { display: flex; gap: 12px; max-width: 480px; margin: 0 auto; }
        .nl-input {
          flex: 1; padding: 14px 20px; border-radius: 12px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 15px; font-family: inherit; outline: none;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.3); }
        .nl-btn {
          padding: 14px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          border: none; color: #fff; font-weight: 700; cursor: pointer;
          font-family: inherit; white-space: nowrap;
        }

        .empty-state { text-align: center; padding: 80px 0; color: rgba(255,255,255,0.3); }
        .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state p { font-size: 16px; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #667EEA, #764BA2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>J</div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>JobAI</span>
            <span style={{ marginLeft: 8, padding: "2px 8px", background: "rgba(102,126,234,0.15)", borderRadius: 4, fontSize: 11, color: "#8B9CF8", fontWeight: 600 }}>Blog</span>
          </div>
          <nav style={{ display: "flex", gap: 24 }}>
            {["Tìm việc", "Tạo CV", "Blog", "Liên hệ"].map((n) => (
              <span key={n} style={{ fontSize: 14, color: n === "Blog" ? "#8B9CF8" : "rgba(255,255,255,0.5)", cursor: "pointer", fontWeight: n === "Blog" ? 600 : 400 }}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <div className="blog-hero">
        <div className="container">
          <div className="hero-badge">
            <span></span>
            Cập nhật hàng ngày
          </div>
          <h1 className="hero-title">Blog nghề nghiệp<br />& Tin tức tuyển dụng</h1>
          <p className="hero-sub">Kiến thức, kỹ năng và xu hướng mới nhất giúp bạn phát triển sự nghiệp vượt bậc.</p>

          <div className="search-wrap">
            <div className="search-wrap-inner">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="search-btn">Tìm kiếm</button>
          </div>

          <div className="stats-row">
            {[["150+", "Bài viết"], ["12", "Chủ đề"], ["50K+", "Lượt đọc/tháng"]].map(([num, lbl]) => (
              <div key={lbl} className="stat-item">
                <div className="stat-num">{num}</div>
                <div className="stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="container">
        <div className="cats-bar" style={{ paddingTop: 40 }}>
          {categories.map((cat) => (
            <button key={cat} className={`cat-btn ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED POSTS */}
      {featured.length > 0 && (
        <div className="container">
          <div className="section-label">
            <h2>⭐ Bài viết nổi bật</h2>
            <div className="line" />
            <span className="count">{featured.length} bài</span>
          </div>
          <div className="featured-grid">
            {featured.map((post) => (
              <div key={post.id} className="featured-card" onMouseEnter={() => setHoveredId(post.id)} onMouseLeave={() => setHoveredId(null)}>
                <div className="card-img">
                  <GradientCard color={post.color} />
                  <div className="card-tag" style={{ background: post.tagColor, color: "#fff" }}>{post.tag}</div>
                </div>
                <div className="card-body">
                  <div className="card-category" style={{ color: post.color }}>{post.category}</div>
                  <div className="card-title">{post.title}</div>
                  <div className="card-excerpt">{post.excerpt}</div>
                  <div className="card-meta">
                    <div className="avatar">{post.authorAvatar}</div>
                    <div className="meta-info">
                      <div className="meta-name">{post.author}</div>
                      <div className="meta-date">{post.date}</div>
                    </div>
                    <div className="meta-right">
                      <div className="meta-read">{post.readTime}</div>
                      <div className="meta-views">👁 {post.views}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REGULAR POSTS */}
      {regular.length > 0 && (
        <div className="container section">
          <div className="section-label">
            <h2>📰 Tất cả bài viết</h2>
            <div className="line" />
            <span className="count">{regular.length} bài</span>
          </div>
          <div className="regular-grid">
            {regular.map((post) => (
              <div key={post.id} className="reg-card">
                <div className="card-img">
                  <GradientCard color={post.color} />
                  <div className="card-tag" style={{ background: post.tagColor, color: "#fff" }}>{post.tag}</div>
                </div>
                <div className="card-body">
                  <div className="card-category" style={{ color: post.color }}>{post.category}</div>
                  <div className="card-title">{post.title}</div>
                  <div className="card-meta" style={{ marginTop: 12 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{post.authorAvatar}</div>
                    <div className="meta-info">
                      <div className="meta-name" style={{ fontSize: 12 }}>{post.author}</div>
                      <div className="meta-date">{post.date}</div>
                    </div>
                    <div className="meta-read">{post.readTime}</div>
                  </div>
                  <div className="read-more">Đọc thêm →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="container">
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>Không tìm thấy bài viết phù hợp. Thử từ khóa khác nhé!</p>
          </div>
        </div>
      )}

      {/* NEWSLETTER */}
      <div className="container">
        <div className="newsletter">
          <h2>📬 Nhận bài viết mới nhất</h2>
          <p>Đăng ký nhận bản tin hàng tuần với những insights nghề nghiệp hữu ích nhất.</p>
          <div className="nl-form">
            <input className="nl-input" placeholder="email@example.com" />
            <button className="nl-btn">Đăng ký</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
        © 2025 JobAI Platform. All rights reserved.
      </footer>
    </div>
  );
}