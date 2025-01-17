(() => {
    enum NotificationPlatform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }

    const UUID = (): string => {
        return Math.random().toString(32).substr(2, 9);
    };

    const dateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        today(): Date {
            return new Date();
        },
        formatDate(date: Date): string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        }
    };

    interface ITask {
        id: string;
        dateCreated: Date;
        dateUpdate: Date;
        description: string;
        render(): string;
    }

    class Reminder implements ITask {
        id: string = UUID();
        dateCreated: Date = dateUtils.today();
        dateUpdate: Date = dateUtils.today();
        description: string = '';

        date: Date = dateUtils.tomorrow();
        notifications: Array<NotificationPlatform> = [NotificationPlatform.EMAIL];

        constructor(description: string, date: Date, notifications: Array<NotificationPlatform>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
            return `
            ---> Reminder <---
            description: ${this.description}
            date: ${dateUtils.formatDate(this.date)}
            platform: ${this.notifications.join(', ')}
            `;
        }
    }

    class Todo implements ITask {
        id: string = UUID();
        dateCreated: Date = dateUtils.today();
        dateUpdate: Date = dateUtils.today();
        description: string = '';

        done: boolean = false;

        constructor(description: string) {
            this.description = description;
        }

        render(): string {
            return `
            ---> TODO <---
            description: ${this.description}
            done: ${this.done}
            `;
        }
    }

    const todo = new Todo('Todo criado com a classe')

    const reminder = new Reminder('Reminder criado com a classe', new Date(), [NotificationPlatform.EMAIL,
    ]);

    const taskView = {
        render(tasks: Array<ITask>) {
            const tasksList = document.getElementById('tasksList');
            while(tasksList?.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }

            tasks.forEach((task) => {
                const li = document.createElement('LI');
                const textNode = document.createTextNode(task.render());
                li?.appendChild(textNode);
                tasksList?.appendChild(li);
            });
        },
    };

    const TaskController = (view: typeof taskView) => {
        const tasks: Array<ITask> = [todo, reminder];

        const handleEvent = (event: Event) => {
            event.preventDefault();
            view.render(tasks);
        }

        document.getElementById('taskForm')
        ?.addEventListener('submit', handleEvent);
    };

    TaskController(taskView);
}) ();
