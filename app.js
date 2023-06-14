// Hämta in referenser till HTML-elementen
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const clearButton = document.querySelector("#clear-list");
const filterInput = document.querySelector("#filter");
const list = document.querySelector("#task-list");
const saveButton = form.querySelector("button");

// Skapar en variabel som jag sätter till false som standard
let isInEditMode = false;

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
const onSaveTask = (e) => {
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
        const errorContainer = document.querySelector(".error-message-container");
        if (errorContainer) {
            errorContainer.appendChild(errorMsg);
        }

        return; 
    }

    // Ta bort felmeddelandet när användaren skriver in någoting i input-rutan
    if (errorMessageElement) {
        // Om task inte är tomt dvs. det finns en uppgift inskriven i input-rutan, kontrolleras om "errorMessageElement" innehåller en referens till ett felmeddelande.
        // Om så är fallet, tas det befintliga felmeddelandet bort från DOM genom att använda errorMessageElement.remove() och errorMessageElement återställs till null.
        errorMessageElement.remove();
        errorMessageElement = null;
    }

    // Radera och lägga tillbaka på nytt (pga ingen idé att göra en uppdatering i localStorage)
    if (isInEditMode) {
        const taskToUpdate = list.querySelector(".edit-mode");
        // anropa metoden för att ta bort ur mitt localStorage
        removeFromStorage(taskToUpdate.textContent);
        // ta bort klassen
        taskToUpdate.classList.remove(".edit-mode");
        // ta bort från DOM
        taskToUpdate.remove();
        // justera isInEditMode
        isInEditMode = false;
    } else {
        // Kontrollera om en uppgift redan står i listan, annars dyker ett felmeddelande upp!
        if (checkIfTaskExists(task)) {
            const errorMsg = createErrorMessage(`${task} finns redan i listan`);
            const messageContainer = document.querySelector(".error-message-container");
            // Kontrollera om "errorMessageElement" är null innan remove()-metoden.
            if (messageContainer) {
                messageContainer.appendChild(errorMsg);
            }

            // Felmeddelandet försvinner efter 3s
            setTimeout(() => {
                const msg = document.querySelector("#error-message");
                if (msg) {
                    msg.remove();
                }
            }, 3000);

            return;
        }
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
        // annars fånga hela <li>-elementet
    } else {
        editTask(e.target);
    }
};

const checkIfTaskExists = (task) => {
    // Hämta ifrån localStorage
    const taskFromStorage = getFromStorage();
    // istället för att skriva en if-sats så kan jag direkt skriva return med följande påstående
    return taskFromStorage.includes(task);
};

const editTask = (task) => {
    // Ändra utseende när jag är i edit-mode
    isInEditMode = true;

    // Jag vill att endast ett <li>-element i taget ska markeras i listan vid editering
    list.querySelectorAll("li").forEach((item) => item.classList.remove("edit-mode"));

    // Ändrar UI för <li>-elementet i listan som har klickats på... och lägg-till knappen
    task.classList.add("edit-mode");
    saveButton.classList.add("btn-edit");
    saveButton.innerHTML = '<i class="fas fa-pencil-alt"></i> Redigera';

    // När jag markerar ett objekt i listan vill jag flytta upp den i input-rutan igen
    input.value = task.textContent;
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

    // Justera texten på knappen dynamiskt
    saveButton.innerHTML = '<i class="fa-solid fa-plus"></i> Lägg till';
    saveButton.classList.remove("btn-edit");
    saveButton.classList.add("btn-primary");

    isInEditMode = false;
};

// Koppla händelser till elementen
document.addEventListener("DOMContentLoaded", onDisplayTasks);
form.addEventListener("submit", onSaveTask);
clearButton.addEventListener("click", onClearList);
list.addEventListener("click", onClickTask);
filterInput.addEventListener("input", onFilterTasks);
