Link Github : https://github.com/DanielLHalim/UTSWeb2.git

Cara mengatur database

1. Install mysql2 pada terminal di file proyek, dengan npm install mysql2
2. Membuat database dari localhost/phpMyAdmin dari browser

- Database diberi nama "utsweb”
- Setelah database berhasil di create, lanjut ke pembuatan tabel di SQL

3. Membuat Tabel

- Tabel user : berisi id, username, password
- Table tasks : berisi id, id_user, title, category, deadline, status
  Untuk category ada 3 pilihan yaitu Kuliah, Organisasi, dan Pribadi
  Untuk status ada pilihan Selesai dan Belum Selesai
- Menghubungkan database ke proyek :
  Pertama, pada vs code file proyek, buat file .env dan deklarasikan koneksi database :
  PORT=3000  
  MYSQL_HOST=localhost  
  MYSQL_USER=root  
  MYSQL_PASSWORD=  
  MYSQL_DATABASE=utsweb
  JWT_SECRET=mysecretkey  
  Kedua, koneksikan database pada file-file lain yang butuh deklarasi database, seperti db.js dan model dalam pembuatan user
  Ketiga, tes koneksi dengan POSTMAN (GET, POST, PUT, DELETE) : login, register, logout, post task, update task, delete task
  Cara menjalankan proyek secara lokal

1. Buka terminal pada proyek, lalu ketik npm start
2. Jika muncul pesan "Server running di http://localhost:3000", berarti server berjalan tanpa error dan berhasil
3. Buka http://localhost:3000 di browser
4. Frontend (Website yang sudah berisi UI) sudah bisa digunakan dan terhubung dengan backend
   Fitur utama yang diterapkan
   Fitur semua telah menggunakan AJAX, sehingga tidak perlu reload halaman Serta tampilan frontend telah terhubung pada fungsi-fungsi yang dibangun di backend.
5. Register dan Login

- Jika pengguna belum punya akun, mereka harus register terlebih dahulu.
- Pengguna yang sudah terdaftar bisa langsung login.
- Login menggunakan JWT untuk autentikasi user
- Jika user yang belum terdaftar mencoba login, proses akan gagal.
- Password di database sudah diamankan dengan bcrypt hashing (mengubah password menjadi string pada database)

2. Fitur Tambah Tugas :

- User bisa menambahkan tugas dengan judul, kategori, dan deadline.
- Setelah ditambahkan, tugas akan muncul dalam daftar dengan status "Belum Selesai".

3. Edit Tugas

- User bisa mengedit judul, kategori, dan deadline tugas.
- Bisa juga menandai tugas sebagai "Selesai" dengan klik checkbox.
- Update terjadi setelah tombol "Simpan" ditekan.

4. Hapus Tugas (Delete Task)

- User bisa menghapus tugas dari daftar dengan mudah.

5. Filter Berdasarkan Kategori

- Tugas bisa difilter berdasarkan Kuliah, Organisasi, atau Pribadi.

6. Websocket (Notifikasi Real-Tme)

- Akan ada notifikasi saat terhubung ke server.
