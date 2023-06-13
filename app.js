// Hämta in referenser till HTML-elementen
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const clearButton = document.querySelector("#clear-list");
const filterInput = document.querySelector("#filter");
const list = document.querySelector("#task-list");

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

    updateUI();
};

const removeTask = (item) => {
    item.remove();
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
form.addEventListener("submit", onAddTask);
clearButton.addEventListener("click", onClearList);
list.addEventListener("click", onClickTask);
