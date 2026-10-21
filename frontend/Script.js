let currentUserId = null;
let currentChatUserId = null;

let pesanPalingLamaId = null;
let sedangLoadPesanLama = false;
let masihAdaPesan = true;
let pesanYangDireply = null;

let currentIdPengguna = null;
let daftarTeman = [];
let filterAktif = "semua";

let currentChatNama = "";
let daftarChat = [];
let filterInbox = "semua";
let signaturTerakhir = null;
let paksaScroll = false;

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
const profilePage = document.querySelector(".profile-page");
const settingsPage = document.querySelector(".settings-page");

const semuaMenu = document.querySelectorAll(".menu-item");

const homeMenu = document.querySelector(".home-menu");
const chatMenu = document.querySelector(".chat-menu");
const profileMenu = document.querySelector(".profile-menu");
const settingMenu = document.querySelector(".setting-menu");
const kontak = document.querySelector(".contact-menu");

const chatList = document.getElementById("chatList");

const chatShell = document.getElementById("chatShell");
const chatAvatar = document.getElementById("chatAvatar");
const chatStatus = document.getElementById("chatStatus");
const btnKembaliInbox = document.getElementById("btnKembaliInbox");

const inboxList = document.getElementById("inboxList");
const cariInbox = document.getElementById("cariInbox");
const chipInboxBelum = document.getElementById("chipInboxBelum");
const btnPesanBaru = document.getElementById("btnPesanBaru");
const semuaChipInbox = document.querySelectorAll(".chip[data-inbox]");

const btnEmoji = document.getElementById("btnEmoji");
const emojiPanel = document.getElementById("emojiPanel");
const emojiSering = document.getElementById("emojiSering");
const emojiSemua = document.getElementById("emojiSemua");
const tutupEmojiBtn = document.getElementById("tutupEmoji");

const tombolTab = document.querySelectorAll(".tab-btn[data-tab]");
const tabEmoji = document.getElementById("tabEmoji");
const tabStiker = document.getElementById("tabStiker");
const tambahStiker = document.getElementById("tambahStiker");
const inputStiker = document.getElementById("inputStiker");
const stikerList = document.getElementById("stikerList");

const mainContent = document.getElementById("mainContent");
const home = document.querySelector(".home");

const al = document.querySelector(".active-list");

const listRecent = document.querySelector(".list-recent");

const tagUnread = document.querySelector(".tag-unread");
const tagOnline = document.querySelector(".tag-online");


chatList.addEventListener("scroll", () => {
    if (chatList.scrollTop <= 100) {
        loadPesanLama();
    }
});

function bukaPage(page) {
    contactPage.style.display = "none";
    chatPage.style.display = "none";
    profilePage.style.display = "none";
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

    loadRecent();
});

profileMenu.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(profilePage);
    aktifkanMenu(profileMenu);

    renderProfilePage();
});

settingMenu.addEventListener("click", (e) => {
    e.preventDefault();

    bukaPage(settingsPage);
    aktifkanMenu(settingMenu);

    isiFormAkunDariData();
});






function bukaChat(idTeman, namaTeman) {
    currentChatUserId = idTeman;
    currentChatNama = namaTeman;

    pesanPalingLamaId = null;
    sedangLoadPesanLama = false;
    masihAdaPesan = true;
    signaturTerakhir = null;
    paksaScroll = true;

    bukaPage(chatPage);
    aktifkanMenu(chatMenu);

    // bersihkan sisa percakapan sebelumnya
    chatList.replaceChildren();
    batalkanReply();
    tutupEmoji();

    if (chatShell) {
        chatShell.classList.add("ada-chat");
    }

    perbaruiHeaderChat();
    renderInbox();

    loadPesan();
}

function perbaruiHeaderChat() {
    if (!currentChatUserId) {
        return;
    }

    const judul = document.getElementById("chatTitle");

    if (judul) {
        judul.textContent = currentChatNama;
    }

    const teman = daftarTeman.find(
        t => Number(t.id) === Number(currentChatUserId)
    );

    const online = !!teman && teman.status === "online";

    if (chatAvatar) {
        chatAvatar.replaceChildren(
            buatAvatar(currentChatNama, online)
        );
    }

    if (chatStatus) {
        chatStatus.textContent = online ? "Online sekarang" : "Offline";
        chatStatus.className = "chat-status" + (online ? " online" : "");
    }
}

function batalkanReply() {
    pesanYangDireply = null;

    replyPreviewText.textContent = "";

    replyPreview.style.display = "none";

    input.placeholder = "Tulis pesan...";
}


// ---------- Tanggal & jam ----------

function kunciTanggal(tgl) {
    return tgl.toDateString();
}

function labelTanggal(tgl) {
    const sekarang = new Date();

    const kemarin = new Date();
    kemarin.setDate(sekarang.getDate() - 1);

    if (tgl.toDateString() === sekarang.toDateString()) {
        return "Hari ini";
    }

    if (tgl.toDateString() === kemarin.toDateString()) {
        return "Kemarin";
    }

    return tgl.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function buatPemisahTanggal(tgl) {
    const pemisah = document.createElement("div");

    pemisah.className = "pemisah-tanggal";
    pemisah.dataset.kunci = kunciTanggal(tgl);

    const teks = document.createElement("span");
    teks.textContent = labelTanggal(tgl);

    pemisah.appendChild(teks);

    return pemisah;
}

function waktuSingkat(iso) {
    const tgl = new Date(iso);
    const menit = Math.floor((Date.now() - tgl.getTime()) / 60000);

    if (isNaN(menit)) return "";
    if (menit < 1) return "baru";
    if (menit < 60) return `${menit}m`;
    if (menit < 60 * 24) return `${Math.floor(menit / 60)}j`;
    if (menit < 60 * 48) return "Kemarin";

    return tgl.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short"
    });
}


// ---------- Pesan ----------

// Menampilkan banyak pesan sekaligus + pemisah tanggal.
// Mengembalikan kunci tanggal pesan terakhir.
function tampilkanDaftarPesan(daftar, wadah) {
    let terakhir = null;

    daftar.forEach(pesan => {
        const tgl = new Date(pesan.tanggal_waktu);
        const kunci = kunciTanggal(tgl);

        if (kunci !== terakhir) {
            wadah.appendChild(buatPemisahTanggal(tgl));
            terakhir = kunci;
        }

        tampilkanPesan(pesan, wadah);
    });

    return terakhir;
}

function tampilkanPesan(pesan, wadah) {

    const pesanSaya =
        Number(pesan.id_pengirim) ===
        Number(currentUserId);

    const baris = document.createElement("div");

    baris.className =
        "pesan-baris " + (pesanSaya ? "keluar" : "masuk");

    baris.dataset.id = pesan.id;

    const gelembung = document.createElement("div");

    gelembung.className = "pesan";


    let isiPesan;

    // Stiker lama tetap bisa tampil (fitur kirim stiker sudah dihapus)
    if (pesan.tipe === "stiker") {

        const img = document.createElement("img");

        img.src = pesan.isi;
        img.alt = "Stiker";
        img.className = "stiker-pesan";

        isiPesan = img;

    } else {

        const p = document.createElement("p");

        p.className = "isipesan";
        p.textContent = pesan.isi;

        isiPesan = p;

    }


    if (
        pesan.id_pesan_reply &&
        pesan.isi_pesan_reply
    ) {

        const replyDalamPesan = document.createElement("div");
        replyDalamPesan.className = "reply-dalam-pesan";
        replyDalamPesan.setAttribute("role", "button");

        // Nama pengirim pesan yang dibalas (butuh kolom id_pengirim_reply dari server)
        if (
            pesan.id_pengirim_reply !== undefined &&
            pesan.id_pengirim_reply !== null
        ) {
            const namaReply = document.createElement("strong");
            namaReply.className = "reply-nama";

            namaReply.textContent =
                Number(pesan.id_pengirim_reply) === Number(currentUserId)
                    ? "Kamu"
                    : currentChatNama;

            replyDalamPesan.appendChild(namaReply);
        }

        const teksReply = document.createElement("p");

        teksReply.textContent =
            pesan.tipe_pesan_reply === "stiker"
                ? "Stiker"
                : pesan.isi_pesan_reply;

        replyDalamPesan.appendChild(teksReply);

        replyDalamPesan.addEventListener("click", () => {
            lompatKePesan(pesan.id_pesan_reply);
        });

        gelembung.appendChild(replyDalamPesan);
    }

    gelembung.appendChild(isiPesan);


    // Jam + centang dibaca
    const meta = document.createElement("div");
    meta.className = "pesan-meta";

    const waktu = document.createElement("span");
    waktu.className = "waktu-pesan";

    waktu.textContent =
        new Date(pesan.tanggal_waktu).toLocaleTimeString(
            "en-GB",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    meta.appendChild(waktu);

    if (pesanSaya) {

        const sudahDibaca = Number(pesan.dibaca) === 1;

        const centang = document.createElement("span");

        centang.className =
            "centang-pesan" + (sudahDibaca ? " dibaca" : "");

        centang.textContent = sudahDibaca ? "✓✓" : "✓";

        meta.appendChild(centang);
    }


    // Tombol aksi (muncul saat kursor di atas pesan)
    const aksi = document.createElement("div");
    aksi.className = "aksi-pesan";

    const balas = document.createElement("button");
    balas.type = "button";
    balas.textContent = "Balas";

    balas.addEventListener("click", () => {
        mulaiReply(pesan);
    });

    aksi.appendChild(balas);

    if (pesanSaya) {

        if (pesan.tipe !== "stiker") {

            const edit = document.createElement("button");
            edit.type = "button";
            edit.textContent = "Edit";

            edit.addEventListener("click", () => {
                editPesan(pesan.id, isiPesan, pesan.isi);
            });

            aksi.appendChild(edit);
        }

        const hapus = document.createElement("button");
        hapus.type = "button";
        hapus.textContent = "Hapus";

        hapus.addEventListener("click", () => {
            hapusPesan(pesan.id, baris);
        });

        aksi.appendChild(hapus);
    }

    baris.append(gelembung, meta, aksi);

    wadah.appendChild(baris);
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
    if (!currentChatUserId) {
        return;
    }

    const idSaatIni = currentChatUserId;

    try {
        const response = await fetch(`/pesan/${idSaatIni}`);

        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        // Kalau pengguna sudah pindah chat selama menunggu, abaikan
        if (idSaatIni !== currentChatUserId) {
            return;
        }

        // Tandai pesan dari teman sebagai dibaca
        const adaBelumDibaca = data.pesan.some(p =>
            Number(p.id_pengirim) === Number(idSaatIni) &&
            Number(p.dibaca) === 0
        );

        if (adaBelumDibaca && document.visibilityState === "visible") {
            tandaiDibaca(idSaatIni);
        }

        // Jangan gambar ulang kalau tidak ada yang berubah
        const signature = data.pesan
            .map(p => `${p.id}:${p.dibaca}:${p.isi}`)
            .join("|");

        if (signature === signaturTerakhir) {
            return;
        }

        signaturTerakhir = signature;

        const posisiLama = chatList.scrollTop;

        const dekatBawah =
            chatList.scrollHeight -
            chatList.scrollTop -
            chatList.clientHeight < 120;

        chatList.replaceChildren();

        if (data.pesan.length === 0) {
            const sepi = document.createElement("p");
            sepi.className = "chat-sepi";
            sepi.textContent = "Belum ada pesan. Sapa duluan!";
            chatList.appendChild(sepi);
        } else {
            tampilkanDaftarPesan(data.pesan, chatList);
        }

        if (data.pesan.length > 0) {
            pesanPalingLamaId = data.pesan[0].id;
        }

        masihAdaPesan = data.adaLagi;

        if (paksaScroll || dekatBawah) {
            paksaScroll = false;

            requestAnimationFrame(() => {
                chatList.scrollTop = chatList.scrollHeight;
            });
        } else {
            chatList.scrollTop = posisiLama;
        }

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

    const saya =
        Number(pesan.id_pengirim) === Number(currentUserId);

    // label "Membalas ..." ada tepat di atas teks preview
    const label = replyPreviewText.previousElementSibling;

    if (label) {
        label.textContent =
            "Membalas " + (saya ? "dirimu sendiri" : currentChatNama);
    }

    replyPreviewText.textContent =
        pesan.tipe === "stiker" ? "Stiker" : pesan.isi;

    replyPreview.style.display = "flex";

    input.placeholder = "Tulis balasan...";

    input.focus();
}

// Klik kutipan balasan = gulir ke pesan aslinya (kalau sudah termuat)
function lompatKePesan(id) {
    const target = chatList.querySelector(
        `.pesan-baris[data-id="${Number(id)}"]`
    );

    if (!target) {
        return;
    }

    target.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    target.classList.add("sorot");

    setTimeout(() => {
        target.classList.remove("sorot");
    }, 1300);
}

// Enter = kirim, Shift+Enter = baris baru (hanya di perangkat dengan mouse;
// di HP, Enter tetap membuat baris baru)
input.addEventListener("keydown", (e) => {
    const pakaiMouse = window.matchMedia("(pointer: fine)").matches;

    if (
        pakaiMouse &&
        e.key === "Enter" &&
        !e.shiftKey &&
        !e.isComposing
    ) {
        e.preventDefault();
        btnInputChat.click();
    }
});


// ---------- Emoji ----------

const EMOJI_BAWAAN = ["😊", "✨", "💜", "👋", "🙌", "🔥"];

const EMOJI_SEMUA = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣",
    "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😋",
    "😎", "🤩", "🥳", "😏", "😢", "😭", "😤", "😡",
    "🤔", "🙄", "😴", "🤯", "😱", "🥺", "😬", "🤗",
    "👍", "👎", "👏", "🙌", "🙏", "💪", "👋", "🤝",
    "✌️", "👌", "🤞", "🫶", "❤️", "💜", "💙", "💚",
    "🔥", "✨", "⭐", "🎉", "🎊", "💯", "✅", "❌",
    "🍕", "🍔", "🍟", "☕", "🎮", "🎵", "📷", "🚀"
];

function ambilEmojiSering() {
    try {
        return JSON.parse(localStorage.getItem("emojiSering") || "{}");
    } catch (error) {
        return {};
    }
}

function catatEmoji(emoji) {
    const data = ambilEmojiSering();

    data[emoji] = (data[emoji] || 0) + 1;

    try {
        localStorage.setItem("emojiSering", JSON.stringify(data));
    } catch (error) {
        // abaikan kalau penyimpanan browser tidak tersedia
    }
}

function daftarEmojiSering() {
    const data = ambilEmojiSering();

    const hasil = Object.keys(data)
        .sort((a, b) => data[b] - data[a])
        .slice(0, 6);

    // lengkapi dengan emoji bawaan sampai 6
    EMOJI_BAWAAN.forEach(emoji => {
        if (hasil.length < 6 && !hasil.includes(emoji)) {
            hasil.push(emoji);
        }
    });

    return hasil;
}

function sisipkanEmoji(emoji) {
    const awal = input.selectionStart ?? input.value.length;
    const akhir = input.selectionEnd ?? awal;

    input.value =
        input.value.slice(0, awal) +
        emoji +
        input.value.slice(akhir);

    const posisi = awal + emoji.length;

    input.setSelectionRange(posisi, posisi);
    input.focus();

    // supaya tinggi kotak ketik ikut menyesuaikan
    input.dispatchEvent(new Event("input"));
}

function buatTombolEmoji(emoji) {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "emoji-btn";
    btn.textContent = emoji;

    btn.addEventListener("click", () => {
        sisipkanEmoji(emoji);
        catatEmoji(emoji);
        renderEmojiSering();
    });

    return btn;
}

function renderEmojiSering() {
    if (!emojiSering) return;

    emojiSering.replaceChildren(
        ...daftarEmojiSering().map(buatTombolEmoji)
    );
}

function isiPanelEmoji() {
    if (emojiSemua) {
        emojiSemua.replaceChildren(
            ...EMOJI_SEMUA.map(buatTombolEmoji)
        );
    }

    renderEmojiSering();
}

function tutupEmoji() {
    if (emojiPanel) {
        emojiPanel.classList.remove("buka");
    }
}

if (btnEmoji && emojiPanel) {
    isiPanelEmoji();

    btnEmoji.addEventListener("click", () => {
        emojiPanel.classList.toggle("buka");
    });

    // klik di luar panel = tutup
    document.addEventListener("click", (e) => {
        // tombol yang baru saja dirender ulang sudah lepas dari halaman
        if (!e.target.isConnected) {
            return;
        }

        if (!e.target.closest("#emojiPanel, #btnEmoji")) {
            tutupEmoji();
        }
    });
}

if (tutupEmojiBtn) {
    tutupEmojiBtn.addEventListener("click", tutupEmoji);
}


// ---------- Stiker ----------

let stikerSudahDimuat = false;

function pilihTab(nama) {
    tombolTab.forEach(btn => {
        btn.classList.toggle("aktif", btn.dataset.tab === nama);
    });

    if (tabEmoji) tabEmoji.hidden = nama !== "emoji";
    if (tabStiker) tabStiker.hidden = nama !== "stiker";

    if (nama === "stiker" && !stikerSudahDimuat) {
        loadStiker();
    }
}

tombolTab.forEach(btn => {
    btn.addEventListener("click", () => {
        pilihTab(btn.dataset.tab);
    });
});

async function loadStiker() {
    if (!stikerList) {
        return;
    }

    try {
        const response = await fetch("/stiker");
        const data = await response.json();

        if (!data.berhasil) {
            return;
        }

        stikerSudahDimuat = true;

        stikerList.replaceChildren();

        // abaikan berkas penanda folder kosong dari penyimpanan (nama diawali titik)
        const daftar = data.stiker.filter(
            stiker => !String(stiker.nama).startsWith(".")
        );

        if (daftar.length === 0) {
            const kosong = document.createElement("p");

            kosong.className = "stiker-kosong";
            kosong.textContent =
                "Belum ada stiker. Klik Tambah untuk mengunggah.";

            stikerList.appendChild(kosong);
            return;
        }

        daftar.forEach(stiker => {
            buatStiker(stiker.url);
        });

    } catch (error) {
        console.error("Gagal mengambil stiker:", error);
    }
}

function buatStiker(url) {
    const img = document.createElement("img");

    img.src = url;
    img.alt = "Stiker";
    img.loading = "lazy";
    img.className = "stiker";

    img.addEventListener("click", () => {
        kirimStiker(url);
    });

    stikerList.appendChild(img);
}

async function kirimStiker(url) {
    if (!currentChatUserId) {
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
                isi: url,
                id_pesan_reply: pesanYangDireply,
                tipe: "stiker"
            })
        });

        const data = await response.json();

        if (!data.berhasil) {
            console.log(data.pesan);
            return;
        }

        tutupEmoji();
        batalkanReply();

        paksaScroll = true;

        loadPesan();
        loadRecent();

    } catch (error) {
        console.error("Gagal mengirim stiker:", error);
    }
}

if (tambahStiker && inputStiker) {
    tambahStiker.addEventListener("click", () => {
        inputStiker.click();
    });

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

            await loadStiker();

        } catch (error) {
            console.error("Upload stiker gagal:", error);
            alert("Gagal upload stiker");

        } finally {
            inputStiker.value = "";
        }
    });
}


// ---------- Kotak masuk (daftar percakapan) ----------

function renderInbox() {
    if (!inboxList) {
        return;
    }

    const posisi = inboxList.scrollTop;

    const kata = cariInbox
        ? cariInbox.value.trim().toLowerCase()
        : "";

    const jumlahBelum = daftarChat.filter(
        chat => Number(chat.belum_dibaca) > 0
    ).length;

    if (chipInboxBelum) {
        chipInboxBelum.textContent = jumlahBelum;
    }

    const tampil = daftarChat.filter(chat => {
        if (filterInbox === "belum" && Number(chat.belum_dibaca) === 0) {
            return false;
        }

        return !kata || String(chat.nama).toLowerCase().includes(kata);
    });

    inboxList.replaceChildren();

    if (tampil.length === 0) {
        const kosong = document.createElement("p");

        kosong.className = "inbox-kosong";
        kosong.textContent =
            daftarChat.length === 0
                ? "Belum ada percakapan. Mulai dari halaman Contacts."
                : "Tidak ada percakapan yang cocok.";

        inboxList.appendChild(kosong);
        return;
    }

    tampil.forEach(chat => {
        const aktif =
            Number(chat.id) === Number(currentChatUserId);

        const teman = daftarTeman.find(
            t => Number(t.id) === Number(chat.id)
        );

        const online = !!teman && teman.status === "online";

        const item = document.createElement("div");

        item.className = "inbox-item" + (aktif ? " aktif" : "");
        item.setAttribute("role", "button");

        const info = document.createElement("div");
        info.className = "inbox-info";

        // baris 1: nama + waktu
        const baris1 = document.createElement("div");
        baris1.className = "inbox-baris";

        const nama = document.createElement("span");
        nama.className = "inbox-nama";
        nama.textContent = chat.nama;

        const waktu = document.createElement("span");
        waktu.className = "inbox-waktu";
        waktu.textContent = waktuSingkat(chat.tanggal_waktu);

        baris1.append(nama, waktu);

        // baris 2: pesan terakhir + badge belum dibaca
        const baris2 = document.createElement("div");
        baris2.className = "inbox-baris";

        const pesanTerakhir = document.createElement("span");
        pesanTerakhir.className = "inbox-pesan";

        let teks = chat.tipe === "stiker" ? "Stiker" : chat.isi;

        if (Number(chat.dari_saya) === 1) {
            teks = "Kamu: " + teks;
        }

        pesanTerakhir.textContent = teks;

        baris2.appendChild(pesanTerakhir);

        if (Number(chat.belum_dibaca) > 0) {
            const badge = document.createElement("span");

            badge.className = "badge-unread";
            badge.textContent = chat.belum_dibaca;

            baris2.appendChild(badge);
        }

        info.append(baris1, baris2);

        item.append(buatAvatar(chat.nama, online), info);

        item.addEventListener("click", () => {
            bukaChat(chat.id, chat.nama);
        });

        inboxList.appendChild(item);
    });

    inboxList.scrollTop = posisi;
}

if (cariInbox) {
    cariInbox.addEventListener("input", renderInbox);
}

semuaChipInbox.forEach(chip => {
    chip.addEventListener("click", () => {
        filterInbox = chip.dataset.inbox;

        semuaChipInbox.forEach(c => {
            c.classList.toggle("aktif", c === chip);
        });

        renderInbox();
    });
});

// Tombol pensil = mulai pesan baru (pilih teman dari halaman Contacts)
if (btnPesanBaru) {
    btnPesanBaru.addEventListener("click", () => {
        bukaPage(contactPage);
        aktifkanMenu(kontak);
    });
}

// Tombol kembali (tampilan HP): tutup percakapan, balik ke daftar
if (btnKembaliInbox) {
    btnKembaliInbox.addEventListener("click", () => {
        currentChatUserId = null;
        currentChatNama = "";

        if (chatShell) {
            chatShell.classList.remove("ada-chat");
        }

        renderInbox();
    });
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
        perbaruiHeaderChat();
        renderInbox();

        if (profilePage && profilePage.style.display !== "none") {
            renderProfilePage();
        }

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

    const idSaatIni = currentChatUserId;
    const tinggiSebelum = chatList.scrollHeight;

    try {
        const response = await fetch(
            `/pesan/${idSaatIni}?before=${pesanPalingLamaId}`
        );

        const data = await response.json();

        if (!data.berhasil || idSaatIni !== currentChatUserId) {
            return;
        }

        const fragment = document.createDocumentFragment();

        const kunciTerakhir =
            tampilkanDaftarPesan(data.pesan, fragment);

        // Hindari pemisah tanggal ganda di sambungan dua kelompok pesan
        const pertama = chatList.firstElementChild;

        if (
            pertama &&
            pertama.classList.contains("pemisah-tanggal") &&
            pertama.dataset.kunci === kunciTerakhir
        ) {
            pertama.remove();
        }

        chatList.prepend(fragment);

        if (data.pesan.length > 0) {
            pesanPalingLamaId = data.pesan[0].id;
        }

        masihAdaPesan = data.adaLagi;

        chatList.scrollTop =
            chatList.scrollHeight - tinggiSebelum;

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

        paksaScroll = true;

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


// ========================================
// TEMA, AKSEN, KEPADATAN (Settings → Appearance)
// ========================================

const KUNCI_TEMA = "cht_tema";
const KUNCI_AKSEN = "cht_aksen";
const KUNCI_KEPADATAN = "cht_kepadatan";

const PETA_AKSEN_HOVER = {
    "#6c5ce7": "#7d6ff0",
    "#2ecc71": "#4cd787",
    "#ff6b81": "#ff8a9b",
    "#0fb9b1": "#36d0c9",
    "#f0932b": "#f5a94f"
};

function resolveTemaSistem() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

function terapkanTema(tema) {
    const efektif = tema === "system" ? resolveTemaSistem() : tema;
    document.documentElement.dataset.theme = efektif;

    document.querySelectorAll(".opsi-tema").forEach(btn => {
        btn.classList.toggle("aktif", btn.dataset.tema === tema);
    });
}

function terapkanAksen(warna) {
    document.documentElement.style.setProperty("--k-aksen", warna);
    document.documentElement.style.setProperty(
        "--k-aksen-hover",
        PETA_AKSEN_HOVER[warna] || warna
    );

    document.querySelectorAll(".dot-aksen").forEach(dot => {
        dot.classList.toggle("aktif", dot.dataset.aksen === warna);
    });
}

function terapkanKepadatan(nilai) {
    document.body.dataset.kepadatan = nilai;

    const select = document.getElementById("pilihanKepadatan");
    if (select) select.value = nilai;
}

function muatPreferensiTampilan() {
    const tema = localStorage.getItem(KUNCI_TEMA) || "dark";
    const aksen = localStorage.getItem(KUNCI_AKSEN) || "#6c5ce7";
    const kepadatan = localStorage.getItem(KUNCI_KEPADATAN) || "nyaman";

    terapkanTema(tema);
    terapkanAksen(aksen);
    terapkanKepadatan(kepadatan);
}

muatPreferensiTampilan();

if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
        const tema = localStorage.getItem(KUNCI_TEMA) || "dark";
        if (tema === "system") terapkanTema("system");
    });
}

document.querySelectorAll(".opsi-tema").forEach(btn => {
    btn.addEventListener("click", () => {
        localStorage.setItem(KUNCI_TEMA, btn.dataset.tema);
        terapkanTema(btn.dataset.tema);
    });
});

document.querySelectorAll(".dot-aksen").forEach(dot => {
    dot.addEventListener("click", () => {
        localStorage.setItem(KUNCI_AKSEN, dot.dataset.aksen);
        terapkanAksen(dot.dataset.aksen);
    });
});

const pilihanKepadatanEl = document.getElementById("pilihanKepadatan");

if (pilihanKepadatanEl) {
    pilihanKepadatanEl.addEventListener("change", () => {
        localStorage.setItem(KUNCI_KEPADATAN, pilihanKepadatanEl.value);
        terapkanKepadatan(pilihanKepadatanEl.value);
    });
}


// ========================================
// SETTINGS: TAB
// ========================================

const semuaTabSettings = document.querySelectorAll(".settings-tab[data-tab-settings]");
const semuaSeksiSettings = document.querySelectorAll(".settings-section[data-section-settings]");

semuaTabSettings.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tabSettings;

        semuaTabSettings.forEach(t => t.classList.toggle("aktif", t === tab));

        semuaSeksiSettings.forEach(seksi => {
            seksi.hidden = seksi.dataset.sectionSettings !== target;
        });
    });
});


// ========================================
// SETTINGS: AKUN (nama & email)
// ========================================

const inputNamaSettings = document.getElementById("inputNamaSettings");
const inputUsernameSettings = document.getElementById("inputUsernameSettings");
const inputEmailSettings = document.getElementById("inputEmailSettings");
const settingsAvatar = document.getElementById("settingsAvatar");
const settingsNamaSingkat = document.getElementById("settingsNamaSingkat");
const statusSimpanAkun = document.getElementById("statusSimpanAkun");
const simpanAkunBtn = document.getElementById("simpanAkun");

let dataAkunSaatIni = null;

function isiFormAkunDariData() {
    if (!dataAkunSaatIni) return;

    if (inputNamaSettings) inputNamaSettings.value = dataAkunSaatIni.nama || "";
    if (inputUsernameSettings) inputUsernameSettings.value = dataAkunSaatIni.id_pengguna || "";
    if (inputEmailSettings) inputEmailSettings.value = dataAkunSaatIni.email || "";

    if (settingsAvatar) {
        settingsAvatar.replaceChildren(buatAvatar(dataAkunSaatIni.nama));
    }

    if (settingsNamaSingkat) {
        settingsNamaSingkat.textContent = dataAkunSaatIni.nama || "";
    }
}

if (simpanAkunBtn) {
    simpanAkunBtn.addEventListener("click", async () => {
        const nama = inputNamaSettings.value.trim();
        const email = inputEmailSettings.value.trim();

        if (!nama || !email) {
            statusSimpanAkun.textContent = "Nama dan email wajib diisi.";
            statusSimpanAkun.className = "settings-status-simpan gagal";
            return;
        }

        simpanAkunBtn.disabled = true;
        statusSimpanAkun.textContent = "";
        statusSimpanAkun.className = "settings-status-simpan";

        try {
            const response = await fetch("/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama, email })
            });

            const data = await response.json();

            if (!data.berhasil) {
                statusSimpanAkun.textContent = data.pesan || "Gagal menyimpan perubahan.";
                statusSimpanAkun.className = "settings-status-simpan gagal";
                return;
            }

            dataAkunSaatIni = data.user;
            isiFormAkunDariData();
            renderProfilePage();

            const namaUserEl = document.getElementById("namaUser");
            if (namaUserEl) namaUserEl.textContent = data.user.nama;

            statusSimpanAkun.textContent = "Perubahan tersimpan.";
            statusSimpanAkun.className = "settings-status-simpan sukses";

        } catch (error) {
            console.error("Gagal menyimpan akun:", error);
            statusSimpanAkun.textContent = "Tidak bisa menghubungi server.";
            statusSimpanAkun.className = "settings-status-simpan gagal";

        } finally {
            simpanAkunBtn.disabled = false;
        }
    });
}


// ========================================
// SETTINGS: GANTI KATA SANDI
// ========================================

const bukaGantiPasswordBtn = document.getElementById("bukaGantiPassword");
const panelGantiPassword = document.getElementById("panelGantiPassword");
const batalGantiPasswordBtn = document.getElementById("batalGantiPassword");
const simpanPasswordBaruBtn = document.getElementById("simpanPasswordBaru");
const statusGantiPassword = document.getElementById("statusGantiPassword");

if (bukaGantiPasswordBtn && panelGantiPassword) {
    bukaGantiPasswordBtn.addEventListener("click", () => {
        panelGantiPassword.hidden = !panelGantiPassword.hidden;
    });
}

if (batalGantiPasswordBtn && panelGantiPassword) {
    batalGantiPasswordBtn.addEventListener("click", () => {
        panelGantiPassword.hidden = true;
        document.getElementById("inputPasswordLama").value = "";
        document.getElementById("inputPasswordBaru").value = "";
        document.getElementById("inputPasswordBaruUlang").value = "";
        statusGantiPassword.textContent = "";
        statusGantiPassword.className = "settings-status-simpan";
    });
}

if (simpanPasswordBaruBtn) {
    simpanPasswordBaruBtn.addEventListener("click", async () => {
        const passwordLama = document.getElementById("inputPasswordLama").value;
        const passwordBaru = document.getElementById("inputPasswordBaru").value;
        const passwordBaruUlang = document.getElementById("inputPasswordBaruUlang").value;

        if (!passwordLama || !passwordBaru || !passwordBaruUlang) {
            statusGantiPassword.textContent = "Semua kolom wajib diisi.";
            statusGantiPassword.className = "settings-status-simpan gagal";
            return;
        }

        if (passwordBaru !== passwordBaruUlang) {
            statusGantiPassword.textContent = "Kata sandi baru tidak sama.";
            statusGantiPassword.className = "settings-status-simpan gagal";
            return;
        }

        simpanPasswordBaruBtn.disabled = true;

        try {
            const response = await fetch("/ganti-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passwordLama, passwordBaru, passwordBaruUlang })
            });

            const data = await response.json();

            if (!data.berhasil) {
                statusGantiPassword.textContent = data.pesan || "Gagal mengganti kata sandi.";
                statusGantiPassword.className = "settings-status-simpan gagal";
                return;
            }

            statusGantiPassword.textContent = "Kata sandi berhasil diganti.";
            statusGantiPassword.className = "settings-status-simpan sukses";

            document.getElementById("inputPasswordLama").value = "";
            document.getElementById("inputPasswordBaru").value = "";
            document.getElementById("inputPasswordBaruUlang").value = "";

        } catch (error) {
            console.error("Gagal mengganti kata sandi:", error);
            statusGantiPassword.textContent = "Tidak bisa menghubungi server.";
            statusGantiPassword.className = "settings-status-simpan gagal";

        } finally {
            simpanPasswordBaruBtn.disabled = false;
        }
    });
}


// ========================================
// LOGOUT
// ========================================

const logoutSettingsBtn = document.getElementById("logoutSettings");

if (logoutSettingsBtn) {
    logoutSettingsBtn.addEventListener("click", async () => {
        logoutSettingsBtn.disabled = true;

        try {
            await fetch("/logout", { method: "POST" });
        } catch (error) {
            console.error("Gagal logout:", error);
        }

        window.location.href = "/login.html";
    });
}


// ========================================
// NOTIFIKASI (tersimpan di perangkat ini saja)
// ========================================

const KUNCI_NOTIF_PESAN = "cht_notif_pesan";
const KUNCI_NOTIF_SUARA = "cht_notif_suara";
const KUNCI_JANGAN_GANGGU = "cht_jangan_ganggu";

const toggleNotifPesan = document.getElementById("toggleNotifPesan");
const toggleSuaraNotif = document.getElementById("toggleSuaraNotif");
const toggleJanganGanggu = document.getElementById("toggleJanganGanggu");

function muatPreferensiNotifikasi() {
    if (toggleNotifPesan) {
        toggleNotifPesan.checked = localStorage.getItem(KUNCI_NOTIF_PESAN) !== "0";
    }

    if (toggleSuaraNotif) {
        toggleSuaraNotif.checked = localStorage.getItem(KUNCI_NOTIF_SUARA) !== "0";
    }

    if (toggleJanganGanggu) {
        toggleJanganGanggu.checked = localStorage.getItem(KUNCI_JANGAN_GANGGU) === "1";
    }
}

muatPreferensiNotifikasi();

if (toggleNotifPesan) {
    toggleNotifPesan.addEventListener("change", () => {
        localStorage.setItem(KUNCI_NOTIF_PESAN, toggleNotifPesan.checked ? "1" : "0");

        if (
            toggleNotifPesan.checked &&
            "Notification" in window &&
            Notification.permission === "default"
        ) {
            Notification.requestPermission();
        }
    });
}

if (toggleSuaraNotif) {
    toggleSuaraNotif.addEventListener("change", () => {
        localStorage.setItem(KUNCI_NOTIF_SUARA, toggleSuaraNotif.checked ? "1" : "0");
    });
}

if (toggleJanganGanggu) {
    toggleJanganGanggu.addEventListener("change", () => {
        localStorage.setItem(KUNCI_JANGAN_GANGGU, toggleJanganGanggu.checked ? "1" : "0");
    });
}

function bunyikanNotifikasi() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = 760;

        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.26);

    } catch (error) {
        // abaikan kalau Web Audio tidak tersedia di browser ini
    }
}

let totalUnreadSebelumnya = null;

function tanganiNotifikasiPesanBaru(totalUnreadBaru, chatTerbaru) {
    if (totalUnreadSebelumnya === null) {
        totalUnreadSebelumnya = totalUnreadBaru;
        return;
    }

    if (totalUnreadBaru <= totalUnreadSebelumnya) {
        totalUnreadSebelumnya = totalUnreadBaru;
        return;
    }

    totalUnreadSebelumnya = totalUnreadBaru;

    const janganGanggu = localStorage.getItem(KUNCI_JANGAN_GANGGU) === "1";
    if (janganGanggu) return;

    const pakaiSuara = localStorage.getItem(KUNCI_NOTIF_SUARA) !== "0";
    const pakaiNotifPesan = localStorage.getItem(KUNCI_NOTIF_PESAN) !== "0";

    if (pakaiSuara) {
        bunyikanNotifikasi();
    }

    if (
        pakaiNotifPesan &&
        document.visibilityState === "hidden" &&
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        const chatPengirim = chatTerbaru.find(c => Number(c.belum_dibaca) > 0);

        new Notification("Pesan baru di CHUT", {
            body: chatPengirim
                ? `${chatPengirim.nama}: ${chatPengirim.tipe === "stiker" ? "Stiker" : chatPengirim.isi}`
                : "Kamu punya pesan baru"
        });
    }
}


// ========================================
// PRIVASI: SEMBUNYIKAN STATUS ONLINE
// ========================================

const KUNCI_SEMBUNYI_ONLINE = "cht_sembunyi_online";

const toggleStatusOnline = document.getElementById("toggleStatusOnline");
const hintStatusOnline = document.getElementById("hintStatusOnline");

function statusOnlineDisembunyikan() {
    return localStorage.getItem(KUNCI_SEMBUNYI_ONLINE) === "1";
}

function kirimStatusOnlineJikaDiizinkan() {
    setStatus(statusOnlineDisembunyikan() ? "offline" : "online");
}

function muatPreferensiPrivasi() {
    if (!toggleStatusOnline) return;

    const disembunyikan = statusOnlineDisembunyikan();
    toggleStatusOnline.checked = !disembunyikan;

    if (hintStatusOnline) {
        hintStatusOnline.textContent = disembunyikan
            ? "Status online kamu sedang disembunyikan dari teman."
            : "Teman kamu bisa lihat kalau kamu lagi online.";
    }
}

muatPreferensiPrivasi();

if (toggleStatusOnline) {
    toggleStatusOnline.addEventListener("change", () => {
        localStorage.setItem(
            KUNCI_SEMBUNYI_ONLINE,
            toggleStatusOnline.checked ? "0" : "1"
        );

        muatPreferensiPrivasi();
        kirimStatusOnlineJikaDiizinkan();
    });
}


// ========================================
// HALAMAN PROFIL
// ========================================

const profilAvatar = document.getElementById("profilAvatar");
const profilNama = document.getElementById("profilNama");
const profilUsername = document.getElementById("profilUsername");
const profilStatusBadge = document.getElementById("profilStatusBadge");
const profilEmail = document.getElementById("profilEmail");
const profilIdBaris = document.getElementById("profilIdBaris");
const profilJumlahTeman = document.getElementById("profilJumlahTeman");
const profilAvatarStack = document.getElementById("profilAvatarStack");
const profilPesanStatus = document.getElementById("profilPesanStatus");
const simpanStatusBtn = document.getElementById("simpanStatus");
const profilKeKontakBtn = document.getElementById("profilKeKontak");
const profilKeSettingsBtn = document.getElementById("profilKeSettings");

function kunciStatusProfil() {
    return `cht_status_${currentUserId}`;
}

function renderProfilePage() {
    if (!dataAkunSaatIni) return;

    if (profilAvatar) {
        profilAvatar.replaceChildren(buatAvatar(dataAkunSaatIni.nama));
    }

    if (profilNama) profilNama.textContent = dataAkunSaatIni.nama || "";

    if (profilUsername) {
        profilUsername.textContent = dataAkunSaatIni.id_pengguna
            ? `@${dataAkunSaatIni.id_pengguna}`
            : "";
    }

    if (profilStatusBadge) {
        const disembunyikan = statusOnlineDisembunyikan();

        profilStatusBadge.classList.toggle("offline", disembunyikan);
        profilStatusBadge.lastChild.textContent =
            " " + (disembunyikan ? "Offline" : "Online");
    }

    if (profilEmail) profilEmail.textContent = dataAkunSaatIni.email || "-";

    if (profilIdBaris) {
        profilIdBaris.textContent = dataAkunSaatIni.id_pengguna
            ? `@${dataAkunSaatIni.id_pengguna}`
            : "-";
    }

    if (profilJumlahTeman) {
        profilJumlahTeman.textContent = daftarTeman.length;
    }

    if (profilAvatarStack) {
        profilAvatarStack.replaceChildren(
            ...daftarTeman.slice(0, 6).map(t =>
                buatAvatar(t.nama, t.status === "online", true)
            )
        );
    }

    if (profilPesanStatus && currentUserId) {
        profilPesanStatus.value = localStorage.getItem(kunciStatusProfil()) || "";
    }
}

if (simpanStatusBtn && profilPesanStatus) {
    simpanStatusBtn.addEventListener("click", () => {
        if (!currentUserId) return;

        localStorage.setItem(kunciStatusProfil(), profilPesanStatus.value.trim());

        simpanStatusBtn.textContent = "Tersimpan!";

        setTimeout(() => {
            simpanStatusBtn.textContent = "Simpan";
        }, 1200);
    });
}

if (profilKeKontakBtn) {
    profilKeKontakBtn.addEventListener("click", () => {
        bukaPage(contactPage);
        aktifkanMenu(kontak);
    });
}

if (profilKeSettingsBtn) {
    profilKeSettingsBtn.addEventListener("click", () => {
        bukaPage(settingsPage);
        aktifkanMenu(settingMenu);
        isiFormAkunDariData();
    });
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

        dataAkunSaatIni = user;
        isiFormAkunDariData();
        renderProfilePage();

        const sapaanEl = document.querySelector(".sapaan");
        if (sapaanEl) {
            sapaanEl.textContent = `Halo, ${String(user.nama).split(" ")[0]}!`;
        }

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


kirimStatusOnlineJikaDiizinkan();

heartbeat = setInterval(() => {
    // hanya perbarui status kalau tab ini sedang aktif dilihat,
    // supaya status "offline" saat pindah tab tidak langsung tertimpa lagi
    if (document.visibilityState === "visible") {
        kirimStatusOnlineJikaDiizinkan();
    }
}, 30000);

window.addEventListener("pagehide", () => {
    clearInterval(heartbeat);
    setOfflineBeacon();
});


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        setOfflineBeacon();
    } else {
        kirimStatusOnlineJikaDiizinkan();
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

        // Isi juga kotak masuk di halaman chat
        daftarChat = data.chat;
        renderInbox();

        listRecent.replaceChildren();

        // Jumlahkan semua pesan belum dibaca dari semua teman
        const totalUnread = data.chat.reduce(
            (jumlah, chat) => jumlah + Number(chat.belum_dibaca),
            0
        );

        tagUnread.textContent =
            `${totalUnread} unread message${totalUnread === 1 ? "" : "s"}`;

        tanganiNotifikasiPesanBaru(totalUnread, data.chat);

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
