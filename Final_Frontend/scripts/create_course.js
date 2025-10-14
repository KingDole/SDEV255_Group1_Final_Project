addEventListener("DOMContentLoaded", function(){
    document.querySelector("#addBtn").addEventListener("click", addCourse)
})

//Add the course to the database. It has to be async function because we are calling data outside our server.
async function addCourse() {
    //create a course object based on the form that the user fills out. 
    const course = {
        title: document.querySelector("#title").value,
        description: document.querySelector("#description").value,
        subjectArea: document.querySelector("#subjectArea").value,
        credits: document.querySelector("#credits").value
    }

    const token = localStorage.getItem("token")
    const response = await fetch("https://sdev255-group1-final-project.onrender.com/api/courses", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "x-auth": token
        },
        body: JSON.stringify(course)
    })

    if(response.ok){
        const results = await response.json()
        alert("Added course with Title of " + results.title)

        //reset the form after course is successfully added
        document.querySelector("form").reset()
    }
    else {
        let errorMsg = "Failed to add course."
        try {
            const errorData = await response.json()
            if (errorData.error) {
                errorMsg += ` ${errorData.error}`
            } else if (errorData.message) {
                errorMsg += ` ${errorData.message}`
            }
        } catch (parseErr) {
            errorMsg += " An unknown error occurred."
        }

        document.querySelector("#error").innerHTML = errorMsg
        console.error("Add course failed:", errorMsg)
    }
}