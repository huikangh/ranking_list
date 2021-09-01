// selectors
const userInput = document.querySelector(".user-input");
const addButton = document.querySelector(".add-button");
const rankList = document.querySelector(".rank-list");

// event listeners
addButton.addEventListener("click", addItem);

// functions
function addItem(event) {
    //prevent form from submitting
    event.preventDefault(); 
    // create new rank row
    const newRow = document.createElement("div");
    newRow.classList.add("rank-row");
    newRow.draggable = true;
    // create new rank item with user input
    const newItem = document.createElement("li");
    newItem.classList.add("rank-item");
    newItem.innerText = userInput.value;
    // create delete button
    const newButton = document.createElement("button");
    newButton.classList.add("delete-btn");
    newButton.innerText = "DEL";
    // append rank-item and delete-btn to rank-row, then append rank-row to rank-list
    newRow.appendChild(newItem);
    newRow.appendChild(newButton);
    rankList.appendChild(newRow);
    // clear input value
    userInput.value = "";
}