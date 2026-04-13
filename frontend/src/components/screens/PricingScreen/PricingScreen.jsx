import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../../utils/auth';
import './PricingScreen.css';

const API = 'http://localhost:3000/api';

const PLAN_STYLES = {
  free: { tagline: 'Bắt đầu miễn phí', color: '#9A8D80', gradient: 'linear-gradient(135deg,#6B5E50,#9A8D80)', icon: '🌱', badge: null },
  pro: { tagline: 'Tìm việc thông minh hơn', color: '#C0412A', gradient: 'linear-gradient(135deg,#C0412A,#E05A40)', icon: '⚡', badge: '🔥 Phổ biến nhất' },
  elite: { tagline: 'Toàn diện & ưu tiên tuyệt đối', color: '#D4820A', gradient: 'linear-gradient(135deg,#D4820A,#F0A020)', icon: '👑', badge: '⭐ Tốt nhất' },
};

const PLAN_RANK = { free: 0, pro: 1, elite: 2 };

const LIMIT_ROWS = [
  { field: 'jobSuggestPerDay', label: 'Đề xuất việc làm', unit: ' lần/ngày', icon: '💡' },
  { field: 'cvAnalysisPerMonth', label: 'Phân tích CV', unit: ' lần/tháng', icon: '🔍' },
  { field: 'cvMatchCheckCount', label: 'Kiểm tra độ phù hợp CV', unit: ' lần/tháng', icon: '🎯' },
];

const FAQ_ITEMS = [
  // { q: 'Tôi có thể huỷ gói bất cứ lúc nào không?', a: 'Có, bạn có thể huỷ bất cứ lúc nào. Gói sẽ tiếp tục đến hết chu kỳ đã thanh toán.' },
  { q: 'Có hoàn tiền nếu tôi không hài lòng không?', a: 'Chúng tôi cam kết hoàn tiền 100% trong 7 ngày đầu nếu bạn không hài lòng.' },
  // { q: 'Gói Pro và Elite khác nhau như thế nào?', a: 'Elite có thêm tư vấn 1-1 với HR, review CV, mock interview AI và bảo đảm tìm việc 60 ngày.' },
  { q: 'Thanh toán năm có lợi hơn không?', a: 'Tiết kiệm 20% so với thanh toán tháng, tương đương 2 tháng miễn phí mỗi năm.' },
];

export default function PricingScreen() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getToken());
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);
  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const sync = () => setToken(getToken());
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const resPlans = await fetch(`${API}/subscriptions/plans`);
      const plansData = await resPlans.json();
      setPlans(Array.isArray(plansData) ? plansData : []);

      if (token) {
        const resSub = await fetch(`${API}/subscriptions/current`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resSub.ok) setCurrentSub(await resSub.json());
      } else {
        setCurrentSub(null);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubscribe = (planName) => {
    if (!token) { navigate('/login'); return; }
    if (planName === 'free') return;
    const plan = plans.find(p => p.name === planName);
    if (!plan) return;
    navigate('/services/checkout', {
      state: {
        planName,
        planDisplayName: plan.displayName,
        billing,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        limits: plan.limits,
      }
    });
  };

  const handleCancel = async () => {
    if (!window.confirm('Tắt tự động gia hạn? Gói sẽ hết hạn vào cuối chu kỳ hiện tại.')) return;
    setCancelLoading(true);
    try {
      const res = await fetch(`${API}/subscriptions/cancel`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) { showToast(data.message ?? 'Đã tắt tự động gia hạn'); fetchData(); }
      else showToast(data.message || 'Không thể huỷ');
    } catch { showToast('Lỗi kết nối máy chủ'); }
    finally { setCancelLoading(false); }
  };

  const handleOpenRefund = () => {
    navigate('/services/checkout', { state: { openRefund: true } });
  };

  const fmt = (n) => n === 0 ? 'Miễn phí' : n.toLocaleString('vi-VN') + 'đ';
  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '';
  const getPrice = (plan) => billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const isCurrent = (name) => currentSub?.planName === name && currentSub?.billing === billing;
  const currentRank = PLAN_RANK[currentSub?.planName] ?? 0;

  const getBtnLabel = (plan) => {
    if (isCurrent(plan.name)) return '✓ Gói hiện tại của bạn';
    if (plan.name === 'free') return 'Mặc định';
    if (submitting) return '⏳ Đang xử lý...';
    if (!token) return 'Đăng nhập để nâng cấp';
    if (currentSub && currentSub.planName !== 'free' && (PLAN_RANK[plan.name] ?? 0) < currentRank)
      return `Hạ xuống ${plan.displayName} →`;
    return `Nâng cấp lên ${plan.displayName} →`;
  };

  if (loading) return (
    <div className="pr-loading-screen">
      <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
      Đang tải bảng giá...
    </div>
  );

  return (
    <div className="pr-page">

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#1C1510', color: '#F5EED8', padding: '10px 22px',
          borderRadius: 9, fontSize: 13, fontWeight: 600, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
        }}>{toast}</div>
      )}

      <div className="pr-hero">
        <div className="pr-hero-noise" />
        <div className="pr-hero-glow" />
        <div className="pr-hero-inner">
          <div className="pr-hero-tag">
            <span className="pr-hero-dot" />
            {currentSub && currentSub.planName !== 'free' ? (
              <>Đang dùng Gói <strong>{currentSub.displayName}</strong>
                {currentSub.expiresAt && ` · Gia hạn ${formatDate(currentSub.expiresAt)}`}
              </>
            ) : 'Nâng tầm sự nghiệp cùng AI'}
          </div>
          <h1 className="pr-hero-title">
            Chọn gói phù hợp với<br /><em>hành trình của bạn</em>
          </h1>
          <p className="pr-hero-sub">
            Nâng cấp để tìm việc thông minh hơn, nhanh hơn và hiệu quả hơn với AI.
          </p>
          <div className="pr-toggle-wrap">
            <div className="pr-toggle">
              <button className={`pr-toggle-opt${billing === 'monthly' ? ' on' : ''}`} onClick={() => setBilling('monthly')}>
                Hàng tháng
              </button>
              <button className={`pr-toggle-opt${billing === 'yearly' ? ' on' : ''}`} onClick={() => setBilling('yearly')}>
                Hàng năm <span className="pr-save-badge">–20%</span>
              </button>
            </div>
            {billing === 'yearly' && (
              <div className="pr-save-note">
                🎉 Bạn tiết kiệm được <strong>2 tháng</strong> so với trả theo tháng
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nút lịch sử luôn hiển thị khi đã đăng nhập */}
      {token && (
        <div style={{ maxWidth: 1200, margin: '28px auto 0', padding: '0 32px' }}>
          <div style={{
            background: '#FEFCF7', border: '1.5px solid #DDD6C6', borderRadius: 14,
            padding: '14px 20px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            {/* Thông tin gói — chỉ hiện khi đang có gói trả phí */}
            {currentSub && currentSub.planName !== 'free' ? (
              <div style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.7 }}>
                <b style={{ color: '#1C1510' }}>Gói {currentSub.displayName}</b>
                {' '}· {currentSub.billing === 'yearly' ? 'Hàng năm' : 'Hàng tháng'}
                {currentSub.expiresAt && (
                  <span> · {currentSub.autoRenew
                    ? `Tự động gia hạn ${formatDate(currentSub.expiresAt)}`
                    : `Hết hạn ${formatDate(currentSub.expiresAt)}`}
                  </span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#9A8D80' }}>Bạn đang dùng gói miễn phí</div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {/* Lịch sử luôn hiển thị */}
              <button onClick={() => navigate('/services/payment')} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                border: '1.5px solid #DDD6C6', background: 'transparent',
                color: '#6B5E50', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                🧾 Lịch sử thanh toán
              </button>

              {/* Hoàn tiền và hủy — chỉ hiện khi đang có gói trả phí */}
              {currentSub && currentSub.planName !== 'free' && (
                <>
                  <button onClick={handleOpenRefund} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    border: '1.5px solid #DDD6C6', background: 'transparent',
                    color: '#9A8D80', cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    💸 Yêu cầu hoàn tiền
                  </button>
                  {currentSub.autoRenew && (
                    <button onClick={handleCancel} disabled={cancelLoading} style={{
                      padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                      border: '1.5px solid #DDD6C6', background: 'transparent',
                      color: '#C0412A', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      {cancelLoading ? '⏳ Đang xử lý...' : 'Tắt tự động gia hạn'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pr-plans-wrap">
        <div className="pr-plans-grid">
          {plans.map((plan) => {
            const style = PLAN_STYLES[plan.name] ?? {};
            const price = getPrice(plan);
            const current = isCurrent(plan.name);
            const limits = plan.limits;

            return (
              <div key={plan.id} className={`pr-plan${style.badge ? ' featured' : ''}${current ? ' current' : ''}`}>
                {style.badge && (
                  <div className="pr-plan-badge" style={{ background: style.gradient }}>{style.badge}</div>
                )}
                {current && <div className="pr-current-ring" />}

                <div className="pr-plan-head">
                  <div className="pr-plan-icon" style={{ background: style.gradient }}>{style.icon}</div>
                  <div>
                    <div className="pr-plan-name" style={{ color: style.color }}>{plan.displayName}</div>
                    <div className="pr-plan-tagline">{style.tagline}</div>
                  </div>
                </div>

                <div className="pr-plan-price-wrap">
                  <div className="pr-plan-price">
                    {price === 0
                      ? <span className="pr-price-free">Miễn phí</span>
                      : <><span className="pr-price-n">{fmt(price)}</span>
                        <span className="pr-price-per">/{billing === 'yearly' ? 'năm' : 'tháng'}</span></>
                    }
                  </div>
                  {billing === 'yearly' && plan.monthlyPrice > 0 && (
                    <div className="pr-price-orig">
                      Gốc: {fmt(plan.monthlyPrice)}/tháng · ~{fmt(Math.round(price / 12))}/tháng
                    </div>
                  )}
                </div>

                <div className="pr-limits">
                  {LIMIT_ROWS.map(({ field, label, unit, icon }) => {
                    const val = limits?.[field];
                    const unlimited = val === 999;
                    return (
                      <div key={field} className={`pr-limit-item${unlimited ? ' unlimited' : ''}`}>
                        <span className="pr-limit-icon">{icon}</span>
                        <span className="pr-limit-val">
                          {val == null ? '—' : unlimited ? '∞' : `${val.toLocaleString('vi-VN')}${unit}`}
                        </span>
                        <span className="pr-limit-lbl">{label}</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="pr-plan-btn"
                  style={!current ? { background: style.gradient } : {}}
                  disabled={current || plan.name === 'free' || submitting}
                  onClick={() => handleSubscribe(plan.name)}
                >
                  {getBtnLabel(plan)}
                </button>

                {plan.name !== 'free' && (
                  <div className="pr-plan-guarantee">🔒 Hoàn tiền 100% trong 7 ngày</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {plans.length > 0 && (
        <div className="pr-compare-wrap">
          <div className="pr-compare-inner">
            <h2 className="pr-compare-title">So sánh tính năng chi tiết</h2>
            <div className="pr-compare-table">
              <div className="pr-ct-head">
                <div className="pr-ct-feat-col">Giới hạn sử dụng</div>
                {plans.map((p) => {
                  const s = PLAN_STYLES[p.name] ?? {};
                  return (
                    <div key={p.id} className={`pr-ct-plan-col${s.badge ? ' featured' : ''}`} style={s.badge ? { color: s.color } : {}}>
                      {p.displayName}
                    </div>
                  );
                })}
              </div>
              {LIMIT_ROWS.map(({ field, label, unit }) => (
                <div key={field} className="pr-ct-row">
                  <div className="pr-ct-feat">{label}</div>
                  {plans.map((p) => {
                    const s = PLAN_STYLES[p.name] ?? {};
                    const val = p.limits?.[field];
                    return (
                      <div key={p.id} className={`pr-ct-val${s.badge ? ' featured' : ''}`}>
                        {val == null ? '—' : val >= 999
                          ? <span style={{ color: '#2E6040', fontWeight: 800, fontSize: 16 }}>∞</span>
                          : `${val.toLocaleString('vi-VN')}${unit}`}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pr-faq-wrap">
        <div className="pr-faq-inner">
          <h2 className="pr-faq-title">Câu hỏi thường gặp</h2>
          {FAQ_ITEMS.map((item, i) => (
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
  );
}