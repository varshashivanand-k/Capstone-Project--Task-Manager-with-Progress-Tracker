export function renderTaskList(container, tasks) {
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = `<li class="empty-state">No tasks yet. Add one!</li>`;
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="complete-checkbox" />
      <div class="task-content">
        <!-- Display Mode -->
        <h3 class="view-title" style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.title}</h3>
        <p class="task-id"><strong>Task #${index + 1}</strong></p>
        <p class="view-desc">${task.description || ''}</p>
        <small class="view-meta">Due: ${task.dueDate || 'N/A'} | Priority: ${task.priority}</small>
        <p class="view-tags"><em>Tags: ${task.tags || 'None'}</em></p>

        <!-- Edit Mode -->
        <input type="text" class="task-title edit-input" value="${task.title}" style="display:none;" />
        <input type="text" class="task-description edit-input" value="${task.description || ''}" style="display:none;" />
        <input type="date" class="task-due-date edit-input" value="${task.dueDate || ''}" style="display:none;" />
        <select class="task-priority edit-input" style="display:none;">
          <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
        </select>
        <input type="text" class="task-tags edit-input" value="${task.tags || ''}" style="display:none;" />
      </div>

      <div class="task-actions">
        <button class="edit-btn">✏️</button>
        <button class="save-btn" style="display:none;">💾</button>
        <button class="delete-btn">🗑</button>
      </div>
    `;

    container.appendChild(li);
  });
}
