// src/components/screens/CVTemplateScreen/CVTemplateScreen.jsx
import { useState } from 'react'
import './CVTemplateScreen.css'

/* ── Template categories + items ─────────────────────────── */
const CATEGORIES = [
    { id: 'classic', icon: '🏛️', label: 'Classic', color: '#1A3A6A', bg: '#E3EEF9', desc: 'Truyền thống, trang trọng — phù hợp mọi ngành' },
    { id: 'modern', icon: '⚡', label: 'Modern', color: '#C0412A', bg: '#FDE8E4', desc: 'Hiện đại, sáng tạo — nổi bật giữa đám đông' },
    { id: 'minimal', icon: '✦', label: 'Minimal', color: '#2E6040', bg: '#E0F0E6', desc: 'Tối giản, tinh tế — để nội dung lên tiếng' },
    { id: 'creative', icon: '🎨', label: 'Creative', color: '#880E4F', bg: '#FDE8F3', desc: 'Sáng tạo, nghệ thuật — dành cho designer & marketer' },
    { id: 'tech', icon: '💻', label: 'Tech / Dev', color: '#0D47A1', bg: '#E3EEF9', desc: 'Chuyên biệt cho lập trình viên, kỹ sư phần mềm' },
    { id: 'executive', icon: '👔', label: 'Executive', color: '#1C1510', bg: '#EFE9DC', desc: 'Cao cấp, lịch lãm — dành cho vị trí quản lý cấp cao' },
]

const TEMPLATES = {
    classic: [
        { id: 'c1', name: 'Helvetica', preview: '#1A3A6A', accent: '#D4820A', popular: true, free: true, tags: ['Truyền thống', '2 cột'] },
        { id: 'c2', name: 'Geneva', preview: '#2E3A4A', accent: '#C0412A', popular: false, free: true, tags: ['Đơn giản', '1 cột'] },
        { id: 'c3', name: 'Oxford', preview: '#1A2A3A', accent: '#2E6040', popular: false, free: false, tags: ['Formal', 'Serif'] },
        { id: 'c4', name: 'Harvard', preview: '#3A1A1A', accent: '#C0412A', popular: true, free: false, tags: ['Học thuật', 'Trang trọng'] },
        { id: 'c5', name: 'Cambridge', preview: '#1A3A2A', accent: '#1A3A6A', popular: false, free: true, tags: ['Thanh lịch', 'Kinh điển'] },
        { id: 'c6', name: 'Buckley', preview: '#2A2A3A', accent: '#D4820A', popular: false, free: false, tags: ['Chuyên nghiệp', 'Sạch'] },
    ],
    modern: [
        { id: 'm1', name: 'Neon Edge', preview: '#C0412A', accent: '#F0A020', popular: true, free: true, tags: ['Táo bạo', 'Màu sắc'] },
        { id: 'm2', name: 'Gradient', preview: '#1565C0', accent: '#C0412A', popular: true, free: false, tags: ['Gradient', 'Hiện đại'] },
        { id: 'm3', name: 'Split', preview: '#2E6040', accent: '#F0A020', popular: false, free: true, tags: ['2 màu', 'Động'] },
        { id: 'm4', name: 'Sidebar Pro', preview: '#1A1A2E', accent: '#C0412A', popular: false, free: false, tags: ['Sidebar', 'Dark'] },
        { id: 'm5', name: 'Bold Type', preview: '#880E4F', accent: '#F0A020', popular: false, free: true, tags: ['Typography', 'Bold'] },
        { id: 'm6', name: 'Vivid', preview: '#D84315', accent: '#1565C0', popular: false, free: false, tags: ['Tươi tắn', 'Gen Z'] },
    ],
    minimal: [
        { id: 'n1', name: 'Pure', preview: '#F5F0E8', accent: '#1C1510', popular: true, free: true, tags: ['Trắng', 'Sạch'] },
        { id: 'n2', name: 'Stone', preview: '#E8E0D0', accent: '#C0412A', popular: false, free: true, tags: ['Earthy', 'Tối giản'] },
        { id: 'n3', name: 'Mono', preview: '#1C1510', accent: '#F0A020', popular: false, free: false, tags: ['Dark', 'Mono'] },
        { id: 'n4', name: 'Thin', preview: '#FAFAFA', accent: '#9A8D80', popular: true, free: false, tags: ['Ultra thin', 'Elegant'] },
        { id: 'n5', name: 'Sketch', preview: '#F7F2EA', accent: '#2E6040', tags: ['Handwritten', 'Artsy'], free: true },
        { id: 'n6', name: 'Outline', preview: '#FFF', accent: '#C0412A', tags: ['Line art', 'Minimal'], free: false },
    ],
    creative: [
        { id: 'cr1', name: 'Portfolio', preview: '#880E4F', accent: '#F0A020', popular: true, free: false, tags: ['Designer', 'Portfolio'] },
        { id: 'cr2', name: 'Mosaic', preview: '#D84315', accent: '#1565C0', popular: false, free: false, tags: ['Collage', 'Creative'] },
        { id: 'cr3', name: 'Infographic', preview: '#1565C0', accent: '#880E4F', popular: true, free: false, tags: ['Data viz', 'Infographic'] },
        { id: 'cr4', name: 'Comic', preview: '#F0A020', accent: '#1C1510', popular: false, free: true, tags: ['Fun', 'Illustration'] },
        { id: 'cr5', name: 'Pastel', preview: '#EDE7F6', accent: '#880E4F', popular: false, free: true, tags: ['Pastel', 'Soft'] },
        { id: 'cr6', name: 'Magazine', preview: '#1C1510', accent: '#F0A020', popular: false, free: false, tags: ['Editorial', 'Magazine'] },
    ],
    tech: [
        { id: 't1', name: 'Terminal', preview: '#0D1117', accent: '#00D4FF', popular: true, free: true, tags: ['Dark', 'Code'] },
        { id: 't2', name: 'GitHub', preview: '#161B22', accent: '#2E6040', popular: true, free: true, tags: ['Dev', 'Git style'] },
        { id: 't3', name: 'Matrix', preview: '#0A1628', accent: '#00E5A0', popular: false, free: false, tags: ['Hacker', 'Green'] },
        { id: 't4', name: 'Blueprint', preview: '#1A3A6A', accent: '#00D4FF', popular: false, free: false, tags: ['Engineer', 'Blueprint'] },
        { id: 't5', name: 'Circuit', preview: '#1A1A2E', accent: '#7C3AFF', popular: false, free: true, tags: ['Tech', 'Purple'] },
        { id: 't6', name: 'Data', preview: '#101820', accent: '#F0A020', popular: false, free: false, tags: ['Data', 'Analytics'] },
    ],
    executive: [
        { id: 'e1', name: 'Director', preview: '#1C1510', accent: '#D4820A', popular: true, free: false, tags: ['CEO', 'Gold'] },
        { id: 'e2', name: 'Senator', preview: '#1A3A6A', accent: '#D4820A', popular: false, free: false, tags: ['Formal', 'Navy'] },
        { id: 'e3', name: 'Prestige', preview: '#2A1A10', accent: '#F0A020', popular: false, free: false, tags: ['Luxury', 'Premium'] },
        { id: 'e4', name: 'Boardroom', preview: '#1A2A3A', accent: '#D4820A', popular: true, free: false, tags: ['C-level', 'Management'] },
        { id: 'e5', name: 'Legacy', preview: '#3A1A1A', accent: '#D4820A', popular: false, free: false, tags: ['Heritage', 'Classic'] },
        { id: 'e6', name: 'Titanium', preview: '#2A2A2A', accent: '#D4820A', popular: false, free: true, tags: ['Silver', 'Modern exec'] },
    ],
}

/* ── Mini CV preview card ─────────────────────────────────── */
function CVPreview({ template, catColor, selected, onSelect }) {
    const isDark = ['#0D1117', '#161B22', '#0A1628', '#1A3A6A', '#1A1A2E', '#101820', '#1C1510', '#1A2A3A', '#2A1A10', '#3A1A1A', '#2A2A2A', '#2A2A3A', '#1A2A3A', '#2E3A4A', '#880E4F', '#D84315'].includes(template.preview)

    return (
        <div className={`cvt-card${selected ? ' selected' : ''}`} onClick={() => onSelect(template)}>
            {template.popular && <div className="cvt-popular-tag">🔥 Phổ biến</div>}
            {!template.free && <div className="cvt-pro-tag">PRO</div>}

            {/* Mini preview */}
            <div className="cvt-preview" style={{ background: template.preview }}>
                {/* Fake CV layout */}
                <div className="cvt-fake-header" style={{ background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)', borderBottom: `2px solid ${template.accent}` }}>
                    <div className="cvt-fake-av" style={{ background: template.accent }} />
                    <div>
                        <div className="cvt-fake-bar long" style={{ background: isDark ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.3)', width: 80 }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.15)', width: 50 }} />
                    </div>
                </div>
                <div className="cvt-fake-body">
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div className="cvt-fake-label" style={{ background: template.accent }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.15)', width: '90%' }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.1)', width: '70%' }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.1)', width: '80%' }} />
                        <div className="cvt-fake-label" style={{ background: template.accent, marginTop: 6 }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.15)', width: '85%' }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.1)', width: '60%' }} />
                    </div>
                    <div style={{ width: 36, display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                        <div className="cvt-fake-label" style={{ background: template.accent }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.12)', width: '100%' }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.12)', width: '80%' }} />
                        <div className="cvt-fake-bar" style={{ background: isDark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.12)', width: '90%' }} />
                    </div>
                </div>
                {selected && <div className="cvt-selected-overlay"><div className="cvt-selected-check">✓</div></div>}
            </div>

            <div className="cvt-card-body">
                <div className="cvt-card-name">{template.name}</div>
                <div className="cvt-card-tags">
                    {(template.tags || []).map(t => <span key={t} className="cvt-tag">{t}</span>)}
                </div>
                <div className="cvt-card-foot">
                    {template.free
                        ? <span className="cvt-free-badge">✓ Miễn phí</span>
                        : <span className="cvt-pro-badge">⚡ Pro</span>
                    }
                    <button className="cvt-use-btn" style={selected ? { background: catColor } : {}} onClick={e => { e.stopPropagation(); onSelect(template) }}>
                        {selected ? 'Đang dùng ✓' : 'Dùng mẫu này'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ── Main component ─────────────────────────────────────── */
export default function CVTemplateScreen({ onNavigate }) {
    const [activeCat, setActiveCat] = useState(null)   // null = show category grid
    const [selectedTpl, setSelectedTpl] = useState(null)
    const [filterFree, setFilterFree] = useState(false)
    const [filterPop, setFilterPop] = useState(false)
    const [search, setSearch] = useState('')

    const cat = activeCat ? CATEGORIES.find(c => c.id === activeCat) : null

    const filteredTpls = (TEMPLATES[activeCat] || []).filter(t => {
        if (filterFree && !t.free) return false
        if (filterPop && !t.popular) return false
        if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    /* ── Category selection view ────────────────────────────── */
    if (!activeCat) return (
        <div className="cvt-page">
            <div className="cvt-page-header">
                <div className="cvt-page-hd-inner">
                    <div>
                        <h1 className="cvt-page-title">Chọn mẫu CV</h1>
                        <p className="cvt-page-sub">Chọn phong cách phù hợp với lĩnh vực và tính cách của bạn</p>
                    </div>
                    {selectedTpl && (
                        <div className="cvt-current-tpl">
                            <span>Đang dùng:</span>
                            <strong>{selectedTpl.name}</strong>
                            <button className="cvt-edit-btn" onClick={() => onNavigate?.('s6')}>Chỉnh sửa CV →</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="cvt-cats-body">
                <div className="cvt-cats-grid">
                    {CATEGORIES.map(c => {
                        const tpls = TEMPLATES[c.id] || []
                        const freeCt = tpls.filter(t => t.free).length
                        return (
                            <div key={c.id} className="cvt-cat-card" style={{ '--cat-color': c.color, '--cat-bg': c.bg }} onClick={() => setActiveCat(c.id)}>
                                <div className="cvt-cat-icon-wrap"><span className="cvt-cat-icon" style={{ color: c.color }}>{c.icon}</span></div>
                                <div className="cvt-cat-info">
                                    <div className="cvt-cat-name">{c.label}</div>
                                    <div className="cvt-cat-desc">{c.desc}</div>
                                    <div className="cvt-cat-meta">
                                        <span>{tpls.length} mẫu</span>
                                        <span>·</span>
                                        <span>{freeCt} miễn phí</span>
                                    </div>
                                </div>
                                {/* Mini preview strip */}
                                <div className="cvt-cat-previews">
                                    {tpls.slice(0, 3).map(t => (
                                        <div key={t.id} className="cvt-cat-preview-dot" style={{ background: t.preview, border: `2px solid ${t.accent}` }} />
                                    ))}
                                </div>
                                <div className="cvt-cat-arrow" style={{ color: c.color }}>→</div>
                            </div>
                        )
                    })}
                </div>

                {/* All templates quick scroll */}
                <div className="cvt-all-sec">
                    <div className="cvt-all-sec-hd">
                        <div className="cvt-all-sec-title">🔥 Phổ biến nhất</div>
                    </div>
                    <div className="cvt-popular-row">
                        {Object.values(TEMPLATES).flat().filter(t => t.popular).slice(0, 6).map(t => {
                            const catId = Object.entries(TEMPLATES).find(([, arr]) => arr.some(x => x.id === t.id))?.[0]
                            const catObj = CATEGORIES.find(c => c.id === catId)
                            return (
                                <div key={t.id} className="cvt-popular-chip" onClick={() => setActiveCat(catId)}>
                                    <div className="cvt-pop-dot" style={{ background: t.preview, border: `2px solid ${t.accent}` }} />
                                    <div>
                                        <div className="cvt-pop-name">{t.name}</div>
                                        <div className="cvt-pop-cat">{catObj?.label}</div>
                                    </div>
                                    {!t.free && <span className="cvt-mini-pro">PRO</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )

    /* ── Template list view (after category selected) ─────── */
    return (
        <div className="cvt-page">
            <div className="cvt-page-header">
                <div className="cvt-page-hd-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button className="cvt-back-btn" onClick={() => setActiveCat(null)}>← Quay lại</button>
                        <div>
                            <div className="cvt-breadcrumb">
                                <span>Mẫu CV</span><span className="cvt-bc-sep">›</span>
                                <span style={{ color: cat.color, fontWeight: 700 }}>{cat.icon} {cat.label}</span>
                            </div>
                            <p className="cvt-page-sub" style={{ marginTop: 2 }}>{cat.desc}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="cvt-filters">
                        <div className="cvt-search">
                            <span>🔍</span>
                            <input placeholder="Tìm template..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className={`cvt-filter-btn${filterFree ? ' on' : ''}`} onClick={() => setFilterFree(v => !v)}>✓ Miễn phí</button>
                        <button className={`cvt-filter-btn${filterPop ? ' on' : ''}`} onClick={() => setFilterPop(v => !v)}>🔥 Phổ biến</button>
                    </div>
                </div>
            </div>

            <div className="cvt-list-body">
                {/* Result count */}
                <div className="cvt-list-meta">
                    <span className="cvt-list-ct">{filteredTpls.length} mẫu CV · <strong>{cat.label}</strong></span>
                    {selectedTpl && (
                        <div className="cvt-selected-info">
                            <span>Đang chọn: <strong>{selectedTpl.name}</strong></span>
                            <button className="cvt-use-final-btn" style={{ background: cat.color }} onClick={() => onNavigate?.('s6')}>
                                Dùng mẫu này & Chỉnh sửa →
                            </button>
                        </div>
                    )}
                </div>

                {/* Grid */}
                {filteredTpls.length > 0 ? (
                    <div className="cvt-tpl-grid">
                        {filteredTpls.map(t => (
                            <CVPreview
                                key={t.id}
                                template={t}
                                catColor={cat.color}
                                selected={selectedTpl?.id === t.id}
                                onSelect={setSelectedTpl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="cvt-empty">
                        <div style={{ fontSize: 48, opacity: .3 }}>🎨</div>
                        <div className="cvt-empty-t">Không tìm thấy mẫu phù hợp</div>
                        <button className="cvt-empty-reset" onClick={() => { setSearch(''); setFilterFree(false); setFilterPop(false) }}>Xoá bộ lọc</button>
                    </div>
                )}
            </div>
        </div>
    )
}