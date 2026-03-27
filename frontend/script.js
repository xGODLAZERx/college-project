let editId = null;

// INDEX PAGE
const projectsDiv = document.getElementById("projects");

if (projectsDiv) {
  fetch("/projects")
    .then(res => res.json())
    .then(data => {
      projectsDiv.innerHTML = "";
      if (data.length === 0) {
        const h2 = document.createElement("h2");
        h2.innerText = "No data available";

          h2.classList.add("no-data");

          document.body.appendChild(h2);
}

      data.forEach(p => {
        projectsDiv.innerHTML += `
          <div class="project-card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            ${p.image ? `<img src="${p.image}" alt="${p.title}">` : ""}
            ${p.github_link ? `<p><a href="${p.github_link}" target="_blank">GitHub</a></p>` : ""}
          </div>
        `;
      });
    })
    .catch(err => console.log(err));
}

// LOGIN PAGE
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Login successful");
          window.location.href = "dashboard.html";
        } else {
          alert("Invalid username or password");
        }
      })
      .catch(err => console.log(err));
  });
}

// DASHBOARD PAGE
const projectList = document.getElementById("projectList");
const saveBtn = document.getElementById("saveBtn");

if (projectList && saveBtn) {
  function loadProjects() {
    fetch("/projects")
      .then(res => res.json())
      .then(data => {
        projectList.innerHTML = "";

        data.forEach(project => {
          projectList.innerHTML += `
            <div class="project-card">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <button onclick='editProject("${project._id}", ${JSON.stringify(project.title)}, ${JSON.stringify(project.description)}, ${JSON.stringify(project.image)}, ${JSON.stringify(project.github_link)})'>Edit</button>
              <button onclick='deleteProject("${project._id}")'>Delete</button>
            </div>
          `;
        });
      })
      .catch(err => console.log(err));
  }

  function clearForm() {
    editId = null;
    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("img").value = "";
    document.getElementById("git").value = "";
  }

  saveBtn.addEventListener("click", () => {
    const projectData = {
      title: document.getElementById("title").value,
      description: document.getElementById("desc").value,
      image: document.getElementById("img").value,
      github_link: document.getElementById("git").value
    };

    if (editId) {
      fetch(`/projects/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      })
        .then(res => res.json())
        .then(() => {
          alert("Project updated");
          clearForm();
          loadProjects();
        })
        .catch(err => console.log(err));
    } else {
      fetch("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      })
        .then(res => res.json())
        .then(() => {
          alert("Project added");
          clearForm();
          loadProjects();
        })
        .catch(err => console.log(err));
    }
  });

  window.editProject = function (id, title, description, image, github_link) {
    editId = id;
    document.getElementById("title").value = title;
    document.getElementById("desc").value = description;
    document.getElementById("img").value = image;
    document.getElementById("git").value = github_link;
  };

  window.deleteProject = function (id) {
    fetch(`/projects/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        alert("Project deleted");
        loadProjects();
      })
      .catch(err => console.log(err));
  };

  loadProjects();
}