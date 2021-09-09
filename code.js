// SELECTORS
const userInput = document.querySelector(".user-input");
const addButton = document.querySelector(".add-button");
const rankList = document.querySelector(".rank-list");
const rows = document.querySelectorAll(".rank-row");

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", loadLocalItems);
addButton.addEventListener("click", addItem);
rankList.addEventListener('click', deleteRow);
rows.forEach(row => addDragListener(row));



// event listener for reordering the dragged row
rankList.addEventListener("dragover", event => {
    event.preventDefault();
    const draggedRow = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(event.clientY);
    // move the dragged row and rearrange the rank list in html
    if (afterElement == null) {
        rankList.appendChild(draggedRow);
    } else {
        rankList.insertBefore(draggedRow, afterElement);
    }

    // update the ordering of the rank items in local storage
    // first, gather all the existing rank rows
    const rankRows = document.querySelectorAll(".rank-row");
    let localRankList = [];
    // then, for each rank row, retrieve its rank item value, and push to list
    rankRows.forEach(function(rankRow){
        localRankList.push(rankRow.children[0].innerText);
    })
    // finally, update the new list into local storage
    localStorage.setItem("localRankList", JSON.stringify(localRankList));

    // update rank row colors accordingly based on ranking
    updateColor();
})


// add an event listener for a rank row
function addDragListener(rankRow) {
    rankRow.addEventListener("dragstart", () => {
        rankRow.classList.add("dragging");
        updateColor();
    })
    rankRow.addEventListener("dragend", () => {
        rankRow.classList.remove("dragging");
        updateColor();
        
    })
}


// get the rank-row that is right after the dragged rank-row
function getDragAfterElement(y) {
    // an array of all the rank-rows except for the one being dragged
    const rankRows = [...rankList.querySelectorAll(".rank-row:not(.dragging)")]
    return rankRows.reduce((closest, child) => {
        // the bounding box of each rank-row
        const box = child.getBoundingClientRect();  
        // the vertical distance between the mouse and the middle of the box
        const offset = y - box.top - box.height/2;
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


// create a new rank row and add it to the rank list
function addItem(event) {
    //prevent form from submitting
    event.preventDefault();
    // add new rank item to local storage
    saveLocalItems(userInput.value);

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
    // update rank row colors accordingly based on ranking
    updateColor();
}


// if a delete button is being clicked, delete the corresponding rank row
function deleteRow(event) {
    // retrieve the item that is being clicked on
    const item = event.target;
    // if the clicked item is the delete button
    if (item.classList[0] == "delete-btn") {
        // retrieve the rank row that is being deleted
        rankRow = item.parentElement;
        // remove the rank row
        rankRow.remove();
        // remove the rank item from local storage by passing in the rank row
        removeLocalItems(rankRow);
    }
    // update rank row colors accordingly based on ranking
    updateColor();
}


// retrieve and return all existing rank items from local storage in a list
function retrieveLocal() {
    let localRankList;
    if (localStorage.getItem("localRankList") === null) {
        localRankList = [];
    } else {
        localRankList = JSON.parse(localStorage.getItem("localRankList"));
    }
    return localRankList;
}

// save the given rank item value in local storage
function saveLocalItems(itemValue) {
    let localRankList = retrieveLocal();
    // push the new rank item into the list, then update the list to local storage
    localRankList.push(itemValue);
    localStorage.setItem("localRankList", JSON.stringify(localRankList));
}


// given a rank row, remove the corresponding rank item from local storage
function removeLocalItems(rankRow) {
    let localRankList = retrieveLocal();
    // retrieve the content (rank item) from the rank row
    const itemValue = rankRow.children[0].innerText;
    // remove the rank item from the local storage
    localRankList.splice(localRankList.indexOf(itemValue), 1);
    // update local storage
    localStorage.setItem("localRankList", JSON.stringify(localRankList));
}


// load in the rank items from local storage to rank list when webpage initialize
function loadLocalItems() {
    let localRankList = retrieveLocal();
    // create a rank row for each rank item in the local storage
    localRankList.forEach(function(itemValue){
        // create new rank row
        const newRow = document.createElement("div");
        newRow.classList.add("rank-row");
        newRow.draggable = true;
        // create new rank item with user input
        const newItem = document.createElement("li");
        newItem.classList.add("rank-item");
        newItem.innerText = itemValue;
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
        // update rank row colors accordingly based on ranking
        updateColor();
    })
}

// change the background color of the top 3 rank rows to show priority
function updateColor() {
    const rankRows = [...document.querySelectorAll(".rank-row")];
    for (let i = 0; i<rankRows.length; i++) {
        if (i === 0) {
            rankRows[i].style.backgroundColor = 'rgb(247, 116, 116)';
        } else if (i === 1) {
            rankRows[i].style.backgroundColor = 'rgb(245, 176, 49)';
        } else if (i === 2) {
            rankRows[i].style.backgroundColor = 'rgb(245, 227, 66)';
        } else if (i === 3) {
            rankRows[i].style.backgroundColor = 'rgb(127, 214, 105)';
        } else if (i === 4) {
            rankRows[i].style.backgroundColor = 'rgb(135, 183, 222)';
        } else {
            rankRows[i].style.backgroundColor = 'rgb(225, 225, 225)';
        }
    }
    // when dragged, the dragged row will be white
    const draggedRow = document.querySelector(".dragging");
    if (draggedRow != null) {
        draggedRow.style.backgroundColor = 'rgb(225, 225, 225)';
    }
}