// import './DesignPanel.css'

// export default function DesignPanel({ 
//     fontFamily, 
//     setFontFamily, 
//     themeColor, 
//     setThemeColor 
// }) {
//     const fonts = [
//         { value: 'Arial', label: 'Arial' },
//         { value: 'Roboto', label: 'Roboto' },
//         { value: 'Times New Roman', label: 'Times New Roman' },
//         { value: 'Georgia', label: 'Georgia' },
//         { value: 'Helvetica', label: 'Helvetica' },
//         { value: 'Calibri', label: 'Calibri' },
//         { value: 'Open Sans', label: 'Open Sans' },
//         { value: 'Lato', label: 'Lato' },
//         { value: 'Montserrat', label: 'Montserrat' },
//         { value: 'Poppins', label: 'Poppins' },
//     ]

//     const colors = [
//         '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
//         '#3b82f6', '#06b6d4', '#10b981', '#f59e0b',
//         '#ef4444', '#ec4899', '#14b8a6', '#f97316',
//         '#C0412A', '#0D47A1', '#212121', '#6B7280'
//     ]

//     return (
//         <div className="design-panel">
//             <h3 className="panel-title">Thiết kế & Font</h3>

//             <div className="design-section">
//                 <label className="design-label">Font chữ</label>
//                 <select 
//                     className="design-select"
//                     value={fontFamily}
//                     onChange={(e) => setFontFamily(e.target.value)}
//                 >
//                     {fonts.map(font => (
//                         <option key={font.value} value={font.value}>
//                             {font.label}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="design-section">
//                 <label className="design-label">Màu chủ đề</label>
//                 <div className="color-grid">
//                     {colors.map(color => (
//                         <button
//                             key={color}
//                             className={`color-btn ${themeColor === color ? 'active' : ''}`}
//                             style={{ backgroundColor: color }}
//                             onClick={() => setThemeColor(color)}
//                             title={color}
//                         />
//                     ))}
//                 </div>
//             </div>

//             <div className="design-section">
//                 <label className="design-label">Màu đã chọn</label>
//                 <div className="selected-color">
//                     <div 
//                         className="color-preview" 
//                         style={{ backgroundColor: themeColor }}
//                     />
//                     <span className="color-value">{themeColor}</span>
//                 </div>
//             </div>
//         </div>
//     )
// }




import { useState } from 'react'
import './DesignPanel.css'

const FONT_OPTIONS = [
    { value: 'Be Vietnam Pro', label: 'Be Vietnam Pro' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Segoe UI', label: 'Segoe UI' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
]

const COLOR_PRESETS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#64748b', '#475569', '#334155', '#1e293b',
    '#4a044a', '#701a75', '#86198f', '#9d174d', '#be123c',
    '#9f1239', '#7f1d1d', '#92400e', '#a16207', '#ca8a04',
]

export default function DesignPanel({
    fontFamily, setFontFamily,
    themeColor, setThemeColor,
    bgColor, setBgColor,
    sidebarBg, setSidebarBg,
    lineHeight, setLineHeight,
    fontSize, setFontSize,
    textStyle, setTextStyle,
}) {
    // Đảm bảo luôn có giá trị mặc định
    const safeTextStyle = textStyle || { bold: false, italic: false, underline: false }
    
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [customColor, setCustomColor] = useState(themeColor || '#6366f1')

    const handleColorChange = (color) => {
        setThemeColor(color)
        setCustomColor(color)
    }

    const handleCustomColorChange = (e) => {
        const color = e.target.value
        setCustomColor(color)
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            setThemeColor(color)
        }
    }

    const toggleStyle = (style) => {
        setTextStyle({ ...safeTextStyle, [style]: !safeTextStyle[style] })
    }

    return (
        <div className="design-panel">
            {/* FONT FAMILY */}
            <div className="design-section">
                <label className="design-label">Font chữ</label>
                <select
                    className="design-select"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                >
                    {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                </select>
            </div>

            {/* THEME COLOR */}
            <div className="design-section">
                <label className="design-label">Màu chủ đề</label>
                
                <div className="color-presets">
                    {COLOR_PRESETS.map(color => (
                        <button
                            key={color}
                            className={`color-preset-btn ${themeColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                        />
                    ))}
                </div>

                <div className="color-custom">
                    <button
                        className="color-picker-toggle"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                        <span className="color-preview" style={{ backgroundColor: customColor }} />
                        <span>Tùy chỉnh màu</span>
                    </button>

                    {showColorPicker && (
                        <div className="color-picker-popup">
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="color-input-native"
                            />
                            <div className="color-hex-input">
                                <span>#</span>
                                <input
                                    type="text"
                                    value={customColor.replace('#', '')}
                                    onChange={handleCustomColorChange}
                                    maxLength={6}
                                    placeholder="9c7575"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
                        {/* LINE HEIGHT */}
            <div className="design-section">
                <label className="design-label">Khoảng cách dòng</label>
                <div className="range-control">
                    <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.1"
                        value={lineHeight || 1.6}
                        onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    />
                    <span className="range-value">{lineHeight || 1.6}</span>
                </div>
            </div>

            {/* FONT SIZE */}
            <div className="design-section">
                <label className="design-label">Cỡ chữ cơ bản</label>
                <div className="range-control">
                    <input
                        type="range"
                        min="10"
                        max="18"
                        step="1"
                        value={fontSize || 14}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                    />
                    <span className="range-value">{fontSize || 14}px</span>
                </div>
            </div>

            {/* TEXT STYLE - SỬA Ở ĐÂY: dùng safeTextStyle thay vì textStyle */}
            <div className="design-section">
                <label className="design-label">Kiểu chữ</label>
                <div className="text-style-controls">
                    <button
                        className={`style-btn ${safeTextStyle.bold ? 'active' : ''}`}
                        onClick={() => toggleStyle('bold')}
                        title="In đậm"
                    >
                        <b>B</b>
                    </button>
                    <button
                        className={`style-btn ${safeTextStyle.italic ? 'active' : ''}`}
                        onClick={() => toggleStyle('italic')}
                        title="In nghiêng"
                    >
                        <i>I</i>
                    </button>
                    <button
                        className={`style-btn ${safeTextStyle.underline ? 'active' : ''}`}
                        onClick={() => toggleStyle('underline')}
                        title="Gạch dưới"
                    >
                        <u>U</u>
                    </button>
                </div>
            </div>

            {/* BACKGROUND COLOR */}
            <div className="design-section">
                <label className="design-label">Màu nền CV</label>
                <div className="color-picker-row">
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="color-input"
                    />
                    <span className="color-value">{bgColor}</span>
                </div>
            </div>
        </div>
    )
}