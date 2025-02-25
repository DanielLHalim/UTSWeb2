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

function logout() {
  localStorage.removeItem("token");
  alert("Logout berhasil!");
  showLogin();
}

function addTask() {
  const token = localStorage.getItem("token"); 
  const title = document.getElementById("task-title").value;
  const category = document.getElementById("task-category").value;
  const deadline = document.getElementById("task-deadline").value;

  fetch("/tasks", {
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
      fetchTasks();
    })
    .catch(err => console.error("Gagal menambahkan tugas:", err));
}

function fetchTasks() {
  const token = localStorage.getItem("token");
  fetch("/tasks", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(response => response.json())
    .then(tasks => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);
    })
    .catch(err => console.error("Gagal mengambil tugas:", err));
}

function renderTasks(tasks) {
  const category = document.getElementById("filter").value;
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  if (category) {
    tasks = tasks.filter(task => task.category === category);
  }

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
let currentTaskId;

function editTask(taskId) {
  currentTaskId = taskId;
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const task = tasks.find(t => t.id == taskId);
  if (task) {
    document.getElementById("edit-title").value = task.title;
    document.getElementById("edit-category").value = task.category;
    document.getElementById("edit-deadline").value = task.deadline;
    document.getElementById("edit-status").value = task.status;
  }
  document.getElementById("editModal").classList.remove("hidden");
}

function updateTask() {
  const token = localStorage.getItem("token");
  const newTitle = document.getElementById("edit-title").value;
  const newCategory = document.getElementById("edit-category").value;
  const newDeadline = document.getElementById("edit-deadline").value;
  const newStatus = document.getElementById("edit-status").value;

  fetch(`/tasks/${currentTaskId}`, {  
    method: "PUT",                   
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      title: newTitle,
      category: newCategory,
      deadline: newDeadline,
      status: newStatus
    })
  })
    .then(response => response.json())
    .then(data => {
      alert("Tugas berhasil diupdate!");
      closeModal();
      fetchTasks(); 
    })
    .catch(err => console.error("Gagal memperbarui tugas:", err));
}

function closeModal() {
  document.getElementById("editModal").classList.add("hidden");
  document.getElementById("edit-title").value = "";
  document.getElementById("edit-category").value = "";
  document.getElementById("edit-deadline").value = "";
  document.getElementById("edit-status").value = "Belum Selesai";
}

function deleteTask(taskId) {
  const token = localStorage.getItem("token");
  if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
    fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Gagal menghapus tugas");
        }
        alert("Tugas berhasil dihapus!");
        fetchTasks(); 
      })
      .catch(err => console.error("Gagal menghapus tugas:", err));
  }
}

window.onload = function () {
  if (localStorage.getItem("token")) {
    showTaskApp();
    fetchTasks(); 
  } else {
    showRegister();
  }
};