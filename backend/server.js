const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static("public"));


app.listen(3000, () => {
  console.log("Server running on port 3000");
});



app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";
  
  db.query(sql, [username, password], (err, result) => {
    if (err) return res.send(err);

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});


app.post("/projects", (req, res) => {
  const { title, description, image, github_link } = req.body;

  const sql = "INSERT INTO projects (title, description, image, github_link) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [title, description, image, github_link], (err, result) => {
    if (err) return res.send(err);
    res.send("Project added");
  });
});

app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.put("/projects/:id", (req, res) => {
  const { title, description, image, github_link } = req.body;
  const id = req.params.id;

  const sql = "UPDATE projects SET title=?, description=?, image=?, github_link=? WHERE id=?";
  
  db.query(sql, [title, description, image, github_link, id], (err, result) => {
    if (err) return res.send(err);
    res.send("Project updated");
  });
});

app.delete("/projects/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM projects WHERE id=?", [id], (err, result) => {
    if (err) return res.send(err);
    res.send("Project deleted");
  });
});