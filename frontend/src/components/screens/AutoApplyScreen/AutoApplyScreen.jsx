import './AutoApplyScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'

function AutoApplyScreen() {
  const steps = [
    {
      status: 'done',
      label: 'Chọn CV & Thư giới thiệu',
      desc: 'CV "Senior Developer 2026" đã chọn. AI đã tối ưu mô tả phù hợp JD của FPT.',
      hasCard: true
    },
    {
      status: 'done',
      label: 'Xác nhận thông tin',
      desc: 'Kiểm tra lần cuối trước khi nộp. Tất cả đã sẵn sàng.',
      hasCard: false
    },
    {
      status: 'active',
      label: 'Đang tự động nộp hồ sơ',
      desc: 'Hệ thống đang tự động đăng nhập và nộp CV đến các nền tảng...',
      hasCard: true,
      platforms: [
        { name: 'TopCV', code: 'T', color: '#00B14F', status: 'done', detail: '✓ Nộp thành công — #TC20260304' },
        { name: 'CareerLink', code: 'C', color: '#D0392A', status: 'active', detail: '⟳ Đang điền form...', progress: 65 },
        { name: 'VietnamWorks', code: 'V', color: '#1565C0', status: 'wait', detail: '⏳ Chờ...' }
      ]
    },
    {
      status: 'wait',
      label: 'Theo dõi phản hồi',
      desc: 'WorkAI sẽ tự động cập nhật trạng thái và thông báo khi có tin từ nhà tuyển dụng.',
      hasCard: false
    }
  ]

  return (
    <div id="s5" className="screen active">
      <div className="app-layout">
        <Sidebar activeItem="auto" />
        
        <div className="main-content">
          <div className="apply-wrap">
            <div className="flow-head">
              <div className="flow-subtitle">Đang nộp hồ sơ cho</div>
              <h1 className="flow-title">Senior React Developer</h1>
              <p className="flow-desc">tại FPT Software — Hệ thống đang tự động xử lý</p>
            </div>

            <div className="steps">
              {steps.map((step, idx) => (
                <div key={idx} className="step-row">
                  <div className="step-line">
                    <div className={`step-circ s-${step.status}`}>
                      {step.status === 'done' ? '✓' : step.status === 'active' ? '⟳' : idx + 1}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`step-conn conn-${step.status === 'done' ? 'done' : 'wait'}`}></div>
                    )}
                  </div>
                  <div className="step-body">
                    <div className={`step-label ${step.status === 'active' ? 'active' : step.status === 'wait' ? 'wait' : ''}`}>
                      {step.label}
                    </div>
                    <div className={`step-desc ${step.status === 'wait' ? 'wait' : ''}`}>{step.desc}</div>
                    
                    {step.hasCard && step.platforms && (
                      <div className="step-card">
                        {step.platforms.map((plat, pIdx) => (
                          <div key={pIdx} className="plat-anim-row">
                            <div className="plat-big" style={{ background: plat.color, color: '#FFF' }}>{plat.code}</div>
                            <div style={{ flex: 1 }}>
                              <div className="plat-name-big">{plat.name}</div>
                              <div className={`plat-detail ${plat.status}`}>{plat.detail}</div>
                              {plat.progress && (
                                <div className="mini-prog">
                                  <div className="mini-prog-fill" style={{ width: `${plat.progress}%` }}></div>
                                </div>
                              )}
                            </div>
                            {plat.status === 'done' && <span style={{ fontSize: '18px' }}>✅</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {step.hasCard && !step.platforms && (
                      <div className="step-card">
                        <div className="cv-preview-row">
                          <div className="cv-icon">📄</div>
                          <div className="cv-info">
                            <div className="cv-name">Senior_Developer_TranNgoc_2026.pdf</div>
                            <div className="cv-meta">Cập nhật: 2 ngày trước • 2 trang</div>
                          </div>
                          <span className="badge b-sage ats-badge">✓ ATS 94%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="card success-card">
              <div className="success-title">🤖 Bạn không cần làm gì thêm!</div>
              <div className="success-desc">
                NghềVN đang xử lý toàn bộ. Bạn sẽ nhận thông báo ngay khi có phản hồi từ FPT Software.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutoApplyScreen