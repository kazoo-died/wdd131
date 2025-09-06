// getdates.js

// Insert the current year into the <span id="currentyear">
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Insert the last modified date into the <p id="lastModified">
document.getElementById("lastModified").textContent = "Last Modification: " + document.lastModified;
