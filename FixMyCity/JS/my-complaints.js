
// Check whether the user is logged in
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Allow only Citizens to access this page
if (localStorage.getItem("currentUserRole") !== "Citizen") {
    alert("Access denied. This page is for citizens only.");
    window.location.href = "login.html";
}

// Display all complaints submitted by the logged-in citizen
function displayMyComplaints() {

    let complaintList = document.getElementById("complaintList");

    let currentEmail = localStorage.getItem("currentUserEmail");
    let complaintCount = Number(localStorage.getItem("complaintCount")) || 0;

    complaintList.innerHTML = "";

    let foundComplaints = 0;

    for (let i = 0; i < complaintCount; i++) {

        let prefix = "complaint_" + i + "_";

        let citizenEmail = localStorage.getItem(prefix + "citizenEmail");

        // Display only complaints submitted by the current citizen
        if (citizenEmail === currentEmail) {

            foundComplaints++;

            let id = localStorage.getItem(prefix + "id");
            let title = localStorage.getItem(prefix + "title");
            let category = localStorage.getItem(prefix + "category");
            let location = localStorage.getItem(prefix + "location");
            let date = localStorage.getItem(prefix + "date");
            let status = localStorage.getItem(prefix + "status") || "Pending";
            let resolution = localStorage.getItem(prefix + "resolution");

            // Create complaint card
            let card = document.createElement("div");
            card.className = "my-complaint-card";

            // Complaint title
            let heading = document.createElement("h3");
            heading.textContent = title;
            card.appendChild(heading);

            // Complaint details
            let details = [
                "Reference Number: " + id,
                "Category: " + category,
                "Location: " + location,
                "Submitted Date: " + date
            ];

            details.forEach(function(detail) {
                let paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });

            // Status badge
            let statusParagraph = document.createElement("p");
            statusParagraph.textContent = "Current Status: ";

            let statusBadge = document.createElement("span");
            statusBadge.className = "status-badge " +
                status.toLowerCase().replace(/\s+/g, "-");
            statusBadge.textContent = status;

            statusParagraph.appendChild(statusBadge);
            card.appendChild(statusParagraph);

            // Show resolution details when available
            if (resolution && resolution.trim() !== "") {

                let resolutionBox = document.createElement("div");
                resolutionBox.className = "resolution-details";

                let resolutionHeading = document.createElement("h4");
                resolutionHeading.textContent = "Resolution Details";

                let resolutionText = document.createElement("p");
                resolutionText.textContent = resolution;

                resolutionBox.appendChild(resolutionHeading);
                resolutionBox.appendChild(resolutionText);

                card.appendChild(resolutionBox);
            }

            complaintList.appendChild(card);
        }
    }

    // Display message if no complaints are available
    if (foundComplaints === 0) {

        let message = document.createElement("div");
        message.className = "no-complaints";

        let heading = document.createElement("h3");
        heading.textContent = "No Complaints Found";

        let paragraph = document.createElement("p");
        paragraph.textContent =
            "You have not submitted any complaints yet.";

        message.appendChild(heading);
        message.appendChild(paragraph);

        complaintList.appendChild(message);
    }
}

// Logout function
function logout() {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("currentUserEmail");
    localStorage.removeItem("currentUserRole");
    localStorage.removeItem("currentUserDepartment");

    window.location.href = "login.html";
}

// Load complaints when the page opens
displayMyComplaints();
