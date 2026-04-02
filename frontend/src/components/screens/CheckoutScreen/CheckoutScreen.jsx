// src/components/screens/CheckoutScreen/CheckoutScreen.jsx
import { useState, useEffect } from 'react'
import './CheckoutScreen.css'

/* ── QR code SVG generator (tạo QR giả dạng đủ thuyết phục) ── */
function QRCodeSVG({ value, size = 180 }) {
    // Tạo pattern giả có vẻ như QR thật (không cần thư viện)
    const cells = 25
    const cell = size / cells

    // Seed từ value string để luôn nhất quán
    const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const rand = (i) => ((seed * (i + 1) * 2654435761) >>> 0) % 2 === 0

    const isFinderPattern = (r, c) => {
        const inCorner = (rr, cc, size) => rr >= 0 && rr < size && cc >= 0 && cc < size
        return (inCorner(r, c, 7) || inCorner(r, c - 18, 7) || inCorner(r - 18, c, 7))
    }

    const cells_arr = Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) => {
            if (isFinderPattern(r, c)) {
                const inOuter = (rr, cc, dr, dc) => rr >= dr && rr <= dr + 6 && cc >= dc && cc <= dc + 6
                if (inOuter(r, c, 0, 0) || inOuter(r, c, 0, 18) || inOuter(r, c, 18, 0)) {
                    const lr = r % 7 === 0 ? r : r - Math.floor(r / 7) * 7
                    const lc = c % 7 === 0 ? c : c - Math.floor(c / 7) * 7
                    const br = r >= 18 ? r - 18 : r
                    const bc = c >= 18 ? c - 18 : c
                    const rr = r < 7 ? r : r >= 18 ? r - 18 : r
                    const rc = c < 7 ? c : c >= 18 ? c - 18 : c
                    return (rr === 0 || rr === 6 || rc === 0 || rc === 6 || (rr >= 2 && rr <= 4 && rc >= 2 && rc <= 4))
                }
            }
            return rand(r * cells + c)
        })
    )

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            <rect width={size} height={size} fill="white" rx="4" />
            {cells_arr.map((row, r) => row.map((filled, c) =>
                filled ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1C1510" /> : null
            ))}
        </svg>
    )
}

const BANKS = [
    { id: 'vcb', name: 'Vietcombank', logo: 'VCB', color: '#008E44', accountNo: '1234567890' },
    { id: 'tcb', name: 'Techcombank', logo: 'TCB', color: '#E8192C', accountNo: '1234567891' },
    { id: 'acb', name: 'ACB', logo: 'ACB', color: '#1A5276', accountNo: '1234567892' },
    { id: 'mb', name: 'MB Bank', logo: 'MB', color: '#1F3C88', accountNo: '1234567893' },
    { id: 'momo', name: 'Ví MoMo', logo: 'MM', color: '#A50064', accountNo: '0901234567' },
    { id: 'zalopay', name: 'ZaloPay', logo: 'ZP', color: '#0068FF', accountNo: '0901234568' },
]

const PLANS_MAP = {
    free: { name: 'Free', price: 0, color: '#9A8D80' },
    pro: { name: 'Pro', price: 99000, color: '#C0412A' },
    elite: { name: 'Elite', price: 249000, color: '#D4820A' },
}

export default function CheckoutScreen({ planId = 'pro', billing = 'monthly', onBack, onSuccess }) {
    const plan = PLANS_MAP[planId] || PLANS_MAP.pro
    const price = billing === 'yearly' ? Math.round(plan.price * 10 * 0.8) : plan.price
    const [bank, setBank] = useState('vcb')
    const [step, setStep] = useState('select') // select | qr | confirm | done
    const [countdown, setCountdown] = useState(300) // 5 phút
    const [copied, setCopied] = useState(null)

    const selectedBank = BANKS.find(b => b.id === bank)
    const txCode = `GZC${Date.now().toString().slice(-8)}`
    const qrValue = `${selectedBank?.accountNo}|${price}|${txCode}|GZCONNECT ${plan.name}`
    const fmt = (n) => n.toLocaleString('vi') + 'đ'

    useEffect(() => {
        if (step !== 'qr') return
        if (countdown <= 0) return
        const t = setInterval(() => setCountdown(c => c - 1), 1000)
        return () => clearInterval(t)
    }, [step, countdown])

    const mmss = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`

    const copy = (text, key) => {
        navigator.clipboard?.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 1800)
    }

    return (
        <div className="ck-page">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="ck-header">
                <div className="ck-header-inner">
                    <button className="ck-back" onClick={onBack}>← Quay lại</button>
                    <div className="ck-header-title">Thanh toán</div>
                    <div className="ck-header-secure">🔒 SSL Bảo mật</div>
                </div>
            </div>

            <div className="ck-body">
                <div className="ck-layout">

                    {/* ── Left: payment form ──────────────────────── */}
                    <div className="ck-left">

                        {/* Order summary */}
                        <div className="ck-order-card">
                            <div className="ck-order-title">Đơn hàng của bạn</div>
                            <div className="ck-order-row">
                                <div className="ck-order-plan">
                                    <div className="ck-order-plan-icon" style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
                                        {planId === 'elite' ? '👑' : planId === 'pro' ? '⚡' : '🌱'}
                                    </div>
                                    <div>
                                        <div className="ck-order-plan-name">Gói {plan.name}</div>
                                        <div className="ck-order-plan-period">{billing === 'yearly' ? 'Thanh toán hàng năm' : 'Thanh toán hàng tháng'}</div>
                                    </div>
                                </div>
                                <div className="ck-order-price" style={{ color: plan.color }}>{fmt(price)}</div>
                            </div>
                            {billing === 'yearly' && plan.price > 0 && (
                                <div className="ck-order-saving">
                                    🎉 Bạn tiết kiệm <strong>{fmt(plan.price * 12 - price)}</strong> so với trả theo tháng
                                </div>
                            )}
                            <div className="ck-order-divider" />
                            <div className="ck-order-total">
                                <span>Tổng thanh toán</span>
                                <span className="ck-order-total-n">{fmt(price)}</span>
                            </div>
                            <div className="ck-order-vat">Đã bao gồm VAT 10%</div>
                        </div>

                        {/* Step 1: Select method */}
                        {step === 'select' && (
                            <div className="ck-method-card">
                                <div className="ck-method-title">Chọn phương thức thanh toán</div>
                                <div className="ck-method-grid">
                                    {BANKS.map(b => (
                                        <button key={b.id} className={`ck-bank-btn${bank === b.id ? ' selected' : ''}`} onClick={() => setBank(b.id)}>
                                            <div className="ck-bank-logo" style={{ background: b.color }}>{b.logo}</div>
                                            <span className="ck-bank-name">{b.name}</span>
                                            {bank === b.id && <span className="ck-bank-check">✓</span>}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="ck-proceed-btn"
                                    style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}
                                    onClick={() => { setStep('qr'); setCountdown(300) }}
                                >
                                    Tiếp tục → Xem mã QR thanh toán
                                </button>
                                <div className="ck-method-note">Quét mã QR bằng app ngân hàng hoặc ví điện tử</div>
                            </div>
                        )}

                        {/* Step 2: QR code */}
                        {step === 'qr' && (
                            <div className="ck-qr-card">
                                <div className="ck-qr-bank-row">
                                    <div className="ck-qr-bank-logo" style={{ background: selectedBank?.color }}>{selectedBank?.logo}</div>
                                    <div>
                                        <div className="ck-qr-bank-name">{selectedBank?.name}</div>
                                        <div className="ck-qr-bank-sub">Quét QR để thanh toán</div>
                                    </div>
                                    <div className={`ck-countdown${countdown < 60 ? ' urgent' : ''}`}>
                                        <div className="ck-countdown-n">{mmss}</div>
                                        <div className="ck-countdown-l">còn lại</div>
                                    </div>
                                </div>

                                {/* QR */}
                                <div className="ck-qr-wrap">
                                    <div className="ck-qr-container">
                                        <QRCodeSVG value={qrValue} size={200} />
                                        <div className="ck-qr-amount-overlay">
                                            <span>{fmt(price)}</span>
                                        </div>
                                    </div>
                                    <div className="ck-qr-hint">Mở app {selectedBank?.name} → Quét mã</div>
                                </div>

                                {/* Transfer info */}
                                <div className="ck-transfer-info">
                                    <div className="ck-ti-title">Thông tin chuyển khoản thủ công</div>
                                    {[
                                        ['Ngân hàng / Ví', selectedBank?.name, 'bank'],
                                        ['Số tài khoản', selectedBank?.accountNo, 'acc'],
                                        ['Số tiền', fmt(price), 'amount'],
                                        ['Nội dung CK', txCode, 'content'],
                                    ].map(([label, val, key]) => (
                                        <div key={key} className="ck-ti-row">
                                            <span className="ck-ti-label">{label}</span>
                                            <div className="ck-ti-val-wrap">
                                                <span className="ck-ti-val">{val}</span>
                                                <button className={`ck-copy-btn${copied === key ? ' copied' : ''}`} onClick={() => copy(val, key)}>
                                                    {copied === key ? '✓ Đã sao' : '⎘ Sao chép'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="ck-qr-actions">
                                    <button className="ck-back-method-btn" onClick={() => setStep('select')}>← Đổi phương thức</button>
                                    <button
                                        className="ck-done-btn"
                                        style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}
                                        onClick={() => setStep('done')}
                                    >
                                        Tôi đã thanh toán ✓
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Done */}
                        {step === 'done' && (
                            <div className="ck-done-card">
                                <div className="ck-done-ico">🎉</div>
                                <div className="ck-done-title">Cảm ơn bạn!</div>
                                <div className="ck-done-sub">
                                    Giao dịch của bạn đang được xử lý. Gói <strong>{plan.name}</strong> sẽ được kích hoạt trong vài phút.
                                    Biên lai sẽ gửi về email của bạn.
                                </div>
                                <div className="ck-done-tx">Mã giao dịch: <strong>{txCode}</strong></div>
                                <button className="ck-proceed-btn" style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }} onClick={onSuccess}>
                                    Về trang chủ →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Right: benefits ──────────────────────────── */}
                    <div className="ck-right">
                        <div className="ck-benefits-card">
                            <div className="ck-benefits-title">Bạn sẽ nhận được</div>
                            {(planId === 'elite' ? [
                                ['👑', 'Tất cả tính năng Pro', 'Không giới hạn từng tính năng'],
                                ['🤝', 'Tư vấn 1-1 với HR', '2 buổi tư vấn chuyên gia mỗi tháng'],
                                ['📄', 'Review CV thực tế', 'Chuyên gia HR đọc và góp ý CV của bạn'],
                                ['🎭', 'Mock Interview AI', 'Luyện phỏng vấn với AI thông minh'],
                                ['🛡️', 'Bảo đảm tìm việc', 'Hoàn tiền nếu không tìm được việc 60 ngày'],
                            ] : planId === 'pro' ? [
                                ['⚡', 'Auto Apply 1-click', 'Nộp đơn tự động tới 15+ nền tảng'],
                                ['🎯', 'AI Match nâng cao', 'Lý do tại sao việc này phù hợp với bạn'],
                                ['📄', '30+ Mẫu CV đẹp', 'Tạo CV chuyên nghiệp không giới hạn'],
                                ['🙈', 'Ẩn hồ sơ', 'Không hiển thị với công ty hiện tại'],
                                ['📊', 'Phân tích lương', 'Biết bạn đang được trả đúng không'],
                            ] : []).map(([ico, title, sub]) => (
                                <div key={title} className="ck-benefit-row">
                                    <div className="ck-benefit-ico" style={{ background: `${plan.color}18` }}>{ico}</div>
                                    <div>
                                        <div className="ck-benefit-title">{title}</div>
                                        <div className="ck-benefit-sub">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ck-guarantee-card">
                            <div className="ck-guarantee-ico">🔒</div>
                            <div className="ck-guarantee-title">Bảo đảm hoàn tiền 7 ngày</div>
                            <div className="ck-guarantee-sub">Nếu không hài lòng trong 7 ngày đầu, chúng tôi hoàn tiền 100% — không cần hỏi lý do.</div>
                        </div>

                        <div className="ck-reviews-mini">
                            <div className="ck-reviews-title">💬 Người dùng nói gì</div>
                            {[
                                { name: 'Minh K.', text: '"Tìm việc mới trong 3 tuần nhờ Auto Apply. Tiết kiệm cả tháng nộp tay!"', rating: '⭐⭐⭐⭐⭐' },
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
        </div>
    )
}