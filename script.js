const container = document.getElementById("list");

function getData() {
    fetch("/data").then(response => response.json()).then(response => onDataReceived(response))
}

function onDataReceived(data) {
    console.log(data);
    for (const key of data) {
        console.log(key)
        createItem(key.question, key.answer);
    }
}

function createItem(question, answer) {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerText = question + ": " + answer;
    
    container.appendChild(div);
}

getData();

