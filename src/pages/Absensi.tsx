import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Navigate, useLocation, useNavigate, useParams } from 'react-router';

import { useAuth } from '../hooks/useAuth';

import { useData } from '../hooks/useData';

import { PageTitle } from '../components/UI';
import {
  AttendanceDateFilter,
  AttendanceDeleteDialog,
  AttendanceDeleteSuccessDialog,
  AttendanceDialog,
  AttendanceForm,
  AttendanceSummaryCards,
  AttendanceTable,
  AttendanceToolbar,
} from '../components/AttendanceComponents';
import { formatAttendanceDate, getAttendancePrintDate, parseAttendanceDate } from '../utils/attendance';

/**
 * Halaman utama Absensi.
 *
 * Halaman ini menyediakan fitur:
 * - Menampilkan ringkasan absensi
 * - Mencari data absensi
 * - Memfilter data berdasarkan divisi
 * - Memilih periode absensi
 * - Menampilkan data dalam tabel
 * - Melihat detail absensi
 * - Menambahkan data absensi
 * - Mengedit data absensi
 */
export default function Absensi() {
  // Mengambil parameter role dan ID absensi dari URL.
  const { role, attendanceId } = useParams();

  // Mengambil informasi pengguna yang sedang login.
  const { user } = useAuth();

  // Mengambil data dan fungsi pengelolaan absensi.
  const {
    attendance,
    employees,
    addAttendance,
    updateAttendance,
  } = useData();

  // Digunakan untuk membaca URL dan melakukan navigasi.
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk pencarian, filter divisi, dan periode.
  const [query, setQuery] = useState('');
  const [division, setDivision] = useState('Semua Divisi');
  const [period, setPeriod] = useState('Harian');
  const [selectedDate, setSelectedDate] = useState('2025-06-15');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; employee: string } | null>(null);
  const [deleteSucceeded, setDeleteSucceeded] = useState(false);

  useEffect(() => {
    if (!deleteSucceeded) return;
    const timeoutId = window.setTimeout(() => setDeleteSucceeded(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [deleteSucceeded]);
  const rowsPerPage = 7;
  const divisionOptions = [...new Set<string>(employees.map((item) => item.division).filter(Boolean))].sort();

  /**
   * Mengambil data absensi berdasarkan ID dari URL.
   *
   * Jika ID tidak ditemukan, data pertama digunakan sebagai fallback.
   */
  const record = attendance.find((item) => item.id === attendanceId);

  // Menentukan mode halaman berdasarkan URL.
  const isNew = location.pathname.endsWith('/new');
  const isEdit = location.pathname.endsWith('/edit');

  if (user.role === 'Manajer' && (isNew || isEdit)) {
    return <Navigate to={`/${role}/attendance`} replace />;
  }

  if (attendanceId && !record) {
    return <Navigate to={`/${role}/attendance`} replace />;
  }

  /**
   * Memfilter data absensi berdasarkan:
   * - Hak akses pengguna
   * - Divisi yang dipilih
   * - Kata pencarian
   *
   * Pengguna dengan role Karyawan hanya dapat melihat data
   * absensinya sendiri.
   */
  const selectedDateValue = new Date(`${selectedDate}T00:00:00`);
  const weekStart = new Date(selectedDateValue);
  weekStart.setDate(selectedDateValue.getDate() - ((selectedDateValue.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const rosterNames = new Set(employees.map((employee) => employee.name));
  const attendanceInPeriod = attendance.filter((item) => {
    const matchesEmployee =
      user.role !== 'Karyawan' ||
      item.employee === user.name;
    const itemDate = parseAttendanceDate(item.date);
    const matchesPeriod = Boolean(itemDate) && (
      period === 'Harian'
        ? itemDate.getTime() === selectedDateValue.getTime()
        : period === 'Mingguan'
          ? itemDate >= weekStart && itemDate <= weekEnd
          : itemDate.getMonth() === selectedDateValue.getMonth() &&
            itemDate.getFullYear() === selectedDateValue.getFullYear()
    );

    return matchesEmployee && matchesPeriod && rosterNames.has(item.employee);
  });
  // Tampilkan seluruh roster karyawan dengan catatan absensi mock yang tersedia.
  const attendanceByEmployee = new Map<string, (typeof attendance)[number]>();
  attendanceInPeriod.forEach((item) => {
    const current = attendanceByEmployee.get(item.employee);
    const currentDate = current ? parseAttendanceDate(current.date) : null;
    const itemDate = parseAttendanceDate(item.date);
    if (!current || (itemDate && (!currentDate || itemDate > currentDate))) {
      attendanceByEmployee.set(item.employee, item);
    }
  });

  const employeeRows = employees
    .filter((employee) => user.role !== 'Karyawan' || employee.name === user.name)
    .map((employee) => {
      const attendanceRecord = attendanceByEmployee.get(employee.name);
      return {
        id: attendanceRecord?.id ?? `missing-${employee.id}`,
        sourceAttendanceId: attendanceRecord?.id,
        employee: employee.name,
        division: attendanceRecord?.division || employee.division,
        position: attendanceRecord?.position || employee.position,
        checkIn: attendanceRecord?.checkIn || '—',
        checkOut: attendanceRecord?.checkOut || '—',
        totalHours: attendanceRecord?.totalHours || '—',
        status: attendanceRecord?.status || 'Belum Absen',
      };
    });
  const rows = employeeRows
    .filter((item) => {
      const matchesDivision = division === 'Semua Divisi' || item.division === division;
      const searchText = `${item.employee} ${item.division} ${item.position} ${item.status}`.toLowerCase();
      return matchesDivision && searchText.includes(query.trim().toLowerCase());
    });

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const activePage = Math.min(page, totalPages);
  const pagedRows = rows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);

  // Data yang digunakan oleh form ketika berada dalam mode edit.
  const formRecord = isEdit ? record : null;

  /**
   * Data statistik ringkasan absensi yang ditampilkan
   * pada bagian atas halaman.
   */
  const overviewStats = [
    {
      label: 'Semua Divisi',
      value: String(employees.length),
      detail: 'Total Karyawan',
      icon: 'all-employee.svg',
      tone: 'all',
    },
    {
      label: 'Hadir',
      value: String(attendanceInPeriod.filter((item) => String(item.status || '').toLowerCase() === 'hadir').length),
      detail: 'Total Karyawan',
      icon: 'dashboard-chair.svg',
      tone: 'success',
    },
    {
      label: 'Tanpa Keterangan',
      value: String(attendanceInPeriod.filter((item) => String(item.status || '').toLowerCase() === 'tanpa keterangan').length),
      detail: 'Total Karyawan',
      icon: 'figma-alert.svg',
      tone: 'danger',
    },
    {
      label: 'Terlambat',
      value: String(attendanceInPeriod.filter((item) => String(item.status || '').toLowerCase() === 'terlambat').length),
      detail: 'Total Karyawan',
      icon: 'dashboard-clock.svg',
      tone: 'warning',
    },
    {
      label: 'Cuti',
      value: String(attendanceInPeriod.filter((item) => String(item.status || '').toLowerCase() === 'cuti').length),
      detail: 'Total Karyawan',
      icon: 'dashboard-leave.svg',
      tone: 'warning',
    },
  ];

  const handleExport = async () => {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Absensi');

    worksheet.columns = [
      { header: 'No', key: 'number', width: 9 },
      { header: 'Nama Karyawan', key: 'employee', width: 28 },
      { header: 'Divisi', key: 'division', width: 22 },
      { header: 'Posisi', key: 'position', width: 38 },
      { header: 'Masuk', key: 'checkIn', width: 13 },
      { header: 'Pulang', key: 'checkOut', width: 13 },
      { header: 'Total Jam', key: 'totalHours', width: 13 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    rows.forEach((item, index) => {
      worksheet.addRow({
        number: String(index + 1).padStart(2, '0'),
        employee: item.employee,
        division: item.division,
        position: item.position,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        totalHours: item.totalHours,
        status: item.status,
      });
    });

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:H1';
    worksheet.getRow(1).height = 28;
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC10000' },
      };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle' };
    });
    worksheet.getColumn(1).alignment = { horizontal: 'center' };
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.height = row.number === 1 ? 28 : 24;
      row.eachCell((cell, columnNumber) => {
        const lineColor = { argb: 'FFB8B8B8' };
        const outerLine = { style: 'medium' as const, color: lineColor };
        const innerLine = { style: 'thin' as const, color: lineColor };

        cell.border = {
          top: row.number === 1 ? outerLine : innerLine,
          right: columnNumber === worksheet.columnCount ? outerLine : innerLine,
          bottom: row.number === worksheet.rowCount ? outerLine : innerLine,
          left: columnNumber === 1 ? outerLine : innerLine,
        };
        cell.alignment = { ...cell.alignment, vertical: 'middle' };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'absensi.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleExportPdf = () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const printedAt = getAttendancePrintDate();
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
      pdf.text('DAFTAR ABSENSI KARYAWAN', pageWidth / 2, 42, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(85, 85, 85);
      pdf.text(
        `Tanggal: ${formatAttendanceDate(selectedDate)} | Periode: ${period}`,
        pageWidth / 2,
        47,
        { align: 'center' },
      );
    };

    autoTable(pdf, {
      head: [['No', 'Nama Karyawan', 'Divisi', 'Posisi', 'Masuk', 'Pulang', 'Total Jam', 'Status']],
      body: rows.map((item, index) => [
        String(index + 1).padStart(2, '0'),
        item.employee,
        item.division,
        item.position,
        item.checkIn,
        item.checkOut,
        item.totalHours,
        item.status,
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
      headStyles: {
        fillColor: [193, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 9, halign: 'center' },
        1: { cellWidth: 31 },
        2: { cellWidth: 24 },
        3: { cellWidth: 43 },
        4: { cellWidth: 16, halign: 'center' },
        5: { cellWidth: 16, halign: 'center' },
        6: { cellWidth: 17, halign: 'center' },
        7: { cellWidth: 24 },
      },
      didDrawPage: drawLetterhead,
    });

    if (rows.length === 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text('Tidak ada data absensi.', pageWidth / 2, 63, { align: 'center' });
    }

    pdf.save('absensi.pdf');
  };

  return (
    <div className="min-w-0">
      {/* Heading halaman dan informasi tanggal */}
      <div
        className="
          flex items-center justify-between gap-3.5 mb-[17px]
          [&_.page-title]:mb-0 [&_.figma-date-select]:w-[146px]
          max-[800px]:gap-2.5 max-[800px]:mb-3
          max-[800px]:[&_.figma-date-select]:w-[180px]
          max-[600px]:items-start max-[600px]:flex-col
          max-[600px]:[&_.figma-date-select]:w-full
          max-[600px]:[&_.figma-date-select]:h-[34px]
        "
      >
        <PageTitle title="Absensi" className="employee-list-title !mb-0" />

        <AttendanceDateFilter
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setPage(1);
          }}
        />
      </div>

      {/* Ringkasan statistik absensi */}
      <AttendanceSummaryCards stats={overviewStats} />

      <AttendanceToolbar
        query={query}
        division={division}
        divisionOptions={divisionOptions}
        period={period}
        role={role}
        canEdit={user.role !== 'Manajer' && user.role !== 'Karyawan'}
        onQueryChange={(value) => { setQuery(value); setPage(1); }}
        onDivisionChange={(value) => { setDivision(value); setPage(1); }}
        onPeriodChange={(value) => { setPeriod(value); setPage(1); }}
        onExportExcel={() => { void handleExport(); }}
        onExportPdf={handleExportPdf}
      />

      <AttendanceTable
        rows={pagedRows}
        page={activePage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        role={role}
        readOnly={user.role === 'Manajer'}
        onPageChange={setPage}
        onDelete={(id, employee) => setDeleteTarget({ id, employee })}
      />

      {deleteTarget && (
        <AttendanceDeleteDialog
          employee={deleteTarget.employee}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            updateAttendance(deleteTarget.id, {
              checkIn: '',
              checkOut: '',
              totalHours: '',
              status: 'Belum Absen',
            });
            setDeleteTarget(null);
            setDeleteSucceeded(true);
          }}
        />
      )}
      {deleteSucceeded && (
        <AttendanceDeleteSuccessDialog onClose={() => setDeleteSucceeded(false)} />
      )}

      {/* Dialog untuk melihat detail absensi */}
      {attendanceId && !isEdit && !isNew && (
        <AttendanceDialog
          record={record}
          role={role}
          onClose={() =>
            navigate(`/${role}/attendance`)
          }
        />
      )}

      {/* Form untuk menambah atau mengedit absensi */}
      {(isNew || isEdit) && (
        <AttendanceForm
          record={formRecord}
          employees={employees}
          attendance={attendance}
          selectedDate={selectedDate}
          addAttendance={addAttendance}
          updateAttendance={updateAttendance}
          onCancel={() =>
            navigate(`/${role}/attendance`)
          }
        />
      )}
    </div>
  );
}
