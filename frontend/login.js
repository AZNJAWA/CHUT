const loginForm = document.getElementById("loginForm");

console.log("LOGIN JS BERJALAN");
console.log("FORM:", loginForm);

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("SUBMIT LOGIN TERPANGGIL");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("SEBELUM FETCH");

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

        console.log("FETCH SELESAI");
        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("RESPONSE:", data);

        if (data.berhasil) {
            console.log("LOGIN BERHASIL");
            window.location.href = "/chat.html";
        } else {
            console.log("LOGIN GAGAL:", data.pesan);
        }

    } catch (error) {
        console.error("FETCH ERROR:", error);
    }
});
