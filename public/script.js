// public/script.js

// Fungsi untuk mengambil tugas berdasarkan kategori tanpa reload halaman
function filterTasks() {
    // Ambil nilai kategori dari dropdown
    const category = document.getElementById("filter").value;
    
    // Panggil API GET /api/tasks dengan query parameter kategori (jika ada)
    fetch(`/api/tasks?category=${category}`)
      .then(response => response.json()) // Ubah respons menjadi format JSON
      .then(tasks => {
        const list = document.getElementById("task-list");
        list.innerHTML = ""; // Kosongkan daftar tugas sebelum menampilkan data baru 
        
        // Loop melalui setiap tugas dan buat elemen <li> untuk menampilkannya
        tasks.forEach(task => {
          const item = document.createElement("li");
          // Tampilkan judul, kategori, deadline, dan status tugas
          item.textContent = `${task.title} - ${task.category} - Deadline: ${task.deadline} - Status: ${task.status}`;
          list.appendChild(item); // Tambahkan item ke dalam daftar
        });
      })
      .catch(err => console.error("Gagal mengambil tugas:", err));
  }
  // Fungsi untuk menambahkan tugas baru ke database
function addTask() {
    fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzQwMjQ0ODQ5LCJleHAiOjE3NDAyNDg0NDl9.G6w74MWVcrzPhWYKeenwTrpvnYHsmtgsqVufEZuj5WY"
        },
        body: JSON.stringify({
            "title": document.getElementById("title").value,
            "category": document.getElementById("category").value,
            "deadline": document.getElementById("deadline").value,
            "status": "Belum Selesai"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Tugas berhasil ditambahkan:", data);
        alert("Tugas berhasil ditambahkan!");
        filterTasks(); // Perbarui daftar tugas setelah menambahkan
    })
    .catch(error => console.error("Gagal menambahkan tugas:", error));
}
