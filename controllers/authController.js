const User = require("../models/userModel"); 
const { generateToken } = require("../config/auth"); 
const bcrypt = require("bcryptjs"); //enkripsi password

const authController = {
    register: async (req, res) => {
        const { username, password } = req.body; // Ambil
        try {
            // Save
            const [result] = await User.create(username, password);
            // Buat token
            const token = generateToken(result.insertId);
            res.status(201).json({ message: "Registrasi berhasil", token });
        } catch (err) {
            res.status(500).json({ message: "Gagal mendaftar", error: err.message });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body; 
        try {

            const user = await User.findByUsername(username);
            if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Password salah" });
            
            const token = generateToken(user.id);
            res.json({ message: "Login sukses", token });
        } catch (err) {
            res.status(500).json({ message: "Login gagal", error: err.message });
        }
    }
};

module.exports = authController;//export