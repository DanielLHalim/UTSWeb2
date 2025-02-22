// controllers/taskController.js

const Task = require("../models/taskModel"); // Import model task untuk akses database

const taskController = {
    // Controller untuk membuat tugas baru
    createTask: async (req, res) => {
        const { title, category, deadline, status } = req.body; // Ambil data tugas dari request body
        try {
            // Simpan tugas baru ke database
            await Task.create(title, category, deadline, status);
            res.status(201).json({ message: "Tugas berhasil ditambahkan" });
        } catch (err) {
            res.status(500).json({ message: "Gagal menambahkan tugas", error: err.message });
        }
    },

    // Controller untuk mengambil semua tugas, dengan opsi filter berdasarkan kategori
    getTasks: async (req, res) => {
        const { category } = req.query; // Ambil query parameter kategori jika ada
        try {
            let tasks = await Task.findAll(); // Ambil semua tugas dari database
            // Jika filter kategori diterapkan, lakukan penyaringan
            if (category) {
                tasks = tasks.filter(task => task.category === category);
            }
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: "Gagal mengambil data", error: err.message });
        }
    },

    // Controller untuk mengupdate tugas berdasarkan ID
    updateTask: async (req, res) => {
        const { id } = req.params; // Ambil ID tugas dari parameter URL
        const { title, category, deadline, status } = req.body; // Ambil data update dari request body
        try {
            const [result] = await Task.update(id, title, category, deadline, status);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Tugas tidak ditemukan" });
            }
            res.json({ message: "Tugas berhasil diperbarui" });
        } catch (err) {
            res.status(500).json({ message: "Gagal memperbarui tugas", error: err.message });
        }
    },

    // Controller untuk menghapus tugas berdasarkan ID
    deleteTask: async (req, res) => {
        const { id } = req.params; // Ambil ID tugas dari parameter URL
        try {
            const [result] = await Task.delete(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Tugas tidak ditemukan" });
            }
            res.json({ message: "Tugas berhasil dihapus" });
        } catch (err) {
            res.status(500).json({ message: "Gagal menghapus tugas", error: err.message });
        }
    }
};

module.exports = taskController; // Ekspor taskController agar bisa digunakan di rute
