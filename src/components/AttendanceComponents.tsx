import { useState } from 'react';
import { Link } from 'react-router';
import { Badge, Button, CloseButton, DataKaryawanSearchBar, Pagination } from './UI';
import { formatAttendanceDate } from '../utils/attendance';

function formatAttendanceTime(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return match ? `${match[1]}:${match[2]}` : '';
}

function parseAttendanceTime(value: string) {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;

  const hour = Number(match[1]);
  if (hour > 23) return null;

  return `${String(hour).padStart(2, '0')}:${match[2]}`;
}

export function AttendanceTimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(() => formatAttendanceTime(value));
  const [selectionStep, setSelectionStep] = useState<'hour' | 'minute'>('hour');
  const [selectedHour, setSelectedHour] = useState(value.split(':')[0] || '00');
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

  const updateDraft = (nextDraft: string) => {
    setDraft(nextDraft);
    const parsed = nextDraft.trim() ? parseAttendanceTime(nextDraft) || '' : '';
    onChange(parsed);
    if (parsed) setSelectedHour(parsed.split(':')[0]);
  };

  return (
    <div className="attendance-time-picker">
      <input
        className="attendance-time-input"
        type="text"
        inputMode="text"
        aria-label={`Waktu ${label}`}
        placeholder="--:--"
        value={draft}
        onChange={(event) => updateDraft(event.target.value)}
        onBlur={() => {
          const parsed = parseAttendanceTime(draft);
          setDraft(parsed ? formatAttendanceTime(parsed) : formatAttendanceTime(value));
          if (parsed) setSelectedHour(parsed.split(':')[0]);
        }}
      />
      <details
        className="attendance-time-menu"
        name="attendance-form-select"
        onToggle={(event) => {
          const menu = event.currentTarget;
          if (menu.open) {
            setSelectionStep('hour');
            requestAnimationFrame(() => menu.querySelector('.is-selected')?.scrollIntoView({ block: 'nearest' }));
          }
        }}
      >
        <summary className="attendance-time-trigger" aria-label={`Pilih waktu ${label}`}>
          <img src="/assets/jam-form.svg" alt="" />
        </summary>
        <div className="attendance-time-options" role="group" aria-label={`Pilih waktu ${label}`}>
          <div className="attendance-time-popup-header">
            <span>{selectionStep === 'hour' ? 'Pilih jam' : `Pilih menit untuk ${selectedHour}`}</span>
            <CloseButton
              className="attendance-time-close-button"
              onClick={(event) => {
                if (selectionStep === 'minute') setSelectionStep('hour');
                else event.currentTarget.closest('details')?.removeAttribute('open');
              }}
            >
              {selectionStep === 'minute' ? 'Kembali' : 'Tutup'}
            </CloseButton>
          </div>
          <div className="attendance-time-list" role="listbox" aria-label={selectionStep === 'hour' ? 'Daftar jam' : 'Daftar menit'}>
            {(selectionStep === 'hour' ? hours : minutes).map((part) => {
              const isSelected = selectionStep === 'hour'
                ? part === selectedHour
                : value.split(':')[0] === selectedHour && part === value.split(':')[1];

              return (
                <button
                  key={part}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={isSelected ? 'is-selected' : ''}
                  onClick={(event) => {
                    if (selectionStep === 'hour') {
                      setSelectedHour(part);
                      setSelectionStep('minute');
                      return;
                    }

                    const nextTime = `${selectedHour}:${part}`;
                    setDraft(nextTime);
                    onChange(nextTime);
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}
                >
                  {part}
                </button>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
}

export function AttendanceDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = new Date(`${value}T00:00:00`);
  const [viewMonth, setViewMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(viewMonth);
  const monthStart = new Date(year, month, 1);
  const firstDayOffset = (monthStart.getDay() + 6) % 7;
  const calendarStart = new Date(year, month, 1 - firstDayOffset);
  const dayCount = new Date(year, month + 1, 0).getDate();
  const calendarCellCount = Math.ceil((firstDayOffset + dayCount) / 7) * 7;
  const calendarDays = Array.from({ length: calendarCellCount }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
  const months = Array.from({ length: 12 }, (_, index) => ({
    index,
    name: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(year, index, 1)).replace('.', ''),
  }));

  const selectDate = (date: Date, details?: HTMLDetailsElement | null) => {
    const isoDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    onChange(isoDate);
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    details?.removeAttribute('open');
  };

  const changeMonth = (amount: number) => {
    setViewMonth(new Date(year, month + amount, 1));
    setShowMonthPicker(false);
  };

  return (
    <div className="employee-export-options attendance-date-options">
      <div className="attendance-calendar">
        <div className="attendance-calendar-heading">
          <button type="button" aria-label="Bulan sebelumnya" onClick={() => changeMonth(-1)}>
            <img className="attendance-calendar-prev" src="/assets/figma-chevron-down.svg" alt="" />
          </button>
          <button
            type="button"
            className="attendance-calendar-month-toggle"
            aria-expanded={showMonthPicker}
            aria-label="Pilih bulan"
            onClick={() => setShowMonthPicker((isVisible) => !isVisible)}
          >
            <span>{monthName}</span>
            <img className={showMonthPicker ? 'is-open' : ''} src="/assets/figma-chevron-down.svg" alt="" />
          </button>
          <button type="button" aria-label="Bulan berikutnya" onClick={() => changeMonth(1)}>
            <img className="attendance-calendar-next" src="/assets/figma-chevron-down.svg" alt="" />
          </button>
        </div>
        {showMonthPicker ? (
          <div className="attendance-calendar-month-grid" role="group" aria-label="Pilih bulan">
            {months.map((item) => (
              <button
                key={item.index}
                type="button"
                aria-pressed={month === item.index}
                className={month === item.index ? 'is-selected' : ''}
                onClick={() => {
                  setViewMonth(new Date(year, item.index, 1));
                  setShowMonthPicker(false);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="attendance-calendar-weekdays" aria-hidden="true">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="attendance-calendar-grid" role="group" aria-label={monthName}>
              {calendarDays.map((date) => {
                const isoDate = [
                  date.getFullYear(),
                  String(date.getMonth() + 1).padStart(2, '0'),
                  String(date.getDate()).padStart(2, '0'),
                ].join('-');
                const isSelected = isoDate === value;
                const isOutsideMonth = date.getMonth() !== month;

                return (
                  <button
                    key={isoDate}
                    type="button"
                    aria-pressed={isSelected}
                    className={`attendance-calendar-day${isSelected ? ' is-selected' : ''}${isOutsideMonth ? ' is-outside-month' : ''}`}
                    onClick={(event) => selectDate(date, event.currentTarget.closest('details'))}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AttendanceDateFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [calendarOpenKey, setCalendarOpenKey] = useState(0);

  return (
    <details
      className="attendance-date-menu"
      name="attendance-filters"
      onToggle={(event) => {
        if (event.currentTarget.open) setCalendarOpenKey((key) => key + 1);
      }}
    >
      <summary className="figma-date-select attendance-date-trigger">
        <img src="/assets/figma-calendar-red.svg" alt="" />
        <span>{formatAttendanceDate(value)}</span>
        <img src="/assets/figma-chevron-down-red.svg" alt="" />
      </summary>
      <AttendanceDatePicker
        key={calendarOpenKey}
        value={value}
        onChange={onChange}
      />
    </details>
  );
}

type AttendanceStat = {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: string;
};

export function AttendanceSummaryCards({ stats }: { stats: AttendanceStat[] }) {
  return (
    <div className={"[display:grid] [grid-template-columns:repeat(5,minmax(0,1fr))] [gap:17px] [margin-bottom:20px] max-[1250px]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-[1250px]:[gap:16px] max-[800px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[800px]:[gap:8px] max-[520px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[520px]:[margin-bottom:18px] max-[1150px]:[grid-template-columns:repeat(3,minmax(0,1fr))] max-[1150px]:[gap:9px] max-[800px]:[margin-bottom:14px]"}>
      {stats.map(({ label, value, detail, icon, tone }) => (
        <section
          className={"[height:118px] [min-width:0] [padding:17px] [border:1px_solid_#dddad0] [border-radius:8px] [display:flex] [flex-direction:column] [justify-content:space-between] [&_small]:[margin-top:6px] [&_small]:[color:#111] [&_small]:[font:400_12px/18px_Inter,Arial,sans-serif] [&_strong]:[color:#111] [&_strong]:[font:500_25.6px/32px_Inter,Arial,sans-serif] max-[800px]:[height:101px] max-[800px]:[padding:13px] max-[520px]:[height:92px] max-[520px]:[padding:10px] max-[520px]:[&_strong]:[font-size:18px] [&_small]:[font-size:var(--type-body)]! [&_small]:[line-height:var(--line-body)]! [&_strong]:[font-size:25.6px]! [&_strong]:[line-height:32px]! max-[520px]:[&_strong]:[line-height:23px]"}
          key={label}
        >
          <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:6px] [min-width:0]"}>
            <span className={"[width:28px] [height:28px] [flex:none] [display:grid] [place-items:center] [border:1px_solid_#dddad0] [border-radius:6px] [&_img]:[width:14px] [&_img]:[height:14px] [&_img]:[object-fit:contain] [&_img.attendance-red-icon]:[filter:invert(11%)_sepia(100%)_saturate(7492%)_hue-rotate(0deg)_brightness(77%)_contrast(118%)]"}>
              <img
                className={icon === 'figma-employee.svg'
                  ? 'attendance-red-icon'
                  : icon === 'dashboard-chair.svg'
                    ? 'attendance-hadir-icon'
                    : undefined}
                src={`/assets/${icon}`}
                alt=""
              />
            </span>
            <span className={`text-right text-[12px] leading-4 font-medium ${tone === 'all' || tone === 'success' ? 'text-[#008c5a]' : tone === 'danger' ? 'text-[#b91c1c]' : 'text-[#be5f00]'}`}>
              {label}
            </span>
          </div>
          <small>{detail}</small>
          <strong>{value.padStart(2, '0')}</strong>
        </section>
      ))}
    </div>
  );
}

export function AttendanceToolbar({
  query,
  division,
  divisionOptions,
  period,
  role,
  canEdit = true,
  onQueryChange,
  onDivisionChange,
  onPeriodChange,
  onExportExcel,
  onExportPdf,
}: {
  query: string;
  division: string;
  divisionOptions: string[];
  period: string;
  role: string;
  canEdit?: boolean;
  onQueryChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
}) {
  return (
    <div className={"attendance-toolbar attendance-page-toolbar [display:flex] [align-items:center] [justify-content:space-between] [gap:8px] [margin-bottom:17px] [&>.button:last-child]:[width:99px] [&>.button:last-child]:[min-width:99px] [&>.button_span]:[font-size:14px] [&>.button_span]:[line-height:1] max-[1250px]:[flex-wrap:wrap] max-[1250px]:[justify-content:flex-start] max-[1250px]:[&>.button:last-child]:[margin-left:auto] max-[800px]:[display:grid] max-[800px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[800px]:[&>.button:last-child]:[width:100%] max-[800px]:[&>.button:last-child]:[min-width:0] max-[800px]:[&>.button:last-child]:[margin-left:0] max-[520px]:[gap:7px] max-[520px]:[&>.button]:[min-height:34px] max-[1150px]:[gap:6px] max-[1150px]:[&>.button:last-child]:[width:78px] max-[1150px]:[&>.button:last-child]:[min-width:78px] max-[800px]:[gap:7px]"}>
      <DataKaryawanSearchBar query={query} ariaLabel="Cari data absensi" className="" onQueryChange={onQueryChange} />
      <details className="attendance-filter-menu attendance-filter-menu--division" name="attendance-filters">
        <summary className="attendance-filter-trigger">
          <span className="attendance-filter-label">
            <img src="/assets/all-devision.svg" alt="" />
            <span>{division}</span>
          </span>
          <img className="attendance-filter-chevron" src="/assets/figma-chevron-down-red.svg" alt="" />
        </summary>
        <div className="employee-export-options attendance-filter-options" role="group" aria-label="Pilih divisi">
          {['Semua Divisi', ...divisionOptions].map((item) => (
            <button key={item} type="button" aria-pressed={division === item} onClick={(event) => {
              onDivisionChange(item);
              event.currentTarget.closest('details')?.removeAttribute('open');
            }}>{item}</button>
          ))}
        </div>
      </details>
      <details className="attendance-filter-menu attendance-filter-menu--period" name="attendance-filters">
        <summary className="attendance-filter-trigger">
          <span className="attendance-filter-label">
            <img src="/assets/figma-calendar-red.svg" alt="" />
            <span>{period}</span>
          </span>
          <img className="attendance-filter-chevron" src="/assets/figma-chevron-down-red.svg" alt="" />
        </summary>
        <div className="employee-export-options attendance-filter-options" role="group" aria-label="Pilih periode">
          {['Harian', 'Mingguan', 'Bulanan'].map((item) => (
            <button key={item} type="button" aria-pressed={period === item} onClick={(event) => {
              onPeriodChange(item);
              event.currentTarget.closest('details')?.removeAttribute('open');
            }}>{item}</button>
          ))}
        </div>
      </details>
      <details className="employee-export-menu">
        <summary className="employee-export-button">Export <img src="/assets/figma-export.svg" alt="" /></summary>
        <div className="employee-export-options" role="group" aria-label="Pilih format export absensi">
          <button type="button" onClick={(event) => {
            event.currentTarget.closest('details')?.removeAttribute('open');
            onExportExcel();
          }}>Excel (.xlsx)</button>
          <button type="button" onClick={(event) => {
            event.currentTarget.closest('details')?.removeAttribute('open');
            onExportPdf();
          }}>PDF (.pdf)</button>
        </div>
      </details>
      {canEdit && (
        <Button className="employee-add-button" to={`/${role}/attendance/new`}>
          Tambah <img className="size-4 shrink-0 object-contain" src="/assets/figma-plus-white.svg" alt="" />
        </Button>
      )}
    </div>
  );
}

/**
 * Menampilkan tombol aksi untuk setiap data absensi.
 *
 * Aksi yang tersedia:
 * - Melihat detail absensi
 * - Mengedit data absensi
 * - Menghapus data absensi
 */
export function AttendanceActions({ role, record, onDelete, readOnly = false }) {
  return (
    <div className="data-employee-actions">
      {/* Tombol untuk melihat detail absensi */}
      <Link
        to={`/${role}/attendance/${record.id}`}
        aria-label="Lihat detail"
        className="data-employee-action data-employee-action-view"
      >
        <img src="/assets/figma-view.svg" alt="" />
      </Link>

      {!readOnly && (
        <Link
          to={`/${role}/attendance/${record.id}/edit`}
          aria-label="Edit absensi"
          className="data-employee-action data-employee-action-edit"
        >
          <img src="/assets/figma-edit.svg" alt="" />
        </Link>
      )}

      {/* Tombol untuk menghapus data absensi */}
      {!readOnly && (
        <button
          type="button"
          className="data-employee-action data-employee-action-delete"
          aria-label="Hapus absensi"
          onClick={onDelete}
        >
          <img src="/assets/figma-delete.svg" alt="" />
        </button>
      )}
    </div>
  );
}

type AttendanceTableRow = {
  id: string;
  sourceAttendanceId?: string;
  employee: string;
  division: string;
  position: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: string;
};

export function AttendanceTable({
  rows,
  page,
  rowsPerPage,
  totalPages,
  role,
  readOnly = false,
  onPageChange,
  onDelete,
}: {
  rows: AttendanceTableRow[];
  page: number;
  rowsPerPage: number;
  totalPages: number;
  role: string;
  readOnly?: boolean;
  onPageChange: (page: number) => void;
  onDelete: (id: string, employee: string) => void;
}) {
  const tableHeaders = ['No', 'Nama Karyawan', 'Divisi', 'Posisi', 'Masuk', 'Pulang', 'Total Jam', 'Status', 'Action'];

  return (
    <>
      <div className={"[width:100%] [min-width:0] [overflow-x:auto] [overscroll-behavior-x:contain]"}>
        <table className={"attendance-table [width:100%] [min-width:469px] [border-collapse:separate] [border-spacing:0] [text-align:left] [&_thead_tr]:[height:48px] [&_thead_tr]:[background:#b91c1c] [&_th]:[height:48px] [&_th]:[padding:0_11px] [&_th]:[background:#b91c1c] [&_th]:[color:#fff] [&_th]:[font:400_16px/24px_Inter,Arial,sans-serif] [&_th]:[letter-spacing:0] [&_th:first-child]:[border-radius:8px_0_0_8px] [&_th:first-child]:[text-align:center] [&_th:last-child]:[border-radius:0_8px_8px_0] [&_td]:[height:45px] [&_td]:[padding:7px_11px] [&_td]:[border-bottom:.5px_solid_#0003] [&_td]:[color:#111] [&_td]:[font:300_15px/22px_Inter,Arial,sans-serif] [&_td]:[vertical-align:middle] [&_td:first-child]:[text-align:center] [&_tbody_tr:last-child_td]:[border-bottom-color:#0002] max-[600px]:[min-width:680px] [&_th]:[font-size:var(--type-table)]! [&_th]:[line-height:var(--line-table)]! [&_td]:[font-size:var(--type-table)]! [&_td]:[line-height:var(--line-table)]! max-[520px]:[min-width:476px] [min-width:816px] [&_th:first-child]:[width:56px] [&_th:first-child]:[text-align:center] [&_td:first-child]:[width:56px] [&_td:first-child]:[text-align:center] [&_th:nth-child(2)]:[width:154px] [&_th:nth-child(3)]:[width:102px] [&_th:nth-child(4)]:[width:140px] [&_th:nth-child(5)]:[width:56px] [&_th:nth-child(6)]:[width:56px] [&_th:nth-child(7)]:[width:70px] [&_th:nth-child(8)]:[width:90px] [&_th:nth-child(9)]:[width:120px] [&_td_.badge]:[min-width:86px] [&_td_.badge]:[justify-content:center] [&_td_.badge]:[padding:4px_8px] [&_td_.badge]:[border:1px_solid_#8dd4b2] [&_td_.badge]:[border-radius:6px] [&_td_.badge]:[background:#e4f5ef] [&_td_.badge]:[color:#008c5a] [&_td_.badge]:[font:400_12px/16px_Inter,Arial,sans-serif] [&_td_.badge-terlambat]:[border-color:#f3c881] [&_td_.badge-terlambat]:[background:#fff5e0] [&_td_.badge-terlambat]:[color:#be5f00] [&_td_.badge]:[font-size:var(--type-badge)]! [&_td_.badge]:[line-height:var(--line-badge)]! max-[800px]:[min-width:700px] [&_th]:[font-size:var(--type-table)]! [&_th]:[line-height:var(--line-table)]! [&_td]:[font-size:var(--type-table)]! [&_td]:[line-height:var(--line-table)]! [&_.badge]:[font-size:12px]! [&_.badge]:[line-height:16px]!"}>
          <thead><tr>{tableHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id}>
                <td>{String((page - 1) * rowsPerPage + index + 1).padStart(2, '0')}</td>
                <td>{item.employee}</td>
                <td>{item.division}</td>
                <td>{item.position}</td>
                <td>{item.checkIn}</td>
                <td>{item.checkOut}</td>
                <td>{item.totalHours}</td>
                <td><Badge className={'attendance-status-badge ' + (item.status === 'Terlambat' ? 'badge-terlambat' : '') + (item.status === 'Belum Absen' ? ' badge-belum-absen' : '')}>{item.status}</Badge></td>
                <td>{item.sourceAttendanceId ? (
                  <AttendanceActions
                    role={role}
                    readOnly={readOnly}
                    record={{ ...item, id: item.sourceAttendanceId }}
                    onDelete={() => onDelete(item.sourceAttendanceId!, item.employee)}
                  />
                ) : '—'}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={tableHeaders.length} className="p-8 text-center text-sm text-[#6c7278]">Tidak ada data absensi.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination size="compact" className="attendance-pagination" page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}

/**
 * Menampilkan detail dari satu data absensi.
 *
 * Dialog menampilkan:
 * - Nama
 * - Divisi
 * - Posisi
 * - Jam masuk
 * - Jam pulang
 * - Total jam kerja
 * - Status absensi
 */
export function AttendanceDialog({ record, role, onClose }) {
  const details = [
    ['Nama', record.employee],
    ['Divisi', record.division],
    ['Posisi', record.position || 'Pengasuh'],
    ['Jam Masuk', record.checkIn],
    ['Jam Pulang', record.checkOut],
    ['Total Jam', record.totalHours || '8'],
    ['Status', record.status],
  ];

  return (
    <div
      className="employee-family-detail-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="attendance-detail-title"
        aria-modal="true"
        className="employee-family-detail-modal"
        role="dialog"
      >
        <h2 id="attendance-detail-title">Detail Absensi</h2>

        <div className="employee-family-detail-fields">
          {details.map(([label, value]) => (
            <div className="employee-family-detail-field" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>

        <div className="employee-family-detail-actions attendance-detail-actions">
          <CloseButton
            className="attendance-detail-close-button"
            to={`/${role}/attendance`}
            onClick={onClose}
          />
        </div>
      </section>
    </div>
  );
}

export function AttendanceDeleteDialog({ employee, onCancel, onConfirm }) {
  return (
    <div
      className="employee-delete-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        aria-labelledby="attendance-delete-title"
        aria-describedby="attendance-delete-description"
        aria-modal="true"
        className="employee-delete-dialog"
        role="dialog"
      >
        <span className="employee-delete-warning-icon" aria-hidden="true">!</span>
        <h2 id="attendance-delete-title">Hapus</h2>
        <p id="attendance-delete-description">Apakah Anda yakin untuk menghapus data?</p>
        <div className="employee-delete-dialog-actions">
          <Button className="button button-outline" variant="outline" type="button" onClick={onCancel}>Batal</Button>
          <Button className="button" type="button" onClick={onConfirm}>Hapus</Button>
        </div>
        <span className="sr-only">Data absensi {employee}</span>
      </section>
    </div>
  );
}

export function AttendanceDeleteSuccessDialog({ onClose }) {
  return (
    <div
      className="employee-delete-dialog-backdrop success-auto-dismiss"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="attendance-delete-success-title"
        aria-describedby="attendance-delete-success-description"
        aria-modal="true"
        className="employee-delete-dialog employee-delete-success"
        role="dialog"
      >
        <h2 id="attendance-delete-success-title">Berhasil</h2>
        <p id="attendance-delete-success-description">Data telah berhasil dihapus</p>
      </section>
    </div>
  );
}

/**
 * Form untuk menambahkan atau mengedit data absensi.
 *
 * Form menerima data absensi yang sedang diedit melalui `record`.
 * Jika `record` tidak tersedia, form digunakan untuk menambahkan
 * data absensi baru.
 */
export function AttendanceForm({
  record,
  employees,
  attendance,
  selectedDate,
  addAttendance,
  updateAttendance,
  onCancel,
}) {
  // State untuk menyimpan nilai setiap field pada form.
  const [employee, setEmployee] = useState(record?.employee || '');
  const [division, setDivision] = useState(record?.division || '');
  const [position, setPosition] = useState(record?.position || '');
  const [checkIn, setCheckIn] = useState(record?.checkIn || '');
  const [checkOut, setCheckOut] = useState(record?.checkOut || '');
  const [formError, setFormError] = useState('');

  const rosterNames = new Set(employees.map((item) => item.name));
  const attendanceEmployeeOptions = attendance
    .filter((item) => !rosterNames.has(item.employee))
    .map((item) => ({
      id: `attendance-${item.employee}`,
      name: item.employee,
      division: item.division,
      position: item.position,
    }))
    .filter((item, index, list) => list.findIndex((candidate) => candidate.name === item.name) === index);
  const employeeOptions = [...employees, ...attendanceEmployeeOptions];
  const divisionOptions = [...new Set<string>(employeeOptions.map((item) => item.division).filter(Boolean))];
  const positionOptions = [...new Set<string>(employeeOptions.map((item) => item.position).filter(Boolean))];

  /**
   * Menghitung total jam kerja berdasarkan jam masuk dan jam pulang.
   *
   * Hasil perhitungan dikonversi dari menit menjadi jam.
   */
  const calculateTotalHours = () => {
    // Jika salah satu waktu belum diisi, total jam dianggap 0.
    if (!checkIn || !checkOut) {
      return '0';
    }

    const [inHour, inMinute] = checkIn.split(':').map(Number);
    const [outHour, outMinute] = checkOut.split(':').map(Number);

    // Mengubah waktu masuk dan keluar menjadi total menit.
    const checkInMinutes = inHour * 60 + inMinute;
    const checkOutMinutes = outHour * 60 + outMinute;

    // Memastikan hasil tidak bernilai negatif.
    const totalMinutes = Math.max(
      0,
      checkOutMinutes - checkInMinutes
    );

    return (totalMinutes / 60).toString();
  };

  /**
   * Menangani proses penyimpanan form.
   *
   * Jika terdapat `record`, data akan diperbarui.
   * Jika tidak terdapat `record`, data baru akan ditambahkan.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee || !division || !position || !checkIn || !checkOut) {
      setFormError('Lengkapi semua field terlebih dahulu.');
      return;
    }

    /**
     * Membentuk data absensi yang akan disimpan.
     *
     * Status ditentukan berdasarkan jam masuk:
     * - Setelah 09:00: Terlambat
     * - 09:00 atau sebelumnya: Hadir
     */
    const payload = {
      employee,
      division,
      position,
      checkIn,
      checkOut,
      totalHours: calculateTotalHours(),
      date: record?.date || formatAttendanceDate(selectedDate),
      status: checkIn > '09:00' ? 'Terlambat' : 'Hadir',
    };

    // Memperbarui data jika sedang dalam mode edit.
    if (record) {
      updateAttendance(record.id, payload);
    } else {
      // Menambahkan data baru jika sedang dalam mode tambah.
      addAttendance(payload);
    }

    // Menutup form setelah data berhasil diproses.
    onCancel();
  };

  return (
    <div className={"employee-modal-page attendance-modal-page employee-modal-backdrop [position:fixed] [inset:0] [z-index:40] [display:grid] [place-items:center] [padding:18px] [overflow:auto]"}>
      <form
        className={"employee-edit-form [width:min(420px,100%)] [max-height:calc(100dvh_-_26px)] [overflow-y:auto] [padding:28px_25px_25px] [border:1px_solid_#dddad0] [border-radius:11px] [background:#fff] [box-shadow:0_20px_80px_#2222] [display:grid] [align-content:start] [gap:7px] [&_h2]:[margin:0_0_18px] [&_h2]:[color:#b91c1c] [&_h2]:[font:600_28px/40px_Inter,Arial,sans-serif] [&_h2]:[letter-spacing:-1px] [&_.employee-form-actions]:[margin-top:34px] [&_.employee-form-actions_.button]:[min-height:40px] max-[520px]:[padding:20px_17px_17px] max-[520px]:[&_h2]:[font-size:17px] max-[520px]:[&_h2]:[line-height:23px] [&_h2]:[margin-bottom:13px] [&_h2]:[font-size:var(--type-modal-title)]! [&_h2]:[line-height:var(--line-modal-title)]!"}
        onSubmit={handleSubmit}
      >
        <h2>{record ? 'Edit Absensi' : 'Tambah Absensi'}</h2>

        {/* Field nama pegawai */}
        <label className="attendance-form-field">
          <span>Nama</span>
          <details className="attendance-form-select-menu" name="attendance-form-select">
            <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!employee}>
              <span>{employee || 'Pilih karyawan'}</span>
              <img src="/assets/figma-chevron-down.svg" alt="" />
            </summary>
            <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label="Pilih karyawan">
              {employeeOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={employee === item.name}
                  onClick={(event) => {
                    setEmployee(item.name);
                    setDivision(item.division || '');
                    setPosition(item.position || '');
                    setFormError('');
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </details>
        </label>

        {/* Field divisi */}
        <label className="attendance-form-field">
          <span>Divisi</span>
          <details className="attendance-form-select-menu" name="attendance-form-select">
            <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!division}>
              <span>{division || 'Pilih Divisi'}</span>
              <img src="/assets/figma-chevron-down.svg" alt="" />
            </summary>
            <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label="Pilih divisi">
              {divisionOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={division === item}
                  onClick={(event) => {
                    setDivision(item);
                    setFormError('');
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </details>
        </label>

        {/* Field posisi */}
        <label className="attendance-form-field">
          <span>Posisi</span>
          <details className="attendance-form-select-menu" name="attendance-form-select">
            <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!position}>
              <span>{position || 'Pilih Posisi'}</span>
              <img src="/assets/figma-chevron-down.svg" alt="" />
            </summary>
            <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label="Pilih posisi">
              {positionOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={position === item}
                  onClick={(event) => {
                    setPosition(item);
                    setFormError('');
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </details>
        </label>

        {/* Field jam masuk */}
        <label className="attendance-form-field">
          <span>Masuk</span>
          <AttendanceTimePicker
            label="masuk"
            value={checkIn}
            onChange={(value) => { setCheckIn(value); setFormError(''); }}
          />
        </label>

        {/* Field jam pulang */}
        <label className="attendance-form-field">
          <span>Pulang</span>
          <AttendanceTimePicker
            label="pulang"
            value={checkOut}
            onChange={(value) => { setCheckOut(value); setFormError(''); }}
          />
        </label>

        {/* Tombol aksi form */}
        {formError && <p className="attendance-form-error" role="alert">{formError}</p>}
        <div className={"employee-form-actions [display:flex] [justify-content:flex-end] [gap:7px] [margin-top:34px] [&_.button]:[width:69px] [&_.button]:[min-width:69px] [&_.button]:[min-height:34px] [&_.button]:[padding:0_10px] [&_.button]:[border-radius:6px] [&_.button]:[font-size:10px] [&_.button-outline]:[border-color:#b91c1c] [&_.button-outline]:[color:#b91c1c] [&_.button-outline]:[background:#fff] max-[520px]:[margin-top:17px]"}>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Batal
          </Button>

          <Button type="submit" className="employee-add-button">
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}

