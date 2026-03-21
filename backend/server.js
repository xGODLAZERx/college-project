const express = require("express");
const cors = require("cors");
const path = require("path");

require("./db");
const Project = require("./models/Project");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create project
app.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all projects
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project
app.put("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
app.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});