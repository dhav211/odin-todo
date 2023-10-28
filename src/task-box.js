export function createTitle(title) {
  const t = document.createElement("h2");
  t.classList.add("banner-header");
  t.textContent = title;

  return t;
}

export function createActionTaskButton(text, onClickCallback) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList = "add-task-button";
  button.addEventListener("click", onClickCallback);

  return button;
}

export function createCloseButton(onClickCallback) {
  const button = document.createElement("button");
  button.textContent = "Cancel";
  button.classList = "add-task-button";
  button.addEventListener("click", onClickCallback);

  return button;
}

export function createButtonContainer(actionButton, closeButton) {
  const container = document.createElement("div");
  container.style.marginTop = "2em";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.gap = "3rem";

  container.replaceChildren(actionButton, closeButton);

  return container;
}

export function createElement(title, forms, buttonContainer) {
  const e = document.createElement("div");
  e.classList.add("card");
  e.classList.add("task-box");
  e.replaceChildren(title, ...forms.getAll(), buttonContainer);

  return e;
}
