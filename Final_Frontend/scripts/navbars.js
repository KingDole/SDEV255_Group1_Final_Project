document.addEventListener("DOMContentLoaded", loadNavbar);

function loadNavbar() {
    //Get role from localStorage
    const role = localStorage.getItem("urole")

    //Make Student navbar the default
    let studentNavbar = `
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html">
            <i class="fa-solid fa-book-open"></i> All Courses
        </a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/add_course.html">
            <i class="fa-solid fa-plus-circle"></i> Add Course
        </a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/current_schedule.html">
            <i class="fa-solid fa-calendar-check"></i> Current Schedule
        </a>
        <button id="logout" style="float: right;">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
    `

    let teacherNavbar = `
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html">
            <i class="fa-solid fa-book-open"></i> All Courses
        </a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/create_course.html">
            <i class="fa-solid fa-chalkboard-user"></i> Create Course
        </a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/edit_delete.html">
            <i class="fa-solid fa-pen-to-square"></i> Course Management
        </a>
        <button id="logout" style="float: right;">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
    `

    // Inject navbar into the <nav> tag
    const nav = document.querySelector("nav")
    if (role == "Teacher") {
        nav.innerHTML = teacherNavbar
    }
    else {
        nav.innerHTML = studentNavbar
    }

    document.dispatchEvent(new Event("navbar-ready"))
}
