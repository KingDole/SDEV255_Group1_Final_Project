addEventListener("DOMContentLoaded", function(){
    document.querySelector("#addBtn").addEventListener("click", addUser)
})

//Add dropdown options for teacher/student role
const roleList = ["Teacher", "Student"]
let html = ""
for (let role of roleList) {
    html += `<option>${role}</option>`
}
document.querySelector("#roleDropDown").innerHTML = html

//Add the user to the database. It has to be async function because we are calling data outside our server.
async function addUser() {
    //create a user object based on the form that the user fills out. 
    const user = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value,
        role: document.querySelector("#roleDropDown").value,
    }

    const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    })

    if(response.ok){
        const results = await response.json()
        alert("User added successfully.")

        //reset the form after user is successfully added
        document.querySelector("form").reset()
    }
    else {
        document.querySelector("#error").innerHTML = "Registration failed."
    }
    //redirect
    window.location.replace("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/login.html")
}