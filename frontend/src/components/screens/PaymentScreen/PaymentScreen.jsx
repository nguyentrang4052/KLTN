// src/components/screens/PaymentScreen/PaymentScreen.jsx
import { useState } from 'react'
import './PaymentScreen.css'

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, per: '', color: '#9A8D80',
    badge: null,
    features: ['5 lượt ứng tuyển/tháng', 'Xem 10 JD đầy đủ/ngày', 'Tạo 1 CV cơ bản', 'AI match cơ bản'],
    disabled: ['Auto Apply', 'CV không giới hạn', 'Phân tích AI nâng cao', 'Ưu tiên hiển thị hồ sơ'],
  },
  {
    id: 'pro', name: 'Pro', price: 99000, per: '/tháng', color: '#C0412A',
    badge: 'Phổ biến nhất',
    features: ['Ứng tuyển không giới hạn', 'Xem JD không giới hạn', 'CV không giới hạn + 30 template', 'Auto Apply 1-click', 'AI match nâng cao', 'Thông báo ưu tiên', 'Ẩn hồ sơ với nhà tuyển dụng hiện tại'],
    disabled: ['API access', 'White-label CV'],
  },
  {
    id: 'elite', name: 'Elite', price: 249000, per: '/tháng', color: '#D4820A',
    badge: 'Tốt nhất',
    features: ['Tất cả tính năng Pro', 'Tư vấn nghề nghiệp 1-1 (2 buổi/tháng)', 'Review CV bởi chuyên gia HR', 'Ưu tiên hiển thị hồ sơ × 5', 'Báo cáo thị trường lương hàng tuần', 'API access', 'White-label CV'],
    disabled: [],
  },
]

const HISTORY = [
  { id: 'INV-2025-011', date: '01/11/2025', plan: 'Pro',  amount: 99000,  status: 'success', method: 'Thẻ Visa •••• 4242' },
  { id: 'INV-2025-010', date: '01/10/2025', plan: 'Pro',  amount: 99000,  status: 'success', method: 'Thẻ Visa •••• 4242' },
  { id: 'INV-2025-009', date: '01/09/2025', plan: 'Free', amount: 0,      status: 'free',    method: '—' },
  { id: 'INV-2025-008', date: '15/08/2025', plan: 'Pro',  amount: 99000,  status: 'success', method: 'MoMo' },
  { id: 'INV-2025-007', date: '15/07/2025', plan: 'Pro',  amount: 99000,  status: 'failed',  method: 'MoMo' },
]

const METHODS = [
  { id: 'visa',  icon: '💳', label: 'Thẻ Visa •••• 4242',  sub: 'Hết hạn 12/2027', default: true  },
  { id: 'momo',  icon: '📱', label: 'MoMo',                sub: '0901 234 567',     default: false },
]

export default function PaymentScreen({ onNavigate }) {
  const [tab, setTab]           = useState('plans')
  const [billing, setBilling]   = useState('monthly')
  const [current, setCurrent]   = useState('pro')
  const [confirm, setConfirm]   = useState(null)

  const fmt = (n) => n === 0 ? 'Miễn phí' : n.toLocaleString('vi') + 'đ'
  const disc = (p) => billing === 'yearly' ? Math.round(p * 10 * 0.8) : p

  return (
    <div className="pay-page">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="pay-header">
        <div className="pay-header-inner">
          <div>
            <h1 className="pay-title">Thanh toán & Gói dịch vụ</h1>
            <p className="pay-sub">Nâng cấp để tìm việc hiệu quả hơn với AI</p>
          </div>
          <div className="pay-current-badge">
            <span className="pay-current-dot" />
            Đang dùng: <strong>Gói Pro</strong> · Gia hạn 01/12/2025
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="pay-tabs-bar">
        <div className="pay-tabs-inner">
          {[['plans','💎 Gói dịch vụ'],['history','🧾 Lịch sử thanh toán'],['methods','💳 Phương thức']].map(([k,l]) => (
            <button key={k} className={`pay-tab${tab===k?' active':''}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="pay-body">

        {/* ══ PLANS ════════════════════════════════════════ */}
        {tab === 'plans' && (
          <div className="pay-plans-wrap">

            {/* Billing toggle */}
            <div className="pay-billing-toggle">
              <button className={`pay-bill-opt${billing==='monthly'?' on':''}`} onClick={() => setBilling('monthly')}>Hàng tháng</button>
              <button className={`pay-bill-opt${billing==='yearly'?' on':''}`} onClick={() => setBilling('yearly')}>
                Hàng năm
                <span className="pay-discount-badge">–20%</span>
              </button>
            </div>

            {/* Plan cards */}
            <div className="pay-plans-grid">
              {PLANS.map(plan => (
                <div key={plan.id} className={`pay-plan-card${plan.id==='pro'?' featured':''}${current===plan.id?' current':''}`}>
                  {plan.badge && <div className="pay-plan-badge" style={{background: plan.color}}>{plan.badge}</div>}

                  <div className="pay-plan-head">
                    <div className="pay-plan-name" style={{color: plan.color}}>{plan.name}</div>
                    <div className="pay-plan-price">
                      <span className="pay-plan-amount">{plan.price === 0 ? 'Miễn phí' : fmt(disc(plan.price))}</span>
                      {plan.price > 0 && <span className="pay-plan-per">{billing==='yearly'?'/năm':plan.per}</span>}
                    </div>
                    {plan.price > 0 && billing === 'yearly' && (
                      <div className="pay-plan-original">Giá gốc: {fmt(plan.price * 12)}/năm</div>
                    )}
                  </div>

                  <div className="pay-plan-features">
                    {plan.features.map(f => (
                      <div key={f} className="pay-feat"><span className="pay-feat-ico">✓</span>{f}</div>
                    ))}
                    {plan.disabled.map(f => (
                      <div key={f} className="pay-feat disabled"><span className="pay-feat-ico">✕</span>{f}</div>
                    ))}
                  </div>

                  <button
                    className={`pay-plan-btn${current===plan.id?' current':''}`}
                    style={current!==plan.id ? {background: plan.color} : {}}
                    onClick={() => current !== plan.id && setConfirm(plan)}
                    disabled={current === plan.id}
                  >
                    {current === plan.id ? '✓ Gói hiện tại' : plan.id === 'free' ? 'Hạ xuống Free' : `Nâng cấp ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>

            {/* Feature comparison note */}
            <div className="pay-compare-note">
              🔒 Thanh toán bảo mật SSL · Hủy bất cứ lúc nào · Hoàn tiền trong 7 ngày nếu không hài lòng
            </div>
          </div>
        )}

        {/* ══ HISTORY ══════════════════════════════════════ */}
        {tab === 'history' && (
          <div className="pay-history">
            <div className="pay-history-header">
              <span className="pay-history-ct">{HISTORY.length} giao dịch</span>
              <button className="pay-export-btn">⬇ Xuất CSV</button>
            </div>
            <div className="pay-history-table">
              <div className="pay-th-row">
                <span>Mã hoá đơn</span><span>Ngày</span><span>Gói</span>
                <span>Số tiền</span><span>Phương thức</span><span>Trạng thái</span><span></span>
              </div>
              {HISTORY.map(h => (
                <div key={h.id} className="pay-tr-row">
                  <span className="pay-td-id">{h.id}</span>
                  <span className="pay-td">{h.date}</span>
                  <span className="pay-td"><span className="pay-plan-chip">{h.plan}</span></span>
                  <span className="pay-td pay-td-amount">{h.amount === 0 ? '—' : fmt(h.amount)}</span>
                  <span className="pay-td pay-td-method">{h.method}</span>
                  <span className="pay-td">
                    <span className={`pay-status-chip ${h.status}`}>
                      {h.status === 'success' ? '✓ Thành công' : h.status === 'failed' ? '✕ Thất bại' : '— Miễn phí'}
                    </span>
                  </span>
                  <span className="pay-td">
                    {h.status === 'success' && <button className="pay-dl-btn">PDF</button>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ METHODS ══════════════════════════════════════ */}
        {tab === 'methods' && (
          <div className="pay-methods">
            <div className="pay-methods-list">
              {METHODS.map(m => (
                <div key={m.id} className={`pay-method-card${m.default?' default':''}`}>
                  <div className="pay-method-ico">{m.icon}</div>
                  <div className="pay-method-info">
                    <div className="pay-method-label">{m.label}</div>
                    <div className="pay-method-sub">{m.sub}</div>
                  </div>
                  {m.default && <span className="pay-default-tag">Mặc định</span>}
                  <div className="pay-method-acts">
                    {!m.default && <button className="pay-mth-btn">Đặt mặc định</button>}
                    <button className="pay-mth-btn danger">Xoá</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new */}
            <div className="pay-add-method">
              <div className="pay-add-title">Thêm phương thức thanh toán</div>
              <div className="pay-method-options">
                {[['💳','Thẻ tín dụng / ghi nợ'],['📱','Ví MoMo'],['🏦','Chuyển khoản ngân hàng'],['🍎','Apple Pay / Google Pay']].map(([ico,lbl]) => (
                  <button key={lbl} className="pay-add-opt">
                    <span className="pay-add-opt-ico">{ico}</span>
                    <span>{lbl}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card form */}
            <div className="pay-card-form">
              <div className="pay-cf-title">Thêm thẻ mới</div>
              <div className="pay-cf-grid">
                <div className="pay-cf-field full">
                  <label>Số thẻ</label>
                  <input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="pay-cf-field">
                  <label>Tên chủ thẻ</label>
                  <input placeholder="NGUYEN VAN A" />
                </div>
                <div className="pay-cf-field half">
                  <label>Hết hạn</label>
                  <input placeholder="MM/YY" />
                </div>
                <div className="pay-cf-field half">
                  <label>CVV</label>
                  <input placeholder="•••" type="password" />
                </div>
              </div>
              <button className="pay-cf-submit">+ Thêm thẻ</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Confirm modal ──────────────────────────────── */}
      {confirm && (
        <div className="pay-modal-overlay" onClick={() => setConfirm(null)}>
          <div className="pay-modal" onClick={e => e.stopPropagation()}>
            <div className="pay-modal-title">Xác nhận nâng cấp</div>
            <div className="pay-modal-body">
              Bạn sắp chuyển sang gói <strong style={{color: confirm.color}}>{confirm.name}</strong>.
              Số tiền <strong>{fmt(disc(confirm.price))}</strong> sẽ được trừ từ phương thức thanh toán mặc định.
            </div>
            <div className="pay-modal-foot">
              <button className="pay-modal-cancel" onClick={() => setConfirm(null)}>Huỷ</button>
              <button className="pay-modal-ok" style={{background: confirm.color}}
                onClick={() => { setCurrent(confirm.id); setConfirm(null) }}>
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}