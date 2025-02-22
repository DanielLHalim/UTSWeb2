// controllers/authController.js

const User = require("../models/userModel"); // Import model user untuk akses database
const { generateToken } = require("../config/auth"); // Import fungsi generateToken untuk membuat JWT
const bcrypt = require("bcryptjs"); // Import bcrypt untuk enkripsi password

const authController = {
    // Controller untuk registrasi user
    register: async (req, res) => {
        const { username, password } = req.body; // Ambil username dan password dari request body
        try {
            // Simpan user baru ke database dengan password yang sudah dienkripsi
            const [result] = await User.create(username, password);
            // Buat token JWT untuk user baru (opsional, jika ingin langsung login)
            const token = generateToken(result.insertId);
            res.status(201).json({ message: "Registrasi berhasil", token });
        } catch (err) {
            res.status(500).json({ message: "Gagal mendaftar", error: err.message });
        }
    },

    // Controller untuk login user
    login: async (req, res) => {
        const { username, password } = req.body; // Ambil username dan password dari request body
        try {
            // Cari user berdasarkan username
            const user = await User.findByUsername(username);
            if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
            
            // Bandingkan password yang diinput dengan password yang tersimpan (hashed)
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Password salah" });
            
            // Jika password cocok, buat token JWT untuk autentikasi
            const token = generateToken(user.id);
            res.json({ message: "Login sukses", token });
        } catch (err) {
            res.status(500).json({ message: "Login gagal", error: err.message });
        }
    }
};

module.exports = authController; // Ekspor authController agar bisa digunakan di rute
