import { useState, useRef, useEffect, useCallback } from 'react';
import './AIScreen.css';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../../utils/auth';
import { useLocation } from 'react-router-dom';
import useUserStore from '../../../store/userStore';

const API_BASE_URL = 'http://localhost:3000/api';

const DEFAULT_QUICK_PROMPTS = [
    // '💰 Mức lương thị trường cho React Dev',
    '🔍 Tìm việc Remote 100%',
    '📈 Tips để tăng match score',
    '🤝 Chuẩn bị phỏng vấn',
];

const generateQuickPrompts = (profile) => {
    if (!profile) return DEFAULT_QUICK_PROMPTS;

    const prompts = [];

    if (profile.jobTitle) {
        prompts.push(`💰 Mức lương của ${profile.jobTitle}`);
        prompts.push(`📋 Tìm việc ${profile.jobTitle}`);
    }

    if (profile.industry?.name) {
        prompts.push(`📈 Xu hướng ngành ${profile.industry.name}`);
    }

    if (profile.skills && profile.skills.length > 0) {
        const topSkill = profile.skills[0]?.name || profile.skills[0];
        if (topSkill) {
            prompts.push(`🎯 Việc làm yêu cầu ${topSkill}`);
        }
    }

    if (profile.workingType) {
        prompts.push(`🔍 Tìm việc ${profile.workingType}`);
    }

    if (prompts.length < 4) {
        prompts.push(...DEFAULT_QUICK_PROMPTS.slice(0, 4 - prompts.length));
    }

    return prompts.sort(() => Math.random() - 0.5).slice(0, 5);
};

const INITIAL_MESSAGES = [
    {
        id: 'welcome',
        role: 'assistant',
        content: null,
        type: 'welcome',
    },
];

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

function MdText({ text }) {
    if (text == null) return null;

    const safeText = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
    const lines = safeText.split('\n');

    // Helper: phát hiện các dòng đặc biệt - LOOSER MATCH
    const isQuestionLine = (line) => {
        // Loại bỏ khoảng trắng đầu dòng rồi kiểm tra
        const trimmed = line.trim();
        return /^C[âa]u hỏi \d+:/i.test(trimmed);
    };
    
    const isAnswerLine = (line) => {
        const trimmed = line.trim();
        return /^C[âa]u trả lời:/i.test(trimmed);
    };
    
    const isSeparatorLine = (line) => line.trim() === '---';
    const isLoiKhuyenLine = (line) => /^Lời khuyên dành cho bạn:/i.test(line.trim());

    return (
        <div className="ai-md">
            {lines.map((line, i) => {
                if (!line.trim()) return <br key={i} />;

                const trimmedLine = line.trim();
                
                // 🔥 Xử lý dòng câu hỏi - dùng trimmedLine để kiểm tra
                if (isQuestionLine(line)) {
                    // Tìm vị trí dấu : trong dòng gốc
                    const colonIndex = line.indexOf(':');
                    const prefix = line.substring(0, colonIndex);
                    const content = line.substring(colonIndex + 1).trim();
                    
                    return (
                        <div key={i} className="ai-interview-question">
                            <strong className="question-prefix">{prefix}:</strong> {content}
                        </div>
                    );
                }

                // Xử lý dòng câu trả lời
                if (isAnswerLine(line)) {
                    const colonIndex = line.indexOf(':');
                    const prefix = line.substring(0, colonIndex);
                    const content = line.substring(colonIndex + 1).trim();
                    
                    return (
                        <div key={i} className="ai-interview-answer">
                            <strong className="answer-prefix">{prefix}:</strong> {content}
                        </div>
                    );
                }

                // Xử lý dòng Lời khuyên
                if (isLoiKhuyenLine(line)) {
                    return (
                        <div key={i} className="ai-advice-title">
                            <strong>💡 {line.trim()}</strong>
                        </div>
                    );
                }

                // Xử lý dòng separator
                if (isSeparatorLine(line)) {
                    return <hr key={i} className="ai-interview-separator" />;
                }

                // Xử lý bảng markdown
                if (trimmedLine.startsWith('|')) {
                    const cells = line.split('|').filter((c) => c.trim());
                    const isHeader = lines[i + 1]?.trim().startsWith('|---');
                    return (
                        <div
                            key={i}
                            className={`ai-table-row${isHeader ? ' ai-table-head' : ''}`}
                        >
                            {cells.map((c, j) => (
                                <span
                                    key={j}
                                    className="ai-table-cell"
                                    dangerouslySetInnerHTML={{
                                        __html: c.trim(),
                                    }}
                                />
                            ))}
                        </div>
                    );
                }

                // Xử lý bullet points
                if (trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ')) {
                    const content = line.replace(/^[•-] /, '');
                    return (
                        <div key={i} className="ai-list-item">
                            <span className="ai-bullet">•</span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: content
                                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                        .replace(/`(.+?)`/g, '<code>$1</code>'),
                                }}
                            />
                        </div>
                    );
                }

                // Xử lý markdown cơ bản cho dòng thường
                const parsed = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/`(.+?)`/g, '<code>$1</code>');

                return <p key={i} dangerouslySetInnerHTML={{ __html: parsed }} />;
            })}
        </div>
    );
}

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

// Thêm component CompanyCard trước component JobMatchCard (khoảng dòng 200-250)

function CompanyCard({ company, onSelect }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleCompanyClick = (e) => {
        e.stopPropagation();
        if (company.company_id) {
            navigate(`/companies/${company.company_id}`, {
                state: {
                    fromPath: location.pathname,
                    scrollY: window.scrollY,
                    company: company
                }
            });
        } else {
            navigate(`/jobs?company=${encodeURIComponent(company.company)}`);
        }
    };

    // Tính phần trăm match để hiển thị thanh progress
    const matchPercent = company.match_score;
    const barColor = matchPercent >= 80 ? '#10b981' : matchPercent >= 60 ? '#f59e0b' : '#6b7280';

    return (
        <div className="ai-company-card" onClick={() => onSelect?.(company)}>
            <div className="ai-company-header">
                <div className="ai-company-icon"> {company.company_logo
                    ? <img
                        src={company.company_logo}
                        alt={company.company}
                        onError={(e) => { e.target.onerror = null; e.target.replaceWith(Object.assign(document.createElement('span'), { textContent: '🏢' })) }}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }}
                    />
                    : '🏢'
                }</div>
                <div className="ai-company-info">
                    <div
                        className="ai-company-name"
                        onClick={handleCompanyClick}
                    >
                        {company.company}
                    </div>
                    {company.location && (
                        <div className="ai-company-location">📍 {company.location}</div>
                    )}
                </div>
                <div className="ai-company-salary-badge">
                    💰 {company.salary}
                </div>
            </div>

            <div className="ai-company-details">
                {company.company_size && (
                    <div className="ai-company-size">
                        👥 Quy mô: {company.company_size}
                    </div>
                )}
                {company.job_count && (
                    <div className="ai-company-job-count">
                        📋 Đang tuyển: {company.job_count} vị trí
                    </div>
                )}
            </div>

            {/* Thanh match score */}
            {matchPercent && (
                <div className="ai-company-match-bar">
                    <div className="ai-company-match-label">
                        <span>🎯 Mức độ phù hợp</span>
                        <span className="ai-company-match-percent">{matchPercent}%</span>
                    </div>
                    <div className="ai-company-match-progress-bg">
                        <div
                            className="ai-company-match-progress-fill"
                            style={{ width: `${matchPercent}%`, backgroundColor: barColor }}
                        />
                    </div>
                </div>
            )}

            {company.match_reasons && company.match_reasons.length > 0 && (
                <div className="ai-company-reasons">
                    {company.match_reasons.slice(0, 2).map((reason, idx) => (
                        <span key={idx} className="ai-company-reason">✅ {reason}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

function JobMatchCard({ job, onSelect }) {
    const navigate = useNavigate();
    const location = useLocation()

    // Trong JobMatchCard component, sửa phần navigate:
    const handleTitleClick = (e) => {
        e.stopPropagation();
        if (job.is_company_card && job.company_id) {
            // Nếu là card công ty, navigate sang trang chi tiết công ty
            navigate(`/companies/${job.company_id}`);
        } else if (job.job_id) {
            // Nếu là card job bình thường
            navigate(`/ai/jobs/${job.job_id}`, {
                state: {
                    fromPath: location.pathname,
                    scrollY: window.scrollY,
                    job: job
                }
            });
        }
    };
    return (
        <div className="ai-job-card" onClick={() => onSelect?.(job)}>
            <div className="ai-job-header">
                <div
                    className="ai-job-title"
                    onClick={handleTitleClick}
                >
                    {job.job_title}
                </div>
                <div
                    className={`ai-job-match${job.match_score >= 85 ? ' hi' : job.match_score >= 70 ? ' med' : ''}`}
                >
                    {job.match_score}%
                </div>
            </div>
            <div className="ai-job-co">🏢 {job.company}</div>
            <div className="ai-job-location">📍 {job.location || 'Chưa có thông tin'}</div>
            <div className="ai-job-salary">💰 {job.salary}</div>

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

function ErrorMessage({ message }) {
    return (
        <div className="ai-error-message">
            <div className="ai-error-text">{message || " ⚠️ Hiện tại chưa có thông tin mà bạn cần tìm"}</div>
            <div className="ai-error-suggestion">
                💡 Bạn có thể thử:
                <ul>
                    <li>Hỏi về việc làm theo kỹ năng của bạn</li>
                    <li>Upload CV để được phân tích</li>
                    <li>Hỏi về mức lương của một vị trí cụ thể</li>
                </ul>
            </div>
        </div>
    );
}


// ── Inline CV Uploader (dùng trong interview_questions, không cần triggerFileUpload) ──
function InlineCVUploader({ onFile }) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState(null);

    const ALLOWED = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
    ];

    const validate = (file) => {
        if (!ALLOWED.includes(file.type)) return 'Chỉ hỗ trợ PDF và DOCX';
        if (file.size > 10 * 1024 * 1024) return 'File quá lớn (tối đa 10MB)';
        return null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const err = validate(file);
        if (err) { alert(err); return; }
        setFileName(file.name);
        onFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const err = validate(file);
        if (err) { alert(err); return; }
        setFileName(file.name);
        onFile(file);
        e.target.value = '';
    };

    return (
        <div
            className={`ai-inline-cv-drop${dragging ? ' dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
        >
            <label className="ai-inline-cv-label">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={handleChange}
                />
                {fileName ? (
                    <div className="ai-inline-cv-selected">
                        <span className="ai-inline-cv-icon">📄</span>
                        <span className="ai-inline-cv-name">{fileName}</span>
                        <span className="ai-inline-cv-processing">⏳ Đang xử lý...</span>
                    </div>
                ) : (
                    <div className="ai-inline-cv-idle">
                        <span className="ai-inline-cv-icon">📎</span>
                        <div className="ai-inline-cv-text">
                            <strong>Kéo thả CV vào đây</strong>
                            <span>hoặc <u>click để chọn file</u></span>
                            <span className="ai-inline-cv-hint">PDF, DOCX · tối đa 10MB</span>
                        </div>
                    </div>
                )}
            </label>
        </div>
    );
}

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

function SalaryInfoCard({ position, stats, topCompanies }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleCompanyClick = (companyName) => {
        navigate(`/jobs?company=${encodeURIComponent(companyName)}`);
    };

    return (
        <div className="ai-salary-card">
            <div className="ai-salary-title">💰 Mức lương {position}</div>
            <div className="ai-salary-stats">
                <div className="ai-salary-range">
                    <strong>Trung bình:</strong> {stats.avg_salary || 'Chưa có dữ liệu'}
                </div>
                <div className="ai-salary-levels">
                    {stats.by_level && Object.entries(stats.by_level).map(([level, salary]) => (
                        <div key={level} className="ai-salary-level">
                            <span className="level-name">{level}:</span>
                            <span className="level-salary">{salary}</span>
                        </div>
                    ))}
                </div>
            </div>

            {topCompanies && topCompanies.length > 0 && (
                <div className="ai-top-companies">
                    <div className="ai-top-title">🏢 Công ty có mức lương cao nhất:</div>
                    {topCompanies.map((comp, idx) => (
                        <div
                            key={idx}
                            className="ai-company-item clickable"
                            onClick={() => handleCompanyClick(comp.company)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="company-name">{comp.company}</span>
                            <span className="company-salary">{comp.salary}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AIAssistantScreen({ onNavigate }) {
    const token = getToken()
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
    const [uploadedCV, setUploadedCV] = useState(null);

    const [editingSessionId, setEditingSessionId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [renaming, setRenaming] = useState(false);

    const bottomRef = useRef();
    const inputRef = useRef();
    const fileInputRef = useRef();
    const messagesContainerRef = useRef(null);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userID = user?.accountID;
    const [previewFile, setPreviewFile] = useState(null);
    const { profile, fetchProfile, loading } = useUserStore();
    const [quickPrompts, setQuickPrompts] = useState(DEFAULT_QUICK_PROMPTS);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const navigate = useNavigate()
    const [hasCv, setHasCv] = useState(false);

    const messagesRef = useRef(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);


    const saveCurrentMessages = useCallback(() => {
        if (userID && messages.length > 0 && !isRestoringRef.current) {
            const messagesToSave = messages.filter(m => m.type !== 'welcome');
            if (messagesToSave.length > 0) {
                sessionStorage.setItem(`ai_messages_${userID}`, JSON.stringify(messagesToSave));
            }
        }
    }, [userID, messages]);

    // Flag để tránh vòng lặp khi restore
    const isRestoringRef = useRef(false);

    useEffect(() => {
        if (messagesContainerRef.current && bottomRef.current) {
            const container = messagesContainerRef.current;
            const threshold = 200; // Chỉ auto-scroll nếu user đang ở gần dưới
            const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

            if (distanceFromBottom < threshold || typing) {
                // Dùng scrollTo trên container thay vì scrollIntoView
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [messages, typing]);

    useEffect(() => {
        return () => {
            if (uploadedCV?.url?.startsWith('blob:')) {
                URL.revokeObjectURL(uploadedCV.url);
            }
        };
    }, [uploadedCV]);

    const fetchSessions = useCallback(async () => {
        try {
            const res = await fetchWithTimeout(`${API_BASE_URL}/chat-history/get-sessions`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
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
                        'Authorization': `Bearer ${token}`
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
                    'Authorization': `Bearer ${token}`
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
                        'Authorization': `Bearer ${token}`
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
                        'Authorization': `Bearer ${token}`
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

    // ========== LOAD MESSAGES ==========
    useEffect(() => {
        if (!userID) return;

        const loadMessages = async () => {
            const savedMessages = sessionStorage.getItem(`ai_messages_${userID}`);
            const savedSessions = sessionStorage.getItem(`ai_sessions_${userID}`);

            // Khôi phục sessions từ sessionStorage nếu có
            if (savedSessions) {
                try {
                    const parsedSessions = JSON.parse(savedSessions);
                    if (parsedSessions?.length > 0) {
                        setSessions(parsedSessions);
                    }
                } catch (e) {
                    console.error('Failed to parse saved sessions:', e);
                }
            }

            // Khôi phục messages từ sessionStorage nếu có
            if (savedMessages) {
                try {
                    const parsed = JSON.parse(savedMessages);
                    if (parsed?.length > 0) {
                        isRestoringRef.current = true;
                        setMessages(parsed);
                        setInitialLoadDone(true);
                        setTimeout(() => { isRestoringRef.current = false; }, 100);

                        const lastCvMsg = parsed.slice().reverse().find(
                            (m) => m.analysis || m.type === 'cv_analysis'
                        );
                        if (lastCvMsg) {
                            setCvAnalysis(lastCvMsg.analysis || null);
                            setHasCv(true);
                        }

                        // Đồng bộ sessions từ API nếu chưa có trong storage
                        if (!savedSessions) {
                            const list = await fetchSessions();
                            setSessions(list);
                            if (list.length > 0) {
                                sessionStorage.setItem(`ai_sessions_${userID}`, JSON.stringify(list));
                            }
                        }
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse saved messages:', e);
                }
            }

            // Nếu không có trong storage, load từ API
            setLoadingHistory(true);
            try {
                const list = await fetchSessions();
                setSessions(list);
                if (list.length > 0) {
                    sessionStorage.setItem(`ai_sessions_${userID}`, JSON.stringify(list));
                }

                const lastId = localStorage.getItem(`ai_last_session_${userID}`);
                const targetSession = lastId ? list.find((s) => s.id === Number(lastId)) : list[0];

                if (targetSession) {
                    const msgs = await fetchMessages(targetSession.id);
                    // === SỬA 5: ID ổn định, tránh remount ===
                    const ui = msgs.length > 0
                        ? msgs.map((m, idx) => ({
                            id: m.id || `msg-${targetSession.id}-${idx}`,
                            role: m.role,
                            content: m.content,
                            type: m.type || 'text',
                            ...(m.metadata || {})
                        }))
                        : INITIAL_MESSAGES;
                    setMessages(ui);
                    setCurrentSessionId(targetSession.id);
                    localStorage.setItem(`ai_last_session_${userID}`, String(targetSession.id));
                    const lastA = msgs.slice().reverse().find((m) => m.metadata?.analysis);
                    if (lastA) {
                        setCvAnalysis(lastA.metadata.analysis);
                        setHasCv(true);
                    }
                } else {
                    setMessages(INITIAL_MESSAGES);
                    setCurrentSessionId(null);
                }
            } catch (err) {
                console.error('Failed to load from API:', err);
                setMessages(INITIAL_MESSAGES);
            } finally {
                setLoadingHistory(false);
                setInitialLoadDone(true);
            }
        };

        loadMessages();
    }, [userID]);

    // ========== SAVE SESSIONS TO SESSION STORAGE ==========
    useEffect(() => {
        if (userID && sessions.length > 0 && !isRestoringRef.current) {
            sessionStorage.setItem(`ai_sessions_${userID}`, JSON.stringify(sessions));
        }
    }, [sessions, userID]);

    // ========== SAVE MESSAGES ==========
    useEffect(() => {
        // 🔥 Chỉ lưu khi đã load xong và không đang restore
        if (userID && initialLoadDone && messages.length > 0 && !isRestoringRef.current) {
            // Không lưu nếu chỉ có welcome message và đã có messages khác
            const hasRealMessages = messages.some(m => m.type !== 'welcome');
            if (hasRealMessages) {
                const messagesToSave = messages.filter(m => m.type !== 'welcome');
                sessionStorage.setItem(`ai_messages_${userID}`, JSON.stringify(messagesToSave));
            } else if (messages.length === 1 && messages[0].type === 'welcome') {
                // Lưu cả welcome nếu là tin nhắn duy nhất
                sessionStorage.setItem(`ai_messages_${userID}`, JSON.stringify(messages));
            }
        }
    }, [messages, userID, initialLoadDone]);

    // ========== SAVE CV ANALYSIS ==========
    useEffect(() => {
        if (userID && cvAnalysis) {
            sessionStorage.setItem(`ai_cv_analysis_${userID}`, JSON.stringify(cvAnalysis));
        }
    }, [cvAnalysis, userID]);

    // ========== NEW CHAT ==========
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
        setHasCv(false);
        setInput('');
        if (userID) {
            sessionStorage.removeItem(`ai_messages_${userID}`);
            sessionStorage.removeItem(`ai_sessions_${userID}`);
            sessionStorage.removeItem(`ai_cv_analysis_${userID}`);
        }
    }, [userID, createSession]);

    // ========== LOAD OLD SESSION ==========
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
        setHasCv(!!lastA);
        setLoadingHistory(false);
    }, [userID, fetchMessages]);

    // ========== SEND MESSAGE ==========
    const sendMessage = useCallback(
        async (text) => {
            const msgText = text || input.trim();
            if (!msgText || typing) return;

            setInput('');
            setTyping(true);

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
            saveCurrentMessages();
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

                if (data.type === 'job_list' && data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
                    const assistantMsg = {
                        id: userMsgId + 1,
                        role: 'assistant',
                        content: data.content ?? '',
                        type: 'job_list',
                        jobs: data.jobs,
                        cached: data.cached || false,
                    };
                    setMessages((prev) => [...prev, assistantMsg]);
                    if (sessionId) await saveMessageToHistory(sessionId, assistantMsg);
                }
                else if (data.type === 'cv_analysis_complete' && data.job_matches && Array.isArray(data.job_matches)) {
                    const assistantMsg = {
                        id: userMsgId + 1,
                        role: 'assistant',
                        content: data.message || data.content || `Phân tích CV: Tìm thấy ${data.job_matches.length} việc làm phù hợp`,
                        type: 'cv_analysis',
                        analysis: data.analysis,
                        jobMatches: data.job_matches,
                        cached: data.cached || false,
                    };
                    setMessages((prev) => [...prev, assistantMsg]);
                    if (sessionId) await saveMessageToHistory(sessionId, assistantMsg);
                } // Trong phần xử lý response của sendMessage, thêm case cho interview_questions:
                else if (data.type === 'interview_questions') {
                    console.log('📋 Interview questions data:', data);
                    console.log('📋 Response content:', data.response);
                    console.log('📋 Message content:', data.message);
                    console.log('📋 Content:', data.content);

                    const assistantMsg = {
                        id: userMsgId + 1,
                        role: 'assistant',
                        content: data.response || data.message || data.content || '',
                        type: 'interview_questions',
                        cached: data.cached || false,
                    };
                    setMessages((prev) => {
                        // Kiểm tra xem đã có message trùng chưa
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg && lastMsg.type === 'interview_questions' && lastMsg.content === assistantMsg.content) {
                            return prev;
                        }
                        return [...prev, assistantMsg];
                    });
                    if (sessionId) await saveMessageToHistory(sessionId, assistantMsg);
                }
                else {
                    let responseText = '';
                    if (data.response) responseText = data.response;
                    else if (data.message) responseText = data.message;
                    else if (data.content) responseText = data.content;
                    else responseText = JSON.stringify(data);

                    const assistantMsg = {
                        id: userMsgId + 1,
                        role: 'assistant',
                        content: responseText,
                        type: data.type === 'error' ? 'error' : 'text',
                        cached: data.cached || false,
                    };
                    setMessages((prev) => [...prev, assistantMsg]);
                    if (sessionId) await saveMessageToHistory(sessionId, assistantMsg);
                }

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

    // ========== UPLOAD CV ==========
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

                if (data.analysis) {
                    setCvAnalysis(data.analysis);
                    setHasCv(true);
                }

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


    const handleInterviewCVUpload = useCallback(async (file) => {
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        if (!allowedTypes.includes(file.type)) {
            alert('Chỉ hỗ trợ file PDF và DOCX');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File quá lớn (tối đa 10MB)');
            return;
        }

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

        // Hiện CV attachment trong chat
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
            // Upload CV
            const formData = new FormData();
            formData.append('userID', userID);
            formData.append('file', file);

            const uploadRes = await fetchWithTimeout(`${API_BASE_URL}/chatbot/upload-cv`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${getToken()}` },
                body: formData,
            }, 600000);

            const uploadData = await uploadRes.json();
            if (!uploadData.success) throw new Error(uploadData.message || 'Upload failed');

            if (uploadData.analysis) {
                setCvAnalysis(uploadData.analysis);
                setHasCv(true);
            }

            // 🔥 QUAN TRỌNG: Gửi message yêu cầu câu hỏi phỏng vấn dựa trên CV và JD đã có
            // Lấy JD từ session (lưu khi user dán JD)
            const chatParams = new URLSearchParams();
            chatParams.append('userID', userID);
            chatParams.append('message', 'Đưa ra danh sách câu hỏi dựa theo JD trước đó + câu trả lời cá nhân hóa theo CV vừa upload');
            chatParams.append('stream', 'false');

            const chatRes = await fetchWithTimeout(`${API_BASE_URL}/chatbot/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: chatParams.toString(),
            });

            const chatData = await chatRes.json();

            // Lấy nội dung từ response
            let personalizedContent = '';
            if (chatData.type === 'interview_questions') {
                personalizedContent = chatData.response || chatData.message || chatData.content || '';
            } else {
                personalizedContent = chatData.response || chatData.message || chatData.content || '';
            }

            // Nếu không có nội dung, hiển thị thông báo mặc định
            if (!personalizedContent) {
                personalizedContent = '✅ Đã phân tích CV xong. Vui lòng yêu cầu "Đưa ra câu hỏi phỏng vấn" để nhận câu trả lời cá nhân hóa.';
            }

            const personalizedMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: personalizedContent,
                type: 'interview_questions',
                personalized: true,
                hasCv: true,
                cached: chatData.cached || false,
            };
            setMessages((prev) => [...prev, personalizedMsg]);
            if (sessionId) await saveMessageToHistory(sessionId, personalizedMsg);

        } catch (error) {
            console.error('Interview CV upload error:', error);
            const errMsg = {
                id: Date.now(),
                role: 'assistant',
                content: `❌ Lỗi xử lý CV: ${error.message}`,
                type: 'error',
            };
            setMessages((prev) => [...prev, errMsg]);
            if (sessionId) await saveMessageToHistory(sessionId, errMsg);
        } finally {
            setIsUploading(false);
            setTyping(false);
        }
    }, [userID, currentSessionId, createSession, saveMessageToHistory]);

    // ✅ MỚI
    const handleJobClick = useCallback(async (job) => {
        saveCurrentMessages();

        // Nếu là card công ty -> chuyển sang trang công ty
        if (job.is_company_card) {
            if (job.company_id) {
                navigate(`/companies/${job.company_id}`);
            } else {
                navigate(`/jobs?company=${encodeURIComponent(job.company)}`);
            }
            return;
        }

        // Tạo câu hỏi để gửi lên chatbot
        const queryMessage = `Cho tôi biết thêm về job "${job.job_title}" tại ${job.company}`;

        setTyping(true);

        // Tạo session mới nếu chưa có
        let sessionId = currentSessionId;
        if (!sessionId) {
            const session = await createSession(queryMessage.slice(0, 50));
            if (session) {
                sessionId = session.id;
                setCurrentSessionId(sessionId);
                localStorage.setItem(`ai_last_session_${userID}`, sessionId);
                setSessions((prev) => [session, ...prev]);
            }
        }

        // Thêm tin nhắn user
        const userMsgId = Date.now();
        const userMsg = {
            id: userMsgId,
            role: 'user',
            content: queryMessage,
            type: 'text',
        };
        setMessages((prev) => [...prev, userMsg]);
        if (sessionId) await saveMessageToHistory(sessionId, userMsg);

        // Gọi API chat
        try {
            const formData = new URLSearchParams();
            formData.append('userID', userID);
            formData.append('message', queryMessage);
            formData.append('stream', 'false');

            const response = await fetchWithTimeout(`${API_BASE_URL}/chatbot/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
            });

            const data = await response.json();
            let responseText = data.response || data.message || data.content || JSON.stringify(data);

            const assistantMsg = {
                id: userMsgId + 1,
                role: 'assistant',
                content: responseText,
                type: data.type === 'error' ? 'error' : 'text',
                cached: data.cached || false,
            };
            setMessages((prev) => [...prev, assistantMsg]);
            if (sessionId) await saveMessageToHistory(sessionId, assistantMsg);
        } catch (error) {
            console.error('Job detail error:', error);
            const errMsg = {
                id: userMsgId + 1,
                role: 'assistant',
                content: `❌ Không thể lấy thông tin chi tiết: ${error.message}`,
                type: 'error',
            };
            setMessages((prev) => [...prev, errMsg]);
            if (sessionId) await saveMessageToHistory(sessionId, errMsg);
        } finally {
            setTyping(false);
        }
    }, [saveCurrentMessages, navigate, userID, currentSessionId, createSession, saveMessageToHistory]);

    // ========== RENAME SESSION ==========
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

    // ========== PIN SESSION ==========
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

            setSessions(prev => {
                const updated = prev.map(session =>
                    session.id === sessionId
                        ? { ...session, isPinned: !isPinned }
                        : session
                );
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

    const startRename = (session, e) => {
        e.stopPropagation();
        setEditingSessionId(session.id);
        setEditTitle(session.title || 'New Chat');
    };

    const handleRenameKeyPress = (e, sessionId) => {
        if (e.key === 'Enter') {
            renameSession(sessionId, editTitle);
        } else if (e.key === 'Escape') {
            setEditingSessionId(null);
            setEditTitle('');
        }
    };

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

    const sortedSessions = [...sessions].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            const newPrompts = generateQuickPrompts(profile);
            setQuickPrompts(newPrompts);
        }
    }, [profile]);

    return (
        <div className="ai-page">
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
                                    {msg.type === 'welcome' && (
                                        <div className="ai-welcome">
                                            <div className="ai-welcome-wave">👋</div>
                                            <div className="ai-welcome-title">
                                                {cvAnalysis
                                                    ? `Xin chào, ${cvAnalysis.suitable_level || 'ứng viên'}!`
                                                    : 'Xin chào!'}
                                            </div>
                                            <div className="ai-welcome-sub">
                                                Tôi là <strong>GZCONNECT AI</strong> — trợ lý tìm việc thông minh.
                                                {cvAnalysis && (
                                                    <div style={{ marginTop: 8 }}>
                                                        CV của bạn: <strong>{cvAnalysis.format_score}/10</strong> · Cấp bậc: <strong>{cvAnalysis.suitable_level}</strong> · Kinh nghiệm: <strong>{cvAnalysis.experience_years} năm</strong>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ai-welcome-chips">
                                                {quickPrompts.map((p) => (
                                                    <button key={p} className="ai-welcome-chip" onClick={() => send(p)}>
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {msg.type === 'text' && msg.content && (
                                        <>
                                            <MdText text={msg.content} />
                                            {msg.streaming && <span className="ai-cursor">▊</span>}
                                            {msg.cached && <span className="ai-cached-badge">⚡ Cached</span>}
                                        </>
                                    )}

                                    {msg.type == 'error' && (
                                        <ErrorMessage message={msg.content} />
                                    )}


                                    {msg.type === 'cv_upload' && (
                                        <CVAttachment
                                            fileName={msg.fileName}
                                            fileUrl={msg.fileUrl}
                                            fileSize={msg.fileSize}
                                            setPreviewFile={setPreviewFile}
                                        />
                                    )}

                                    {msg.type === 'cv_analysis' && (
                                        <>
                                            {msg.content && <MdText text={msg.content} />}
                                            {msg.analysis && (
                                                <div className="ai-analysis-summary">
                                                    <div className="ai-analysis-score">
                                                        <span>Điểm CV: <strong>{msg.analysis.format_score}/10</strong></span>
                                                        <span>Cấp bậc: <strong>{msg.analysis.suitable_level}</strong></span>
                                                        <span>Kinh nghiệm: <strong>{msg.analysis.experience_years} năm</strong></span>
                                                    </div>
                                                </div>
                                            )}
                                            {msg.jobMatches?.length > 0 && (
                                                <div className="ai-jobs-section">
                                                    <div className="ai-jobs-title">
                                                        🎯 {msg.jobMatches.length} việc làm phù hợp (điểm &gt;50%)
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

                                    {msg.type === 'job_list' && (
                                        msg.jobs && msg.jobs.length > 0 ? (
                                            <div className="ai-jobs-section">
                                                {msg.content && msg.jobs.some(item => item.is_company_card) && (
                                                    <MdText text={msg.content} />
                                                )}
                                                <div className="ai-jobs-title">
                                                    {msg.jobs.every(item => item.is_company_card)
                                                        ? `🏢 ${msg.jobs.length} công ty có mức lương cao nhất`
                                                        : `💼 ${msg.jobs.length} công việc phù hợp`
                                                    }
                                                </div>
                                                <div className="ai-jobs-list">
                                                    {msg.jobs.map((item, idx) =>
                                                        item.is_company_card
                                                            ? <CompanyCard key={`${item.job_id}-${idx}`} company={item} onSelect={handleJobClick} />
                                                            : <JobMatchCard key={`${item.job_id}-${idx}`} job={item} onSelect={handleJobClick} />
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            // jobs rỗng — không có job nào >= 50%
                                            <div className="ai-bubble-text">
                                                🔍 Không tìm thấy công việc phù hợp (độ phù hợp &lt; 50%). Hãy thử từ khóa khác hoặc cập nhật CV để tăng độ phù hợp.
                                            </div>
                                        )
                                    )}

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


                                    {msg.type === 'interview_questions' && (
                                        <div className="ai-interview-section">
                                            {/* Hiển thị nội dung markdown từ backend */}
                                            <MdText text={msg.content} />

                                            {/* Badge cá nhân hóa */}
                                            {msg.personalized && (
                                                <div className="ai-personalized-badge">
                                                    ✨ Đã cá nhân hóa theo CV của bạn
                                                </div>
                                            )}

                                            {/* Chỉ hiển thị phần upload CV khi chưa có CV và chưa được cá nhân hóa */}
                                            {!hasCv && !msg.personalized && (
                                                <div className="ai-upload-cv-prompt">
                                                    <div className="ai-upload-cv-header">
                                                        <span className="ai-upload-cv-title">🎯 Cá nhân hóa câu trả lời theo CV của bạn</span>
                                                        <p className="ai-upload-cv-desc">Upload CV để AI tạo câu trả lời phỏng vấn phù hợp chính xác với kinh nghiệm và kỹ năng của bạn</p>
                                                    </div>
                                                    <InlineCVUploader onFile={handleInterviewCVUpload} />
                                                </div>
                                            )}
                                        </div>
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
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="ai-quick-bar">
                        {quickPrompts.slice(0, 4).map((p) => (
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
                                    className={`ai-send-btn${input.trim() && !typing ? ' active' : ''}`}
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
                            <div className="cv-modal-header">
                                <div className="cv-modal-title">{previewFile.name}</div>
                                <button className="cv-modal-close" onClick={() => setPreviewFile(null)}>✕</button>
                            </div>
                            <div className="cv-modal-body">
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
                                    <pre className="cv-preview-text">Loading...</pre>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}