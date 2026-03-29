import { useState, useMemo } from 'react'
import './AdminUsers.css'

const MOCK_USERS = [
  { id: 1, name: 'Nguyễn Văn An', email: 'vanan@gmail.com', plan: 'Enterprise', status: 'active', provider: 'local', joined: '18/03/2026' },
  { id: 2, name: 'Trần Thị Bích', email: 'thibich@yahoo.com', plan: 'Free', status: 'active', provider: 'google', joined: '17/03/2026' },
  { id: 3, name: 'Lê Hoàng Cường', email: 'hoangcuong@gmail.com', plan: 'Free', status: 'locked', provider: 'local', joined: '16/03/2026' },
  { id: 4, name: 'Phạm Minh Đức', email: 'minhduc@outlook.com', plan: 'Pro', status: 'active', provider: 'google', joined: '15/03/2026' },
  { id: 5, name: 'Đỗ Quốc Đạt', email: 'quocdat@gmail.com', plan: 'Free', status: 'locked', provider: 'local', joined: '14/03/2026' },
  { id: 6, name: 'Võ Thị Lan', email: 'vothilan@gmail.com', plan: 'Pro', status: 'active', provider: 'google', joined: '13/03/2026' },
  { id: 7, name: 'Hoàng Văn Mạnh', email: 'vanmanh@gmail.com', plan: 'Enterprise', status: 'active', provider: 'local', joined: '12/03/2026' },
  { id: 8, name: 'Ngô Thị Nga', email: 'thinga@yahoo.com', plan: 'Pro', status: 'locked', provider: 'local', joined: '11/03/2026' },
  { id: 9, name: 'Bùi Thanh Hải', email: 'thanhhai@gmail.com', plan: 'Free', status: 'active', provider: 'google', joined: '10/03/2026' },
  { id: 10, name: 'Lý Thị Kim', email: 'thikim@yahoo.com', plan: 'Free', status: 'active', provider: 'local', joined: '09/03/2026' },
  { id: 11, name: 'Trịnh Văn Long', email: 'vanlong@gmail.com', plan: 'Free', status: 'locked', provider: 'google', joined: '08/03/2026' },
  { id: 12, name: 'Phan Thị Mai', email: 'thimaipl@gmail.com', plan: 'Free', status: 'active', provider: 'google', joined: '07/03/2026' },
]

const STATUS_LABEL = { active: 'Hoạt động', locked: 'Đã khóa' }
const PROVIDER_LABEL = { local: '✉ Email', google: '⬛ Google' }
const PAGE_SIZE = 7

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFStatus] = useState('all')
  const [filterPlan, setFPlan] = useState('all')
  const [modal, setModal] = useState(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || u.status === filterStatus
    const matchPlan = filterPlan === 'all' || u.plan.toLowerCase() === filterPlan
    return matchSearch && matchStatus && matchPlan
  }), [users, search, filterStatus, filterPlan])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilter = (setter, val) => { setter(val); setPage(1) }

  const toggleStatus = id => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u
    ))
    setModal(null)
  }

  return (
    <div className="adm-users">
      <div className="adm-users__header">
        <h1 className="adm-page-title">Quản lý người dùng</h1>
        <p className="adm-page-sub">Tổng {users.length} tài khoản · {users.filter(u => u.status === 'locked').length} bị khóa</p>
      </div>

      <div className="adm-users__filters">
        <div className="adm-search">
          <span className="adm-search__ico">⌕</span>
          <input className="adm-search__input" placeholder="Tìm theo tên hoặc email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <div className="adm-filter-group">
          {['all', 'active', 'locked'].map(s => (
            <button key={s} className={`adm-filter-btn${filterStatus === s ? ' active' : ''}`}
              onClick={() => handleFilter(setFStatus, s)}>
              {s === 'all' ? 'Tất cả' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="adm-filter-group">
          {['all', 'free', 'pro', 'enterprise'].map(p => (
            <button key={p} className={`adm-filter-btn${filterPlan === p ? ' active' : ''}`}
              onClick={() => handleFilter(setFPlan, p)}>
              {p === 'all' ? 'Mọi gói' : p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-card">
        <table className="adm-table adm-users__table">
          <thead>
            <tr>
              <th>#</th><th>Họ tên</th><th>Email</th><th>Đăng nhập qua</th>
              <th>Gói</th><th>Trạng thái</th><th>Ngày đăng ký</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(u => (
              <tr key={u.id}>
                <td className="adm-table__muted">{u.id}</td>
                <td className="adm-table__name">{u.name}</td>
                <td className="adm-table__muted">{u.email}</td>
                <td className="adm-table__muted" style={{ fontSize: 11 }}>{PROVIDER_LABEL[u.provider]}</td>
                <td><span className={`adm-badge adm-badge--${u.plan.toLowerCase()}`}>{u.plan}</span></td>
                <td><span className={`adm-status adm-status--${u.status}`}>{STATUS_LABEL[u.status]}</span></td>
                <td className="adm-table__muted">{u.joined}</td>
                <td>
                  <div className="adm-users__actions">
                    <button className="adm-act-btn adm-act-btn--view"
                      onClick={() => setModal({ type: 'detail', user: u })}>Chi tiết</button>
                    <button
                      className={`adm-act-btn ${u.status === 'locked' ? 'adm-act-btn--unlock' : 'adm-act-btn--lock'}`}
                      onClick={() => setModal({ type: 'confirm', user: u })}>
                      {u.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={8} className="adm-table__empty">Không tìm thấy tài khoản nào</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="adm-users__pager">
            <span className="adm-users__pager-info">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} tài khoản
            </span>
            <div className="adm-pager">
              <button className="adm-pager__btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`adm-pager__btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="adm-pager__btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal detail */}
      {modal?.type === 'detail' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>Chi tiết tài khoản</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="adm-modal__body">
              <div className="adm-modal__av">{modal.user.name[0]}</div>
              <div className="adm-modal__name">{modal.user.name}</div>
              <div className="adm-modal__email">{modal.user.email}</div>
              <div className="adm-modal__rows">
                {[
                  ['ID tài khoản', modal.user.id],
                  ['Đăng nhập qua', PROVIDER_LABEL[modal.user.provider]],
                  ['Gói dịch vụ', modal.user.plan],
                  ['Trạng thái', STATUS_LABEL[modal.user.status]],
                  ['Ngày đăng ký', modal.user.joined],
                ].map(([k, v]) => (
                  <div className="adm-modal__row" key={k}>
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Đóng</button>
              <button
                className={`adm-modal__action-btn ${modal.user.status === 'locked' ? 'unlock' : 'lock'}`}
                onClick={() => toggleStatus(modal.user.id)}>
                {modal.user.status === 'locked' ? '🔓 Mở khóa' : '🔒 Vô hiệu hóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirm */}
      {modal?.type === 'confirm' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>{modal.user.status === 'locked' ? 'Mở khóa tài khoản?' : 'Vô hiệu hóa tài khoản?'}</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="adm-modal__body" style={{ paddingTop: 8 }}>
              <p className="adm-modal__confirm-text">
                {modal.user.status === 'locked'
                  ? `Tài khoản "${modal.user.name}" sẽ được mở khóa.`
                  : `Tài khoản "${modal.user.name}" sẽ bị vô hiệu hóa.`}
              </p>
            </div>
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button
                className={`adm-modal__action-btn ${modal.user.status === 'locked' ? 'unlock' : 'lock'}`}
                onClick={() => toggleStatus(modal.user.id)}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}