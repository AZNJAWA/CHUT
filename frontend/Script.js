let currentUserId = null;
let currentChatUserId = null;

let pesanPalingLamaId = null;
let sedangLoadPesanLama = false;
let masihAdaPesan = true;
let pesanYangDireply = null;

let currentIdPengguna = null;
let daftarTeman = [];
let filterAktif = "semua";

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

const requestList = document.getElementById("requestList");
const jumlahPermintaan = document.getElementById("jumlahPermintaan");

const btnTambahTeman = document.getElementById("btnTambahTeman");
const addFriendPanel = document.getElementById("addFriendPanel");
const filterTeman = document.getElementById("filterTeman");
const chipSemua = document.getElementById("chipSemua");
const chipOnline = document.getElementById("chipOnline");
const chipReq = document.getElementById("chipReq");
const chipPermintaan = document.getElementById("chipPermintaan");
const kartuPermintaan = document.getElementById("kartuPermintaan");
const btnSalinId = document.getElementById("btnSalinId");
const semuaChip = document.querySelectorAll(".chip[data-filter]");

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
const kontak = document.querySelector(".contact-menu");

const chatList = document.getElementById("chatList");
const reply = document.createElement("button");

const btnStiker = document.getElementById("btnStiker");
const stikerPanel = document.getElementById("stikerPanel");

const tambahStiker = document.getElementById("tambahStiker");
const inputStiker = document.getElementById("inputStiker");
const stikerList = document.getElementById("stikerList");

const mainContent = document.getElementById("mainContent");
const home = document.querySelector(".home");

const al = document.querySelector(".active-list");

const listRecent = document.querySelector(".list-recent");

const tagUnread = document.querySelector(".tag-unread");
const tagOnline = document.querySelector(".tag-online");


tambahStiker.addEventListener("click", () => {
    inputStiker.click();
});

btnStiker.addEventListener("click", () => {

    stikerPanel.classList.toggle("buka");

});



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
    home.style.display = "none";

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

    bukaPage(home);
    aktifkanMenu(homeMenu);
});

kontak.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(contactPage);
    aktifkanMenu(kontak);
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


    let isiPesan;




    if (pesan.tipe === "stiker") {

        const img = document.createElement("img");

        img.src = pesan.isi;
        img.className = "stiker-pesan";

        isiPesan = img;

    }




    else {

        const p = document.createElement("p");

        p.className = "isipesan";
        p.textContent = pesan.isi;

        isiPesan = p;

    }




    if (
        pesan.id_pesan_reply &&
        pesan.isi_pesan_reply
    ) {

        const replyDalamPesan =
            document.createElement("div");

        replyDalamPesan.className =
            "reply-dalam-pesan";

        const teksReply =
            document.createElement("p");

        teksReply.textContent =
            pesan.isi_pesan_reply;

        replyDalamPesan.appendChild(
            teksReply
        );

        item.appendChild(
            replyDalamPesan
        );
    }


    item.appendChild(isiPesan);



    const waktu =
        document.createElement("span");

    waktu.className =
        "waktu-pesan";

    const tanggal =
        new Date(pesan.tanggal_waktu);

    waktu.textContent =
        tanggal.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    item.appendChild(waktu);


    // Centang dibaca (hanya untuk pesan saya)
    if (pesanSaya) {

        const sudahDibaca = Number(pesan.dibaca) === 1;

        const centang =
            document.createElement("span");

        centang.className =
            "centang-pesan" +
            (sudahDibaca ? " dibaca" : "");

        centang.textContent =
            sudahDibaca ? "✓✓" : "✓";

        item.appendChild(centang);
    }



    const aksi =
        document.createElement("div");

    aksi.className =
        "aksi-pesan";


    const reply =
        document.createElement("button");

    reply.textContent = "Reply";

    reply.addEventListener(
        "click",
        () => {
            mulaiReply(pesan);
        }
    );

    aksi.appendChild(reply);


    if (pesanSaya) {

        const edit =
            document.createElement("button");

        edit.textContent = "Edit";

        edit.addEventListener(
            "click",
            () => {

                editPesan(
                    pesan.id,
                    isiPesan,
                    pesan.isi
                );

            }
        );


        const hapus =
            document.createElement("button");

        hapus.textContent = "Hapus";

        hapus.addEventListener(
            "click",
            () => {

                hapusPesan(
                    pesan.id,
                    item
                );

            }
        );


        aksi.appendChild(edit);
        aksi.appendChild(hapus);
    }


    item.appendChild(aksi);

    chatList.appendChild(item);
}

async function loadStiker() {

    try {

        const response =
            await fetch("/stiker");

        const data =
            await response.json();

        if (!data.berhasil) {
            return;
        }

        stikerList.innerHTML = "";

        data.stiker.forEach(stiker => {

            buatStiker(stiker.url);

        });

    } catch (error) {

        console.error(
            "Gagal mengambil stiker:",
            error
        );

    }
}

async function tandaiDibaca(idTeman) {
    try {
        await fetch(`/pesan/dibaca/${idTeman}`, {
            method: "PATCH"
        });

        // Perbarui titik hijau & hitungan unread
        loadRecent();

    } catch (error) {
        console.error("Gagal menandai dibaca:", error);
    }
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

        // Tandai pesan dari teman sebagai dibaca
        const adaBelumDibaca = data.pesan.some(p =>
            Number(p.id_pengirim) === Number(currentChatUserId) &&
            Number(p.dibaca) === 0
        );

        if (adaBelumDibaca && document.visibilityState === "visible") {
            tandaiDibaca(currentChatUserId);
        }

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
        loadStiker();
    }
}, 2000);

function mulaiReply(pesan) {
    pesanYangDireply = pesan.id;

    replyPreviewText.textContent = pesan.isi;

    replyPreview.style.display = "flex";

    input.placeholder = "Tulis balasan...";

    input.focus();
}

inputStiker.addEventListener("change", async () => {

    const file = inputStiker.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append("stiker", file);

    try {

        const response = await fetch("/upload-stiker", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!data.berhasil) {
            alert(data.pesan);
            return;
        }

        buatStiker(data.url);

        inputStiker.value = "";

    } catch (error) {

        console.error("Upload stiker gagal:", error);
        alert("Gagal upload stiker");

    }

});

async function kirimStiker(url) {

    if (!currentChatUserId) {
        console.log("Belum memilih teman");
        return;
    }

    try {

        const response =
            await fetch("/pesan", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    id_penerima:
                        currentChatUserId,

                    isi: url,

                    id_pesan_reply: null,

                    tipe: "stiker"
                })
            });

        const data =
            await response.json();

        if (!data.berhasil) {

            console.log(data.pesan);

            return;
        }

        loadPesan();
        loadRecent();

    } catch (error) {

        console.error(
            "Gagal mengirim stiker:",
            error
        );

    }
}

function buatStiker(url) {

    const img = document.createElement("img");

    img.src = url;
    img.className = "stiker";

    img.addEventListener("click", () => {
        kirimStiker(url);
    });

    stikerList.appendChild(img);
}

function inisial(nama) {
    const bersih = String(nama || "").trim() || "?";
    const kata = bersih.split(/\s+/);

    const huruf = teks => Array.from(teks)[0];

    const awal =
        huruf(kata[0]) +
        (kata.length > 1 ? huruf(kata[kata.length - 1]) : "");

    return awal.toUpperCase();
}

function warnaAvatar(nama) {
    let hash = 0;

    for (const huruf of String(nama)) {
        hash = (hash * 31 + huruf.charCodeAt(0)) % 360;
    }

    return `hsl(${hash}, 45%, 38%)`;
}

function buatAvatar(nama, online = false, kecil = false) {
    const avatar = document.createElement("div");

    avatar.className =
        "avatar" +
        (kecil ? " kecil" : "") +
        (online ? " online" : "");

    avatar.textContent = inisial(nama);
    avatar.style.background = warnaAvatar(nama);

    return avatar;
}

async function loadTeman() {
    try {
        // /friend-status sudah membawa nama, id_pengguna, dan status online
        const response = await fetch("/friend-status");
        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        daftarTeman = data.teman;

        renderTeman();

    } catch (error) {
        console.error("Gagal mengambil teman:", error);
    }
}

function renderTeman() {
    const contactList = document.getElementById("contactList");

    contactList.replaceChildren();

    const online = daftarTeman.filter(
        teman => teman.status === "online"
    );

    if (chipSemua) chipSemua.textContent = daftarTeman.length;
    if (chipOnline) chipOnline.textContent = online.length;

    const kata = filterTeman
        ? filterTeman.value.trim().toLowerCase()
        : "";

    const sumber = filterAktif === "online" ? online : daftarTeman;

    const tampil = sumber
        .filter(teman =>
            !kata ||
            String(teman.nama).toLowerCase().includes(kata) ||
            String(teman.id_pengguna || "").toLowerCase().includes(kata)
        )
        .sort((a, b) =>
            String(a.nama).localeCompare(String(b.nama))
        );

    if (tampil.length === 0) {
        const kosong = document.createElement("p");

        kosong.className = "kosong-teks";
        kosong.textContent =
            daftarTeman.length === 0
                ? "Belum ada teman."
                : "Tidak ada teman yang cocok.";

        contactList.appendChild(kosong);
        return;
    }

    tampil.forEach(teman => {
        const adaOnline = teman.status === "online";

        const kartu = document.createElement("div");
        kartu.className = "kartu-teman";

        const nama = document.createElement("h3");
        nama.textContent = teman.nama;

        const status = document.createElement("p");
        status.className =
            "status-teks" + (adaOnline ? " online" : "");
        status.textContent =
            adaOnline ? "Online sekarang" : "Offline";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-pesan";

        const ikon = document.createElement("i");
        ikon.className = "fa fa-comment";

        btn.append(ikon, " Pesan");

        btn.addEventListener("click", () => {
            bukaChat(teman.id, teman.nama);
        });

        kartu.append(buatAvatar(teman.nama, adaOnline), nama);

        if (teman.id_pengguna) {
            const username = document.createElement("p");
            username.className = "username";
            username.textContent = `@${teman.id_pengguna}`;
            kartu.appendChild(username);
        }

        kartu.append(status, btn);

        contactList.appendChild(kartu);
    });
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
            tampilkanPesan(pesan, fragment);
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


// ========================================
// PERMINTAAN PERTEMANAN
// ========================================

async function kirimPermintaan(idTeman) {
    try {
        const response = await fetch("/permintaan-teman", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_teman: idTeman
            })
        });

        const data = await response.json();

        alert(data.pesan);

    } catch (error) {
        console.error("Gagal mengirim permintaan:", error);
    }
}

async function jawabPermintaan(idPermintaan, aksi) {
    try {
        const response = await fetch(
            `/permintaan-teman/${idPermintaan}/${aksi}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!data.berhasil) {
            alert(data.pesan);
            return;
        }

        loadPermintaan();

        if (aksi === "terima") {
            loadTeman();
            loadFriends();
        }

    } catch (error) {
        console.error("Gagal menjawab permintaan:", error);
    }
}

async function loadPermintaan() {
    // Kalau elemen HTML-nya belum ditambahkan, lewati saja
    if (!requestList) {
        return;
    }

    try {
        const response = await fetch("/permintaan-teman");
        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        requestList.replaceChildren();

        const jumlah = data.permintaan.length;

        if (jumlahPermintaan) {
            jumlahPermintaan.textContent = jumlah > 0 ? jumlah : "";
        }

        if (chipReq) {
            chipReq.textContent = jumlah;
        }

        if (jumlah === 0) {
            const kosong = document.createElement("p");
            kosong.className = "kosong-teks";
            kosong.textContent = "Tidak ada permintaan.";
            requestList.appendChild(kosong);
            return;
        }

        data.permintaan.forEach(permintaan => {
            const item = document.createElement("div");
            item.className = "item-request";

            // baris atas: avatar + nama
            const atas = document.createElement("div");
            atas.className = "req-atas";

            const info = document.createElement("div");

            const nama = document.createElement("h4");
            nama.textContent = permintaan.nama;

            const sub = document.createElement("small");
            sub.textContent = "Ingin berteman denganmu";

            info.append(nama, sub);
            atas.append(buatAvatar(permintaan.nama, false, true), info);

            // baris bawah: tombol
            const aksi = document.createElement("div");
            aksi.className = "req-aksi";

            const btnTerima = document.createElement("button");
            btnTerima.type = "button";
            btnTerima.className = "btn-terima";
            btnTerima.textContent = "Terima";
            btnTerima.addEventListener("click", () => {
                jawabPermintaan(permintaan.id, "terima");
            });

            const btnTolak = document.createElement("button");
            btnTolak.type = "button";
            btnTolak.className = "btn-tolak";
            btnTolak.textContent = "Tolak";
            btnTolak.addEventListener("click", () => {
                jawabPermintaan(permintaan.id, "tolak");
            });

            aksi.append(btnTerima, btnTolak);

            item.append(atas, aksi);
            requestList.appendChild(item);
        });

    } catch (error) {
        console.error("Gagal memuat permintaan:", error);
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

        searchResult.replaceChildren();

        if (!data.berhasil || data.pengguna.length === 0) {
            const kosong = document.createElement("p");
            kosong.className = "kosong-teks";
            kosong.textContent = "Pengguna tidak ditemukan.";
            searchResult.appendChild(kosong);
            return;
        }

        data.pengguna.forEach(user => {
            const item = document.createElement("div");

            item.className = "resultofsearch";
            item.setAttribute("role", "button");

            const info = document.createElement("div");
            info.className = "info";

            const nama = document.createElement("h3");
            nama.textContent = user.nama;

            const idUser = document.createElement("p");
            idUser.textContent = user.id_pengguna
                ? `@${user.id_pengguna}`
                : `ID: ${user.id}`;

            info.append(nama, idUser);

            const tag = document.createElement("span");
            tag.className = "tag-tambah";
            tag.textContent = "+ Tambah";

            item.append(buatAvatar(user.nama, false, true), info, tag);

            item.addEventListener("click", () => {
                kirimPermintaan(user.id);
            });

            searchResult.appendChild(item);
        });

    } catch (error) {
        console.error("Gagal mencari teman:", error);
    }
});

// Tekan Enter di kotak pencarian = klik Cari
friendSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchFriend.click();
    }
});


// ---------- Halaman kontak: tombol, filter, chip ----------

if (btnTambahTeman && addFriendPanel) {
    btnTambahTeman.addEventListener("click", () => {
        const terbuka = addFriendPanel.classList.toggle("buka");

        if (terbuka) {
            friendSearch.focus();
        }
    });
}

if (filterTeman) {
    filterTeman.addEventListener("input", renderTeman);
}

semuaChip.forEach(chip => {
    chip.addEventListener("click", () => {
        filterAktif = chip.dataset.filter;

        semuaChip.forEach(c => {
            c.classList.toggle("aktif", c === chip);
        });

        renderTeman();
    });
});

if (chipPermintaan && kartuPermintaan) {
    chipPermintaan.addEventListener("click", () => {
        kartuPermintaan.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

if (btnSalinId) {
    btnSalinId.addEventListener("click", async () => {
        if (!currentIdPengguna) {
            alert("ID kamu belum tersedia, coba lagi sebentar.");
            return;
        }

        const label = btnSalinId.querySelector("span");

        try {
            await navigator.clipboard.writeText(
                String(currentIdPengguna)
            );

            if (label) {
                label.textContent = "Tersalin!";

                setTimeout(() => {
                    label.textContent = "Salin ID saya";
                }, 1500);
            }

        } catch (error) {
            // Clipboard butuh HTTPS/localhost; kalau gagal, tampilkan ID-nya
            prompt("Salin ID kamu:", currentIdPengguna);
        }
    });
}


input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});


hamburger.addEventListener("click", () => {
    const tertutup = sidebar.classList.toggle("hide");

    mainContent.classList.toggle("sidebar-closed", tertutup);

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
        loadRecent();

    } catch (error) {
        console.error("Gagal mengirim pesan:", error);
    }
});


// ========================================
// LOCATION TRACKING
// ========================================

function requestLocationPermission() {
    if (!navigator.geolocation) {
        console.log("Geolocation tidak didukung browser ini");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Lokasi berhasil didapatkan:", latitude, longitude);
            saveLocationToServer(latitude, longitude);
        },
        (error) => {
            console.log("Error mendapatkan lokasi:", error.message);
            // Handle permission denied
            if (error.code === error.PERMISSION_DENIED) {
                console.log("User menolak akses lokasi");
            }
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

async function saveLocationToServer(latitude, longitude) {
    try {
        const response = await fetch("/save-location", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                latitude,
                longitude
            })
        });

        const data = await response.json();

        if (data.berhasil) {
            console.log("Lokasi berhasil disimpan ke server");
        } else {
            console.error("Gagal menyimpan lokasi:", data.pesan);
        }
    } catch (error) {
        console.error("Error menyimpan lokasi:", error);
    }
}

async function getLocationFromServer(userId) {
    try {
        const response = await fetch(`/get-location/${userId}`);
        const data = await response.json();

        if (data.berhasil) {
            console.log("Lokasi dari server:", data.location);
            return data;
        } else {
            console.log("Lokasi belum tersimpan");
            return null;
        }
    } catch (error) {
        console.error("Error mengambil lokasi:", error);
        return null;
    }
}

//--------------------------------------------------
//              Cek status login user dan load teman
//--------------------------------------------------



fetch("/me")
    .then(response => response.json())
    .then(data => {

        if (!data.berhasil) {
            window.location.href = "/login.html";
            return;
        }

        const user = data.user;

        currentUserId = user.id;
        currentIdPengguna = user.id_pengguna;

        console.log("User login:", currentUserId);

        document.getElementById("namaUser").textContent =
            user.nama;

        // Request lokasi setelah user berhasil login
        requestLocationPermission();
    });


let heartbeat;

async function setStatus(status) {
    try {
        const response = await fetch("/set-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
            keepalive: true
        });

        const hasil = await response.json();

        if (!response.ok) {
            console.error("Gagal mengubah status:", hasil);
            return;
        }

        console.log("Respons status:", hasil);
    } catch (error) {
        console.error("Gagal menghubungi server:", error);
    }
}

function setOfflineBeacon() {
    navigator.sendBeacon(
        "/set-status",
        new Blob([JSON.stringify({ status: "offline" })], { type: "application/json" })
    );
}


setStatus("online");

heartbeat = setInterval(() => {
    setStatus("online");
}, 30000);

window.addEventListener("pagehide", () => {
    clearInterval(heartbeat);
    setOfflineBeacon();
});


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        setOfflineBeacon();
    } else {
        setStatus("online");
    }
});

async function loadFriends() {
    try {
        const response = await fetch("/friend-status", {
            credentials: "include"
        });

        const hasil = await response.json();

        if (!response.ok || !hasil.berhasil) {
            throw new Error(hasil.pesan || "Gagal memuat teman");
        }

        al.replaceChildren();

        const temanOnline = hasil.teman.filter(
            teman => teman.status === "online"
        );

        // Hitungan teman online
        tagOnline.textContent =
            `${temanOnline.length} friend${temanOnline.length === 1 ? "" : "s"} online`;

        temanOnline.forEach(teman => {
            const item = document.createElement("div");
            item.className = "active-people";
            item.id = teman.id;

            const avatar = buatAvatar(teman.nama, true);

            const nama = document.createElement("h3");
            nama.textContent = teman.nama;

            const status = document.createElement("p");
            status.className = `friend-status ${teman.status}`;
            status.textContent =
                teman.status === "online" ? "● Online" : "○ Offline";

            item.append(avatar, nama, status);
            al.appendChild(item);
        });

    } catch (error) {
        console.error("Gagal memuat teman:", error);
    }
}

async function loadRecent() {
    try {
        const response = await fetch("/chat-terbaru");
        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        listRecent.replaceChildren();

        // Jumlahkan semua pesan belum dibaca dari semua teman
        const totalUnread = data.chat.reduce(
            (jumlah, chat) => jumlah + Number(chat.belum_dibaca),
            0
        );

        tagUnread.textContent =
            `${totalUnread} unread message${totalUnread === 1 ? "" : "s"}`;

        data.chat.forEach(chat => {

            // <div class="human-recent">
            const humanRecent = document.createElement("div");
            humanRecent.className = "human-recent";

            // <div class="up-human-recent">
            const up = document.createElement("div");
            up.className = "up-human-recent";

            const avatar = buatAvatar(chat.nama);

            // <div class="child-human-recent">
            const child = document.createElement("div");
            child.className = "child-human-recent";

            const nama = document.createElement("h3");
            nama.textContent = chat.nama;

            const pesanTerakhir = document.createElement("p");

            let teks = chat.tipe === "stiker" ? "Stiker" : chat.isi;

            if (Number(chat.dari_saya) === 1) {
                teks = "Kamu: " + teks;
            }

            pesanTerakhir.textContent = teks;

            child.append(nama, pesanTerakhir);
            up.append(avatar, child);


            // <div class="status"><i class="fa fa-circle"></i></div>
            const status = document.createElement("div");

            const adaBaru = Number(chat.belum_dibaca) > 0;

            status.className = "status " + (adaBaru ? "baru" : "kosong");

            const ikon = document.createElement("i");
            ikon.className = "fa fa-circle";

            status.appendChild(ikon);

            humanRecent.append(up, status);

            // klik untuk membuka chat
            humanRecent.addEventListener("click", () => {
                bukaChat(chat.id, chat.nama);
            });

            listRecent.appendChild(humanRecent);
        });

    } catch (error) {
        console.error("Gagal memuat chat terbaru:", error);
    }
}

loadRecent();
setInterval(loadRecent, 5000);


loadFriends();

// Perbarui daftar setiap 15 detik
setInterval(loadFriends, 15000);

loadTeman();
setInterval(loadTeman, 15000);

loadPermintaan();
setInterval(loadPermintaan, 10000);

// Update lokasi setiap 30 detik jika sudah ada izin
setInterval(() => {
    if (currentUserId) {
        requestLocationPermission();
    }
}, 30000);
