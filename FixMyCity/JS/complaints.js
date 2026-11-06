// Check whether the citizen is logged in

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}


// Get form elements

const complaintForm = document.getElementById("complaintForm");
const photoInput = document.getElementById("photo");
const imagePreview = document.getElementById("imagePreview");
const complaintMessage = document.getElementById("complaintMessage");

let selectedPhoto = "";


// Preview and validate uploaded photograph

photoInput.addEventListener("change", function() {

    let file = photoInput.files[0];

    imagePreview.innerHTML = "";
    selectedPhoto = "";

    if (!file) {
        return;
    }

    let allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
        alert("Please upload a JPG, PNG or WEBP image.");
        photoInput.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2 MB.");
        photoInput.value = "";
        return;
    }

    let reader = new FileReader();

    reader.onload = function(event) {

        selectedPhoto = event.target.result;

        let image = document.createElement("img");
        image.src = selectedPhoto;
        image.alt = "Complaint photograph preview";
        image.className = "complaint-preview";

        imagePreview.appendChild(image);
    };

    reader.readAsDataURL(file);
});


// Submit complaint

complaintForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let title = document.getElementById("complaintTitle").value.trim();
    let category = document.getElementById("category").value;
    let description = document.getElementById("description").value.trim();
    let location = document.getElementById("location").value.trim();

    if (title.length < 5) {
        alert("Complaint title must contain at least 5 characters.");
        return;
    }

    if (description.length < 10) {
        alert("Please provide at least 10 characters in the description.");
        return;
    }

    if (!category || !location) {
        alert("Please fill in all required fields.");
        return;
    }

    let confirmSubmission = confirm(
        "Are you sure you want to submit this complaint?"
    );

    if (!confirmSubmission) {
        return;
    }

    // Generate complaint reference number

    let complaintCount =
        Number(localStorage.getItem("complaintCount")) || 0;

    let referenceNumber = "FMC" + (1001 + complaintCount);

    // Get logged-in citizen details

    let citizenName = localStorage.getItem("currentUserName");
    let citizenEmail = localStorage.getItem("currentUserEmail");

    // Save complaint details separately in LocalStorage

    let prefix = "complaint_" + complaintCount + "_";

    localStorage.setItem(prefix + "id", referenceNumber);
    localStorage.setItem(prefix + "title", title);
    localStorage.setItem(prefix + "category", category);
    localStorage.setItem(prefix + "description", description);
    localStorage.setItem(prefix + "location", location);
    localStorage.setItem(prefix + "photo", selectedPhoto);
    localStorage.setItem(prefix + "citizenName", citizenName);
    localStorage.setItem(prefix + "citizenEmail", citizenEmail);
    localStorage.setItem(prefix + "status", "Pending");
    localStorage.setItem(prefix + "date", new Date().toLocaleDateString());

    // Update total complaint count

    localStorage.setItem("complaintCount", complaintCount + 1);

    // Show confirmation

    alert(
        "Complaint submitted successfully!\nYour Reference Number: " +
        referenceNumber
    );

    // Clear form

    complaintForm.reset();
    imagePreview.innerHTML = "";
    selectedPhoto = "";

    // Open dashboard

    window.location.href = "citizen-dashboard.html";

});


// Logout function

function logout() {

    let confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUserName");
        localStorage.removeItem("currentUserEmail");

        window.location.href = "login.html";
    }
}