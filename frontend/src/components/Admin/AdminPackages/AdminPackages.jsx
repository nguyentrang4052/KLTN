import { useState, useEffect } from 'react'
import { adminFetch } from '../../../utils/auth'
import './AdminPackages.css'

const FEATURE_LABELS = {
  dailyJobSuggestions: 'Đề xuất việc làm / ngày',
  cvAnalysis: 'Phân tích CV / tháng',
  compatibilityCheck: 'Kiểm tra độ phù hợp CV',
}

const EMPTY_FORM = { name: '', monthlyPrice: 0, yearlyPrice: 0, dailyJobSuggestions: 5, cvAnalysis: 1, compatibilityCheck: 3 }


const PALETTE = [
  { color: '#6B5E50', bg: '#F5F0E8' },
  { color: '#342893', bg: '#ECEAF8' },
  { color: '#C0412A', bg: '#FAEAE6' },
  { color: '#2E6040', bg: '#E8F2EC' },
  { color: '#B07A10', bg: '#FBF3E0' },
]

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadPackages = async () => {
    try {
      const data = await adminFetch('/admin/packages')
      setPackages(data.map((p, i) => ({ ...p, ...PALETTE[i % PALETTE.length] })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPackages() }, [])

  const openEdit = pkg => {
    setForm({
      id: pkg.id,
      name: pkg.name,
      monthlyPrice: pkg.monthlyPrice,
      yearlyPrice: pkg.yearlyPrice,
      dailyJobSuggestions: pkg.features.dailyJobSuggestions,
      cvAnalysis: pkg.features.cvAnalysis,
      compatibilityCheck: pkg.features.compatibilityCheck,
    })
    setModal('edit')
  }

  const savePackage = async () => {
    if (!form.name?.trim()) return
    try {
      await adminFetch(`/admin/packages/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: form.name,
          monthlyPrice: Number(form.monthlyPrice),
          yearlyPrice: Number(form.yearlyPrice),
          dailyJobSuggestions: Number(form.dailyJobSuggestions),
          cvAnalysis: Number(form.cvAnalysis),
          compatibilityCheck: Number(form.compatibilityCheck),
        }),
      })
      await loadPackages()
      setModal(null)
    } catch (err) { alert(err.message) }
  }

  const createPackage = async () => {
    if (!form.name?.trim()) return
    try {
      await adminFetch('/admin/packages', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          monthlyPrice: Number(form.monthlyPrice),
          yearlyPrice: Number(form.yearlyPrice),
          dailyJobSuggestions: Number(form.dailyJobSuggestions),
          cvAnalysis: Number(form.cvAnalysis),
          compatibilityCheck: Number(form.compatibilityCheck),
        }),
      })
      await loadPackages()
      setModal(null)
    } catch (err) { alert(err.message) }
  }

  const deletePackage = async (id) => {
    try {
      await adminFetch(`/admin/packages/${id}`, { method: 'DELETE' })
      setPackages(prev => prev.filter(p => p.id !== id))
      setDeleteTarget(null)
      setModal(null)
    } catch (err) { alert(err.message) }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const fmtVal = v => (v < 0 || v >= 999) ? '∞' : v

  const PKG_FORM = (
    <div className="adm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="adm-form-field">
        <label>Tên gói <span style={{ color: '#C0412A' }}>*</span></label>
        <input className="adm-form-input" placeholder="VD: Basic, Premium..."
          value={form.name || ''} onChange={e => set('name', e.target.value)} autoFocus />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="adm-form-field">
          <label>Giá tháng (VNĐ) </label>
          <input className="adm-form-input" type="number" min="0"
            value={form.monthlyPrice ?? 0} onChange={e => set('monthlyPrice', e.target.value)} />
        </div>
        <div className="adm-form-field">
          <label>Giá năm (VNĐ)</label>
          <input className="adm-form-input" type="number" min="0"
            value={form.yearlyPrice ?? 0} onChange={e => set('yearlyPrice', e.target.value)} />
        </div>
      </div>
      {Object.entries(FEATURE_LABELS).map(([k, label]) => (
        <div className="adm-form-field" key={k}>
          <label>{label}</label>
          <input className="adm-form-input" type="number" min="0"
            value={form[k] ?? ''} onChange={e => set(k, e.target.value)}
            placeholder="999 = không giới hạn" />
        </div>
      ))}
      <p className="adm-pkgs__hint">💡 Nhập 999 để đặt không giới hạn</p>
    </div>
  )

  if (loading) return <div className="adm-db__loading">Đang tải...</div>
  if (error) return <div className="adm-db__error">⚠ {error}</div>

  return (
    <div className="adm-pkgs">
      <div className="adm-pkgs__header">
        <div>
          <h1 className="adm-page-title">Quản lý gói dịch vụ</h1>
          <p className="adm-page-sub">
            {packages.length} gói đang hoạt động · {packages.reduce((a, p) => a + (p.users ?? 0), 0).toLocaleString()} người dùng
          </p>
        </div>
        <button className="adm-add-btn" onClick={() => { setForm({ ...EMPTY_FORM }); setModal('create') }}>
          + Tạo gói mới
        </button>
      </div>

      <div className="adm-pkgs__cards">
        {packages.map((pkg, idx) => (
          <div className="adm-pkg2" key={pkg.id} style={{ '--c': pkg.color, '--bg': pkg.bg }}>
            <div className="adm-pkg2__strip">
              <span className="adm-pkg2__rank">{idx + 1}</span>
            </div>
            <div className="adm-pkg2__info">
              <div className="adm-pkg2__name" style={{ color: pkg.color }}>{pkg.displayName ?? pkg.name}</div>
              <div className="adm-pkg2__price">
                {pkg.monthlyPrice === 0
                  ? <span className="adm-pkg2__free">Miễn phí</span>
                  : <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div><strong>{pkg.monthlyPrice.toLocaleString()}</strong><span>đ / tháng</span></div>
                    {pkg.yearlyPrice > 0 &&
                      <div style={{ fontSize: 11, color: '#9A8D80' }}>
                        {pkg.yearlyPrice.toLocaleString()}đ / năm
                      </div>
                    }
                  </div>
                }
              </div>
              <div className="adm-pkg2__users">
                <span className="adm-pkg2__users-dot" style={{ background: pkg.color }} />
                {(pkg.users ?? 0).toLocaleString()} người dùng
              </div>
            </div>
            <div className="adm-pkg2__feats">
              {Object.entries(pkg.features).map(([k, v]) => (
                <div className="adm-pkg2__feat" key={k}>
                  <span className="adm-pkg2__feat-lbl">{FEATURE_LABELS[k]}</span>
                  <span className="adm-pkg2__feat-val" style={{ color: pkg.color }}>
                    {fmtVal(v)}
                  </span>
                </div>
              ))}
            </div>
            <div className="adm-pkg2__acts">
              <button className="adm-pkg2__edit" onClick={() => openEdit(pkg)}>Chỉnh sửa</button>
              <button className="adm-pkg2__del" onClick={() => { setDeleteTarget(pkg); setModal('delete') }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card__head">
          <span className="adm-card__title">Bảng so sánh chi tiết</span>
        </div>
        <table className="adm-table adm-pkgs__cmp">
          <thead>
            <tr>
              <th>Tính năng</th>
              {packages.map(p => (
                <th key={p.id}>
                  <span style={{ color: p.color, fontWeight: 800 }}>{p.displayName ?? p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(FEATURE_LABELS).map(([k, label]) => (
              <tr key={k}>
                <td className="adm-table__muted">{label}</td>
                {packages.map(p => (
                  <td key={p.id}>
                    <span className="adm-pkgs__cmp-val" style={{ color: p.color }}>
                      {fmtVal(p.features[k])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="adm-table__muted">Người dùng hiện tại</td>
              {packages.map(p => (
                <td key={p.id} className="adm-table__muted">{(p.users ?? 0).toLocaleString()}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {modal === 'edit' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>Chỉnh sửa gói <span style={{ color: '#342893' }}>{form.name}</span></h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            {PKG_FORM}
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button className="adm-modal__action-btn unlock" onClick={savePackage}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'create' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>Tạo gói dịch vụ mới</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            {PKG_FORM}
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button className="adm-modal__action-btn unlock" onClick={createPackage}>Tạo gói</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'delete' && deleteTarget && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>Xóa gói dịch vụ?</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="adm-modal__body" style={{ paddingTop: 8 }}>
              <p className="adm-modal__confirm-text">
                Gói <strong>"{deleteTarget.name}"</strong> sẽ bị xóa vĩnh viễn.
                {deleteTarget.users > 0 && ` Hiện có ${deleteTarget.users.toLocaleString()} người dùng đang dùng gói này.`}
              </p>
            </div>
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button className="adm-modal__action-btn lock" onClick={() => deletePackage(deleteTarget.id)}>Xóa gói</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}