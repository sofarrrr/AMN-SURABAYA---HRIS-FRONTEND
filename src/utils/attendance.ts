const attendanceMonths = {
  Januari: 0,
  Februari: 1,
  Maret: 2,
  April: 3,
  Mei: 4,
  Juni: 5,
  Juli: 6,
  Agustus: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Desember: 11,
};

export function parseAttendanceDate(value: string) {
  const [day, month, year] = value.split(' ');
  const monthIndex = attendanceMonths[month as keyof typeof attendanceMonths];

  if (!day || monthIndex === undefined || !year) return null;

  return new Date(Number(year), monthIndex, Number(day));
}

export function formatAttendanceDate(value: string) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

export const getAttendancePrintDate = () =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
