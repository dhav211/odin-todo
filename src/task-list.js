export class TaskList {
    #tasks = [];

    constructor(name) {
        this.name = name;
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    removeTask(task) {
        const taskIndex = this.#tasks.indexOf(task);
        this.#tasks.splice(taskIndex);
    }

    sortByUrgency() {
        this.#tasks.sort((a,b) => a.urgency - b.urgency);
    }

    sortByDateAdded() {
        this.#tasks.sort((a,b) => a.creationDate.getTime() - b.creationDate.getTime());
    }

    sortyByDueDate() {
        this.#tasks.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    }
}