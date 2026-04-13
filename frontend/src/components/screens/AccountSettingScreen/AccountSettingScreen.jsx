import { useState } from 'react'
import './AccountSettingScreen.css'
import Sidebar from '../../layout/Sidebar/Sidebar'
import axios from "axios"
import { getToken } from '../../../utils/auth'

const API = 'http://localhost:3000/api'

export default function AccountSettingsScreen({ onNavigate }) {
    const [showPass, setShowPass] = useState(false)
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Lấy token từ localStorage hoặc context auth
            const token = getToken()

            const response = await axios.post(
                `${API}/settings/change-password`,
                {
                    oldPassword,
                    newPassword,
                    confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message);
            console.log('Password change response:', response.data);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi');
        }
    };

    return (
        <div className="as-page">
            <div className="as-layout">
                {/* Sidebar của bạn */}
                <Sidebar activeItem="settings" onNavigate={onNavigate} />

                <main className="as-main">
                    {/* ═══ ACCOUNT ONLY ════════════════════════════════════ */}
                    <div className="as-section">
                        <div className="as-sec-hd">
                            <h2 className="as-sec-title">Tài khoản & Mật khẩu</h2>
                            <p className="as-sec-sub">Quản lý bảo mật tài khoản của bạn.</p>
                        </div>

                        <div className="as-card">
                            <div className="as-card-title">Đổi mật khẩu</div>
                            {message && <div className="as-message success">{message}</div>}
                            {error && <div className="as-message error">{error}</div>}

                            <div className="as-form-grid">
                                <div className="as-field full">
                                    <label>Mật khẩu hiện tại</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" onChange={e => setOldPassword(e.target.value)} />
                                </div>
                                <div className="as-field">
                                    <label>Mật khẩu mới</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" onChange={e => setNewPassword(e.target.value)} />
                                </div>
                                <div className="as-field">
                                    <label>Xác nhận mật khẩu mới</label>
                                    <input type={showPass ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" onChange={e => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="as-row-between">
                                <label className="as-show-pass" onClick={() => setShowPass(v => !v)}>
                                    <div className={`as-ck-sm${showPass ? ' on' : ''}`} />
                                    {showPass ? 'Ẩn' : 'Hiện'} mật khẩu
                                </label>
                                <button className="as-save-btn sm" onClick={handleSubmit}>
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </div>

                        {/* <div className="as-card">
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
                        </div> */}

                        {/* <div className="as-card">
                            <div className="as-card-title">Xác thực 2 bước (2FA)</div>
                            <div className="as-2fa-row">
                                <div>
                                    <div className="as-2fa-label">Bảo vệ tài khoản bằng OTP</div>
                                    <div className="as-2fa-sub">Gửi mã qua SMS hoặc app Authenticator khi đăng nhập.</div>
                                </div>
                                <button className="as-save-btn sm">Bật 2FA</button>
                            </div>
                        </div> */}
                    </div>
                </main>
            </div>
        </div>
    )
}