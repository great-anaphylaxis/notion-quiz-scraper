const container = document.getElementById("list");

function getData() {
    fetch("/data").then(response => response.json()).then(response => onDataReceived(response));
    container.innerText = "Loading... Wait for 10s (estimated)";
}

function onDataReceived(data) {
    container.innerHTML = "";

    for (const key of data) {
        console.log(key)
        createItem(key.question, key.answer);
    }
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
}

getData();

