
// Check Department Staff login
if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("currentUserRole") !== "Department Staff"
) {
    window.location.href = "login.html";
} else {

    // Display staff information
    document.getElementById("staffName").textContent =
        localStorage.getItem("currentUserName") || "Staff Member";

    document.getElementById("staffDepartment").textContent =
        localStorage.getItem("currentUserDepartment") || "Not specified";


    // Display assigned complaints
    function displayStaffComplaints() {

        let complaintCount =
            Number(localStorage.getItem("complaintCount")) || 0;

        let currentEmail =
            localStorage.getItem("currentUserEmail");

        let complaintList =
            document.getElementById("staffComplaintList");

        let total = 0;
        let pending = 0;
        let progress = 0;
        let resolved = 0;

        complaintList.innerHTML = "";

        for (let i = 0; i < complaintCount; i++) {

            let prefix = "complaint_" + i + "_";

            let assignedEmail =
                localStorage.getItem(prefix + "assignedStaffEmail");

            // Show only complaints assigned to this staff member
            if (assignedEmail === currentEmail) {

                let id = localStorage.getItem(prefix + "id");
                let title = localStorage.getItem(prefix + "title");
                let category = localStorage.getItem(prefix + "category");
                let description = localStorage.getItem(prefix + "description");
                let location = localStorage.getItem(prefix + "location");
                let date = localStorage.getItem(prefix + "date");

                let status =
                    localStorage.getItem(prefix + "status") || "Pending";

                let resolution =
                    localStorage.getItem(prefix + "resolution") || "";

                total++;

                if (status === "Pending") {
                    pending++;
                } else if (status === "In Progress") {
                    progress++;
                } else if (status === "Resolved") {
                    resolved++;
                }

                // Create complaint card
                let card = document.createElement("div");
                card.className = "staff-complaint-card";

                let heading = document.createElement("h3");
                heading.textContent = title;

                let reference = document.createElement("p");
                reference.textContent = "Reference Number: " + id;

                let categoryText = document.createElement("p");
                categoryText.textContent = "Category: " + category;

                let descriptionText = document.createElement("p");
                descriptionText.textContent =
                    "Description: " + description;

                let locationText = document.createElement("p");
                locationText.textContent = "Location: " + location;

                let dateText = document.createElement("p");
                dateText.textContent = "Date: " + date;

                let statusLabel = document.createElement("label");
                statusLabel.textContent = "Update Status:";

                let statusSelect = document.createElement("select");

                ["Pending", "In Progress", "Resolved"].forEach(
                    function(value) {

                        let option = document.createElement("option");
                        option.value = value;
                        option.textContent = value;

                        if (value === status) {
                            option.selected = true;
                        }

                        statusSelect.appendChild(option);
                    }
                );

                let resolutionLabel = document.createElement("label");
                resolutionLabel.textContent = "Resolution Details:";

                let resolutionInput = document.createElement("textarea");
                resolutionInput.placeholder =
                    "Enter the action taken to resolve the complaint...";
                resolutionInput.value = resolution;

                let saveButton = document.createElement("button");
                saveButton.textContent = "Save Update";
                saveButton.className = "btn";
                saveButton.type = "button";

                // Save status and resolution
                saveButton.addEventListener("click", function() {

                    let newStatus = statusSelect.value;
                    let newResolution = resolutionInput.value.trim();

                    if (newStatus === "Resolved" && newResolution.length < 5) {
                        alert("Please enter resolution details before resolving.");
                        return;
                    }

                    localStorage.setItem(
                        prefix + "status",
                        newStatus
                    );

                    localStorage.setItem(
                        prefix + "resolution",
                        newResolution
                    );

                    alert("Complaint updated successfully!");

                    displayStaffComplaints();

                });

                card.appendChild(heading);
                card.appendChild(reference);
                card.appendChild(categoryText);
                card.appendChild(descriptionText);
                card.appendChild(locationText);
                card.appendChild(dateText);
                card.appendChild(statusLabel);
                card.appendChild(statusSelect);
                card.appendChild(resolutionLabel);
                card.appendChild(resolutionInput);
                card.appendChild(saveButton);

                complaintList.appendChild(card);
            }
        }

        if (total === 0) {
            complaintList.innerHTML =
                "<p>No complaints have been assigned to you yet.</p>";
        }

        // Update statistics
        document.getElementById("staffTotal").textContent = total;
        document.getElementById("staffPending").textContent = pending;
        document.getElementById("staffProgress").textContent = progress;
        document.getElementById("staffResolved").textContent = resolved;
    }


    // Logout
    function logout() {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUserName");
        localStorage.removeItem("currentUserEmail");
        localStorage.removeItem("currentUserRole");
        localStorage.removeItem("currentUserDepartment");

        window.location.href = "login.html";
    }


    // Load assigned complaints
    displayStaffComplaints();
}
