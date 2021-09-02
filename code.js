// SELECTORS
const userInput = document.querySelector(".user-input");
const addButton = document.querySelector(".add-button");
const rankList = document.querySelector(".rank-list");
const rows = document.querySelectorAll(".rank-row");

// EVENT LISTENERS
addButton.addEventListener("click", addItem);
rows.forEach(row => addDragListener(row));

rankList.addEventListener("dragover", event => {
    event.preventDefault();
    const draggedRow = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(event.clientY);
    if (afterElement == null) {
        rankList.appendChild(draggedRow);
    } else {
        rankList.insertBefore(draggedRow, afterElement);
    }
})


// add an event listener for a rank row
function addDragListener(row) {
    row.addEventListener("dragstart", () => {
        row.classList.add("dragging");
        console.log("DRAGGING");
    })
    row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        console.log("DROPPED");
    })
}

// create a new rank row and add it to the rank list
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
    // add a dragging event listener for the new row
    addDragListener(newRow);
    // clear input value
    userInput.value = "";
}


// get the rank-row that is right after the dragged rank-row
function getDragAfterElement(y) {
    // an array of all the rank-rows except for the one being dragged
    const rankRows = [...rankList.querySelectorAll(".rank-row:not(.dragging)")]
    console.log(rankRows);
    return rankRows.reduce((closest, child) => {
        // the bounding box of each rank-row
        const box = child.getBoundingClientRect();  
        // the vertical distance between the mouse and the middle of the box
        const offset = y - (box.top - (box.height/2));
        console.log(offset);
        // if offset is less than 0, there is at least one rank-row after the dragged rank-row
        // return the rank-row with the largest offset (closest rank-row after the dragged one)
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        // else return the current closest 
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY} ).element;
}
