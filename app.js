import { loadTasks, saveTasks } from './modules/storage.js';
import { renderTaskList } from './modules/render.js';
import { validateTaskInput } from './modules/validation.js';

let tasks = loadTasks();

const form = document.getElementById('task-form');
const list = document.getElementById('task-list');

// --- Initial render + progress ---
renderTaskList(list, tasks);
updateOverallProgress();

// --- Add Task ---
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-input').value;
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('due-date').value;
  const priority = document.getElementById('priority').value;
  const tags = document.getElementById('tags').value;

  if (!validateTaskInput(title, priority)) return;

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    dueDate,
    priority,
    tags: tags.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTaskList(list, tasks);
  form.reset();
  updateOverallProgress();
});

// --- Task List Events ---
list.addEventListener('click', (e) => {
  const taskElement = e.target.closest('.task');
  if (!taskElement) return;

  const taskId = Number(taskElement.dataset.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  // DELETE
  if (e.target.classList.contains('delete-btn')) {
    if (confirm("Are you sure you want to delete this task?")) {
      tasks.splice(taskIndex, 1);
      saveTasks(tasks);
      renderTaskList(list, tasks);
      updateOverallProgress();
    }
  }

  // CHECK/UNCHECK
  if (e.target.classList.contains('complete-checkbox')) {
    tasks[taskIndex].completed = e.target.checked;
    saveTasks(tasks);
    renderTaskList(list, tasks);
    updateOverallProgress();
  }

  // EDIT
  if (e.target.classList.contains('edit-btn')) {
    // Hide view mode
    taskElement.querySelectorAll('.view-title, .view-desc, .view-meta, .view-tags').forEach(el => el.style.display = 'none');
    // Show edit mode
    taskElement.querySelectorAll('.edit-input').forEach(el => el.style.display = 'block');

    e.target.style.display = 'none';
    taskElement.querySelector('.save-btn').style.display = 'inline-block';
  }

  // SAVE
  if (e.target.classList.contains('save-btn')) {
    const newTitle = taskElement.querySelector('.task-title').value.trim();
    const newDesc = taskElement.querySelector('.task-description').value.trim();
    const newDate = taskElement.querySelector('.task-due-date').value;
    const newPriority = taskElement.querySelector('.task-priority').value;
    const newTags = taskElement.querySelector('.task-tags').value.trim();

    if (!newTitle) {
      alert("Title cannot be empty.");
      return;
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: newTitle,
      description: newDesc,
      dueDate: newDate,
      priority: newPriority,
      tags: newTags
    };

    saveTasks(tasks);
    renderTaskList(list, tasks);
    updateOverallProgress();
  }
});

// --- Theme Toggle ---
const modeToggle = document.getElementById("modeToggle");
const icon = modeToggle.querySelector(".icon");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  icon.textContent = "☀️";
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  icon.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// --- Overall Progress Function ---
function updateOverallProgress() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const textEl = document.getElementById('overall-text');
  const fillEl = document.querySelector('.progress-fill');

  if (textEl && fillEl) {
    textEl.textContent = `${completedTasks} of ${totalTasks} tasks completed (${percent}%)`;
    fillEl.style.width = `${percent}%`;
  }
}
