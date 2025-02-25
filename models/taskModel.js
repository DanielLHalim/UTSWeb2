//Model Task connect database
const db = require("../config/db");

const Task = {
    create: async (title, category, deadline, status) => {
        return db.promise().query(
            "INSERT INTO tasks (title, category, deadline, status) VALUES (?, ?, ?, ?)",
            [title, category, deadline, status]
        );
    },
    findAll: async () => {
        const [rows] = await db.promise().query("SELECT * FROM tasks");
        return rows;
    },
    update: async (id, title, category, deadline, status) => {
        return db.promise().query(
            "UPDATE tasks SET title = ?, category = ?, deadline = ?, status = ? WHERE id = ?",
            [title, category, deadline, status, id]
        );
    },
    delete: async (id) => {
        return db.promise().query("DELETE FROM tasks WHERE id = ?", [id]);
    }
};

module.exports = Task;