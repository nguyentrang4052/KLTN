import './Topbar.css'

function Topbar({ title, children }) {
  return (
    <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <div className="topbar-title">{title}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  )
}

export default Topbar