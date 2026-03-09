import './Topbar.css'

function Topbar({ title, children }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      {children}
    </div>
  )
}

export default Topbar