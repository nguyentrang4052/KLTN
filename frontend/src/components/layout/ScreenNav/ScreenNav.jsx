import './ScreenNav.css'

function ScreenNav({ activeScreen, onScreenChange }) {
  const screens = [
    { id: 's1', label: '① Landing' },
    { id: 's2', label: '② Dashboard' },
    { id: 's3', label: '③ Tìm việc' },
    { id: 's4', label: '④ Chi tiết JD' },
    { id: 's5', label: '⑤ Auto Apply' },
    { id: 's6', label: '⑥ CV Builder ★' },
    { id: 's7', label: '⑦ Kanban Apply' },
    { id: 's8', label: '⑧ Hồ sơ AI' },
    { id: 's9', label: '⑨ Thông báo' }
  ]

  return (
    <nav className="screen-nav">
      <span className="nav-logo">Nghề<span>VN</span></span>
      {screens.map(screen => (
        <button
          key={screen.id}
          className={`screen-btn ${activeScreen === screen.id ? 'active' : ''}`}
          onClick={() => onScreenChange(screen.id)}
        >
          {screen.label}
        </button>
      ))}
    </nav>
  )
}

export default ScreenNav