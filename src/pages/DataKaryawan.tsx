import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router';

import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import {
  Badge,
  Button,
  CloseButton,
  DataKaryawanBreadcrumb,
  DataKaryawanFormModal,
  DataKaryawanSearchBar,
  Pagination,
  PageTitle,
  type EmployeeFormData,
} from '../components/UI';
import { AttendanceDatePicker } from '../components/AttendanceComponents';

const displayOrder = [
  'Reza Aditya',
  'Nadia Safitri',
  'Fajar Ramadhan',
  'Dimas Kurniawan',
  'Sinta Maharani',
];
const employeePageSize = 7;

const getEmploymentType = (value?: string) => {
  const normalized = value?.trim().toLowerCase();
  return normalized && normalized !== 'pns' ? 'Non PNS' : 'PNS';
};

const getPrintDate = () =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());

const formatEmployeeBirthDate = (value?: string) => {
  if (!value) return 'Belum diisi';
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(parsed);
};

const familySample = [
  { name: 'Maya Lestari', nik: '1827313290001', birthPlace: 'Surabaya', birthDate: '19/04/1975', education: 'S1', relation: 'Istri' },
  { name: 'Farhan Aditya', nik: '1827313290002', birthPlace: 'Surabaya', birthDate: '19/04/2001', education: 'S1', relation: 'Anak' },
  { name: 'Achmad Ghofar', nik: '1827313290003', birthPlace: 'Surabaya', birthDate: '19/04/2003', education: 'S2', relation: 'Anak' },
  { name: 'Dynara Hayu Nafisah', nik: '1827313290004', birthPlace: 'Surabaya', birthDate: '19/04/2005', education: 'SMA', relation: 'Anak' },
  { name: 'Javanie Jasmine', nik: '1827313290005', birthPlace: 'Surabaya', birthDate: '19/04/2007', education: 'SMA', relation: 'Anak' },
];

const createFamilySamples = (employee: { id: string; gender?: string }) => {
  const employeeNumber = Number(employee.id.match(/\d+/)?.[0] || 1);
  const partnerNames = employee.gender === 'Perempuan'
    ? ['Budi Santoso', 'Agus Setiawan', 'Dedi Kurniawan', 'Hendra Saputra', 'Rudi Hartono']
    : ['Rina Puspitasari', 'Dewi Kartika', 'Siti Rahmawati', 'Ayu Lestari', 'Maya Anggraini'];
  const childNames = ['Rafi Pratama', 'Nayla Putri', 'Raka Saputra', 'Alya Maharani', 'Daffa Ramadhan'];
  const serial = String(employeeNumber).padStart(6, '0');

  return [
    {
      name: partnerNames[employeeNumber % partnerNames.length],
      nik: `3578150682${serial}`,
      birthPlace: 'Surabaya',
      birthDate: '15/06/1988',
      education: 'SMA',
      relation: employee.gender === 'Perempuan' ? 'Suami' : 'Istri',
    },
    {
      name: childNames[employeeNumber % childNames.length],
      nik: `3578080915${String(employeeNumber + 100000).slice(-6)}`,
      birthPlace: 'Surabaya',
      birthDate: '08/09/2015',
      education: 'SD',
      relation: 'Anak',
    },
  ];
};

function RowActions({ role, person, onDelete, onView, editOrigin = 'list', readOnly = false }: { role: string; person: any; onDelete?: () => void; onView?: () => void; editOrigin?: 'list' | 'detail'; readOnly?: boolean }) {
  return (
    <div className="data-employee-actions">
      {onView ? (
        <button type="button" aria-label="Lihat detail" className="data-employee-action data-employee-action-view" onClick={onView}>
          <img src="/assets/figma-view.svg" alt="" />
        </button>
      ) : (
        <Link to={`/${role}/employees/${person.id}`} aria-label="Lihat detail" className="data-employee-action data-employee-action-view">
          <img src="/assets/figma-view.svg" alt="" />
        </Link>
      )}
      {!readOnly && (
        <>
          <Link to={`/${role}/employees/${person.id}/edit`} state={{ employeeEditOrigin: editOrigin }} aria-label="Edit karyawan" className="data-employee-action data-employee-action-edit">
            <img src="/assets/figma-edit.svg" alt="" />
          </Link>
          <button className="data-employee-action data-employee-action-delete" type="button" aria-label="Hapus karyawan" disabled={!onDelete} onClick={onDelete}>
            <img src="/assets/figma-delete.svg" alt="" />
          </button>
        </>
      )}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className={"[width:100%] [min-width:0] [overflow-x:auto] [overscroll-behavior-x:contain]"}>
      <table className={"employee-data-table [width:100%] [min-width:469px] [border-collapse:separate] [border-spacing:0] [text-align:left] [&_thead_tr]:[height:48px] [&_thead_tr]:[background:#c10000] [&_th]:[height:48px] [&_th]:[padding:0_11px] [&_th]:[background:#c10000] [&_th]:[color:#fff] [&_th]:[font:400_16px/24px_Inter,Arial,sans-serif] [&_th]:[letter-spacing:0] [&_th:first-child]:[border-radius:8px_0_0_8px] [&_th:first-child]:[text-align:center] [&_th:last-child]:[border-radius:0_8px_8px_0] [&_td]:[height:45px] [&_td]:[padding:7px_11px] [&_td]:[border-bottom:.5px_solid_#0003] [&_td]:[color:#111] [&_td]:[font:300_15px/22px_Inter,Arial,sans-serif] [&_td]:[vertical-align:middle] [&_td:first-child]:[text-align:center] [&_tbody_tr:last-child_td]:[border-bottom-color:#0002] max-[600px]:[min-width:680px] [&_th]:[font-size:var(--type-table)]! [&_th]:[line-height:var(--line-table)]! [&_td]:[font-size:var(--type-table)]! [&_td]:[line-height:var(--line-table)]! max-[520px]:[min-width:476px] [min-width:700px] [&_th]:[text-align:left] [&_th:first-child]:[width:56px] [&_th:first-child]:[text-align:center] [&_td:first-child]:[width:56px] [&_td:first-child]:[text-align:center] [&_th:nth-child(2)]:[width:154px] [&_th:nth-child(3)]:[width:140px] [&_th:nth-child(4)]:[width:112px] [&_th:nth-child(5)]:[width:112px] [&_th:nth-child(6)]:[width:112px] [&_th:last-child]:[width:120px] [&_.badge]:[min-width:70px] [&_.badge]:[justify-content:center] [&_.badge]:[padding:4px_8px] [&_.badge]:[border:1px_solid_#91d2a5] [&_.badge]:[border-radius:6px] [&_.badge]:[background:#d4f2dd] [&_.badge]:[color:#148043] [&_.badge]:[font:400_14px/20px_Inter,Arial,sans-serif] max-[1150px]:[min-width:960px] [&_.badge]:[font-size:var(--type-badge)]! [&_.badge]:[line-height:var(--line-badge)]! max-[800px]:[min-width:672px]"}>
        <thead><tr>{columns.map((label) => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index}>
              {row.cells.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataKaryawan({ backgroundView }: { backgroundView?: 'list' | 'detail' } = {}) {
  const { role, employeeId } = useParams();
  const { user } = useAuth();
  const { employees, addEmployee, updateEmployee, removeEmployee } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteSucceeded, setDeleteSucceeded] = useState(false);
  const readOnly = user.role === 'Manajer';

  useEffect(() => {
    if (!deleteSucceeded) return;
    const timeoutId = window.setTimeout(() => setDeleteSucceeded(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [deleteSucceeded]);
  const [selectedFamily, setSelectedFamily] = useState<{
    name: string;
    nik: string;
    birthPlace: string;
    birthDate: string;
    education: string;
    relation: string;
  } | null>(null);
  const person = employeeId ? employees.find((item) => item.id === employeeId) : employees.find((item) => item.name === user.name) || employees[0];
  const isEdit = !backgroundView && location.pathname.endsWith('/edit');
  const isFamily = !backgroundView && location.pathname.endsWith('/family/new');
  const isForm = !backgroundView && (location.pathname.endsWith('/new') || isEdit);
  const editOrigin = location.state?.employeeEditOrigin === 'detail' ? 'detail' : 'list';

  const formKey = `${location.pathname}:${person?.id || ''}:${editOrigin}`;
  const initialFormData = {
    name: isEdit ? person?.name : '',
    gender: isEdit ? person?.gender || '' : '',
    birthDate: isEdit ? person?.birthDate || '' : '',
    division: isEdit
      ? person?.division || 'Kepengasuhan'
      : '',
    position: isEdit
      ? person?.position || ''
      : '',
    employmentType: isEdit
      ? getEmploymentType(person?.employmentType)
      : '',
    familyName: '',
    familyNik: '',
    familyBirthPlace: '',
    familyBirthDate: '',
    familyEducation: '',
    familyRelation: '',
  };
  const [formDraft, setFormDraft] = useState<{ key: string; values: EmployeeFormData } | null>(null);
  const formData = formDraft?.key === formKey ? formDraft.values : initialFormData;
  const setFormData = (values: EmployeeFormData) => {
    setFormDraft({ key: formKey, values });
  };

  const own = employees.find(
    (item) => item.name === user.name
  );

  const handleDeleteEmployee = (employee) => {
    setDeleteTarget({
      kind: 'employee',
      employeeId: employee.id,
      name: employee.name,
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.kind === 'employee') {
      removeEmployee(deleteTarget.employeeId);
    } else {
      updateEmployee(deleteTarget.employeeId, {
        family: deleteTarget.familyMembers.filter(
          (member) => member !== deleteTarget.familyMember,
        ),
      });
    }

    setDeleteTarget(null);
    setDeleteSucceeded(true);
  };

  const deleteDialogs = (
    <>
      {deleteTarget && (
        <div
          className="employee-delete-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleteTarget(null);
          }}
        >
          <section
            aria-labelledby="employee-delete-title"
            aria-describedby="employee-delete-description"
            aria-modal="true"
            className="employee-delete-dialog"
            role="dialog"
          >
            <span className="employee-delete-warning-icon" aria-hidden="true">!</span>
            <h2 id="employee-delete-title">Hapus</h2>
            <p id="employee-delete-description">
              Apakah Anda yakin untuk menghapus data?
            </p>
            <div className="employee-delete-dialog-actions">
              <Button
                className="button button-outline"
                variant="outline"
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </Button>
              <Button className="button" type="button" onClick={confirmDelete}>
                Hapus
              </Button>
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
            aria-labelledby="employee-delete-success-title"
            aria-describedby="employee-delete-success-description"
            aria-modal="true"
            className="employee-delete-dialog employee-delete-success"
            role="dialog"
          >
            <h2 id="employee-delete-success-title">Berhasil</h2>
            <p id="employee-delete-success-description">
              Data telah berhasil dihapus
            </p>
          </section>
        </div>
      )}
    </>
  );

  const ordered = useMemo(
    () =>
      [...employees].sort((a, b) => {
        const indexA = displayOrder.indexOf(a.name);
        const indexB = displayOrder.indexOf(b.name);

        return (
          (indexA < 0 ? 100 : indexA) -
          (indexB < 0 ? 100 : indexB)
        );
      }),
    [employees]
  );

  if (employeeId && !person) {
    return <Navigate to={`/${role}/employees`} replace />;
  }

  if (readOnly && (isForm || isFamily)) {
    return <Navigate to={employeeId ? `/${role}/employees/${employeeId}` : `/${role}/employees`} replace />;
  }

  const filteredEmployees = ordered.filter((item) =>
    `${item.name} ${item.position} ${item.division}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleExport = async () => {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Karyawan');

    worksheet.columns = [
      { header: 'No', key: 'number', width: 11 },
      { header: 'Nama Karyawan', key: 'name', width: 28 },
      { header: 'Divisi', key: 'division', width: 22 },
      { header: 'Posisi', key: 'position', width: 40 },
      { header: 'Jenis Karyawan', key: 'employmentType', width: 20 },
      { header: 'Status', key: 'status', width: 16 },
    ];

    filteredEmployees.forEach((item, index) => {
      worksheet.addRow({
        number: String(index + 1).padStart(2, '0'),
        name: item.name,
        division: item.division,
        position: item.position,
        employmentType: getEmploymentType(item.employmentType),
        status: item.status || 'Aktif',
      });
    });

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:F1';
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
        cell.alignment = {
          ...cell.alignment,
          vertical: 'middle',
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-karyawan.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleExportPdf = () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const printedAt = getPrintDate();
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
      pdf.text('DAFTAR DATA KARYAWAN', pageWidth / 2, 42, { align: 'center' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(85, 85, 85);
      pdf.text('Daftar karyawan AMN Surabaya', pageWidth / 2, 47, { align: 'center' });
    };

    autoTable(pdf, {
      head: [['No', 'Nama Karyawan', 'Divisi', 'Posisi', 'Jenis Karyawan', 'Status']],
      body: filteredEmployees.map((item, index) => [
        String(index + 1).padStart(2, '0'),
        item.name,
        item.division,
        item.position,
        getEmploymentType(item.employmentType),
        item.status || 'Aktif',
      ]),
      startY: 53,
      margin: { top: 53, right: pageMargin, bottom: 12, left: pageMargin },
      showHead: 'everyPage',
      rowPageBreak: 'avoid',
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
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
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 27 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
        5: { cellWidth: 32 },
      },
      didDrawPage: drawLetterhead,
    });

    if (filteredEmployees.length === 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text('Tidak ada data karyawan.', pageWidth / 2, 63, { align: 'center' });
    }

    pdf.save('data-karyawan.pdf');
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / employeePageSize)
  );
  const rows = filteredEmployees
    .slice((page - 1) * employeePageSize, page * employeePageSize)
    .map((item, index) => ({
      id: item.id,

      cells: [
        String((page - 1) * employeePageSize + index + 1).padStart(
          2,
          '0'
        ),
        item.name,
        item.division,
        item.position,
        getEmploymentType(item.employmentType),
        <Badge
          key="status"
          className={/^(non\s*aktif|tidak\s*aktif)$/i.test(item.status?.trim() ?? '') ? 'is-inactive' : 'is-active'}
        >
          {item.status || 'Aktif'}
        </Badge>,
        <RowActions
          key="actions"
          role={role}
          person={item}
          onDelete={() => handleDeleteEmployee(item)}
          editOrigin="list"
          readOnly={readOnly}
        />,
      ],
    }));

  if (
    user.role === 'Karyawan' &&
    (!employeeId || employeeId !== own?.id)
  ) {
    return (
      <Navigate
        to={`/${role}/employees/${
          own?.id || employees[0]?.id
        }`}
        replace
      />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFamily) {
      updateEmployee(person.id, {
        family: [
          ...(person.family || []),
          {
            name: formData.familyName,
            relation: formData.familyRelation,
            nik: formData.familyNik,
            birthPlace: formData.familyBirthPlace,
            birthDate: formData.familyBirthDate,
            education: formData.familyEducation,
            phone: '',
          },
        ],
      });

      navigate(`/${role}/employees/${person.id}`);
      setFormDraft(null);
      return;
    }

    const payload = {
      name: formData.name,
      gender: formData.gender,
      birthDate: formData.birthDate,
      division: formData.division,
      position: formData.position,
      employmentType: formData.employmentType,
    };

    if (isEdit) {
      updateEmployee(person.id, payload);

      setFormDraft(null);
      navigate(`/${role}/employees/${person.id}`);
    } else {
      addEmployee({
        ...payload,
        email: `${formData.name
          .toLowerCase()
          .replaceAll(' ', '.')}@amn.id`,
        phone: '0812-3456-7890',
        address: 'Surabaya, Jawa Timur',
        joinDate: '01 Januari 2026',
        avatar: '/assets/avatar-karyawan.png',
      });

      setFormDraft(null);
      navigate(`/${role}/employees`);
    }
  };

  const listing = (
    <>
      <PageTitle title="Data Karyawan" className="employee-list-title" />

      <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:14px] [margin:0_0_24px] max-[800px]:[align-items:stretch] max-[800px]:[flex-wrap:wrap] [margin-bottom:17px] max-[800px]:[gap:10px] max-[800px]:[margin-bottom:12px]"}>
        <DataKaryawanSearchBar
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />

        <div className="employee-list-actions">
          <details className="employee-export-menu">
            <summary className="employee-export-button">
              Export <img src="/assets/figma-export.svg" alt="" />
            </summary>
            <div className="employee-export-options" role="group" aria-label="Pilih format export">
              <button
                onClick={(event) => {
                  event.currentTarget.closest('details')?.removeAttribute('open');
                  void handleExport();
                }}
                type="button"
              >
                Excel (.xlsx)
              </button>
              <button
                onClick={(event) => {
                  event.currentTarget.closest('details')?.removeAttribute('open');
                  handleExportPdf();
                }}
                type="button"
              >
                PDF (.pdf)
              </button>
            </div>
          </details>

          {!readOnly && (
            <Button className="employee-add-button" to={`/${role}/employees/new`}>
              Tambah <img className="size-4 shrink-0 object-contain" src="/assets/figma-plus-white.svg" alt="" />
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={[
          'No',
          'Nama Karyawan',
          'Divisi',
          'Posisi',
          'Jenis Karyawan',
          'Status',
          'Action',
        ]}
        rows={rows}
      />

      <Pagination size="compact" page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );

  if (isForm || isFamily) {
    return (
      <div className={"[min-width:0] employee-modal-page attendance-modal-page"}>
        {isFamily && employeeId
          ? <DataKaryawan backgroundView="detail" />
          : isEdit && employeeId
            ? <DataKaryawan backgroundView={editOrigin} />
            : listing}
        <DataKaryawanFormModal
          isFamily={isFamily}
          isEdit={isEdit}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormDraft(null);
            navigate(
              isFamily || (isEdit && editOrigin === 'detail' && employeeId)
                ? `/${role}/employees/${person.id}`
                : `/${role}/employees`,
            );
          }}
          familyEducationOptions={[...new Set(familySample.map((item) => item.education))]}
          DatePicker={AttendanceDatePicker}
        />
      </div>
    );
  }

  if (employeeId && backgroundView !== 'list') {
    const savedFamily = (person.family || []).filter(
      (item) => item.nik && item.birthPlace && item.birthDate && item.education,
    );
    const family = savedFamily.length
      ? savedFamily
      : createFamilySamples(person);

    return (
      <>
        <PageTitle
          title="Detail Karyawan"
          className="employee-list-title employee-detail-page-title"
        />
        <DataKaryawanBreadcrumb
          href={user.role === 'Karyawan' ? `/${role}/dashboard` : `/${role}/employees`}
          current="Detail Karyawan"
        />

        <section className={"[min-width:0] [padding:25px] [border:1px_solid_#dddad0] [border-radius:11px] [background:#fff] max-[1250px]:[padding:26px] max-[600px]:[padding:20px] max-[1150px]:[padding:18px] max-[520px]:[padding:14px] [padding:25px] [&_.employee-table_th]:[white-space:nowrap] [&_.employee-table_td]:[font-size:10px] max-[800px]:[padding:17px] employee-detail-card"}>
          <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:14px] [&_h2]:[margin:0] [&_h2]:[color:#c10000] [&_h2]:[font:600_28px/40px_Inter,Arial,sans-serif] [&_h2]:[letter-spacing:-.5px] [&_.button]:[min-width:99px] [&_.button]:[min-height:39px] [&_.button_img]:[width:14px] [&_.button_img]:[height:14px] [&_.button_img]:[object-fit:contain] max-[520px]:[align-items:flex-start] max-[520px]:[&_h2]:[font-size:15px] max-[520px]:[&_h2]:[line-height:22px] max-[520px]:[&_.button]:[min-width:76px] max-[520px]:[&_.button]:[min-height:34px] [&_h2]:[font-size:var(--type-section-title)]! [&_h2]:[line-height:var(--line-section-title)]!"}>
            <h2>Biodata Karyawan</h2>

            {!readOnly && (
              <Button
                className="employee-add-button employee-detail-button"
                onClick={() =>
                  navigate(`/${role}/employees/${person.id}/edit`, {
                    state: { employeeEditOrigin: 'detail' },
                  })
                }
              >
                Edit
                <img
                  src="/assets/figma-edit.svg"
                  alt=""
                />
              </Button>
            )}
          </div>

          <div className={"[display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [column-gap:35px] [row-gap:8px] [margin:17px_0] max-[800px]:[column-gap:17px] max-[520px]:[grid-template-columns:1fr] max-[520px]:[row-gap:7px]"}>
            {[
              ['Nama', person.name],
              [
                'Jenis Kelamin',
                person.gender || 'Belum diisi',
              ],
              [
                'Tanggal Lahir',
                formatEmployeeBirthDate(person.birthDate),
              ],
              ['Divisi', person.division],
              ['Posisi', person.position],
              [
                'Tipe Karyawan',
                getEmploymentType(person.employmentType),
              ],
            ].map(([label, value]) => (
              <div
                className={"[min-height:39px] [display:grid] [align-content:start] [gap:2px] [border-bottom:1px_solid_#dddad0] [&_small]:[color:#6c7278] [&_small]:[font:400_14px/20px_Inter,Arial,sans-serif] [&_b]:[color:#111] [&_b]:[font:500_16px/24px_Inter,Arial,sans-serif] [&_small]:[font-size:var(--type-helper)]! [&_small]:[line-height:var(--line-helper)]! [&_b]:[font-size:var(--type-body)]! [&_b]:[line-height:var(--line-body)]!"}
                key={label}
              >
                <small>{label}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>

          <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:14px] [&_h2]:[margin:0] [&_h2]:[color:#c10000] [&_h2]:[font:600_28px/40px_Inter,Arial,sans-serif] [&_h2]:[letter-spacing:-.5px] [&_.button]:[min-width:99px] [&_.button]:[min-height:39px] [margin:0_0_24px] max-[520px]:[align-items:flex-start] max-[520px]:[&_h2]:[font-size:15px] max-[520px]:[&_h2]:[line-height:22px] max-[520px]:[&_.button]:[min-width:76px] max-[520px]:[&_.button]:[min-height:34px] [&_h2]:[font-size:var(--type-section-title)]! [&_h2]:[line-height:var(--line-section-title)]! [margin-bottom:17px]"}>
            <div>
              <h2>Data Keluarga</h2>
            </div>

            {!readOnly && (
              <Button
                className="employee-add-button employee-detail-button"
                to={`/${role}/employees/${person.id}/family/new`}
              >
                Tambah <img src="/assets/figma-plus-white.svg" alt="" />
              </Button>
            )}
          </div>

          <DataTable
            columns={[
              'No',
              'Nama',
              'NIK',
              'Tempat Lahir',
              'Tanggal Lahir',
              'Pendidikan',
              'Status',
              'Action',
            ]}
            rows={family.map((item, index) => ({
              id: item.name,

              cells: [
                String(index + 1).padStart(2, '0'),
                item.name,
                item.nik,
                item.birthPlace,
                item.birthDate,
                item.education,
                item.relation,
                <RowActions
                  key="actions"
                  role={role}
                  person={person}
                  editOrigin="detail"
                  onView={() => setSelectedFamily(item)}
                  readOnly={readOnly}
                  onDelete={() =>
                    setDeleteTarget({
                      kind: 'family',
                      employeeId: person.id,
                      name: item.name,
                      familyMember: item,
                      familyMembers: family,
                    })
                  }
                />,
              ],
            }))}
          />
        </section>

        {deleteDialogs}

        {selectedFamily && (
          <div
            className="employee-family-detail-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedFamily(null);
            }}
          >
            <section
              aria-labelledby="family-detail-title"
              aria-modal="true"
              className="employee-family-detail-modal"
              role="dialog"
            >
              <h2 id="family-detail-title">Detail Data Keluarga</h2>

              <div className="employee-family-detail-fields">
                {[
                  ['Nama', selectedFamily.name],
                  ['NIK', selectedFamily.nik],
                  ['Tempat Lahir', selectedFamily.birthPlace],
                  ['Tanggal Lahir', selectedFamily.birthDate],
                  ['Pendidikan', selectedFamily.education],
                  ['Status', selectedFamily.relation],
                ].map(([label, value]) => (
                  <div className="employee-family-detail-field" key={label}>
                    <span>{label}</span>
                    <b>{value || 'Belum diisi'}</b>
                  </div>
                ))}
              </div>

              <div className="employee-family-detail-actions">
                <CloseButton className="button" onClick={() => setSelectedFamily(null)} />
              </div>
            </section>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={"[min-width:0]"}>
      {listing}
      {deleteDialogs}
    </div>
  );
}
