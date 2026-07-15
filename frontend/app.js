const apiBaseUrl = "/api/tasks";

const statusLabels = {
  todo: "대기",
  in_progress: "진행중",
  done: "완료",
};

const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitleInput");
const taskList = document.getElementById("taskList");

async function fetchTasks() {
  const response = await fetch(apiBaseUrl);
  const tasks = await response.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className =
      "flex items-center justify-between bg-white rounded-md shadow-sm px-4 py-3";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;
    titleSpan.className =
      task.status === "done" ? "line-through text-gray-400" : "text-gray-800";

    const controls = document.createElement("div");
    controls.className = "flex items-center gap-2";

    const statusSelect = document.createElement("select");
    statusSelect.className = "border border-gray-300 rounded-md px-2 py-1 text-sm";
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
      "text-red-500 hover:text-red-700 text-sm px-2 py-1";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    controls.appendChild(statusSelect);
    controls.appendChild(deleteButton);

    taskCard.appendChild(titleSpan);
    taskCard.appendChild(controls);
    taskList.appendChild(taskCard);
  });
}

async function addTask(title) {
  await fetch(apiBaseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
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
  addTask(title);
  taskTitleInput.value = "";
});

fetchTasks();
