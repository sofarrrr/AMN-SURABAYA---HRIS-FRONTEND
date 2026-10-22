import { createContext, useState } from 'react';
export const DataContext = createContext<any>(null);

import {
  attendance as initialAttendance,
  employees as initialEmployees,
  permits as initialPermits,
  users as initialUsers,
} from './mockData';

/**
 * Context utama untuk menyimpan dan mengelola data aplikasi.
 *
 * Data yang dikelola meliputi:
 * - Data pegawai
 * - Data absensi
 * - Data perizinan
 * - Data pengguna sistem
 */
const readSavedUsers = () => {
  try {
    const savedUsers = JSON.parse(localStorage.getItem('amn-users'));
    if (!Array.isArray(savedUsers)) return initialUsers;

    const savedById = new Map(savedUsers.map((user) => [user.id, user]));
    const usedEmails = new Set();
    const baselineEmails = new Set(
      initialUsers.map((user) => String(user.email).toLocaleLowerCase('id-ID'))
    );

    return initialUsers.map((initialUser) => {
      const savedUser = savedById.get(initialUser.id);
      const mergedUser = savedUser
        ? { ...initialUser, ...savedUser }
        : initialUser;
      const normalizedEmail = String(mergedUser.email || '').toLocaleLowerCase('id-ID');
      const baselineEmail = String(initialUser.email).toLocaleLowerCase('id-ID');
      const emailBelongsToAnotherAccount = normalizedEmail !== baselineEmail
        && baselineEmails.has(normalizedEmail);

      if (normalizedEmail && !emailBelongsToAnotherAccount && !usedEmails.has(normalizedEmail)) {
        usedEmails.add(normalizedEmail);
        return mergedUser;
      }

      usedEmails.add(baselineEmail);
      return { ...mergedUser, email: initialUser.email };
    });
  } catch {
    return initialUsers;
  }
};

/**
 * Provider untuk menyediakan data dan fungsi pengelolaan data
 * kepada seluruh komponen yang berada di dalam DataProvider.
 *
 * Data saat ini masih menggunakan mockData sebagai sumber awal.
 */
export function DataProvider({ children }) {
  // Menyimpan data pengguna yang memiliki akses ke sistem.
  const [users, setUsers] = useState(readSavedUsers);

  const resolveEmployeeName = (name) => {
    const originalUser = initialUsers.find((user) => user.name === name);
    return users.find((user) => user.id === originalUser?.id)?.name || name;
  };

  // Menyimpan data pegawai.
  const [employees, setEmployees] = useState(() =>
    initialEmployees.map((employee) => {
      const savedUser = users.find((user) => user.id === employee.id);
      return savedUser
        ? { ...employee, ...savedUser }
        : employee;
    })
  );

  // Menyimpan data absensi pegawai.
  const [attendance, setAttendance] = useState(() =>
    initialAttendance.map((item) => ({
      ...item,
      employee: resolveEmployeeName(item.employee),
    }))
  );

  // Menyimpan data pengajuan perizinan.
  const [permits, setPermits] = useState(() =>
    initialPermits.map((item) => ({
      ...item,
      employee: resolveEmployeeName(item.employee),
    }))
  );
  const commitUsers = (update) => {
    setUsers((current) => {
      const next = update(current);
      localStorage.setItem('amn-users', JSON.stringify(next));
      return next;
    });
  };

  /**
   * Menambahkan data pegawai baru.
   *
   * Sistem secara otomatis membuat:
   * - ID pegawai
   * - Nomor pegawai
   * - Status awal "Aktif"
   * - Data keluarga kosong
   */
  const addEmployee = (employee) => {
    setEmployees((current) => [
      {
        ...employee,
        id: `u${Date.now()}`,
        employeeNo: `AMN-${Date.now().toString().slice(-6)}`,
        status: 'Aktif',
        family: [],
      },
      ...current,
    ]);
  };

  /**
   * Menambahkan data absensi baru.
   *
   * ID absensi dibuat secara otomatis berdasarkan waktu saat data
   * ditambahkan.
   */
  const addAttendance = (attendanceData) => {
    setAttendance((current) => [
      {
        ...attendanceData,
        id: `A-${Date.now()}`,
      },
      ...current,
    ]);
  };

  /**
   * Memperbarui data absensi berdasarkan ID.
   *
   * Parameter:
   * - id: ID data absensi yang akan diperbarui
   * - changes: perubahan data yang ingin diterapkan
   */
  const updateAttendance = (id, changes) => {
    setAttendance((current) =>
      current.map((attendanceItem) =>
        attendanceItem.id === id
          ? { ...attendanceItem, ...changes }
          : attendanceItem
      )
    );
  };

  /** Menghapus data absensi berdasarkan ID. */
  const removeAttendance = (id) => {
    setAttendance((current) =>
      current.filter((attendanceItem) => attendanceItem.id !== id)
    );
  };

  /**
   * Menambahkan pengajuan perizinan baru.
   *
   * Status awal setiap pengajuan secara otomatis diatur menjadi
   * "Menunggu".
   */
  const addPermit = (permit) => {
    setPermits((current) => [
      {
        ...permit,
        id: `IZ-${Date.now().toString().slice(-4)}`,
        status: 'Menunggu',
      },
      ...current,
    ]);
  };

  /**
   * Memperbarui data perizinan berdasarkan ID.
   *
   * Fungsi ini dapat digunakan untuk mengubah informasi pengajuan
   * tanpa mengganti seluruh data perizinan.
   */
  const updatePermit = (id, changes) => {
    setPermits((current) =>
      current.map((permitItem) =>
        permitItem.id === id
          ? { ...permitItem, ...changes }
          : permitItem
      )
    );
  };

  /** Menghapus pengajuan perizinan dari data mock aktif. */
  const removePermit = (id) => {
    setPermits((current) => current.filter((permitItem) => permitItem.id !== id));
  };

  /**
   * Mengubah status pengajuan perizinan.
   *
   * Digunakan untuk proses persetujuan atau penolakan pengajuan
   * perizinan oleh pihak yang memiliki hak akses.
   */
  const decidePermit = (id, status) => {
    setPermits((current) =>
      current.map((permitItem) =>
        permitItem.id === id
          ? { ...permitItem, status }
          : permitItem
      )
    );
  };

  /**
   * Menambahkan pengguna baru ke dalam sistem.
   *
   * ID pengguna dibuat secara otomatis.
   */
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: `u${Date.now()}`,
    };
    commitUsers((current) => [
      {
        ...newUser,
      },
      ...current,
    ]);
  };

  /**
   * Memperbarui data pengguna berdasarkan ID.
   *
   * Dapat digunakan untuk mengubah informasi pengguna,
   * termasuk nama, email, role, atau data lainnya.
   */
  const updateUser = (id, changes) => {
    const currentUser = users.find((user) => user.id === id);

    commitUsers((current) =>
      current.map((userItem) =>
        userItem.id === id
          ? { ...userItem, ...changes }
          : userItem
      )
    );

    setEmployees((current) =>
      current.map((employeeItem) =>
        employeeItem.id === id
          ? { ...employeeItem, ...changes }
          : employeeItem
      )
    );

    if (currentUser && changes.name && currentUser.name !== changes.name) {
      setAttendance((current) =>
        current.map((item) =>
          item.employee === currentUser.name
            ? { ...item, employee: changes.name }
            : item
        )
      );
      setPermits((current) =>
        current.map((item) =>
          item.employee === currentUser.name
            ? { ...item, employee: changes.name }
            : item
        )
      );
    }
  };

  /**
   * Menghapus pengguna berdasarkan ID.
   */
  const removeUser = (id) => {
    commitUsers((current) =>
      current.filter((userItem) => userItem.id !== id)
    );
  };

  /**
   * Memperbarui data pegawai berdasarkan ID.
   *
   * Perubahan hanya diterapkan pada pegawai yang memiliki
   * ID yang sesuai.
   */
  const updateEmployee = (id, changes) => {
    setEmployees((current) =>
      current.map((employeeItem) =>
        employeeItem.id === id
          ? { ...employeeItem, ...changes }
          : employeeItem
      )
    );
  };

  /** Menghapus data karyawan berdasarkan ID. */
  const removeEmployee = (id) => {
    setEmployees((current) =>
      current.filter((employeeItem) => employeeItem.id !== id)
    );
  };

  /**
   * Menyediakan seluruh data dan fungsi pengelolaan data
   * kepada komponen yang menggunakan DataContext.
   */
  return (
    <DataContext.Provider
      value={{
        employees,
        attendance,
        permits,
        users,
        addEmployee,
        addAttendance,
        updateAttendance,
        removeAttendance,
        addPermit,
        updatePermit,
        decidePermit,
        removePermit,
        addUser,
        updateUser,
        removeUser,
        updateEmployee,
        removeEmployee,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook untuk mengakses data dan fungsi yang tersedia
 * melalui DataContext.
 */
