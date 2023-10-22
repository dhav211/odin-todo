import { DateTime } from "luxon";

export class Task {
    constructor(name, description, dueDate, urgency, project) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.urgency = urgency;
        this.creationDate = DateTime.now();
        this.project = project;
    }
}