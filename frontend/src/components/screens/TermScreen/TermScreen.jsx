import { useNavigate } from 'react-router-dom';
import './TermScreen.css';

const terms = [
    {
        icon: "👤", num: "01",
        title: "Điều kiện sử dụng dịch vụ",
        text: "Bằng cách truy cập và sử dụng GZCONNECT, bạn xác nhận rằng bạn đủ 18 tuổi trở lên, có đầy đủ năng lực pháp lý để giao kết hợp đồng, và đồng ý tuân thủ toàn bộ các điều khoản này. Tài khoản chỉ dành cho mục đích tìm kiếm việc làm cá nhân, không được sử dụng cho mục đích thương mại khi chưa được cấp phép.",
    },
    {
        icon: "🤖", num: "02",
        title: "Sử dụng tính năng AI",
        text: "Hệ thống AI của GZCONNECT phân tích hành vi và sở thích để gợi ý việc làm phù hợp. Gợi ý từ AI chỉ mang tính tham khảo, không phải cam kết tuyển dụng. Chúng tôi không chịu trách nhiệm về kết quả phỏng vấn hoặc tuyển dụng dựa trên gợi ý của AI.",
    },
    {
        icon: "📄", num: "03",
        title: "Quyền sở hữu nội dung",
        text: "CV, hồ sơ và tài liệu bạn tải lên thuộc quyền sở hữu của bạn. Bằng cách sử dụng dịch vụ, bạn cấp cho GZCONNECT quyền sử dụng có giới hạn để xử lý. Chúng tôi không sử dụng nội dung của bạn cho mục đích quảng cáo.",
    },
    {
        icon: "🔄", num: "04",
        title: "Chuyển hướng ứng tuyển",
        text: "Khi nhấn 'Apply', bạn sẽ được chuyển đến trang tuyển dụng gốc (TopCV, CareerLink, CareerViet...) để hoàn tất nộp hồ sơ. GZCONNECT không trực tiếp quản lý quá trình ứng tuyển và không đảm bảo kết quả từ các nền tảng bên thứ ba.",
    },
    {
        icon: "⚖️", num: "05",
        title: "Giới hạn trách nhiệm",
        text: "GZCONNECT là nền tảng kết nối trung gian, không phải bên tuyển dụng. Chúng tôi không chịu trách nhiệm về tính chính xác của tin tuyển dụng từ nhà tuyển dụng, kết quả tìm kiếm việc làm, hoặc mọi thiệt hại phát sinh từ việc sử dụng dịch vụ do nguyên nhân ngoài tầm kiểm soát.",
    },
    {
        icon: "📝", num: "06",
        title: "Thay đổi điều khoản",
        text: "Chúng tôi có quyền cập nhật Điều khoản sử dụng bất kỳ lúc nào. Khi có thay đổi quan trọng, chúng tôi sẽ thông báo qua email và hiển thị thông báo trên nền tảng ít nhất 7 ngày trước khi có hiệu lực. Tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận điều khoản mới.",
    },
];

export default function TermScreen() {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/jobs')
    }
    return (
        <div className="tp-root">

            {/* HERO */}
            <div className="tp-hero">
                <div className="land-noise" />
                <div className="land-glow" style={{ background: 'radial-gradient(ellipse, rgba(22, 9, 163, 0.14) 0%, transparent 70%)' }} />
                <div className="tp-hero-inner">
                    <h1 className="hero-title" style={{ fontSize: 48 }}>
                        Cam kết minh bạch,<br /><em>rõ ràng từng điều khoản</em>
                    </h1>
                    <p className="hero-sub">Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ của chúng tôi.</p>
                </div>
            </div>

            {/* WARNING BOX */}
            <div className="feat-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
                <div className="tp-warning">
                    <span className="tp-warning-icon">⚠️</span>
                    <p className="tp-warning-text">
                        Bằng cách tạo tài khoản hoặc sử dụng GZCONNECT, bạn{' '}
                        <strong>đồng ý với toàn bộ các điều khoản</strong>{' '}
                        được nêu trong tài liệu này. Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
                    </p>
                </div>
            </div>

            {/* TERMS LIST */}
            <div className="intro-section" style={{ paddingTop: 16, paddingBottom: 72 }}>
                <div className="tp-grid">
                    {terms.map((term) => (
                        <div key={term.num} className="tp-card">
                            <div className="tp-card-header">
                                <div className="tp-card-icon">{term.icon}</div>
                                <div>
                                    <div className="intro-step-num" style={{ color: 'var(--rust2)', marginBottom: 4 }}>{term.num}</div>
                                    <div className="intro-step-title">{term.title}</div>
                                </div>
                            </div>
                            <p className="tp-card-text">{term.text}</p>
                        </div>
                    ))}
                </div>

                {/* AGREE BANNER */}
                <div className="intro-banner" style={{ marginTop: 56 }}>
                    <div className="intro-banner-left">
                        <div className="intro-banner-title">Bắt đầu tìm việc ngay hôm nay</div>
                        <div className="intro-banner-sub">Việc sử dụng dịch vụ GZCONNECT đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với tất cả điều khoản trên.</div>
                    </div>
                    <button className="intro-banner-btn" onClick={handleClick} >Tìm việc ngay →</button>
                </div>
            </div>

        </div>
    );
}