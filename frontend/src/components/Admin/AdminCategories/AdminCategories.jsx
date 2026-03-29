import { useState, useMemo } from 'react'
import './AdminCategories.css'

function Pager({ page, total, onChange }) {
  if (total <= 1) return null
  return (
    <div className="adm-pager">
      <button className="adm-pager__btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} className={`adm-pager__btn${page === p ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button className="adm-pager__btn" disabled={page === total} onClick={() => onChange(page + 1)}>›</button>
    </div>
  )
}

const INIT_INDUSTRIES = [
  { id: 1,  name: 'Công nghệ thông tin',      active: true  },
  { id: 2,  name: 'Tài chính - Ngân hàng',    active: true  },
  { id: 3,  name: 'Marketing - Truyền thông', active: true  },
  { id: 4,  name: 'Thiết kế - Sáng tạo',      active: true  },
  { id: 5,  name: 'Giáo dục - Đào tạo',       active: true  },
  { id: 6,  name: 'Y tế - Dược phẩm',         active: false },
  { id: 7,  name: 'Trí tuệ nhân tạo',         active: true  },
]

const INIT_SKILLS = [
  { id: 1,  name: 'React',               industryId: 1 },
  { id: 2,  name: 'Node.js',             industryId: 1 },
  { id: 3,  name: 'Python',              industryId: 1 },
  { id: 4,  name: 'TypeScript',          industryId: 1 },
  { id: 5,  name: 'AWS',                 industryId: 1 },
  { id: 6,  name: 'SQL',                 industryId: 1 },
  { id: 7,  name: 'Docker',              industryId: 1 },
  { id: 8,  name: 'Phân tích tài chính', industryId: 2 },
  { id: 9,  name: 'Excel nâng cao',      industryId: 2 },
  { id: 10, name: 'SEO / SEM',           industryId: 3 },
  { id: 11, name: 'Content Marketing',   industryId: 3 },
  { id: 12, name: 'Figma',               industryId: 4 },
  { id: 13, name: 'Adobe XD',            industryId: 4 },
  { id: 14, name: 'Prompt Engineering',  industryId: 7 },
  { id: 15, name: 'Machine Learning',    industryId: 7 },
]

const IND_PER_PAGE   = 6
const SKILL_PER_PAGE = 8

export default function AdminCategories() {
  const [industries, setIndustries]   = useState(INIT_INDUSTRIES)
  const [skills, setSkills]           = useState(INIT_SKILLS)
  const [selectedInd, setSelectedInd] = useState(null)
  const [search, setSearch]           = useState('')
  const [modal, setModal]             = useState(null)
  const [form, setForm]               = useState({})
  const [indPage, setIndPage]         = useState(1)
  const [skillPage, setSkillPage]     = useState(1)

  const currentIndustry = industries.find(i => i.id === selectedInd)
  const skillCountFor   = id => skills.filter(s => s.industryId === id).length


  const filteredSkills = useMemo(() => {
    let list = selectedInd ? skills.filter(s => s.industryId === selectedInd) : skills
    if (search.trim())
      list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [skills, selectedInd, search])

  const totalSkillPages = Math.ceil(filteredSkills.length / SKILL_PER_PAGE)
  const pagedSkills     = filteredSkills.slice((skillPage - 1) * SKILL_PER_PAGE, skillPage * SKILL_PER_PAGE)

  const totalIndPages = Math.ceil(industries.length / IND_PER_PAGE)
  const pagedInds     = industries.slice((indPage - 1) * IND_PER_PAGE, indPage * IND_PER_PAGE)

  const handleSearch = v => { setSearch(v); setSkillPage(1) }
  const handleSelectInd = id => { setSelectedInd(id); setSkillPage(1) }

  const saveIndustry = () => {
    if (!form.name?.trim()) return
    if (form.id) {
      setIndustries(p => p.map(i => i.id === form.id ? { ...i, name: form.name } : i))
    } else {
      setIndustries(p => [...p, { id: Date.now(), name: form.name, active: true }])
    }
    setModal(null)
  }

  const deleteIndustry = id => {
    setIndustries(p => p.filter(i => i.id !== id))
    setSkills(p => p.filter(s => s.industryId !== id))
    if (selectedInd === id) setSelectedInd(null)
    setModal(null)
  }

  const saveSkill = () => {
    if (!form.name?.trim() || !form.industryId) return
    if (form.id) {
      setSkills(p => p.map(s => s.id === form.id
        ? { ...s, name: form.name, industryId: Number(form.industryId) } : s))
    } else {
      setSkills(p => [...p, { id: Date.now(), name: form.name, industryId: Number(form.industryId) }])
    }
    setModal(null)
  }

  const deleteSkill = id => setSkills(p => p.filter(s => s.id !== id))

  return (
    <div className="adm-cats">
      <div className="adm-cats__header">
        <h1 className="adm-page-title">Danh mục dữ liệu nền tảng</h1>
        <p className="adm-page-sub">Chọn lĩnh vực để xem và quản lý kỹ năng tương ứng</p>
      </div>

      <div className="adm-cats__layout">

        <div className="adm-cats__left">
          <div className="adm-cats__left-head">
            <span className="adm-card__title">Lĩnh vực</span>
            <button className="adm-add-btn-sm" onClick={() => { setForm({}); setModal('industry') }}>+</button>
          </div>

          <button
            className={`adm-ind-item${selectedInd === null ? ' active' : ''}`}
            onClick={() => handleSelectInd(null)}
          >
            <span className="adm-ind-item__name">Tất cả lĩnh vực</span>
            <span className="adm-ind-item__count">{skills.length}</span>
          </button>

          {pagedInds.map(ind => (
            <div
              key={ind.id}
              className={`adm-ind-item${selectedInd === ind.id ? ' active' : ''}${!ind.active ? ' inactive' : ''}`}
            >
              <button className="adm-ind-item__main" onClick={() => handleSelectInd(ind.id)}>
                <span className="adm-ind-item__dot" style={{ background: ind.active ? '#2E6040' : '#DDD6C6' }} />
                <span className="adm-ind-item__name">{ind.name}</span>
                <span className="adm-ind-item__count">{skillCountFor(ind.id)}</span>
              </button>
              <div className="adm-ind-item__acts">
                <button className="adm-ind-act"
                  onClick={() => { setForm({ id: ind.id, name: ind.name }); setModal('industry') }}>✎</button>
                <button className="adm-ind-act adm-ind-act--del"
                  onClick={() => { setForm({ id: ind.id, name: ind.name }); setModal('del-industry') }}>✕</button>
              </div>
            </div>
          ))}

          <div className="adm-cats__left-footer">
            <Pager page={indPage} total={totalIndPages} onChange={setIndPage} />
          </div>
        </div>

        <div className="adm-cats__right">
          <div className="adm-card">
            <div className="adm-card__head">
              <div className="adm-cats__right-title">
                <span className="adm-card__title">
                  {currentIndustry ? `Kỹ năng — ${currentIndustry.name}` : 'Tất cả kỹ năng'}
                </span>
                <span className="adm-cats__skill-count">{filteredSkills.length} kỹ năng</span>
              </div>
              <button className="adm-add-btn"
                onClick={() => { setForm({ industryId: selectedInd || '' }); setModal('skill') }}>
                + Thêm kỹ năng
              </button>
            </div>

            <div className="adm-cats__search-wrap">
              <div className="adm-search">
                <span className="adm-search__ico">⌕</span>
                <input className="adm-search__input" placeholder="Tìm kỹ năng..."
                  value={search} onChange={e => handleSearch(e.target.value)} />
                {search && <button className="adm-search__clear" onClick={() => handleSearch('')}>✕</button>}
              </div>
            </div>

            <table className="adm-table">
              <thead>
                <tr>
                  <th>Tên kỹ năng</th>
                  <th>Lĩnh vực</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pagedSkills.map(sk => {
                  const ind = industries.find(i => i.id === sk.industryId)
                  return (
                    <tr key={sk.id}>
                      <td className="adm-table__name">{sk.name}</td>
                      <td><span className="adm-skill-cat">{ind?.name || '—'}</span></td>
                      <td>
                        <div className="adm-users__actions">
                          <button className="adm-act-btn adm-act-btn--view"
                            onClick={() => { setForm({ id: sk.id, name: sk.name, industryId: sk.industryId }); setModal('skill') }}>
                            Sửa
                          </button>
                          <button className="adm-act-btn adm-act-btn--lock" onClick={() => deleteSkill(sk.id)}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {pagedSkills.length === 0 && (
                  <tr><td colSpan={3} className="adm-table__empty">
                    {search ? `Không tìm thấy kỹ năng "${search}"` : 'Chưa có kỹ năng nào'}
                  </td></tr>
                )}
              </tbody>
            </table>

            <div className="adm-cats__skill-footer">
              <span className="adm-cats__skill-info">
                {filteredSkills.length > 0 &&
                  `${(skillPage - 1) * SKILL_PER_PAGE + 1}–${Math.min(skillPage * SKILL_PER_PAGE, filteredSkills.length)} / ${filteredSkills.length}`}
              </span>
              <Pager page={skillPage} total={totalSkillPages} onChange={setSkillPage} />
            </div>
          </div>
        </div>
      </div>

      {modal === 'industry' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>{form.id ? 'Chỉnh sửa lĩnh vực' : 'Thêm lĩnh vực mới'}</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="adm-modal__body">
              <div className="adm-form-field">
                <label>Tên lĩnh vực <span style={{ color: '#C0412A' }}>*</span></label>
                <input className="adm-form-input" placeholder="VD: Công nghệ thông tin"
                  value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
            </div>
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button className="adm-modal__action-btn unlock" onClick={saveIndustry}>
                {form.id ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'del-industry' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>Xóa lĩnh vực?</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="adm-modal__body" style={{ paddingTop: 8 }}>
              <p className="adm-modal__confirm-text">
                Lĩnh vực <strong>"{form.name}"</strong> và tất cả{' '}
                <strong>{skillCountFor(form.id)} kỹ năng</strong> bên trong sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button className="adm-modal__action-btn lock" onClick={() => deleteIndustry(form.id)}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'skill' && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal adm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__head">
              <h3>{form.id ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng mới'}</h3>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="adm-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="adm-form-field">
                <label>Lĩnh vực <span style={{ color: '#C0412A' }}>*</span></label>
                <select className="adm-form-input"
                  value={form.industryId || ''}
                  onChange={e => setForm(f => ({ ...f, industryId: e.target.value }))}>
                  <option value="">-- Chọn lĩnh vực --</option>
                  {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="adm-form-field">
                <label>Tên kỹ năng <span style={{ color: '#C0412A' }}>*</span></label>
                <input className="adm-form-input" placeholder="VD: React, Python, Figma..."
                  value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
            <div className="adm-modal__foot">
              <button className="adm-modal__close-btn" onClick={() => setModal(null)}>Hủy</button>
              <button className="adm-modal__action-btn unlock" onClick={saveSkill}>
                {form.id ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}