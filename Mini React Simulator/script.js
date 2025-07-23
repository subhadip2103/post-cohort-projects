let todolist = [];

let taskdisplay = document.querySelector('.todo-display');
let taskinput = document.querySelector('.task-input');

function addTodo() {
    if (taskinput.value.trim() === '') return; // avoid empty todos

    todolist.push({
        title: taskinput.value
    });
    taskinput.value = ''; // reset input
    render();
}

function deleteLastTodo() {
    todolist.pop();
    render();
}

function deleteFirstTodo() {
    todolist.shift();
    render();
}

function createTodoComponent(todo) {
    let div = document.createElement('div');
    let h3 = document.createElement('h3');
    let button = document.createElement('button');

    h3.innerHTML = todo.title;
    button.innerHTML = 'DELETE';

    button.addEventListener('click', () => {
        // delete this specific todo from todolist
        let index = todolist.indexOf(todo);
        if (index !== -1) {
            todolist.splice(index, 1);
            render();
        }
    });

    div.appendChild(h3);
    div.appendChild(button);
    return div;
}

function render() {
    taskdisplay.innerHTML = '';

    for (let i = 0; i < todolist.length; i++) {
        let element = createTodoComponent(todolist[i]);
        taskdisplay.appendChild(element);
    }
}
