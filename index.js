const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = 8080;
const MONGODB_URI = "mongodb+srv://aman:aman@cluster0.k2rjb.mongodb.net/test";

const todoSchema = new mongoose.Schema(
  {
    title: String,
    status: Boolean,
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

// Create a todo
app.post("/todos", async (req, res) => {
  const { title, status } = req.body;
  const newTodo = new Todo({ title, status });
  await newTodo.save();
  res.json({
    message: "Todo Added",
    newTodo,
  });
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json({
      message: "All todos fetched",
      todos,
    });
  } catch (error) {
    console.log("Error fetching todos", error);
    res.json({
      message: "Error fetching todos",
      error,
    });
  }
});

// Update an existing todo
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, status },
      { new: true }
    );
    res.json({
      message: "Todo Updated",
      updatedTodo,
    });
  } catch (error) {
    console.log("Error updating todo", error);
    res.json({
      message: "Error updating todo",
      error,
    });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const deletedTodo = await Todo.findByIdAndDelete(id);
  res.json({
    message: "Todo deleted",
    deletedTodo,
  });
});

mongoose.connect(MONGODB_URI).then(() => {
  console.log(`MongoDB connected!!`);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
