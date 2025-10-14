document.addEventListener("DOMContentLoaded", async () => {
    //Grab current user's information for reference
    const username = localStorage.getItem("uname")
    const token = localStorage.getItem("token")
    //Check that there is a valid username and token
    if (!username || !token) {
        return window.location.replace("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/login.html")
    }

    const response = await fetch(`https://sdev255-group1-final-project.onrender.com/api/teachers/${username}/courses`, {
        headers: {
            "x-auth": token
        }
    })

    if (!response.ok) {
        document.querySelector("#course_list").innerHTML = "Error loading courses"
        return
    }
    //Build list of courses created by user
    const courses = await response.json()
    renderCourses(courses)
})

//Function to build the list of classes created by the active user
function renderCourses(courses) {
    const container = document.querySelector("#course_list")
    container.innerHTML = ""

    for (let course of courses) {
        const div = document.createElement("div")
        div.classList.add("course-item")
        div.setAttribute("data-id", course._id)

        div.innerHTML = `
            <h3><span class="title">${course.title}</span></h3>
            <p><strong>Subject:</strong> <span class="subject">${course.subjectArea}</span></p>
            <p><strong>Credits:</strong> <span class="credits">${course.credits}</span></p>
            <p class="description">${course.description}</p>
            <div class="edit-buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `

        container.appendChild(div)
    }

    setupCourseButtons()
}

//Function to call for editing or deleting a course
function setupCourseButtons() {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const courseDiv = e.target.closest(".course-item")
            enterEditMode(courseDiv)
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const courseDiv = e.target.closest(".course-item")
            const courseId = courseDiv.getAttribute("data-id")
            deleteCourse(courseId)
        })
    })
}
//Function that allows the user to edit their class on the current page rather than use a separate page
function enterEditMode(courseDiv) {
    const title = courseDiv.querySelector(".title").innerText
    const subject = courseDiv.querySelector(".subject").innerText
    const credits = courseDiv.querySelector(".credits").innerText
    const description = courseDiv.querySelector(".description").innerText

    // Replace content with input fields
    courseDiv.querySelector(".title").outerHTML = `<input type="text" class="edit-title" value="${title}">`
    courseDiv.querySelector(".subject").outerHTML = `<input type="text" class="edit-subject" value="${subject}">`
    courseDiv.querySelector(".credits").outerHTML = `<input type="number" class="edit-credits" value="${credits}">`
    courseDiv.querySelector(".description").outerHTML = `<textarea class="edit-description">${description}</textarea>`
    // Swap out the edit and delete buttons for save and cancel buttons
    const btns = courseDiv.querySelector(".edit-buttons")
    btns.innerHTML = `
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `

    btns.querySelector(".save-btn").addEventListener("click", () => saveEdit(courseDiv))
    btns.querySelector(".cancel-btn").addEventListener("click", () => cancelEdit(courseDiv, { title, subject, credits, description }))
}
// Function to cancel your current edit without saving any changes
function cancelEdit(courseDiv, original) {
    courseDiv.querySelector(".edit-title").outerHTML = `<span class="title">${original.title}</span>`
    courseDiv.querySelector(".edit-subject").outerHTML = `<span class="subject">${original.subject}</span>`
    courseDiv.querySelector(".edit-credits").outerHTML = `<span class="credits">${original.credits}</span>`
    courseDiv.querySelector(".edit-description").outerHTML = `<p class="description">${original.description}</p>`

    const btns = courseDiv.querySelector(".edit-buttons")
    btns.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `

    setupCourseButtons(); // Rebind events
}

// Function to save the current edits to a class
async function saveEdit(courseDiv) {
    const courseId = courseDiv.getAttribute("data-id");
    const token = localStorage.getItem("token");

    const updatedCourse = {
        title: courseDiv.querySelector(".edit-title").value,
        subjectArea: courseDiv.querySelector(".edit-subject").value,
        credits: courseDiv.querySelector(".edit-credits").value,
        description: courseDiv.querySelector(".edit-description").value,
    }

    const response = await fetch(`https://sdev255-group1-final-project.onrender.com/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-auth": token
        },
        body: JSON.stringify(updatedCourse)
    })

    if (response.ok) {
        // Replace inputs with updated text
        courseDiv.querySelector(".edit-title").outerHTML = `<span class="title">${updatedCourse.title}</span>`
        courseDiv.querySelector(".edit-subject").outerHTML = `<span class="subject">${updatedCourse.subjectArea}</span>`
        courseDiv.querySelector(".edit-credits").outerHTML = `<span class="credits">${updatedCourse.credits}</span>`
        courseDiv.querySelector(".edit-description").outerHTML = `<p class="description">${updatedCourse.description}</p>`

        const btns = courseDiv.querySelector(".edit-buttons")
        btns.innerHTML = `
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `

        setupCourseButtons(); // Rebind events
    } else {
        const errorData = await response.json()
        alert("Failed to save changes: " + (errorData.error || response.statusText))
    }
}
// Function to delete a course.
async function deleteCourse(courseId) {
    const token = localStorage.getItem("token")

    if (!confirm("Are you sure you want to delete this course?")) return

    const response = await fetch(`https://sdev255-group1-final-project.onrender.com/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
            "x-auth": token
        }
    });

    if (response.ok) {
        alert("Course deleted")
        location.reload()
    } else {
        const errorData = await response.json()
        alert("Failed to delete course: " + (errorData.error || response.statusText))
    }
}
