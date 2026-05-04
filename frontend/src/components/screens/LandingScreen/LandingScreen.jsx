import './LandingScreen.css'
import Button from '../../common/Button/Button'
import { useNavigate } from "react-router-dom"

function LandingScreen() {
  const features = [
    {
      icon: '🔍',
      bg: '#FDE8E4',
      title: 'Tổng hợp đa nền tảng',
      desc: 'Thu thập việc làm từ các nền tảng tuyển dụng uy tín như TopCV, CareerViet, CareerLink và cập nhật liên tục.',
      target: 's1'
    },
    {
      icon: '🎯',
      bg: '#FEF0D0',
      title: 'Gợi ý việc phù hợp',
      desc: 'Phân tích CV và so sánh với yêu cầu công việc để đề xuất những vị trí phù hợp nhất.',
      target: 's1'
    },
    {
      icon: '🧠',
      bg: '#E0F0E6',
      title: 'AI học theo hành vi',
      desc: 'Dựa trên hành vi tìm kiếm, xem, lưu tin để cải thiện độ chính xác của gợi ý theo thời gian.',
      target: 's1'
    },
    {
      icon: '⚡',
      bg: '#D8EFF4',
      title: 'Ứng tuyển nhanh',
      desc: 'Chuyển đến trang tuyển dụng gốc chỉ với một lần nhấn để hoàn tất nộp hồ sơ.',
      target: 's1'
    },
    {
      icon: '📄',
      bg: '#E4E5F8',
      title: 'CV Builder AI',
      desc: 'Tải lên CV để chuyển đổi sang template mới, gợi ý chỉnh sửa nội dung và tối ưu theo vị trí ứng tuyển. Hỗ trợ dịch CV Anh–Việt, Việt–Anh và tự động đồng bộ thông tin vào hồ sơ cá nhân.',
      target: 's2'
    },
    {
      icon: '💬',
      bg: '#FFF4E5',
      title: 'Chatbot hỗ trợ tìm việc',
      desc: 'Trợ lý AI giúp bạn tìm kiếm việc làm, gợi ý vị trí phù hợp và hỗ trợ định hướng nghề nghiệp dựa trên CV của bạn.',
      target: 's3'
    }
  ]

  const navigate = useNavigate()
  const handleFeatureClick = (target) => {

    const map = {
      s1: "/jobs",
      s2: "/cv-templates",
      s3: "/login"
    }

    if (map[target]) {
      navigate(map[target])
    }
  }

  return (
    <div id="s1">
      <div className="landing">
        <div className="land-noise"></div>
        <div className="land-glow"></div>

        <nav className="land-nav">
          <div className="land-logo"><span>GZCONNECT</span></div>
          <div className="land-links">
            <Button
              variant="landing-outline"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
            <Button
              variant="rust"
              size="lg"
              onClick={() => navigate("/jobs")}
            >
              Bắt đầu miễn phí →
            </Button>
          </div>
        </nav>

        <div className="hero">
          <div className="hero-left">
            <h1 className="hero-title">
              Tìm việc <em>thông minh</em>,<br />kết nối <em>đúng cơ hội</em>
            </h1>
            <p className="hero-sub">Tổng hợp việc làm từ TopCV, CareerLink, CareerViet mỗi ngày...</p>
            <div className="hero-cta">
              <Button
                variant="rust"
                size="lg"
                onClick={() => navigate("/jobs")}
              >
                Bắt đầu tìm việc
              </Button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="hero-card-title">🌐 GZCONNECT là gì?</div>
              <p className="hc-intro-text">
                Nền tảng trung gian giúp bạn <strong>tìm kiếm, so sánh và theo dõi</strong> hàng chục nghìn tin tuyển dụng từ nhiều trang việc làm lớn — tất cả trong một nơi duy nhất.
              </p>
              <div className="hc-pillars">
                {[
                  { icon: '🔗', label: 'Tổng hợp từ nhiều nguồn', sub: 'TopCV · CareerLink · CareerViet' },
                  { icon: '🧠', label: 'AI chấm điểm phù hợp', sub: 'Lọc việc đúng với hồ sơ của bạn' },
                ].map((p, i) => (
                  <div key={i} className="hc-pillar">
                    <div className="hc-pillar-icon">{p.icon}</div>
                    <div>
                      <div className="hc-pillar-label">{p.label}</div>
                      <div className="hc-pillar-sub">{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hc-note">
                💡 GZCONNECT không tuyển dụng trực tiếp — chúng tôi giúp bạn <em>tìm đúng nơi</em> để ứng tuyển.
              </div>
            </div>
            <div className="hero-trust">
              <span>Tích hợp với</span>
              {['TopCV', 'CareerLink', 'CareerViet'].map(p => (
                <span key={p} className="hero-trust-badge">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="intro-section">
        <div className="intro-eyebrow">Cách hoạt động</div>
        <h2 className="intro-title">Ba bước để có việc làm mơ ước</h2>
        <p className="intro-sub">
          GZCONNECT tự động hoá toàn bộ hành trình tìm việc — từ tổng hợp tin đến theo dõi đơn ứng tuyển.
        </p>
        <div className="intro-steps">
          {[
            {
              num: '01',
              icon: '🧑‍💼',
              title: 'Tạo hồ sơ thông minh',
              desc: 'Điền thông tin một lần hoặc import thẳng từ CV có sẵn. AI sẽ tự học sở thích và kỹ năng của bạn để cá nhân hoá đề xuất.',
              color: '#527CE6',
            },
            {
              num: '02',
              icon: '🔎',
              title: 'Khám phá việc phù hợp',
              desc: 'Việc làm được tổng hợp từ các nền tảng như TopCV, CareerLink, CareerViet và gợi ý dựa trên hồ sơ, đặc trưng và thao tác của bạn tại nền tảng.',
              color: 'var(--amber2)',
            },
            {
              num: '03',
              icon: '🚀',
              title: 'Ứng tuyển',
              desc: 'Khi nhấn "Apply", bạn sẽ được chuyển đến trang tuyển dụng gốc để nộp hồ sơ. GZCONNECT không trực tiếp quản lý quá trình ứng tuyển.',
              color: 'var(--sage2)',
            },
          ].map((step, i) => (
            <div key={i} className="intro-step">
              <div className="intro-step-num" style={{ color: step.color }}>{step.num}</div>
              <div className="intro-step-icon">{step.icon}</div>
              <div className="intro-step-title">{step.title}</div>
              <div className="intro-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="intro-banner">
          <div className="intro-banner-left">
            <div className="intro-banner-title">Bắt đầu ngay hôm nay</div>
            <div className="intro-banner-sub">Tham gia cùng hàng nghìn ứng viên đang dùng GZCONNECT để tìm việc nhanh hơn, thông minh hơn.</div>
          </div>
          <button className="intro-banner-btn" onClick={() => navigate('/jobs')}>
            Tìm việc ngay →
          </button>
        </div>
      </div>

      <div className="feat-section">
        <div className="feat-head">
          <div className="sect-eye">Tính năng nổi bật</div>
          <h2 className="sect-title">Mọi thứ bạn cần<br />để có việc làm mơ ước</h2>
        </div>
        <div className="feat-grid">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="feat-card"
              onClick={() => handleFeatureClick(feat.target)}
              style={{ cursor: feat.target ? 'pointer' : 'default' }}
            >
              {feat.title === 'Chatbot hỗ trợ tìm việc' && (
                <button
                  className="btn-login-feature"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập để sử dụng
                </button>
              )}
              <div className="feat-ico" style={{ background: feat.bg }}>{feat.icon}</div>
              <div className="feat-title">{feat.title}</div>
              <div className="feat-desc">{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LandingScreen