import { useState } from 'react';
import { Link, useParams } from 'react-router';

import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Badge, Button, PageTitle } from '../components/UI';

const employeeRows = {
  Direktur: [
    ['Nadia Safitri', 'Pengelola', 'Sekretaris'],
    ['Fajar Ramadhan', 'Pengelola', 'Manajer Kepengasuhan'],
    [
      'Dimas Kurniawan',
      'Administrasi',
      'Administrasi Perpustakaan',
    ],
    ['Sinta Maharani', 'Administrasi', 'Administrasi Keuangan'],
    ['Reza Aditya', 'Kepengasuhan', 'Pengasuh'],
  ],

  Sekretaris: [
    ['Nadia Safitri', 'Pengelola', 'Sekretaris'],
    ['Fajar Ramadhan', 'Pengelola', 'Manajer Kepengasuhan'],
    [
      'Dimas Kurniawan',
      'Administrasi',
      'Administrasi Perpustakaan',
    ],
    ['Sinta Maharani', 'Administrasi', 'Administrasi Keuangan'],
    ['Reza Aditya', 'Kepengasuhan', 'Pengasuh'],
  ],

  Manajer: [
    ['Reza Aditya', 'Kepengasuhan', 'Pengasuh'],
    ['Rizky Ramadhan', 'Kepengasuhan', 'Pengasuh'],
    ['Ahmad Fauzan', 'Kepengasuhan', 'Pengasuh'],
    ['Fajar Nugroho', 'Kepengasuhan', 'Pengasuh'],
    ['Bagus Setiawan', 'Kepengasuhan', 'Pengasuh'],
  ],
};

const monthlyAttendance = Array.from({ length: 12 }, (_, monthIndex) => {
  const month = String(monthIndex + 1).padStart(2, '0');

  return [19, 18, 17, 16, 15].map((day) => [
    `${day}/${month}/2026`,
    '09:00',
    '17:00',
    '8',
  ]);
}).flat();

const permitLog = [
  ['22/08/2026', 'Selesai'],
  ['22/08/2026', 'Disetujui Direktur'],
  ['22/08/2026', 'Disetujui Manajer'],
  ['22/08/2026', 'Diajukan'],
];

const attendanceStats = [
  ['Hadir', '32', 'dashboard-chair.svg', 'success'],
  ['Tanpa Keterangan', '00', 'dashboard-alert.svg', 'danger'],
  ['Terlambat', '01', 'dashboard-clock.svg', 'danger'],
  ['Cuti', '01', 'dashboard-leave.svg', 'warning'],
];

const leaveStats = [
  ['Total Cuti Tahunan', '32'],
  ['Cuti Terpakai', '32'],
  ['Sisa Cuti', '32'],
];

function ActionButton({
  type = 'view',
  label,
  onClick,
}: { type?: string; label: string; onClick?: () => void }) {
  const icons = {
    view: 'figma-view.svg',
    edit: 'figma-edit.svg',
    delete: 'figma-delete.svg',
  };

  const actionSize = type === 'delete' ? 'size-[26px] rounded-lg p-0' : 'size-[26px] rounded-lg p-[5px]';
  const className = `${type === 'delete' ? 'inline-flex items-center justify-center' : 'inline-grid place-items-center'} ${actionSize} shrink-0 border align-middle [&_img]:size-[13px] [&_img]:object-contain ${type === 'edit' ? 'border-[#be5f00] bg-[#fff5e0]' : type === 'delete' ? 'border-[#c10000] bg-[#fdf4f4]' : 'border-[#6c7278] bg-[#fffbfb]'}`;
  const icon = <img src={`/assets/${icons[type]}`} alt="" />;

  return type === 'delete' ? (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      {icon}
    </button>
  ) : (
    <span className={className} aria-hidden="true">{icon}</span>
  );
}

function PanelHeading({
  title,
  subtitle,
  link,
  date,
  linkText = 'Lihat Detail',
  monthFilter,
}: { title: string; subtitle?: string; link?: string; date?: string; linkText?: string; monthFilter?: { value: string; onChange: (value: string) => void } }) {
  return (
    <div className={"[display:flex] [align-items:flex-start] [justify-content:space-between] [gap:13px] [min-width:0] [&_h2]:[margin:0] [&_h2]:[color:#c10000] [&_h2]:[font:600_26px/40px_Inter,Arial,sans-serif] [&_h2]:[letter-spacing:-.3px] [&_p]:[margin:0] [&_p]:[color:#0008] [&_p]:[font:400_14px/21px_Inter,Arial,sans-serif] [&_p]:[letter-spacing:.1px] max-[600px]:[gap:8px] max-[600px]:[&_h2]:[font-size:21px] max-[600px]:[&_h2]:[line-height:29px] max-[600px]:[&_p]:[font-size:12px] max-[600px]:[&_p]:[line-height:18px] max-[600px]:[&:has(.figma-date-select)]:[flex-direction:column] [&_h2]:[font-size:var(--type-section-title)]! [&_h2]:[line-height:var(--line-section-title)]! [&_p]:[font-size:var(--type-body)]! [&_p]:[line-height:var(--line-body)]! max-[520px]:[&_h2]:[font-size:15px] max-[520px]:[&_h2]:[line-height:21px] max-[520px]:[&_p]:[font-size:8px] max-[520px]:[&_p]:[line-height:12px] max-[520px]:[gap:6px] max-[520px]:[&:has(.figma-date-select)]:[flex-direction:column] director-panel-heading"}>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {monthFilter ? (
        <label className="figma-date-select [display:flex] [width:176px] [height:44px] [flex:none] [items-center] [justify-between] [gap:8px] [padding:0_16px] [cursor:pointer] max-[600px]:[width:100%] max-[600px]:[height:44px] month-filter-control">
          <img src="/assets/figma-calendar-red.svg" alt="" />
          <select
            aria-label="Pilih bulan rekap absensi"
            value={monthFilter.value}
            onChange={(event) => monthFilter.onChange(event.target.value)}
          >
            {Array.from({ length: 12 }, (_, index) => {
              const value = `2026-${String(index + 1).padStart(2, '0')}`;
              const label = new Intl.DateTimeFormat('id-ID', {
                month: 'long',
                year: 'numeric',
              }).format(new Date(2026, index, 1));

              return <option key={value} value={value}>{label}</option>;
            })}
          </select>
          <img className="month-filter-chevron" src="/assets/figma-chevron-down-red.svg" alt="" />
        </label>
      ) : date ? (
        <div className={"figma-date-select [height:39px] [width:146px] [flex:none] [display:flex] [align-items:center] [gap:8px] [padding:0_14px] [border:1px_solid_#d5d5d5] [border-radius:8px] [color:#c10000] [font:400_14px/20px_Inter,Arial,sans-serif] [&_img]:[width:13px] [&_img]:[height:13px] [&_img]:[object-fit:contain] [&_span]:[flex:1] [&_span]:[white-space:nowrap] [&_b]:[font-size:11px] [&_b]:[font-weight:400] max-[600px]:[width:100%] max-[600px]:[height:46px] [font-size:10px] [line-height:14px] max-[520px]:[width:100%] max-[520px]:[height:32px]"}>
          <img
            src="/assets/figma-attendance.svg"
            alt=""
          />
          <span>{date}</span>
          <b>⌄</b>
        </div>
      ) : (
        link && (
          <Link
            to={link}
            className={`[display:inline-flex] [flex:none] [align-items:center] [gap:10px] [margin-top:2px] [color:#c10000] [font:500_12px/18px_Inter,Arial,sans-serif] [white-space:nowrap] [&_span]:[font-size:16px] [&_span]:[line-height:1] ${linkText === 'Detail' ? '[margin-top:5px] [font-size:14px] [line-height:21px]' : ''}`}
          >
            {linkText} <span>→</span>
          </Link>
        )
      )}
    </div>
  );
}

function AttendanceStats() {
  return (
      <div className={"[display:grid] [grid-template-columns:repeat(4,minmax(0,1fr))] [gap:20px] [min-width:0] max-[1250px]:[gap:12px] max-[600px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[600px]:[gap:10px] max-[1150px]:[gap:9px] max-[520px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[520px]:[gap:7px] director-attendance-stats"}>
      {attendanceStats.map(
        ([label, value, icon, tone]) => (
          <div
            className={"[height:116px] [min-width:0] [padding:19px] [border:.5px_solid_#0003] [border-radius:10px] [display:flex] [flex-direction:column] [justify-content:space-between] [&_strong]:[color:#111] [&_strong]:[font:500_25.6px/32px_Inter,Arial,sans-serif] max-[600px]:[height:132px] max-[600px]:[padding:14px] max-[520px]:[height:132px] max-[520px]:[padding:14px] director-attendance-stat"}
            key={label}
          >
            <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:6px] [min-width:0]"}>
              <span className={"[width:32px] [height:32px] [flex:none] [display:grid] [place-items:center] [border:.5px_solid_#0003] [border-radius:6px] [&_img]:[object-fit:contain]"}>
                <img
                  className={icon === 'dashboard-chair.svg' ? 'dashboard-chair-icon' : undefined}
                  src={`/assets/${icon}`}
                  alt=""
                />
              </span>

              <span
                className={`min-w-0 text-right text-[12px] leading-[16px] ${tone === 'success' ? 'text-[#008c5a]' : tone === 'danger' ? 'text-[#c10000]' : 'text-[#be5f00]'}`}
              >
                {label}
              </span>
            </div>

            <strong>{value}</strong>
          </div>
        )
      )}
    </div>
  );
}

function EmployeeOverview({
  role,
  user,
}) {
  const { employees, removeEmployee } = useData();
  const people = (
    employeeRows[user.role] ||
    employeeRows.Direktur
  ).filter(([name]) => employees.some((employee) => employee.name === name));

  return (
    <section className={"[min-width:0] [padding:28px] [border:1px_solid_#dddad0] [border-radius:13px] [background:#fff] max-[1250px]:[padding:26px] max-[600px]:[padding:20px] max-[1150px]:[padding:18px] max-[520px]:[padding:14px] [min-height:436px] [padding-bottom:18px] [&_.director-panel-heading]:[margin-bottom:17px] director-employee-panel"}>
      <PanelHeading
        title="Data Karyawan"
        subtitle="Daftar seluruh karyawan AMN Surabaya."
        link={`/${role}/employees`}
      />

      <div className={"[width:100%] [min-width:0] [overflow-x:auto] [overscroll-behavior-x:contain]"}>
        <table className={"[width:100%] [min-width:469px] [border-collapse:separate] [border-spacing:0] [text-align:left] [&_thead_tr]:[height:48px] [&_thead_tr]:[background:#c10000] [&_th]:[height:48px] [&_th]:[padding:0_13px] [&_th]:[background:#c10000] [&_th]:[color:#fff] [&_th]:[font:500_12px/19px_Inter,Arial,sans-serif] [&_th]:[letter-spacing:0] [&_th:first-child]:[border-radius:12px_0_0_12px] [&_th:first-child]:[text-align:center] [&_th:last-child]:[border-radius:0_12px_12px_0] [&_th:last-child]:[text-align:center] [&_td]:[height:50px] [&_td]:[padding:7px_13px] [&_td]:[border-bottom:.5px_solid_#0003] [&_td]:[color:#111] [&_td]:[font:300_12px/19px_Inter,Arial,sans-serif] [&_td]:[vertical-align:middle] [&_td:first-child]:[text-align:center] [&_td:last-child]:[text-align:center] [&_tbody_tr:last-child_td]:[border-bottom-color:#0002] max-[600px]:[min-width:680px] [&_th]:[font-size:var(--type-table)]! [&_th]:[line-height:var(--line-table)]! [&_td]:[font-size:var(--type-table)]! [&_td]:[line-height:var(--line-table)]! max-[520px]:[min-width:476px] director-employee-table"}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Karyawan</th>
              <th>Divisi</th>
              <th>Posisi</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {people.map(
              ([name, division, position], index) => {
                const person =
                  employees.find(
                    (item) => item.name === name
                  ) || employees[index];

                return (
                  <tr key={name}>
                    <td>
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    <td>{name}</td>
                    <td>{division}</td>
                    <td>{position}</td>

                    <td>
                      <div className="[display:flex] [align-items:center] [justify-content:center] [gap:10px] director-employee-actions">
                        <Link
                          to={`/${role}/employees/${person.id}`}
                          aria-label={`Lihat ${name}`}
                        >
                          <ActionButton label={`Lihat ${name}`} />
                        </Link>

                        {user.role !== 'Manajer' && (
                          <>
                            <Link
                              to={`/${role}/employees/${person.id}/edit`}
                              aria-label={`Edit ${name}`}
                            >
                              <ActionButton type="edit" label={`Edit ${name}`} />
                            </Link>

                            <ActionButton
                              type="delete"
                              label={`Hapus ${name}`}
                              onClick={() => {
                                if (window.confirm(`Hapus data karyawan ${name}?`)) {
                                  removeEmployee(person.id);
                                }
                              }}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PermitOverview({ role }) {
  return (
    <>
      <section className={"[min-width:0] [padding:25px] [border:1px_solid_#dddad0] [border-radius:11px] [background:#fff] max-[1250px]:[padding:26px] max-[600px]:[padding:20px] max-[1150px]:[padding:18px] max-[520px]:[padding:14px] [height:260px] [display:flex] [flex-direction:column] [gap:18px] [&_.director-panel-heading]:[min-height:60px] max-[1000px]:[height:auto] max-[1000px]:[min-height:260px] max-[800px]:[height:auto] max-[800px]:[min-height:210px] director-permit-card"}>
        <PanelHeading
          title="Pengajuan Perizinan"
          subtitle="Total pengajuan perizinan yang belum di-review"
        />

        <div className={"[&>strong]:[color:#111] [&>strong]:[font:500_32px/40px_Inter,Arial,sans-serif] [width:100%] [min-height:116px] [padding:19px] [border:.5px_solid_#0003] [border-radius:8px] [display:flex] [flex-direction:column] [justify-content:space-between] [&_.attendance-icon]:[width:28px] [&_.attendance-icon]:[height:28px] [&>strong]:[font-size:var(--type-stat-value)]! [&>strong]:[line-height:var(--line-stat-value)]!"}>
          <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:6px] [min-width:0]"}>
            <span className={"[width:28px] [height:28px] [flex:none] [display:grid] [place-items:center] [border:.5px_solid_#0003] [border-radius:6px] [&_img]:[width:14px] [&_img]:[height:14px] [&_img]:[object-fit:contain]"}>
              <img
                src="/assets/dashboard-leave.svg"
                alt=""
              />
            </span>

            <span className={"[min-width:0] [color:#be5f00] [font:500_12px/16px_Inter,Arial,sans-serif] [text-align:right] [&.success]:[color:#008c5a] [&.warning]:[color:#be5f00] [&.danger]:[color:#c10000] [font-size:12px] [line-height:16px] warning"}>
              Total Perizinan
            </span>
          </div>

          <strong>05</strong>
        </div>
      </section>

      <section className={"[min-width:0] [padding:25px] [border:1px_solid_#dddad0] [border-radius:11px] [background:#fff] max-[1250px]:[padding:26px] max-[600px]:[padding:20px] max-[1150px]:[padding:18px] max-[520px]:[padding:14px] [display:flex] [flex-direction:column] [gap:18px] [min-height:436px] [&_.director-panel-heading]:[display:block] [&>.button]:[width:100%] [&>.button]:[margin-top:auto] max-[1000px]:[min-height:300px] max-[800px]:[min-height:210px] director-permit-list"}>
        <PanelHeading
          title="Daftar Pengajuan"
          subtitle="Daftar pengajuan perizinan yang belum di-review"
        />

        <div className={"[width:100%] [display:grid] [&_a]:[min-height:46px] [&_a]:[display:flex] [&_a]:[align-items:center] [&_a]:[border-bottom:.5px_solid_#0003] [&_a]:[color:#111] [&_a]:[font:300_16px/24px_Inter,Arial,sans-serif] [&_a]:[font-size:12px] [&_a]:[line-height:19px]"}>
          {[
            'Nadia Safitri',
            'Fajar Ramadhan',
            'Dimas Kurniawan',
          ].map((name, index) => (
            <Link
              key={name}
              to={`/${role}/permits/${
                index === 0 ? 'IZ-1021' : 'IZ-1024'
              }/approval`}
            >
              {name}
            </Link>
          ))}
        </div>

        <Button className="[min-height:46px] [font-size:12px] [line-height:19px] director-approval-button" to={`/${role}/permits`}>
          Approval
        </Button>
      </section>
    </>
  );
}

function OverviewDashboard({
  role,
  user,
}) {
  return (
    <div className="director-dashboard">
      <PageTitle title="Dashboard" className="[&_h1]:[font-size:25.6px] [&_h1]:[line-height:32px] [&_h1]:[letter-spacing:-1.28px]" />

      <div className={"[display:grid] [grid-template-columns:minmax(0,802fr)_minmax(196px,228fr)] [gap:22px] [align-items:stretch] max-[1000px]:[grid-template-columns:minmax(0,1fr)] max-[1000px]:[gap:20px] director-dashboard-grid"}>
        <div className={"[min-width:0] [display:grid] [gap:22px] [align-content:start] [grid-template-rows:258px_auto] max-[1000px]:[grid-template-rows:auto_auto] max-[600px]:[gap:14px]"}>
          <section className={"[min-width:0] [padding:28px] [border:1px_solid_#dddad0] [border-radius:13px] [background:#fff] [height:258px] [display:flex] [flex-direction:column] [gap:21px] max-[1000px]:[height:258px] max-[1000px]:[min-height:258px] max-[600px]:[height:auto] max-[600px]:[gap:18px] max-[600px]:[padding:20px] max-[600px]:[min-height:0] director-attendance-panel"}>
            <PanelHeading
              title="Status Absensi Harian"
              subtitle="Laporan kehadiran 27 Juni 2026"
              link={`/${role}/attendance`}
            />

            <AttendanceStats />
          </section>

          <EmployeeOverview
            role={role}
            user={user}
          />
        </div>

        <aside className={"[min-width:0] [display:grid] [gap:22px] [align-content:start] [grid-template-rows:260px_minmax(436px,1fr)] max-[1000px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[1000px]:[grid-template-rows:auto] max-[600px]:[grid-template-columns:1fr] max-[600px]:[gap:14px] director-permit-column"}>
          <PermitOverview role={role} />
        </aside>
      </div>
    </div>
  );
}

function LeaveOverview({ role }) {
  return (
    <section className={"[min-width:0] [padding:28px] [border:1px_solid_#dddad0] [border-radius:13px] [background:#fff] max-[600px]:[padding:20px] [height:258px] [display:flex] [flex-direction:column] [gap:21px] max-[1000px]:[height:auto] max-[1000px]:[min-height:258px] max-[600px]:[min-height:210px] employee-leave-panel"}>
      <PanelHeading
        title="Rekap Cuti Tahunan"
        subtitle="Rekap cuti 1 tahun terakhir"
        link={`/${role}/permits`}
      />

      <div className={"[display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:20px] [min-width:0] max-[1150px]:[gap:9px] max-[600px]:[gap:8px] max-[520px]:[gap:5px] employee-leave-stats"}>
        {leaveStats.map(([label, value]) => (
          <div
            className={"[height:116px] [min-width:0] [padding:19px] [border:.5px_solid_#0003] [border-radius:10px] [display:flex] [flex-direction:column] [justify-content:space-between] [&_small]:[color:#111] [&_small]:[font:400_12px/18px_Inter,Arial,sans-serif] [&_strong]:[color:#111] [&_strong]:[font:500_25.6px/32px_Inter,Arial,sans-serif] max-[600px]:[height:132px] max-[600px]:[padding:14px] max-[520px]:[height:132px] max-[520px]:[padding:14px] employee-leave-stat"}
            key={label}
          >
            <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:6px] [min-width:0]"}>
              <span className={"[width:32px] [height:32px] [flex:none] [display:grid] [place-items:center] [border:.5px_solid_#0003] [border-radius:6px] [&_img]:[object-fit:contain]"}>
                <img
                  src="/assets/dashboard-leave.svg"
                  alt=""
                />
              </span>

              <span className={"[min-width:0] [color:#be5f00] [font:500_12px/16px_Inter,Arial,sans-serif] [text-align:right] [&.success]:[color:#008c5a] [&.warning]:[color:#be5f00] [&.danger]:[color:#c10000] [font-size:12px] [line-height:16px] max-[600px]:[font-size:10px] max-[600px]:[line-height:13px] success"}>
                {label}
              </span>
            </div>

            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function MonthlyAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const filteredAttendance = monthlyAttendance.filter(([date]) => {
    const [, month, year] = date.split('/');
    return `${year}-${month}` === selectedMonth;
  });

  return (
    <section className={"[min-width:0] [padding:28px] [border:1px_solid_#dddad0] [border-radius:13px] [background:#fff] max-[600px]:[padding:20px] [min-height:436px] [display:flex] [flex-direction:column] [gap:21px] employee-attendance-panel"}>
      <PanelHeading
        title="Rekap Absensi Bulanan"
        subtitle="Rekap absensi 1 bulan terakhir"
        monthFilter={{ value: selectedMonth, onChange: setSelectedMonth }}
      />

      <div className={"[width:100%] [min-width:0] [overflow-x:auto] [overscroll-behavior-x:contain]"}>
        <table className={"[width:100%] [min-width:469px] [border-collapse:separate] [border-spacing:0] [text-align:left] [&_thead_tr]:[height:48px] [&_thead_tr]:[background:#c10000] [&_th]:[height:48px] [&_th]:[padding:0_11px] [&_th]:[background:#c10000] [&_th]:[color:#fff] [&_th]:[font:400_16px/24px_Inter,Arial,sans-serif] [&_th]:[letter-spacing:0] [&_th:first-child]:[border-radius:8px_0_0_8px] [&_th:first-child]:[text-align:center] [&_th:last-child]:[border-radius:0_8px_8px_0] [&_th:last-child]:[text-align:center] [&_td]:[height:45px] [&_td]:[padding:7px_11px] [&_td]:[border-bottom:.5px_solid_#0003] [&_td]:[color:#111] [&_td]:[font:300_15px/22px_Inter,Arial,sans-serif] [&_td]:[vertical-align:middle] [&_td:first-child]:[text-align:center] [&_td:last-child]:[text-align:center] [&_tbody_tr:last-child_td]:[border-bottom-color:#0002] max-[600px]:[min-width:680px] [&_th]:[font-size:var(--type-table)]! [&_th]:[line-height:var(--line-table)]! [&_td]:[font-size:var(--type-table)]! [&_td]:[line-height:var(--line-table)]! max-[520px]:[min-width:476px]"}>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Masuk</th>
              <th>Pulang</th>
              <th>Total Jam</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.length ? filteredAttendance.map((row, index) => (
              <tr
                key={`${row[0]}-${index}`}
              >
                <td>
                  {String(index + 1).padStart(2, '0')}
                </td>

                {row.map((value, valueIndex) => (
                  <td key={valueIndex}>
                    {value}
                  </td>
                ))}

                <td>
                  <Badge className="employee-attendance-status">Hadir</Badge>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="[padding:24px_12px] attendance-empty-state">
                  Tidak ada data absensi untuk bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PermitLog({ role }) {
  return (
    <section className={"[min-width:0] [padding:28px_36px] [border:1px_solid_#dddad0] [border-radius:13px] [background:#fff] max-[600px]:[padding:20px] [min-height:436px] [display:flex] [flex-direction:column] [gap:21px] employee-permit-log"}>
      <PanelHeading
        title="Log Perizinan"
        subtitle="Detail pengajuan terakhir"
        link={`/${role}/permits`}
        linkText="Detail"
      />

      <div className={"[display:grid] [&>div]:[min-height:0] [&>div]:[display:grid] [&>div]:[grid-template-columns:1fr_1fr] [&>div]:[gap:10px] [&>div]:[align-items:center] [&>div]:[border-bottom:.5px_solid_#dedede] [&>div]:[color:#111] [&>div]:[font:300_14px/21px_Inter,Arial,sans-serif] [&>div]:[padding:17px_0] max-[600px]:[&>div]:[padding:12px_0]"}>
        {permitLog.map(
          ([date, description], index) => (
            <div
              key={`${date}-${index}`}
            >
              <span>{date}</span>
              <span>{description}</span>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function PermitSummary() {
  return (
    <section className={"[min-width:0] [padding:28px] [border:1px_solid_#dddad0] [border-radius:13px] [background:#fff] max-[600px]:[padding:20px] [height:260px] [display:flex] [flex-direction:column] [gap:21px] [&_.director-panel-heading]:[min-height:60px] max-[1000px]:[height:auto] max-[1000px]:[min-height:260px] max-[600px]:[min-height:210px] employee-permit-summary"}>
      <PanelHeading
        title="Rekap Perizinan"
        subtitle="Agustus 2026"
      />

        <div className={"[&>strong]:[color:#111] [&>strong]:[font:500_32px/40px_Inter,Arial,sans-serif] [width:100%] [min-height:116px] [padding:19px] [border:.5px_solid_#0003] [border-radius:8px] [display:flex] [flex-direction:column] [justify-content:space-between] [&_.attendance-icon]:[width:28px] [&_.attendance-icon]:[height:28px] [&>strong]:[font-size:var(--type-stat-value)]! [&>strong]:[line-height:var(--line-stat-value)]!"}>
        <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:6px] [min-width:0]"}>
          <span className={"[width:28px] [height:28px] [flex:none] [display:grid] [place-items:center] [border:.5px_solid_#0003] [border-radius:6px] [&_img]:[width:14px] [&_img]:[height:14px] [&_img]:[object-fit:contain]"}>
            <img
              src="/assets/dashboard-leave.svg"
              alt=""
            />
          </span>

          <span className={"[min-width:0] [color:#be5f00] [font:500_12px/16px_Inter,Arial,sans-serif] [text-align:right] [&.success]:[color:#008c5a] [&.warning]:[color:#be5f00] [&.danger]:[color:#c10000] [font-size:8px] [line-height:11px] warning"}>
            Total Izin Bulanan
          </span>
        </div>

        <strong>01</strong>
      </div>
    </section>
  );
}

function DashboardKaryawan({ role }) {
  return (
    <div className="director-dashboard">
      <PageTitle title="Dashboard" className="[&_h1]:[font-size:25.6px] [&_h1]:[line-height:32px] [&_h1]:[letter-spacing:-1.28px]" />

      <div className={"[display:grid] [grid-template-columns:minmax(0,802fr)_minmax(196px,228fr)] [gap:22px] [align-items:stretch] max-[1000px]:[grid-template-columns:minmax(0,1fr)] max-[1000px]:[gap:20px] employee-dashboard-layout"}>
        <div className={"[min-width:0] [display:grid] [gap:22px] [align-content:start] [grid-template-rows:258px_auto] max-[1000px]:[grid-template-rows:auto_auto] max-[600px]:[gap:14px]"}>
          <LeaveOverview role={role} />

          <MonthlyAttendance />
        </div>

        <aside className={"[min-width:0] [display:grid] [gap:22px] [align-content:start] [grid-template-rows:260px_minmax(436px,1fr)] max-[1000px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[1000px]:[grid-template-rows:auto] max-[600px]:[grid-template-columns:1fr] max-[600px]:[gap:14px]"}>
          <PermitSummary />
          <PermitLog role={role} />
        </aside>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useParams();
  const { user } = useAuth();

  return user.role === 'Karyawan' ? (
    <DashboardKaryawan role={role} />
  ) : (
    <OverviewDashboard
      role={role}
      user={user}
    />
  );
}
