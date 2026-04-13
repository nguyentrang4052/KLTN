import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken } from '../../../utils/auth'
import './PaymentScreen.css'

const API = 'http://localhost:3000/api'
const PLAN_COLORS = { free: '#9A8D80', pro: '#C0412A', elite: '#D4820A' }
const STATUS_CONFIG = {
  success: { label: 'Thành công', cls: 'success' },
  refund_pending: { label: 'Chờ hoàn tiền', cls: 'refund-pending' },
  refunded: { label: 'Đã hoàn tiền', cls: 'refunded' },
  failed: { label: 'Thất bại', cls: 'failed' },
}

export default function PaymentScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getToken()

  const [tab, setTab] = useState(location.state?.fromCheckout ? 'history' : 'plans')
  const [billing, setBilling] = useState('monthly')
  const [plans, setPlans] = useState([])
  const [currentSub, setCurrentSub] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [resPlans, resSub, resHistory] = await Promise.all([
        fetch(`${API}/subscriptions/plans`),
        token ? fetch(`${API}/subscriptions/current`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null),
        token ? fetch(`${API}/subscriptions/history`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null),
      ])
      const plansData = await resPlans.json()
      setPlans(Array.isArray(plansData) ? plansData : [])
      if (resSub?.ok) setCurrentSub(await resSub.json())
      if (resHistory?.ok) setHistory(await resHistory.json())
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (location.state?.fromCheckout) {
      showToast(`🎉 Gói ${location.state.planDisplayName} đã được kích hoạt!`)
      window.history.replaceState({}, '')
    }
  }, [])

  const fmt = (n) => n === 0 ? 'Miễn phí' : n.toLocaleString('vi-VN') + 'đ'
  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN') : '—'
  const getPrice = (plan) => billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const isCurrent = (name) => currentSub?.planName === name && currentSub?.billing === billing

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: 14, color: '#9A8D80' }}>
      Đang tải...
    </div>
  )

  return (
    <div className="pay-page">

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: '#1C1510', color: '#F5EED8', padding: '10px 22px',
          borderRadius: 9, fontSize: 13, fontWeight: 600, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
        }}>{toast}</div>
      )}

      <div className="pay-header">
        <div className="pay-header-inner">
          <div>
            <h1 className="pay-title">Thanh toán & Gói dịch vụ</h1>
            <p className="pay-sub">Nâng cấp để tìm việc hiệu quả hơn với AI</p>
          </div>
          {currentSub && (
            <div className="pay-current-badge">
              <span className="pay-current-dot" />
              Đang dùng: <strong>Gói {currentSub.displayName}</strong>
              {currentSub.expiresAt && ` · Gia hạn ${formatDate(currentSub.expiresAt)}`}
            </div>
          )}
        </div>
      </div>

      <div className="pay-tabs-bar">
        <div className="pay-tabs-inner">
          {[['plans', '💎 Gói dịch vụ'], ['history', '🧾 Lịch sử thanh toán']].map(([k, l]) => (
            <button key={k} className={`pay-tab${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
      </div>

      <div className="pay-body">

        {tab === 'plans' && (
          <div className="pay-plans-wrap">
            <div className="pay-billing-toggle">
              <button className={`pay-bill-opt${billing === 'monthly' ? ' on' : ''}`} onClick={() => setBilling('monthly')}>Hàng tháng</button>
              <button className={`pay-bill-opt${billing === 'yearly' ? ' on' : ''}`} onClick={() => setBilling('yearly')}>
                Hàng năm <span className="pay-discount-badge">–20%</span>
              </button>
            </div>
            <div className="pay-plans-grid">
              {plans.map(plan => {
                const color = PLAN_COLORS[plan.name] ?? '#9A8D80'
                const price = getPrice(plan)
                const current = isCurrent(plan.name)
                return (
                  <div key={plan.id} className={`pay-plan-card${plan.name === 'pro' ? ' featured' : ''}${current ? ' current' : ''}`}>
                    {plan.name !== 'free' && (
                      <div className="pay-plan-badge" style={{ background: color }}>
                        {plan.name === 'pro' ? 'Phổ biến nhất' : 'Tốt nhất'}
                      </div>
                    )}
                    <div className="pay-plan-head">
                      <div className="pay-plan-name" style={{ color }}>{plan.displayName}</div>
                      <div className="pay-plan-price">
                        <span className="pay-plan-amount">{price === 0 ? 'Miễn phí' : fmt(price)}</span>
                        {price > 0 && <span className="pay-plan-per">/{billing === 'yearly' ? 'năm' : 'tháng'}</span>}
                      </div>
                      {price > 0 && billing === 'yearly' && plan.monthlyPrice > 0 && (
                        <div className="pay-plan-original">Giá gốc: {fmt(plan.monthlyPrice * 12)}/năm</div>
                      )}
                    </div>
                    {plan.limits && (
                      <div className="pay-plan-features">
                        <div className="pay-feat"><span className="pay-feat-ico">💡</span>
                          {plan.limits.jobSuggestPerDay >= 999 ? 'Đề xuất việc không giới hạn' : `${plan.limits.jobSuggestPerDay} đề xuất/ngày`}
                        </div>
                        <div className="pay-feat"><span className="pay-feat-ico">🔍</span>
                          {plan.limits.cvAnalysisPerMonth >= 999 ? 'Phân tích CV không giới hạn' : plan.limits.cvAnalysisPerMonth === 0 ? 'Không có phân tích CV' : `${plan.limits.cvAnalysisPerMonth} phân tích CV/tháng`}
                        </div>
                        <div className="pay-feat"><span className="pay-feat-ico">🎯</span>
                          {plan.limits.cvMatchCheckCount >= 999 ? 'Kiểm tra CV match không giới hạn' : plan.limits.cvMatchCheckCount === 0 ? 'Không có kiểm tra CV match' : `${plan.limits.cvMatchCheckCount} lần kiểm tra CV/tháng`}
                        </div>
                      </div>
                    )}
                    <button
                      className={`pay-plan-btn${current ? ' current' : ''}`}
                      style={!current ? { background: color } : {}}
                      disabled={current || plan.name === 'free'}
                      onClick={() => !current && plan.name !== 'free' && navigate('/services/checkout', {
                        state: { planName: plan.name, planDisplayName: plan.displayName, billing, monthlyPrice: plan.monthlyPrice, yearlyPrice: plan.yearlyPrice, limits: plan.limits }
                      })}
                    >
                      {current ? '✓ Gói hiện tại' : plan.name === 'free' ? 'Mặc định' : `Nâng cấp lên ${plan.displayName} →`}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="pay-compare-note">🔒 Thanh toán bảo mật SSL · Hủy bất cứ lúc nào · Hoàn tiền trong 7 ngày nếu không hài lòng</div>
          </div>
        )}

        {tab === 'history' && (
          <div className="pay-history">
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#9A8D80', fontSize: 14 }}>Chưa có giao dịch nào</div>
            ) : (
              <>
                <div className="pay-history-header">
                  <span className="pay-history-ct">{history.length} giao dịch</span>
                </div>
                <div className="pay-history-table">
                  <div className="pay-th-row">
                    <span>Mã giao dịch</span>
                    <span>Ngày</span>
                    <span>Gói</span>
                    <span>Chu kỳ</span>
                    <span>Số tiền</span>
                    <span>Phương thức</span>
                    <span>Trạng thái</span>
                  </div>
                  {history.map(h => {
                    const st = STATUS_CONFIG[h.status] ?? { label: h.status, cls: 'pending' }
                    return (
                      <div key={h.id} className="pay-tr-row">
                        <span className="pay-td-id" title={h.transactionRef}>{h.transactionRef?.slice(0, 16)}…</span>
                        <span className="pay-td">{formatDate(h.paidAt)}</span>
                        <span className="pay-td"><span className="pay-plan-chip">{h.planName}</span></span>
                        <span className="pay-td">{h.billing === 'yearly' ? 'Năm' : 'Tháng'}</span>
                        <span className="pay-td pay-td-amount">{fmt(h.amount)}</span>
                        <span className="pay-td pay-td-method">{h.method ?? '—'}</span>
                        <span className="pay-td"><span className={`pay-status-chip ${st.cls}`}>{st.label}</span></span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}