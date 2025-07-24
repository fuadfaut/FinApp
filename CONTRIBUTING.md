# Panduan Kontribusi untuk FinApp Gokil!

Terima kasih atas minat Anda untuk berkontribusi pada FinApp Gokil! Kami sangat menghargai bantuan dari komunitas untuk membuat aplikasi ini lebih baik.

## Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue baru dengan informasi berikut:

1. Judul yang jelas dan deskriptif
2. Langkah-langkah untuk mereproduksi bug
3. Perilaku yang diharapkan
4. Perilaku aktual yang terjadi
5. Screenshot (jika memungkinkan)
6. Informasi perangkat dan browser (jika relevan)

### Mengusulkan Fitur Baru

Jika Anda memiliki ide untuk fitur baru, silakan buat issue dengan label "enhancement" dan sertakan:

1. Deskripsi fitur yang diusulkan
2. Alasan mengapa fitur ini berguna
3. Detail implementasi (jika Anda memiliki ide)

### Mengirimkan Pull Request

1. Fork repositori
2. Clone fork Anda ke mesin lokal
3. Buat branch baru untuk fitur atau perbaikan Anda
4. Buat perubahan yang diperlukan
5. Pastikan kode Anda mengikuti standar gaya yang ada
6. Commit perubahan Anda dengan pesan commit yang deskriptif
7. Push ke branch Anda
8. Buat Pull Request ke branch `main` repositori utama

## Standar Kode

### Gaya Kode

- Gunakan 2 spasi untuk indentasi
- Gunakan kebab-case untuk nama file Vue (`my-component.vue`)
- Gunakan PascalCase untuk nama komponen dalam template (`<MyComponent />`)
- Gunakan camelCase untuk nama variabel dan fungsi

### Struktur Komponen Vue

Ikuti urutan berikut dalam file komponen Vue:

```vue
<template>
  <!-- Template HTML di sini -->
</template>

<script setup>
  // Script di sini
</script>

<style>
  /* CSS di sini */
</style>
```

### Commit Messages

Gunakan format berikut untuk pesan commit:

```
tipe(scope): deskripsi singkat

Deskripsi panjang (opsional)
```

Tipe yang dapat digunakan:
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Perubahan yang tidak memengaruhi arti kode (spasi, format, dll)
- `refactor`: Perubahan kode yang tidak memperbaiki bug atau menambahkan fitur
- `perf`: Perubahan kode yang meningkatkan performa
- `test`: Menambahkan atau memperbaiki pengujian
- `chore`: Perubahan pada proses build atau alat bantu

## Proses Pengembangan

1. Pilih issue yang ingin Anda kerjakan atau buat issue baru
2. Diskusikan pendekatan Anda di issue tersebut
3. Mulai bekerja pada solusi setelah pendekatan Anda disetujui
4. Kirimkan Pull Request
5. Tinjau dan perbaiki kode berdasarkan feedback

## Sumber Daya

- [Dokumentasi Vue.js](https://vuejs.org/)
- [Dokumentasi Nuxt.js](https://nuxt.com/)
- [Dokumentasi TailwindCSS](https://tailwindcss.com/)
- [Dokumentasi Pinia](https://pinia.vuejs.org/)

Terima kasih atas kontribusi Anda!