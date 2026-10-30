import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { Link } from 'react-router';
import { changePageKeepingPosition } from '../utils/keepPaginationPosition';

export function PageTitle({ title, subtitle, action, className = '' }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={`page-title-sticky mb-4 flex min-h-7 flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${className}`}>
      <div className="min-w-0">
        <h1 className="mb-0 font-[Inter] text-2xl font-semibold leading-8 tracking-normal text-[#b91c1c] sm:text-[32px] sm:leading-10">{title}</h1>
        {subtitle && <p className="mt-1 text-xs leading-5 text-[#6c7278]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange, label = 'Navigasi halaman', size = 'default', className = '' }: { page: number; totalPages: number; onPageChange: (page: number) => void; label?: string; size?: 'default' | 'large' | 'compact'; className?: string }) {
  if (size === 'compact') {
    const paginationItems: Array<number | 'ellipsis'> =
      totalPages <= 4
        ? Array.from({ length: totalPages }, (_, index) => index + 1)
        : page <= 2
          ? [1, 2, 'ellipsis', totalPages]
          : page === 3
            ? [1, 2, 3, 'ellipsis', totalPages]
            : page >= totalPages - 2
              ? [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
              : [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];

    return (
      <nav className={"pagination-sticky [display:flex] [justify-content:flex-end] [gap:6px] [margin-top:48px] [&_button]:[width:31px] [&_button]:[height:30px] [&_button]:[border:1px_solid_#b91c1c] [&_button]:[border-radius:6px] [&_button]:[background:#fff] [&_button]:[color:#b91c1c] [&_button]:[font:400_14px/20px_Inter,Arial,sans-serif] [&_button:first-child]:[background:#b91c1c] [&_button:first-child]:[color:#fff] [&_button:last-child]:[background:#b91c1c] [&_button:last-child]:[color:#fff] [&_button.selected]:[background:#b91c1c] [&_button.selected]:[color:#fff] [&_button[aria-current=page]]:[border-color:#b91c1c] [&_button[aria-current=page]]:[background:#b91c1c] [&_button[aria-current=page]]:[color:#fff] max-[800px]:[margin-top:32px] [&_button]:[font-size:var(--type-caption)]! [&_button]:[line-height:var(--line-caption)]! " + className} aria-label={label} data-pagination-container>
        <button
          className="grid h-[30px] w-[31px] place-items-center rounded-md border border-[#b91c1c] bg-[#b91c1c] font-[Inter] text-[var(--type-caption)] leading-[var(--line-caption)] text-white"
          type="button"
          aria-label="Halaman sebelumnya"
          onClick={(event) => changePageKeepingPosition(event, () => onPageChange(Math.max(1, page - 1)))}
        >
          ‹
        </button>
        {paginationItems.map((pageNumber, index) => pageNumber === 'ellipsis' ? (
          <span className="grid h-[30px] w-[31px] place-items-center text-[#b91c1c]" aria-hidden="true" key={`ellipsis-${index}`}>
            …
          </span>
        ) : (
          <button
            className={`grid size-9 place-items-center rounded-md border text-xs ${page === pageNumber ? 'border-[#b91c1c] bg-[#b91c1c] text-white' : 'border-[#dddad0] bg-white text-[#252525] hover:border-[#b91c1c]'}`}
            type="button"
            aria-label={`Halaman ${pageNumber}`}
            aria-current={page === pageNumber ? 'page' : undefined}
            key={`page-${pageNumber}`}
            onClick={(event) => changePageKeepingPosition(event, () => onPageChange(pageNumber))}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="grid h-[30px] w-[31px] place-items-center rounded-md border border-[#b91c1c] bg-[#b91c1c] font-[Inter] text-[var(--type-caption)] leading-[var(--line-caption)] text-white"
          type="button"
          aria-label="Halaman berikutnya"
          onClick={(event) => changePageKeepingPosition(event, () => onPageChange(Math.min(totalPages, page + 1)))}
        >
          ›
        </button>
      </nav>
    );
  }

  if (totalPages < 2) return null;

  const buttonSize = size === 'large'
    ? 'h-14 min-w-[60px] rounded-lg border px-4 text-base leading-6'
    : 'size-[31px] rounded-md border text-sm';

  return (
    <nav className={`pagination-sticky flex justify-end ${size === 'large' ? 'mt-[70px] gap-3' : 'mt-6 gap-1.5'}`} aria-label={label} data-pagination-container>
      <button
        className={`grid place-items-center border border-[#b91c1c] bg-[#b91c1c] text-white disabled:opacity-40 ${buttonSize}`}
        type="button"
        aria-label="Halaman sebelumnya"
        disabled={page === 1}
        onClick={(event) => changePageKeepingPosition(event, () => onPageChange(page - 1))}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          className={`grid place-items-center ${buttonSize} ${page === pageNumber ? 'border-[#b91c1c] bg-[#b91c1c] text-white' : 'border-[#dddad0] bg-white text-[#252525] hover:border-[#b91c1c]'}`}
          type="button"
          aria-current={page === pageNumber ? 'page' : undefined}
          key={pageNumber}
          onClick={(event) => changePageKeepingPosition(event, () => onPageChange(pageNumber))}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className={`grid place-items-center border border-[#b91c1c] bg-[#b91c1c] text-white disabled:opacity-40 ${buttonSize}`}
        type="button"
        aria-label="Halaman berikutnya"
        disabled={page === totalPages}
        onClick={(event) => changePageKeepingPosition(event, () => onPageChange(page + 1))}
      >
        ›
      </button>
    </nav>
  );
}

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'size'> & {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'light' | 'text' | 'danger' | string;
  size?: 'default' | 'large';
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({ children, variant = 'primary', size = 'default', to, onClick, type = 'button', className = '', ...props }: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-3 border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-50 ${size === 'large' ? 'min-h-14 rounded-xl px-6 py-4 text-base leading-6' : 'min-h-10 rounded-md px-4 py-2 text-sm leading-5'}`;
  const style = variant === 'outline'
    ? 'border-[#b91c1c] bg-white text-[#b91c1c] hover:bg-[#fff5e0]'
    : variant === 'light'
      ? 'border-transparent bg-white text-[#b91c1c] hover:bg-[#fff7f7]'
      : variant === 'text'
        ? 'min-h-8 border-transparent bg-transparent px-1 text-[#b91c1c] hover:bg-transparent hover:text-[#cc0000]'
        : variant === 'danger'
          ? 'border-[#b91c1c] bg-[#fdf4f4] text-[#b91c1c] hover:bg-[#fff1f1]'
          : 'border-transparent bg-[#b91c1c] text-white hover:bg-[#cc0000]';
  const classes = `${base} ${style} ${className}`;

  return to
    ? <Link className={classes} to={to} {...(props as any)}>{children}</Link>
    : <button className={classes} type={type} onClick={onClick} {...props}>{children}</button>;
}

type CloseButtonProps = {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  to?: string;
  variant?: ButtonProps['variant'];
};

export function CloseButton({ children = 'Tutup', className = '', onClick, to, variant = 'primary' }: CloseButtonProps) {
  return (
    <Button
      to={to}
      variant={variant}
      className={className}
      onClick={onClick}
      type="button"
    >
      {children}
    </Button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`min-w-0 rounded-xl border border-[#dddad0] bg-white p-4 shadow-[0_2px_12px_rgba(34,20,20,.04)] sm:p-6 ${className}`}>{children}</section>;
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  const status = String(children).toLowerCase();
  const color = ['hadir', 'aktif', 'disetujui'].includes(status)
    ? 'border-[#197152] bg-[#e6f5ee] text-[#197152]'
    : status === 'menunggu'
      ? 'border-[#be5f00] bg-[#fff5e0] text-[#be5f00]'
      : ['ditolak', 'terlambat', 'non aktif'].includes(status)
        ? 'border-[#cc1616] bg-[#fdf4f4] text-[#cc1616]'
        : status === 'izin'
          ? 'border-[#3976c5] bg-[#eaf2ff] text-[#3976c5]'
          : 'border-[#dddad0] bg-[#f8f8f8] text-[#6c7278]';
  return <span className={`badge inline-flex min-h-8 min-w-[86px] items-center justify-center whitespace-nowrap rounded-lg border px-3 py-1 text-sm font-normal leading-6 [border-width:.5px] ${color} ${className}`}>{children}</span>;
}

export function StatCard({ label, value, detail, icon = '◈', tone = '' }: { label: ReactNode; value: ReactNode; detail: ReactNode; icon?: ReactNode; tone?: string }) {
  const toneClasses = tone === 'green' ? 'bg-[#e2f5ee] text-[#008c5a]' : tone === 'gold' ? 'bg-[#fff5e0] text-[#be5f00]' : tone === 'purple' ? 'bg-[#f0ebff] text-[#7550ad]' : 'bg-[#fff0f0] text-[#b91c1c]';
  return (
    <Card className="flex items-center gap-3 p-3 sm:gap-4 sm:p-[18px]">
      <div className={`grid size-9 shrink-0 place-items-center rounded-xl text-xl sm:size-11 ${toneClasses}`}>{icon}</div>
      <div className="grid min-w-0 gap-1">
        <span className="text-[10px] leading-4 text-[#6c7278]">{label}</span>
        <strong className="font-[Plus_Jakarta_Sans] text-xl leading-7 text-[#252525]">{value}</strong>
        <small className="text-[10px] leading-4 text-[#6c7278]">{detail}</small>
      </div>
    </Card>
  );
}

export function Avatar({ user, size = 'normal' }: { user?: { avatar?: string } | null; size?: string }) {
  const sizeClasses = size === 'profile' ? 'size-[180px] min-[1001px]:size-[280px]' : size === 'large' ? 'size-[53px] sm:size-[58px]' : size === 'home' ? 'size-12' : size === 'topbar' ? 'size-8 sm:size-10 lg:size-[60px]' : 'size-[25px]';
  const cropPosition = size === 'profile' ? 'object-[center_20%]' : size === 'home' || size === 'topbar' ? 'object-[center_11%]' : 'object-center';
  const profileClass = size === 'profile' ? 'avatar-profile' : '';
  return <img className={`${sizeClasses} ${profileClass} shrink-0 rounded-full bg-[#f1e5e5] object-cover ${cropPosition}`} src={user?.avatar || '/assets/avatar-karyawan.png'} alt="" />;
}

type Column = { label: ReactNode; key?: string; render?: (row: any) => ReactNode };
export function Table({ columns, rows, empty = 'Tidak ada data', className = '' }: { columns: Column[]; rows: any[]; empty?: ReactNode; className?: string }) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className={`w-full min-w-[700px] border-collapse text-left ${className}`}>
        <thead><tr>{columns.map((column, index) => <th className="h-14 whitespace-nowrap bg-[#b91c1c] px-4 py-4 text-sm font-medium leading-6 text-white" key={index}>{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row, index) => <tr className="h-16" key={row.key || index}>{columns.map((column, cellIndex) => <td className="border-b border-[#e5e5e5] px-4 py-4 text-sm leading-6 text-[#252525]" key={cellIndex}>{column.render ? column.render(row) : column.key ? row[column.key] : null}</td>)}</tr>) : <tr><td colSpan={columns.length} className="p-8 text-center text-sm text-[#6c7278]">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export function Field({ label, children, ...props }: { label: ReactNode; children?: ReactNode; [key: string]: any }) {
  return (
    <label className="grid min-w-0 gap-2 text-xs font-semibold text-[#45454c] [&_input]:min-h-10 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#e1e1e5] [&_input]:bg-white [&_input]:px-3 [&_input]:py-2 [&_input]:text-xs [&_select]:min-h-10 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#e1e1e5] [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-xs [&_textarea]:min-h-10 [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#e1e1e5] [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-xs">
      <span>{label}</span>{children || <input {...props} />}
    </label>
  );
}

export function EmptyAction({ to, children }: { to: string; children: ReactNode }) {
  return <Button to={to}>{children}</Button>;
}

export type EmployeeFormData = {
  name: string;
  gender: string;
  birthDate: string;
  division: string;
  position: string;
  employmentType: string;
  familyName: string;
  familyNik: string;
  familyBirthPlace: string;
  familyBirthDate: string;
  familyEducation: string;
  familyRelation: string;
};

export function DataKaryawanSearchBar({ query, onQueryChange, ariaLabel = 'Cari karyawan', className = '' }: { query: string; onQueryChange: (query: string) => void; ariaLabel?: string; className?: string }) {
  return (
    <label className={`employee-search flex h-[39px] w-[200px] items-center gap-[7px] rounded-[10px] border border-[#b91c1c] px-[13px] text-[#b91c1c] max-[800px]:h-9 max-[800px]:w-full ${className}`}>
      <img className="size-4 shrink-0 object-contain" src="/assets/figma-search-red.svg" alt="" />
      <input
        className="employee-search-input h-full min-w-0 flex-1 bg-transparent outline-none"
        aria-label={ariaLabel}
        placeholder="Cari berdasarkan"
        value={query}
        onChange={(event) => onQueryChange(event.currentTarget.value)}
      />
    </label>
  );
}

export function DataKaryawanBreadcrumb({ href, current, parentLabel = 'Data Karyawan' }: { href: string; current: string; parentLabel?: string }) {
  return (
    <nav className="employee-detail-breadcrumb" aria-label="Breadcrumb">
      <Link to={href}>{parentLabel}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export const employeeFieldClass = "[display:grid] [gap:1px] [padding-bottom:3px] [color:#777] [font:500_14px/21px_Inter,Arial,sans-serif] [&_input]:[width:100%] [&_input]:[height:38px] [&_input]:[padding:0_11px] [&_input]:[border:1px_solid_#dddad0] [&_input]:[border-radius:8px] [&_input]:[background:#fff] [&_input]:[color:#111] [&_input]:[font:500_16px/24px_Inter,Arial,sans-serif] [&_input]:[outline:none] [&_select]:[width:100%] [&_select]:[height:38px] [&_select]:[padding:0_11px] [&_select]:[border:1px_solid_#dddad0] [&_select]:[border-radius:8px] [&_select]:[background:#fff] [&_select]:[color:#111] [&_select]:[font:500_16px/24px_Inter,Arial,sans-serif] [&_select]:[outline:none] [&_input:focus]:[border-color:#b91c1c] [&_input:focus]:[box-shadow:0_0_0_3px_#b91c1c14] [&_select:focus]:[border-color:#b91c1c] [&_select:focus]:[box-shadow:0_0_0_3px_#b91c1c14] [font-size:var(--type-helper)]! [line-height:var(--line-helper)]! [&_input]:[font-size:var(--type-input)]! [&_input]:[line-height:var(--line-input)]! [&_select]:[font-size:var(--type-input)]! [&_select]:[line-height:var(--line-input)]! [&>span]:[font-size:var(--type-label)]! [&>span]:[line-height:var(--line-label)]!";

function EmployeeBirthDateField({ value, onChange, DatePicker }: {
  value: string;
  onChange: (value: string) => void;
  DatePicker?: (props: { value: string; onChange: (value: string) => void }) => ReactNode;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        menuRef.current?.removeAttribute('open');
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, []);

  const formatDate = (date: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
  };
  const [today] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  return (
    <>
      <details ref={menuRef} className="attendance-date-menu employee-birth-date-menu" data-required="true" data-value={value}>
        <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!value} aria-label={`Tanggal lahir: ${value ? formatDate(value) : 'dd/mm/yyyy'}`} aria-required="true" aria-invalid={!value}>
          <img src="/assets/figma-calendar.svg" alt="" />
          <span>{value ? formatDate(value) : 'dd/mm/yyyy'}</span>
        </summary>
        {DatePicker && <DatePicker key={value || 'empty'} value={value || today} onChange={onChange} />}
      </details>
    </>
  );
}

function EmployeeFormDropdown({ label, value, placeholder, options, onChange, required = true }: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <details
      className="attendance-form-select-menu"
      name="attendance-form-select"
      data-required={required ? 'true' : undefined}
      data-value={value}
    >
      <summary
        className="attendance-filter-trigger attendance-form-select-trigger"
        data-empty={!value}
        aria-label={`${label}: ${value || placeholder}`}
        aria-required={required}
        aria-invalid={required && !value}
      >
        <span>{value || placeholder}</span>
        <img src="/assets/figma-chevron-down.svg" alt="" />
      </summary>
      <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label={`Pilih ${label.toLowerCase()}`}>
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
  );
}

export function DataKaryawanFormModal({
  isFamily,
  isEdit,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  familyEducationOptions = [],
  DatePicker,
  title,
  children,
  submitLabel = 'Simpan',
  className = '',
}: {
  isFamily: boolean;
  isEdit: boolean;
  formData?: EmployeeFormData;
  setFormData?: (values: EmployeeFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  familyEducationOptions?: string[];
  DatePicker?: (props: { value: string; onChange: (value: string) => void }) => ReactNode;
  title?: string;
  children?: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const values: EmployeeFormData = formData || {
    name: '', gender: '', birthDate: '', division: '', position: '', employmentType: '',
    familyName: '', familyNik: '', familyBirthPlace: '', familyBirthDate: '',
    familyEducation: '', familyRelation: '',
  };
  const update = (values: Partial<EmployeeFormData>) => {
    if (formData && setFormData) setFormData({ ...formData, ...values });
  };

  return (
    <div className="[position:fixed] [inset:0] [z-index:40] [display:grid] [place-items:center] [padding:18px] [overflow:auto] employee-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <form
        className={`employee-edit-form [width:min(420px,100%)] [max-height:min(550px,calc(100dvh_-_26px))] [overflow-y:auto] [padding:28px_25px_25px] [border:1px_solid_#dddad0] [border-radius:11px] [background:#fff] [box-shadow:0_20px_80px_#2222] [display:grid] [align-content:start] [gap:7px] [&_h2]:[margin:0_0_18px] [&_h2]:[color:#b91c1c] [&_h2]:[font:600_28px/40px_Inter,Arial,sans-serif] [&_h2]:[letter-spacing:-1.1px] max-[520px]:[padding:20px_17px_17px] max-[520px]:[border-radius:14px] max-[520px]:[&_h2]:[font-size:17px] max-[520px]:[&_h2]:[line-height:23px] [&_h2]:[margin-bottom:13px] [&_h2]:[font-size:var(--type-modal-title)]! [&_h2]:[line-height:var(--line-modal-title)]! ${className}`}
        onSubmit={(event) => {
          const missingDropdown = event.currentTarget.querySelector<HTMLDetailsElement>(
            'details[data-required="true"][data-value=""]',
          );
          if (missingDropdown) {
            event.preventDefault();
            missingDropdown.querySelector('summary')?.focus();
            return;
          }
          onSubmit(event);
        }}
      >
        <h2>{title || (isFamily ? 'Tambah Data Keluarga' : isEdit ? 'Edit Data Karyawan' : 'Tambah Data Karyawan')}</h2>

        {children !== undefined ? children : isFamily ? (
          <>
            <label className="employee-family-field"><span>Nama</span><input required placeholder="Masukkan nama anggota keluarga" value={values.familyName} onChange={(event) => update({ familyName: event.target.value })} /></label>
            <label className="employee-family-field"><span>NIK</span><input inputMode="numeric" required placeholder="Masukkan NIK" value={values.familyNik} onChange={(event) => update({ familyNik: event.target.value })} /></label>
            <label className="employee-family-field"><span>Tempat Lahir</span><input required placeholder="Masukkan tempat lahir" value={values.familyBirthPlace} onChange={(event) => update({ familyBirthPlace: event.target.value })} /></label>
            <label className="employee-family-field"><span>Tanggal Lahir</span><input required type="date" value={values.familyBirthDate} onChange={(event) => update({ familyBirthDate: event.target.value })} /></label>
            <label className="employee-family-field"><span>Pendidikan</span><EmployeeFormDropdown label="Pendidikan" value={values.familyEducation} placeholder="Pilih pendidikan" options={familyEducationOptions} onChange={(familyEducation) => update({ familyEducation })} /></label>
            <label className="employee-family-field"><span>Hubungan Keluarga</span><EmployeeFormDropdown label="Hubungan Keluarga" value={values.familyRelation} placeholder="Pilih hubungan keluarga" options={['Pasangan', 'Anak', 'Orang Tua']} onChange={(familyRelation) => update({ familyRelation })} /></label>
          </>
        ) : (
          <>
            <label className={employeeFieldClass}><span>Nama</span><input required placeholder="Masukkan nama karyawan" value={values.name} onChange={(event) => update({ name: event.target.value })} /></label>
            <label className={employeeFieldClass}><span>Jenis Kelamin</span><EmployeeFormDropdown label="Jenis Kelamin" value={values.gender} placeholder="Pilih jenis kelamin" options={['Laki-Laki', 'Perempuan']} onChange={(gender) => update({ gender })} /></label>
            <label className={employeeFieldClass}><span>Tanggal Lahir</span><EmployeeBirthDateField value={values.birthDate} onChange={(birthDate) => update({ birthDate })} DatePicker={DatePicker} /></label>
            <label className={employeeFieldClass}><span>Divisi</span><EmployeeFormDropdown label="Divisi" value={values.division} placeholder="Pilih divisi" options={['Kepengasuhan', 'Pengelola', 'Administrasi', 'Operasional', 'Direksi']} onChange={(division) => update({ division })} /></label>
            <label className={employeeFieldClass}><span>Posisi</span><EmployeeFormDropdown label="Posisi" value={values.position} placeholder="Pilih posisi" options={['Pengasuh', 'Sekretaris', 'Manajer Kepengasuhan', 'Administrasi Perpustakaan', 'Administrasi Keuangan', 'Karyawan']} onChange={(position) => update({ position })} /></label>
            <label className={employeeFieldClass}><span>Jenis Karyawan</span><EmployeeFormDropdown label="Jenis Karyawan" value={values.employmentType} placeholder="Pilih jenis karyawan" options={['PNS', 'Non PNS']} onChange={(employmentType) => update({ employmentType })} /></label>
          </>
        )}

        <div className="[display:flex] [justify-content:flex-end] [gap:7px] [margin-top:34px] [&_.button]:[width:69px] [&_.button]:[min-width:69px] [&_.button]:[min-height:34px] [&_.button]:[padding:0_10px] [&_.button]:[border-radius:6px] [&_.button]:[font-size:10px] [&_.button-outline]:[border-color:#b91c1c] [&_.button-outline]:[color:#b91c1c] [&_.button-outline]:[background:#fff] max-[520px]:[margin-top:17px] employee-form-actions">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <button type="submit" className="[min-height:39px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border:1px_solid_transparent] [border-radius:8px] [background:#b91c1c] [color:#fff] [padding:0_17px] [font-size:var(--type-button)]! [font-weight:600] [white-space:nowrap] [transition:.15s] [&:hover]:[background:#cc0000] [font:500_14px/24px_Inter,Arial,sans-serif] [box-shadow:none] max-[520px]:[min-height:40px] [line-height:var(--line-button)]! max-[520px]:[padding:0_12px] max-[520px]:[font-size:9px]">{submitLabel || 'Simpan'}</button>
        </div>
      </form>
    </div>
  );
}
