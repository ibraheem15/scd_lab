const mongoose = require("mongoose");

// Define a Task schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  category: String,
  completed: Boolean,
  priority: String,
  user: String,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;