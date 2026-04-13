// src/components/screens/AIAssistantScreen/AIAssistantScreen.jsx
import { useState, useRef, useEffect } from 'react'
import './AIScreen.css'

const SUGGESTED_JOBS = [
    { id: 1, title: 'Senior React Developer', company: 'FPT Software', salary: '35–50tr', match: 94, logo: 'F', color: 'linear-gradient(135deg,#D0392A,#E05A40)' },
    { id: 2, title: 'Full-stack (React + Go)', company: 'Tiki Corp', salary: '40–60tr', match: 88, logo: 'T', color: 'linear-gradient(135deg,#1A73E8,#4285F4)' },
    { id: 3, title: 'Frontend Engineer', company: 'VNG', salary: '30–45tr', match: 85, logo: 'V', color: 'linear-gradient(135deg,#1565C0,#1E88E5)' },
]

const QUICK_PROMPTS = [
    '🎯 Gợi ý việc phù hợp với tôi',
    '📄 Phân tích CV của tôi',
    '💰 Mức lương thị trường cho React Dev',
    '🔍 Tìm việc Remote 100%',
    '📈 Tips để tăng match score',
    '🤝 Chuẩn bị phỏng vấn',
]

const INITIAL_MESSAGES = [
    {
        id: 1, role: 'assistant',
        content: null,
        type: 'welcome',
    },
]

const AI_RESPONSES = {
    'gợi ý': {
        text: 'Dựa trên hồ sơ và lịch sử tìm kiếm của bạn, tôi tìm thấy **3 cơ hội phù hợp nhất hôm nay**:',
        type: 'jobs',
    },
    'phân tích cv': {
        text: `**Phân tích CV "Senior React Developer" của bạn:**\n\n✅ **Điểm mạnh (92% hoàn thiện)**\n- Kỹ năng kỹ thuật rõ ràng: React, TypeScript, AWS\n- Kinh nghiệm 5 năm phù hợp với hầu hết JD senior\n- Format CV dễ đọc, ATS-friendly\n\n⚠️ **Cần cải thiện**\n- Thiếu số liệu thành tích cụ thể (vd: "tăng hiệu suất 40%")\n- Chưa có liên kết GitHub/Portfolio\n- Phần tóm tắt nghề nghiệp còn ngắn`,
        type: 'text',
    },
    'lương': {
        text: `**Thị trường lương React Developer tại TP.HCM (2025):**\n\n| Level | Mức lương |\n|-------|----------|\n| Junior (0–2 năm) | 12–22 triệu |\n| Mid (2–4 năm) | 22–38 triệu |\n| Senior (4–7 năm) | **35–55 triệu** |\n| Lead / Architect | 55–90 triệu |\n\n📊 **Nhận xét:** Với 5 năm kinh nghiệm, bạn đang ở phân khúc **Senior**. Mức kỳ vọng 35–50tr là phù hợp và cạnh tranh.`,
        type: 'text',
    },
    'remote': {
        text: 'Tôi tìm thấy **47 việc Remote** phù hợp với hồ sơ của bạn. Đây là một số kết quả nổi bật:',
        type: 'jobs',
    },
    'match': {
        text: `**Tips để tăng Match Score của bạn:**\n\n🔑 **Tác động cao (ngay bây giờ)**\n1. Thêm **AWS** vào CV — đang hot, tăng 15% match\n2. Viết tóm tắt 3–4 câu theo JD bạn nhắm tới\n3. Thêm link GitHub với ít nhất 3 project thực\n\n📈 **Tác động vừa (tuần này)**\n4. Bật "Tìm kiếm tích cực" trong profile\n5. Cập nhật title "Senior React Developer" đúng với cấp bậc\n6. Điền đủ kỳ vọng lương để AI match tốt hơn`,
        type: 'text',
    },
    'phỏng vấn': {
        text: `**Chuẩn bị phỏng vấn React Developer:**\n\n🎭 **Câu hỏi kỹ thuật thường gặp**\n- Virtual DOM & Reconciliation\n- React Hooks (useCallback, useMemo)\n- State management (Redux vs Zustand)\n- Performance optimization techniques\n\n💬 **Câu hỏi hành vi (STAR method)**\n- Kể về dự án khó nhất bạn đã làm\n- Xử lý conflict trong team như thế nào\n\n✨ Muốn tôi **mock interview** với bạn không?`,
        type: 'text',
    },
}

function getAIResponse(msg) {
    const lower = msg.toLowerCase()
    for (const [key, resp] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(key)) return resp
    }
    return {
        text: `Tôi đã hiểu câu hỏi của bạn về "${msg}". Để tư vấn chính xác hơn, bạn có thể thử:\n\n- **Gợi ý việc làm** phù hợp\n- **Phân tích CV** của bạn\n- **Lương thị trường** theo vị trí\n- **Chuẩn bị phỏng vấn**\n\nHoặc hỏi tôi bất cứ điều gì về hành trình tìm việc của bạn! 💪`,
        type: 'text',
    }
}

/* ── Markdown renderer (simple) ── */
function MdText({ text }) {
    const lines = text.split('\n')
    return (
        <div className="ai-md">
            {lines.map((line, i) => {
                if (!line) return <br key={i} />
                // Bold
                const parsed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                // Table header separator
                if (/^\|[-:]+/.test(line)) return null
                if (line.startsWith('|')) {
                    const cells = line.split('|').filter(c => c.trim())
                    const isHeader = lines[i + 1]?.startsWith('|---')
                    return <div key={i} className={`ai-table-row${isHeader ? ' ai-table-head' : ''}`}>{cells.map((c, j) => <span key={j} className="ai-table-cell" dangerouslySetInnerHTML={{ __html: c.trim().replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}</div>
                }
                return <p key={i} dangerouslySetInnerHTML={{ __html: parsed }} />
            })}
        </div>
    )
}

/* ── Job suggestion card (inline) ── */
function InlineJobCard({ job }) {
    return (
        <div className="ai-job-card">
            <div className="ai-job-logo" style={{ background: job.color }}>{job.logo}</div>
            <div className="ai-job-info">
                <div className="ai-job-title">{job.title}</div>
                <div className="ai-job-co">{job.company} · {job.salary}</div>
            </div>
            <div className={`ai-job-match${job.match >= 85 ? ' hi' : ''}`}>{job.match}%</div>
            <button className="ai-job-apply">⚡ Apply</button>
        </div>
    )
}

export default function AIAssistantScreen({ onNavigate }) {
    const [messages, setMessages] = useState(INITIAL_MESSAGES)
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const [sidePanel, setSidePanel] = useState(true)
    const bottomRef = useRef()
    const inputRef = useRef()

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

    const send = (text) => {
        const msg = text || input.trim()
        if (!msg) return
        setInput('')

        setMessages(p => [...p, { id: Date.now(), role: 'user', content: msg, type: 'text' }])
        setTyping(true)

        setTimeout(() => {
            const resp = getAIResponse(msg)
            setTyping(false)
            setMessages(p => [...p, {
                id: Date.now() + 1,
                role: 'assistant',
                content: resp.text,
                type: resp.type,
                jobs: resp.type === 'jobs' ? SUGGESTED_JOBS : null,
            }])
        }, 1200 + Math.random() * 800)
    }

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    }

    return (
        <div className="ai-page">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="ai-header">
                <div className="ai-header-inner">
                    <div className="ai-header-brand">
                        <div className="ai-header-av">🤖</div>
                        <div>
                            <div className="ai-header-name">GZC AI Assistant</div>
                            <div className="ai-header-status"><span className="ai-status-dot" />Đang hoạt động</div>
                        </div>
                    </div>
                    <div className="ai-header-actions">
                        <button className="ai-hbtn" title="Gợi ý việc làm" onClick={() => send('Gợi ý việc phù hợp với tôi')}>🎯 Gợi ý việc</button>
                        <button className="ai-hbtn" onClick={() => setSidePanel(v => !v)}>
                            {sidePanel ? '◁ Ẩn bảng' : '▷ Bảng gợi ý'}
                        </button>
                        <button className="ai-hbtn danger" onClick={() => setMessages(INITIAL_MESSAGES)}>🗑 Xoá chat</button>
                    </div>
                </div>
            </div>

            <div className="ai-layout">

                {/* ── Chat area ──────────────────────────────────── */}
                <div className="ai-chat-area">
                    <div className="ai-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`ai-msg-wrap${msg.role === 'user' ? ' user' : ''}`}>

                                {msg.role === 'assistant' && (
                                    <div className="ai-msg-av-wrap">
                                        <div className="ai-msg-av">🤖</div>
                                    </div>
                                )}

                                <div className={`ai-bubble${msg.role === 'user' ? ' user' : ''}`}>
                                    {/* Welcome message */}
                                    {msg.type === 'welcome' && (
                                        <div className="ai-welcome">
                                            <div className="ai-welcome-wave">👋</div>
                                            <div className="ai-welcome-title">Xin chào, Trần Văn A!</div>
                                            <div className="ai-welcome-sub">
                                                Tôi là <strong>GZC AI</strong> — trợ lý tìm việc thông minh của bạn.
                                                Tôi có thể giúp bạn tìm việc, phân tích CV, tư vấn lương và chuẩn bị phỏng vấn.
                                            </div>
                                            <div className="ai-welcome-chips">
                                                {QUICK_PROMPTS.map(p => (
                                                    <button key={p} className="ai-welcome-chip" onClick={() => send(p)}>{p}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Text */}
                                    {msg.type === 'text' && msg.content && <MdText text={msg.content} />}

                                    {/* Jobs */}
                                    {msg.type === 'jobs' && (
                                        <>
                                            {msg.content && <MdText text={msg.content} />}
                                            <div className="ai-jobs-list">
                                                {(msg.jobs || SUGGESTED_JOBS).map(j => <InlineJobCard key={j.id} job={j} />)}
                                            </div>
                                            <div className="ai-jobs-more">
                                                <button className="ai-jobs-more-btn" onClick={() => onNavigate?.('s3')}>Xem tất cả {'>>'}</button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="ai-msg-av-wrap">
                                        <div className="ai-msg-av user-av">T</div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {typing && (
                            <div className="ai-msg-wrap">
                                <div className="ai-msg-av-wrap"><div className="ai-msg-av">🤖</div></div>
                                <div className="ai-bubble">
                                    <div className="ai-typing">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick prompts */}
                    <div className="ai-quick-bar">
                        {QUICK_PROMPTS.slice(0, 4).map(p => (
                            <button key={p} className="ai-quick-chip" onClick={() => send(p)}>{p}</button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="ai-input-wrap">
                        <div className="ai-input-box">
                            <textarea
                                ref={inputRef}
                                className="ai-input"
                                placeholder="Hỏi tôi bất cứ điều gì về tìm việc..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                rows={1}
                            />
                            <div className="ai-input-actions">
                                <button className="ai-input-btn" title="Đính kèm CV">📎</button>
                                <button
                                    className={`ai-send-btn${input.trim() ? ' active' : ''}`}
                                    onClick={() => send()}
                                    disabled={!input.trim() || typing}
                                >
                                    ↑
                                </button>
                            </div>
                        </div>
                        <div className="ai-input-hint">Enter để gửi · Shift+Enter để xuống dòng</div>
                    </div>
                </div>

                {/* ── Side panel ─────────────────────────────────── */}
                {sidePanel && (
                    <aside className="ai-side">

                        {/* Profile summary */}
                        <div className="ai-side-card">
                            <div className="ai-side-card-title">👤 Hồ sơ của bạn</div>
                            <div className="ai-profile-row">
                                <div className="ai-profile-av">T</div>
                                <div>
                                    <div className="ai-profile-name">Trần Văn A</div>
                                    <div className="ai-profile-role">Senior React Dev · 5 năm</div>
                                </div>
                            </div>
                            <div className="ai-profile-bars">
                                {[['CV', 92], ['Hồ sơ', 78], ['Kỹ năng', 85]].map(([l, v]) => (
                                    <div key={l} className="ai-pb-row">
                                        <span className="ai-pb-label">{l}</span>
                                        <div className="ai-pb-bg"><div className="ai-pb-bar" style={{ width: `${v}%` }} /></div>
                                        <span className="ai-pb-n">{v}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Today's suggestions */}
                        <div className="ai-side-card">
                            <div className="ai-side-card-title">🎯 Gợi ý hôm nay</div>
                            <div className="ai-side-card-sub">{SUGGESTED_JOBS.length} việc phù hợp cao</div>
                            {SUGGESTED_JOBS.map(job => (
                                <div key={job.id} className="ai-side-job">
                                    <div className="ai-sj-logo" style={{ background: job.color }}>{job.logo}</div>
                                    <div className="ai-sj-info">
                                        <div className="ai-sj-title">{job.title}</div>
                                        <div className="ai-sj-co">{job.company}</div>
                                    </div>
                                    <div className="ai-sj-match">{job.match}%</div>
                                </div>
                            ))}
                            <button className="ai-side-see-all" onClick={() => onNavigate?.('s3')}>Xem tất cả →</button>
                        </div>

                        {/* AI Insights */}
                        <div className="ai-side-card insights">
                            <div className="ai-side-card-title">💡 AI Insights</div>
                            {[
                                { ico: '📈', text: 'AWS đang hot — thêm vào CV tăng 15% match', type: 'tip' },
                                { ico: '⏰', text: '3 việc đã lưu sắp hết hạn trong 3 ngày', type: 'warn' },
                                { ico: '🎉', text: 'Match score tăng 8% so với tuần trước', type: 'good' },
                            ].map((ins, i) => (
                                <div key={i} className={`ai-insight-row ${ins.type}`}>
                                    <span className="ai-insight-ico">{ins.ico}</span>
                                    <span className="ai-insight-text">{ins.text}</span>
                                </div>
                            ))}
                        </div>

                    </aside>
                )}
            </div>
        </div>
    )
}