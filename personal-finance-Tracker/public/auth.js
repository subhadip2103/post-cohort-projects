window.onload = updateUI;
async function signup() {
    let username = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;

    document.getElementById('username-input').value = "";
    document.getElementById('password-input').value = ""

    await axios.post('http://localhost:3000/signup', {
        username: username,
        password: password
    })
    alert('Signed Up succesfully')
    updateUI()

}
async function signin() {
    let username = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;

    let response = await axios.post("http://localhost:3000/signin", {
        username: username,
        password: password
    })

    let token = response.data.token;

    localStorage.setItem("token", token)
    alert("Signed In successfully");
    updateUI()
}

async function getUserInformation() {
    let response = await axios.get("http://localhost:3000/me", {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    });
    document.querySelector(".usermessage").innerHTML = `${response.data.username}`
}

function updateUI() {
    const token = localStorage.getItem("token");

    if (token) {

        document.querySelector(".auth-section").style.display = "none";
        document.querySelector(".dashboard-section").style.display = "block";
        getUserInformation();
    } else {
        document.querySelector(".auth-section").style.display = "block";
        document.querySelector(".dashboard-section").style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("token");
    updateUI();
}
document.getElementById("mode-toggle").addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("mode", "dark");
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("mode", "light");
    }
});


