class Task {
    constructor(status, title, description) {
        this.type = status;
        this.title = title;
        this.description = description;
    }
}

const createNewBacklogButton = document.getElementById("createNewBacklog");
const createNewInProgressButton = document.getElementById("createNewInProgress");
const createNewFeedbackButton = document.getElementById("createNewFeedback");
const standardType = "backlog";
const modal = document.getElementById("editModal");
const closeModal = document.getElementsByClassName("close")[0];
const addTask = document.getElementById('addTask');

const listMap = {
    backlog: ".backlogContent .taskList",
    inProgress: ".inProgressContent .taskList",
    feedback: ".feedback .taskList"
};

let editingLi = null;

createNewBacklogButton.onclick = () => openModal();
createNewInProgressButton.onclick = () => openModal();
createNewFeedbackButton.onclick = () => openModal();

closeModal.onclick = () => closeModalFn();
window.onclick = (event) => { if (event.target == modal) closeModalFn(); }

addTask.addEventListener("click", () => {
    if (editingLi) {
        saveEdit();
    } else {
        createNewTask();
    }
});

function openModal(li = null) {
    editingLi = li;
    if (li) {
        document.getElementById("taskTitle").value = li.dataset.title;
        document.getElementById("taskDescription").value = li.dataset.description;
        document.getElementById("taskStatus").value = li.dataset.status;
        document.querySelector("#editModal h2").textContent = "Edit task";
        addTask.textContent = "Save changes";
    } else {
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskStatus").value = "backlog";
        document.querySelector("#editModal h2").textContent = "Add a new task";
        addTask.textContent = "Add task";
    }
    modal.style.display = "block";
}

function closeModalFn() {
    modal.style.display = "none";
    editingLi = null;
}

function createNewTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const status = document.getElementById("taskStatus").value;

    if (!title.trim()) return;

    const task = new Task(status, title, description);
    const li = buildTaskElement(task.title, task.description, task.type);
    const targetList = document.querySelector(listMap[status]);
    const newTaskButton = targetList.querySelector(".newTask");
    targetList.insertBefore(li, newTaskButton);

    closeModalFn();
}

function saveEdit() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const status = document.getElementById("taskStatus").value;

    if (!title.trim()) return;

    const oldStatus = editingLi.dataset.status;

    editingLi.dataset.title = title;
    editingLi.dataset.description = description;
    editingLi.dataset.status = status;
    editingLi.querySelector(".task-title").textContent = title;
    editingLi.querySelector(".task-description").textContent = description;

    // Move to different list if status changed
    if (status !== oldStatus) {
        const targetList = document.querySelector(listMap[status]);
        const newTaskButton = targetList.querySelector(".newTask");
        targetList.insertBefore(editingLi, newTaskButton);
    }

    closeModalFn();
}

function buildTaskElement(title, description, status) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.dataset.title = title;
    li.dataset.description = description;
    li.dataset.status = status;

    li.innerHTML = `
        <div class="task-body">
            <strong class="task-title">${title}</strong>
            <p class="task-description">${description}</p>
        </div>
        <button class="edit-btn">Edit</button>
    `;

    li.querySelector(".edit-btn").addEventListener("click", () => openModal(li));
    makeDraggable(li);

    return li;
}

function makeDraggable(li) {
    li.setAttribute("draggable", true);

    li.addEventListener("dragstart", () => {
        li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
        const parent = li.closest(".backlogContent, .inProgressContent, .feedback");
        if (parent.classList.contains("backlogContent")) li.dataset.status = "backlog";
        if (parent.classList.contains("inProgressContent")) li.dataset.status = "inProgress";
        if (parent.classList.contains("feedback")) li.dataset.status = "feedback";
        li.classList.remove("dragging");
    });
}

document.querySelectorAll(".taskList").forEach(list => {
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        const newTask = list.querySelector(".newTask");
        list.insertBefore(dragging, newTask);
    });
});