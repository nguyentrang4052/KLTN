// src/components/screens/PricingScreen/PricingScreen.jsx
import { useState } from 'react'
import './PricingScreen.css'

const PLANS = [
  {
    id: 'free', name: 'Free', tagline: 'Bắt đầu miễn phí',
    monthlyPrice: 0, yearlyPrice: 0,
    color: '#9A8D80', gradient: 'linear-gradient(135deg,#6B5E50,#9A8D80)',
    badge: null, popular: false,
    features: [
      { text: '5 lượt ứng tuyển / tháng',        ok: true  },
      { text: 'Xem 10 JD đầy đủ / ngày',          ok: true  },
      { text: '1 CV cơ bản (5 template)',          ok: true  },
      { text: 'AI match cơ bản',                   ok: true  },
      { text: 'Thông báo việc làm',                ok: true  },
      { text: 'Auto Apply 1-click',                ok: false },
      { text: 'CV không giới hạn',                 ok: false },
      { text: 'Phân tích AI nâng cao',             ok: false },
      { text: 'Ẩn hồ sơ với công ty hiện tại',    ok: false },
      { text: 'Tư vấn nghề nghiệp',                ok: false },
    ],
  },
  {
    id: 'pro', name: 'Pro', tagline: 'Tìm việc thông minh hơn',
    monthlyPrice: 99000, yearlyPrice: 79000,
    color: '#C0412A', gradient: 'linear-gradient(135deg,#C0412A,#E05A40)',
    badge: '🔥 Phổ biến nhất', popular: true,
    features: [
      { text: 'Ứng tuyển không giới hạn',          ok: true  },
      { text: 'Xem JD không giới hạn',             ok: true  },
      { text: 'CV không giới hạn + 30 template',  ok: true  },
      { text: 'AI match nâng cao + lý do',         ok: true  },
      { text: 'Auto Apply 1-click',                ok: true  },
      { text: 'Ẩn hồ sơ với công ty hiện tại',    ok: true  },
      { text: 'Thông báo ưu tiên real-time',       ok: true  },
      { text: 'Phân tích thị trường lương',        ok: true  },
      { text: 'Tư vấn nghề nghiệp AI',             ok: true  },
      { text: 'Tư vấn 1-1 với HR chuyên gia',      ok: false },
    ],
  },
  {
    id: 'elite', name: 'Elite', tagline: 'Toàn diện & ưu tiên tuyệt đối',
    monthlyPrice: 249000, yearlyPrice: 199000,
    color: '#D4820A', gradient: 'linear-gradient(135deg,#D4820A,#F0A020)',
    badge: '⭐ Tốt nhất', popular: false,
    features: [
      { text: 'Tất cả tính năng Pro',              ok: true  },
      { text: 'Tư vấn 1-1 với HR chuyên gia (2×/tháng)', ok: true },
      { text: 'Review CV bởi chuyên gia HR',       ok: true  },
      { text: 'Ưu tiên hiển thị hồ sơ × 5',       ok: true  },
      { text: 'Báo cáo thị trường lương hàng tuần',ok: true  },
      { text: 'Truy cập API',                      ok: true  },
      { text: 'CV white-label (không logo GZC)',   ok: true  },
      { text: 'Hỗ trợ ưu tiên 24/7',              ok: true  },
      { text: 'Mock interview với AI',             ok: true  },
      { text: 'Bảo đảm tìm được việc trong 60 ngày', ok: true },
    ],
  },
]

const FAQ = [
  { q: 'Tôi có thể huỷ gói bất cứ lúc nào không?', a: 'Có, bạn có thể huỷ bất cứ lúc nào. Gói sẽ tiếp tục đến hết chu kỳ đã thanh toán.' },
  { q: 'Có hoàn tiền nếu tôi không hài lòng không?', a: 'GZCONNECT cam kết hoàn tiền 100% trong 7 ngày đầu nếu bạn không hài lòng, không cần giải thích.' },
  { q: 'Gói Pro và Elite khác nhau như thế nào?', a: 'Elite có thêm tư vấn 1-1 với HR chuyên gia, review CV thực tế, mock interview AI và bảo đảm tìm việc 60 ngày.' },
  { q: 'Thanh toán năm có lợi hơn không?', a: 'Tiết kiệm 20% so với thanh toán tháng, tương đương 2 tháng miễn phí mỗi năm.' },
]

export default function PricingScreen({ onNavigate }) {
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)
  const [current]             = useState('pro')

  const price = (plan) => billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const fmt   = (n)    => n === 0 ? 'Miễn phí' : (n / 1000).toFixed(0) + ',000đ'

  return (
    <div className="pr-page">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="pr-hero">
        <div className="pr-hero-noise" />
        <div className="pr-hero-glow" />
        <div className="pr-hero-inner">
          <div className="pr-hero-tag">
            <span className="pr-hero-dot" />
            Đang dùng Gói <strong>Pro</strong> · Gia hạn 01/12/2025
          </div>
          <h1 className="pr-hero-title">
            Chọn gói phù hợp với<br /><em>hành trình của bạn</em>
          </h1>
          <p className="pr-hero-sub">Nâng cấp để tìm việc thông minh hơn, nhanh hơn và hiệu quả hơn với AI.</p>

          {/* Billing toggle */}
          <div className="pr-toggle-wrap">
            <div className="pr-toggle">
              <button className={`pr-toggle-opt${billing==='monthly'?' on':''}`} onClick={() => setBilling('monthly')}>Hàng tháng</button>
              <button className={`pr-toggle-opt${billing==='yearly'?' on':''}`} onClick={() => setBilling('yearly')}>
                Hàng năm
                <span className="pr-save-badge">–20%</span>
              </button>
            </div>
            {billing === 'yearly' && <div className="pr-save-note">🎉 Bạn tiết kiệm được <strong>2 tháng</strong> so với trả theo tháng</div>}
          </div>
        </div>
      </div>

      {/* ── Plans grid ────────────────────────────────────── */}
      <div className="pr-plans-wrap">
        <div className="pr-plans-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`pr-plan${plan.popular ? ' featured' : ''}${current === plan.id ? ' current' : ''}`}>
              {plan.badge && (
                <div className="pr-plan-badge" style={{ background: plan.gradient }}>{plan.badge}</div>
              )}
              {current === plan.id && <div className="pr-current-ring" />}

              <div className="pr-plan-head">
                <div className="pr-plan-icon" style={{ background: plan.gradient }}>
                  {plan.id === 'free' ? '🌱' : plan.id === 'pro' ? '⚡' : '👑'}
                </div>
                <div>
                  <div className="pr-plan-name" style={{ color: plan.color }}>{plan.name}</div>
                  <div className="pr-plan-tagline">{plan.tagline}</div>
                </div>
              </div>

              <div className="pr-plan-price-wrap">
                <div className="pr-plan-price">
                  {price(plan) === 0
                    ? <span className="pr-price-free">Miễn phí</span>
                    : <>
                        <span className="pr-price-n">{fmt(price(plan))}</span>
                        <span className="pr-price-per">/{billing === 'yearly' ? 'tháng' : 'tháng'}</span>
                      </>
                  }
                </div>
                {billing === 'yearly' && plan.monthlyPrice > 0 && (
                  <div className="pr-price-orig">Gốc: {fmt(plan.monthlyPrice)}/tháng · Thanh toán {fmt(price(plan) * 12)}/năm</div>
                )}
              </div>

              <div className="pr-features">
                {plan.features.map((f, i) => (
                  <div key={i} className={`pr-feat${f.ok ? '' : ' no'}`}>
                    <span className="pr-feat-ico">{f.ok ? '✓' : '✕'}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              <button
                className="pr-plan-btn"
                style={current !== plan.id ? { background: plan.gradient } : {}}
                disabled={current === plan.id}
                onClick={() => onNavigate?.('s_checkout', plan)}
              >
                {current === plan.id
                  ? '✓ Gói hiện tại của bạn'
                  : plan.id === 'free'
                  ? 'Hạ xuống Free'
                  : `Nâng cấp lên ${plan.name} →`
                }
              </button>

              {plan.id !== 'free' && (
                <div className="pr-plan-guarantee">🔒 Hoàn tiền 100% trong 7 ngày</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature comparison table ───────────────────────── */}
      <div className="pr-compare-wrap">
        <div className="pr-compare-inner">
          <h2 className="pr-compare-title">So sánh tính năng chi tiết</h2>
          <div className="pr-compare-table">
            <div className="pr-ct-head">
              <div className="pr-ct-feat-col">Tính năng</div>
              {PLANS.map(p => (
                <div key={p.id} className={`pr-ct-plan-col${p.popular?' featured':''}`} style={p.popular?{color:p.color}:{}}>
                  {p.name}
                </div>
              ))}
            </div>
            {[
              ['Lượt ứng tuyển', '5/tháng', 'Không giới hạn', 'Không giới hạn'],
              ['Mẫu CV', '5 mẫu', '30+ mẫu', '50+ mẫu'],
              ['AI Match score', 'Cơ bản', 'Nâng cao + lý do', 'Nâng cao + lý do'],
              ['Auto Apply', '✕', '✓', '✓'],
              ['Ẩn hồ sơ', '✕', '✓', '✓'],
              ['Tư vấn AI', '✕', '✓', '✓'],
              ['Tư vấn chuyên gia HR', '✕', '✕', '2×/tháng'],
              ['Mock Interview AI', '✕', '✕', '✓'],
              ['Bảo đảm tìm việc', '✕', '✕', '60 ngày'],
            ].map(([feat, ...vals]) => (
              <div key={feat} className="pr-ct-row">
                <div className="pr-ct-feat">{feat}</div>
                {vals.map((v, i) => (
                  <div key={i} className={`pr-ct-val${PLANS[i].popular?' featured':''}`}>
                    {v === '✓' ? <span className="pr-check">✓</span>
                     : v === '✕' ? <span className="pr-cross">✕</span>
                     : v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trusted by ─────────────────────────────────────── */}
      <div className="pr-trust">
        <div className="pr-trust-inner">
          <div className="pr-trust-stats">
            {[['3.2M+','Người dùng tin tưởng'],['94%','Tìm được việc trong 60 ngày'],['4.8★','Đánh giá trên App Store'],['7 ngày','Hoàn tiền nếu không hài lòng']].map(([n,l]) => (
              <div key={l} className="pr-trust-stat">
                <div className="pr-trust-n">{n}</div>
                <div className="pr-trust-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <div className="pr-faq-wrap">
        <div className="pr-faq-inner">
          <h2 className="pr-faq-title">Câu hỏi thường gặp</h2>
          {FAQ.map((item, i) => (
            <div key={i} className={`pr-faq-item${openFaq === i ? ' open' : ''}`}>
              <button className="pr-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <span className="pr-faq-ico">{openFaq === i ? '▲' : '▼'}</span>
              </button>
              {openFaq === i && <div className="pr-faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}