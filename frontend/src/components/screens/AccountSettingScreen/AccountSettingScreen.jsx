import { useState } from 'react'
import './AccountSettingScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'

export default function AccountSettingsScreen({ onNavigate }) {
    const [showPass, setShowPass] = useState(false)

    return (
        <div className="as-page">
            <div className="as-layout">
                {/* Sidebar của bạn */}
                <Sidebar activeItem="settings" onNavigate={onNavigate}/>
                
                <main className="as-main">
                    {/* ═══ ACCOUNT ONLY ════════════════════════════════════ */}
                    <div className="as-section">
                        <div className="as-sec-hd">
                            <h2 className="as-sec-title">Tài khoản & Mật khẩu</h2>
                            <p className="as-sec-sub">Quản lý bảo mật tài khoản của bạn.</p>
                        </div>

                        <div className="as-card">
                            <div className="as-card-title">Đổi mật khẩu</div>
                            <div className="as-form-grid">
                                <div className="as-field full">
                                    <label>Mật khẩu hiện tại</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" />
                                </div>
                                <div className="as-field">
                                    <label>Mật khẩu mới</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" />
                                </div>
                                <div className="as-field">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" />
                                </div>
                            </div>
                            <div className="as-row-between">
                                <label className="as-show-pass" onClick={() => setShowPass(v => !v)}>
                                    <div className={`as-ck-sm${showPass ? ' on' : ''}`} />
                                    {showPass ? 'Ẩn' : 'Hiện'} mật khẩu
                                </label>
                                <button className="as-save-btn sm">Đổi mật khẩu</button>
                            </div>
                        </div>

                        <div className="as-card">
                            <div className="as-card-title">Đăng nhập bằng mạng xã hội</div>
                            {[['🔵', 'Google', 'tranvana@gmail.com', true], ['🔷', 'Facebook', '—', false], ['🔗', 'LinkedIn', '—', false]].map(([ico, name, acc, linked]) => (
                                <div key={name} className="as-social-row">
                                    <span className="as-social-ico">{ico}</span>
                                    <div className="as-social-info">
                                        <div className="as-social-name">{name}</div>
                                        <div className="as-social-acc">{acc}</div>
                                    </div>
                                    <button className={`as-social-btn${linked ? ' linked' : ''}`}>
                                        {linked ? 'Đã kết nối · Ngắt' : 'Kết nối'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="as-card">
                            <div className="as-card-title">Xác thực 2 bước (2FA)</div>
                            <div className="as-2fa-row">
                                <div>
                                    <div className="as-2fa-label">Bảo vệ tài khoản bằng OTP</div>
                                    <div className="as-2fa-sub">Gửi mã qua SMS hoặc app Authenticator khi đăng nhập.</div>
                                </div>
                                <button className="as-save-btn sm">Bật 2FA</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}