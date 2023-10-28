import {
  getAllTodaysTasks,
  getAllThisWeeksTasks,
  getAllUrgentTasks,
  getUserCreatedListNames,
  addList,
  doesListExist,
} from "./task-lists";
import {
  setTasksInTaskArea,
  setListInTaskArea,
  setCompletedInTaskArea,
} from "./task-area";
import PubSub from "pubsub-js";
import DarkPlus from "./images/dark_plus.svg";

const mobileQuery = window.matchMedia("(max-width: 560px)");
mobileQuery.addEventListener("change", setDisplayOnMediaQuery);

PubSub.subscribe("hamburgerMenuPressed", activateMobileNavigatorMenu);
PubSub.subscribe("navigatorButtonPressed", onNavigatorButtonPressed);
PubSub.subscribe("addTaskButtonPressed", onAddTaskButtonPressed);

export const navMenu = (() => {
  let isOpen = false;
  const element = createElement();
  const defaultListButtons = createList(createDefaultListButtons());
  const userListHeader = createTitle();
  let userListButtons = createList(createUserListButtons());
  const addListForm = createAddListForm();

  element.replaceChildren(
    defaultListButtons,
    userListHeader,
    userListButtons,
    addListForm,
  );

  const get = () => element;

  const rebuildUserListButtons = () => {
    const newUserListButtons = createList(createUserListButtons());
    element.replaceChild(newUserListButtons, userListButtons);
    userListButtons = newUserListButtons;
  };

  return {
    isOpen,
    get,
    rebuildUserListButtons,
  };
})();

// Call this here because navigator must be initialized first
setDisplayOnMediaQuery(mobileQuery);

function setDisplayOnMediaQuery(query) {
  navMenu.isOpen = false;

  navMenu.get().style.display = query.matches ? "none" : "block";
}

function activateMobileNavigatorMenu() {
  navMenu.get().style.display = navMenu.isOpen ? "none" : "block";
  navMenu.isOpen = navMenu.isOpen ? false : true;
}

function onNavigatorButtonPressed() {
  if (navMenu.isOpen) {
    navMenu.isOpen = false;
    navMenu.get().style.display = "none";
  }
}

function createElement() {
  const nav = document.createElement("div");
  nav.id = "navigator";

  return nav;
}

function createTitle() {
  const title = document.createElement("h2");
  title.textContent = "Lists";
  title.classList.add("navigator-buttons");

  return title;
}

function createAddListForm() {
  const form = document.createElement("form");
  form.id = "add-list-form";

  const label = document.createElement("label");
  const darkPlus = new Image();
  darkPlus.src = DarkPlus;
  darkPlus.style.width = "32px";
  darkPlus.style.height = "32px";
  //darkPlus.classList.add("icon-button");
  label.appendChild(darkPlus);

  const input = document.createElement("input");
  input.type = "text";
  input.type = "listName";
  input.defaultValue = "Enter New List Name";
  form.addEventListener("submit", function (e) {
    if (!doesListExist(input.value)) {
      addList(input.value);
      navMenu.rebuildUserListButtons();
      input.value = input.defaultValue;
      input.blur();
    }

    e.preventDefault();
  });

  form.addEventListener("focusin", function () {
    if (input.value === input.defaultValue) {
      input.value = "";
    }
  });

  form.addEventListener("focusout", function () {
    if (input.value === "") {
      input.value = input.defaultValue;
    }
  });

  form.replaceChildren(label, input);

  return form;
}

function createList(buttons) {
  const list = document.createElement("ul");

  for (let button of buttons) {
    const listItem = document.createElement("li");
    listItem.appendChild(button);
    list.appendChild(listItem);
  }

  return list;
}

function createDefaultListButtons() {
  const general = document.createElement("button");
  general.classList.add("navigator-buttons");
  general.textContent = "General";
  general.addEventListener("click", () => setListInTaskArea("General"));
  general.addEventListener("click", onButtonPressed);

  const today = document.createElement("button");
  today.classList.add("navigator-buttons");
  today.textContent = "Today";
  today.addEventListener("click", () => {
    const todaysTasks = getAllTodaysTasks();
    setTasksInTaskArea(todaysTasks, "Today");
  });
  today.addEventListener("click", onButtonPressed);

  const thisWeek = document.createElement("button");
  thisWeek.classList.add("navigator-buttons");
  thisWeek.textContent = "This Week";
  thisWeek.addEventListener("click", () => {
    const weeksTasks = getAllThisWeeksTasks();
    setTasksInTaskArea(weeksTasks, "Week");
  });
  thisWeek.addEventListener("click", onButtonPressed);

  const urgent = document.createElement("button");
  urgent.classList.add("navigator-buttons");
  urgent.textContent = "Urgent";
  urgent.addEventListener("click", () => {
    const urgentTasks = getAllUrgentTasks();
    setTasksInTaskArea(urgentTasks, "Urgent");
  });
  urgent.addEventListener("click", onButtonPressed);

  const completed = document.createElement("button");
  completed.classList.add("navigator-buttons");
  completed.textContent = "Completed";
  completed.addEventListener("click", () => setCompletedInTaskArea());
  completed.addEventListener("click", onButtonPressed);

  return [general, today, thisWeek, urgent, completed];
}

function onButtonPressed() {
  if (navMenu.isOpen) {
    navMenu.get().style.display = "none";
    navMenu.isOpen = false;
  }
  PubSub.publish("navigatorButtonPressed");
}

function createUserListButtons() {
  return getUserCreatedListNames().map((name) => {
    const userList = document.createElement("button");
    userList.classList.add("navigator-buttons");
    userList.textContent = name;
    userList.addEventListener("click", () => setListInTaskArea(name));
    userList.addEventListener("click", onButtonPressed);

    return userList;
  });
}

function onAddTaskButtonPressed(_msg, _data) {
  if (navMenu.isOpen) {
    navMenu.get().style.display = "none";
    navMenu.isOpen = false;
  }
}
