let currentUserId = null;
let currentChatUserId = null;

let pesanPalingLamaId = null;
let sedangLoadPesanLama = false;
let masihAdaPesan = true;
let pesanYangDireply = null;

const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("contact");
const input = document.querySelector(".input-entry");
const replyPreview = document.getElementById("replyPreview");
const replyPreviewText = document.getElementById("replyPreviewText");
const cancelReply = document.getElementById("cancelReply");

const friendSearch = document.getElementById("friendSearch");
const searchFriend = document.getElementById("searchFriend");
const searchResult = document.getElementById("searchResult");

const btnInputChat = document.querySelector(".btn-input-chat");

const contactPage = document.getElementById("contact");
const chatPage = document.querySelector(".chat-page");
const aboutPage = document.querySelector(".about-page");
const settingsPage = document.querySelector(".settings-page");

const semuaMenu = document.querySelectorAll(".menu-item");

const homeMenu = document.querySelector(".home-menu");
const chatMenu = document.querySelector(".chat-menu");
const aboutMenu = document.querySelector(".about-menu");
const settingMenu = document.querySelector(".setting-menu");

const chatList = document.getElementById("chatList");
const reply = document.createElement("button");



chatList.addEventListener("scroll", () => {
    if (chatList.scrollTop <= 100) {
        loadPesanLama();
    }
});

function bukaPage(page) {
    contactPage.style.display = "none";
    chatPage.style.display = "none";
    aboutPage.style.display = "none";
    settingsPage.style.display = "none";

    page.style.display = "flex";
}

function aktifkanMenu(menu) {
    semuaMenu.forEach(item => {
        item.classList.remove("active");
    });

    menu.classList.add("active");
}



homeMenu.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(contactPage);
    aktifkanMenu(homeMenu);
});

chatMenu.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(chatPage);
    aktifkanMenu(chatMenu);
});

aboutMenu.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(aboutPage);
    aktifkanMenu(aboutMenu);
});

settingMenu.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(settingsPage);
    aktifkanMenu(settingMenu);
});






function bukaChat(idTeman, namaTeman) {
    currentChatUserId = idTeman;

    pesanPalingLamaId = null;
    sedangLoadPesanLama = false;
    masihAdaPesan = true;

    bukaPage(chatPage);
    aktifkanMenu(chatMenu);

    document.getElementById("chatTitle").textContent = namaTeman;

    loadPesan();
}
function tampilkanPesan(pesan, chatList) {
    const item = document.createElement("div");

    item.className = "pesan";

    const pesanSaya =
        Number(pesan.id_pengirim) ===
        Number(currentUserId);

    if (pesanSaya) {
        item.id = "self_pengirim";
    } else {
        item.id = "id_pengirim";
    }

    const p = document.createElement("p");

    p.className = "isipesan";
    p.textContent = pesan.isi;

    if (pesan.id_pesan_reply && pesan.isi_pesan_reply) {
        const replyDalamPesan = document.createElement("div");

        replyDalamPesan.className = "reply-dalam-pesan";

        const teksReply = document.createElement("p");

        teksReply.textContent = pesan.isi_pesan_reply;

        replyDalamPesan.appendChild(teksReply);

        item.appendChild(replyDalamPesan);
    }

    item.appendChild(p);

    const waktu = document.createElement("span");

    waktu.className = "waktu-pesan";

    const tanggal = new Date(pesan.tanggal_waktu);

    waktu.textContent = tanggal.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    });

    item.appendChild(waktu);



    const aksi = document.createElement("div");

    aksi.className = "aksi-pesan";



    const reply = document.createElement("button");

    reply.textContent = "Reply";

    reply.addEventListener("click", () => {
        mulaiReply(pesan);
    });

    aksi.appendChild(reply);



    if (pesanSaya) {

        const edit = document.createElement("button");

        edit.textContent = "Edit";

        edit.addEventListener("click", () => {
            editPesan(
                pesan.id,
                p,
                pesan.isi
            );
        });


        const hapus = document.createElement("button");

        hapus.textContent = "Hapus";

        hapus.addEventListener("click", () => {
            hapusPesan(
                pesan.id,
                item
            );
        });


        aksi.appendChild(edit);
        aksi.appendChild(hapus);
    }


    item.appendChild(aksi);

    chatList.appendChild(item);
}

async function loadPesan() {
    try {
        const response = await fetch(
            `/pesan/${currentChatUserId}`
        );

        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        const chatList = document.getElementById("chatList");

        chatList.innerHTML = "";

        data.pesan.forEach(pesan => {
            tampilkanPesan(pesan, chatList);
        });

        if (data.pesan.length > 0) {
            pesanPalingLamaId = data.pesan[0].id;
        }

        masihAdaPesan = data.adaLagi;

        requestAnimationFrame(() => {
            chatList.scrollTop = chatList.scrollHeight;
        });

    } catch (error) {
        console.error("Gagal mengambil pesan:", error);
    }
}
setInterval(() => {
    if (currentChatUserId) {
        loadPesan();
    }
}, 2000);

function mulaiReply(pesan) {
    pesanYangDireply = pesan.id;

    replyPreviewText.textContent = pesan.isi;

    replyPreview.style.display = "flex";

    input.placeholder = "Tulis balasan...";

    input.focus();
}

async function loadTeman() {
    try {
        const response = await fetch("/teman");
        const data = await response.json();

        const contactList = document.getElementById("contactList");

        contactList.innerHTML = "";

        if (!data.berhasil || data.teman.length === 0) {
            contactList.innerHTML = "<p>Belum ada teman.</p>";
            return;
        }

        data.teman.forEach(teman => {
            const item = document.createElement("div");

            item.className = "item-contact";
            item.setAttribute("role", "button");

            item.innerHTML = `
                <img src="">
                <h3>${teman.nama}</h3>
            `;

            item.addEventListener("click", () => {
                bukaChat(teman.id, teman.nama);
            });

            contactList.appendChild(item);
        });

    } catch (error) {
        console.error("Gagal mengambil teman:", error);
    }
}

async function loadPesanLama() {
    if (
        sedangLoadPesanLama ||
        !masihAdaPesan ||
        !pesanPalingLamaId
    ) {
        return;
    }

    sedangLoadPesanLama = true;

    const tinggiSebelum = chatList.scrollHeight;

    try {
        const response = await fetch(
            `/pesan/${currentChatUserId}?before=${pesanPalingLamaId}`
        );

        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        const fragment = document.createDocumentFragment();

        data.pesan.forEach(pesan => {
            const item = document.createElement("div");

            item.className = "pesan";

            if (
                Number(pesan.id_pengirim) ===
                Number(currentUserId)
            ) {
                item.id = "self_pengirim";
            } else {
                item.id = "id_pengirim";
            }

            const p = document.createElement("p");

            p.className = "isipesan";
            p.textContent = pesan.isi;
            const waktu = document.createElement("span");

            waktu.className = "waktu-pesan";

            const tanggal = new Date(pesan.tanggal_waktu);

            waktu.textContent = tanggal.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
            });

            item.appendChild(p);
            item.appendChild(waktu);
            fragment.appendChild(item);
        });

        chatList.prepend(fragment);

        if (data.pesan.length > 0) {
            pesanPalingLamaId = data.pesan[0].id;
        }

        masihAdaPesan = data.adaLagi;

        const tinggiSesudah = chatList.scrollHeight;

        chatList.scrollTop =
            tinggiSesudah - tinggiSebelum;

    } catch (error) {
        console.error(
            "Gagal mengambil pesan lama:",
            error
        );

    } finally {
        sedangLoadPesanLama = false;
    }
}



async function editPesan(idPesan, element, isiLama) {
    const isiBaru = prompt(
        "Edit pesan:",
        isiLama
    );

    if (isiBaru === null) return;
    if (!isiBaru.trim()) return;

    try {
        const response = await fetch(
            `/pesan/${idPesan}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isi: isiBaru
                })
            }
        );

        const data = await response.json();

        if (!data.berhasil) {
            console.log(data.pesan);
            return;
        }

        element.textContent = isiBaru.trim();

    } catch (error) {
        console.error(
            "Gagal mengedit pesan:",
            error
        );
    }
}
async function hapusPesan(idPesan, element) {
    const yakin = confirm("Hapus pesan ini?");

    if (!yakin) return;

    try {
        const response = await fetch(
            `/pesan/${idPesan}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!data.berhasil) {
            console.log(data.pesan);
            return;
        }

        element.remove();

    } catch (error) {
        console.error(
            "Gagal menghapus pesan:",
            error
        );
    }
}


async function tambahTeman(idTeman) {
    try {
        const response = await fetch("/teman", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_teman: idTeman
            })
        });

        const data = await response.json();

        if (!data.berhasil) {
            console.log(data.pesan);
            return;
        }

        console.log("Teman berhasil ditambahkan");

        loadTeman();

    } catch (error) {
        console.error("Gagal menambahkan teman:", error);
    }
}


searchFriend.addEventListener("click", async () => {
    const q = friendSearch.value.trim();

    if (!q) {
        return;
    }

    try {
        const response = await fetch(
            `/cari-teman?q=${encodeURIComponent(q)}`
        );

        const data = await response.json();

        searchResult.innerHTML = "";

        if (!data.berhasil || data.pengguna.length === 0) {
            searchResult.innerHTML =
                "<p>Pengguna tidak ditemukan.</p>";
            return;
        }

        data.pengguna.forEach(user => {
            const item = document.createElement("div");

            item.className = "resultofsearch";
            item.setAttribute("role", "button");

            item.innerHTML = `
                <img src="">
                <div>
                    <h3>${user.nama}</h3>
                    <p>ID: ${user.id}</p>
                </div>
            `;

            item.addEventListener("click", () => {
                tambahTeman(user.id);
            });

            searchResult.appendChild(item);
        });

    } catch (error) {
        console.error("Gagal mencari teman:", error);
    }
});


input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});


hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("hide");
    content.classList.toggle("full");
});

cancelReply.addEventListener("click", () => {
    pesanYangDireply = null;

    replyPreviewText.textContent = "";

    replyPreview.style.display = "none";

    input.placeholder = "Tulis pesan...";
});

btnInputChat.addEventListener("click", async () => {
    const isi = input.value.trim();

    if (!isi) {
        return;
    }

    if (!currentChatUserId) {
        console.log("Belum memilih teman");
        return;
    }

    try {
        const response = await fetch("/pesan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_penerima: currentChatUserId,
                isi: isi,
                id_pesan_reply: pesanYangDireply
            })
        });

        const data = await response.json();

        console.log("Hasil kirim:", data);

        if (!data.berhasil) {
            console.log(data.pesan);
            return;
        }

        input.value = "";
        input.style.height = "auto";

        pesanYangDireply = null;

        replyPreviewText.textContent = "";

        replyPreview.style.display = "none";

        input.placeholder = "Tulis pesan...";

        loadPesan();

    } catch (error) {
        console.error("Gagal mengirim pesan:", error);
    }
});


fetch("/me")
    .then(response => response.json())
    .then(data => {

        if (!data.berhasil) {
            window.location.href = "/login.html";
            return;
        }

        const user = data.user;

        currentUserId = user.id;

        console.log("User login:", currentUserId);

        document.getElementById("namaUser").textContent =
            user.nama;
    });


loadTeman();