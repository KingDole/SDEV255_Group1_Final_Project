addEventListener("DOMContentLoaded", function(){
    document.querySelector("#addBtn").addEventListener("click", addUser)
    getRoles()
})

//Add dropdown options for teacher/student role
async function getRoles(){
    const response = await fetch("https://sdev255-group1-final-project.onrender.com/api/roles")
    if(response.ok) {
        const roles = await response.json()
        let html = "Student"
        for (let role of roles) {
            html += `<option value="${role.title}">${role.title}</option>`
        }
        document.querySelector("#roleDropDown").innerHTML = html
    }    
}

//Add the user to the database. It has to be async function because we are calling data outside our server.
async function addUser() {
    //create a user object based on the form that the user fills out. 
    const user = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        role: document.querySelector("#roleDropDown").value,
    }

    const response = await fetch("https://sdev255-group1-final-project.onrender.com/api/users", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    })

    if(response.ok){
        const results = await response.json()
        document.querySelector("#error").innerHTML = "";
        alert("User added successfully.")

        //reset the form after user is successfully added
        document.querySelector("form").reset()
    }
    else {
        const errorData = await response.json()
        document.querySelector("#error").innerHTML = errorData.error || "Registration failed."
    }    
}