const Task = require("../models/taskModel"); // Import model task untuk akses database

const taskController = {
    createTask: async (req, res) => {
        const { title, category, deadline, status } = req.body;
        try {
            await Task.create(title, category, deadline, status);
            res.status(201).json({ message: "Tugas berhasil ditambahkan" });
        } catch (err) {
            res.status(500).json({ message: "Gagal menambahkan tugas", error: err.message });
        }
    },

    getTasks: async (req, res) => {
        const { category } = req.query;
        try {
            let tasks = await Task.findAll();
            if (category) {
                tasks = tasks.filter(task => task.category === category);
            }
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: "Gagal mengambil data", error: err.message });
        }
    },

    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, category, deadline, status } = req.body;
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

    deleteTask: async (req, res) => {
        const { id } = req.params;
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

module.exports = taskController; // Ekspor