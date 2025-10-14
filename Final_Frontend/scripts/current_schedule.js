document.addEventListener("DOMContentLoaded", async function () {
    //Pull the current user's username and token information.
    const username = localStorage.getItem("uname")
    const token = localStorage.getItem("token")

    const response = await fetch(`https://sdev255-group1-final-project.onrender.com/api/users/${username}/schedule`, {
        headers: { "x-auth": token }
    })

    //Build the schedule list. Display "No classes added." If none have been added yet.
    const schedule = await response.json()
    let html = ""

    if (!schedule.length) {
        document.querySelector("#schedule_list").innerHTML = "<p>No classes added.</p>"
        return;
    }

    for (let course of schedule) {
        html += `
            <li>
                <strong>${course.title}</strong> - 
                <button class="drop-btn" data-id="${course._id}" style="float: right;">Drop Class</button>
                <p>${course.description}</p>
                <p>${course.subjectArea}</p>
                <p>${course.credits} credits</p>
            </li>
        `
    }

    document.querySelector("#schedule_list").innerHTML = html

    //Add a drop button for each class so classes can be dropped.
    document.querySelectorAll(".drop-btn").forEach(button => {
        button.addEventListener("click", () => {
            const courseId = button.getAttribute("data-id")
            removeFromSchedule(courseId)
        })
    })
})

//Function to remove a class from the user's schedule.
function removeFromSchedule(courseId) {
    const username = localStorage.getItem("uname")
    const token = localStorage.getItem("token")

    fetch(`https://sdev255-group1-final-project.onrender.com/api/users/${username}/schedule/${courseId}`, {
        method: "DELETE",
        headers: { "x-auth": token }
    })
    .then(() => {
        window.location.reload()
    })
    .catch(() => {
        alert("Failed to remove course.")
    })
}
