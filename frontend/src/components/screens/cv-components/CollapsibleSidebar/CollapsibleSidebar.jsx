// import './CollapsibleSidebar.css'

// export default function CollapsibleSidebar({ 
//     isOpen, 
//     onToggle, 
//     activeTab, 
//     onTabChange, 
//     tabs,
//     children 
// }) {
//     // Default tabs nếu không truyền vào
//     const defaultTabs = [
//         { id: 'design', label: 'Thiết kế', icon: '🎨' },
//         { id: 'sections', label: 'Thêm mục', icon: '➕' },
//     ]
    
//     const sidebarTabs = tabs || defaultTabs

//     return (
//         <div className={`cv-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
//             {/* Toggle Button */}
//             <button 
//                 className="cv-sidebar-toggle"
//                 onClick={onToggle}
//                 title={isOpen ? "Thu gọn" : "Mở rộng"}
//             >
//                 {isOpen ? '◀' : '▶'}
//             </button>

//             {/* Tab Navigation */}
//             <div className="cv-sidebar-tabs">
//                 {sidebarTabs.map(tab => (
//                     <button
//                         key={tab.id}
//                         className={`cv-sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
//                         onClick={() => onTabChange(tab.id)}
//                         title={tab.label}
//                     >
//                         <span className="tab-icon">{tab.icon}</span>
//                         {isOpen && <span className="tab-label">{tab.label}</span>}
//                     </button>
//                 ))}
//             </div>

//             {/* Panel Content */}
//             {isOpen && (
//                 <div className="cv-sidebar-panel">
//                     {children}
//                 </div>
//             )}
//         </div>
//     )
// }




import './CollapsibleSidebar.css'

export default function CollapsibleSidebar({ isOpen, onToggle, activeTab, onTabChange, tabs, children }) {
    return (
        <aside className={`collapsible-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            {/* Tab bar */}
            <div className="sidebar-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`sidebar-tab ${activeTab === tab.id && isOpen ? 'active' : ''}`}
                        onClick={() => {
                            if (!isOpen) {
                                onToggle()
                                onTabChange(tab.id)
                            } else if (activeTab === tab.id) {
                                onToggle()
                            } else {
                                onTabChange(tab.id)
                            }
                        }}
                        title={tab.label}
                    >
                        <span className="sidebar-tab-icon">{tab.icon}</span>
                        {isOpen && <span className="sidebar-tab-label">{tab.label}</span>}
                    </button>
                ))}

                {/* Toggle arrow */}
                <button className="sidebar-toggle-btn" onClick={onToggle} title={isOpen ? 'Thu gọn' : 'Mở rộng'}>
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>

            {/* Content */}
            {isOpen && (
                <div className="sidebar-content">
                    {children}
                </div>
            )}
        </aside>
    )
}