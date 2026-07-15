const apiBaseUrl = "/api/tasks";

const statusLabels = {
  todo: "대기",
  in_progress: "진행중",
  done: "완료",
};

const statusBadgeClasses = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

const priorityLabels = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const priorityBadgeClasses = {
  high: "bg-red-100 text-red-600",
  medium: "bg-blue-100 text-blue-600",
  low: "bg-slate-100 text-slate-500",
};

const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitleInput");
const taskDueDateInput = document.getElementById("taskDueDateInput");
const taskPriorityInput = document.getElementById("taskPriorityInput");
const sortSelect = document.getElementById("sortSelect");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const countTodo = document.getElementById("countTodo");
const countInProgress = document.getElementById("countInProgress");
const countDone = document.getElementById("countDone");

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchTasks() {
  const response = await fetch(`${apiBaseUrl}?sort=${sortSelect.value}`);
  const tasks = await response.json();
  renderProgress(tasks);
  renderTasks(tasks);
}

function renderProgress(tasks) {
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  progressBar.style.width = `${percent}%`;
  progressLabel.textContent = `${percent}%`;
  countTodo.textContent = todoCount;
  countInProgress.textContent = inProgressCount;
  countDone.textContent = doneCount;
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  emptyState.classList.toggle("hidden", tasks.length !== 0);

  tasks.forEach((task) => {
    const isOverdue =
      task.due_date && task.due_date < todayString() && task.status !== "done";

    const taskCard = document.createElement("div");
    taskCard.className =
      "flex items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 hover:shadow-md transition-shadow";

    const leftSection = document.createElement("div");
    leftSection.className = "flex flex-col gap-1 min-w-0";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;
    titleSpan.className =
      task.status === "done"
        ? "line-through text-slate-400 font-medium truncate"
        : "text-slate-800 font-medium truncate";

    const metaRow = document.createElement("div");
    metaRow.className = "flex items-center gap-2 text-xs";

    const badge = document.createElement("span");
    badge.textContent = statusLabels[task.status];
    badge.className = `px-2 py-0.5 rounded-full font-medium ${statusBadgeClasses[task.status]}`;
    metaRow.appendChild(badge);

    const priorityBadge = document.createElement("span");
    priorityBadge.textContent = priorityLabels[task.priority] || priorityLabels.medium;
    priorityBadge.className = `px-2 py-0.5 rounded-full font-medium ${
      priorityBadgeClasses[task.priority] || priorityBadgeClasses.medium
    }`;
    metaRow.appendChild(priorityBadge);

    if (task.due_date) {
      const dueSpan = document.createElement("span");
      dueSpan.textContent = `마감 ${task.due_date}${isOverdue ? " (지연)" : ""}`;
      dueSpan.className = isOverdue
        ? "text-red-500 font-medium"
        : "text-slate-400";
      metaRow.appendChild(dueSpan);
    }

    leftSection.appendChild(titleSpan);
    leftSection.appendChild(metaRow);

    const controls = document.createElement("div");
    controls.className = "flex items-center gap-2 shrink-0";

    const statusSelect = document.createElement("select");
    statusSelect.className =
      "border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400";
    Object.entries(statusLabels).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = value === task.status;
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener("change", () =>
      updateTaskStatus(task.id, statusSelect.value)
    );

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.className =
      "text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm px-2 py-1 transition-colors";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    controls.appendChild(statusSelect);
    controls.appendChild(deleteButton);

    taskCard.appendChild(leftSection);
    taskCard.appendChild(controls);
    taskList.appendChild(taskCard);
  });
}

async function addTask(title, dueDate, priority) {
  await fetch(apiBaseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, due_date: dueDate || null, priority }),
  });
  await fetchTasks();
}

async function updateTaskStatus(taskId, status) {
  await fetch(`${apiBaseUrl}/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  await fetchTasks();
}

async function deleteTask(taskId) {
  await fetch(`${apiBaseUrl}/${taskId}`, { method: "DELETE" });
  await fetchTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;
  addTask(title, taskDueDateInput.value, taskPriorityInput.value);
  taskTitleInput.value = "";
  taskDueDateInput.value = "";
  taskPriorityInput.value = "medium";
});

sortSelect.addEventListener("change", fetchTasks);

fetchTasks();
