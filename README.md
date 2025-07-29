# FinApp Gokil! - Aplikasi Keuangan Sederhana (PWA)
Aplikasi ini dibuat dengan Vibe Coding

![FinApp Logo](./public/pwa-192x192.png)

FinApp Gokil! adalah aplikasi keuangan sederhana berbasis Progressive Web App (PWA) yang membantu Anda mengelola keuangan pribadi dengan mudah. Aplikasi ini dibangun menggunakan Nuxt 3, Pinia, dan TailwindCSS.

## Fitur Utama

- **Dashboard Keuangan**: Lihat ringkasan saldo, pemasukan, dan pengeluaran bulanan
- **Manajemen Dompet**: Kelola berbagai jenis dompet (rekening bank, dompet fisik, e-wallet)
- **Pencatatan Transaksi**: Catat pemasukan dan pengeluaran dengan kategori
- **Laporan Keuangan**: Lihat laporan keuangan dalam bentuk grafik
- **Ekspor/Impor Data**: Ekspor dan impor data dalam format JSON dan CSV
- **Progressive Web App**: Dapat diinstal di perangkat dan digunakan secara offline

## Teknologi

- **Frontend**: Vue.js 3, Nuxt 3
- **State Management**: Pinia
- **Styling**: TailwindCSS
- **Charts**: Chart.js, Vue-ChartJS
- **PWA**: Vite PWA Plugin (@vite-pwa/nuxt)
- **Utilities**: UUID, DayJS

## Instalasi

### Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- NPM atau Yarn

### Langkah Instalasi

1. Clone repositori ini

```bash
git clone https://github.com/fuadfaut/FinApp.git
cd finapp
```

2. Instal dependensi

```bash
npm install
# atau
yarn install
```

3. Jalankan server pengembangan

```bash
npm run dev
# atau
yarn dev
```

4. Buka browser dan akses `http://localhost:3000`

## Build untuk Produksi

```bash
npm run build
npm run start
# atau
yarn build
yarn start
```

## Fitur PWA

FinApp Gokil! adalah Progressive Web App (PWA) yang menawarkan pengalaman seperti aplikasi native:

- **Dapat Diinstal**: Tambahkan ke layar utama perangkat
- **Akses Offline**: Gunakan aplikasi tanpa koneksi internet
- **Pembaruan Otomatis**: Dapatkan fitur terbaru secara otomatis
- **Performa Cepat**: Pemuatan cepat dan responsif

## Struktur Aplikasi

```
├── assets/            # Aset statis (CSS, gambar)
├── components/        # Komponen Vue
├── pages/             # Halaman aplikasi
├── public/            # File publik (ikon PWA, robots.txt)
├── stores/            # Pinia stores
├── app.vue            # Komponen root aplikasi
├── nuxt.config.js     # Konfigurasi Nuxt
└── package.json       # Dependensi dan skrip
```

## Halaman Utama

- **Beranda** (`/`): Dashboard utama dengan ringkasan keuangan
- **Laporan** (`/laporan`): Grafik dan analisis keuangan
- **Ekspor/Impor** (`/ekspor-impor`): Pengelolaan data keuangan
- **Profil** (`/profil`): Pengaturan profil dan aplikasi

## Penyimpanan Data

FinApp menggunakan localStorage untuk menyimpan data pengguna secara lokal di perangkat. Data yang disimpan meliputi:

- Daftar dompet dan saldo
- Riwayat transaksi
- Kategori pemasukan dan pengeluaran
- Daftar belanja
- Riwayat ekspor/impor

## Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak

Jika Anda memiliki pertanyaan atau saran, silakan buka issue di repositori GitHub
