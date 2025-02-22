//Middleware Validasi Data
function validateTask(req, res, next) {
    const { title, category, deadline, status } = req.body;

    if (!title || !category || !deadline || !status) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    if (!["Belum Selesai", "Selesai"].includes(status)) {
        return res.status(400).json({ message: "Status harus 'Belum Selesai' atau 'Selesai'" });
    }

    next();
}

module.exports = validateTask;
