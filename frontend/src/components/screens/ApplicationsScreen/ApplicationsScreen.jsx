import './ApplicationsScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import Topbar from '../../layout/Topbar/Topbar'
import Badge from '../../common/Badge/Badge'

function ApplicationsScreen({onNavigate}) {
  const stats = [
    { value: 14, label: 'Tổng đơn', color: 'var(--ink)' },
    { value: 3, label: 'Phỏng vấn', color: 'var(--amber)' },
    { value: 1, label: 'Offer nhận', color: 'var(--sage)' },
    { value: '64%', label: 'Tỷ lệ phản hồi', color: 'var(--rust)' }
  ]

  const columns = [
    {
      id: 'submitted',
      title: '📤 Đã nộp',
      count: 6,
      color: '',
      cards: [
        { 
          id: 1,
          logo: 'F', 
          color: 'l-fpt', 
          company: 'FPT Software', 
          job: 'Senior React Developer', 
          salary: '25-35tr', 
          location: 'HN', 
          date: '03/03/2026', 
          platform: 'TopCV', 
          auto: true 
        },
        { 
          id: 2,
          logo: 'S', 
          color: 'l-shopee', 
          company: 'Shopee VN', 
          job: 'Frontend Lead Engineer', 
          salary: '40-60tr', 
          type: 'Onsite', 
          date: '02/03/2026', 
          platform: 'CareerLink', 
          auto: true 
        },
        { 
          id: 3,
          logo: 'G', 
          color: 'l-grab', 
          company: 'Grab VN', 
          job: 'Software Engineer II', 
          salary: '35-50tr', 
          type: 'Hybrid', 
          date: '01/03/2026', 
          auto: false 
        }
      ]
    },
    {
      id: 'reviewing',
      title: '👀 Đang xem xét',
      count: 4,
      color: 'var(--teal)',
      cards: [
        { 
          id: 4,
          logo: 'V', 
          color: 'l-vng', 
          company: 'VNG Corp', 
          job: 'Full-stack Engineer', 
          salary: '30-45tr', 
          type: 'Remote', 
          date: '25/02/2026', 
          status: 'Đang xem CV' 
        },
        { 
          id: 5,
          logo: 'M', 
          color: 'l-momo', 
          company: 'MoMo', 
          job: 'Backend Developer', 
          salary: '20-30tr', 
          location: 'HCM', 
          date: '22/02/2026' 
        }
      ]
    },
    {
      id: 'interview',
      title: '🎤 Phỏng vấn',
      count: 3,
      color: 'var(--amber)',
      cards: [
        { 
          id: 6,
          logo: 'Ti', 
          color: 'l-tiki', 
          company: 'Tiki Corp', 
          job: 'React Native Developer', 
          salary: '22-32tr', 
          date: '06/03/2026', 
          time: '14:00' 
        },
        { 
          id: 7,
          logo: 'Z', 
          color: 'l-zalo', 
          company: 'Zalo', 
          job: 'Senior Frontend Dev', 
          salary: '30-40tr', 
          date: '08/03/2026', 
          time: '09:00' 
        }
      ]
    },
    {
      id: 'offer',
      title: '🏆 Offer / Kết quả',
      count: 1,
      color: 'var(--sage)',
      cards: [
        { 
          id: 8,
          logo: 'VP', 
          color: 'l-vnpay', 
          company: 'VNPay', 
          job: 'Frontend Tech Lead', 
          salary: '45-55 triệu/tháng', 
          offer: true 
        }
      ]
    }
  ]

  const getPlatformBadge = (platform) => {
    const badges = {
      'TopCV': 'sage',
      'CareerLink': 'rust',
      'CareerViet': 'teal'
    }
    return badges[platform] || 'gray'
  }

  return (
    <div id="s7">
      <div className="app-layout">
        <Sidebar activeItem="applications" onNavigate={onNavigate}/>
        
        <div className="main-content">
          <Topbar title="📋 Quản lý đơn ứng tuyển">
            <Badge variant="sage">14 đơn tháng này</Badge>
            <button className="btn btn-rust btn-sm">+ Thêm thủ công</button>
          </Topbar>

          <div className="app-body">
            {/* Stats */}
            <div className="app-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="card astat">
                  <div className="astat-n" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="astat-l">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Kanban Board */}
            <div className="kanban">
              {columns.map(col => (
                <div key={col.id} className="k-col">
                  <div className="k-head">
                    <div className="k-title" style={{ color: col.color || 'inherit' }}>{col.title}</div>
                    <div className="k-count">{col.count}</div>
                  </div>
                  
                  {col.cards.map(card => (
                    <div 
                      key={card.id} 
                      className="k-card" 
                      style={col.id === 'reviewing' ? { borderColor: 'rgba(30,107,122,.3)' } : 
                             col.id === 'interview' ? { borderColor: 'rgba(212,130,10,.3)' } :
                             col.id === 'offer' ? { borderColor: 'rgba(58,107,74,.4)', background: 'rgba(58,107,74,.04)' } : {}}
                    >
                      <div className="k-logo-row">
                        <div className={`k-logo ${card.color}`}>{card.logo}</div>
                        <span className="k-company">{card.company}</span>
                        {card.auto && (
                          <div className="auto-lbl">
                            <span>⚡</span> Auto
                          </div>
                        )}
                      </div>
                      
                      <div className="k-job">{card.job}</div>
                      
                      <div className="k-meta">
                        💰 {card.salary}
                        {card.location && ` • 📍 ${card.location}`}
                        {card.type && ` • ${card.type}`}
                      </div>

                      {card.status && (
                        <div className="k-status" style={{ color: 'var(--teal)', fontSize: '10px', fontWeight: 600, marginTop: '4px' }}>
                          ● {card.status}
                        </div>
                      )}

                      {card.time && (
                        <div className="k-time" style={{ color: 'var(--amber)', fontSize: '10px', fontWeight: 600, marginTop: '4px' }}>
                          📅 {card.date} {card.time}
                        </div>
                      )}

                      {card.offer && (
                        <div className="k-offer">
                          <Badge variant="sage" className="offer-badge">🎉 Đã nhận Offer!</Badge>
                          <div className="offer-actions">
                            <button className="btn btn-sage btn-sm accept-btn">✓ Chấp nhận</button>
                            <button className="btn btn-outline btn-sm">✗</button>
                          </div>
                        </div>
                      )}

                      <div className="k-foot">
                        <span>{card.date}</span>
                        {card.platform && (
                          <Badge variant={getPlatformBadge(card.platform)} className="platform-badge">{card.platform}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationsScreen   