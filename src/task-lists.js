import { Task } from "./task";
import PubSub from "pubsub-js";
import { Urgency } from "./urgency";
import { TaskList } from "./task-list";
import { DateTime } from "luxon";

const lists = new Map();

PubSub.subscribe("addTask", addTaskToList);
PubSub.subscribe("taskCompleted", onTaskCompleted);

createTaskLists();

function createTaskLists() {
  addList("General");
  addList("Completed");
}

export function getListByName(listName) {
  let listToReturn = [];

  if (lists.size > 0) {
    listToReturn = lists.get(listName);
  }

  return listToReturn;
}

export function addList(listName) {
  lists.set(listName, []);
}

export function removeTask(task, listName) {
  const taskIndex = lists.get(listName).indexOf(task);
  lists.get(listName).splice(taskIndex, 1);
}

function moveTaskToCompleted(task, listName) {
  const taskIndex = lists.get(listName).indexOf(task);
  lists.get(listName).splice(taskIndex, 1);
  lists.get("Completed").push(task);
}

export function doesListExist(listName) {
  let exists = false;

  getAllListNames().forEach((name) => {
    if (name.toLowerCase() === listName.toLowerCase()) {
      exists = true;
    }
  });

  return exists;
}

export function removeList(listName) {
  if (lists.size > 0) {
    lists.delete(listName);
  }
}

export function getUserCreatedListNames() {
  const names = getAllListNames();

  names.splice(0, 1);

  return names;
}

export function getAllListNames() {
  const names = [];

  if (lists.size > 0) {
    lists.forEach((_value, key, _map) => {
      if (key !== "Completed") names.push(key);
    });
  }

  return names;
}

export function getAllTodaysTasks() {
  let todaysTasks = [];

  if (lists.size > 0) {
    const allTasks = getAllUncompletedTasks();

    let todaysDate = DateTime.now();
    todaysTasks = allTasks.filter((task) => {
      if (
        task.dueDate.day === todaysDate.day &&
        task.dueDate.year === todaysDate.year &&
        task.dueDate.month === todaysDate.month
      ) {
        return true;
      }
    });
  }

  return todaysTasks;
}

export function getAllThisWeeksTasks() {
  let weeksTasks = [];

  if (lists.size > 0) {
    const allTasks = getAllUncompletedTasks();

    const todaysDate = DateTime.now();
    const sundaysDate = todaysDate.minus({ days: todaysDate.day });
    const saturdaysDate = todaysDate.plus({ days: 6 - todaysDate.day });

    weeksTasks = allTasks.filter((task) => {
      const taskWeekStartDate = task.dueDate.minus({ days: todaysDate.day });
      const taskWeekEndDate = task.dueDate.plus({ days: 6 - todaysDate.day });

      if (
        taskWeekStartDate.day >= sundaysDate.day &&
        taskWeekEndDate.day <= saturdaysDate.day
      )
        return true;
    });
  }

  return weeksTasks;
}

export function getAllUrgentTasks() {
  let urgentTasks = [];

  if (lists.size > 0) {
    const allTasks = getAllUncompletedTasks();

    urgentTasks = allTasks.filter((task) => task.urgency === Urgency.High);
  }

  return urgentTasks;
}

function getAllTasks() {
  const tasks = [];
  lists.forEach((value, _key, _map) => {
    tasks.push(...value);
  });

  return tasks;
}

function getAllUncompletedTasks() {
  const tasks = [];
  lists.forEach((value, key, _map) => {
    if (key !== "Completed") {
      tasks.push(...value);
    }
  });

  return tasks;
}

function addTaskToList(_msg, data) {
  if (lists.size > 0) {
    lists.get(data.project).push(data.task);
  }
}

function onTaskCompleted(_msg, task) {
  moveTaskToCompleted(task, task.project);
}
