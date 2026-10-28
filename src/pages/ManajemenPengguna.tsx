import { useEffect, useState } from 'react';

import {
  Navigate,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import { useData } from '../hooks/useData';

import {
  Badge,
  Button,
  CloseButton,
  DataKaryawanSearchBar,
  DataKaryawanFormModal,
  employeeFieldClass,
  PageTitle,
  Pagination,
} from '../components/UI';

/** Memetakan setiap role ke avatar yang digunakan pada tabel dan detail akun. */
const roleAvatar = {
  Direktur: '/assets/avatar-direktur.png',
  Sekretaris: '/assets/avatar-sekretaris.png',
  Manajer: '/assets/avatar-manajer.png',
  Karyawan: '/assets/avatar-karyawan.png',
};

/** Urutan kolom tabel daftar pengguna. */
const userTableColumns = ['No', 'Nama', 'Email', 'Password', 'Role', 'Status', 'Action'];

/** Menampilkan informasi lengkap untuk satu akun pengguna. */
function UserDetails({ user, role, onClose }) {
  const details = [
    ['Nama', user.name],
    ['Email', user.email],
    ['Password', user.password || ''],
    ['Role', user.role],
    ['Status', user.status || 'Aktif'],
  ];

  return (
    <div className="employee-family-detail-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="employee-family-detail-modal" role="dialog" aria-modal="true" aria-labelledby="user-details-title">
        <h2 id="user-details-title">Detail Akun</h2>
        <div className="employee-family-detail-fields">
          {details.map(([label, value]) => (
            <div className="employee-family-detail-field" key={label}>
              <span>{label}</span>
              <b>{value || '—'}</b>
            </div>
          ))}
        </div>
        <div className="employee-family-detail-actions attendance-detail-actions">
          <CloseButton className="attendance-detail-close-button" to={`/${role}/users`} onClick={onClose} />
        </div>
      </section>
    </div>
  );
}

/** Form untuk menambah atau mengubah data akun pengguna. */
function UserFormDropdown({ name, value, options, onChange, label, placeholder }) {
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <details
        className="attendance-form-select-menu"
        name="attendance-form-select"
        data-required="true"
        data-value={value}
      >
        <summary
          className="attendance-filter-trigger attendance-form-select-trigger"
          data-empty={!value}
          aria-label={`${label}: ${value || placeholder}`}
          aria-required="true"
          aria-invalid={!value}
        >
          <span>{value || placeholder}</span>
          <img src="/assets/figma-chevron-down.svg" alt="" />
        </summary>
        <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label={`Pilih ${label}`}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={(event) => {
                onChange(option);
                event.currentTarget.closest('details')?.removeAttribute('open');
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </details>
    </>
  );
}

function UserForm({ user, editing, users, onSave, onCancel }) {
  const initialRole = editing ? user.role : '';
  const initialStatus = editing ? user.status || 'Aktif' : '';
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleValue, setRoleValue] = useState(initialRole);
  const [statusValue, setStatusValue] = useState(initialStatus);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const selectedRole = String(formData.get('role') || 'Karyawan');
    const userData = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      password: String(formData.get('password') || '').trim() || user?.password || '',
      role: selectedRole,
      avatar: roleAvatar[selectedRole],
      status: String(formData.get('status') || 'Aktif'),
    };

    const duplicateEmail = users.some(
      (account) =>
        account.email.toLowerCase() === userData.email.toLowerCase() &&
        account.id !== user?.id
    );

    if (duplicateEmail) {
      setError('Email sudah digunakan oleh pengguna lain.');
      return;
    }

    onSave(userData);
  };

  return (
    <div className={`employee-modal-page user-management-form-page ${editing ? 'attendance-modal-page' : ''}`}>
      <DataKaryawanFormModal
        isFamily={false}
        isEdit={editing}
        title={editing ? 'Edit Akun' : 'Tambah Akun'}
        className={`user-account-form ${editing ? 'user-account-edit-form' : ''}`}
        formData={undefined}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitLabel="Simpan"
      >
        {error && <p className="user-account-form-error" role="alert">{error}</p>}

        <label className={employeeFieldClass}>
          <span>Nama</span>
          <input name="name" defaultValue={editing ? user.name : ''} placeholder="Masukkan nama" required />
        </label>
        <label className={employeeFieldClass}>
          <span>Email</span>
          <input name="email" type="email" defaultValue={editing ? user.email : ''} placeholder="Masukkan email" required />
        </label>
        <label className={employeeFieldClass}>
          <span>Password</span>
          <div className="user-account-password-input">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              defaultValue={editing ? user.password : ''}
              placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Masukkan password'}
              required={!editing}
              autoComplete="new-password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <img src={showPassword ? '/assets/figma-view.svg' : '/assets/figma-eye-off.svg'} alt="" />
            </button>
          </div>
        </label>
        <label className={employeeFieldClass}>
          <span>Role</span>
          <UserFormDropdown name="role" value={roleValue} options={['Direktur', 'Sekretaris', 'Manajer', 'Karyawan']} onChange={setRoleValue} label="role" placeholder="Pilih role" />
        </label>
        <label className={employeeFieldClass}>
          <span>Status</span>
          <UserFormDropdown name="status" value={statusValue} options={['Aktif', 'Non Aktif']} onChange={setStatusValue} label="status" placeholder="Pilih status" />
        </label>
      </DataKaryawanFormModal>
    </div>
  );
}

/** Menampilkan tombol lihat, edit, dan hapus pada setiap baris akun. */
function UserActions({ user, role, onRemove }) {
  return (
    <div className="data-employee-actions">
      <Link
        to={`/${role}/users/${user.id}`}
        aria-label={`Lihat ${user.name}`}
        className="data-employee-action data-employee-action-view"
      >
        <img src="/assets/figma-view.svg" alt="" />
      </Link>

      <Link
        className="data-employee-action data-employee-action-edit"
        to={`/${role}/users/${user.id}/edit`}
        aria-label={`Edit ${user.name}`}
      >
        <img src="/assets/figma-edit.svg" alt="" />
      </Link>

      <button
        type="button"
        className="data-employee-action data-employee-action-delete"
        aria-label={`Hapus ${user.name}`}
        onClick={() => onRemove(user)}
      >
        <img src="/assets/figma-delete.svg" alt="" />
      </button>
    </div>
  );
}

/**
 * Halaman manajemen akun yang menampilkan daftar, detail, serta form pengguna.
 * Data akun dibaca dan diperbarui melalui DataContext agar perubahan juga
 * dapat digunakan oleh proses login.
 */
export default function ManajemenPengguna({ backgroundView = false }) {
  const { role, userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    users,
    addUser,
    updateUser,
    removeUser,
  } = useData();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Tentukan akun yang sedang dibuka berdasarkan ID pada URL.
  const user = users.find((item) => item.id === userId);

  // Gunakan akhiran URL untuk membedakan mode tambah, edit, dan detail.
  const editing = location.pathname.endsWith('/edit');
  const creating = location.pathname.endsWith('/new');
  const form = !backgroundView && (creating || editing);
  const viewing = !backgroundView && Boolean(userId && !form && user);

  useEffect(() => {
    if (backgroundView || !(form || viewing || deleteTarget || successMessage)) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [backgroundView, deleteTarget, form, successMessage, viewing]);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const filteredUsers = users.filter((account) =>
    `${account.name} ${account.email} ${account.role}`.toLowerCase().includes(query.trim().toLowerCase())
  );
  const usersPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  const activePage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice(
    (activePage - 1) * usersPerPage,
    activePage * usersPerPage
  );

  if (userId && !user) {
    return <Navigate to={`/${role}/users`} replace />;
  }

  /** Menyimpan perubahan akun lalu kembali ke daftar pengguna. */
  const handleSave = (userData) => {
    if (editing) {
      updateUser(user.id, userData);
    } else {
      addUser(userData);
    }

    setPage(1);
    setSuccessMessage(editing ? 'Data pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan');
    navigate(`/${role}/users`);
  };

  /** Menghapus akun setelah dikonfirmasi melalui dialog aplikasi. */
  const confirmRemove = () => {
    if (!deleteTarget) return;
    removeUser(deleteTarget.id);
    setDeleteTarget(null);
    setSuccessMessage('Data pengguna berhasil dihapus');
  };

  if (viewing) {
    return (
      <>
        <div className="permit-background-content" aria-hidden="true" inert>
          <ManajemenPengguna backgroundView />
        </div>
        <UserDetails user={user} role={role} onClose={() => navigate(`/${role}/users`)} />
      </>
    );
  }

  if (form) {
    return (
      <>
        <div className="permit-background-content" aria-hidden="true" inert>
          <ManajemenPengguna backgroundView />
        </div>
        <UserForm
          user={user}
          editing={editing}
          users={users}
          onSave={handleSave}
          onCancel={() => navigate(`/${role}/users`)}
        />
      </>
    );
  }

  return (
    <section className="user-management-page [min-width:0]">
      <PageTitle title="User Management" className="employee-list-title" />

      <div className="attendance-toolbar [display:flex] [align-items:center] [justify-content:space-between] [gap:8px] [margin-bottom:17px] [&>.button:last-child]:[width:99px] [&>.button:last-child]:[min-width:99px] [&>.button_span]:[font-size:14px] [&>.button_span]:[line-height:1] max-[1250px]:[flex-wrap:wrap] max-[1250px]:[justify-content:flex-start] max-[1250px]:[&>.button:last-child]:[margin-left:auto] max-[800px]:[display:grid] max-[800px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[800px]:[&>.button:last-child]:[width:100%] max-[800px]:[&>.button:last-child]:[min-width:0] max-[800px]:[&>.button:last-child]:[margin-left:0] max-[520px]:[gap:7px] max-[520px]:[&>.button]:[min-height:34px] max-[1150px]:[gap:6px] max-[1150px]:[&>.button:last-child]:[width:78px] max-[1150px]:[&>.button:last-child]:[min-width:78px] max-[800px]:[gap:7px]">
        <DataKaryawanSearchBar
          query={query}
          ariaLabel="Cari pengguna"
          onQueryChange={(value) => { setQuery(value); setPage(1); }}
        />
        <Button className="employee-add-button" to={`/${role}/users/new`}>
          Tambah <img className="size-4 shrink-0 object-contain" src="/assets/figma-plus-white.svg" alt="" />
        </Button>
      </div>

      <div className="[width:100%] [min-width:0] [overflow-x:auto] [overscroll-behavior-x:contain]">
        <table className="attendance-table employee-data-table [width:100%] [min-width:469px] [border-collapse:separate] [border-spacing:0] [text-align:left] [&_thead_tr]:[height:48px] [&_thead_tr]:[background:#c10000] [&_th]:[height:48px] [&_th]:[padding:0_11px] [&_th]:[background:#c10000] [&_th]:[color:#fff] [&_th]:[font:400_16px/24px_Inter,Arial,sans-serif] [&_th]:[letter-spacing:0] [&_th:first-child]:[border-radius:8px_0_0_8px] [&_th:first-child]:[text-align:center] [&_th:last-child]:[border-radius:0_8px_8px_0] [&_td]:[height:45px] [&_td]:[padding:7px_11px] [&_td]:[border-bottom:.5px_solid_#0003] [&_td]:[color:#111] [&_td]:[font:300_15px/22px_Inter,Arial,sans-serif] [&_td]:[vertical-align:middle] [&_td:first-child]:[text-align:center] [&_tbody_tr:last-child_td]:[border-bottom-color:#0002] max-[600px]:[min-width:680px] [&_th]:[font-size:var(--type-table)]! [&_th]:[line-height:var(--line-table)]! [&_td]:[font-size:var(--type-table)]! [&_td]:[line-height:var(--line-table)]! max-[520px]:[min-width:476px] [min-width:816px] [&_th:first-child]:[width:56px] [&_td:first-child]:[width:56px] [&_td:first-child]:[text-align:center] [&_th:nth-child(2)]:[width:154px] [&_th:nth-child(3)]:[width:160px] [&_th:nth-child(4)]:[width:140px] [&_th:nth-child(5)]:[width:100px] [&_th:nth-child(6)]:[width:90px] [&_th:last-child]:[width:120px] [&_.badge]:[min-width:70px] [&_.badge]:[justify-content:center] [&_.badge]:[padding:4px_8px] [&_.badge]:[border:1px_solid_#91d2a5] [&_.badge]:[border-radius:6px] [&_.badge]:[background:#d4f2dd] [&_.badge]:[color:#148043] [&_.badge]:[font:400_14px/20px_Inter,Arial,sans-serif] [&_.badge]:[font-size:var(--type-badge)]! [&_.badge]:[line-height:var(--line-badge)]! max-[800px]:[min-width:700px]">
          <thead>
            <tr>
              {userTableColumns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pagedUsers.map((account, index) => (
              <tr key={account.id}>
                <td>{String((activePage - 1) * usersPerPage + index + 1).padStart(2, '0')}</td>
                <td>{account.name}</td>
                <td title={account.email}>{account.email}</td>
                <td>{account.password || ''}</td>
                <td>{account.role}</td>
                <td>
                  <Badge className={account.status === 'Non Aktif' ? 'is-inactive' : 'is-active'}>
                    {account.status || 'Aktif'}
                  </Badge>
                </td>
                <td>
                  <UserActions
                    user={account}
                    role={role}
                    onRemove={setDeleteTarget}
                  />
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className={"[text-align:center] [padding:32px]! [color:#71757e]!"}>
                  Tidak ada pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination size="compact" page={activePage} totalPages={totalPages} onPageChange={setPage} />

      {deleteTarget && !backgroundView && (
        <div className="employee-delete-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDeleteTarget(null);
        }}>
          <section className="employee-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="user-delete-title" aria-describedby="user-delete-description">
            <span className="employee-delete-warning-icon" aria-hidden="true">!</span>
            <h2 id="user-delete-title">Hapus Pengguna</h2>
            <p id="user-delete-description">Apakah Anda yakin ingin menghapus akun {deleteTarget.name}?</p>
            <div className="employee-delete-dialog-actions">
              <Button className="button button-outline" variant="outline" type="button" onClick={() => setDeleteTarget(null)}>Batal</Button>
              <Button className="button" type="button" onClick={confirmRemove}>Hapus</Button>
            </div>
          </section>
        </div>
      )}

      {successMessage && !backgroundView && (
        <div className="employee-delete-dialog-backdrop success-auto-dismiss" role="presentation">
          <section className="employee-delete-dialog employee-delete-success" role="dialog" aria-modal="true" aria-labelledby="user-success-title" aria-describedby="user-success-description">
            <h2 id="user-success-title">Berhasil</h2>
            <p id="user-success-description">{successMessage}</p>
          </section>
        </div>
      )}

    </section>
  );
}
