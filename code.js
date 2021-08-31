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
    // create new list item with user input
    const newItem = document.createElement("li");
    newItem.innerText = userInput.value;
    newItem.classList.add("rank-item");
    // append the item div to rank list
    rankList.appendChild(newItem);
    // clear input value
    userInput.value = "";
}