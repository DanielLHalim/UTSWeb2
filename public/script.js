// Menampilkan halaman register, login, atau task
function showRegister() {
  document.getElementById("register-container").classList.remove("hidden");
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("task-container").classList.add("hidden");
}

function showLogin() {
  document.getElementById("register-container").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
  document.getElementById("task-container").classList.add("hidden");
}

function showTaskApp() {
  document.getElementById("register-container").classList.add("hidden");
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("task-container").classList.remove("hidden");
  filterTasks();
}

// Register User
function registerUser() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  
  fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Registrasi berhasil!");
        showTaskApp();
      } else {
        alert("Maaf, Registrasi gagal! Silakan Coba Lagi. " + (data.message || ""));
      }
    })
    .catch(err => {
      console.error("Error saat registrasi:", err);
      alert("Registrasi gagal!");
    });
}

// Login User
function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const user = JSON.parse(localStorage.getItem("user"));

  fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Data login:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");
        showTaskApp();
      } else {
        alert("Maaf Login gagal! Mungkin ada kesalahan, silakan cek kembali. " + (data.message || ""));
      }
    })
    .catch(err => {
      console.error("Error saat login:", err);
      alert("Login gagal!");
    });
}

// Logout
function logout() {
  localStorage.removeItem("token");
  alert("Logout berhasil!");
  showLogin();
}

// Tambah tugas
function addTask() {
  const title = document.getElementById("task-title").value;
  const category = document.getElementById("task-category").value;
  const deadline = document.getElementById("task-deadline").value;

  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      title,
      category,
      deadline,
      status: "Belum Selesai"
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Tugas berhasil ditambahkan:", data);
      alert("Tugas berhasil ditambahkan!");
      filterTasks();
    })
    .catch(err => console.error("Gagal menambahkan tugas:", err));
}
// Filter tugas
function filterTasks() {
  const category = document.getElementById("filter").value;
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  if (category) {
    tasks = tasks.filter(task => task.category === category);
  }

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  tasks.forEach(task => {
    taskList.innerHTML += `
      <tr>
        <td>${task.title}</td>
        <td>${task.category}</td>
        <td>${task.deadline}</td>
        <td>${task.status}</td>
        <td>
          <button onclick="editTask('${task.id}')">
          <i class="fa-solid fa-pen-to-square" style="color:rgb(254, 189, 98);"></i>
          </button>
          <button onclick="deleteTask('${task.id}')">
          <i class="fa-solid fa-trash" style="color: #fa3e00;"></i>
          </button>
        </td>
      </tr>
    `;
  });
}
function editTask(taskId) {
  currentTaskId = taskId;
  document.getElementById("editModal").style.display = "block";
}

document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const newTitle = document.getElementById("newTitle").value;
  const newCategory = document.getElementById("newCategory").value;
  const newDeadline = document.getElementById("newDeadline").value;
  const newStatus = document.getElementById("newStatus").checked ? "Selesai" : "Belum Selesai";

  fetch("/tasks", {  // Ubah "/" menjadi "/tasks"
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      title,
      category,
      deadline,
      status: "Belum Selesai"
    })
  })
  
    .then(response => response.json())
    .then(data => {
      alert("Tugas berhasil diupdate!");
      closeModal();
      filterTasks();
    })
    .catch(err => console.error("Gagal memperbarui tugas:", err));
});

function closeModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editForm").reset();
}


function deleteTask(taskId) {
  const token = localStorage.getItem("token");
  if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
    fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    })
      .then(() => {
        alert("Tugas berhasil dihapus!");
        filterTasks();
      })
      .catch(err => console.error("Gagal menghapus tugas:", err));
  }
}

window.onload = function () {
  if (localStorage.getItem("token")) {
    showTaskApp();
  } else {
    showRegister();
  }
};