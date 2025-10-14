class Auth {

    //Hide content from unauthorized users and direct them to the login page
    constructor() {
        document.querySelector("body").style.display = "none"
        const auth = localStorage.getItem("auth")
        this.validateAuth(auth)
    }

    validateAuth (auth) {
        if (auth != 1) {
            console.log(window.location)
            window.location.replace("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/login.html")
        }
        else {
            document.querySelector("body").style.display = "block"
        }
    }

    //Clear out all localStorage
    logOut() {
        localStorage.removeItem("auth")
        localStorage.removeItem("token")
        localStorage.removeItem("uname")
        localStorage.removeItem("urole")
        window.location.replace("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/login.html")
    }
}