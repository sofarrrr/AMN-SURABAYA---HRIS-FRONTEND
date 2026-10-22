export type HomeLink = [label: string, path: string];

type HomeConfig = {
  intro: string;
  heading: string[];
  description: string;
  headerLinks: HomeLink[];
  actionLinks: HomeLink[];
  highlightBrand?: boolean;
};

const managementLinks: HomeLink[] = [
  ['Data Karyawan', 'employees'],
  ['Absensi', 'attendance'],
  ['Perizinan', 'permits'],
];

const managementActions: HomeLink[] = [
  ['Karyawan', 'employees'],
  ['Absensi', 'attendance'],
  ['Perizinan', 'permits'],
];

const sharedHomeCopy = {
  intro: 'Nikmati pengalaman pengelolaan SDM yang lebih efisien',
  heading: ['Cepat,', 'Praktis, dan', 'Mudah', 'Digunakan.'],
  description: 'Optimalkan pengelolaan dengan HRIS AMN Surabaya untuk menciptakan proses kerja yang lebih efisien dan mudah digunakan.',
  highlightBrand: true,
};

export function getHomeConfig(role: string, name: string): HomeConfig {
  const configs: Record<string, Pick<HomeConfig, 'headerLinks' | 'actionLinks'>> = {
    Direktur: {
      headerLinks: [...managementLinks, ['User Manajemen', 'users']],
      actionLinks: managementActions,
    },
    Sekretaris: {
      headerLinks: managementLinks,
      actionLinks: managementActions,
    },
    Manajer: {
      headerLinks: managementLinks,
      actionLinks: managementActions,
    },
    Karyawan: {
      headerLinks: managementLinks,
      actionLinks: [
        ['Karyawan', 'employees'],
        ['Absensi', 'attendance'],
        ['Perizinan', 'permits'],
      ],
    },
  };

  const config = configs[role] || {
    intro: `Selamat datang, ${name}`,
    heading: ['Cepat,', 'praktis, dan', 'mudah digunakan.'],
    description: 'Akses layanan kepegawaian dalam HRIS AMN Surabaya.',
    headerLinks: [['Dashboard', 'dashboard']],
    actionLinks: [['Dashboard', 'dashboard']],
  };

  return { ...config, ...sharedHomeCopy };
}
