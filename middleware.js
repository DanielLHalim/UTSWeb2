function validateTask(req, res, next) {
    const { title, category } = req.body;
    if (!title || !category) {
        return res.status(400).json({ message: "Title dan category harus diisi" });
    }
    next();
}

module.exports = { validateTask };
