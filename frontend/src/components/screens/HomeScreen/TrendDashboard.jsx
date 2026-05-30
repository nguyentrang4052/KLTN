import { useState, useEffect, useRef, useCallback } from 'react'

const STATUS_META = {
    hot: { icon: '🔥', label: 'Hot', color: '#C0412A', bg: '#FDE8E4', border: '#F5C0B0' },
    rising: { icon: '📈', label: 'Rising', color: '#1565C0', bg: '#E3EEF9', border: '#A8C8F0' },
    stable: { icon: '⚖️', label: 'Stable', color: '#2E6040', bg: '#E0F0E6', border: '#A0CCA8' },
    declining: { icon: '📉', label: 'Declining', color: '#9A8D80', bg: '#F5F0E8', border: '#DDD6C6' },
}

export default function TrendDashboard({ onIndustryClick }) {
    const [trends, setTrends] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [sortBy, setSortBy] = useState('score')
    const [hovered, setHovered] = useState(null)
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
    const [showAll, setShowAll] = useState(false)
    const tooltipRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        fetch('http://localhost:3000/api/jobs/industry-trends')
            .then(r => r.json())
            .then(data => { setTrends(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!tooltipRef.current || !containerRef.current) return
        const containerRect = containerRef.current.getBoundingClientRect()
        const tipW = tooltipRef.current.offsetWidth
        const tipH = tooltipRef.current.offsetHeight
        let x = e.clientX - containerRect.left + 16
        let y = e.clientY - containerRect.top - tipH / 2
        if (x + tipW > containerRect.width - 10) x = e.clientX - containerRect.left - tipW - 16
        if (y < 0) y = 4
        setTooltipPos({ x, y })
    }, [])

    const handleFilterChange = (f) => {
        setFilter(f)
        setShowAll(false)
    }

    const filtered = trends
        .filter(t => filter === 'all' || t.status === filter)
        .sort((a, b) =>
            sortBy === 'jobs' ? b.totalJobs - a.totalJobs :
                sortBy === 'saves' ? b.saves - a.saves :
                    b.score - a.score
        )

    const displayed = showAll ? filtered : filtered.slice(0, 5)

    const counts = {
        hot: trends.filter(t => t.status === 'hot').length,
        rising: trends.filter(t => t.status === 'rising').length,
        stable: trends.filter(t => t.status === 'stable').length,
        declining: trends.filter(t => t.status === 'declining').length,
    }

    const maxVal = Math.max(...filtered.map(t =>
        sortBy === 'jobs' ? t.totalJobs :
            sortBy === 'saves' ? t.saves :
                t.score
    ), 0.01)

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9A8D80', fontSize: 14 }}>
            ⟳ Đang tải xu hướng thị trường...
        </div>
    )

    return (
        <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative' }} ref={containerRef} onMouseMove={handleMouseMove}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: '#342893', marginBottom: 6 }}>
                        Phân tích thị trường
                    </div>
                    <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#1C1510', letterSpacing: -0.5 }}>
                        Xu hướng tìm việc theo <em style={{ fontStyle: 'Roboto', color: '#342893' }}>ngành nghề</em>
                    </h2>
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9A8D80', lineHeight: 1.5 }}>
                        Dựa trên số lượng việc làm, lượt tìm kiếm, lượt lưu và tăng trưởng trong 30 ngày qua
                    </p>
                </div>
                <select
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setShowAll(false) }}
                    style={{
                        padding: '7px 24px 7px 10px', borderRadius: 8, border: '1.5px solid #DDD6C6',
                        background: '#FEFCF7', fontSize: 12, color: '#1C1510', cursor: 'pointer',
                        appearance: 'none', fontFamily: 'Roboto, sans-serif',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
                    }}>
                    <option value="score">Điểm</option>
                    <option value="jobs">Số việc làm</option>
                    <option value="saves">Lượt lưu</option>
                </select>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                {Object.entries(STATUS_META).map(([key, meta]) => (
                    <div
                        key={key}
                        title={`Click để lọc theo ${meta.label}`}
                        onClick={() => handleFilterChange(filter === key ? 'all' : key)}
                        style={{
                            padding: '12px 14px', borderRadius: 10,
                            border: `1.5px solid ${filter === key ? meta.color : meta.border}`,
                            background: filter === key ? meta.bg : '#FEFCF7',
                            cursor: 'pointer', transition: 'all .15s',
                            opacity: filter !== 'all' && filter !== key ? 0.45 : 1,
                        }}>
                        <div style={{ fontSize: 16, marginBottom: 4 }}>{meta.icon}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: meta.color, lineHeight: 1 }}>{counts[key]}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, marginTop: 2 }}>{meta.label}</div>
                        <div style={{ fontSize: 10, color: '#9A8D80', marginTop: 3 }}>
                            {key === 'hot' && 'Nhu cầu rất cao'}
                            {key === 'rising' && 'Đang tăng trưởng'}
                            {key === 'stable' && 'Ổn định'}
                            {key === 'declining' && 'Nhu cầu thấp'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart area */}
            <div style={{ background: '#FEFCF7', border: '1.5px solid #DDD6C6', borderRadius: 14, padding: '20px 24px' }}>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                    {[
                        { id: 'all', label: `Tất cả · ${trends.length}` },
                        { id: 'hot', label: `🔥 Hot · ${counts.hot}` },
                        { id: 'rising', label: `📈 Rising · ${counts.rising}` },
                        { id: 'stable', label: `⚖️ Stable · ${counts.stable}` },
                        { id: 'declining', label: `📉 Declining · ${counts.declining}` },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => handleFilterChange(tab.id)} style={{
                            padding: '5px 12px', borderRadius: 20,
                            border: `1.5px solid ${filter === tab.id ? '#342893' : '#DDD6C6'}`,
                            background: filter === tab.id ? '#342893' : 'transparent',
                            color: filter === tab.id ? '#fff' : '#6B5E50',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Roboto, sans-serif',
                        }}>{tab.label}</button>
                    ))}
                </div>

                {/* Legend */}
                <div style={{
                    display: 'flex', gap: 16, marginBottom: 14, padding: '10px 14px',
                    background: '#F5F0E8', borderRadius: 8, flexWrap: 'wrap', alignItems: 'center',
                }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#9A8D80', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Chú thích:
                    </span>
                    {Object.entries(STATUS_META).map(([key, meta]) => (
                        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B5E50' }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: meta.color, display: 'inline-block' }} />
                            <span style={{ fontWeight: 700, color: meta.color }}>{meta.icon} {meta.label}</span>
                        </span>
                    ))}
                    <span style={{ fontSize: 11, color: '#9A8D80', marginLeft: 'auto' }}>
                        Thanh dài = Điểm cao hơn · Hover để xem chi tiết
                    </span>
                </div>

                {/* Column headers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', marginBottom: 6 }}>
                    <div style={{ width: 24 }} />
                    <div style={{ width: 150, fontSize: 11, fontWeight: 700, color: '#9A8D80', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Ngành nghề
                    </div>
                    <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: '#9A8D80', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {sortBy === 'score' ? 'Chỉ số xu hướng' : sortBy === 'jobs' ? 'Số việc làm' : 'Lượt lưu'}
                    </div>
                    <div style={{ width: 130, fontSize: 11, fontWeight: 700, color: '#9A8D80', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>
                        Trạng thái / Điểm
                    </div>
                </div>

                {/* Bars */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#9A8D80', fontSize: 13 }}>
                        Không có dữ liệu
                    </div>
                ) : (
                    <>
                        {displayed.map((trend, idx) => {
                            const meta = STATUS_META[trend.status]
                            const val = sortBy === 'jobs' ? trend.totalJobs : sortBy === 'saves' ? trend.saves : trend.score
                            const pct = (val / maxVal) * 100
                            const isHovered = hovered?.id === trend.id

                            return (
                                <div
                                    key={trend.id}
                                    onMouseEnter={() => setHovered(trend)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => onIndustryClick?.(trend.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '7px 10px', borderRadius: 8, marginBottom: 4,
                                        cursor: onIndustryClick ? 'pointer' : 'default',
                                        background: isHovered ? meta.bg : 'transparent',
                                        transition: 'background .12s',
                                    }}
                                >
                                    <div style={{
                                        width: 24, flexShrink: 0, fontSize: 11, fontWeight: 700,
                                        color: idx < 3 ? '#F0A020' : '#9A8D80', textAlign: 'right',
                                    }}>#{idx + 1}</div>

                                    <div style={{
                                        width: 150, flexShrink: 0, fontSize: 13, fontWeight: 600,
                                        color: '#1C1510', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>{trend.name}</div>

                                    <div style={{ flex: 1, height: 10, background: '#EDE8DF', borderRadius: 5, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: `${pct}%`,
                                            background: meta.color, borderRadius: 5,
                                            transition: 'width .5s ease',
                                            opacity: isHovered ? 1 : 0.75,
                                        }} />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: 10, padding: '2px 7px', borderRadius: 5,
                                            background: meta.bg, color: meta.color,
                                            border: `1px solid ${meta.border}`, fontWeight: 700,
                                        }}>{meta.icon} {meta.label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: meta.color, minWidth: 36, textAlign: 'right' }}>
                                            {sortBy === 'score' ? trend.score.toFixed(2) :
                                                sortBy === 'jobs' ? trend.totalJobs.toLocaleString() :
                                                    trend.saves.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                        {filtered.length > 5 && (
                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <button
                                    onClick={() => setShowAll(v => !v)}
                                    style={{
                                        padding: '8px 24px', borderRadius: 20,
                                        border: '1.5px solid #DDD6C6', background: '#FEFCF7',
                                        color: '#6B5E50', fontSize: 13, fontWeight: 600,
                                        cursor: 'pointer', fontFamily: 'Roboto, sans-serif',
                                        transition: 'all .15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#342893'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#DDD6C6'}
                                >
                                    {showAll ? '▲ Thu gọn' : `▼ Xem tất cả ${filtered.length} ngành`}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Tooltip */}
            {hovered && (
                <div ref={tooltipRef} style={{
                    position: 'absolute',
                    left: tooltipPos.x, top: tooltipPos.y,
                    background: '#1C1510', color: '#F5EED8',
                    borderRadius: 12, padding: '14px 16px',
                    fontSize: 12, pointerEvents: 'none', zIndex: 100,
                    minWidth: 210, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#fff' }}>
                        {STATUS_META[hovered.status].icon} {hovered.name}
                    </div>
                    {[
                        ['Điểm tổng hợp', hovered.score.toFixed(3)],
                        ['Tổng việc làm', hovered.totalJobs.toLocaleString()],
                        ['Việc mới 30 ngày', hovered.currentJobs.toLocaleString()],
                        ['Lượt lưu', hovered.saves.toLocaleString()],
                        ['Lượt xem', hovered.views.toLocaleString()],
                        ['Lượt tìm kiếm', hovered.searchScore.toLocaleString()],
                    ].map(([label, val]) => (
                        <div key={label} style={{
                            display: 'flex', justifyContent: 'space-between', gap: 16,
                            padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}>
                            <span style={{ color: 'rgba(245,238,216,0.55)' }}>{label}</span>
                            <span style={{ fontWeight: 600, color: '#F5EED8' }}>{val}</span>
                        </div>
                    ))}
                    {/* <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(245,238,216,0.4)', textAlign: 'center' }}>
                        Click để lọc việc làm theo ngành này
                    </div> */}
                </div>
            )}
        </div>
    )
}