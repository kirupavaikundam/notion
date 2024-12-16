let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.getElementById("task-form").addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
});

function addTask() {
    const name = document.getElementById("task-name").value;
    const desc = document.getElementById("task-desc").value;
    const due = document.getElementById("task-due").value;
    const priority = document.getElementById("task-priority").value;

    const task = { name, desc, due, priority, completed: false, subtasks: [] };
    tasks.push(task);
    saveTasks();
    renderTasks();
    document.getElementById("task-form").reset();
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        if (task.completed) taskDiv.classList.add("completed");

        taskDiv.innerHTML = `
            <div>
                <h3>${task.name} (${task.priority})</h3>
                <p>Due: ${task.due}</p>
                <p>${task.desc}</p>
                <div>
                    <input type="text" placeholder="Add Subtask..." onkeypress="addSubtask(event, ${index})" />
                    <ul>${task.subtasks.map(sub => `<li>${sub}</li>`).join("")}</ul>
                </div>
            </div>
            <div class="task-actions">
                <button class="complete" onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Complete"}</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskDiv);
    });

    renderProgress();
}

function addSubtask(event, index) {
    if (event.key === "Enter") {
        tasks[index].subtasks.push(event.target.value);
        event.target.value = "";
        saveTasks();
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function sortTasks() {
    tasks.sort((a, b) => a.priority.localeCompare(b.priority));
    renderTasks();
}

function filterCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function searchTasks() {
    const searchInput = document.getElementById("search-task").value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchInput));
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `<h3>${task.name} (${task.priority})</h3>`;
        taskList.appendChild(taskDiv);
    });
}

function renderProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    document.querySelector("h1").innerText = `Tasks Management - Progress: ${completed}/${total}`;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", renderTasks);
