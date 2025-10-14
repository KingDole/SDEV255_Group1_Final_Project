addEventListener("DOMContentLoaded", async function() {
    const response = await fetch("https://sdev255-group1-final-project.onrender.com/api/courses")
    const courses = await response.json()

    let html = ""
    for (let course of courses) {
        html += `
            <li>${course.title} - <button class="add-btn" data-id="${course._id}" style="float: right;">Add Class</button>
                <p>${course.description}</p>
                <p>${course.subjectArea}</p>
                <p>${course.credits} credits</p>
            </li>`
    }

    document.querySelector("#list_of_courses").innerHTML = html

    const buttons = document.querySelectorAll(".add-btn")
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const courseId = button.getAttribute("data-id")
            const courseToAdd = courses.find(c => c._id === courseId)
            addToSchedule(courseToAdd)
        })
    })
})

//Store added classes to localStorage
function addToSchedule(course) {
    const username = localStorage.getItem("uname");
    const token = localStorage.getItem("token");

    fetch(`https://sdev255-group1-final-project.onrender.com/api/users/${username}/schedule`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth": token
        },
        body: JSON.stringify({ courseId: course._id })
    })
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw err });
        alert(`${course.title} added to your schedule.`);
    })
    .catch(err => {
        alert(err.error || "Failed to add course.");
    });
}


