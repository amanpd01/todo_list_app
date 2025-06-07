const input = document.querySelector('#input');
const add_button = document.querySelector('#add-button');
const list_container = document.querySelector('.list-container');

let edit_mode = false;
let current_editing_data = null;

let task_list = localStorage.getItem("taskList");
if (task_list) {
    task_list = JSON.parse(task_list);
} else {
    task_list = [];
}

function save() {
    const all_tasks = document.querySelectorAll('.list-items');
    task_list = [];

    all_tasks.forEach(item => {
        const data = item.querySelector('.data').innerText;
        const is_completed = item.querySelector('.mark').innerText === "Completed";
        task_list.push({ data, completed: is_completed });
    });

    localStorage.setItem("taskList", JSON.stringify(task_list));
}

function create_task_element(text, completed = false) {
    const list_item = document.createElement('div');
    list_item.classList.add('list-items');

    const data = document.createElement('div');
    data.classList.add('data');
    data.innerText = text;

    const edit = document.createElement('span');
    edit.classList.add('edit');
    edit.innerText = "Edit";

    const remove = document.createElement('span');
    remove.classList.add('remove');
    remove.innerText = "Delete";

    const mark = document.createElement('span');
    mark.classList.add('mark');
    mark.innerText = completed ? "Completed" : "Mark";
    if (completed) {
        mark.style.backgroundColor = "lightgreen";
    }

    list_item.append(data, edit, remove, mark);
    list_container.appendChild(list_item);

    edit.addEventListener('click', () => {
        if (mark.innerText === "Completed") return;
        edit_mode = true;
        current_editing_data = data;
        input.value = data.innerText;
        input.focus();
        add_button.innerText = "Save";
    });

    remove.addEventListener('click', () => {
        list_item.remove();
        if (edit_mode && current_editing_data === data) {
            edit_mode = false;
            current_editing_data = null;
            input.value = "";
            add_button.innerText = "Add";
        }
        save();
    });

    mark.addEventListener('click', () => {
        mark.innerText = "Completed";
        mark.style.backgroundColor = "lightgreen";
        if (edit_mode && current_editing_data === data) {
            edit_mode = false;
            current_editing_data = null;
            input.value = "";
            add_button.innerText = "Add";
        }
        save();
    });
}

add_button.addEventListener("click", () => {
    const value = input.value.trim();
    if (value === "") {
        alert("Please enter a task!");
        return;
    }

    if (edit_mode) {
        current_editing_data.innerText = value;
        edit_mode = false;
        current_editing_data = null;
        add_button.innerText = "Add";
    } else {
        create_task_element(value);
    }

    input.value = "";
    save();
});

task_list.forEach(task => {
    create_task_element(task.data, task.completed);
});
