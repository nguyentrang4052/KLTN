import { useState, useRef, useEffect, useCallback } from 'react';
import './AIScreen.css';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../../utils/auth';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

const QUICK_PROMPTS = [
    // '🎯 Gợi ý việc phù hợp với tôi',
    // '📄 Phân tích CV của tôi',
    '💰 Mức lương thị trường cho React Dev',
    '🔍 Tìm việc Remote 100%',
    '📈 Tips để tăng match score',
    '🤝 Chuẩn bị phỏng vấn',
];

const INITIAL_MESSAGES = [
    {
        id: 'welcome',
        role: 'assistant',
        content: null,
        type: 'welcome',
    },
];

/* ── Helpers ── */
const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') throw new Error('Request timeout');
        throw error;
    }
};

const formatFileSize = (bytes) => {
    if (!bytes || bytes < 1024) return `${bytes || 0} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
};

/* ── Markdown renderer ── */
function MdText({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div className="ai-md">
            {lines.map((line, i) => {
                if (!line) return <br key={i} />;
                const parsed = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/`(.+?)`/g, '<code>$1</code>');
                if (/^\|[-:]+/.test(line)) return null;
                if (line.startsWith('|')) {
                    const cells = line.split('|').filter((c) => c.trim());
                    const isHeader = lines[i + 1]?.startsWith('|---');
                    return (
                        <div key={i} className={`ai-table-row${isHeader ? ' ai-table-head' : ''}`}>
                            {cells.map((c, j) => (
                                <span
                                    key={j}
                                    className="ai-table-cell"
                                    dangerouslySetInnerHTML={{ __html: c.trim() }}
                                />
                            ))}
                        </div>
                    );
                }
                if (line.startsWith('• ')) {
                    return (
                        <div key={i} className="ai-list-item">
                            <span className="ai-bullet">•</span>
                            <span dangerouslySetInnerHTML={{ __html: parsed.replace(/^• /, '') }} />
                        </div>
                    );
                }
                return <p key={i} dangerouslySetInnerHTML={{ __html: parsed }} />;
            })}
        </div>
    );
}

/* ── CV Attachment (user upload preview) ── */
function CVAttachment({ fileName, fileUrl, fileSize, setPreviewFile }) {
    const isPDF = fileName?.toLowerCase().endsWith('.pdf');
    return (
        <div className="ai-cv-attachment">
            <div className="ai-cv-file">
                <div className="ai-cv-icon">{isPDF ? '📄' : '📝'}</div>
                <div className="ai-cv-info">
                    <div className="ai-cv-name">{fileName}</div>
                    <div className="ai-cv-meta">{formatFileSize(fileSize)}</div>
                </div>
            </div>
            <div className="ai-cv-actions">
                <button
                    className="ai-cv-btn view"
                    onClick={() =>
                        setPreviewFile({
                            name: fileName,
                            url: fileUrl
                        })
                    }
                >
                    👁 Xem
                </button>
            </div>
        </div>
    );
}

function JobMatchCard({ job, onSelect }) {
    const navigate = useNavigate();
    const location = useLocation()
    return (
        <div className="ai-job-card" onClick={() => onSelect?.(job)}>
            <div className="ai-job-header">
                <div
                    className="ai-job-title"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ai/jobs/${job.job_id}`, {
                            state: {
                                fromPath: location.pathname,
                                scrollY: window.scrollY
                            }
                        });
                    }}
                >
                    {job.job_title}
                </div>
                <div
                    className={`ai-job-match${job.match_score >= 85 ? ' hi' : job.match_score >= 70 ? ' med' : ''}`}
                >
                    {job.match_score}%
                </div>
            </div>
            <div className="ai-job-co">🏢 {job.company}</div><div className="ai-job-location">📍 {job.location || 'N/A'}</div><div className="ai-job-salary">💰 {job.salary}</div>

            {job.match_reasons?.length > 0 && (
                <div className="ai-job-reasons">
                    {job.match_reasons.slice(0, 2).map((reason, idx) => (
                        <span key={idx} className="ai-job-reason">✓ {reason}</span>
                    ))}
                </div>
            )}

            {job.skill_gap?.length > 0 && (
                <div className="ai-job-missing">
                    <span className="ai-missing-label">📚 Thiếu:</span>{' '}
                    {job.skill_gap.slice(0, 3).join(', ')}
                    {job.skill_gap.length > 3 && ` +${job.skill_gap.length - 3}`}
                </div>
            )}

            <div className="ai-job-footer">
                <span
                    className={`ai-job-rec ${job.recommendation === 'Rất phù hợp' ? 'good' :
                        job.recommendation === 'Phù hợp' ? 'med' : 'warn'}`}
                >
                    {job.recommendation}
                </span>
                <button
                    className="ai-job-detail"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(job);
                    }}
                >
                    🔍 Tìm hiểu
                </button>
            </div>
        </div>
    );
}

/* ── Inline Job Card (legacy / quick suggestions) ── */
function InlineJobCard({ job }) {
    return (
        <div className="ai-job-card">
            <div className="ai-job-logo" style={{ background: job.color }}>
                {job.logo}
            </div>
            <div className="ai-job-info">
                <div className="ai-job-title">{job.title}</div>
                <div className="ai-job-co">
                    {job.company} · {job.salary}
                </div>
            </div>
            <div className={`ai-job-match${job.match >= 85 ? ' hi' : ''}`}>{job.match}%</div>
            <button className="ai-job-apply">⚡ Apply</button>
        </div>
    );
}

/* ── Main Component ── */
export default function AIAssistantScreen({ onNavigate }) {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [sidePanel, setSidePanel] = useState(true);
    const [showHistory, setShowHistory] = useState(true);

    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [cvAnalysis, setCvAnalysis] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedCV, setUploadedCV] = useState(null); // { name, size, type, url }

    // State cho rename và pin
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [renaming, setRenaming] = useState(false);

    const bottomRef = useRef();
    const inputRef = useRef();
    const fileInputRef = useRef();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userID = user?.accountID;
    const [previewFile, setPreviewFile] = useState(null);

    /* ── Scroll to bottom ── */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    /* ── Cleanup blob URL ── */
    useEffect(() => {
        return () => {
            if (uploadedCV?.url?.startsWith('blob:')) {
                URL.revokeObjectURL(uploadedCV.url);
            }
        };
    }, [uploadedCV]);

    /* ── History API ── */
    const fetchSessions = useCallback(async () => {
        try {
            const res = await fetchWithTimeout(`${API_BASE_URL}/chat-history/get-sessions`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed');
            return await res.json();
        } catch (err) {
            console.error('Fetch sessions error:', err);
            return [];
        }
    }, []);

    const createSession = useCallback(
        async (title = 'New Chat') => {
            try {
                const res = await fetchWithTimeout(`${API_BASE_URL}/chat-history/create-sessions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({ title }),
                });
                if (!res.ok) throw new Error('Failed');
                return await res.json();
            } catch (err) {
                console.error('Create session:', err);
                return null;
            }
        }, []);

    const fetchMessages = useCallback(async (sessionID) => {
        try {
            const res = await fetchWithTimeout(`${API_BASE_URL}/chat-history/sessions/${sessionID}/messages`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed');
            return await res.json();
        } catch (err) {
            console.error('Fetch messages:', err);
            return [];
        }
    }, []);


    const saveMessageToHistory = useCallback(
        async (sessionID, msg) => {
            if (!sessionID) return;
            try {
                await fetchWithTimeout(`${API_BASE_URL}/chat-history/save-messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        sessionID: sessionID,
                        role: msg.role,
                        content: typeof msg.content === 'string' ? msg.content : '',
                        type: msg.type || 'text',
                        metadata: {
                            analysis: msg.analysis,
                            jobMatches: msg.jobMatches,
                            fileName: msg.fileName,
                            fileUrl: msg.fileUrl,
                            fileSize: msg.fileSize,
                            cached: msg.cached,
                        }
                    }),
                });
            } catch (err) {
                console.error('Save message error:', err);
            }
        },
        []
    );

    const deleteSession = useCallback(
        async (sessionID) => {
            if (!sessionID) return;
            try {
                await fetchWithTimeout(`${API_BASE_URL}/chat-history/delete-session/${sessionID}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSessions((prev) => prev.filter((s) => s.id !== sessionID));
                if (currentSessionId === sessionID)
                    startNewChat();

            } catch (err) {
                console.error('Delete session error:', err);
            }
        },
        [currentSessionId]
    );

    /* ── Init ── */
    useEffect(() => {
        const init = async () => {
            if (!userID) return;
            setLoadingHistory(true);
            const list = await fetchSessions();
            setSessions(list);

            const lastId = localStorage.getItem(`ai_last_session_${userID}`);
            const targetSession = lastId ? list.find((s) => s.id === Number(lastId)) : list[0];

            if (targetSession) {
                const msgs = await fetchMessages(targetSession.id);
                const ui = msgs.length > 0
                    ? msgs.map((m) => ({ id: m.id || Date.now() + Math.random(), role: m.role, content: m.content, type: m.type || 'text', ...(m.metadata || {}) }))
                    : INITIAL_MESSAGES;
                setMessages(ui);
                setCurrentSessionId(targetSession.id);
                localStorage.setItem(`ai_last_session_${userID}`, String(targetSession.id));
                const lastA = msgs.slice().reverse().find((m) => m.metadata?.analysis);
                if (lastA) setCvAnalysis(lastA.metadata.analysis);
            } else {
                setMessages(INITIAL_MESSAGES);
                setCurrentSessionId(null);
            }
            setLoadingHistory(false);
        };
        init();
        // eslint-disable-next-line
    }, [userID]);


    /* ── New Chat ── */
    const startNewChat = useCallback(async () => {
        const session = await createSession('New Chat');
        if (session) {
            setCurrentSessionId(session.id);
            localStorage.setItem(`ai_last_session_${userID}`, String(session.id));
            setSessions((prev) => [session, ...prev]);
        } else {
            setCurrentSessionId(null);
        }
        setMessages(INITIAL_MESSAGES);
        setCvAnalysis(null);
        setUploadedCV(null);
        setInput('');
    }, [userID, createSession]);


    /* ── Load old session ── */
    const loadSession = useCallback(async (sessionID) => {
        setLoadingHistory(true);
        const msgs = await fetchMessages(sessionID);
        const ui = msgs.length > 0
            ? msgs.map((m) => ({ id: m.id || Date.now() + Math.random(), role: m.role, content: m.content, type: m.type || 'text', ...(m.metadata || {}) }))
            : INITIAL_MESSAGES;
        setMessages(ui);
        setCurrentSessionId(sessionID);
        localStorage.setItem(`ai_last_session_${userID}`, String(sessionID));
        const lastA = msgs.slice().reverse().find((m) => m.metadata?.analysis);
        setCvAnalysis(lastA?.metadata?.analysis || null);
        setLoadingHistory(false);
    }, [userID, fetchMessages]);

    /* ── Send Message ── */
    const sendMessage = useCallback(
        async (text) => {
            const msgText = text || input.trim();
            if (!msgText || typing) return;

            setInput('');
            setTyping(true);

            // Ensure session exists
            let sessionId = currentSessionId;
            if (!sessionId) {
                const session = await createSession(msgText.slice(0, 50) || 'New Chat');
                if (session) {
                    sessionId = session.id;
                    setCurrentSessionId(sessionId);
                    localStorage.setItem(`ai_last_session_${userID}`, sessionId);
                    setSessions((prev) => [session, ...prev]);
                }
            }

            const userMsgId = Date.now();
            const userMsg = {
                id: userMsgId,
                role: 'user',
                content: msgText,
                type: 'text',
            };

            setMessages((prev) => [...prev, userMsg]);
            if (sessionId) await saveMessageToHistory(sessionId, userMsg);

            try {
                const formData = new URLSearchParams();
                formData.append('userID', userID);
                formData.append('message', msgText);
                formData.append('stream', 'false');

                const response = await fetchWithTimeout(`${API_BASE_URL}/chatbot/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString(),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const data = await response.json();

                let responseText = '';
                if (data.response) responseText = data.response;
                else if (data.message) responseText = data.message;
                else if (data.content) responseText = data.content;
                else responseText = JSON.stringify(data);

                const assistantMsg = {
                    id: userMsgId + 1,
                    role: 'assistant',
                    content: responseText,
                    type: 'text',
                    cached: data.cached || false,
                };

                setMessages((prev) => [...prev, assistantMsg]);
                if (sessionId) await saveMessageToHistory(sessionId, assistantMsg);

                // Update session title if first real message
                const realMsgCount = messages.filter((m) => m.type !== 'welcome').length;
                if (realMsgCount === 0 && sessionId) {
                    setSessions((prev) =>
                        prev.map((s) =>
                            s.id === sessionId ? { ...s, title: msgText.slice(0, 50) } : s
                        )
                    );
                }
            } catch (error) {
                console.error('Chat error:', error);
                const errMsg = {
                    id: userMsgId + 1,
                    role: 'assistant',
                    content: `❌ Xin lỗi, có lỗi xảy ra: ${error.message}. Vui lòng thử lại sau.`,
                    type: 'error',
                };
                setMessages((prev) => [...prev, errMsg]);
                if (sessionId) await saveMessageToHistory(sessionId, errMsg);
            } finally {
                setTyping(false);
            }
        },
        [input, typing, userID, currentSessionId, messages, createSession, saveMessageToHistory]
    );

    /* ── Upload CV ── */
    const handleFileUpload = useCallback(
        async (file) => {
            if (!file) return;

            const allowedTypes = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword',
            ];

            if (!allowedTypes.includes(file.type)) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        role: 'assistant',
                        content: '❌ Chỉ hỗ trợ file PDF và DOCX. Vui lòng upload lại.',
                        type: 'error',
                    },
                ]);
                return;
            }

            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        role: 'assistant',
                        content: '❌ File quá lớn. Vui lòng upload file dưới 10MB.',
                        type: 'error',
                    },
                ]);
                return;
            }

            // Ensure session
            let sessionId = currentSessionId;
            if (!sessionId) {
                const session = await createSession('Phân tích CV');
                if (session) {
                    sessionId = session.id;
                    setCurrentSessionId(sessionId);
                    localStorage.setItem(`ai_last_session_${userID}`, sessionId);
                    setSessions((prev) => [session, ...prev]);
                }
            }

            const blobUrl = URL.createObjectURL(file);
            setUploadedCV({ name: file.name, size: file.size, type: file.type, url: blobUrl });

            const uploadMsg = {
                id: Date.now(),
                role: 'user',
                content: null,
                type: 'cv_upload',
                fileName: file.name,
                fileUrl: blobUrl,
                fileSize: file.size,
            };
            setMessages((prev) => [...prev, uploadMsg]);
            if (sessionId) await saveMessageToHistory(sessionId, uploadMsg);

            setIsUploading(true);
            setTyping(true);

            try {
                const formData = new FormData();
                formData.append('userID', userID);
                formData.append('file', file);

                const response = await fetchWithTimeout(`${API_BASE_URL}/chatbot/upload-cv`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                    },
                    body: formData,
                }, 600000); // timeout 10 phút, khớp với backend

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response. Please check API endpoint.');
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP ${response.status}`);
                }

                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Upload failed');

                if (data.analysis) setCvAnalysis(data.analysis);

                // Build display message
                let displayMessage = data.message || '';
                if (data.analysis) {
                    const a = data.analysis;
                    displayMessage = `✅ **Phân tích CV hoàn tất!**

**Đánh giá tổng quan:**
• Điểm format: **${a.format_score}/10**
• Cấp bậc phù hợp: **${a.suitable_level}**
• Kinh nghiệm: **${a.experience_years} năm**

**Điểm mạnh:**
${a.strengths?.map((s) => `• ${s}`).join('\n') || '• Chưa có thông tin'}

**Cần cải thiện:**
${a.weaknesses?.map((w) => `• ${w}`).join('\n') || '• Chưa có thông tin'}

**Kỹ năng nhận diện:** ${a.extracted_skills?.join(', ') || 'Chưa nhận diện được'}`;
                }

                const analysisMsg = {
                    id: Date.now(),
                    role: 'assistant',
                    content: displayMessage,
                    type: 'cv_analysis',
                    analysis: data.analysis,
                    jobMatches: data.job_matches || [],
                };

                setMessages((prev) => [...prev, analysisMsg]);
                if (sessionId) await saveMessageToHistory(sessionId, analysisMsg);
            } catch (error) {
                console.error('Upload error:', error);
                const errMsg = {
                    id: Date.now(),
                    role: 'assistant',
                    content: `❌ **Lỗi upload CV:** ${error.message}\n\nVui lòng thử lại sau hoặc liên hệ hỗ trợ nếu lỗi tiếp tục xảy ra.`,
                    type: 'error',
                };
                setMessages((prev) => [...prev, errMsg]);
                if (sessionId) await saveMessageToHistory(sessionId, errMsg);
            } finally {
                setIsUploading(false);
                setTyping(false);
            }
        },
        [userID, currentSessionId, createSession, saveMessageToHistory]
    );

    const send = (text) => {
        if (text) sendMessage(text);
        else sendMessage();
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
        e.target.value = '';
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleJobClick = useCallback((job) => {
        // Tạo message để focus vào job
        const focusMessage = `Cho tôi biết thêm về job "${job.job_title}" tại ${job.company}`;
        setInput(focusMessage);
        inputRef.current?.focus();
    }, []);


    /* ── Rename Session ── */
    const renameSession = useCallback(async (sessionId, newTitle) => {
        if (!newTitle || !newTitle.trim()) return;

        setRenaming(true);
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/chat-history/rename-session/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include',
                body: JSON.stringify({ title: newTitle.trim() }),
            });

            if (!response.ok) throw new Error('Rename failed');

            // Cập nhật local state
            setSessions(prev => prev.map(session =>
                session.id === sessionId
                    ? { ...session, title: newTitle.trim() }
                    : session
            ));

        } catch (err) {
            console.error('Rename session error:', err);
        } finally {
            setRenaming(false);
            setEditingSessionId(null);
            setEditTitle('');
        }
    }, []);

    /* ── Pin Session ── */
    const pinSession = useCallback(async (sessionId, isPinned) => {
        try {
            const response = await fetchWithTimeout(`${API_BASE_URL}/chat-history/pin-session/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: 'include',
                body: JSON.stringify({ isPinned: !isPinned }),
            });

            if (!response.ok) throw new Error('Pin failed');

            // Cập nhật local state
            setSessions(prev => {
                const updated = prev.map(session =>
                    session.id === sessionId
                        ? { ...session, isPinned: !isPinned }
                        : session
                );
                // Sắp xếp: pinned lên đầu, sau đó theo updatedAt
                return updated.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
            });

        } catch (err) {
            console.error('Pin session error:', err);
        }
    }, []);

    /* ── Start Rename ── */
    const startRename = (session, e) => {
        e.stopPropagation();
        setEditingSessionId(session.id);
        setEditTitle(session.title || 'New Chat');
    };

    /* ── Handle Rename Key Press ── */
    const handleRenameKeyPress = (e, sessionId) => {
        if (e.key === 'Enter') {
            renameSession(sessionId, editTitle);
        } else if (e.key === 'Escape') {
            setEditingSessionId(null);
            setEditTitle('');
        }
    };

    /* ── Render History Item ── */
    const renderHistoryItem = (session) => {
        const isEditing = editingSessionId === session.id;

        return (
            <div
                key={session.id}
                className={`ai-history-item${session.id === currentSessionId ? ' active' : ''}${session.isPinned ? ' pinned' : ''}`}
                onClick={() => !isEditing && loadSession(session.id)}
            >
                <span className="ai-history-icon">
                    {session.isPinned ? '📌' : '💬'}
                </span>

                {isEditing ? (
                    <input
                        type="text"
                        className="ai-history-edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyPress(e, session.id)}
                        onBlur={() => renameSession(session.id, editTitle)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="ai-history-title">
                        {session.title || 'New Chat'}
                    </span>
                )}

                <span className="ai-history-date">
                    {formatDate(session.updatedAt)}
                </span>

                <div className="ai-history-actions">
                    <button
                        className="ai-history-pin"
                        onClick={(e) => {
                            e.stopPropagation();
                            pinSession(session.id, session.isPinned);
                        }}
                        title={session.isPinned ? 'Bỏ ghim' : 'Ghim'}
                    >
                        {session.isPinned ? '📌' : '📍'}
                    </button>

                    <button
                        className="ai-history-rename"
                        onClick={(e) => startRename(session, e)}
                        title="Đổi tên"
                    >
                        ✏️
                    </button>

                    <button
                        className="ai-history-delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                        }}
                        title="Xóa"
                    >
                        🗑
                    </button>
                </div>
            </div>
        );
    };

    // Sắp xếp sessions: pinned lên đầu
    const sortedSessions = [...sessions].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    /* ── Render ── */
    return (
        <div className="ai-page">
            {/* Header */}
            <div className="ai-header">
                <div className="ai-header-inner">
                    <div className="ai-header-brand">
                        <div className="ai-header-av">🤖</div>
                        <div>
                            <div className="ai-header-name">GZConnect AI Assistant</div>
                            <div className="ai-header-status">
                                <span className="ai-status-dot" />
                                {typing ? 'Đang trả lời...' : 'Sẵn sàng'}
                            </div>
                        </div>
                    </div>
                    <div className="ai-header-actions">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            className="ai-hbtn danger"
                            onClick={() => setMessages(INITIAL_MESSAGES)}
                        >
                            🗑 Xoá chat
                        </button>
                    </div>
                </div>
            </div>

            <div className="ai-layout">
                {/* ── History Sidebar ── */}
                {showHistory && (
                    <aside className="ai-history-panel">
                        <div className="ai-history-header">
                            <button className="ai-new-chat-btn" onClick={() => startNewChat(true)}>
                                <span>+</span> New Chat
                            </button>
                        </div>
                        <div className="ai-history-list">
                            {loadingHistory && sessions.length === 0 && (
                                <div className="ai-history-empty">Đang tải...</div>
                            )}
                            {sortedSessions.map((session) => renderHistoryItem(session))}
                            {sessions.length === 0 && !loadingHistory && (
                                <div className="ai-history-empty">Chưa có cuộc trò chuyện</div>
                            )}
                        </div>
                    </aside>
                )}

                {/* ── Chat Area ── */}
                <div className="ai-chat-area">
                    <div className="ai-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`ai-msg-wrap${msg.role === 'user' ? ' user' : ''}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="ai-msg-av-wrap">
                                        <div className="ai-msg-av">🤖</div>
                                    </div>
                                )}
                                <div className={`ai-bubble${msg.role === 'user' ? ' user' : ''}`}>
                                    {/* Welcome */}
                                    {msg.type === 'welcome' && (
                                        <div className="ai-welcome">
                                            <div className="ai-welcome-wave">👋</div>
                                            <div className="ai-welcome-title">
                                                {cvAnalysis
                                                    ? `Xin chào, ${cvAnalysis.suitable_level || 'ứng viên'}!`
                                                    : 'Xin chào!'}
                                            </div>
                                            <div className="ai-welcome-sub">
                                                Tôi là <strong>GZCONNECT AI</strong> — trợ lý tìm việc
                                                thông minh.
                                                {cvAnalysis && (
                                                    <div style={{ marginTop: 8 }}>
                                                        CV của bạn:{' '}
                                                        <strong>{cvAnalysis.format_score}/10</strong>{' '}
                                                        · Cấp bậc:{" "}
                                                        <strong>{cvAnalysis.suitable_level}</strong>{' '}
                                                        · Kinh nghiệm:{" "}
                                                        <strong>
                                                            {cvAnalysis.experience_years} năm
                                                        </strong>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ai-welcome-chips">
                                                {QUICK_PROMPTS.map((p) => (
                                                    <button
                                                        key={p}
                                                        className="ai-welcome-chip"
                                                        onClick={() => send(p)}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Text / Error */}
                                    {(msg.type === 'text' || msg.type === 'error') && msg.content && (
                                        <>
                                            <MdText text={msg.content} />
                                            {msg.streaming && <span className="ai-cursor">▊</span>}
                                            {msg.cached && (
                                                <span className="ai-cached-badge">⚡ Cached</span>
                                            )}
                                        </>
                                    )}

                                    {/* CV Upload (user) */}
                                    {msg.type === 'cv_upload' && (
                                        <CVAttachment
                                            fileName={msg.fileName}
                                            fileUrl={msg.fileUrl}
                                            fileSize={msg.fileSize}
                                            setPreviewFile={setPreviewFile}
                                        />
                                    )}

                                    {/* CV Analysis (assistant) */}
                                    {msg.type === 'cv_analysis' && (
                                        <>
                                            {msg.content && <MdText text={msg.content} />}
                                            {msg.analysis && (
                                                <div className="ai-analysis-summary">
                                                    <div className="ai-analysis-score">
                                                        <span>
                                                            Điểm CV:{" "}
                                                            <strong>
                                                                {msg.analysis.format_score}/10
                                                            </strong>
                                                        </span>
                                                        <span>
                                                            Cấp bậc:{" "}
                                                            <strong>
                                                                {msg.analysis.suitable_level}
                                                            </strong>
                                                        </span>
                                                        <span>
                                                            Kinh nghiệm:{" "}
                                                            <strong>
                                                                {msg.analysis.experience_years} năm
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {msg.jobMatches?.length > 0 && (
                                                <div className="ai-jobs-section">
                                                    <div className="ai-jobs-title">
                                                        🎯 {msg.jobMatches.length} việc làm phù hợp (điểm {">"}50%)
                                                    </div>
                                                    <div className="ai-jobs-list">
                                                        {msg.jobMatches
                                                            .filter(job => job.match_score >= 50)
                                                            .map((job) => (
                                                                <JobMatchCard
                                                                    key={job.job_id}
                                                                    job={job}
                                                                    onSelect={handleJobClick}
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Jobs list (legacy) */}
                                    {msg.type === 'jobs' && (
                                        <>
                                            {msg.content && <MdText text={msg.content} />}
                                            <div className="ai-jobs-list">
                                                {(msg.jobs || []).map((j) => (
                                                    <InlineJobCard key={j.id} job={j} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="ai-msg-av-wrap">
                                        <div className="ai-msg-av user-av">
                                            {user?.fullName?.[0] || 'U'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {typing && !messages.some((m) => m.streaming) && (
                            <div className="ai-msg-wrap">
                                <div className="ai-msg-av-wrap">
                                    <div className="ai-msg-av">🤖</div>
                                </div>
                                <div className="ai-bubble">
                                    <div className="ai-typing">
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="ai-quick-bar">
                        {QUICK_PROMPTS.slice(0, 4).map((p) => (
                            <button key={p} className="ai-quick-chip" onClick={() => send(p)}>
                                {p}
                            </button>
                        ))}
                    </div>

                    <div className="ai-input-wrap">
                        <div className="ai-input-box">
                            <textarea
                                ref={inputRef}
                                className="ai-input"
                                placeholder="Hỏi tôi bất cứ điều gì về tìm việc..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                rows={1}
                                disabled={typing}
                            />
                            <div className="ai-input-actions">
                                <button
                                    className="ai-input-btn"
                                    title="Đính kèm CV"
                                    onClick={triggerFileUpload}
                                >
                                    📎
                                </button>
                                <button
                                    className={`ai-send-btn${input.trim() && !typing ? ' active' : ''
                                        }`}
                                    onClick={() => send()}
                                    disabled={!input.trim() || typing}
                                >
                                    ↑
                                </button>
                            </div>
                        </div>
                        <div className="ai-input-hint">
                            Enter để gửi · Shift+Enter để xuống dòng
                            {typing && ' · Đang nhận phản hồi...'}
                        </div>
                    </div>
                </div>

                {previewFile && (
                    <div className="cv-modal-overlay" onClick={() => setPreviewFile(null)}>
                        <div className="cv-modal" onClick={(e) => e.stopPropagation()}>

                            {/* Header */}
                            <div className="cv-modal-header">
                                <div className="cv-modal-title">{previewFile.name}</div>
                                <button
                                    className="cv-modal-close"
                                    onClick={() => setPreviewFile(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="cv-modal-body">
                                {/* PDF / file preview */}
                                {previewFile.url ? (

                                    <embed
                                        src={previewFile.url}
                                        type="application/pdf"
                                        className="cv-preview-frame"
                                        title="CV Preview"

                                        width="100%"
                                        height="100%"
                                    />
                                ) : (
                                    <pre className="cv-preview-text">
                                        Loading...
                                    </pre>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}