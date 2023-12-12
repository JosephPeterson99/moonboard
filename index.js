document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("headerClock").addEventListener("load", showTime);
	document.getElementById("quickPins").addEventListener("load", populateQuickPins);
    window.addEventListener("resize", populateQuickPins);
    showTime();
    populateQuickPins();
});

// Quick Pins variables
let qpList = [];
let qpIdx = 0;


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
    // Adjust these values as needed
    const maxPins = 12;
    const pinWidth = 95; // Estimated width of a pin

    const screenWidth = window.innerWidth;
    const possiblePins = Math.floor(screenWidth / pinWidth);

    return Math.min(possiblePins, maxPins);
}

async function populateQuickPins() {
    let maxQP = calculateMaxQP();
    qpList = (await getQP())['pins'];

    const quickPins = document.getElementById("quickPins");
    quickPins.innerHTML = '';

    // Populate with actual items from qpList
    for (let i = qpIdx; i < qpIdx + maxQP && i < qpList.length; i++) {
        let qpItem = qpList[i]; // Get individual item
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
    }

    // Calculate the number of remaining spots to fill
    let filledSpots = quickPins.children.length;
    let remainingSpots = maxQP - filledSpots;

    // Fill remaining spots with blank or 'add' divs
    for (let j = 0; j < remainingSpots; j++) {
        let divToAdd = (j === remainingSpots) ? addDiv.cloneNode(true) : blankDiv.cloneNode(true);
        quickPins.appendChild(divToAdd);
    }
}

// Ensure addDiv and blankDiv are available globally or within the same scope as populateQuickPins
let blankDiv = document.createElement('div');
blankDiv.className = 'col';
blankDiv.innerHTML = `
    <div class="squircleIcon">
        <a href="#" class='squircleIcon'>
            <img class="squircleWhite" src="icons/white.png" width="65vw" height="65vw">
            <img class="squircleImage" src="icons/blank.png" width="65vw" height="65vw">
        </a>
    </div>
`;

let addDiv = document.createElement('div');
addDiv.className = 'col';
addDiv.innerHTML = `
    <div class="squircleIcon">
        <a href="#" class='squircleIcon'>
            <img class="squircleWhite" src="icons/white.png" width="65vw" height="65vw">
            <img class="squircleImage" src="icons/add.png" width="65vw" height="65vw">
        </a>
    </div>
`;