addEventListener("DOMContentLoaded", async function() {
    const response = await fetch("http://localhost:3000/api/courses")
    const courses = await response.json()

    let html = ""
    for (let course of courses) {
        html += `<li>${course.title}</li>`
    }

    document.querySelector("#list_of_courses").innerHTML = html
})