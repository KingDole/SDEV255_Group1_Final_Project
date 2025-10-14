document.addEventListener("DOMContentLoaded", loadNavbar);

const auth = new Auth()
document.querySelector("#logout").addEventListener("click", (e) => {
    auth.logOut()
})

function loadNavbar() {
    //Get role from localStorage
    const role = localStorage.getItem("urole")

    //Make Student navbar the default
    let studentNavbar = `
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html">All Courses</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/add_course.html">Add Course</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/current_schedule.html">Current Schedule</a>
        <button id="logout" style="float: right;">Logout</button>
    `

    let teacherNavbar = `
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html">All Courses</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/current_schedule.html">Current Schedule</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/create_course.html">Create Course</a>
        <a href="https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/edit_delete.html">Course Management</a>
        <button id="logout" style="float: right;">Logout</button>
    `

    // Inject navbar into the <nav> tag
    const nav = document.querySelector("nav")
    if (role == "Teacher") {
        nav.innerHTML = teacherNavbar
    }
    else {
        nav.innerHTML = studentNavbar
    }
}
