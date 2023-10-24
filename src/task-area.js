import { getListByName, removeTask } from "./task-lists";
import {createInprogressTaskCard, createCompleteTaskCard} from "./task-card";
import PubSub from "pubsub-js";

PubSub.subscribe("addTask", addTaskCard);
PubSub.subscribe("openAddTaskBox", openAddTaskBox);
PubSub.subscribe("closeAddTaskBox", closeAddTaskBox);
PubSub.subscribe("openEditTaskBox", openEditTaskBox);
PubSub.subscribe("closeEditTaskBox", closeEditTaskBox);
PubSub.subscribe("hamburgerMenuPressed", toggleTaskArea);
PubSub.subscribe("navigatorButtonPressed", onNavigatorButtonPressed);
PubSub.subscribe("taskCompleted", onTaskCompleted);
PubSub.subscribe("removeTask", onRemoveTask);
PubSub.subscribe("addTaskButtonPressed", onAddTaskButtonPressed);

const mobileQuery = window.matchMedia("(max-width: 560px)");

mobileQuery.addEventListener("change", showOnResize);

const taskArea = (()=>{
    let projectOpen = "";
    let addTaskBox = undefined;
    let isOpen = true;
    const taskCards = [];
    const editTaskBoxes = [];
    const contentArea = document.createElement('div');
    contentArea.id = "task-area";
    const getContentArea = () => contentArea;
    const addTaskCard = (taskCard) => {
        taskCards.push(taskCard);
        contentArea.appendChild(taskCard.element);
    };

    const setAddTaskBox = (taskBox) => {
        addTaskBox = taskBox;
        contentArea.insertBefore(addTaskBox.get(), contentArea.firstElementChild);
    }

    const removeAddTaskBox = () => {
        contentArea.removeChild(addTaskBox.get());
        addTaskBox = undefined;
    }

    const setEditTaskBox = (taskCard, taskBox) => {
        contentArea.insertBefore(taskBox.get(), taskCard);
        contentArea.removeChild(taskCard);
        editTaskBoxes.push(taskBox);
    }

    const removeEditTaskBox = (taskCard, id) => {
        const taskBox = editTaskBoxes.filter((taskBox) => taskBox.id === id)[0];
        contentArea.insertBefore(taskCard.element, taskBox.get());
        contentArea.removeChild(taskBox.get());
        const removeIndex = editTaskBoxes.indexOf(taskBox);
        editTaskBoxes.splice(removeIndex, 1);
    }

    const removeTaskCard = (task) => {
        let taskCardToRemove = undefined;

        taskCards.forEach((card) => {
            if (card.task === task) {
                taskCardToRemove = card;
            }
        });

        if (taskCardToRemove !== undefined) {
            contentArea.removeChild(taskCardToRemove.element);
            const removeIndex = taskCards.indexOf(taskCardToRemove);
            taskCards.splice(removeIndex, 1);
        }
    }

    const clear = () => {
        taskCards.length = 0;
        editTaskBoxes.length = 0;
        contentArea.replaceChildren();
    }

    return {
        projectOpen,
        getContentArea,
        addTaskCard,
        setAddTaskBox,
        removeAddTaskBox,
        setEditTaskBox,
        removeEditTaskBox,
        clear,
        isOpen,
        removeTaskCard,
    }
})();

export const getTaskAreaContent = () => taskArea.getContentArea(); 

export function setListInTaskArea(taskList) {
    taskArea.clear();
    taskArea.projectOpen = taskList;
    const tasks = getListByName(taskList);
    
    for (let task of tasks) {
        taskArea.addTaskCard(createInprogressTaskCard(task));
    }
}

export function setTasksInTaskArea(tasks, projectName) {
    taskArea.clear();
    taskArea.projectOpen = projectName;
    
    for (let task of tasks) {
        taskArea.addTaskCard(createInprogressTaskCard(task));
    }
}

export function setCompletedInTaskArea() {
    taskArea.clear();
    taskArea.projectOpen = "Completed";
    const tasks = getListByName("Completed");

    for (let task of tasks) {
        taskArea.addTaskCard(createCompleteTaskCard(task));
    }
}

function toggleTaskArea() {
    taskArea.getContentArea().style.display = taskArea.isOpen ? "none" : "flex";
    taskArea.isOpen = taskArea.isOpen ? false : true
}

function showOnResize(query) {
    if (!query.matches && !taskArea.isOpen) {
        taskArea.isOpen = true;
        taskArea.getContentArea().style.display = "flex";
    }
}

function addTaskCard(_msg, data) {
    if (taskArea.projectOpen === data.project) {
        taskArea.addTaskCard(createInprogressTaskCard(data.task));
    }
}

function onNavigatorButtonPressed(_msg, _data) {
        taskArea.getContentArea().style.display = "flex";
        taskArea.isOpen = true;
    
}

function openAddTaskBox(_msg, data) {
    taskArea.setAddTaskBox(data);
}

function closeAddTaskBox(_msg, _data) {
    taskArea.removeAddTaskBox();
}

function openEditTaskBox(_msg, data) {
    taskArea.setEditTaskBox(data.taskCard, data.taskBox);
}

function closeEditTaskBox(_msg, data) {
    taskArea.removeEditTaskBox(data.taskCard, data.id)
}

function onTaskCompleted(_msg, task) {
    taskArea.removeTaskCard(task);
}

function onRemoveTask(_msg, task) {
    taskArea.removeTaskCard(task);
    removeTask(task, "Completed");
}

function onAddTaskButtonPressed(_msg, _data) {
    if (!taskArea.isOpen) {
        taskArea.getContentArea().style.display = "flex";
        taskArea.isOpen = true;
    }
}