const auth = new Auth();

document.addEventListener("navbar-ready", () => {
    const logoutBtn = document.querySelector("#logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => auth.logOut());
    }
});