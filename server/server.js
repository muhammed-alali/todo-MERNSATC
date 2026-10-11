const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dns = require("dns");
const Todo = require("./models/tasks");
const cors = require("cors");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const DBURL = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(DBURL);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("fild to connect to database");
    console.log(error);
  }
};
connectDB();

app.get("/tasks", async (req, res) => {
  try {
    const todos = await Todo.find();

    res.json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
});

app.post("/task", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    todo.save();
    res.json("201");
  } catch (error) {
    res.status(500).json({
      message: "Failed to create todo",
      error: error.message,
    });
  }
});

app.get("/task/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create todo",
      error: error.message,
    });
  }
});

app.delete("/task/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete todo",
      error: error.message,
    });
  }
});

app.put("/task/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body);
    res.json(todo);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update todo",
      error: error.message,
    });
  }
});
