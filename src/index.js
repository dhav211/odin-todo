import './styles.css'
import { Task } from "./task";
import { Urgency } from "./urgency";
import { getHeader } from './header';
import { getTaskAreaContent, setListInTaskArea } from './task-area';
import { navMenu } from './navigator';
import PubSub from 'pubsub-js';
import { getAllTodaysTasks } from './task-lists';
import { DateTime } from 'luxon';

PubSub.publish("addTask", {project:"General", task: new Task("Wash laundry", "Do the laundry and let them dry", DateTime.now(), Urgency.Medium, "General")});
PubSub.publish("addTask", {project:"General", task: new Task("Pet kitty", "Give little kitty a good petting", DateTime.now(), Urgency.High, "General")});
PubSub.publish("addTask", {project:"General", task: new Task("Buy kitty food", "She needs both dry and wet food", DateTime.local(2023, 10, 29, 0, 0, 0, 0), Urgency.Low, "General")});


const content = document.createElement('div');
content.id = "content";
document.body.appendChild(getHeader());
content.appendChild(navMenu .get());
content.appendChild(getTaskAreaContent());
document.body.appendChild(content);
setListInTaskArea("General");
