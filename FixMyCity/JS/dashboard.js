
// Check login status
if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}

// Allow only Citizens
if (localStorage.getItem("currentUserRole") !== "Citizen") {
    alert("Access denied. This dashboard is for citizens only.");
    window.location.href = "login.html";
}

// Load citizen dashboard information
function loadCitizenDashboard() {

    let citizenName = localStorage.getItem("currentUserName");
    let citizenEmail = localStorage.getItem("currentUserEmail");

    let nameElement = document.getElementById("citizenName");

    if (nameElement) {
        nameElement.textContent = citizenName || "Citizen";
    }

    let complaintCount =
        Number(localStorage.getItem("complaintCount")) || 0;

    let total = 0;
    let pending = 0;
    let inProgress = 0;
    let resolved = 0;

    let tableContainer = document.querySelector(".table-container");
    let tableBody = tableContainer
        ? tableContainer.querySelector("tbody")
        : null;

    // Clear old sample complaint rows
    if (tableBody) {
        tableBody.innerHTML = "";
    }

    // Read complaints from LocalStorage
    for (let i = 0; i < complaintCount; i++) {

        let prefix = "complaint_" + i + "_";

        let savedEmail =
            localStorage.getItem(prefix + "citizenEmail");

        // Show only complaints submitted by this citizen
        if (savedEmail === citizenEmail) {

            let id = localStorage.getItem(prefix + "id");
            let title = localStorage.getItem(prefix + "title");
            let category = localStorage.getItem(prefix + "category");
            let location = localStorage.getItem(prefix + "location");
            let date = localStorage.getItem(prefix + "date");
            let status =
                localStorage.getItem(prefix + "status") || "Pending";

            total++;

            // Calculate complaint statistics
            if (status === "Pending") {
                pending++;
            } else if (status === "In Progress") {
                inProgress++;
            } else if (status === "Resolved") {
                resolved++;
            }

            // Add complaint to dashboard table
            if (tableBody) {

                let row = document.createElement("tr");

                let details = [
                    id,
                    title,
                    category,
                    location,
                    date
                ];

                details.forEach(function(detail) {

                    let cell = document.createElement("td");
                    cell.textContent = detail || "-";
                    row.appendChild(cell);

                });

                let statusCell = document.createElement("td");

                let statusBadge = document.createElement("span");
                statusBadge.className = "status-badge " +
                    status.toLowerCase().replace(/\s+/g, "-");
                statusBadge.textContent = status;

                statusCell.appendChild(statusBadge);
                row.appendChild(statusCell);

                tableBody.appendChild(row);
            }
        }
    }

    // Update dashboard statistics
    document.getElementById("totalComplaints").textContent = total;
    document.getElementById("pendingComplaints").textContent = pending;
    document.getElementById("progressComplaints").textContent = inProgress;
    document.getElementById("resolvedComplaints").textContent = resolved;

    // Show message when there are no complaints
    if (total === 0 && tableBody) {

        let row = document.createElement("tr");
        let cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "You have not submitted any complaints yet.";
        cell.style.textAlign = "center";
        cell.style.padding = "20px";

        row.appendChild(cell);
        tableBody.appendChild(row);
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

// Load dashboard when page opens
loadCitizenDashboard();
