export const roles = [
  'Direktur',
  'Sekretaris',
  'Manajer',
  'Karyawan',
];

const initialUsers = [
  {
    id: 'fig-01',
    name: 'Javanie Jasmine',
    email: 'ketoprak.maswahyu@gmail.com',
    password: 'jasmine1234',
    role: 'Karyawan',
    position: 'Karyawan',
    division: 'Administrasi',
    avatar: '/assets/avatar-karyawan.png',
    status: 'Aktif',
  },
  {
    id: 'fig-02',
    name: 'Andi Pratama',
    email: 'andi.pratama@gmail.com',
    password: 'pratama1234',
    role: 'Direktur',
    position: 'Direktur',
    division: 'Direksi',
    avatar: '/assets/avatar-direktur.png',
    status: 'Aktif',
  },
  {
    id: 'fig-03',
    name: 'Sinta Dewi',
    email: 'sinta.dewi@gmail.com',
    password: 'dewi1234',
    role: 'Manajer',
    position: 'Manajer',
    division: 'Operasional',
    avatar: '/assets/avatar-manajer.png',
    status: 'Aktif',
  },
  {
    id: 'fig-04',
    name: 'Nadia Safitri',
    email: 'nadia.safitri@gmail.com',
    password: 'safitri1234',
    role: 'Sekretaris',
    position: 'Sekretaris',
    division: 'Direksi',
    avatar: '/assets/avatar-sekretaris.png',
    status: 'Aktif',
  },
  {
    id: 'fig-05',
    name: 'Laras Putri',
    email: 'laras.putri@gmail.com',
    password: 'putri1234',
    role: 'Karyawan',
    position: 'Karyawan',
    division: 'Administrasi',
    avatar: '/assets/avatar-karyawan.png',
    status: 'Non Aktif',
  },
];

const employeeSampleNames = [
  'Aditya Pratama',
  'Rani Puspita',
  'Bima Saputra',
  'Citra Maharani',
  'Yoga Pratama',
  'Nisa Amalia',
  'Raka Wibowo',
  'Intan Permata',
  'Dwi Anggraini',
  'Fikri Ramadhan',
  'Sari Wulandari',
  'Arif Hidayat',
  'Putri Amelia',
  'Galih Santoso',
  'Nanda Pertiwi',
  'Bayu Kurniawan',
  'Dewi Lestari',
  'Reza Maulana',
  'Hana Safitri',
  'Tegar Firmansyah',
  'Laila Nuraini',
  'Rio Setiawan',
];

const employeeSampleRoles = [
  { division: 'Kepengasuhan', position: 'Pengasuh' },
  { division: 'Administrasi', position: 'Karyawan' },
  { division: 'Administrasi', position: 'Administrasi Keuangan' },
  { division: 'Operasional', position: 'Karyawan' },
  { division: 'Pengelola', position: 'Manajer Kepengasuhan' },
];

const employeeGenderSamples = [
  'Perempuan', 'Laki-Laki', 'Perempuan', 'Perempuan', 'Perempuan',
  'Laki-Laki', 'Laki-Laki', 'Perempuan', 'Laki-Laki', 'Laki-Laki',
  'Laki-Laki', 'Laki-Laki', 'Laki-Laki', 'Perempuan', 'Laki-Laki',
  'Perempuan', 'Laki-Laki', 'Perempuan', 'Laki-Laki', 'Perempuan',
  'Perempuan', 'Laki-Laki', 'Perempuan', 'Laki-Laki', 'Perempuan',
  'Laki-Laki', 'Perempuan', 'Laki-Laki', 'Perempuan', 'Laki-Laki',
  'Perempuan', 'Laki-Laki', 'Perempuan', 'Laki-Laki',
];

const familyFemaleNames = [
  'Rina Puspitasari', 'Dewi Kartika', 'Siti Rahmawati', 'Ayu Lestari',
  'Maya Anggraini', 'Fitri Handayani', 'Nina Oktaviani', 'Indah Permata',
  'Lina Wulandari', 'Ratna Sari', 'Novi Andriani', 'Wulan Safitri',
  'Sri Wahyuni', 'Dian Kusuma', 'Tika Maharani', 'Rosa Amelia',
  'Lilis Setyaningrum', 'Nia Kurniawati', 'Yuni Astuti', 'Vina Aprilia',
  'Nanda Pratiwi', 'Putri Ramadhani', 'Aulia Ningsih', 'Erna Susanti',
  'Salsa Nuraini', 'Tari Pertiwi', 'Larasati Dewi', 'Mega Puspita',
  'Reni Marlina', 'Anisa Fitriyani', 'Niken Larasati', 'Cindy Permata',
  'Nita Anggraini', 'Rika Amelia',
];

const familyMaleNames = [
  'Budi Santoso', 'Agus Setiawan', 'Rizal Firmansyah', 'Dedi Kurniawan',
  'Hendra Saputra', 'Fajar Hidayat', 'Rudi Hartono', 'Dimas Prakoso',
  'Arif Wibowo', 'Eko Prasetyo', 'Wahyu Ramadhan', 'Andri Irawan',
  'Bayu Nugroho', 'Rian Maulana', 'Taufik Iskandar', 'Yusuf Hakim',
  'Galih Pratama', 'Doni Hermawan', 'Ilham Fauzi', 'Raka Firmansyah',
  'Rangga Saputra', 'Bagas Aditya', 'Rizki Kurniawan', 'Yoga Pamungkas',
  'Fikri Akbar', 'Aditia Putra', 'Farhan Maulana', 'Dwi Cahyono',
  'Ari Wicaksono', 'Reza Purnama', 'Gilang Ramadhan', 'Teguh Santoso',
  'Rendy Pratama', 'Aldi Setiawan',
];

const familyChildNames = [
  'Rafi Pratama', 'Nayla Putri', 'Raka Saputra', 'Alya Maharani',
  'Daffa Ramadhan', 'Zahra Aulia', 'Rizky Maulana', 'Nadia Permata',
  'Farel Hidayat', 'Aisyah Safitri', 'Rangga Kurniawan', 'Intan Puspita',
  'Fahri Setiawan', 'Nabila Lestari', 'Arkan Wibowo', 'Kayla Amelia',
  'Raihan Nugroho', 'Salma Rahmawati', 'Adnan Firmansyah', 'Citra Anggraini',
  'Rafi Ahmad', 'Dinda Kartika', 'Naufal Hakim', 'Azka Pratiwi',
  'Gibran Prakoso', 'Salsa Azzahra', 'Rendy Saputra', 'Tiara Kusuma',
  'Farrel Akbar', 'Nina Wulandari', 'Dimas Arya', 'Laila Ningsih',
  'Rizwan Fauzi', 'Aurel Maharani',
];

const createFamilyRecords = (index: number) => {
  const gender = employeeGenderSamples[index % employeeGenderSamples.length];
  const serial = String(index + 1).padStart(6, '0');
  const spouseDate = `15/06/${1982 + (index % 13)}`;
  const childDate = `0${(index % 8) + 1}/0${(index % 9) + 1}/${2009 + (index % 10)}`;

  return [
    {
      name: gender === 'Perempuan'
        ? familyMaleNames[index % familyMaleNames.length]
        : familyFemaleNames[index % familyFemaleNames.length],
      relation: gender === 'Perempuan' ? 'Suami' : 'Istri',
      nik: `3578${String(15 + (index % 13)).padStart(2, '0')}06${String(82 + (index % 13)).padStart(2, '0')}${serial}`,
      birthPlace: ['Surabaya', 'Sidoarjo', 'Gresik', 'Mojokerto'][index % 4],
      birthDate: spouseDate,
      education: ['SMA', 'D3', 'S1'][index % 3],
    },
    {
      name: familyChildNames[index % familyChildNames.length],
      relation: 'Anak',
      nik: `3578${String(8 + (index % 20)).padStart(2, '0')}09${String(9 + (index % 10)).padStart(2, '0')}${String(index + 100001).slice(-6)}`,
      birthPlace: ['Surabaya', 'Sidoarjo', 'Gresik'][index % 3],
      birthDate: childDate,
      education: ['SD', 'SMP', 'SMA'][index % 3],
    },
  ];
};

export const employees = [
  ...initialUsers.map((u, i) => ({
    ...u,
    employeeNo: `AMN-202${i + 1}-00${i + 1}`,
    phone: `0812-3456-78${i}0`,
    joinDate: `0${i + 3} Januari 202${i + 1}`,
    address: 'Surabaya, Jawa Timur',
    family: [
      {
        name: i === 0 ? 'Arif Safitri' : 'Keluarga ' + u.name.split(' ')[0],
        relation: 'Keluarga',
        phone: '0812-0000-0000',
      },
    ],
  })),
  {
    id: 'u7',
    name: 'Fajar Ramadhan',
    email: 'fajar.ramadhan@amn.id',
    role: 'Manajer',
    position: 'Manajer Kepengasuhan',
    division: 'Pengelola',
    employeeNo: 'AMN-2024-007',
    phone: '0812-3456-7807',
    joinDate: '12 Januari 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-manajer.png',
    family: [],
  },
  {
    id: 'u8',
    name: 'Dimas Kurniawan',
    email: 'dimas.kurniawan@amn.id',
    role: 'Karyawan',
    position: 'Administrasi Perpustakaan',
    division: 'Administrasi',
    employeeNo: 'AMN-2024-008',
    phone: '0812-3456-7808',
    joinDate: '18 Februari 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-karyawan.png',
    family: [],
  },
  {
    id: 'u9',
    name: 'Sinta Maharani',
    email: 'sinta.maharani@amn.id',
    role: 'Karyawan',
    position: 'Administrasi Keuangan',
    division: 'Administrasi',
    employeeNo: 'AMN-2024-009',
    phone: '0812-3456-7809',
    joinDate: '02 Maret 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-karyawan.png',
    family: [],
  },
  {
    id: 'u10',
    name: 'Rizky Ramadhan',
    email: 'rizky.ramadhan@amn.id',
    role: 'Karyawan',
    position: 'Pengasuh',
    division: 'Kepengasuhan',
    employeeNo: 'AMN-2024-010',
    phone: '0812-3456-7810',
    joinDate: '10 Maret 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-karyawan.png',
    family: [],
  },
  {
    id: 'u11',
    name: 'Ahmad Fauzan',
    email: 'ahmad.fauzan@amn.id',
    role: 'Karyawan',
    position: 'Pengasuh',
    division: 'Kepengasuhan',
    employeeNo: 'AMN-2024-011',
    phone: '0812-3456-7811',
    joinDate: '18 Maret 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-karyawan.png',
    family: [],
  },
  {
    id: 'u12',
    name: 'Fajar Nugroho',
    email: 'fajar.nugroho@amn.id',
    role: 'Karyawan',
    position: 'Pengasuh',
    division: 'Kepengasuhan',
    employeeNo: 'AMN-2024-012',
    phone: '0812-3456-7812',
    joinDate: '02 April 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-karyawan.png',
    family: [],
  },
  {
    id: 'u13',
    name: 'Bagus Setiawan',
    email: 'bagus.setiawan@amn.id',
    role: 'Karyawan',
    position: 'Pengasuh',
    division: 'Kepengasuhan',
    employeeNo: 'AMN-2024-013',
    phone: '0812-3456-7813',
    joinDate: '14 April 2024',
    status: 'Aktif',
    address: 'Surabaya, Jawa Timur',
    avatar: '/assets/avatar-karyawan.png',
    family: [],
  },
  ...Array.from({ length: 22 }, (_, index) => {
    const employeeNumber = index + 14;
    const assignment = employeeSampleRoles[index % employeeSampleRoles.length];

    return {
      id: `u${employeeNumber}`,
      name: employeeSampleNames[index],
      email: `karyawan${employeeNumber}@example.test`,
      role: 'Karyawan',
      position: assignment.position,
      division: assignment.division,
      employeeNo: `CONTOH-${String(employeeNumber).padStart(3, '0')}`,
      phone: `000000000${String(employeeNumber).padStart(3, '0')}`,
      joinDate: '01 Januari 2025',
      employmentType: employeeNumber % 3 === 0 ? 'Non PNS' : 'PNS',
      status: 'Aktif',
      address: 'Contoh, Surabaya',
      avatar: '/assets/avatar-karyawan.png',
      family: [],
    };
  }),
].map((employee, index) => ({
  ...employee,
  gender: employeeGenderSamples[index % employeeGenderSamples.length],
  birthDate: `${1980 + (index % 18)}-${String((index % 12) + 1).padStart(2, '0')}-${String(((index * 3) % 27) + 1).padStart(2, '0')}`,
  family: createFamilyRecords(index),
}));

// Buat akun mock untuk setiap karyawan yang sudah ada. Data karyawan tetap
// menjadi sumber nama, email, role, status, divisi, dan posisi.
const usedUserEmails = new Set<string>();
export const users = employees.map((employee) => {
  const savedMockAccount = initialUsers.find((user) => user.id === employee.id);
  const nameSlug = employee.name
    .toLocaleLowerCase('id-ID')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
  let email = employee.email || `${nameSlug}@amn.id`;
  if (usedUserEmails.has(email.toLocaleLowerCase('id-ID'))) {
    email = `${nameSlug}.${employee.id}@amn.id`;
  }
  usedUserEmails.add(email.toLocaleLowerCase('id-ID'));

  return {
    ...employee,
    email,
    password: savedMockAccount?.password || `${nameSlug.split('.')[0] || 'karyawan'}1234`,
    role: employee.role || savedMockAccount?.role || 'Karyawan',
    status: employee.status || savedMockAccount?.status || 'Aktif',
  };
});

const attendanceRecords = [
  {
    id: 'A-2401',
    employee: 'Reza Aditya',
    date: '15 Juni 2025',
    checkIn: '09:00',
    checkOut: '17:00',
    totalHours: '8',
    status: 'Hadir',
    division: 'Kepengasuhan',
    position: 'Pengasuh',
  },
  {
    id: 'A-2402',
    employee: 'Nadia Safitri',
    date: '15 Juni 2025',
    checkIn: '09:00',
    checkOut: '17:00',
    totalHours: '8',
    status: 'Hadir',
    division: 'Pengelola',
    position: 'Sekretaris',
  },
  {
    id: 'A-2403',
    employee: 'Fajar Ramadhan',
    date: '15 Juni 2025',
    checkIn: '09:00',
    checkOut: '17:00',
    totalHours: '8',
    status: 'Hadir',
    division: 'Pengelola',
    position: 'Manajer Kepengasuhan',
  },
  {
    id: 'A-2404',
    employee: 'Dimas Kurniawan',
    date: '15 Juni 2025',
    checkIn: '09:30',
    checkOut: '17:00',
    totalHours: '7.5',
    status: 'Terlambat',
    division: 'Administrasi',
    position: 'Administrasi Perpustakaan',
  },
  {
    id: 'A-2405',
    employee: 'Sinta Maharani',
    date: '15 Juni 2025',
    checkIn: '09:00',
    checkOut: '17:00',
    totalHours: '8',
    status: 'Hadir',
    division: 'Administrasi',
    position: 'Administrasi Keuangan',
  },
  {
    id: 'A-2406',
    employee: 'Javanie Jasmine',
    date: '15 Juni 2025',
    checkIn: '09:00',
    checkOut: '17:00',
    totalHours: '8',
    status: 'Hadir',
    division: 'Administrasi',
    position: 'Karyawan',
  },
  {
    id: 'A-2407',
    employee: 'Javanie Jasmine',
    date: '14 Juni 2025',
    checkIn: '09:15',
    checkOut: '17:00',
    totalHours: '7.75',
    status: 'Terlambat',
    division: 'Administrasi',
    position: 'Karyawan',
  },
];

// Lengkapi absensi mock tanggal 15 Juni 2025 untuk seluruh roster karyawan.
// Data ini bersifat fiktif untuk mengisi tampilan prototipe.
export const attendance = [
  ...attendanceRecords,
  ...employees
    .filter((employee) => !attendanceRecords.some(
      (record) => record.employee === employee.name && record.date === '15 Juni 2025'
    ))
    .map((employee, index, missingEmployees) => {
      const isOnLeave = index === missingEmployees.length - 1;

      return {
        id: `A-MOCK-${employee.id}`,
        employee: employee.name,
        date: '15 Juni 2025',
        checkIn: isOnLeave ? '—' : '09:00',
        checkOut: isOnLeave ? '—' : '17:00',
        totalHours: isOnLeave ? '—' : '8',
        status: isOnLeave ? 'Cuti' : 'Hadir',
        division: employee.division,
        position: employee.position,
      };
    }),
];

export const permits = [
  {
    id: 'IZ-1024',
    employee: 'Reza Aditya',
    division: 'Kepengasuhan',
    position: 'Pengasuh',
    type: 'Izin',
    from: '03/07/2025',
    to: '03/07/2025',
    days: 1,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1023',
    employee: 'Nadia Safitri',
    division: 'Pengelola',
    position: 'Sekretaris',
    type: 'Izin',
    from: '17/07/2026',
    to: '19/07/2026',
    days: 3,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1022',
    employee: 'Fajar Ramadhan',
    division: 'Pengelola',
    position: 'Manajer Kepengasuhan',
    type: 'Izin',
    from: '16/07/2025',
    to: '18/07/2025',
    days: 3,
    status: 'Menunggu',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1021',
    employee: 'Dimas Kurniawan',
    division: 'Administrasi',
    position: 'Sekretaris',
    type: 'Izin',
    from: '12/07/2025',
    to: '03/07/2025',
    days: 1,
    status: 'Disetujui',
    reason: 'Sakit',
  },
  {
    id: 'IZ-1020',
    employee: 'Sinta Maharani',
    division: 'Administrasi',
    position: 'Administrasi Keuangan',
    type: 'Izin',
    from: '08/07/2025',
    to: '09/07/2025',
    days: 2,
    status: 'Ditolak',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1019',
    employee: 'Javanie Jasmine',
    division: 'Administrasi',
    position: 'Karyawan',
    type: 'Cuti Tahunan',
    from: '21/07/2025',
    to: '22/07/2025',
    days: 2,
    status: 'Menunggu',
    reason: 'Keperluan keluarga',
  },
  // Data contoh fiktif agar filter Perizinan memiliki isi di setiap bulan 2026.
  {
    id: 'IZ-1018',
    employee: 'Dimas Kurniawan',
    division: 'Administrasi',
    position: 'Administrasi Perpustakaan',
    type: 'Izin',
    from: '12/01/2026',
    to: '12/01/2026',
    days: 1,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1017',
    employee: 'Sinta Maharani',
    division: 'Administrasi',
    position: 'Administrasi Keuangan',
    type: 'Izin',
    from: '09/02/2026',
    to: '10/02/2026',
    days: 2,
    status: 'Menunggu',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1016',
    employee: 'Fajar Ramadhan',
    division: 'Pengelola',
    position: 'Manajer Kepengasuhan',
    type: 'Izin',
    from: '18/03/2026',
    to: '18/03/2026',
    days: 1,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1015',
    employee: 'Nadia Safitri',
    division: 'Pengelola',
    position: 'Sekretaris',
    type: 'Cuti Tahunan',
    from: '06/04/2026',
    to: '08/04/2026',
    days: 3,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1014',
    employee: 'Javanie Jasmine',
    division: 'Administrasi',
    position: 'Karyawan',
    type: 'Izin',
    from: '21/05/2026',
    to: '21/05/2026',
    days: 1,
    status: 'Ditolak',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1013',
    employee: 'Andi Pratama',
    division: 'Direksi',
    position: 'Direktur',
    type: 'Izin',
    from: '15/06/2026',
    to: '16/06/2026',
    days: 2,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1012',
    employee: 'Sinta Dewi',
    division: 'Operasional',
    position: 'Manajer',
    type: 'Cuti Tahunan',
    from: '02/08/2026',
    to: '04/08/2026',
    days: 3,
    status: 'Menunggu',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1011',
    employee: 'Dimas Kurniawan',
    division: 'Administrasi',
    position: 'Administrasi Perpustakaan',
    type: 'Izin',
    from: '11/09/2026',
    to: '11/09/2026',
    days: 1,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1010',
    employee: 'Fajar Ramadhan',
    division: 'Pengelola',
    position: 'Manajer Kepengasuhan',
    type: 'Izin',
    from: '20/10/2026',
    to: '21/10/2026',
    days: 2,
    status: 'Menunggu',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1009',
    employee: 'Nadia Safitri',
    division: 'Pengelola',
    position: 'Sekretaris',
    type: 'Izin',
    from: '05/11/2026',
    to: '05/11/2026',
    days: 1,
    status: 'Disetujui',
    reason: 'Keperluan keluarga',
  },
  {
    id: 'IZ-1008',
    employee: 'Javanie Jasmine',
    division: 'Administrasi',
    position: 'Karyawan',
    type: 'Cuti Tahunan',
    from: '14/12/2026',
    to: '16/12/2026',
    days: 3,
    status: 'Menunggu',
    reason: 'Keperluan keluarga',
  },
  // Dua data fiktif tambahan per bulan agar filter bulanan menampilkan beberapa baris.
  ...Array.from({ length: 24 }, (_, index) => {
    const month = Math.floor(index / 2) + 1;
    const day = index % 2 === 0 ? 8 : 20;
    const employeeSamples = [
      { employee: 'Dimas Kurniawan', division: 'Administrasi', position: 'Administrasi Perpustakaan' },
      { employee: 'Sinta Maharani', division: 'Administrasi', position: 'Administrasi Keuangan' },
      { employee: 'Fajar Ramadhan', division: 'Pengelola', position: 'Manajer Kepengasuhan' },
      { employee: 'Nadia Safitri', division: 'Pengelola', position: 'Sekretaris' },
      { employee: 'Javanie Jasmine', division: 'Administrasi', position: 'Karyawan' },
      { employee: 'Andi Pratama', division: 'Direksi', position: 'Direktur' },
    ];
    const employee = employeeSamples[index % employeeSamples.length];
    const days = index % 3 === 0 ? 2 : 1;
    const formatDate = (date: number) => `${String(date).padStart(2, '0')}/${String(month).padStart(2, '0')}/2026`;

    return {
      id: `IZ-${1100 + index}`,
      ...employee,
      type: index % 3 === 0 ? 'Cuti Tahunan' : 'Izin',
      from: formatDate(day),
      to: formatDate(day + days - 1),
      days,
      status: ['Disetujui', 'Menunggu', 'Ditolak'][index % 3],
      reason: ['Keperluan keluarga', 'Keperluan pribadi', 'Kesehatan'][index % 3],
    };
  }),
];
