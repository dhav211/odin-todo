import { createTaskForms, createEmptyInputs } from "./task-forms";
import { Task } from "./task";
import PubSub from "pubsub-js";
import * as taskBox from './task-box';

PubSub.subscribe("navigatorButtonPressed", onNavigatorButtonPressed);

let isOpen = false;
let addTaskBox = undefined;

function createAddTaskBox() {
    const inputs = createEmptyInputs();

    const title = taskBox.createTitle("Add Task");

    const forms = createTaskForms(inputs);

    const addTaskButton = taskBox.createActionTaskButton("Add", () => {
        if (forms.areFormsValid()) {
            addTask();
        }});

    const closeButton = taskBox.createCloseButton(closeAddTaskBox);

    const buttonContainer = taskBox.createButtonContainer(addTaskButton, closeButton);

    const element = taskBox.createElement(title, forms, buttonContainer);

    const get = () => element;

    return {
        get,
        inputs
    }
}

export function openAddTaskBox() {
    if (!isOpen) {
        addTaskBox = createAddTaskBox();
        PubSub.publish("openAddTaskBox", addTaskBox);
        isOpen = true;
    }
}

function closeAddTaskBox() {
    PubSub.publish("closeAddTaskBox");
    isOpen = false;
}

function onNavigatorButtonPressed(_msg, _data) {
    isOpen = false;
}

function addTask() {
    PubSub.publish("addTask", {project:addTaskBox.inputs.project, task:new Task(addTaskBox.inputs.name, 
        addTaskBox.inputs.description, addTaskBox.inputs.dueDate, addTaskBox.inputs.urgency, addTaskBox.inputs.project)});
    closeAddTaskBox();
}