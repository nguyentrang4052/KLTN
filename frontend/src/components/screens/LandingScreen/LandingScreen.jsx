import './LandingScreen.css'
import Button from '../../common/Button/Button'
import { useNavigate } from "react-router-dom"

function LandingScreen() {
  const features = [
    {
      icon: '🔍',
      bg: '#FDE8E4',
      title: 'Tổng hợp đa nền tảng',
      desc: 'Tự động thu thập việc làm từ các nguồn lớn nhất. Cập nhật realtime, không bỏ sót cơ hội nào.',
      target: 's2'
    },
    {
      icon: '🧠',
      bg: '#FEF0D0',
      title: 'AI học theo hành vi',
      desc: 'Phân tích click, lưu tin, apply để hiểu sở thích của bạn và đề xuất ngày càng chính xác hơn.',
      target: 's2'
    },
    {
      icon: '⚡',
      bg: '#E0F0E6',
      title: 'Ứng tuyển nhanh',
      desc: 'Xem việc từ nhiều nền tảng và ứng tuyển trực tiếp trên trang gốc chỉ với một lần nhấn.',
      target: 's5'
    },
    {
      icon: '📄',
      bg: '#D8EFF4',
      title: 'CV Builder thông minh',
      desc: 'Tạo CV chuyên nghiệp, AI tối ưu nội dung và từ khoá ATS theo từng vị trí ứng tuyển.',
      target: 's6'
    },
    {
      icon: '🎯',
      bg: '#E4E5F8',
      title: 'Match Score AI',
      desc: 'Mỗi tin được chấm điểm phù hợp với hồ sơ bạn. Biết ngay cơ hội trúng tuyển trước khi apply.',
      target: 's2'
    },
    {
      icon: '📊',
      bg: '#FDE8E4',
      title: 'Kanban theo dõi',
      desc: 'Bảng Kanban quản lý toàn bộ đơn ứng tuyển. Từ nộp hồ sơ đến nhận Offer — mọi thứ trong tầm tay.',
      target: 's7'
    }
  ]

  const jobs = [
    { logo: 'F', color: 'l-fpt', title: 'Senior React Dev', company: 'FPT Software', salary: '25-35tr', match: 94, matchColor: '#4E8E62' },
    { logo: 'V', color: 'l-vng', title: 'Full-stack Engineer', company: 'VNG Corp', salary: '30-45tr', match: 89, matchColor: '#4E8E62' },
    { logo: 'S', color: 'l-shopee', title: 'Frontend Lead', company: 'Shopee VN', salary: '40-60tr', match: 81, matchColor: '#D4820A' }
  ]

  const navigate = useNavigate()
  
  // const handleFeatureClick = (target) => {
  //   if (target && onNavigate) {
  //     onNavigate(target)
  //   }
  // }

  const handleFeatureClick = (target) => {

  const map = {
    s2: "/dashboard",
    s4: "/job/1",
    s6: "/cv-builder",
    s7: "/applications"
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
            {/* <div className="hero-eyebrow">✦ Nền tảng tìm việc AI đầu tiên tại Việt Nam</div> */}
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
              {/* <Button
                variant="landing-outline2"
                size="lg"
                icon="▷"
              >
                Xem demo
              </Button> */}
            </div>
            <div className="hero-stats">
              <div className="h-stat"><div className="h-stat-n">50K+</div><div className="h-stat-l">Việc làm mỗi ngày</div></div>
              <div className="h-stat"><div className="h-stat-n">15+</div><div className="h-stat-l">Nền tảng tích hợp</div></div>
              <div className="h-stat"><div className="h-stat-n">92%</div><div className="h-stat-l">Độ chính xác AI</div></div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="hero-card-title">🤖 AI đề xuất cho bạn hôm nay</div>
              <div className="hero-job-preview">
                {jobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="hjp"
                    onClick={() => navigate("/job/:id")}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`hjp-logo ${job.color}`}>{job.logo}</div>
                    <div className="hjp-info">
                      <div className="hjp-title">{job.title}</div>
                      <div className="hjp-co">{job.company} • {job.salary}</div>
                    </div>
                    <div className="hjp-match" style={{ color: job.matchColor }}>{job.match}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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