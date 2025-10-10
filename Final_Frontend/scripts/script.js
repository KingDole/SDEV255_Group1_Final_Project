addEventListener("DOMContentLoaded", async function() {
    const response = await fetch("https://sdev255-group1-final-project.onrender.com/api/courses")
    const courses = await response.json()

    let html = ""
    for (let course of courses) {
        html += `<li>${course.title}</li>`
    }

    document.querySelector("#list_of_courses").innerHTML = html
})