
// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    // Show department field only for Department Staff
    let roleOptions = document.querySelectorAll('input[name="role"]');
    let departmentField = document.getElementById("departmentField");
    let departmentSelect = document.getElementById("department");

    roleOptions.forEach(function(option) {

        option.addEventListener("change", function() {

            if (this.value === "Department Staff") {
                departmentField.style.display = "block";
                departmentSelect.required = true;
            } else {
                departmentField.style.display = "none";
                departmentSelect.required = false;
                departmentSelect.value = "";
            }

        });

    });

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim().toLowerCase();
        let mobile = document.getElementById("mobile").value.trim();
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        let selectedRole = document.querySelector('input[name="role"]:checked');
        let role = selectedRole ? selectedRole.value : "";

        let department = departmentSelect ? departmentSelect.value : "";

        let message = document.getElementById("registerMessage");

        // Check required fields
        if (!name || !email || !mobile || !password || !confirmPassword) {
            message.style.color = "red";
            message.textContent = "Please fill in all required fields.";
            return;
        }

        // Check role selection
        if (!role) {
            message.style.color = "red";
            message.textContent = "Please select your role.";
            return;
        }

        // Check department for staff
        if (role === "Department Staff" && !department) {
            message.style.color = "red";
            message.textContent = "Please select your department.";
            return;
        }

        // Check password
        if (password !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
            return;
        }

        if (password.length < 6) {
            message.style.color = "red";
            message.textContent = "Password must contain at least 6 characters.";
            return;
        }

        // Check duplicate email
        let userCount = Number(localStorage.getItem("userCount")) || 0;

        for (let i = 0; i < userCount; i++) {

            let savedEmail = localStorage.getItem("user_" + i + "_email");

            if (savedEmail === email) {
                message.style.color = "red";
                message.textContent = "This email is already registered.";
                return;
            }
        }

        // Save user details
        localStorage.setItem("user_" + userCount + "_name", name);
        localStorage.setItem("user_" + userCount + "_email", email);
        localStorage.setItem("user_" + userCount + "_mobile", mobile);
        localStorage.setItem("user_" + userCount + "_password", password);
        localStorage.setItem("user_" + userCount + "_role", role);
        localStorage.setItem("user_" + userCount + "_department", department);

        localStorage.setItem("userCount", userCount + 1);

        alert("Registration successful! Please login.");

        window.location.href = "login.html";

    });

}


// Login

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email = document.getElementById("loginEmail").value.trim().toLowerCase();
        let password = document.getElementById("loginPassword").value;

        let selectedRole = document.querySelector('input[name="loginRole"]:checked');

        let message = document.getElementById("loginMessage");

        // Check whether a role is selected
        if (!selectedRole) {
            message.style.color = "red";
            message.textContent = "Please select your role.";
            return;
        }

        let role = selectedRole.value;

        let userCount = Number(localStorage.getItem("userCount")) || 0;

        let loginSuccessful = false;
        let dashboard = "";

        for (let i = 0; i < userCount; i++) {

            let savedEmail = localStorage.getItem("user_" + i + "_email");
            let savedPassword = localStorage.getItem("user_" + i + "_password");
            let savedRole = localStorage.getItem("user_" + i + "_role");

            // Check email, password and selected role
            if (
                email === savedEmail &&
                password === savedPassword &&
                role === savedRole
            ) {

                let savedName = localStorage.getItem("user_" + i + "_name");
                let savedDepartment = localStorage.getItem("user_" + i + "_department");

                localStorage.setItem("currentUserName", savedName);
                localStorage.setItem("currentUserEmail", email);
                localStorage.setItem("currentUserRole", savedRole);
                localStorage.setItem("currentUserDepartment", savedDepartment || "");
                localStorage.setItem("isLoggedIn", "true");

                loginSuccessful = true;

                if (savedRole === "Citizen") {
                    dashboard = "citizen-dashboard.html";

                } else if (savedRole === "Municipal Officer") {
                    dashboard = "officer-dashboard.html";

                } else if (savedRole === "Department Staff") {
                    dashboard = "staff-dashboard.html";

                } else if (savedRole === "Administrator") {
                    dashboard = "admin-dashboard.html";
                }

                break;
            }
        }

        if (loginSuccessful && dashboard !== "") {

            message.style.color = "green";
            message.textContent = "Login successful!";

            alert("Welcome to FixMyCity!");

            window.location.href = dashboard;

        } else {

            message.style.color = "red";
            message.textContent =
                "Invalid email, password or selected role.";

        }

    });

}
