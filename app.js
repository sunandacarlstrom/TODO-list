// Hämta in referenser till HTML-elementen
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const clearButton = document.querySelector("#clear-list");
const filterInput = document.querySelector("#filter");
const list = document.querySelector("#task-list");

const onDisplayTasks = () => {
    // Hämta från storage och placera i DOM
    const tasks = getFromStorage();
    // för varje sak som finns här i listan ska anropa funktionen "addTaskToDom"
    tasks.forEach((item) => addTaskToDom(item));

    updateUI();
};

// Lagra referensen till felmeddelandet när det skapas
// Detta görs med variabeln "errorMessageElement" beroende på om det redan finns ett felmeddelande eller inte
let errorMessageElement;

// Skapar metoder för respektive händelse
const onAddTask = (e) => {
    // Förhindra standardbeteendet hos ett händelseobjekt, i detta fall vill jag inte ladda om sidan eller skicka formuläret till en ny sida
    e.preventDefault();
    // Hämtar värdet ifrån task-input textrutan
    const task = input.value;

    // Kontrollera att textrutan innehåller ett värde
    if (task === "") {
        // Skapar ett felmeddelande med hjälp av funktionen "createErrorMessage"
        const errorMsg = createErrorMessage("Du måste ange en uppgift att utföra!");

        // Om det redan finns ett felmeddelande på sidan tas det befintliga meddelandet bort med "errorMessageElement.remove()"
        if (errorMessageElement) {
            errorMessageElement.remove();
        }

        // Variabeln "errorMessageElement" tilldelas ett nytt värde dvs. värdet av errorMsg
        errorMessageElement = errorMsg;
        // Slutligen läggs felmeddelandet till i DOM genom att använda appendChild-metoden på ".error-message-container"-elementet
        document.querySelector(".error-message-container").appendChild(errorMsg);

        return;
    }

    // Ta bort felmeddelandet när användaren skriver in någoting i input-rutan
    if (errorMessageElement) {
        // Om task inte är tomt dvs. det finns en uppgift inskriven i input-rutan, kontrolleras om "errorMessageElement" innehåller en referens till ett felmeddelande.
        // Om så är fallet, tas det befintliga felmeddelandet bort från DOM genom att använda errorMessageElement.remove() och errorMessageElement återställs till null.
        errorMessageElement.remove();
        errorMessageElement = null;
    }

    // Lägga till uppgiften till listan
    addTaskToDom(task);
    // Lägga till uppgiften till localStorage
    addToStorage(task);
    // Återställer textrutan efter att en uppgift har lagts till
    updateUI();
};

const addTaskToDom = (task) => {
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(task));
    item.appendChild(createIconButton("btn-remove text-red"));

    list.appendChild(item);

    console.log(item);
};

const addToStorage = (task) => {
    // Kontrollera om vi redan har någonting i vår storage
    const tasks = getFromStorage();

    // pushar in den nya uppgiften i listan
    tasks.push(task);

    // lägger detta till nyckeln "tasks", men jag måste göra om detta till en korrekt sträng med JSON.stringify()
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getFromStorage = () => {
    let items;

    // Kontrollerar om localStorage innehåller nycklen "tasks"
    if (localStorage.getItem("tasks") === null) {
        // skapar en ny tom array
        items = [];
        // om den finns vill jag retunera localStorage, men eftersom loclastorage lagrar allting som strängar
        // därför måste jag göra om objekt/arrayer som lagras i localStorage till strängar men om jag hämta tillbaka måste jag göra om det till dess ursprung med JSON.parse()
    } else {
        items = JSON.parse(localStorage.getItem("tasks"));
    }

    return items;
};

const removeFromStorage = (task) => {
    // Hämtar in alla element i listan
    let tasks = getFromStorage();

    // Skapar en ny array med .filter med allt som finns där minus det jag vill ta bort
    tasks = tasks.filter((item) => item !== task);

    // anropa det som finns i localStorage och skriver över det som finns i min nya lista
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const onClickTask = (e) => {
    if (e.target.parentElement.classList.contains("btn-remove")) {
        removeTask(e.target.parentElement.parentElement);
    }

    updateUI();
};

const onClearList = (e) => {
    // sålänge det finns ett barn i listan
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    // raderar ett eller flera objekt i localStorage
    localStorage.removeItem("tasks");

    updateUI();
};

const onFilterTasks = (e) => {
    // Hämtar alla <li>-element i listan
    const tasks = document.querySelectorAll("li");
    // Gör om alla söäkninbgar till litenm bokstav för en mer exakt sökning
    const value = e.target.value.toLowerCase();

    // filtrerar på de ord som innehåller angiven bokstav genom att loopa igenom varje element i arrayen "tasks"
    tasks.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        // Kontrollera om värdet i varabeln "value" förekommer i "itemName"
        // Med metoden indexOf() kan jag göra en sökning efter en delsträng i en sträng
        if (itemName.indexOf(value) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
};

const removeTask = (item) => {
    // raderar i DOM
    item.remove();

    // samtidigt raderar ett objekt i localStorage
    removeFromStorage(item.textContent);
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

const createErrorMessage = (text) => {
    const div = document.createElement("div");
    div.id = "error-message";
    const textContent = document.createTextNode(text);
    div.classList.add("error-message");
    div.appendChild(textContent);
    return div;
};

const updateUI = () => {
    input.value = "";

    // Hämta alla <li>-element på sidan och lagra dem i en variabel som heter "tasks"
    const tasks = document.querySelectorAll("li");

    // Kontrollera ifall det inte finns någoting i min lista då ska Sök-filtrering och Töm listan-knappen vara dold
    if (tasks.length === 0) {
        clearButton.style.display = "none";
        filterInput.style.display = "none";
    } else {
        clearButton.style.display = "block";
        filterInput.style.display = "block";
    }
};

// Koppla händelser till elementen
document.addEventListener("DOMContentLoaded", onDisplayTasks);
form.addEventListener("submit", onAddTask);
clearButton.addEventListener("click", onClearList);
list.addEventListener("click", onClickTask);
filterInput.addEventListener("input", onFilterTasks);
