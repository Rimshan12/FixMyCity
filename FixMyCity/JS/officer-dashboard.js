
// Check Municipal Officer login
if (
    localStorage.getItem("isLoggedIn") !== "true" ||
    localStorage.getItem("currentUserRole") !== "Municipal Officer"
) {
    window.location.href = "login.html";
} else {

    // Display officer name if the element exists
    let officerName = document.getElementById("officerName");

    if (officerName) {
        officerName.textContent =
            localStorage.getItem("currentUserName") || "Officer";
    }

    // Find staff members for the complaint category
    function getStaffForComplaint(category) {

        let userCount = Number(localStorage.getItem("userCount")) || 0;

        let departmentMap = {
            "Garbage Collection": "Sanitation",
            "Road Damage": "Roads",
            "Streetlight Issue": "Electricity",
            "Water Leakage": "Water Supply",
            "Drainage Problem": "Drainage",
            "Public Toilet Issue": "Public Health"
        };

        let requiredDepartment = departmentMap[category];
        let staffMembers = [];

        for (let i = 0; i < userCount; i++) {

            let role = localStorage.getItem("user_" + i + "_role");
            let department =
                localStorage.getItem("user_" + i + "_department");

            if (
                role === "Department Staff" &&
                (!requiredDepartment || department === requiredDepartment)
            ) {
                staffMembers.push({
                    name: localStorage.getItem("user_" + i + "_name"),
                    email: localStorage.getItem("user_" + i + "_email"),
                    department: department
                });
            }
        }

        return staffMembers;
    }


    // Display complaints
    function displayOfficerComplaints() {

        let complaintCount =
            Number(localStorage.getItem("complaintCount")) || 0;

        let table = document.getElementById("officerComplaintTable");

        if (!table) {
            console.error("Complaint table not found. Check its HTML ID.");
            return;
        }

        let total = 0;
        let pending = 0;
        let progress = 0;
        let resolved = 0;

        table.innerHTML = "";

        for (let i = 0; i < complaintCount; i++) {

            let prefix = "complaint_" + i + "_";

            let id = localStorage.getItem(prefix + "id");

            // Skip empty complaint records
            if (!id) {
                continue;
            }

            let title = localStorage.getItem(prefix + "title");
            let category = localStorage.getItem(prefix + "category");
            let email = localStorage.getItem(prefix + "citizenEmail");
            let location = localStorage.getItem(prefix + "location");
            let date = localStorage.getItem(prefix + "date");
            let status =
                localStorage.getItem(prefix + "status") || "Pending";

            total++;

            if (status === "Pending") {
                pending++;
            } else if (status === "In Progress") {
                progress++;
            } else if (status === "Resolved") {
                resolved++;
            }

            let row = document.createElement("tr");

            let values = [
                id, title, category, email, location, date, status
            ];

            values.forEach(function(value) {
                let cell = document.createElement("td");
                cell.textContent = value || "-";
                row.appendChild(cell);
            });

            // Staff assignment
            let assignmentCell = document.createElement("td");
            let staffSelect = document.createElement("select");

            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "-- Select Staff --";
            staffSelect.appendChild(defaultOption);

            let staffMembers = getStaffForComplaint(category);

            let assignedEmail =
                localStorage.getItem(prefix + "assignedStaffEmail") || "";

            staffMembers.forEach(function(staff) {

                let option = document.createElement("option");
                option.value = staff.email;
                option.textContent =
                    staff.name + " (" + staff.department + ")";

                if (staff.email === assignedEmail) {
                    option.selected = true;
                }

                staffSelect.appendChild(option);
            });

            let assignButton = document.createElement("button");
            assignButton.type = "button";
            assignButton.textContent = "Assign";
            assignButton.className = "btn";

            if (staffMembers.length === 0) {
                staffSelect.disabled = true;
                assignButton.disabled = true;
                assignButton.textContent = "No Staff Available";
            }

            assignButton.addEventListener("click", function() {

                let selectedEmail = staffSelect.value;

                if (!selectedEmail) {
                    alert("Please select a staff member.");
                    return;
                }

                let selectedStaff = staffMembers.find(function(staff) {
                    return staff.email === selectedEmail;
                });

                if (!selectedStaff) {
                    alert("Staff member not found.");
                    return;
                }

                localStorage.setItem(
                    prefix + "assignedStaffEmail",
                    selectedStaff.email
                );

                localStorage.setItem(
                    prefix + "assignedStaffName",
                    selectedStaff.name
                );

                localStorage.setItem(
                    prefix + "assignedDepartment",
                    selectedStaff.department
                );

                alert("Complaint assigned successfully!");

                displayOfficerComplaints();
            });

            assignmentCell.appendChild(staffSelect);
            assignmentCell.appendChild(assignButton);

            row.appendChild(assignmentCell);
            table.appendChild(row);
        }

        if (total === 0) {
            table.innerHTML =
                "<tr><td colspan='8'>No complaints found.</td></tr>";
        }

        // Update statistics
        document.getElementById("officerTotal").textContent = total;
        document.getElementById("officerPending").textContent = pending;
        document.getElementById("officerProgress").textContent = progress;
        document.getElementById("officerResolved").textContent = resolved;

        console.log("Total complaints loaded:", total);
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


    // Load dashboard
    displayOfficerComplaints();
}
