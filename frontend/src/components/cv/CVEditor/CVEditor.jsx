import './CVEditor.css'

function CVEditor() {
  const skills = [
    { name: 'React.js / React Native', level: 4, label: 'Chuyên gia', color: 'great' },
    { name: 'TypeScript', level: 3, label: 'Thành thạo', color: 'great' },
    { name: 'Node.js / Express', level: 3, label: 'Thành thạo', color: 'good' },
    { name: 'Python / Django', level: 2, label: 'Trung bình', color: 'good' },
    { name: 'PostgreSQL / MongoDB', level: 2, label: 'Trung bình', color: 'good' },
    { name: 'Docker / CI-CD', level: 1, label: 'Cơ bản', color: 'basic' },
    { name: 'Figma / UI Design', level: 2, label: 'Trung bình', color: 'good' }
  ]

  const languages = [
    { name: 'Tiếng Anh', level: 'Giao tiếp tốt (B2)', cert: 'IELTS 7.0', badge: 'sage' },
    { name: 'Tiếng Việt', level: 'Bản ngữ', cert: 'Bản ngữ', badge: 'teal' },
    { name: 'Tiếng Nhật', level: 'Cơ bản (N4)', cert: 'N4', badge: 'amber' }
  ]

  return (
    <div className="cvb-editor">
      {/* Thông tin cá nhân */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>👤 Thông tin cá nhân</span>
          <button className="btn btn-outline btn-sm">↑↓ Sắp xếp</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <div className="form-label">Họ và tên *</div>
            <input className="inp" defaultValue="Trần Văn Ngọc" />
          </div>
          <div className="form-group">
            <div className="form-label">Vị trí ứng tuyển *</div>
            <input className="inp" defaultValue="Senior Frontend Developer" />
          </div>
          <div className="form-group">
            <div className="form-label">Email *</div>
            <input className="inp" defaultValue="ngoc.tran@gmail.com" />
          </div>
          <div className="form-group">
            <div className="form-label">Số điện thoại</div>
            <input className="inp" defaultValue="0912 345 678" />
          </div>
          <div className="form-group">
            <div className="form-label">LinkedIn URL</div>
            <input className="inp" defaultValue="linkedin.com/in/ngoctran-dev" />
          </div>
          <div className="form-group">
            <div className="form-label">GitHub / Portfolio</div>
            <input className="inp" defaultValue="github.com/ngoctran-dev" />
          </div>
          <div className="form-group">
            <div className="form-label">Địa chỉ</div>
            <input className="inp" defaultValue="Quận Bình Thạnh, TP.HCM" />
          </div>
          <div className="form-group">
            <div className="form-label">Website cá nhân</div>
            <input className="inp" placeholder="https://portfolio.com/ban" />
          </div>
          <div className="form-group full">
            <div className="form-label">Ngày sinh</div>
            <input className="inp" defaultValue="15/03/1995" style={{ maxWidth: '160px' }} />
          </div>
        </div>
      </div>

      {/* Mục tiêu */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>📝 Mục tiêu nghề nghiệp</span>
          <button className="btn btn-amber btn-sm">🤖 AI viết</button>
        </div>
        <div className="form-group">
          <textarea className="inp" rows="4" defaultValue="Senior Frontend Developer với 4+ năm kinh nghiệm xây dựng ứng dụng React hiệu suất cao. Đã dẫn dắt team 5–8 người và deliver thành công nhiều dự án lớn tại các công ty Fintech và E-commerce. Tìm kiếm cơ hội phát triển vai trò Tech Lead tại môi trường năng động."></textarea>
          <div className="form-tip">💡 Tip: 3–5 câu, đề cập kỹ năng chính, mục tiêu cụ thể, giá trị mang lại</div>
        </div>
      </div>

      {/* Kinh nghiệm */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>💼 Kinh nghiệm làm việc</span>
          <button className="btn btn-rust btn-sm">+ Thêm</button>
        </div>
        
        <div className="exp-entry">
          <div className="exp-entry-head">
            <div>
              <div className="exp-entry-title">Senior Frontend Developer — VNG Corporation</div>
              <div className="exp-entry-sub">01/2023 — Hiện tại • TP.HCM</div>
            </div>
            <div className="exp-actions">
              <button className="btn btn-amber btn-sm">🤖 AI cải thiện</button>
              <button className="btn btn-outline btn-sm">✏️</button>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <div className="form-label">Tên công ty *</div>
              <input className="inp" defaultValue="VNG Corporation" />
            </div>
            <div className="form-group">
              <div className="form-label">Chức danh *</div>
              <input className="inp" defaultValue="Senior Frontend Developer" />
            </div>
            <div className="form-group">
              <div className="form-label">Từ tháng/năm</div>
              <input className="inp" defaultValue="01/2023" />
            </div>
            <div className="form-group">
              <div className="form-label">Đến tháng/năm</div>
              <input className="inp" placeholder="Hiện tại" />
            </div>
            <div className="form-group">
              <div className="form-label">Địa điểm</div>
              <input className="inp" defaultValue="TP. Hồ Chí Minh" />
            </div>
            <div className="form-group">
              <div className="form-label">Hình thức</div>
              <select className="inp">
                <option>Onsite</option>
                <option selected>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
            <div className="form-group full">
              <div className="form-label">Mô tả công việc & Thành tích *</div>
              <textarea className="inp" rows="4" defaultValue={`• Phát triển module quản lý người dùng Zalo Business với 500K+ DAU, sử dụng React + TypeScript
• Tối ưu hiệu suất: giảm LCP từ 4.2s xuống 1.8s, tăng Core Web Vitals 40%
• Lead team 6 Frontend developers, thiết lập quy trình code review và CI/CD
• Xây dựng design system với 80+ component dùng chung toàn hệ thống`}></textarea>
            </div>
            <div className="form-group full">
              <div className="form-label">Công nghệ sử dụng</div>
              <input className="inp" defaultValue="React.js, TypeScript, Redux Toolkit, GraphQL, Jest, Webpack, AWS S3" />
            </div>
          </div>
        </div>

        <div className="exp-entry">
          <div className="exp-entry-head">
            <div>
              <div className="exp-entry-title">Frontend Developer — FPT Software</div>
              <div className="exp-entry-sub">06/2021 — 12/2022 • Hà Nội</div>
            </div>
            <div className="exp-actions">
              <button className="btn btn-amber btn-sm">🤖 AI</button>
              <button className="btn btn-outline btn-sm">✏️</button>
              <button className="btn btn-outline btn-sm delete-btn">🗑</button>
            </div>
          </div>
          <div className="exp-desc-preview">
            • Xây dựng dashboard quản lý khách hàng Nhật Bản (React + TypeScript)<br/>
            • Tích hợp RESTful API và WebSocket real-time cho hệ thống monitoring<br/>
            • Viết unit test với Jest, đạt coverage 85%
          </div>
        </div>

        <div className="add-row">+ Thêm kinh nghiệm</div>
      </div>

      {/* Học vấn */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>🎓 Học vấn</span>
          <button className="btn btn-rust btn-sm">+ Thêm</button>
        </div>
        <div className="exp-entry">
          <div className="form-grid">
            <div className="form-group">
              <div className="form-label">Trường / Học viện *</div>
              <input className="inp" defaultValue="ĐH Bách Khoa TP.HCM" />
            </div>
            <div className="form-group">
              <div className="form-label">Bằng cấp / Chuyên ngành</div>
              <input className="inp" defaultValue="Kỹ sư CNTT" />
            </div>
            <div className="form-group">
              <div className="form-label">Năm tốt nghiệp</div>
              <input className="inp" defaultValue="2021" />
            </div>
            <div className="form-group">
              <div className="form-label">GPA / Xếp loại</div>
              <input className="inp" defaultValue="3.4/4.0 — Giỏi" />
            </div>
            <div className="form-group full">
              <div className="form-label">Hoạt động / Thành tích tại trường</div>
              <input className="inp" defaultValue="Phó chủ nhiệm CLB Lập trình BKU-IT, Top 5 ACM ICPC khu vực phía Nam 2020" />
            </div>
          </div>
        </div>
        <div className="add-row">+ Thêm học vấn</div>
      </div>

      {/* Kỹ năng */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>⚡ Kỹ năng chuyên môn</span>
          <button className="btn btn-rust btn-sm">+ Thêm kỹ năng</button>
        </div>
        <div className="skill-tip">Nhấn vào các chấm để chọn mức độ thành thạo: 1=Cơ bản | 2=Trung bình | 3=Thành thạo | 4=Chuyên gia</div>
        
        {skills.map((skill, idx) => (
          <div key={idx} className="skill-level-row">
            <input className="inp skill-name-inp" defaultValue={skill.name} />
            <div className="skill-level-dots">
              {[1, 2, 3, 4].map(dot => (
                <div key={dot} className={`sdot ${dot <= skill.level ? 'f' : 'empty'} ${skill.color}`}></div>
              ))}
            </div>
            <span className={`skill-label ${skill.color}`}>{skill.label}</span>
            <button className="btn btn-outline btn-sm">🗑</button>
          </div>
        ))}
        
        <div className="add-row mt10">+ Thêm kỹ năng</div>
      </div>

      {/* Ngôn ngữ */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>🌐 Ngôn ngữ</span>
          <button className="btn btn-rust btn-sm">+ Thêm</button>
        </div>
        
        {languages.map((lang, idx) => (
          <div key={idx} className="lang-row">
            <input className="inp" defaultValue={lang.name} style={{ maxWidth: '160px' }} />
            <select className="inp" style={{ maxWidth: '160px' }}>
              <option selected>{lang.level}</option>
            </select>
            <span className={`badge b-${lang.badge}`}>{lang.cert}</span>
            <button className="btn btn-outline btn-sm">🗑</button>
          </div>
        ))}
      </div>

      {/* Dự án */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>🚀 Dự án nổi bật</span>
          <button className="btn btn-rust btn-sm">+ Thêm dự án</button>
        </div>
        
        <div className="proj-row">
          <div className="proj-title-row">
            <span className="proj-name">E-Commerce Platform (Microservices)</span>
            <span className="link-chip">🔗 github.com/...</span>
            <span className="link-chip">🌐 Live demo</span>
          </div>
          <div className="proj-desc">
            Nền tảng thương mại điện tử với kiến trúc microservices, xử lý 10,000+ đơn hàng/ngày. Tích hợp payment gateway VNPay, MOMO.
          </div>
          <div className="proj-tech">
            <span className="tech-tag">React</span>
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">PostgreSQL</span>
            <span className="tech-tag">Docker</span>
            <span className="tech-tag">AWS</span>
          </div>
        </div>

        <div className="proj-row">
          <div className="proj-title-row">
            <span className="proj-name">AI Job Matching App</span>
            <span className="link-chip">🔗 Portfolio</span>
          </div>
          <div className="proj-desc">
            Ứng dụng tìm việc tích hợp AI gợi ý công việc phù hợp theo kỹ năng người dùng. 2000+ user trong tháng đầu.
          </div>
          <div className="proj-tech">
            <span className="tech-tag">React Native</span>
            <span className="tech-tag">Python</span>
            <span className="tech-tag">TensorFlow</span>
            <span className="tech-tag">FastAPI</span>
          </div>
        </div>
        
        <div className="add-row">+ Thêm dự án</div>
      </div>

      {/* Chứng chỉ */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>🏆 Giải thưởng & Chứng chỉ</span>
          <button className="btn btn-rust btn-sm">+ Thêm</button>
        </div>
        
        <div className="award-row">
          <div className="award-icon">🏅</div>
          <div className="award-info">
            <div className="award-name">AWS Certified Developer – Associate</div>
            <div className="award-org">Amazon Web Services • 2024 • Hết hạn: 2027</div>
          </div>
          <button className="btn btn-outline btn-sm">🗑</button>
        </div>
        
        <div className="award-row">
          <div className="award-icon">🎖</div>
          <div className="award-info">
            <div className="award-name">Top 5 Hackathon VNG Innovation 2023</div>
            <div className="award-org">VNG Corporation • 2023</div>
          </div>
          <button className="btn btn-outline btn-sm">🗑</button>
        </div>
        
        <div className="award-row">
          <div className="award-icon">📜</div>
          <div className="award-info">
            <div className="award-name">Meta Frontend Developer Certificate</div>
            <div className="award-org">Coursera / Meta • 2022</div>
          </div>
          <button className="btn btn-outline btn-sm">🗑</button>
        </div>
        
        <div className="add-row mt10">+ Thêm chứng chỉ / giải thưởng</div>
      </div>

      {/* Người tham chiếu */}
      <div className="cvb-ed-section">
        <div className="cvb-ed-title">
          <span>🤝 Người tham chiếu</span>
          <button className="btn btn-rust btn-sm">+ Thêm</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <div className="form-label">Họ và tên</div>
            <input className="inp" defaultValue="Nguyễn Văn Minh" />
          </div>
          <div className="form-group">
            <div className="form-label">Chức vụ</div>
            <input className="inp" defaultValue="Engineering Manager" />
          </div>
          <div className="form-group">
            <div className="form-label">Công ty</div>
            <input className="inp" defaultValue="VNG Corporation" />
          </div>
          <div className="form-group">
            <div className="form-label">Email liên hệ</div>
            <input className="inp" defaultValue="minh.nguyen@vng.com.vn" />
          </div>
        </div>
        <div className="ref-checkbox">
          <label>
            <input type="checkbox" defaultChecked /> Hiển thị "Cung cấp khi được yêu cầu" thay vì thông tin chi tiết
          </label>
        </div>
      </div>
    </div>
  )
}

export default CVEditor