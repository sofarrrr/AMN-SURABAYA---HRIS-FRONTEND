# AGENTS.md: HRIS AMN Surabaya

## 1. Konteks Proyek

Aplikasi HRIS (*Human Resource Information System*) untuk Asrama Mahasiswa Nusantara (AMN) Surabaya. Proyek ini adalah implementasi frontend dari desain Figma yang telah disetujui.

- **Status:** prototipe frontend berbasis data mock. Belum ada integrasi backend atau API.
- **Peran pengguna:** Direktur, Sekretaris, Manajer, Karyawan.
- **Fitur inti:** Absensi, Cuti dan Izin, Data Karyawan, User Management, Autentikasi (Login), Profil.
- **Desain:** file Figma `HRIS-AMN-Surabaya`. Akses melalui file/proyek Figma yang tersedia dan koneksi MCP Figma; jangan mengarang URL jika tidak tersedia.
- **Tujuan:** antarmuka yang setia pada Figma, konsisten, responsif, dan fungsional, dengan kode rapi tanpa merusak fitur yang sudah berjalan.

## 2. Tech Stack dan Perintah

- React 19, TypeScript, Vite, Tailwind CSS 4 (lewat `@tailwindcss/vite`), React Router, Oxlint.
- Versi persis ada di `package.json`. Jangan upgrade atau mengganti teknologi tanpa persetujuan.
- State: React state dan hooks bawaan, ditambah Context yang sudah ada (bagian 4). Jangan menambah library state management atau data fetching tanpa persetujuan.
- Ikon: aset resmi Figma (bagian 6). Tidak ada library ikon yang disetujui.

| Tujuan | Perintah |
|---|---|
| Instal dependensi | `npm install` |
| Development server | `npm run dev` |
| Lint | `npm run lint` (`oxlint src vite.config.js`) |
| Cek tipe | `npm run typecheck` (`tsc --noEmit`) |
| Build produksi | `npm run build` |
| Preview build | `npm run preview` |
| Test | Belum ada. Jangan menambah test runner tanpa persetujuan |

Laporkan hasil setiap pemeriksaan secara terpisah. Build yang berhasil bukan bukti test atau lint berhasil. Jika suatu pemeriksaan tidak tersedia, katakan belum dapat dijalankan. Jangan membuat script baru hanya agar pemeriksaan tampak berhasil.

## 3. Sumber Acuan

Jika ada konflik, ikuti urutan ini:

1. **Figma:** tampilan visual, tata letak, ukuran, tipografi, warna, jarak, komponen, aset.
2. **PRD dan kebutuhan yang disetujui:** fitur, peran, aturan bisnis, alur kerja.
3. **Arsitektur dan implementasi yang ada:** struktur folder, pola kode, fungsi yang sudah berjalan.
4. **File ini.**

Jangan mengarang kebutuhan bisnis. Desain visual tidak selalu menjelaskan perilaku bisnis. Jika kebutuhan tidak jelas, bertentangan, atau perubahan memengaruhi aturan bisnis, tanyakan sebelum mengimplementasikan.

## 4. Arsitektur, Data, dan Routing

**Struktur:**
- `src/main.tsx`: entry point dan provider.
- `src/router.tsx`: konfigurasi routing.
- `src/components/`: komponen UI, Sidebar, `RouteGuards`.
- `src/layouts/`: `TataLetakAplikasi`, `TataLetakAutentikasi`.
- `src/pages/`: Beranda, Dashboard, Login, Absensi, Data Karyawan, Manajemen Pengguna, Perizinan, Profil.
- `src/data/`: `AuthContext`, `DataContext`, `mockData`.
- `src/hooks/`: `useAuth`, `useData`.
- `src/assets/`, `src/styles/tailwind.css`, `src/utils/` (mis. `downloadCsv.ts`).

Struktur bisa berubah. Periksa kondisi terkini sebelum mengedit, dan periksa apakah ada `AGENTS.md` tambahan di direktori terkait.

**Data dan autentikasi:**
- Sesi dan login/logout dikelola `AuthContext`. Data pengguna, karyawan, absensi, dan perizinan dikelola `DataContext` dengan sumber awal `mockData`.
- Mekanisme penyimpanan yang telah diperiksa: sesi pengguna memakai `sessionStorage` dengan key `amn-user`; daftar pengguna memakai `localStorage` dengan key `amn-users`. Sebagian perubahan data karyawan, absensi, dan perizinan hanya memperbarui state React dan belum terbukti persisten setelah aplikasi dimuat ulang. Periksa implementasi terkini sebelum mengubahnya.
- Jangan menganggap semua operasi CRUD persisten. Periksa tiap operasi sebelum mengubahnya.
- Jaga kompatibilitas data pengguna dan karyawan. Periksa dampak perubahan ID, nama, email, dan role pada data terkait.
- Pertahankan format dan key penyimpanan yang ada kecuali migrasi sudah direncanakan. Jangan menghapus data yang sudah tersimpan.
- Jangan menyimpan password di penyimpanan browser. Pemeriksaan role di frontend bukan pengamanan produksi, dan autentikasi ini tidak boleh diklaim aman untuk produksi tanpa backend.
- Sebelum mengubah autentikasi, periksa pemulihan sesi, logout, perubahan role, dan status akun.

**Routing dan hak akses:**
- Sebelum mengubah navigasi, periksa `router.tsx`, `RouteGuards.tsx`, dan `TataLetakAplikasi.tsx`.
- Halaman yang butuh autentikasi tidak boleh tampil tanpa sesi yang sesuai. Akses User Management dan persetujuan perizinan mengikuti kebutuhan bisnis yang disetujui.
- Masuk ke sebuah route tidak berarti berhak atas seluruh data di halaman itu.
- Jangan membuat route duplikat atau mengganti seluruh router untuk memperbaiki satu halaman.

**Aturan umum:**
- Jangan membangun ulang aplikasi dari nol, dan jangan mengganti router, context, layout, atau komponen yang ada tanpa alasan teknis yang jelas.
- Jangan mengganti implementasi yang berfungsi dengan data tiruan kecuali tugas meminta mockup.
- Jangan menghapus aset sebelum memastikan tidak dipakai. Jangan mengubah file yang tidak berkaitan dengan tugas.

## 5. Desain dan Komponen

**Kesetiaan pada Figma:**
- Periksa frame dan konteks komponennya, bukan hanya nama frame.
- Samakan tata letak, hierarki, dimensi, jarak, tipografi, warna, border, radius, bayangan, dan kondisi interaksi (hover, focus, active, disabled, loading).
- Jangan mendesain ulang berdasarkan preferensi pribadi, memakai templat dashboard generik, atau mengubah ukuran dan skala tanpa acuan.
- Jika detail tidak tersedia, pakai pola terdekat dari komponen yang ada dan catat asumsinya.
- Jika desain menimbulkan masalah aksesibilitas, jangan mengubahnya diam-diam. Dokumentasikan masalahnya dan minta arahan sebelum perubahan yang signifikan.

**Design tokens dan Tailwind:**
- Ambil warna, tipografi, jarak, radius, dan bayangan dari variabel atau style Figma. Pusatkan token lewat mekanisme konfigurasi Tailwind 4 yang sudah dipakai proyek.
- Utamakan utility class. Hindari CSS kustom dan nilai arbitrer (`w-[...]`, `mt-[...]`) jika utility atau token yang sesuai tersedia. Nilai arbitrer boleh dipakai bila perlu untuk mencocokkan Figma.
- Jangan menambah framework styling lain atau mencampur pola konfigurasi antarversi Tailwind.

**Komponen:**
- Periksa komponen yang ada sebelum membuat yang baru. Jadikan komponen bersama untuk pola yang benar-benar berulang (layout, sidebar, header, tombol, form, card, tabel, pagination, modal, badge status, loading, error, data kosong).
- Jangan menggandakan UI yang sama di banyak halaman, dan jangan membuat abstraksi untuk elemen yang hanya dipakai sekali.

## 6. Aset dan Ikon

Aset resmi Figma adalah sumber utama ikon, logo, dan ilustrasi.

1. Cari di frame, komponen, dan library Figma.
2. Jika ada, ekspor aset aslinya ke direktori aset proyek dengan proporsi dan kualitas yang sesuai.
3. Jika tidak ada, tanyakan sumber ikon yang boleh dipakai sebelum membuat atau menambahkan pengganti.

**Dilarang:**
- Membuat ikon atau SVG sendiri jika aset resmi tersedia.
- Memakai emoji, karakter Unicode, atau simbol teks sebagai ikon.
- Memakai kumpulan ikon acak yang tidak sesuai bahasa visual Figma.
- Mengganti ikon resmi dengan ikon lain hanya karena lebih mudah.
- Membuat, meniru, atau mengganti logo AMN dengan teks.
- Mengubah warna, proporsi, atau bentuk aset resmi tanpa acuan desain.

Jika akses ekspor Figma tidak tersedia, laporkan keterbatasannya. Jangan mengarang aset atau mengklaim sudah mengunduh ikon yang belum diunduh.

## 7. Fungsionalitas

- Navigasi membuka halaman yang benar. Tombol menjalankan aksi yang dijanjikan. Form memvalidasi input dan menampilkan error yang jelas.
- Pencarian, filter, dan pagination memengaruhi data. Modal dan dropdown dapat dibuka dan ditutup.
- Login mengikuti mekanisme autentikasi yang ada. Profil hanya menampilkan atau mengubah data sesuai kemampuan sistem yang sebenarnya.
- Tangani kondisi loading, kosong, error, dan sukses sesuai desain.
- Jangan membuat elemen yang tampak bisa diklik tetapi tidak melakukan apa pun. Tampilan statis bukan fitur yang selesai.
- Tandai fungsi yang masih memakai mock. Jangan membuat aturan bisnis, hasil transaksi, atau status sukses palsu yang bisa disangka data nyata.

## 8. Keamanan dan Data

- Jangan mengekspos secret, API key, kredensial, token sensitif, atau data karyawan rahasia. Jangan mencatat data HR sensitif ke console atau log.
- Validasi input pengguna. Validasi otorisasi harus diterapkan di backend ketika tersedia.
- Gunakan data contoh yang jelas fiktif, dan jangan menyajikan data mock sebagai data karyawan AMN yang sebenarnya.
- Jangan menonaktifkan mekanisme keamanan untuk mempermudah pengembangan.

## 9. Responsif dan Aksesibilitas

- Ikuti perilaku responsif di Figma, gunakan breakpoint Tailwind, dan hindari overflow horizontal yang tidak disengaja.
- Gunakan elemen HTML semantik, hubungkan label dengan input, dan beri nama yang dapat diakses pada kontrol interaktif.
- Pastikan fokus keyboard terlihat, navigasi bisa dipakai dengan keyboard, dan kontras cukup.
- Jangan menyampaikan status hanya lewat warna.

## 10. Kualitas Kode

- Ikuti konvensi penamaan, import, dan format yang berlaku, termasuk gaya penamaan yang sudah ada (mis. `TataLetakAplikasi`). Jangan membuat file dengan gaya penamaan berbeda.
- Gunakan komponen fungsional dengan props yang jelas, `key` yang stabil pada daftar, dan tipe TypeScript yang tepat. Hindari `any` jika tipe yang lebih tepat bisa didefinisikan.
- Pisahkan tampilan, logika bisnis, dan akses data bila perlu. Hindari duplikasi logika dan state yang tidak perlu.
- Hapus import dan kode mati akibat perubahan.
- Jangan menambah dependensi tanpa persetujuan.
- Jangan menonaktifkan lint atau pemeriksaan tipe hanya untuk menghilangkan error, dan jangan mengubah konfigurasi proyek secara luas untuk masalah lokal yang sederhana.

## 11. Alur Kerja Agent

1. Periksa `AGENTS.md`, struktur proyek, `package.json`, lockfile, dan kode yang relevan.
2. Periksa desain Figma terkait: frame, komponen, variabel, aset, dan kondisi interaksi.
3. Identifikasi komponen dan fungsi yang bisa dipakai ulang.
4. Telusuri penyebab masalah sebelum mengubah kode.
5. Tentukan perubahan terkecil yang menyelesaikan kebutuhan, lalu implementasikan sesuai arsitektur dan konvensi proyek.
6. Jalankan lint, cek tipe, dan build. Jalankan aplikasi dan bandingkan dengan Figma jika lingkungan mendukung.
7. Perbaiki selisih visual terbesar dan masalah fungsional terlebih dahulu.
8. Laporkan file yang diubah, hasil verifikasi, asumsi, dan pekerjaan yang belum selesai.

Prinsip perilaku:
- Utamakan perubahan kecil yang mudah ditinjau.
- Minta persetujuan sebelum perubahan besar, destruktif, atau tidak berkaitan.
- Jelaskan keputusan arsitektur yang signifikan.
- Jangan pernah mengarang hasil pengujian atau mengklaim build, audit visual, atau kesesuaian pixel-perfect yang belum diverifikasi.

## 12. Checklist Penyelesaian

Tugas selesai setelah poin yang relevan terpenuhi. Laporkan dengan jujur poin yang belum.

- [ ] Kebutuhan dan frame Figma yang relevan sudah diperiksa.
- [ ] Komponen dan aset yang ada sudah dipakai ulang, tanpa pelanggaran aturan bagian 6.
- [ ] Implementasi sesuai desain, dan elemen interaktif berfungsi.
- [ ] Kondisi loading, kosong, dan error ditangani.
- [ ] Responsif, aksesibilitas, routing, dan hak akses yang terdampak sudah diperiksa.
- [ ] Lint, cek tipe, dan build sudah dijalankan, dan hasilnya dilaporkan apa adanya.
- [ ] Perbedaan visual dan keterbatasan yang tersisa sudah didokumentasikan.
- [ ] Tidak ada fungsi lain yang rusak.

**Prinsip utama:** bangun sesuai desain dan kebutuhan yang disetujui, gunakan kembali apa yang sudah ada, dan verifikasi sebelum menyatakan selesai.
