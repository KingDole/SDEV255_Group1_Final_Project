addEventListener("DOMContentLoaded", function(){
    document.querySelector("#addBtn").addEventListener("click", addCourse)
})

//Add the song to the database. It has to be async function because we are calling data outside our server.

async function addCourse() {
    //create a course object based on the form that the user fills out. 
    const course = {
        _id: document.querySelector("#courseID").value,
        title: document.querySelector("#title").value,
        artist: document.querySelector("#description").value,
        releaseDate: document.querySelector("#subjectArea").value,
        popularity: document.querySelector("#credits").value
    }

    const response = await fetch("http://localhost:3000/api/courses", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(course)
    })

    if(response.ok){
        const results = await response.json()
        alert("Added course with ID of" + results._id)

        //reset the form after song is successfully added
        document.querySelector("form").reset()
    }
    else {
        document.querySelector("#error").innerHTML = "Cannot add course"
    }
}