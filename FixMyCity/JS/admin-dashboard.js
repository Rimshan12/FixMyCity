// Check administrator login
if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("currentUserRole") !== "Administrator"
) {
    window.location.href = "login.html";
}

// Display administrator name
document.getElementById("adminName").textContent =
    localStorage.getItem("currentUserName");

// Display registered users
function displayUsers() {

    let userCount = Number(localStorage.getItem("userCount")) || 0;
    let userTable = document.getElementById("userTable");

    userTable.innerHTML = "";

    for (let i = 0; i < userCount; i++) {

        let name = localStorage.getItem("user_" + i + "_name");
        let email = localStorage.getItem("user_" + i + "_email");
        let mobile = localStorage.getItem("user_" + i + "_mobile");
        let role = localStorage.getItem("user_" + i + "_role");

        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        nameCell.textContent = name;

        let emailCell = document.createElement("td");
        emailCell.textContent = email;

        let mobileCell = document.createElement("td");
        mobileCell.textContent = mobile;

        let roleCell = document.createElement("td");
        roleCell.textContent = role || "Not specified";

        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(mobileCell);
        row.appendChild(roleCell);

        userTable.appendChild(row);
    }

    if (userCount === 0) {
        userTable.innerHTML =
            "<tr><td colspan='4'>No registered users found.</td></tr>";
    }
}

// Display all complaints
function displayComplaints() {

    let complaintCount =
        Number(localStorage.getItem("complaintCount")) || 0;

    let table = document.getElementById("adminComplaintTable");

    let total = 0;
    let pending = 0;
    let progress = 0;
    let resolved = 0;

    table.innerHTML = "";

    for (let i = 0; i < complaintCount; i++) {

        let prefix = "complaint_" + i + "_";

        let id = localStorage.getItem(prefix + "id");
        let title = localStorage.getItem(prefix + "title");
        let category = localStorage.getItem(prefix + "category");
        let email = localStorage.getItem(prefix + "citizenEmail");
        let location = localStorage.getItem(prefix + "location");
        let date = localStorage.getItem(prefix + "date");
        let status = localStorage.getItem(prefix + "status") || "Pending";

        total++;

        if (status === "Pending") {
            pending++;
        } else if (status === "In Progress") {
            progress++;
        } else if (status === "Resolved") {
            resolved++;
        }

        let row = document.createElement("tr");

        let values = [id, title, category, email, location, date, status];

        values.forEach(function(value) {
            let cell = document.createElement("td");
            cell.textContent = value || "-";
            row.appendChild(cell);
        });

        table.appendChild(row);
    }

    if (complaintCount === 0) {
        table.innerHTML =
            "<tr><td colspan='7'>No complaints have been registered yet.</td></tr>";
    }

    // Update complaint statistics
    document.getElementById("adminTotal").textContent = total;
    document.getElementById("adminPending").textContent = pending;
    document.getElementById("adminProgress").textContent = progress;
    document.getElementById("adminResolved").textContent = resolved;
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

// Load dashboard information
displayUsers();
displayComplaints();