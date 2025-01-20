(() => {
    enum NotificationPlatform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }

    enum ViewMode {
        TODO = 'TODO',
        REMINDER = 'REMINDER',
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
            --|    Reminder    |--
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
        getTodo(form: HTMLFormElement): Todo {
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder(form: HTMLFormElement): Reminder {
            const reminderNotifications = [
                form.notifications.value as NotificationPlatform,
            ];
            const reminderDate = new Date(form.reminderDate.value);
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(
                reminderDescription,
                reminderDate,
                reminderNotifications,
            );
        },
        render(tasks: Array<ITask>, mode: ViewMode) {
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

            const todoSet = document.getElementById('todoSet');
            const reminderSet = document.getElementById('reminderSet');

            if (mode === ViewMode.TODO) {
                todoSet?.setAttribute('style', 'display: block');
                todoSet?.removeAttribute('disabled');
                reminderSet?.setAttribute('style', 'display: none');
                reminderSet?.setAttribute('disabled', 'true');
            } else {
                reminderSet?.setAttribute('style', 'display: block');
                reminderSet?.removeAttribute('disabled');
                todoSet?.setAttribute('style', 'display: none');
                todoSet?.setAttribute('disabled', 'true');
            }
        },
    };

    const TaskController = (view: typeof taskView) => {
        const tasks: Array<ITask> = [];
        let mode: ViewMode = ViewMode.TODO;

        const handleEvent = (event: Event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };

        const handleToggleMode = () => {
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO
                    break;
            }
            view.render(tasks, mode);
        }

        document.getElementById('toggleMode')
        ?.addEventListener('click', handleToggleMode);
        document.getElementById('taskForm')
        ?.addEventListener('submit', handleEvent);
    };

    TaskController(taskView);
}) ();
