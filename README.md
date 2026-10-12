# 💬 CHUT

Aplikasi chat simpel buat ngobrol bareng temen. Santuy, cepet, tinggal gas. 🚀

🌐 **Coba langsung:** [CH-Chat](https://chut-chats.vercel.app/)

## 📲 Download Aplikasi

[![Download APK](https://img.shields.io/badge/⬇_Download-cchCHAT.apk-6c5ce7?style=for-the-badge&logo=android&logoColor=white)]([app%20ver/cchCHAT.apk](https://github.com/AZNJAWA/CHUT/blob/main/app%20ver/cchCHAT.apk)?raw=true)

> Habis download, izinin dulu **install dari sumber tak dikenal** di HP lu, abis itu install deh.

## ✨ Fitur

- 💬 Chat langsung sama temen (bisa reply, edit, hapus)
- ✓✓ Centang dibaca, biar tau udah di-read apa belum
- 😊 Emoji + 🖼️ stiker bikinan sendiri
- 👥 Kontak, cari temen, sama permintaan pertemanan (terima / tolak)
- 🟢 Status online temen
- 🔑 Lupa password? Reset lewat kode email

## 🛠️ Teknologi

Node.js + Express • Turso (libSQL) • Supabase Storage • JavaScript biasa • Vercel

## ▶️ Jalanin Sendiri
#*Gak Harus ya ini kalo mw buat dari database sendiri

```bash
npm install
node server.js
```

Terus bikin file `.env` isinya:

```env
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
JWT_SECRET=...
EMAIL_USER=...
EMAIL_APP_PASSWORD=...
```

Jangan lupa setting Supabase juga (bikin bucket `stc` buat stiker). Buka `http://localhost:3000` dan chat deh. 🎉

## 📁 Isi Folder

| Folder / File | Fungsinya |
| --- | --- |
| `frontend/` | Tampilan web (HTML, CSS, JS) |
| `server.js` | Backend-nya |
| `app ver/` | Tempat file APK |

---

Selamat Pagi **AZNJAWA** ✌️ — kalo nemu bug, kabarin aja!
