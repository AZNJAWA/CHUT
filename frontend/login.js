const loginForm = document.getElementById("loginForm");

console.log("LOGIN JS BERJALAN");
console.log("FORM:", loginForm);

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("SUBMIT LOGIN:", email);

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("RESPONSE:", data);

        if (data.berhasil) {
            console.log("Login berhasil:", data);
            window.location.href = "/chat.html";
        } else {
            console.log("Login gagal:", data.pesan);
        }

    } catch (error) {
        console.error("Gagal menghubungi server:", error);
    }
});
