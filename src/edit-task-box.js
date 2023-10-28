import { createTaskForms, createFilledInputs } from "./task-forms";
import { Task } from "./task";
import { createInprogressTaskCard } from "./task-card";
import PubSub from "pubsub-js";
import * as taskBox from "./task-box";

export function createEditTaskBox(task) {
  const id = new Date().getTime();

  const initialInputs = createFilledInputs(
    task.name,
    task.description,
    task.project,
    task.dueDate,
    task.urgency,
  );
  const inputs = createFilledInputs(
    task.name,
    task.description,
    task.project,
    task.dueDate,
    task.urgency,
  );

  const title = taskBox.createTitle("Edit Task");

  const forms = createTaskForms(inputs);

  const editTaskButton = taskBox.createActionTaskButton("Edit", () => {
    if (forms.areFormsValid()) {
      PubSub.publish("closeEditTaskBox", {
        id: id,
        taskCard: createInprogressTaskCard(
          new Task(
            inputs.name,
            inputs.description,
            inputs.dueDate,
            inputs.urgency,
            inputs.project,
          ),
        ),
      });
    }
  });

  const closeButton = taskBox.createCloseButton(() =>
    PubSub.publish("closeEditTaskBox", {
      id: id,
      taskCard: createInprogressTaskCard(
        new Task(
          initialInputs.name,
          initialInputs.description,
          initialInputs.dueDate,
          initialInputs.urgency,
          initialInputs.project,
        ),
      ),
    }),
  );

  const buttonContainer = taskBox.createButtonContainer(
    editTaskButton,
    closeButton,
  );

  const element = taskBox.createElement(title, forms, buttonContainer);

  const get = () => element;

  return {
    get,
    id,
    inputs,
  };
}
