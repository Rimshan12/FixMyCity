
// Check whether the user is logged in
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Allow only Citizens to access complaint tracking
if (localStorage.getItem("currentUserRole") !== "Citizen") {
    alert("Access denied. This page is for citizens only.");
    window.location.href = "login.html";
}

// Track complaint using reference number
function trackComplaint() {

    let referenceNumber = document
        .getElementById("referenceNumber")
        .value.trim().toUpperCase();

    let result = document.getElementById("trackingResult");

    result.innerHTML = "";

    if (referenceNumber === "") {
        result.textContent = "Please enter a complaint reference number.";
        result.className = "tracking-error";
        return;
    }

    let complaintCount =
        Number(localStorage.getItem("complaintCount")) || 0;

    let currentEmail = localStorage.getItem("currentUserEmail");

    let complaintFound = false;

    for (let i = 0; i < complaintCount; i++) {

        let prefix = "complaint_" + i + "_";

        let savedId = localStorage.getItem(prefix + "id");
        let citizenEmail = localStorage.getItem(prefix + "citizenEmail");

        // Match reference number and logged-in citizen
        if (savedId === referenceNumber &&
            citizenEmail === currentEmail) {

            complaintFound = true;

            let title = localStorage.getItem(prefix + "title");
            let category = localStorage.getItem(prefix + "category");
            let description = localStorage.getItem(prefix + "description");
            let location = localStorage.getItem(prefix + "location");
            let date = localStorage.getItem(prefix + "date");
            let status = localStorage.getItem(prefix + "status") || "Pending";
            let resolution = localStorage.getItem(prefix + "resolution");
            let photo = localStorage.getItem(prefix + "photo");

            // Create result card
            let card = document.createElement("div");
            card.className = "tracking-result-card";

            let heading = document.createElement("h3");
            heading.textContent = "Complaint Details";
            card.appendChild(heading);

            // Display complaint information
            let details = [
                "Reference Number: " + savedId,
                "Complaint Title: " + title,
                "Category: " + category,
                "Description: " + description,
                "Location: " + location,
                "Submitted Date: " + date
            ];

            details.forEach(function(detail) {
                let paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });

            // Display current status
            let statusParagraph = document.createElement("p");
            statusParagraph.textContent = "Current Status: ";

            let statusBadge = document.createElement("span");
            statusBadge.className = "status-badge " +
                status.toLowerCase().replace(/\s+/g, "-");
            statusBadge.textContent = status;

            statusParagraph.appendChild(statusBadge);
            card.appendChild(statusParagraph);

            // Display resolution details if available
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

            // Display complaint photograph if available
            if (photo && photo.trim() !== "") {

                let photoHeading = document.createElement("h4");
                photoHeading.textContent = "Uploaded Photograph";
                card.appendChild(photoHeading);

                let image = document.createElement("img");
                image.src = photo;
                image.alt = "Complaint photograph";
                image.style.width = "100%";
                image.style.maxWidth = "350px";
                image.style.marginTop = "10px";
                image.style.borderRadius = "8px";

                card.appendChild(image);
            }

            result.appendChild(card);
            result.className = "tracking-result";
            break;
        }
    }

    // Display error if complaint does not exist
    if (!complaintFound) {

        result.textContent =
            "Complaint not found. Please check your reference number.";

        result.className = "tracking-error";
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
