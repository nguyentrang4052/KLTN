
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
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

const VALUES = [
  {
    icon: '🎯', title: 'Cá nhân hóa thật sự',
    desc: 'Không phải gợi ý theo từ khóa. AI của chúng tôi học từ hành vi, học vấn, mục tiêu nghề nghiệp của từng người để đưa ra việc làm thực sự phù hợp.',
  },
  {
    icon: '⚡', title: 'Tiết kiệm thời gian',
    desc:  'Nền tảng tổng hợp tin tuyển dụng từ nhiều nguồn, giúp bạn tìm kiếm công việc phù hợp nhanh chóng và theo dõi cơ hội nghề nghiệp mới chỉ trong một nơi.',
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

const PARTNERS = [
  { name: 'TopCV',       short: 'TC',  color: '#007A35' },
  { name: 'CareerLink',  short: 'CL',  color: '#A02018' },
  { name: 'CareerViet',  short: 'CV',  color: '#0D47A1' },
]

/* ── Component ─────────────────────────────────────────────── */
export default function AboutScreen({ onNavigate }) {
  const [activeVal, setActiveVal] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="ab-page">
      <section className="ab-hero">
        <div className="ab-hero-noise" />
        <div className="ab-hero-glow1" />
        <div className="ab-hero-glow2" />

        <div className="ab-hero-inner">

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
            <button className="ab-btn-primary" onClick={() => navigate("/home")}>
              Khám phá việc làm →
            </button>
          </div>
        </div>
      </section>

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
            </div>

            <div className="ab-mission-right">
              {/* Visual: problem vs solution */}
              <div className="ab-prob-sol">
                <div className="ab-prob">
                  <div className="ab-ps-label ab-ps-before">Trước đây</div>
                  <div className="ab-ps-list">
                    <div className="ab-ps-item bad">😩 Vào những website riêng lẻ</div>
                    <div className="ab-ps-item bad">😩 Tin tức lặp, khó lọc</div>
                    <div className="ab-ps-item bad">😩 Không biết mình phù hợp đâu</div>
                    <div className="ab-ps-item bad">😩 Mất 2–3 giờ/ngày tìm kiếm</div>
                  </div>
                </div>
                <div className="ab-ps-arrow">→</div>
                <div className="ab-sol">
                  <div className="ab-ps-label ab-ps-after">Với GZCONNECT</div>
                  <div className="ab-ps-list">
                    <div className="ab-ps-item good">✅ 1 nền tảng, nhiều nguồn</div>
                    <div className="ab-ps-item good">✅ AI lọc & xếp hạng</div>
                    <div className="ab-ps-item good">✅ Match score cá nhân hóa</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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


      {/* ══ PARTNERS ══════════════════════════════════════════ */}
      <section className="ab-partners">
        <div className="ab-section-inner">
          <div className="ab-sec-label center">Đối tác</div>
          <h2 className="ab-sec-title center">Kết nối các nền tảng tuyển dụng</h2>
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
      <section className="ab-cta">
        <div className="ab-cta-noise" />
        <div className="ab-cta-glow" />
        <div className="ab-cta-inner">
          <h2 className="ab-cta-title">
            Sẵn sàng tìm công việc<br /><em>xứng đáng với bạn?</em>
          </h2>
          <p className="ab-cta-sub">
            Tham gia cùng người đang dùng GZCONNECT. Miễn phí hoàn toàn, không cần thẻ tín dụng.
          </p>
          <div className="ab-cta-btns">
            <button className="ab-btn-primary lg" onClick={() => onNavigate && onNavigate('s3')}>
              Bắt đầu tìm việc ngay →
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}