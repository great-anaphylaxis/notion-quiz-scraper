const container = document.getElementById("list");
const items = [];

let index = -1;
let dataString = "";

function getData() {
    fetch("/data").then(response => response.json()).then(response => onDataReceived(response));
    container.innerText = "Loading... Wait for 2mins (estimated)";
}

function onDataReceived(data) {
    container.innerHTML = "";

    for (const key of data) {
        console.log(key);
        
        dataString += `${key.question}©${key.answer}®`;
        createItem(key.question, key.answer);
    }

    createItem("Formatted text", dataString)
}

function createItem(question, answer) {
    const details = document.createElement("details");
    details.classList.add("item");

    const summary = document.createElement("summary");
    summary.innerText = question;

    const p = document.createElement("p");
    p.innerText = answer;

    details.appendChild(summary);
    details.appendChild(p);
    
    container.appendChild(details);

    items.push(details);
    return details;
}

function updateItemIndex(num) {
    if (index != -1) {
        items[index].classList.remove("selected");
        items[index].open = false;
    }

    index = num;

    items[index].classList.add("selected");
    items[index].scrollIntoView({
        block: 'center',
        behavior: 'smooth',
    });
}

addEventListener("keydown", e => {
    if (e.key == "ArrowUp") {
        e.preventDefault();
        if (index == -1 || index == 0) {
            updateItemIndex(items.length - 1);
        }

        else {
            updateItemIndex(index - 1);
        }
    }

    if (e.key == "ArrowDown") {
        e.preventDefault();

        const num = index + 1;

        if (num > items.length - 1) {
            updateItemIndex(0)
        }

        else {
            updateItemIndex(num);
        }
    }

    if (e.key == "Enter") {
        e.preventDefault();
        
        const item = items[index];

        item.open = !item.open;
    }
})

getData();

