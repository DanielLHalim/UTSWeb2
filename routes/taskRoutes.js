//Route Task
const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");
const validateTask = require("../middlewares/validateMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/tasks", validateTask, taskController.createTask);
router.get("/tasks", taskController.getTasks);
router.put("/tasks/:id", validateTask, taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

module.exports = router;