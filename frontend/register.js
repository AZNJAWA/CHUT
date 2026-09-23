const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log({
        nama: nama,
        email: email,
        password: password
    });

    try {
        const response = await fetch("/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nama: nama,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log(data);

        if (data.berhasil) {
            document.getElementById("pesan").textContent =
                "Akun berhasil dibuat!";

            window.location.href = "/login.html";
        } else {
            document.getElementById("pesan").textContent =
                data.pesan;
        }

    } catch (error) {
        console.error("Gagal menghubungi server:", error);

        document.getElementById("pesan").textContent =
            "Server tidak dapat dihubungi";
    }
});