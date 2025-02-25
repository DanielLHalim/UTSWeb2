const { verifyToken } = require("../config/auth");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Akses ditolak" });

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Token tidak valid" });
    }
};

module.exports = authMiddleware;