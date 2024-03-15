const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

const Task = require("./models/tasks");
const User = require("./models/user");


mongoose
  .connect("mongodb://localhost/task_manager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Create a new task
const createTask = async (
  title,
  description,
  dueDate,
  category,
  priority,
  user
) => {
  try {
    const task = new Task({
      title,
      description,
      dueDate,
      category,
      completed: false,
      priority,
      user,
    });
    await task.save();
    console.log("Task created:", task);
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

// Example usage: route to create a task
app.post("/create-task", authenticateUser, (req, res) => {
  createTask(
    "Finish lab 2",
    "Complete the lab for SC&D",
    new Date(),
    "School",
    "High",
    req.user.username
  );
  res.send("Task created");
});

app.get("/tasks", authenticateUser, async (req, res) => {
  const tasks = await Task.find({ user: req.user.username });
  res.json(tasks);
});

app.get("/tasks/:category", authenticateUser, async (req, res) => {
  const category = req.params.category;
  const tasks = await Task.find({
    category: category,
    user: req.user.username,
  });
  res.json(tasks);
});

app.get("/tasks/:id/complete", authenticateUser, async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.username },
    { completed: true },
    { new: true }
  );
  res.json(task);
});

app.get("/tasks/sort/:sort", authenticateUser, async (req, res) => {
  const sort = req.params.sort;
  let sortOption;
  if (sort === "dueDate") {
    sortOption = { dueDate: 1 };
  } else if (sort === "category") {
    sortOption = { category: 1 };
  } else if (sort === "completed") {
    sortOption = { completed: 1 };
  }
  const tasks = await Task.find({ user: req.user.username }).sort(sortOption);
  res.json(tasks);
});

app.get("/tasks/:id/priority/:priority", authenticateUser, async (req, res) => {
  const id = req.params.id;
  const priority = req.params.priority;
  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.username },
    { priority: priority },
    { new: true }
  );
  res.json(task);
});

function authenticateUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
}


app.post("/create-user/:username/:password", async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  if (await User.findOne({ username: username })) {
    res.send("User already exists");
    return;
  }

  const user = new User({
    username: username,
    password: password,
  });
  await user.save();
  res.json(user);
});

app.post("/login/:username/:password", async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  const user = await User.findOne({
    username: username,
    password: password,
  });
  if (user) {
    const token = jwt.sign({ username: user.username }, "secret_key");
    res.json({ token: token });
  } else {
    res.send("Login failed");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
