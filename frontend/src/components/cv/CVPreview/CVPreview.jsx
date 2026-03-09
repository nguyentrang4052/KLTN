import './CVPreview.css'

function CVPreview() {
  const skills = [
    { name: 'React.js', width: 95, color: 'f-sage' },
    { name: 'TypeScript', width: 90, color: 'f-sage' },
    { name: 'Node.js', width: 78, color: 'f-amber' },
    { name: 'Python', width: 65, color: 'f-amber' },
    { name: 'PostgreSQL', width: 60, color: 'f-rust' },
    { name: 'Docker', width: 45, color: 'f-rust' },
    { name: 'Figma', width: 70, color: 'f-amber' }
  ]

  const projects = [
    {
      title: 'E-Commerce Microservices',
      links: ['github', 'demo'],
      desc: 'Nền tảng TMĐT xử lý 10,000+ đơn/ngày, tích hợp VNPay & MOMO payment.',
      tech: ['React', 'Node.js', 'Docker', 'AWS']
    },
    {
      title: 'AI Job Matching App',
      links: ['portfolio'],
      desc: 'App tìm việc AI gợi ý, 2000+ user tháng đầu.',
      tech: ['React Native', 'Python', 'TensorFlow']
    }
  ]

  return (
    <div className="cvb-preview">
      <div className="cv-paper">
        {/* Header */}
        <div className="cvp-header">
          <div className="cvp-name">TRẦN VĂN NGỌC</div>
          <div className="cvp-role">Senior Frontend Developer</div>
          <div className="cvp-contacts">
            <div className="cvp-contact-item">✉ ngoc.tran@gmail.com</div>
            <div className="cvp-contact-item">📱 0912 345 678</div>
            <div className="cvp-contact-item">📍 TP. Hồ Chí Minh</div>
            <div className="cvp-contact-item">🔗 github.com/ngoctran-dev</div>
            <div className="cvp-contact-item">💼 linkedin.com/in/ngoctran</div>
          </div>
        </div>

        {/* Body */}
        <div className="cvp-body">
          {/* Left Column */}
          <div className="cvp-left">
            <div className="cvp-section">
              <div className="cvp-sec-title rust">KỸ NĂNG</div>
              {skills.map((skill, idx) => (
                <div key={idx} className="cvp-skill-item">
                  <span className="cvp-skill-name">{skill.name}</span>
                  <div className="cvp-skill-bar-bg">
                    <div className={`cvp-skill-bar-fill ${skill.color}`} style={{ width: `${skill.width}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cvp-section">
              <div className="cvp-sec-title rust">NGÔN NGỮ</div>
              <div className="cvp-lang-item">
                <span className="cvp-lang-name">Tiếng Việt</span>
                <span className="cvp-lang-lvl">Bản ngữ</span>
              </div>
              <div className="cvp-lang-item">
                <span className="cvp-lang-name">Tiếng Anh</span>
                <span className="cvp-lang-lvl">IELTS 7.0</span>
              </div>
              <div className="cvp-lang-item">
                <span className="cvp-lang-name">Tiếng Nhật</span>
                <span className="cvp-lang-lvl">N4</span>
              </div>
            </div>

            <div className="cvp-section">
              <div className="cvp-sec-title rust">HỌC VẤN</div>
              <div className="cvp-edu">
                <div className="cvp-edu-school">ĐH Bách Khoa TP.HCM</div>
                <div className="cvp-edu-major">Kỹ sư Công nghệ thông tin</div>
                <div className="cvp-edu-year">2017 – 2021 • GPA 3.4/4.0</div>
              </div>
            </div>

            <div className="cvp-section">
              <div className="cvp-sec-title rust">CHỨNG CHỈ</div>
              <div className="cvp-award">
                <div className="cvp-award-dot"></div>
                <div className="cvp-award-text">AWS Developer Associate (2024)</div>
              </div>
              <div className="cvp-award">
                <div className="cvp-award-dot"></div>
                <div className="cvp-award-text">Meta Frontend Developer (2022)</div>
              </div>
              <div className="cvp-award">
                <div className="cvp-award-dot"></div>
                <div className="cvp-award-text">Top 5 VNG Hackathon 2023</div>
              </div>
            </div>

            <div className="cvp-section">
              <div className="cvp-sec-title rust">THAM CHIẾU</div>
              <div className="cvp-ref-item">
                <div className="cvp-ref-name">Nguyễn Văn Minh</div>
                <div className="cvp-ref-pos">Engineering Manager</div>
                <div className="cvp-ref-co">VNG Corporation</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="cvp-right">
            <div className="cvp-section">
              <div className="cvp-sec-title ink">MỤC TIÊU</div>
              <p className="cvp-summary">
                Senior Frontend Developer với 4+ năm kinh nghiệm xây dựng ứng dụng React hiệu suất cao. 
                Đã dẫn dắt team 5–8 người và deliver nhiều dự án Fintech/E-commerce thành công. 
                Tìm kiếm cơ hội phát triển vai trò Tech Lead.
              </p>
            </div>

            <div className="cvp-section">
              <div className="cvp-sec-title ink">KINH NGHIỆM</div>
              <div className="cvp-exp">
                <div className="cvp-exp-title">Senior Frontend Developer</div>
                <div className="cvp-exp-co">VNG Corporation</div>
                <div className="cvp-exp-date">01/2023 – Hiện tại • TP.HCM • Hybrid</div>
                <div className="cvp-exp-desc">
                  • Phát triển module Zalo Business với 500K+ DAU (React + TypeScript)<br/>
                  • Tối ưu LCP từ 4.2s → 1.8s, tăng Core Web Vitals 40%<br/>
                  • Lead team 6 FE devs, thiết lập code review & CI/CD<br/>
                  • Xây dựng design system 80+ component
                </div>
              </div>
              <div className="cvp-exp">
                <div className="cvp-exp-title">Frontend Developer</div>
                <div className="cvp-exp-co">FPT Software</div>
                <div className="cvp-exp-date">06/2021 – 12/2022 • Hà Nội</div>
                <div className="cvp-exp-desc">
                  • Xây dựng dashboard cho khách hàng Nhật (React + TypeScript)<br/>
                  • Tích hợp REST API & WebSocket real-time<br/>
                  • Unit test với Jest, đạt coverage 85%
                </div>
              </div>
            </div>

            <div className="cvp-section">
              <div className="cvp-sec-title ink">DỰ ÁN NỔI BẬT</div>
              {projects.map((proj, idx) => (
                <div key={idx} className="cvp-proj">
                  <div className="cvp-proj-title">
                    {proj.title}
                    {proj.links.map(link => (
                      <span key={link} className="cvp-proj-link">{link}</span>
                    ))}
                  </div>
                  <div className="cvp-proj-desc">{proj.desc}</div>
                  <div className="cvp-proj-tech">
                    {proj.tech.map(t => (
                      <span key={t} className="cvp-tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CVPreview