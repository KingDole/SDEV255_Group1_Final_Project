document.addEventListener("DOMContentLoaded", loadNavbar);

function loadNavbar() {
    //Get role from localStorage
    const role = localStorage.getItem("role");

    //Make Student navbar the default
    let navbarHtml = `
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html">All Courses</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/add_course.html">Add Course</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/current_schedule.html">Current Schedule</a>
    `;

    //Change navbar if the role is Teacher
    if (role === "Teacher") {
        navbarHtml += `
            <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html">All Courses</a>
            <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/current_schedule.html">Current Schedule</a>
            <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/create_course.html">Course Management</a>
        `;
    }

    // Inject navbar into the <nav> tag
    const nav = document.querySelector("nav");
    if (nav) {
        nav.innerHTML += navbarHtml;
    }
}
