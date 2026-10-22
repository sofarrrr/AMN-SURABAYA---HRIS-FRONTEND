import { useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

import { Avatar, Button, PageTitle } from '../components/UI';

/**
 * Halaman Profil
 *
 * Menampilkan informasi profil pengguna yang sedang login,
 * serta menyediakan fitur untuk mengubah nama, email, dan password.
 *
 * Mode halaman ditentukan berdasarkan URL:
 * - /profile      ? menampilkan profil
 * - /profile/edit ? menampilkan form edit profil
 */
export default function Profil() {
  // Mengambil data pengguna dan fungsi untuk memperbarui data pengguna.
  const { user, setUser } = useAuth();
  const { users, updateUser } = useData();

  // Mengambil informasi URL saat ini dan fungsi navigasi.
  const location = useLocation();
  const navigate = useNavigate();

  // Mengecek apakah halaman sedang berada pada mode edit.
  const editing = location.pathname.endsWith('/edit');

  // State untuk menyimpan nilai form edit profil.
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const avatarInput = useRef(null);

  // Membentuk path halaman profil berdasarkan role pengguna.
  const profilePath = `/${user.role.toLowerCase()}/profile`;

  /**
   * Menangani proses penyimpanan perubahan profil.
   *
   * Jika password tidak diisi, password lama tetap digunakan.
   * Setelah data diperbarui, pengguna diarahkan kembali ke halaman profil.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const nextEmail = email.trim();
    const duplicateEmail = users.some(
      (account) =>
        account.id !== user.id &&
        account.email.toLowerCase() === nextEmail.toLowerCase()
    );

    if (duplicateEmail) {
      setEmailError('Email sudah digunakan oleh pengguna lain.');
      return;
    }

    const updatedUser = {
      ...user,
      name,
      email: nextEmail,
      password: password || user.password,
    };

    setEmailError('');
    updateUser(user.id, updatedUser);
    setUser(updatedUser);

    navigate(profilePath);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Ukuran foto maksimal 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;

      const updatedUser = { ...user, avatar: reader.result };
      updateUser(user.id, updatedUser);
      setUser(updatedUser);
      setAvatarError('');
    };
    reader.onerror = () => setAvatarError('Foto tidak dapat dibaca.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="employee-modal-page">
      {/* Judul halaman profil */}
      <PageTitle title="Profil" />

      {/* Bagian utama informasi profil */}
      <section className="profile-details">
        {/* Foto profil dan tombol ubah foto */}
        <div className="profile-avatar-container">
          <Avatar user={user} size="profile" />
          <input
            ref={avatarInput}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />

          <button
            className="profile-avatar-change-button"
            type="button"
            aria-label="Ubah foto profil"
            onClick={() => avatarInput.current?.click()}
          >
            <img src="/assets/Type=Camera,%20State=Default.svg" alt="" />
          </button>
          {avatarError && <p className="profile-avatar-error" role="alert">{avatarError}</p>}
        </div>

        {/* Informasi pengguna */}
        <div className={"[min-width:0] max-[520px]:[width:100%]"}>
          <div className="profile-heading">
            <h2>Profil</h2>

            {/* Tombol menuju halaman edit profil */}
            <Button className="employee-add-button employee-detail-button" to={`${profilePath}/edit`}>
              Edit
              <img src="/assets/figma-edit.svg" alt="" />
            </Button>
          </div>

          {/* Daftar informasi profil */}
          <div className={"[display:grid] [gap:12px] [&_small]:[color:#818181] [&_small]:[font:400_11px/17px_Inter,Arial,sans-serif] [&>div]:[position:relative] [&>div]:[min-height:40px] [&>div]:[display:grid] [&>div]:[align-content:center] [&>div]:[gap:1px] [&>div]:[padding:2px_17px_5px_0] [&>div]:[border-bottom:1px_solid_#e8e3dd] [&_b]:[color:#111] [&_b]:[font:500_12px/18px_Inter,Arial,sans-serif] [&_small]:[font-size:var(--type-helper)]! [&_small]:[line-height:var(--line-helper)]! [&_b]:[font-size:var(--type-body)]! [&_b]:[line-height:var(--line-body)]!"}>
            {[
              ['Nama', user.name],
              ['Email', user.email],
              ['Password', '••••••••'],
              ['Role', user.role],
            ].map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>

                {/* Password selalu ditampilkan dalam bentuk tersembunyi */}
                <b>
                  {label === 'Password' ? (showProfilePassword ? user.password : '••••••••') : value}
                </b>
                {label === 'Password' && (
                  <button
                    className="profile-password-status-toggle"
                    type="button"
                    aria-label={showProfilePassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    aria-pressed={showProfilePassword}
                    onClick={() => setShowProfilePassword((visible) => !visible)}
                  >
                    <img
                      src={showProfilePassword ? '/assets/figma-view.svg' : '/assets/figma-eye-off.svg'}
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal edit profil hanya ditampilkan ketika mode edit aktif */}
      {editing && (
        <div className={"[position:fixed] [z-index:60] [inset:0] [display:grid] [place-items:center] [overflow-y:auto] [padding:13px] employee-modal-backdrop"}>
          <form
            className="employee-edit-form [display:grid] [align-content:start] [background:#fff] [box-shadow:0_20px_80px_#2222]"
            onSubmit={handleSubmit}
          >
            <h2>Edit Profil</h2>

            {/* Input nama */}
            <label>
              <span>Nama</span>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            {/* Input email */}
            <label>
              <span>Email</span>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                required
              />
            </label>
            {emailError && <p className="text-sm text-[#b32222]" role="alert">{emailError}</p>}

            {/* Input password baru */}
            <label>
              <span>Password baru</span>

              <div className="profile-password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  autoComplete="new-password"
                />
                <button
                  className="profile-password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  <img
                    src={showPassword ? '/assets/figma-view.svg' : '/assets/figma-eye-off.svg'}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </div>
            </label>

            {/* Tombol aksi form */}
            <div className="flex justify-end">
              {/* Membatalkan perubahan dan kembali ke profil */}
              <Button
                to={profilePath}
                variant="outline"
              >
                Batal
              </Button>

              {/* Menyimpan perubahan profil */}
              <Button type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
