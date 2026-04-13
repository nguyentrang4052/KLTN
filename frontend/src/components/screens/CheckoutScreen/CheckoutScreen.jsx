import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getToken } from '../../../utils/auth'
import { QRCodeSVG } from 'qrcode.react'
import './CheckoutScreen.css'

const API = 'http://localhost:3000/api'
const PLAN_COLORS = { free: '#9A8D80', pro: '#C0412A', elite: '#D4820A' }
const PLAN_ICONS = { free: '🌱', pro: '⚡', elite: '👑' }

const REFUND_INIT = {
    reason: '',
    accountNumber: '',
    accountName: '',
    bankName: '',
}

function RefundForm({ refundForm, setRefundForm, refundError, refundLoading, inputStyle, onClose, onSubmit }) {
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700, color: '#1C1510' }}>
                    💸 Yêu cầu hoàn tiền
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9A8D80', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ background: '#FFF8E7', border: '1px solid #F0D080', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12.5, color: '#6B5E50', lineHeight: 1.65 }}>
                ⚠ Chỉ áp dụng trong <strong>7 ngày</strong> kể từ ngày thanh toán gần nhất. Sau khi xác nhận, gói dịch vụ đang dùng sẽ bị huỷ ngay.
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#6B5E50', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.6px' }}>
                Lý do hoàn tiền <span style={{ color: '#C0412A' }}>*</span>
            </label>
            <textarea
                rows={3}
                placeholder="Vd: Tôi không dùng được tính năng phân tích CV..."
                value={refundForm.reason}
                onChange={e => setRefundForm(f => ({ ...f, reason: e.target.value }))}
                style={{ ...inputStyle(false), resize: 'vertical', minHeight: 80 }}
            />

            <div style={{ height: 1, background: '#EFE9DC', margin: '4px 0 16px' }} />

            <div style={{ fontSize: 12, fontWeight: 700, color: '#6B5E50', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.6px' }}>
                Thông tin tài khoản nhận tiền
            </div>

            <label style={{ display: 'block', fontSize: 12.5, color: '#6B5E50', marginBottom: 5 }}>
                Số tài khoản / Số thẻ <span style={{ color: '#C0412A' }}>*</span>
            </label>
            <input type="text" placeholder="Vd: 0123456789"
                value={refundForm.accountNumber}
                onChange={e => setRefundForm(f => ({ ...f, accountNumber: e.target.value }))}
                style={inputStyle(false)}
            />

            <label style={{ display: 'block', fontSize: 12.5, color: '#6B5E50', marginBottom: 5 }}>
                Tên chủ tài khoản <span style={{ color: '#C0412A' }}>*</span>
            </label>
            <input type="text" placeholder="Vd: NGUYEN VAN A"
                value={refundForm.accountName}
                onChange={e => setRefundForm(f => ({ ...f, accountName: e.target.value.toUpperCase() }))}
                style={inputStyle(false)}
            />

            <label style={{ display: 'block', fontSize: 12.5, color: '#6B5E50', marginBottom: 5 }}>
                Ngân hàng <span style={{ color: '#C0412A' }}>*</span>
            </label>
            <input type="text" placeholder="Vd: Vietcombank, Techcombank, MB Bank..."
                value={refundForm.bankName}
                onChange={e => setRefundForm(f => ({ ...f, bankName: e.target.value }))}
                style={inputStyle(false)}
            />

            {refundError && (
                <div style={{ padding: '9px 12px', borderRadius: 8, background: 'rgba(192,65,42,.1)', color: '#C0412A', fontSize: 12.5, fontWeight: 600, marginBottom: 12 }}>
                    ⚠ {refundError}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={onClose} style={{
                    flex: 1, padding: '12px', borderRadius: 10,
                    border: '1.5px solid #DDD6C6', background: 'transparent',
                    fontSize: 13, fontWeight: 700, color: '#6B5E50',
                    cursor: 'pointer', fontFamily: 'inherit',
                }}>Huỷ</button>
                <button onClick={onSubmit} disabled={refundLoading} style={{
                    flex: 2, padding: '12px', borderRadius: 10, border: 'none',
                    background: refundLoading ? '#ccc' : '#C0412A',
                    color: '#fff', fontSize: 13, fontWeight: 700,
                    cursor: refundLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>
                    {refundLoading ? '⏳ Đang gửi...' : 'Gửi yêu cầu hoàn tiền'}
                </button>
            </div>
        </>
    )
}

export default function CheckoutScreen() {
    const navigate = useNavigate()
    const location = useLocation()
    const token = getToken()

    const isRefundOnly = !location.state?.planName && location.state?.openRefund

    if (!location.state?.planName && !location.state?.openRefund) {
        navigate('/services', { replace: true })
        return null
    }

    const { planName, planDisplayName, billing, monthlyPrice, yearlyPrice, limits } = location.state ?? {}
    const price = billing === 'yearly' ? yearlyPrice : monthlyPrice
    const planColor = PLAN_COLORS[planName] ?? '#C0412A'
    const fmt = (n) => n?.toLocaleString('vi-VN') + 'đ'

    const [error, setError] = useState('')
    const [transactionRef, setTransactionRef] = useState('')
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [checkoutUrl, setCheckoutUrl] = useState('')
    const [qrLoading, setQrLoading] = useState(false)
    const [paymentVerified, setPaymentVerified] = useState(false)
    const [countdown, setCountdown] = useState(300)
    const [countdownActive, setCountdownActive] = useState(false)
    const [copied, setCopied] = useState('')

    const [showRefund, setShowRefund] = useState(false)
    const [refundForm, setRefundForm] = useState(REFUND_INIT)
    const [refundLoading, setRefundLoading] = useState(false)
    const [refundError, setRefundError] = useState('')
    const [refundSuccess, setRefundSuccess] = useState(false)

    useEffect(() => { if (!token) navigate('/login') }, [])

    useEffect(() => {
        if (location.state?.openRefund) setShowRefund(true)
    }, [])

    useEffect(() => {
        if (!isRefundOnly) handleGenerateQR()
    }, [])

    useEffect(() => {
        if (!countdownActive || countdown <= 0) return
        const t = setInterval(() => setCountdown(c => c - 1), 1000)
        return () => clearInterval(t)
    }, [countdownActive, countdown])

    useEffect(() => {
        if (!transactionRef || !countdownActive || paymentVerified) return
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API}/subscriptions/confirm-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transactionRef }),
                })
                const data = await res.json()
                if (data.success) {
                    setPaymentVerified(true)
                    setCountdownActive(false)
                    clearInterval(interval)
                    setTimeout(() => navigate('/services/payment', {
                        state: { fromCheckout: true, planDisplayName, transactionRef }
                    }), 1500)
                }
            } catch { /* silent */ }
        }, 3000)
        return () => clearInterval(interval)
    }, [transactionRef, countdownActive, paymentVerified])

    const mmss = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`

    const handleGenerateQR = async () => {
        setQrLoading(true)
        setError('')
        setPaymentVerified(false)
        setCountdownActive(false)
        setQrCodeUrl('')
        setCheckoutUrl('')
        setTransactionRef('')
        try {
            const res = await fetch(`${API}/subscriptions/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ planName, billing }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.message || 'Không thể khởi tạo giao dịch'); return }
            setTransactionRef(data.payment.transactionRef)
            setQrCodeUrl(data.payment.qrCode)
            setCheckoutUrl(data.payment.checkoutUrl)
            setCountdown(300)
            setCountdownActive(true)
        } catch {
            setError('Lỗi kết nối máy chủ')
        } finally {
            setQrLoading(false)
        }
    }

    const handleCopy = (val, key) => {
        navigator.clipboard?.writeText(val)
        setCopied(key)
        setTimeout(() => setCopied(''), 1500)
    }

    const handleRefundSubmit = async () => {
        const { reason, accountNumber, accountName, bankName } = refundForm
        if (!reason.trim()) { setRefundError('Vui lòng nhập lý do hoàn tiền'); return }
        if (!accountNumber.trim()) { setRefundError('Vui lòng nhập số tài khoản'); return }
        if (!accountName.trim()) { setRefundError('Vui lòng nhập tên chủ tài khoản'); return }
        if (!bankName.trim()) { setRefundError('Vui lòng nhập tên ngân hàng'); return }
        setRefundLoading(true)
        setRefundError('')
        try {
            const res = await fetch(`${API}/subscriptions/refund`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ reason, accountNumber, accountName, bankName }),
            })
            const data = await res.json()
            if (!res.ok) { setRefundError(data.message || 'Không thể gửi yêu cầu hoàn tiền'); return }
            setRefundSuccess(true)
        } catch {
            setRefundError('Lỗi kết nối máy chủ')
        } finally {
            setRefundLoading(false)
        }
    }

    const closeRefund = () => {
        setShowRefund(false)
        setRefundForm(REFUND_INIT)
        setRefundError('')
        setRefundSuccess(false)
        if (isRefundOnly) navigate('/services')
    }

    const inputStyle = (hasError) => ({
        width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 13,
        fontFamily: 'inherit', outline: 'none', marginBottom: 12,
        border: `1.5px solid ${hasError ? '#C0412A' : '#DDD6C6'}`,
        background: '#FEFCF7', color: '#1C1510', boxSizing: 'border-box',
    })

    const RefundModal = (
        <div
            onClick={(e) => e.target === e.currentTarget && closeRefund()}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(28,21,16,.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, padding: 16,
            }}
        >
            <div style={{
                background: '#FEFCF7', borderRadius: 20, padding: 28,
                width: '100%', maxWidth: 480,
                boxShadow: '0 24px 64px rgba(28,21,16,.25)',
                maxHeight: '90vh', overflowY: 'auto',
            }}>
                {refundSuccess ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#1C1510', marginBottom: 8, fontFamily: 'Fraunces, serif' }}>
                            Yêu cầu đã được ghi nhận!
                        </div>
                        <div style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.7, marginBottom: 24 }}>
                            Chúng tôi sẽ hoàn tiền trong vòng <strong>7–14 ngày làm việc</strong>.
                        </div>
                        <button onClick={closeRefund} style={{
                            padding: '11px 28px', borderRadius: 10, border: 'none',
                            background: '#1C1510', color: '#F5EED8',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        }}>Đóng</button>
                    </div>
                ) : (
                    <RefundForm
                        refundForm={refundForm}
                        setRefundForm={setRefundForm}
                        refundError={refundError}
                        refundLoading={refundLoading}
                        inputStyle={inputStyle}
                        onClose={closeRefund}
                        onSubmit={handleRefundSubmit}
                    />
                )}
            </div>
        </div>
    )

    if (isRefundOnly) {
        return showRefund ? RefundModal : null
    }

    return (
        <div className="ck-page">
            <div className="ck-header">
                <div className="ck-header-inner">
                    <button className="ck-back" onClick={() => navigate('/services')}>← Quay lại</button>
                    <div className="ck-header-title">Thanh toán</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/services/payment')} style={{
                            background: 'none', border: '1.5px solid #DDD6C6', borderRadius: 8,
                            padding: '5px 12px', fontSize: 12, fontWeight: 700,
                            color: '#6B5E50', cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                            🧾 Lịch sử
                        </button>
                        <div className="ck-header-secure">🔒 SSL Bảo mật</div>
                    </div>
                </div>
            </div>

            <div className="ck-body">
                <div className="ck-layout">
                    <div className="ck-left">

                        <div className="ck-order-card">
                            <div className="ck-order-title">Đơn hàng của bạn</div>
                            <div className="ck-order-row">
                                <div className="ck-order-plan">
                                    <div className="ck-order-plan-icon" style={{ background: `linear-gradient(135deg,${planColor},${planColor}cc)` }}>
                                        {PLAN_ICONS[planName] ?? '⚡'}
                                    </div>
                                    <div>
                                        <div className="ck-order-plan-name">Gói {planDisplayName}</div>
                                        <div className="ck-order-plan-period">
                                            {billing === 'yearly' ? 'Thanh toán hàng năm' : 'Thanh toán hàng tháng'}
                                        </div>
                                    </div>
                                </div>
                                <div className="ck-order-price" style={{ color: planColor }}>{fmt(price)}</div>
                            </div>
                            {billing === 'yearly' && monthlyPrice > 0 && (
                                <div className="ck-order-saving">
                                    🎉 Bạn tiết kiệm <strong>{fmt(monthlyPrice * 12 - price)}</strong> so với trả theo tháng
                                </div>
                            )}
                            <div className="ck-order-divider" />
                            <div className="ck-order-total">
                                <span>Tổng thanh toán</span>
                                <span className="ck-order-total-n">{fmt(price)}</span>
                            </div>
                            <div className="ck-order-vat">Đã bao gồm VAT 10%</div>
                        </div>

                        {error && (
                            <div style={{
                                padding: '10px 14px', borderRadius: 8, marginBottom: 12,
                                background: 'rgba(192,65,42,.1)', color: '#C0412A', fontSize: 13, fontWeight: 600,
                            }}>⚠ {error}</div>
                        )}

                        <div className="ck-qr-card">
                            <div className="ck-qr-bank-row">
                                <div className="ck-qr-bank-logo" style={{ background: '#0066CC' }}>QR</div>
                                <div>
                                    <div className="ck-qr-bank-name">Chuyển khoản ngân hàng</div>
                                    <div className="ck-qr-bank-sub">Quét mã QR hoặc mở link thanh toán</div>
                                </div>
                                {countdownActive && (
                                    <div className={`ck-countdown${countdown < 60 ? ' urgent' : ''}`}>
                                        <div className="ck-countdown-n">{mmss}</div>
                                        <div className="ck-countdown-l">còn lại</div>
                                    </div>
                                )}
                            </div>

                            <div className="ck-qr-wrap">
                                <div className="ck-qr-container">
                                    {qrLoading ? (
                                        <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: '#9A8D80', fontSize: 13, fontWeight: 600 }}>
                                            <div style={{ fontSize: 28 }}>⏳</div>
                                            Đang tạo mã QR...
                                        </div>
                                    ) : paymentVerified ? (
                                        <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: '#2E6040', fontSize: 13, fontWeight: 700 }}>
                                            <div style={{ fontSize: 52 }}>✅</div>
                                            Thanh toán thành công!
                                        </div>
                                    ) : qrCodeUrl ? (
                                        <QRCodeSVG value={qrCodeUrl} size={200} level="M" includeMargin={true} />
                                    ) : (
                                        <div style={{ width: 200, height: 200, border: '2px dashed #DDD6C6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9A8D80', fontSize: 13, padding: 20, textAlign: 'center' }}>
                                            Mã QR sẽ xuất hiện ở đây
                                        </div>
                                    )}
                                    {qrCodeUrl && !qrLoading && !paymentVerified && (
                                        <div className="ck-qr-amount-overlay"><span>{fmt(price)}</span></div>
                                    )}
                                </div>
                                <div className="ck-qr-hint">Mở app ngân hàng → Quét mã → Thanh toán và chờ xác nhận tự động</div>
                            </div>

                            {checkoutUrl && !paymentVerified && (
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'inline-block', padding: '8px 20px', background: '#0066CC', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                                        🌐 Mở trang thanh toán
                                    </a>
                                </div>
                            )}

                            {transactionRef && !paymentVerified && (
                                <div className="ck-transfer-info">
                                    <div className="ck-ti-title">Thông tin giao dịch</div>
                                    {[
                                        { label: 'Mã giao dịch', val: transactionRef, key: 'ref' },
                                        { label: 'Số tiền', val: fmt(price), key: 'amt' },
                                    ].map(({ label, val, key }) => (
                                        <div key={key} className="ck-ti-row">
                                            <span className="ck-ti-label">{label}</span>
                                            <div className="ck-ti-val-wrap">
                                                <span className="ck-ti-val">{val}</span>
                                                <button
                                                    className={`ck-copy-btn${copied === key ? ' copied' : ''}`}
                                                    onClick={() => handleCopy(val, key)}
                                                >
                                                    {copied === key ? '✓ Đã chép' : '⎘ Sao chép'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!paymentVerified && (
                                <div style={{ background: '#FFF8E7', border: '1px solid #F0D080', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#6B5E50', lineHeight: 1.7 }}>
                                    ⚠ Không hỗ trợ tự động gia hạn. Bạn sẽ cần thanh toán lại khi gói hết hạn.<br />
                                    Yêu cầu hoàn tiền được xử lý trong 7–14 ngày làm việc.
                                </div>
                            )}

                            <div className="ck-qr-actions">
                                {!paymentVerified && (
                                    <button className="ck-back-method-btn" onClick={handleGenerateQR} disabled={qrLoading}>
                                        🔄 Tạo lại QR
                                    </button>
                                )}
                                <div style={{
                                    flex: 1, padding: '13px', borderRadius: 10,
                                    background: paymentVerified ? '#2E6040' : '#F7F2EA',
                                    border: `1.5px solid ${paymentVerified ? '#2E6040' : '#DDD6C6'}`,
                                    color: paymentVerified ? '#fff' : '#9A8D80',
                                    fontSize: 13, fontWeight: 600, textAlign: 'center',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}>
                                    {paymentVerified
                                        ? '✔ Thanh toán thành công! Đang chuyển trang...'
                                        : countdown <= 0
                                            ? '⏰ Hết thời gian — Nhấn Tạo lại QR'
                                            : <>
                                                <span style={{
                                                    display: 'inline-block', width: 14, height: 14,
                                                    border: '2px solid #DDD6C6', borderTopColor: '#9A8D80',
                                                    borderRadius: '50%', animation: 'spin 1s linear infinite',
                                                }} />
                                                Đang chờ thanh toán...
                                            </>
                                    }
                                </div>
                            </div>

                            <p style={{ textAlign: 'center', fontSize: 12, color: '#9A8D80', marginTop: 10 }}>
                                Sau khi thanh toán, gói sẽ được kích hoạt tự động trong vài giây.
                            </p>
                        </div>

                        <div style={{ marginTop: 12, textAlign: 'center' }}>
                            <button onClick={() => setShowRefund(true)} style={{
                                background: 'none', border: 'none', fontSize: 13,
                                color: '#9A8D80', cursor: 'pointer', textDecoration: 'underline',
                                fontFamily: 'inherit',
                            }}>
                                Đã thanh toán trước đó? Yêu cầu hoàn tiền
                            </button>
                        </div>
                    </div>

                    <div className="ck-right">
                        <div className="ck-benefits-card">
                            <div className="ck-benefits-title">Bạn sẽ nhận được</div>
                            {limits ? (
                                [
                                    { field: 'jobSuggestPerDay', ico: '💡', label: 'Đề xuất việc làm', format: (v) => v >= 999 ? 'Không giới hạn mỗi ngày' : `${v} lần/ngày` },
                                    { field: 'cvAnalysisPerMonth', ico: '🔍', label: 'Phân tích CV', format: (v) => v >= 999 ? 'Không giới hạn mỗi tháng' : v === 0 ? 'Không có' : `${v} lần/tháng` },
                                    { field: 'cvMatchCheckCount', ico: '🎯', label: 'Kiểm tra độ phù hợp CV', format: (v) => v >= 999 ? 'Không giới hạn mỗi tháng' : v === 0 ? 'Không có' : `${v} lần/tháng` },
                                ].map(({ field, ico, label, format }) => {
                                    const val = limits[field]
                                    return (
                                        <div key={field} className="ck-benefit-row" style={val === 0 ? { opacity: 0.4 } : {}}>
                                            <div className="ck-benefit-ico" style={{ background: `${planColor}18` }}>{ico}</div>
                                            <div>
                                                <div className="ck-benefit-title">{label}</div>
                                                <div className="ck-benefit-sub">{format(val)}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="ck-benefit-row">
                                    <div className="ck-benefit-ico" style={{ background: `${planColor}18` }}>⚠️</div>
                                    <div>
                                        <div className="ck-benefit-title">Không có thông tin giới hạn</div>
                                        <div className="ck-benefit-sub">Vui lòng liên hệ hỗ trợ.</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="ck-guarantee-card">
                            <div className="ck-guarantee-ico">🔒</div>
                            <div className="ck-guarantee-title">Bảo đảm hoàn tiền 7 ngày</div>
                            <div className="ck-guarantee-sub">
                                Nếu không hài lòng trong 7 ngày đầu, chúng tôi hoàn tiền 100% — không cần hỏi lý do.
                            </div>
                        </div>

                        <div className="ck-reviews-mini">
                            <div className="ck-reviews-title">💬 Người dùng nói gì</div>
                            {[
                                { name: 'Minh K.', text: '"Tìm việc mới trong 3 tuần nhờ AI gợi ý. Tiết kiệm cả tháng tìm tay!"', rating: '⭐⭐⭐⭐⭐' },
                                { name: 'Lan A.', text: '"AI gợi ý đúng loại việc tôi muốn, không cần tìm nhiều nữa."', rating: '⭐⭐⭐⭐⭐' },
                            ].map(r => (
                                <div key={r.name} className="ck-review-mini">
                                    <div className="ck-review-mini-stars">{r.rating}</div>
                                    <div className="ck-review-mini-text">{r.text}</div>
                                    <div className="ck-review-mini-name">— {r.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showRefund && RefundModal}
        </div>
    )
}