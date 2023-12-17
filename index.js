document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("headerClock").addEventListener("load", showTime);
	document.getElementById("quickPins").addEventListener("load", populateQuickPins);
    window.addEventListener("resize", populateQuickPins);
    
    showTime();
    populateQuickPins();

});


// Clock //////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showTime(){ // This makes the clock go
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "am";
    
    if(h == 0){  h = 12; }
    
    if(h > 12){
        h = h - 12;
        session = "pm";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("headerClock").innerText = time;
    document.getElementById("headerClock").textContent = time;
    setTimeout(showTime, 1000);
}

// Quick Pins /////////////////////////////////////////////////////////////////////////////////////////////////////////

let qpList = [];
let qpIdx = 0;
let maxPins = 15;
let currentQP = 0;

async function getQP() {
    try {
        const response = await fetch("./data/quickPins.json");
        if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`);}
        const qpJSON = await response.json();
        return qpJSON;
    } catch {
        console.error("Error fetching quick pins:", error);
    }
}

function calculateMaxQP() {
    const pinWidth = 105; // Estimated width of a pin

    const screenWidth = window.innerWidth;
    const possiblePins = Math.floor(screenWidth / pinWidth);

    return Math.min(possiblePins, maxPins);
}

async function populateQuickPins() {
    let maxQP = calculateMaxQP();
    qpList = (await getQP())['pins'];
    currentQP = 0;

    const quickPins = document.getElementById("quickPins");
    quickPins.innerHTML = '';

    for (let i = qpIdx; i < qpIdx + maxQP && i < qpList.length; i++) {
        let qpItem = qpList[i];
        let qpDiv = document.createElement('div');
        qpDiv.className = 'col';
        qpDiv.innerHTML = `
            <div class="squircleIcon">
                <a href="${qpItem.url}" class='squircleIcon'>
                    <img class="squircleWhite" src="icons/white.png" width="65vw" height="65vw">
                    <img class="squircleImage" src="icons/${qpItem.icon}" width="65vw" height="65vw">
                </a>
            </div>
        `;
        quickPins.appendChild(qpDiv);
        currentQP = currentQP + 1;
    }

    let filledSpots = quickPins.children.length;
    let remainingSpots = maxQP - filledSpots;

    for (let j = 0; j < remainingSpots; j++) {
        let divToAdd = (j === remainingSpots) ? addDiv.cloneNode(true) : blankDiv.cloneNode(true);
        quickPins.appendChild(divToAdd);
    }
}

// async function moveQP(direction) {
//     if (direction == 'left') {
//         if (qpIdx > 0){
//             qpIdx = qpIdx - 1;
//         }
//     } else if (direction == 'right') {
//         if (qpIdx < calculateCurrentQP() && ) {
//             qpIdx = qpIdx + 1;
//         }
//     }
//     await populateQuickPins();
// }

let blankDiv = document.createElement('div');
blankDiv.className = 'col';
blankDiv.innerHTML = `
    <div class="squircleIcon" id="qpAddBtn">
        <a href="#" class='squircleIcon'>
            <img class="squircleWhite" src="icons/white.png" width="65vw" height="65vw">
            <img class="squircleImage" src="icons/add.png" width="65vw" height="65vw">
        </a>
    </div>
`;

let addDiv = document.createElement('div');
addDiv.className = 'col';
addDiv.innerHTML = `
    <div class="squircleIcon" id="qpAddBtn">
        <a href="#" class='squircleIcon'>
            <img class="squircleWhite" src="icons/white.png" width="65vw" height="65vw">
            <img class="squircleImage" src="icons/add.png" width="65vw" height="65vw">
        </a>
    </div>
`;

let qpAddModal = document.getElementById("qpAddModal");
let qpAddBtn = document.getElementById("qpAddBtn");
let qpCloseSpn = document.getElementsByClassName("qpCloseSpn")[0];

// qpLeft.onclick = function ()        { moveQP('left'); }
// qpRight.onclick = function()        { moveQP('right'); }
qpCloseSpn.onclick = function()     { qpAddModal.style.display = "none"; }
window.onclick = function(event)    { if (event.target == qpAddModal) { qpAddModal.style.display = "none"; } }