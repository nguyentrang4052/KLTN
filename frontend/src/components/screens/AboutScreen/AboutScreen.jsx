
import { useState } from 'react'
import './AboutScreen.css'

/* ── Data ─────────────────────────────────────────────────── */
const STATS = [
  { n: '3.2M+',  l: 'Người dùng',          s: 'trên toàn quốc' },
  { n: '50K+',   l: 'Việc làm mỗi ngày',   s: 'cập nhật real-time' },
  { n: '15+',    l: 'Nền tảng tổng hợp',   s: 'TopCV, VietnamWorks...' },
  { n: '94%',    l: 'Độ chính xác AI',      s: 'match score' },
  { n: '2 phút', l: 'Tần suất cập nhật',   s: 'tự động 24/7' },
  { n: '1-click',l: 'Auto Apply',           s: 'nộp nhiều nơi cùng lúc' },
]

const TEAM = [
  {
    name: 'Nguyễn Minh Khoa', role: 'CEO & Co-founder',
    avatar: 'MK', color: 'linear-gradient(135deg,#C0412A,#E05A40)',
    bio: 'Cựu PM tại VNG, 8 năm kinh nghiệm trong HR-tech và AI product.',
    links: { li: '#', tw: '#' },
  },
  {
    name: 'Trần Thị Lan Anh', role: 'CTO & Co-founder',
    avatar: 'LA', color: 'linear-gradient(135deg,#1565C0,#1E88E5)',
    bio: 'PhD AI tại ĐH Bách Khoa, từng nghiên cứu NLP tại Google Research.',
    links: { li: '#', gh: '#' },
  },
  {
    name: 'Lê Hoàng Nam', role: 'Head of Product',
    avatar: 'HN', color: 'linear-gradient(135deg,#1B5E20,#388E3C)',
    bio: 'Ex-Tiki, Shopee. Đam mê xây dựng sản phẩm tốt cho người Việt.',
    links: { li: '#' },
  },
  {
    name: 'Phạm Quỳnh Như', role: 'Head of Design',
    avatar: 'QN', color: 'linear-gradient(135deg,#880E4F,#C2185B)',
    bio: '10 năm UX, từng thiết kế cho MoMo, Be và nhiều startup unicorn.',
    links: { li: '#', tw: '#' },
  },
  {
    name: 'Đặng Trọng Nghĩa', role: 'AI Engineer Lead',
    avatar: 'TN', color: 'linear-gradient(135deg,#1A3A6A,#2E6DA8)',
    bio: 'Chuyên gia ML, tác giả mô hình matching AI cho 3 triệu người dùng.',
    links: { li: '#', gh: '#' },
  },
  {
    name: 'Vũ Thị Thanh Hà', role: 'Head of Growth',
    avatar: 'TH', color: 'linear-gradient(135deg,#D4820A,#F0A020)',
    bio: '0→1 growth hacker, đã scale 5 startup tại Việt Nam và Singapore.',
    links: { li: '#' },
  },
]

const VALUES = [
  {
    icon: '🎯', title: 'Cá nhân hóa thật sự',
    desc: 'Không phải gợi ý theo từ khóa. AI của chúng tôi học từ hành vi, học vấn, mục tiêu nghề nghiệp của từng người để đưa ra việc làm thực sự phù hợp.',
  },
  {
    icon: '⚡', title: 'Tiết kiệm thời gian',
    desc: 'Từ tìm việc, so sánh, đến nộp đơn — tất cả trong một nơi. Auto Apply giúp bạn nộp đồng thời 15+ nền tảng chỉ bằng một cú click.',
  },
  {
    icon: '🔍', title: 'Minh bạch & tin cậy',
    desc: 'Chúng tôi hiển thị nguồn gốc mọi tin tuyển dụng, đánh giá công ty từ nhân viên thật, và không bao giờ bán dữ liệu người dùng.',
  },
  {
    icon: '🌱', title: 'Đồng hành dài hạn',
    desc: 'Không chỉ giúp bạn tìm việc hôm nay. GZCONNECT theo dõi hành trình sự nghiệp, gợi ý upskill và cơ hội thăng tiến theo thời gian.',
  },
]

const TIMELINE = [
  { year: '2021', title: 'Ý tưởng hình thành', desc: 'Ra đời từ nỗi đau cá nhân: mất 3 tháng tìm việc chỉ vì không biết đâu mà lần.' },
  { year: '2022', title: 'Ra mắt MVP', desc: 'Phiên bản đầu tiên tổng hợp 3 nền tảng, 500 người dùng đầu tiên trong tuần ra mắt.' },
  { year: '2023', title: 'Series A — $3M', desc: 'Gọi vốn thành công, ra mắt AI matching engine, vượt 200,000 người dùng.' },
  { year: '2024', title: 'Auto Apply ra mắt', desc: 'Tính năng Auto Apply tạo tiếng vang, 1M người dùng, hợp tác với 500+ doanh nghiệp.' },
  { year: '2025', title: 'Mở rộng SEA', desc: 'Mở rộng sang Thái Lan và Indonesia, 3M+ người dùng, Series B $12M.' },
]

const PARTNERS = [
  { name: 'TopCV',       short: 'TC',  color: '#007A35' },
  { name: 'CareerLink',  short: 'CL',  color: '#A02018' },
  { name: 'VietnamWorks',short: 'VW',  color: '#B35A00' },
  { name: 'CareerViet',  short: 'CV',  color: '#0D47A1' },
  { name: 'LinkedIn',    short: 'in',  color: '#0A4E94' },
  { name: 'ITViec',      short: 'IT',  color: '#2D3748' },
  { name: 'JobsGO',      short: 'JG',  color: '#6B46C1' },
  { name: 'Topcoder',    short: 'TC',  color: '#E05A40' },
]

/* ── Component ─────────────────────────────────────────────── */
export default function AboutScreen({ onNavigate }) {
  const [activeVal, setActiveVal] = useState(0)

  return (
    <div className="ab-page">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="ab-hero">
        <div className="ab-hero-noise" />
        <div className="ab-hero-glow1" />
        <div className="ab-hero-glow2" />

        <div className="ab-hero-inner">
          <div className="ab-hero-tag">
            <span className="ab-tag-dot" />
            Câu chuyện của GZCONNECT
          </div>

          <h1 className="ab-hero-title">
            Chúng tôi tin rằng<br />
            <em>mỗi người xứng đáng</em><br />
            có công việc tốt hơn
          </h1>

          <p className="ab-hero-desc">
            GZCONNECT ra đời để giải quyết bài toán mà hàng triệu người Việt đang đối mặt: 
            quá nhiều nền tảng tuyển dụng, quá ít thời gian, và quá khó để tìm ra cơ hội 
            thực sự phù hợp với mình.
          </p>

          <div className="ab-hero-ctas">
            <button className="ab-btn-primary" onClick={() => onNavigate && onNavigate('s3')}>
              Khám phá việc làm →
            </button>
            <button className="ab-btn-ghost">
              📹 Xem video giới thiệu
            </button>
          </div>
        </div>

        {/* Floating quote card */}
        <div className="ab-hero-quote">
          <div className="ab-quote-mark">"</div>
          <div className="ab-quote-text">
            Tìm việc không nên là một công việc thứ hai. Chúng tôi muốn làm cho nó dễ như đặt pizza.
          </div>
          <div className="ab-quote-author">
            <div className="ab-quote-av" style={{background:'linear-gradient(135deg,#C0412A,#E05A40)'}}>MK</div>
            <div>
              <div className="ab-quote-name">Nguyễn Minh Khoa</div>
              <div className="ab-quote-role">CEO & Co-founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════ */}
      <section className="ab-stats">
        <div className="ab-stats-inner">
          {STATS.map((s, i) => (
            <div key={i} className="ab-stat-item">
              <div className="ab-stat-n">{s.n}</div>
              <div className="ab-stat-l">{s.l}</div>
              <div className="ab-stat-s">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MISSION ═══════════════════════════════════════════ */}
      <section className="ab-mission">
        <div className="ab-section-inner">
          <div className="ab-mission-grid">

            <div className="ab-mission-left">
              <div className="ab-sec-label">Sứ mệnh</div>
              <h2 className="ab-sec-title">
                Kết nối đúng người<br />với đúng cơ hội
              </h2>
              <p className="ab-mission-desc">
                Thị trường lao động Việt Nam có hàng chục nền tảng tuyển dụng rời rạc, 
                tin tuyển dụng lặp lại, và không có công cụ nào thực sự hiểu người tìm việc.
              </p>
              <p className="ab-mission-desc">
                Chúng tôi dùng AI để tổng hợp, lọc, và cá nhân hóa — giúp bạn tìm thấy 
                công việc tốt hơn trong ít thời gian hơn.
              </p>
              <div className="ab-mission-badges">
                <span className="ab-m-badge">🏆 Top 10 HR-tech SEA 2024</span>
                <span className="ab-m-badge">🇻🇳 Made in Vietnam</span>
                <span className="ab-m-badge">🤖 AI-first</span>
              </div>
            </div>

            <div className="ab-mission-right">
              {/* Visual: problem vs solution */}
              <div className="ab-prob-sol">
                <div className="ab-prob">
                  <div className="ab-ps-label ab-ps-before">Trước đây</div>
                  <div className="ab-ps-list">
                    <div className="ab-ps-item bad">😩 Vào 10+ website riêng lẻ</div>
                    <div className="ab-ps-item bad">😩 Nộp CV thủ công từng nơi</div>
                    <div className="ab-ps-item bad">😩 Tin tức lặp, khó lọc</div>
                    <div className="ab-ps-item bad">😩 Không biết mình phù hợp đâu</div>
                    <div className="ab-ps-item bad">😩 Mất 2–3 giờ/ngày tìm kiếm</div>
                  </div>
                </div>
                <div className="ab-ps-arrow">→</div>
                <div className="ab-sol">
                  <div className="ab-ps-label ab-ps-after">Với GZCONNECT</div>
                  <div className="ab-ps-list">
                    <div className="ab-ps-item good">✅ 1 nền tảng, 15+ nguồn</div>
                    <div className="ab-ps-item good">✅ Auto Apply 1-click</div>
                    <div className="ab-ps-item good">✅ AI lọc & xếp hạng</div>
                    <div className="ab-ps-item good">✅ Match score cá nhân hóa</div>
                    <div className="ab-ps-item good">✅ Chỉ mất 15 phút/ngày</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════ */}
      <section className="ab-values">
        <div className="ab-section-inner">
          <div className="ab-sec-label center">Giá trị cốt lõi</div>
          <h2 className="ab-sec-title center">Chúng tôi xây dựng bằng tâm huyết</h2>

          <div className="ab-values-grid">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className={`ab-val-card${activeVal === i ? ' active' : ''}`}
                onClick={() => setActiveVal(i)}
              >
                <div className="ab-val-icon">{v.icon}</div>
                <div className="ab-val-title">{v.title}</div>
                <div className="ab-val-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══════════════════════════════════════════ */}
      <section className="ab-timeline-sec">
        <div className="ab-section-inner">
          <div className="ab-sec-label center">Hành trình</div>
          <h2 className="ab-sec-title center">Từ ý tưởng đến 3 triệu người dùng</h2>

          <div className="ab-timeline">
            {TIMELINE.map((t, i) => (
              <div key={i} className={`ab-tl-item${i % 2 === 0 ? ' left' : ' right'}`}>
                <div className="ab-tl-dot">
                  <div className="ab-tl-dot-inner" />
                </div>
                <div className="ab-tl-card">
                  <div className="ab-tl-year">{t.year}</div>
                  <div className="ab-tl-title">{t.title}</div>
                  <div className="ab-tl-desc">{t.desc}</div>
                </div>
              </div>
            ))}
            <div className="ab-tl-line" />
          </div>
        </div>
      </section>

      {/* ══ TEAM ══════════════════════════════════════════════ */}
      <section className="ab-team">
        <div className="ab-section-inner">
          <div className="ab-sec-label center">Đội ngũ sáng lập</div>
          <h2 className="ab-sec-title center">Những người xây dựng GZCONNECT</h2>
          <p className="ab-sec-sub center">
            Chúng tôi là những người đã từng trải qua cơn đau đầu khi tìm việc — 
            và quyết định làm điều gì đó để thay đổi nó.
          </p>

          <div className="ab-team-grid">
            {TEAM.map((m, i) => (
              <div key={i} className="ab-team-card">
                <div className="ab-team-av" style={{ background: m.color }}>
                  {m.avatar}
                </div>
                <div className="ab-team-name">{m.name}</div>
                <div className="ab-team-role">{m.role}</div>
                <div className="ab-team-bio">{m.bio}</div>
                <div className="ab-team-links">
                  {m.links.li  && <a href={m.links.li}  className="ab-tlink ab-tlink-li">in</a>}
                  {m.links.tw  && <a href={m.links.tw}  className="ab-tlink ab-tlink-tw">𝕏</a>}
                  {m.links.gh  && <a href={m.links.gh}  className="ab-tlink ab-tlink-gh">⌥</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PARTNERS ══════════════════════════════════════════ */}
      <section className="ab-partners">
        <div className="ab-section-inner">
          <div className="ab-sec-label center">Đối tác</div>
          <h2 className="ab-sec-title center">Kết nối 15+ nền tảng tuyển dụng</h2>
          <div className="ab-partners-row">
            {PARTNERS.map((p, i) => (
              <div key={i} className="ab-partner-chip">
                <div className="ab-partner-logo" style={{ background: p.color }}>{p.short}</div>
                <span className="ab-partner-name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════ */}
      <section className="ab-cta">
        <div className="ab-cta-noise" />
        <div className="ab-cta-glow" />
        <div className="ab-cta-inner">
          <div className="ab-cta-tag">🚀 Bắt đầu miễn phí</div>
          <h2 className="ab-cta-title">
            Sẵn sàng tìm công việc<br /><em>xứng đáng với bạn?</em>
          </h2>
          <p className="ab-cta-sub">
            Tham gia cùng 3.2 triệu người đang dùng GZCONNECT. Miễn phí hoàn toàn, không cần thẻ tín dụng.
          </p>
          <div className="ab-cta-btns">
            <button className="ab-btn-primary lg" onClick={() => onNavigate && onNavigate('s3')}>
              Bắt đầu tìm việc ngay →
            </button>
            <button className="ab-btn-outline-light">Xem demo sản phẩm</button>
          </div>
          <div className="ab-cta-trust">
            <span>⭐ 4.8/5 trên App Store</span>
            <span>·</span>
            <span>🔒 Bảo mật dữ liệu tuyệt đối</span>
            <span>·</span>
            <span>✅ Không spam, không quảng cáo</span>
          </div>
        </div>
      </section>

    </div>
  )
}