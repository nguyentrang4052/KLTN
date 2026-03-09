import './JobCard.css'
import Badge from '../Badge/Badge'

function JobCard({ job, showMatch = true, showActions = true }) {
  const getLogoClass = (color) => {
    const classes = {
      'l-fpt': 'l-fpt',
      'l-vng': 'l-vng',
      'l-momo': 'l-momo',
      'l-tiki': 'l-tiki',
      'l-shopee': 'l-shopee',
      'l-grab': 'l-grab',
      'l-zalo': 'l-zalo',
      'l-vnpay': 'l-vnpay'
    }
    return classes[color] || ''
  }

  const getPlatformBadge = (platform) => {
    const badges = {
      'TopCV': 'b-sage',
      'CareerViet': 'b-rust',
      'CareerLink': 'b-teal'
    }
    return badges[platform] || 'b-gray'
  }

  return (
    <div className="card jcard">
      <div className="jcard-top">
        <div className={`co-logo ${getLogoClass(job.color)}`}>{job.logo}</div>
        <div className="jcard-info">
          <div className="jcard-title">{job.title}</div>
          <div className="jcard-co">{job.company} • {job.location} • {job.type}</div>
          <div className="jcard-tags">
            {job.tags.map((tag, idx) => (
              <span key={idx} className="jtag">{tag}</span>
            ))}
            <Badge variant={getPlatformBadge(job.platform)} className="platform-badge">{job.platform}</Badge>
          </div>
        </div>
        {showMatch && (
          <div className="jcard-match">
            <div className="match-n" style={{ color: job.match > 90 ? 'var(--sage)' : job.match > 80 ? 'var(--amber)' : 'var(--rust)' }}>
              {job.match}%
            </div>
            <div className="match-l">phù hợp</div>
          </div>
        )}
      </div>
      <div className="jcard-foot">
        <span className="salary">💰 {job.salary}</span>
        {showActions && (
          <div className="jcard-actions">
            <button className="btn btn-outline btn-sm">🔖 Lưu</button>
            <button className="btn btn-rust btn-sm">⚡ Apply</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCard