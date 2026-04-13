import { useState, useEffect, useMemo } from 'react'
import { adminFetch } from '../../../utils/auth'
import './AdminRefunds.css'

const STATUS_LABEL = { pending: 'Chờ xử lý', approved: 'Đã duyệt', rejected: 'Từ chối' }
const STATUS_COLOR = { pending: '#B07A10', approved: '#2E6040', rejected: '#C0412A' }
const PAGE_SIZE = 8

function Pager({ page, total, onChange }) {
    if (total <= 1) return null

    const getPages = () => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
        const pages = []
        pages.push(1)
        if (page > 3) pages.push('...')
        for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i)
        if (page < total - 2) pages.push('...')
        pages.push(total)
        return pages
    }

    return (
        <div className="adm-pager">
            <button className="adm-pager__btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
            {getPages().map((p, i) =>
                p === '...'
                    ? <span key={`dot-${i}`} className="adm-pager__dots">…</span>
                    : <button key={p} className={`adm-pager__btn${page === p ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</button>
            )}
            <button className="adm-pager__btn" disabled={page === total} onClick={() => onChange(page + 1)}>›</button>
        </div>
    )
}

export default function AdminRefunds() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('all')
    const [modal, setModal] = useState(null)  // { type: 'detail'|'resolve', req, action? }
    const [note, setNote] = useState('')
    const [resolving, setResolving] = useState(false)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    const load = async () => {
        setLoading(true)
        try {
            const data = await adminFetch('/admin/refunds')
            setRequests(data)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const filtered = useMemo(() => {
        let list = filter === 'all' ? requests : requests.filter(r => r.status === filter)
        if (search.trim())
            list = list.filter(r =>
                r.userName.toLowerCase().includes(search.toLowerCase()) ||
                r.userEmail.toLowerCase().includes(search.toLowerCase())
            )
        return list
    }, [requests, filter, search])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const pendingCount = requests.filter(r => r.status === 'pending').length

    const openDetail = (req) => { setModal({ type: 'detail', req }); setNote('') }
    const openResolve = (req, action) => { setModal({ type: 'resolve', req, action }); setNote('') }

    const handleResolve = async () => {
        if (!modal) return
        setResolving(true)
        try {
            await adminFetch(`/admin/refunds/${modal.req.id}/resolve`, {
                method: 'PATCH',
                body: JSON.stringify({ action: modal.action, note }),
            })
            await load()
            setModal(null)
        } catch (err) { alert(err.message) }
        finally { setResolving(false) }
    }

    if (loading) return <div className="adm-db__loading">Đang tải...</div>
    if (error) return <div className="adm-db__error">⚠ {error}</div>

    return (
        <div className="adm-refunds">
            <div className="adm-refunds__header">
                <div>
                    <h1 className="adm-page-title">Yêu cầu hoàn tiền</h1>
                    <p className="adm-page-sub">
                        {requests.length} yêu cầu tổng ·
                        {pendingCount > 0
                            ? <span style={{ color: '#C0412A', fontWeight: 700 }}> {pendingCount} chờ xử lý</span>
                            : ' Không có yêu cầu chờ'}
                    </p>
                </div>
            </div>

            <div className="adm-users__filters">
                <div className="adm-search">
                    <span className="adm-search__ico">⌕</span>
                    <input className="adm-search__input" placeholder="Tìm theo tên hoặc email..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
                </div>
                <div className="adm-filter-group">
                    {['all', 'pending', 'approved', 'rejected'].map(s => (
                        <button key={s}
                            className={`adm-filter-btn${filter === s ? ' active' : ''}`}
                            onClick={() => { setFilter(s); setPage(1) }}>
                            {s === 'all' ? 'Tất cả' : STATUS_LABEL[s]}
                            {s === 'pending' && pendingCount > 0 &&
                                <span className="adm-refunds__badge">{pendingCount}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="adm-card">
                <table className="adm-table adm-refunds__table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Người dùng</th>
                            <th>Gói / Chu kỳ</th>
                            <th>Số tiền</th>
                            <th>Ngân hàng</th>
                            <th>Lý do</th>
                            <th>Ngày yêu cầu</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map(r => (
                            <tr key={r.id} className="adm-refunds__row" onClick={() => openDetail(r)}>
                                <td className="adm-table__muted">{r.id}</td>
                                <td>
                                    <div className="adm-table__name">{r.userName}</div>
                                    <div className="adm-table__muted" style={{ fontSize: 11 }}>{r.userEmail}</div>
                                </td>
                                <td>
                                    <span className={`adm-badge adm-badge--${r.planName.toLowerCase()}`}>{r.planName}</span>
                                    <div className="adm-table__muted" style={{ fontSize: 11, marginTop: 2 }}>
                                        {r.billing === 'yearly' ? 'Hàng năm' : 'Hàng tháng'}
                                    </div>
                                </td>
                                <td style={{ fontWeight: 700, color: '#C0412A' }}>
                                    {r.amount.toLocaleString('vi-VN')}đ
                                </td>
                                <td>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{r.bankName}</div>
                                    <div className="adm-table__muted" style={{ fontSize: 11 }}>{r.accountNumber}</div>
                                    <div className="adm-table__muted" style={{ fontSize: 11 }}>{r.accountName}</div>
                                </td>
                                <td>
                                    <div className="adm-refunds__reason" title={r.reason}>{r.reason}</div>
                                </td>
                                <td className="adm-table__muted">{r.createdAt}</td>
                                <td>
                                    <span className="adm-refunds__status"
                                        style={{ background: `${STATUS_COLOR[r.status]}18`, color: STATUS_COLOR[r.status] }}>
                                        {STATUS_LABEL[r.status]}
                                    </span>
                                    {r.note && (
                                        <div className="adm-table__muted" style={{ fontSize: 11, marginTop: 3 }} title={r.note}>
                                            📝 {r.note.length > 20 ? r.note.slice(0, 20) + '...' : r.note}
                                        </div>
                                    )}
                                </td>
                                <td onClick={e => e.stopPropagation()}>
                                    {r.status === 'pending' ? (
                                        <div className="adm-users__actions">
                                            <button className="adm-act-btn adm-act-btn--unlock"
                                                onClick={() => openResolve(r, 'approved')}>Duyệt</button>
                                            <button className="adm-act-btn adm-act-btn--lock"
                                                onClick={() => openResolve(r, 'rejected')}>Từ chối</button>
                                        </div>
                                    ) : (
                                        <span className="adm-table__muted" style={{ fontSize: 11 }}>{r.resolvedAt ?? '—'}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {paged.length === 0 && (
                            <tr>
                                <td colSpan={9} className="adm-table__empty">
                                    {search ? `Không tìm thấy kết quả cho "${search}"` : 'Không có yêu cầu nào'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="adm-users__pager">
                        <span className="adm-users__pager-info">
                            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} yêu cầu
                        </span>
                        <Pager page={page} total={totalPages} onChange={setPage} />
                    </div>
                )}
            </div>

            {modal?.type === 'detail' && (
                <div className="adm-modal-overlay" onClick={() => setModal(null)}>
                    <div className="adm-modal" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal__head">
                            <h3>Chi tiết yêu cầu #{modal.req.id}</h3>
                            <button onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="adm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            <div className="adm-refunds__confirm-info">
                                <div><span>Người dùng</span><strong>{modal.req.userName}</strong></div>
                                <div><span>Email</span><strong>{modal.req.userEmail}</strong></div>
                                <div><span>Gói dịch vụ</span><strong>{modal.req.planName} · {modal.req.billing === 'yearly' ? 'Hàng năm' : 'Hàng tháng'}</strong></div>
                                <div><span>Số tiền hoàn</span>
                                    <strong style={{ color: '#C0412A', fontSize: 15 }}>
                                        {modal.req.amount.toLocaleString('vi-VN')}đ
                                    </strong>
                                </div>
                            </div>

                            <div className="adm-refunds__confirm-info">
                                <div style={{ fontWeight: 700, color: '#1C1510', marginBottom: 4, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                                    Thông tin tài khoản nhận tiền
                                </div>
                                <div><span>Ngân hàng</span><strong>{modal.req.bankName}</strong></div>
                                <div><span>Số tài khoản</span><strong>{modal.req.accountNumber}</strong></div>
                                <div><span>Chủ tài khoản</span><strong>{modal.req.accountName}</strong></div>
                            </div>

                            <div className="adm-refunds__confirm-info">
                                <div style={{ fontWeight: 700, color: '#1C1510', marginBottom: 4, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                                    Lý do hoàn tiền
                                </div>
                                <div style={{ fontSize: 13, color: '#3D3028', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {modal.req.reason}
                                </div>
                            </div>

                            <div className="adm-refunds__confirm-info">
                                <div><span>Ngày yêu cầu</span><strong>{modal.req.createdAt}</strong></div>
                                <div><span>Trạng thái</span>
                                    <span className="adm-refunds__status"
                                        style={{ background: `${STATUS_COLOR[modal.req.status]}18`, color: STATUS_COLOR[modal.req.status] }}>
                                        {STATUS_LABEL[modal.req.status]}
                                    </span>
                                </div>
                                {modal.req.resolvedAt && <div><span>Ngày xử lý</span><strong>{modal.req.resolvedAt}</strong></div>}
                                {modal.req.note && <div><span>Ghi chú</span><strong>{modal.req.note}</strong></div>}
                            </div>
                        </div>

                        <div className="adm-modal__foot">
                            <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Đóng</button>
                            {modal.req.status === 'pending' && (
                                <>
                                    <button className="adm-modal__action-btn lock"
                                        onClick={() => { setModal(null); setTimeout(() => openResolve(modal.req, 'rejected'), 50) }}>
                                        ❌ Từ chối
                                    </button>
                                    <button className="adm-modal__action-btn unlock"
                                        onClick={() => { setModal(null); setTimeout(() => openResolve(modal.req, 'approved'), 50) }}>
                                        ✅ Duyệt
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {modal?.type === 'resolve' && (
                <div className="adm-modal-overlay" onClick={() => setModal(null)}>
                    <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
                        <div className="adm-modal__head">
                            <h3>{modal.action === 'approved' ? '✅ Duyệt hoàn tiền' : '❌ Từ chối hoàn tiền'}</h3>
                            <button onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="adm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div className="adm-refunds__confirm-info">
                                <div><span>Người dùng</span><strong>{modal.req.userName}</strong></div>
                                <div><span>Số tiền</span>
                                    <strong style={{ color: '#C0412A' }}>{modal.req.amount.toLocaleString('vi-VN')}đ</strong>
                                </div>
                                <div><span>Ngân hàng</span><strong>{modal.req.bankName}</strong></div>
                                <div><span>Số TK</span><strong>{modal.req.accountNumber}</strong></div>
                                <div><span>Chủ TK</span><strong>{modal.req.accountName}</strong></div>
                            </div>

                            {modal.action === 'approved' && (
                                <div className="adm-refunds__note-warn">
                                    💡 Vui lòng chuyển khoản thủ công trước khi duyệt.
                                </div>
                            )}

                            <div className="adm-form-field">
                                <label>Ghi chú {modal.action === 'rejected' && <span style={{ color: '#C0412A' }}>*</span>}</label>
                                <textarea className="adm-form-input" rows={3}
                                    placeholder={modal.action === 'approved'
                                        ? 'VD: Đã chuyển khoản lúc 10:30 ngày...'
                                        : 'Lý do từ chối...'}
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                        </div>
                        <div className="adm-modal__foot">
                            <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
                            <button
                                className={`adm-modal__action-btn ${modal.action === 'approved' ? 'unlock' : 'lock'}`}
                                onClick={handleResolve}
                                disabled={resolving || (modal.action === 'rejected' && !note.trim())}>
                                {resolving ? '⏳ Đang xử lý...'
                                    : modal.action === 'approved' ? '✅ Xác nhận duyệt' : '❌ Xác nhận từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}