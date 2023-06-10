// Hämta in referenser till HTML-elementen
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const clearButton = document.querySelector("#clear-list");
const list = document.querySelector("#task-list");

// Skapar metoder för respektive händelse
const onAddTask = (e) => {
    e.preventDefault();
    // Hämtar värdet ifrån task-input textrutan
    const task = input.value;

    // Kontrollera att textrutan innehåller ett värde
    if (task === "") {
        alert("Du måste ange en vara");

        return;
    }

    // Lägga till uppgiften till listan
    addTaskToDom(task);
    // Återställer textrutan efter att en uppgift har lagts till
    input.value = "";
};

const addTaskToDom = (task) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(task));
    item.appendChild(createIconButton("btn-remove text-red"));

    list.appendChild(item);

    console.log(item);
};

const onClearList = (e) => {
    // sålänge det finns ett barn i listan
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};

const createIconButton = (classes) => {
    const button = document.createElement("button");
    button.className = classes;
    button.appendChild(createIcon("fa-regular fa-trash-can"));
    return button;
};

const createIcon = (classes) => {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
};

// Koppla händelser till elementen
form.addEventListener("submit", onAddTask);
clearButton.addEventListener("click", onClearList);
