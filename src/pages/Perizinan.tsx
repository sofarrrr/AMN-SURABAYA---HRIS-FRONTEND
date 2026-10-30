import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router';

import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Badge, Button, DataKaryawanBreadcrumb, DataKaryawanSearchBar, PageTitle, Pagination, Table } from '../components/UI';
import { AttendanceDatePicker } from '../components/AttendanceComponents';

const toInputDate = (value) => {
  if (!value) return '';

  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
};

const currentDate = new Date();
const currentCalendarYear = String(currentDate.getFullYear());
const fallbackCalendarDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
const calendarMonthOptions = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const getPermitPrintDate = () => new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

const getPermitPeriods = (from, to) => {
  const startMatch = toInputDate(from).match(/^(\d{4})-(\d{2})/);
  const endMatch = toInputDate(to || from).match(/^(\d{4})-(\d{2})/);
  if (!startMatch) return [];

  const startIndex = Number(startMatch[1]) * 12 + Number(startMatch[2]) - 1;
  const endIndex = endMatch
    ? Math.max(startIndex, Number(endMatch[1]) * 12 + Number(endMatch[2]) - 1)
    : startIndex;
  return Array.from({ length: endIndex - startIndex + 1 }, (_, offset) => {
    const index = startIndex + offset;
    return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`;
  });
};
const fromInputDate = (value) => {
  if (!value) return '';

  const [year, month, day] = value.split('-');

  return `${day}/${month}/${year}`;
};

const getPermitDayCount = (from, to) => {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  const difference = Math.round((end.getTime() - start.getTime()) / 86400000);
  return Number.isFinite(difference) && difference >= 0 ? difference + 1 : 1;
};

const shiftPermitDate = (value, offset) => {
  const [day, month, year] = String(value || '').split('/').map(Number);
  if (!day || !month || !year) return value || '—';

  const date = new Date(year, month - 1, day + offset);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export default function Perizinan({ backgroundView = false }: { backgroundView?: boolean }) {
  const { role, permitId } = useParams();
  const { user } = useAuth();

  const {
    employees,
    permits,
    addPermit,
    removePermit,
    updatePermit,
  } = useData();

  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('all');
  const [pickerYear, setPickerYear] = useState('');
  const [draftYear, setDraftYear] = useState(currentCalendarYear);
  const [draftMonth, setDraftMonth] = useState('all');
  const [openPicker, setOpenPicker] = useState<'month' | 'year' | null>(null);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; employee: string } | null>(null);
  const [deleteSucceeded, setDeleteSucceeded] = useState(false);
  const [addSucceeded, setAddSucceeded] = useState(false);
  const [editSucceeded, setEditSucceeded] = useState(false);
  const [approvalPhase, setApprovalPhase] = useState<'closing' | 'success' | null>(null);
  const [approvalSuccessMessage, setApprovalSuccessMessage] = useState('');
  const [attachmentNotice, setAttachmentNotice] = useState(false);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState(user?.role === 'Direktur' ? '' : user?.name || '');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedPermitType, setSelectedPermitType] = useState('');
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [approvalFileName, setApprovalFileName] = useState('');
  const [dateError, setDateError] = useState('');

  const self = user?.role === 'Karyawan';
  const manager = user?.role === 'Manajer';
  const approval = !backgroundView && location.pathname.endsWith('/approval');
  const edit = location.pathname.endsWith('/edit');
  const form = !backgroundView && (location.pathname.endsWith('/new') || edit);

  useEffect(() => {
    if (!form) return;

    const closeDatepickersOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('.permit-date-menu')) return;

      document.querySelectorAll('.permit-edit-form .permit-date-menu[open]').forEach((menu) => {
        menu.removeAttribute('open');
      });
    };

    document.addEventListener('pointerdown', closeDatepickersOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeDatepickersOnOutsideClick);
  }, [form]);

  useEffect(() => {
    if (!approval) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [approval]);

  useEffect(() => {
    if (!approvalPhase) return;
    const timeoutId = window.setTimeout(() => {
      navigate(`/${role}/permits/${permitId}`);
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [approvalPhase, navigate, permitId, role]);

  useEffect(() => {
    if (!deleteSucceeded) return;
    const timeoutId = window.setTimeout(() => setDeleteSucceeded(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [deleteSucceeded]);

  useEffect(() => {
    if (!addSucceeded) return;
    const timeoutId = window.setTimeout(() => setAddSucceeded(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [addSucceeded]);

  useEffect(() => {
    if (!editSucceeded) return;
    const timeoutId = window.setTimeout(() => setEditSucceeded(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [editSucceeded]);

  const allRows = useMemo(
          () => permits.map((permit) => ({
      ...permit,
      division: permit.division || 'Administrasi',
      position: permit.position || 'Karyawan',
      type: permit.type || 'Izin',
    })),
    [permits]
  );

  const dataYears = allRows.flatMap((permit) => getPermitPeriods(permit.from, permit.to).map((period) => Number(period.slice(0, 4))));
  const earliestYear = Math.min(Number(currentCalendarYear), ...dataYears);
  const latestYear = Math.max(Number(currentCalendarYear), ...dataYears);
  const firstPickerYear = Math.max(1900, earliestYear - 25);
  const lastPickerYear = Math.min(2100, latestYear + 25);
  const yearOptions = Array.from(
    { length: lastPickerYear - firstPickerYear + 1 },
    (_, index) => String(lastPickerYear - index),
  );
  const record = allRows.find((permit) => permit.id === permitId);
  const selectedEmployee = employees.find((employee) => employee.name === selectedEmployeeName);

  if (permitId && !record) {
    return <Navigate to={`/${role}/permits`} replace />;
  }

  if (manager && edit && permitId) {
    return <Navigate to={`/${role}/permits/${permitId}`} replace />;
  }

  const visibleRows = allRows.filter(
    (permit) =>
      (!self || permit.employee === user.name) &&
      (month === 'all' || getPermitPeriods(permit.from, permit.to).includes(month)) &&
      `${permit.employee} ${permit.division} ${permit.type}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );
  const rowsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / rowsPerPage));
  const activePage = Math.min(page, totalPages);
        const pagedRows = visibleRows.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
  );

  const handleExportExcel = async () => {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Perizinan');
    worksheet.columns = [
      { header: 'No', key: 'number', width: 9 },
      { header: 'Nama Karyawan', key: 'employee', width: 28 },
      { header: 'Divisi', key: 'division', width: 22 },
      { header: 'Jenis Perizinan', key: 'type', width: 22 },
      { header: 'Tanggal Awal', key: 'from', width: 16 },
      { header: 'Tanggal Akhir', key: 'to', width: 16 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Keterangan', key: 'reason', width: 40 },
    ];
    visibleRows.forEach((permit, index) => worksheet.addRow({
      number: String(index + 1).padStart(2, '0'),
      employee: permit.employee, division: permit.division, type: permit.type,
      from: permit.from, to: permit.to, status: permit.status, reason: permit.reason,
    }));
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:H1';
    worksheet.getRow(1).height = 28;
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB91C1C' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle' };
    });
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.height = row.number === 1 ? 28 : 24;
      row.eachCell((cell) => { cell.alignment = { ...cell.alignment, vertical: 'middle' }; });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'perizinan.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleExportPdf = () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const printedAt = getPermitPrintDate();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageMargin = 12;
    const metaX = pageWidth - pageMargin - 76;
    const metaWidth = pageWidth - pageMargin - metaX;
    const logo = document.querySelector<HTMLImageElement>('img[alt="Logo AMN"]');

    const drawLetterhead = () => {
      if (logo?.complete && logo.naturalWidth > 0) {
        pdf.addImage(logo, 'PNG', pageMargin, 9, 17, 17);
      }

      pdf.setTextColor(25, 25, 25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('ASRAMA MAHASISWA NUSANTARA', 32, 15);
      pdf.setTextColor(193, 0, 0);
      pdf.setFontSize(17);
      pdf.text('SURABAYA', 32, 22);

      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(8);
      pdf.text('HRIS AMN SURABAYA', metaX, 10);
      pdf.setFont('helvetica', 'normal');
      const address = pdf.splitTextToSize(
        'Alamat: MP7P+WPM, Siwalankerto, Kec. Wonocolo, Surabaya, Jawa Timur 60236',
        metaWidth,
      );
      pdf.text(address, metaX, 14);
      const contactY = 14 + address.length * 3.4 + 1;
      pdf.text('Telepon: 0813-4335-8318', metaX, contactY);
      pdf.text(`Tanggal cetak: ${printedAt}`, metaX, contactY + 4);

      pdf.setDrawColor(110, 110, 110);
      pdf.setLineWidth(0.25);
      pdf.line(pageMargin, 34, pageWidth - pageMargin, 34);
      pdf.setTextColor(25, 25, 25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('DAFTAR PERIZINAN KARYAWAN', pageWidth / 2, 42, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(85, 85, 85);
      const selectedPeriod = month === 'all'
        ? 'Semua Periode'
        : new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T00:00:00`));
      pdf.text(`Periode: ${selectedPeriod}`, pageWidth / 2, 47, { align: 'center' });
    };

    autoTable(pdf, {
      head: [['No', 'Nama Karyawan', 'Divisi', 'Jenis Perizinan', 'Tanggal Awal', 'Tanggal Akhir', 'Status', 'Keterangan']],
      body: visibleRows.map((permit, index) => [
        String(index + 1).padStart(2, '0'),
        permit.employee,
        permit.division,
        permit.type,
        permit.from,
        permit.to,
        permit.status,
        permit.reason,
      ]),
      startY: 53,
      margin: { top: 53, right: pageMargin, bottom: 12, left: pageMargin },
      showHead: 'everyPage',
      rowPageBreak: 'avoid',
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 7,
        cellPadding: 1.5,
        lineColor: [34, 34, 34],
        lineWidth: 0.2,
        textColor: [25, 25, 25],
        overflow: 'linebreak',
        valign: 'middle',
      },
      headStyles: { fillColor: [193, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 9, halign: 'center' },
        1: { cellWidth: 33 },
        2: { cellWidth: 23 },
        3: { cellWidth: 25 },
        4: { cellWidth: 21 },
        5: { cellWidth: 21 },
        6: { cellWidth: 18 },
        7: { cellWidth: 'auto' },
      },
      didDrawPage: drawLetterhead,
    });

    if (visibleRows.length === 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(85, 85, 85);
      pdf.text('Tidak ada data perizinan untuk diekspor.', pageWidth / 2, 61, { align: 'center' });
    }

    pdf.save('perizinan.pdf');
  };
  const close = () => {
    setSelectedEmployeeName(user?.role === 'Direktur' ? '' : user?.name || '');
    setSelectedDivision('');
    setSelectedPermitType('');
    setSelectedFromDate('');
    setSelectedToDate('');
    setDateError('');
    navigate(edit ? `/${role}/permits/${permitId}` : `/${role}/permits`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    removePermit(deleteTarget.id);
    setDeleteTarget(null);
    setDeleteSucceeded(true);
  };

  if (form) {
    const initial = edit ? record : null;
    const divisionValue = selectedDivision || initial?.division || user.division || '';
    const permitTypeValue = selectedPermitType || initial?.type || 'Izin';
    const fromValue = selectedFromDate || (edit ? toInputDate(initial?.from) : '');
    const toValue = selectedToDate || (edit ? toInputDate(initial?.to) : '');
    const divisionOptions: string[] = [...new Set<string>(employees.map((employee) => employee.division).filter((division): division is string => Boolean(division)))];
    const permitTypeOptions = ['Izin', 'Cuti Tahunan', 'Izin Sakit', 'Izin Pribadi'];

    return (
      <>
        <div className="permit-background-content" aria-hidden="true" inert>
          <Perizinan backgroundView />
        </div>
        <div className="permit-modal-backdrop">
        <form
          className={`permit-edit-form${approvalPhase ? ' permit-approval-form-hidden' : ''}`}
          onSubmit={(e) => {
            e.preventDefault();

            if (!fromValue || !toValue) {
              setDateError('Tanggal awal dan akhir wajib diisi.');
              return;
            }
            if (toValue < fromValue) {
              setDateError('Tanggal akhir harus sama dengan atau setelah tanggal awal.');
              return;
            }
            setDateError('');
            if (!e.currentTarget.reportValidity()) return;

            const formData = new FormData(e.currentTarget);
            if (!edit && user?.role === 'Direktur' && (!selectedEmployee || selectedEmployee.name === user.name)) {
              return;
            }

            const data = {
              employee: initial?.employee || (user?.role === 'Direktur' ? selectedEmployeeName : user.name),
              division: user?.role === 'Direktur' && !edit ? selectedEmployee?.division : formData.get('division'),
              position: user?.role === 'Direktur' && !edit ? selectedEmployee?.position : formData.get('position'),
              type: formData.get('type'),
              from: fromInputDate(formData.get('from')),
              to: fromInputDate(formData.get('to')),
              reason: formData.get('reason'),
              days: getPermitDayCount(formData.get('from'), formData.get('to')),
            };

            if (edit) {
              updatePermit(record.id, data);
              setEditSucceeded(true);
            } else {
              addPermit(data);
              setAddSucceeded(true);
            }

            setPage(1);
            close();
          }}
        >
          <h2 className="permit-form-title">{edit ? 'Edit Perizinan' : 'Tambah Perizinan'}</h2>

          <label className="permit-form-field">
            <span>Nama</span>
            {user?.role === 'Direktur' && !edit ? (
              <>
                <input type="hidden" name="employee" value={selectedEmployeeName} />
                <details className="attendance-form-select-menu" name="permit-form-select">
                  <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!selectedEmployeeName}>
                    <span>{selectedEmployeeName || 'Pilih karyawan'}</span>
                    <img src="/assets/figma-chevron-down.svg" alt="" />
                  </summary>
                  <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label="Pilih karyawan">
                    {employees.filter((employee) => employee.name !== user.name).map((employee) => (
                      <button key={employee.id} type="button" role="option" aria-selected={selectedEmployeeName === employee.name} onClick={(event) => {
                        setSelectedEmployeeName(employee.name);
                        setSelectedDivision(employee.division || '');
                        event.currentTarget.closest('details')?.removeAttribute('open');
                      }}>{employee.name}</button>
                    ))}
                  </div>
                </details>
              </>
            ) : (
              <input value={initial?.employee || user.name} readOnly />
            )}
          </label>

          <label className="permit-form-field">
            <span>Divisi</span>
            {edit ? (
              <input name="division" value={initial?.division || ''} readOnly />
            ) : user?.role === 'Direktur' ? (
              <input value={selectedEmployee?.division || ''} placeholder="Pilih karyawan terlebih dahulu" readOnly required />
            ) : (
              <>
                <input type="hidden" name="division" value={divisionValue} />
                <details className="attendance-form-select-menu" name="permit-form-select">
                  <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!divisionValue}>
                    <span>{divisionValue || 'Pilih divisi'}</span>
                    <img src="/assets/figma-chevron-down.svg" alt="" />
                  </summary>
                  <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label="Pilih divisi">
                    {divisionOptions.map((division) => (
                      <button key={division} type="button" role="option" aria-selected={divisionValue === division} onClick={(event) => {
                        setSelectedDivision(division);
                        event.currentTarget.closest('details')?.removeAttribute('open');
                      }}>{division}</button>
                    ))}
                  </div>
                </details>
              </>
            )}
          </label>

          <label className="permit-form-field">
            <span>Posisi</span>
            {user?.role === 'Direktur' && !edit ? (
              <input value={selectedEmployee?.position || ''} placeholder="Pilih karyawan terlebih dahulu" readOnly required />
            ) : (
              <input name="position" value={edit ? initial?.position || '' : undefined} defaultValue={edit ? undefined : user.position} readOnly={edit} required />
            )}
          </label>

          <label className="permit-form-field">
            <span>Jenis Perizinan</span>
            <input type="hidden" name="type" value={permitTypeValue} />
            <details className="attendance-form-select-menu" name="permit-form-select">
              <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!permitTypeValue}>
                <span>{permitTypeValue || 'Pilih jenis perizinan'}</span>
                <img src="/assets/figma-chevron-down.svg" alt="" />
              </summary>
              <div className="employee-export-options attendance-form-select-options" role="listbox" aria-label="Pilih jenis perizinan">
                {permitTypeOptions.map((type) => (
                  <button key={type} type="button" role="option" aria-selected={permitTypeValue === type} onClick={(event) => {
                    setSelectedPermitType(type);
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}>{type}</button>
                ))}
              </div>
            </details>
          </label>

          <label className="permit-form-field">
            <span>Tanggal Awal Perizinan</span>
            <input type="hidden" name="from" value={fromValue} />
            <details className="attendance-date-menu permit-date-menu" name="permit-form-select">
              <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!fromValue}>
                <img src="/assets/figma-calendar.svg" alt="" />
                <span>{fromValue ? fromInputDate(fromValue) : 'dd/mm/yyyy'}</span>
                <img src="/assets/figma-chevron-down.svg" alt="" />
              </summary>
              <AttendanceDatePicker key={`from-${fromValue}`} value={fromValue || fallbackCalendarDate} onChange={(value) => { setSelectedFromDate(value); setDateError(''); }} />
            </details>
          </label>

          <label className="permit-form-field">
            <span>Tanggal Akhir Perizinan</span>
            <input type="hidden" name="to" value={toValue} />
            <details className="attendance-date-menu permit-date-menu" name="permit-form-select">
              <summary className="attendance-filter-trigger attendance-form-select-trigger" data-empty={!toValue}>
                <img src="/assets/figma-calendar.svg" alt="" />
                <span>{toValue ? fromInputDate(toValue) : 'dd/mm/yyyy'}</span>
                <img src="/assets/figma-chevron-down.svg" alt="" />
              </summary>
              <AttendanceDatePicker key={`to-${toValue}`} value={toValue || fallbackCalendarDate} onChange={(value) => { setSelectedToDate(value); setDateError(''); }} />
            </details>
          </label>

          {dateError && <p className="permit-date-error" role="alert">{dateError}</p>}

          <label className="permit-form-field">
            <span>Keterangan</span>
            <textarea
              name="reason"
              defaultValue={initial?.reason}
              placeholder="Tulis keterangan"
              rows={3}
              required
            />
          </label>

          <label className="permit-form-field">
            <span>Berkas Pendukung</span>
            <input
              className={"permit-file"}
              type="file"
              accept=".pdf,.jpg,.png"
            />
          </label>

          <div className="permit-edit-actions [display:flex] [justify-content:flex-end] [gap:7px] [margin-top:34px] [&_.button]:[width:69px] [&_.button]:[min-width:69px] [&_.button]:[min-height:34px] [&_.button]:[padding:0_10px] [&_.button-outline]:[border-color:#b91c1c] [&_.button-outline]:[color:#b91c1c] [&_.button-outline]:[background:#fff] max-[520px]:[margin-top:17px]">
            <Button className="permit-cancel-button" variant="outline" type="button" onClick={close}>
              Batal
            </Button>

            <button type="submit" className="permit-submit-button [min-height:39px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border:1px_solid_transparent] [border-radius:8px] [background:#b91c1c] [color:#fff] [padding:0_17px] [font-size:var(--type-button)]! [font-weight:600] [white-space:nowrap] [transition:.15s] [&:hover]:[background:#cc0000] [font:500_14px/24px_Inter,Arial,sans-serif] [box-shadow:none] max-[520px]:[min-height:40px] [line-height:var(--line-button)]! max-[520px]:[padding:0_12px]">
              {edit ? 'Simpan' : 'Kirim'}
            </button>
          </div>
        </form>
        </div>
      </>
    );
  }

  if (permitId && !approval) {
    return (
      <>
        {editSucceeded && (
          <div
            className="employee-delete-dialog-backdrop success-auto-dismiss"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setEditSucceeded(false);
            }}
          >
            <section
              className="employee-delete-dialog employee-delete-success"
              role="dialog"
              aria-modal="true"
              aria-labelledby="permit-edit-success-title"
              aria-describedby="permit-edit-success-description"
            >
              <h2 id="permit-edit-success-title">Berhasil</h2>
              <p id="permit-edit-success-description">Perubahan perizinan berhasil disimpan</p>
            </section>
          </div>
        )}
        <PageTitle title="Approval" className="employee-list-title permit-detail-page-title" />
        <DataKaryawanBreadcrumb href={`/${role}/permits`} current="Approval" parentLabel="Perizinan" />

        <section className="employee-detail-card permit-detail-card permit-detail-page">
          <div className="permit-detail-heading">
            <h2>Detail Perizinan</h2>

            {!manager && (
              <Button
                className="employee-add-button employee-detail-button"
                onClick={() => navigate(`/${role}/permits/${record.id}/edit`, { state: { permitEditOrigin: 'detail' } })}
              >
                Edit
                <img src="/assets/figma-edit.svg" alt="" />
              </Button>
            )}
          </div>

          <div className="permit-detail-fields">
            {[
              ['Nama', record.employee],
              ['Tanggal Awal Perizinan', record.from],
              ['Divisi', record.division],
              ['Tanggal Akhir Perizinan', record.to],
              ['Posisi', record.position],
              ['Keterangan', record.reason],
              ['Jenis Perizinan', record.type],
              [
                'Berkas Pendukung',
                'Surat Keterangan Sakit.Pdf',
              ],
            ].map(([key, value]) => (
              <div
                className="permit-detail-field"
                key={key}
              >
                <small>{key}</small>
                {key === 'Berkas Pendukung' ? (
                  <button
                    className="permit-attachment-link"
                    type="button"
                    aria-label="Buka berkas pendukung"
                    onClick={() => setAttachmentNotice(true)}
                  >
                    {value}
                  </button>
                ) : <b>{value}</b>}
                {key === 'Berkas Pendukung' && attachmentNotice && (
                  <small className="permit-attachment-notice" role="status">Berkas pendukung belum tersedia pada data dummy.</small>
                )}
              </div>
            ))}
          </div>

          <div className="permit-log-heading">
            <h2>Log Perizinan</h2>

            {!self && (
              <Button
                className="permit-action-approval"
                to={`/${role}/permits/${record.id}/approval`}
              >
                Approval
              </Button>
            )}
          </div>

          <div className="permit-log-table-wrap">
            <table className="permit-log-table">
              <thead>
                <tr>
                  {[
                    'No',
                    'Aktivitas',
                    'Tanggal',
                    'Status',
                    'Catatan Approval',
                  ].map((item) => (
                    <th key={item}>{item}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {[
                  [
                    '01',
                    'Pengajuan Perizinan',
                    shiftPermitDate(record.from, 0),
                    'Diajukan',
                    '-',
                  ],
                  [
                    '02',
                    'Approval Manajer',
                    shiftPermitDate(record.from, 1),
                    record.status === 'Menunggu'
                      ? 'Menunggu'
                      : record.status === 'Ditolak'
                        ? 'Ditolak'
                        : 'Disetujui',
                    record.status === 'Ditolak'
                      ? record.approvalNote || 'Pengajuan ditolak'
                      : record.status === 'Menunggu'
                        ? '-'
                        : 'Pengajuan telah disetujui oleh Manajer',
                  ],
                  [
                    '03',
                    'Approval Direktur',
                    shiftPermitDate(record.from, 2),
                    record.status === 'Ditolak'
                      ? 'Tidak diproses'
                      : record.status === 'Menunggu'
                        ? 'Menunggu'
                        : 'Disetujui',
                    record.status === 'Ditolak'
                      ? '-'
                      : record.status === 'Menunggu'
                        ? '-'
                        : 'Pengajuan telah disetujui oleh Direktur',
                  ],
                  [
                    '04',
                    'Perizinan Selesai',
                    shiftPermitDate(record.from, 2),
                    record.status === 'Menunggu'
                      ? 'Menunggu'
                      : record.status === 'Ditolak'
                        ? 'Ditolak'
                        : 'Selesai',
                    '-',
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={index}>
                        {index === 3 ? (
                          <span className={`permit-log-status ${cell === 'Ditolak' ? 'is-rejected' : cell === 'Menunggu' ? 'is-pending' : ''}`}>
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  if (approval) {
    return (
      <>
      <div className="permit-background-content" aria-hidden="true" inert>
        <Perizinan backgroundView />
      </div>
      {approvalPhase ? (
      <div className="permit-modal-backdrop permit-approval-backdrop permit-approval-success-backdrop">
        <section
          className="employee-delete-dialog employee-delete-success"
          role="dialog"
          aria-modal="true"
          aria-labelledby="permit-approval-success-title"
          aria-describedby="permit-approval-success-description"
        >
          <h2 id="permit-approval-success-title">Berhasil</h2>
          <p id="permit-approval-success-description">{approvalSuccessMessage}</p>
        </section>
      </div>
      ) : (
      <div className="permit-modal-backdrop permit-approval-backdrop">
        <form
          className="permit-edit-form"
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const submitter = (e.nativeEvent as SubmitEvent).submitter;
            const decision = submitter instanceof HTMLButtonElement ? submitter.value : '';
            updatePermit(record.id, {
              status: decision,
              approvalNote: String(formData.get('note') || '').trim(),
              ...(approvalFileName ? { attachmentName: approvalFileName } : {}),
            });
            setApprovalSuccessMessage(decision === 'Ditolak' ? 'Pengajuan perizinan ditolak' : 'Pengajuan perizinan berhasil disetujui');
            setApprovalPhase('success');
          }}
        >
          <h2 className="permit-form-title">Approval Perizinan</h2>
          <label className="permit-form-field">
            <span>Nama</span>
            <input value={record.employee} readOnly />
          </label>
          <label className="permit-form-field">
            <span>Catatan Approval</span>
            <textarea
              name="note"
              defaultValue={record.approvalNote || 'Pengajuan telah disetujui oleh Direktur'}
              placeholder="Catatan persetujuan"
              rows={3}
            />
          </label>

          <label className="permit-form-field">
            <span>Surat Keputusan Perizinan</span>
            <div className="permit-approval-file-field">
              <label className="permit-approval-file-button">
                File
                <input
                  className="sr-only"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  aria-label="Pilih surat keputusan perizinan"
                  onChange={(event) => setApprovalFileName(event.target.files?.[0]?.name || '')}
                />
              </label>
              <span>{approvalFileName || record.attachmentName || 'SK Perizinan.pdf'}</span>
            </div>
          </label>

          <div className="permit-edit-actions permit-approval-actions">
            <Button className="permit-cancel-button" variant="outline" type="submit" name="decision" value="Ditolak">Ditolak</Button>
            <Button className="permit-submit-button" type="submit" name="decision" value="Disetujui">Diterima</Button>
          </div>
        </form>
      </div>
      )}
      </>
    );
  }

  return (
    <section className={`[min-width:0]${user?.role === 'Sekretaris' ? ' permit-page-secretary' : ''}`}>
      {deleteTarget && (
        <div
          className="employee-delete-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleteTarget(null);
          }}
        >
          <section
            className="employee-delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="permit-delete-title"
            aria-describedby="permit-delete-description"
          >
            <span className="employee-delete-warning-icon" aria-hidden="true">!</span>
            <h2 id="permit-delete-title">Hapus Perizinan</h2>
            <p id="permit-delete-description">
              Apakah Anda yakin untuk menghapus pengajuan perizinan atas nama {deleteTarget.employee}?
            </p>
            <div className="employee-delete-dialog-actions">
              <Button className="button button-outline" variant="outline" type="button" onClick={() => setDeleteTarget(null)}>
                Batal
              </Button>
              <Button className="button" type="button" onClick={confirmDelete}>Hapus</Button>
            </div>
          </section>
        </div>
      )}
      {deleteSucceeded && (
        <div
          className="employee-delete-dialog-backdrop success-auto-dismiss"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleteSucceeded(false);
          }}
        >
          <section
            className="employee-delete-dialog employee-delete-success"
            role="dialog"
            aria-modal="true"
            aria-labelledby="permit-delete-success-title"
            aria-describedby="permit-delete-success-description"
          >
            <h2 id="permit-delete-success-title">Berhasil</h2>
            <p id="permit-delete-success-description">Data perizinan telah berhasil dihapus</p>
          </section>
        </div>
      )}
      {addSucceeded && (
        <div
          className="employee-delete-dialog-backdrop success-auto-dismiss"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAddSucceeded(false);
          }}
        >
          <section
            className="employee-delete-dialog employee-delete-success"
            role="dialog"
            aria-modal="true"
            aria-labelledby="permit-add-success-title"
            aria-describedby="permit-add-success-description"
          >
            <h2 id="permit-add-success-title">Berhasil</h2>
            <p id="permit-add-success-description">Pengajuan perizinan berhasil dikirim</p>
          </section>
        </div>
      )}
      <PageTitle title="Perizinan" className="employee-list-title" />

      <div className="attendance-toolbar permit-toolbar">
        <DataKaryawanSearchBar
          query={query}
          ariaLabel="Cari data perizinan"
          onQueryChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />

        <div className="permit-toolbar-actions">
          <details className="attendance-filter-menu attendance-filter-menu--period permit-period-menu" name="permit-filters">
            <summary
              className="attendance-filter-trigger"
              onClick={() => {
                setDraftYear(month !== 'all' ? month.slice(0, 4) : pickerYear || currentCalendarYear);
                setDraftMonth(month !== 'all' ? month.slice(5, 7) : 'all');
                setOpenPicker(null);
              }}
            >
              <span className="attendance-filter-label">
                <img src="/assets/figma-calendar-red.svg" alt="" />
                <span>{month === 'all' ? 'Semua Periode' : new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${month}-01T00:00:00`))}</span>
              </span>
              <img className="attendance-filter-chevron" src="/assets/figma-chevron-down-red.svg" alt="" />
            </summary>
            <div className="permit-period-picker-panel" aria-label="Pilih bulan dan tahun">
              <div className="permit-period-picker-controls">
                <div className="permit-period-picker-field">
                  <span>Bulan</span>
                  <div className="permit-period-custom-select">
                    <button
                      className="permit-period-select-trigger"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={openPicker === 'month'}
                      aria-controls="permit-month-options"
                      onClick={() => setOpenPicker(openPicker === 'month' ? null : 'month')}
                    >
                      {draftMonth === 'all' ? 'Semua Periode' : calendarMonthOptions[Number(draftMonth) - 1]}
                      <img className={openPicker === 'month' ? 'is-open' : ''} src="/assets/figma-chevron-down-red.svg" alt="" />
                    </button>
                    {openPicker === 'month' && (
                      <div className="permit-period-select-options" id="permit-month-options" role="listbox" aria-label="Bulan">
                        <button type="button" role="option" aria-selected={draftMonth === 'all'} onClick={() => { setDraftMonth('all'); setOpenPicker(null); }}>Semua Periode</button>
                        {calendarMonthOptions.map((label, index) => {
                          const value = String(index + 1).padStart(2, '0');
                          return <button key={value} type="button" role="option" aria-selected={draftMonth === value} onClick={() => { setDraftMonth(value); setOpenPicker(null); }}>{label}</button>;
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="permit-period-picker-field">
                  <span>Tahun</span>
                  <div className="permit-period-custom-select">
                    <button
                      className="permit-period-select-trigger"
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={openPicker === 'year'}
                      aria-controls="permit-year-options"
                      onClick={() => setOpenPicker(openPicker === 'year' ? null : 'year')}
                    >
                      {draftYear}
                      <img className={openPicker === 'year' ? 'is-open' : ''} src="/assets/figma-chevron-down-red.svg" alt="" />
                    </button>
                    {openPicker === 'year' && (
                      <div className="permit-period-select-options permit-period-year-options" id="permit-year-options" role="listbox" aria-label="Tahun">
                        {yearOptions.map((year) => (
                          <button key={year} type="button" role="option" aria-selected={draftYear === year} onClick={() => { setDraftYear(year); setOpenPicker(null); }}>{year}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="permit-period-month-grid" aria-label="Pilih bulan">
                {calendarMonthOptions.map((label, index) => {
                  const value = String(index + 1).padStart(2, '0');
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={draftMonth === value}
                      onClick={() => setDraftMonth(value)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="permit-period-picker-footer">
                <button
                  className="permit-period-cancel"
                  type="button"
                  onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
                >
                  Batal
                </button>
                <button
                  className="permit-period-apply"
                  type="button"
                  onClick={(event) => {
                    setPickerYear(draftYear);
                    setMonth(draftMonth === 'all' ? 'all' : `${draftYear}-${draftMonth}`);
                    setPage(1);
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}
                >
                  Terapkan
                </button>
              </div>
            </div>
          </details>

          <details className="employee-export-menu">
            <summary className="employee-export-button">
              Export <img src="/assets/figma-export.svg" alt="" />
            </summary>
            <div className="employee-export-options" role="group" aria-label="Pilih format export perizinan">
              <button type="button" onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open');
                void handleExportExcel();
              }}>Excel (.xlsx)</button>
              <button type="button" onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open');
                handleExportPdf();
              }}>PDF (.pdf)</button>
            </div>
          </details>

          {!manager && (
            <Button
              to={`/${role}/permits/new`}
              className="employee-add-button permit-add-button"
            >
              Tambah <img className="size-4 shrink-0 object-contain" src="/assets/figma-plus-white.svg" alt="" />
            </Button>
          )}
        </div>
      </div>

      <Table
        className="permit-data-table"
        columns={[
          { label: 'No', key: 'number' },
          { label: 'Nama Karyawan', key: 'employee' },
          { label: 'Divisi', key: 'division' },
          { label: 'Jenis Perizinan', key: 'type' },
          { label: 'Tgl Awal Perizinan', key: 'from' },
          { label: 'Tgl Akhir Perizinan', key: 'to' },
          {
            label: 'Status',
            render: (permit) => <Badge className={`attendance-status-badge ${permit.status === 'Menunggu' ? 'badge-terlambat' : ''} permit-status-badge`}>{permit.status}</Badge>,
          },
          {
            label: 'Action',
            render: (permit) => (
              <div className="permit-row-actions flex items-center gap-2 whitespace-nowrap">
                {self && (
                  <>
                    <Link
                      to={`/${role}/permits/${permit.id}`}
                      aria-label={`Lihat perizinan ${permit.employee}`}
                      className="data-employee-action data-employee-action-view"
                    >
                      <img src="/assets/figma-view.svg" alt="" />
                    </Link>
                    <Link
                      to={`/${role}/permits/${permit.id}/edit`}
                      aria-label={`Edit perizinan ${permit.employee}`}
                      className="data-employee-action data-employee-action-edit"
                    >
                      <img src="/assets/figma-edit.svg" alt="" />
                    </Link>
                  </>
                )}
                {!self && (
                  <Button to={`/${role}/permits/${permit.id}`} className="permit-action-approval">
                    Approval
                  </Button>
                )}
                {!manager && (
                  <button
                    className="data-employee-action data-employee-action-delete"
                    type="button"
                    aria-label={`Hapus perizinan ${permit.employee}`}
                    onClick={() => setDeleteTarget({ id: permit.id, employee: permit.employee })}
                  >
                    <img src="/assets/figma-delete.svg" alt="" />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        rows={pagedRows.map((permit, index) => ({
          ...permit,
          key: permit.id,
          number: String((activePage - 1) * rowsPerPage + index + 1).padStart(2, '0'),
        }))}
        empty="Tidak ada pengajuan perizinan."
      />

      <Pagination size="compact" className="attendance-pagination permit-pagination-sticky" page={activePage} totalPages={totalPages} onPageChange={setPage} label="Navigasi halaman perizinan" />
    </section>
  );
}
