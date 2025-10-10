class Auth {

    constructor() {
        document.querySelector("body").style.display = "none"
        const auth = localStorage.getItem("auth")
        this.validateAuth(auth)
    }

    validateAuth (auth) {
        if (auth != 1) {
            window.location.replace("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/login.html")
        }
        else {
            document.querySelector("body").style.display = "block"
        }
    }

    logOut() {
        localStorage.removeItem("auth")
        localStorage.removeItem("token")
        localStorage.removeItem("uname")
        window.location.replace("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/login.html")
    }
}