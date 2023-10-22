import { openAddTaskBox } from "./add-task-box";
import PubSub from "pubsub-js";

const headerLeft = document.createElement('div');
const headerCenter = document.createElement('div');
const headerRight = document.createElement('div');

const mobileQuery = window.matchMedia("(max-width: 560px)");
mobileQuery.addEventListener("change", setHamburgerMenu);

export function getHeader() {
    const header = document.createElement('header');
    header.id = "top-bar";

    setHamburgerMenu(mobileQuery);
    setLogo();
    setAddTaskButton();

    headerLeft.id = "left";
    headerRight.id = "right";
    headerCenter.id = "center";
    header.appendChild(headerLeft);
    header.appendChild(headerCenter);
    header.appendChild(headerRight);

    return header;
}

function setHamburgerMenu(query) {
    if (query.matches && headerLeft.children.length == 0) {
        // its a mobile screen so add the hamburger menu
        const hamburger = document.createElement('button');
        hamburger.id = "hamburger-menu";
        hamburger.classList.add("icon-button");
        hamburger.addEventListener("click", () => PubSub.publish("hamburgerMenuPressed"));
        headerLeft.appendChild(hamburger);
    } else if (!query.matches && headerLeft.children.length > 0) {
        headerLeft.removeChild(headerLeft.lastElementChild);
    }
}

function setLogo() {
    const logo = document.createElement('h1');
    logo.id = "logo";
    logo.textContent = "iDoIt";
    headerCenter.appendChild(logo);
}

function setAddTaskButton() {
    const addTaskButton = document.createElement('button');
    addTaskButton.id = "add-task-button";
    addTaskButton.classList.add("icon-button");
    addTaskButton.addEventListener("click", openAddTaskBox);
    headerRight.appendChild(addTaskButton);
}