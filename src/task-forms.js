import { DateTime } from "luxon";
import { getAllListNames } from "./task-lists";

export function createEmptyInputs() {
    return {
        name: undefined,
        description: undefined,
        project: "General",
        dueDate: DateTime.now(),
        urgency: undefined
    }
}

export function createFilledInputs(name, description, project, dueDate, urgency) {
    return {
        name: name,
        description: description,
        project: project,
        dueDate: dueDate,
        urgency: urgency
    }
}

export function createTaskForms(inputs) {
    const nameForm = (() => {
        const _form = document.createElement("form");
        _form.classList.add("task-box-form");
    
        const _label = document.createElement("label");
        _label.textContent = "Name:";
    
        const _input = document.createElement("input");
        _input.classList.add("full-width");
        _input.type = "text";
        _input.id = "task-name";
        _input.name = "taskName";
        _input.addEventListener("input", (e) => inputs.name = e.target.value);

        if (inputs.name !== undefined) {
            _input.value = inputs.name;
        }
    
        const _errorMessage = document.createElement('p');
        _errorMessage.classList.add("error-message");
    
        _form.replaceChildren(_label, document.createElement("br"), _input, _errorMessage);

        _form.addEventListener("submit", (e) => e.preventDefault());
    
        const getForm = () => _form;
    
        const isValid = () => {
            if (_input.value.length > 0) {
                setErrorMessage("");
                return true;
            } else {
                setErrorMessage("Required");
                return false;
            }
        };
    
        const setErrorMessage = (msg) => _errorMessage.textContent = msg;
    
        const clear = () => {
            _form.reset();
            setErrorMessage("");
        };
    
        return {
            getForm,
            isValid,
            setErrorMessage,
            clear
        }
    
    
    })();
    
    const descriptionForm = (() => {
        const _form = document.createElement("form");
        _form.classList.add("task-box-form");
    
        const _label = document.createElement("label");
        _label.textContent = "Description:";
    
        const _input = document.createElement("textarea");
        _input.classList.add("full-width");
        _input.id = "task-description";
        _input.name = "taskDescription";
        _input.addEventListener("input", (e) => inputs.description = e.target.value);

        if (inputs.description !== undefined) {
            _input.value = inputs.description;
        }
    
        const _errorMessage = document.createElement('p');
        _errorMessage.classList.add("error-message");
    
        _form.replaceChildren(_label, document.createElement("br"), _input, _errorMessage);
    
        const getForm = () => _form;
    
        const isValid = () => true;
    
        const setErrorMessage = (msg) => _errorMessage.textContent = msg;
    
        const clear = () => {
            _form.reset();
            setErrorMessage("");
        };

        _form.addEventListener("submit", (e) => e.preventDefault());
    
        return {
            getForm,
            isValid,
            setErrorMessage,
            clear
        }
    })();
    
    const projectForm = (() => {
        const _form = document.createElement("form");
        _form.classList.add("task-box-form");
    
        const _label = document.createElement("label");
        _label.textContent = "Project:";
    
        const createInput = () => {
            const selectable = document.createElement("select");
            selectable.classList.add("full-width");
            selectable.id = "task-project";
            selectable.name = "taskProject";
    
            const setProjectOption = (listName) => {
                const option = document.createElement("option");
                option.textContent = listName;
                option.addEventListener("click", (_e) => inputs.project = listName);
            
                return option;
            }
    
            const options = getAllListNames().map((name) => setProjectOption(name));
            selectable.replaceChildren(...options);
    
            return selectable;
        }
    
        let _input = createInput();
    
        const _errorMessage = document.createElement('p');
        _errorMessage.classList.add("error-message");
    
        _form.replaceChildren(_label, document.createElement("br"), _input, _errorMessage);
    
        const getForm = () => {
            _input = createInput();
            _form.replaceChildren(_label, document.createElement("br"), _input, _errorMessage);
            return _form;
        };
    
        const isValid = () => true;
    
        const setErrorMessage = (msg) => _errorMessage.textContent = msg;
    
        const clear = () => {
            _form.reset();
            setErrorMessage("");
        };
    
        return {
            getForm,
            isValid,
            setErrorMessage,
            clear
        }
    })();
    
    const dueDateForm = (() => {
        const _form = document.createElement("form");
        _form.classList.add("task-box-form");
    
        const _label = document.createElement("label");
        _label.textContent = "Due Date:";
    
        const _input = document.createElement("input");
        _input.type = "date";
        _input.id = "task-due-date";
        _input.name = "task-due-date";
        _input.valueAsDate = inputs.dueDate.toJSDate();
        _input.addEventListener("change", (e) => inputs.dueDate = e.target.value);
    
        const _errorMessage = document.createElement('p');
        _errorMessage.classList.add("error-message");
    
        _form.replaceChildren(_label, document.createElement('br'), _input, _errorMessage);
    
        const getForm = () => _form;
    
        const isValid = () => {
            if (_input.value === "") {
                setErrorMessage("Required");
                return false;
            }

            const createdDate = new DateTime(_input.valueAsDate);
            //createdDate.setHours(0,0,0);  this may cause issues depending on time of day because javascript dates are fucking insane
            const todaysDate = DateTime.now();

            if (createdDate.day < todaysDate.day &&
                createdDate.year < todaysDate.year &&
                createdDate.month < todaysDate.month) {
                setErrorMessage("Due Date can't be before today");
                return false;
            }
            
            setErrorMessage("");
            return true;
        };
    
        const setErrorMessage = (msg) => _errorMessage.textContent = msg;
    
        const clear = () => {
            _form.reset();
            setErrorMessage("");
        };
    
        return {
            getForm,
            isValid,
            setErrorMessage,
            clear
        }
    
    })();
    
    const urgencyForm = (() => {
        const _form = document.createElement('form');
        _form.classList.add("task-box-form");
    
        const _label = document.createElement("label");
        _label.textContent= "Urgency:";
    
        const _input = (() => {
            const urgencyButtonContainer = document.createElement('div');
            urgencyButtonContainer.id = "urgency-button-container";
    
            const urgencyTitles = ["High", "Med", "Low"];
            
            for (let title in urgencyTitles) {
                const buttonContainer = document.createElement('div');
                const button = document.createElement("input");
                button.type = "radio";
                button.name = "urgency";
                button.value = urgencyTitles[title].toLowerCase();
                
                if (inputs.urgency !== undefined && inputs.urgency === Number(title)) {
                    button.checked = true;
                }

                button.addEventListener("click", (_e) => {
                    inputs.urgency = title;
                });
    
                const buttonLabel = document.createElement("label");
                buttonLabel.textContent = urgencyTitles[title];
                buttonContainer.replaceChildren(button, buttonLabel);
                urgencyButtonContainer.appendChild(buttonContainer);
            }
    
            return urgencyButtonContainer
        })();
    
        const _errorMessage = document.createElement('p');
        _errorMessage.classList.add("error-message");
    
        _form.replaceChildren(_label, document.createElement('br'), _input, _errorMessage);
    
        const getForm = () => _form;
    
        const isValid = () => {
            if (inputs.urgency === undefined) {
                setErrorMessage("Required");
                return false;
            }
    
            setErrorMessage("");
            return true;
        };
    
        const setErrorMessage = (msg) => _errorMessage.textContent = msg;
    
        const clear = () => {
            _form.reset();
            setErrorMessage("");
        };
    
        return {
            getForm,
            isValid,
            setErrorMessage,
            clear
        }
    })();

    const areFormsValid = () => {
        if (!nameForm.isValid()) {
            return false;
        }
    
        if (!dueDateForm.isValid()) {
            return false;
        }
    
        if (!urgencyForm.isValid()) {
            return false;
        }
    
        return true;
    }

    const clearAll = () => {
        nameForm.clear();
        descriptionForm.clear();
        projectForm.clear();
        dueDateForm.clear();
        urgencyForm.clear();
    };

    const getAll = () => {
        return [nameForm.getForm(), descriptionForm.getForm(), projectForm.getForm(), dueDateForm.getForm(), urgencyForm.getForm()];
    };

    return {
        nameForm,
        descriptionForm,
        projectForm,
        dueDateForm,
        urgencyForm,
        areFormsValid,
        clearAll,
        getAll
    };
}