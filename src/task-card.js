import PubSub from "pubsub-js";
import { createEditTaskBox } from "./edit-task-box";
import { DateTime } from "luxon";

export function createCompleteTaskCard(task) {
  const element = document.createElement("div");
  element.classList.add("card");

  const taskName = document.createElement("h2");
  taskName.textContent = task.name;
  taskName.classList.add("banner-header");
  taskName.style.backgroundColor = getUrgencyColor(task.urgency);
  taskName.style.color = getTitleFontColor(getUrgencyColor(task.urgency));

  const textArea = setTextArea(task, false);
  const contentGrid = document.createElement("div");
  contentGrid.classList.add("task-card-grid");
  const removeButton = setRemoveButton(task);
  contentGrid.appendChild(textArea);
  contentGrid.appendChild(removeButton);

  element.appendChild(taskName);
  element.appendChild(contentGrid);

  return { element, task };
}

export function createInprogressTaskCard(task) {
  const element = document.createElement("div");
  element.classList.add("card");

  const taskName = document.createElement("h2");
  taskName.textContent = task.name;
  taskName.classList.add("banner-header");
  taskName.style.backgroundColor = getUrgencyColor(task.urgency);
  taskName.style.color = getTitleFontColor(getUrgencyColor(task.urgency));

  const textArea = setTextArea(task, false);
  const editButton = setEditButton(element, task);
  const completeButton = setCompleteButton(task);
  const contentGrid = document.createElement("div");
  contentGrid.classList.add("task-card-grid");
  contentGrid.appendChild(textArea);
  contentGrid.appendChild(editButton);
  contentGrid.appendChild(completeButton);

  element.appendChild(taskName);
  element.appendChild(contentGrid);

  return { element, task };
}

function setTextArea(task, isComplete) {
  const textArea = document.createElement("div");
  textArea.id = "text-area";

  const urgency = document.createElement("p");
  urgency.textContent = getUrgencyText(task.urgency);

  const taskDueDate = document.createElement("p");
  if (!isComplete) {
    if (typeof task.dueDate === "string") {
      const newDate = new Date(task.dueDate);
      taskDueDate.textContent = newDate.toLocaleDateString("en-US");
    } else {
      taskDueDate.textContent = task.dueDate.toLocaleString(
        DateTime.DATE_SHORT,
      );
    }
  }

  const taskDescription = document.createElement("p");
  taskDescription.textContent = task.description;

  textArea.appendChild(urgency);
  if (!isComplete) textArea.appendChild(taskDueDate);
  textArea.appendChild(taskDescription);

  return textArea;
}

function setEditButton(taskCard, task) {
  const editButton = document.createElement("button");
  editButton.classList.add("icon-button");
  editButton.id = "edit-button";
  editButton.addEventListener("click", () => {
    PubSub.publish("openEditTaskBox", {
      taskCard: taskCard,
      taskBox: createEditTaskBox(task),
    });
  });

  return editButton;
}

function setCompleteButton(task) {
  const completeButton = document.createElement("button");
  completeButton.classList.add("icon-button");
  completeButton.id = "complete-button";
  completeButton.addEventListener("click", () =>
    PubSub.publish("taskCompleted", task),
  );

  return completeButton;
}

function setRemoveButton(task) {
  const removeButton = document.createElement("button");
  removeButton.classList.add("icon-button");
  removeButton.id = "remove-button";
  removeButton.addEventListener("click", () =>
    PubSub.publish("removeTask", task),
  );

  return removeButton;
}

function getUrgencyColor(urgency) {
  let color = "";

  switch (Number(urgency)) {
    case 0: // High  Red
      color = "#059669";
      break;
    case 1: // Medium  Yellow
      color = "#fef08a";
      break;
    case 2: // Low  Green
      color = "#ef4444";
      break;
  }

  return color;
}

function getUrgencyText(urgency) {
  let text = "";

  switch (Number(urgency)) {
    case 0: // High  Red
      text = "Low";
      break;
    case 1: // Medium  Yellow
      text = "Medium";
      break;
    case 2: // Low  Green
      text = "High";
      break;
  }

  return text;
}

function getTitleFontColor(backgroundColor) {
  let color = "#fafafa";

  if (backgroundColor === "#fef08a") {
    color = "#1e293b";
  }

  return color;
}
