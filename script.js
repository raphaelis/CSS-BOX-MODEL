let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

document.getElementById("task-form").addEventListener("submit", addTask);
document.querySelectorAll("button[data-filter]").forEach(btn =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTasks();
  })
);

function addTask(e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;

  if (!title || !description) return;

  const newTask = {
    id: Date.now(),
    title,
    description,
    priority,
    completed: false
  };

  tasks.push(newTask);
  saveAndRender();
  e.target.reset();
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "active") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = `task ${task.priority} ${task.completed ? "completed" : ""}`;

    div.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <p><strong>Priorité :</strong> ${task.priority}</p>
    `;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.completed ? "Annuler" : "Terminer";
    doneBtn.addEventListener("click", () => toggleComplete(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    div.appendChild(doneBtn);
    div.appendChild(deleteBtn);
    list.appendChild(div);
  });

  updateCounter();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function updateCounter() {
  const count = tasks.filter(t => !t.completed).length;
  document.getElementById("task-counter").textContent = count;
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Initial render
renderTasks();
