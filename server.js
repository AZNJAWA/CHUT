
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require("@libsql/client");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(cookieParser());

app.use(cors());

app.use(express.json());


// ========================================
// STATIC FRONTEND
// ========================================

app.use(
    express.static(
        path.join(__dirname, "frontend"),
        {
            index: false
        }
    )
);


// ========================================
// AUTH MIDDLEWARE
// ========================================

function cekLogin(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/Login.html");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.redirect("/Login.html");
    }
}


// ========================================
// HOME
// ========================================

app.get("/", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login.html");
        }

        jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        return res.redirect("/chat.html");

    } catch (error) {
        return res.redirect("/login.html");
    }
});


// ========================================
// CHAT PAGE
// ========================================

app.get("/chat.html", cekLogin, (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "frontend",
            "chat.html"
        )
    );
});


// ========================================
// KONEKSI TURSO
// ========================================

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});


// ========================================
// LOGIN
// ========================================

app.post("/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // -----------------------------
        // Cek input
        // -----------------------------

        if (!email || !password) {
            return res.status(400).json({
                berhasil: false,
                pesan: "Email dan password wajib diisi"
            });
        }


        // -----------------------------
        // Cari user
        // -----------------------------

        const hasil = await db.execute({
            sql: `
                SELECT *
                FROM pengguna
                WHERE email = ?
            `,
            args: [email]
        });


        // -----------------------------
        // User tidak ditemukan
        // -----------------------------

        if (hasil.rows.length === 0) {
            return res.status(401).json({
                berhasil: false,
                pesan: "Email atau password salah"
            });
        }


        const user = hasil.rows[0];


        // -----------------------------
        // Cek password
        // -----------------------------

        const passwordBenar =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordBenar) {
            return res.status(401).json({
                berhasil: false,
                pesan: "Email atau password salah"
            });
        }


        // -----------------------------
        // Buat JWT
        // -----------------------------

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        // -----------------------------
        // Cookie
        // -----------------------------

        res.cookie(
            "token",
            token,
            {
                httpOnly: true,

                // Lokal HTTP = false
                // Vercel HTTPS = true
                secure:
                    process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge:
                    24 * 60 * 60 * 1000
            }
        );


        // -----------------------------
        // Response
        // -----------------------------

        res.json({
            berhasil: true,
            pesan: "Login berhasil",

            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                id_pengguna: user.id_pengguna
            }
        });

    } catch (error) {

        console.error(
            "Error login:",
            error
        );

        res.status(500).json({
            berhasil: false,
            pesan: "Terjadi kesalahan pada server"
        });
    }
});


// ========================================
// REGISTER
// ========================================

app.post("/register", async (req, res) => {
    try {

        const {
            nama,
            email,
            password
        } = req.body;


        console.log(
            "Data register:",
            req.body
        );


        // -----------------------------
        // Cek input
        // -----------------------------

        if (
            !nama ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                berhasil: false,
                pesan: "Semua data wajib diisi"
            });
        }


        // -----------------------------
        // Cek email
        // -----------------------------

        const cekUser =
            await db.execute({
                sql: `
                    SELECT id
                    FROM pengguna
                    WHERE email = ?
                `,
                args: [email]
            });


        if (cekUser.rows.length > 0) {
            return res.status(409).json({
                berhasil: false,
                pesan: "Email sudah terdaftar"
            });
        }


        // -----------------------------
        // Hash password
        // -----------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );


        // -----------------------------
        // Insert user
        // -----------------------------

        await db.execute({
            sql: `
                INSERT INTO pengguna
                (
                    nama,
                    email,
                    password
                )
                VALUES (?, ?, ?)
            `,
            args: [
                nama,
                email,
                passwordHash
            ]
        });


        res.json({
            berhasil: true,
            pesan: "Akun berhasil dibuat"
        });

    } catch (error) {

        console.error(
            "Error register:",
            error
        );

        res.status(500).json({
            berhasil: false,
            pesan: "Gagal membuat akun"
        });
    }
});


// ========================================
// ME
// ========================================

app.get("/me", async (req, res) => {
    try {

        const token =
            req.cookies.token;


        if (!token) {
            return res.status(401).json({
                berhasil: false,
                pesan: "Belum login"
            });
        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        const hasil =
            await db.execute({
                sql: `
                    SELECT
                        id,
                        nama,
                        email,
                        id_pengguna
                    FROM pengguna
                    WHERE id = ?
                `,
                args: [decoded.id]
            });


        if (hasil.rows.length === 0) {
            return res.status(404).json({
                berhasil: false,
                pesan: "User tidak ditemukan"
            });
        }


        res.json({
            berhasil: true,
            user: hasil.rows[0]
        });

    } catch (error) {

        return res.status(401).json({
            berhasil: false,
            pesan:
                "Token tidak valid atau sudah expired"
        });
    }
});


// ========================================
// CARI TEMAN
// ========================================

app.get(
    "/cari-teman",
    cekLogin,
    async (req, res) => {

        try {

            const q =
                req.query.q;


            if (!q) {
                return res.json({
                    berhasil: false,
                    pesan: "Pencarian kosong"
                });
            }


            const hasil =
                await db.execute({
                    sql: `
                        SELECT
                            id,
                            nama,
                            id_pengguna
                        FROM pengguna
                        WHERE
                            nama LIKE ?
                            OR id_pengguna LIKE ?
                        LIMIT 10
                    `,
                    args: [
                        `%${q}%`,
                        `%${q}%`
                    ]
                });


            const hasilFilter =
                hasil.rows.filter(
                    user =>
                        Number(user.id) !==
                        Number(req.userId)
                );


            res.json({
                berhasil: true,
                pengguna: hasilFilter
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal mencari pengguna"
            });
        }
    }
);


// ========================================
// TAMBAH TEMAN
// ========================================

app.post(
    "/teman",
    cekLogin,
    async (req, res) => {

        try {

            const {
                id_teman
            } = req.body;


            if (!id_teman) {
                return res.status(400).json({
                    berhasil: false,
                    pesan:
                        "ID teman tidak ada"
                });
            }


            // Tidak boleh tambah diri sendiri

            if (
                Number(id_teman) ===
                Number(req.userId)
            ) {
                return res.status(400).json({
                    berhasil: false,
                    pesan:
                        "Tidak bisa menambahkan diri sendiri"
                });
            }


            // Cek user

            const cekUser =
                await db.execute({
                    sql: `
                        SELECT id
                        FROM pengguna
                        WHERE id = ?
                    `,
                    args: [id_teman]
                });


            if (
                cekUser.rows.length === 0
            ) {
                return res.status(404).json({
                    berhasil: false,
                    pesan:
                        "Pengguna tidak ditemukan"
                });
            }


            // Buat relasi dua arah

            await db.execute({
                sql: `
                    INSERT OR IGNORE INTO teman
                    (
                        id_pengguna,
                        id_teman
                    )
                    VALUES
                        (?, ?),
                        (?, ?)
                `,
                args: [
                    req.userId,
                    id_teman,

                    id_teman,
                    req.userId
                ]
            });


            res.json({
                berhasil: true,
                pesan:
                    "Teman berhasil ditambahkan"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal menambahkan teman"
            });
        }
    }
);


// ========================================
// DAFTAR TEMAN
// ========================================

app.get(
    "/teman",
    cekLogin,
    async (req, res) => {

        try {

            const hasil =
                await db.execute({
                    sql: `
                        SELECT
                            p.id,
                            p.nama,
                            p.id_pengguna
                        FROM teman t

                        JOIN pengguna p
                            ON p.id = t.id_teman

                        WHERE
                            t.id_pengguna = ?

                        ORDER BY
                            p.nama ASC
                    `,
                    args: [req.userId]
                });


            res.json({
                berhasil: true,
                teman: hasil.rows
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal mengambil daftar teman"
            });
        }
    }
);


// ========================================
// AMBIL PESAN
// ========================================

app.get(
    "/pesan/:id_teman",
    cekLogin,
    async (req, res) => {

        try {

            const idTeman =
                req.params.id_teman;

            const before =
                req.query.before;


            let sql = `
                SELECT
                    p.id,
                    p.id_pengirim,
                    p.isi,
                    p.tanggal_waktu,
                    p.id_penerima,
                    p.id_pesan_reply,

                    r.isi
                        AS isi_pesan_reply

                FROM pesan p

                LEFT JOIN pesan r
                    ON r.id =
                       p.id_pesan_reply

                WHERE
                    (
                        (
                            p.id_pengirim = ?
                            AND
                            p.id_penerima = ?
                        )

                        OR

                        (
                            p.id_pengirim = ?
                            AND
                            p.id_penerima = ?
                        )
                    )
            `;


            const args = [
                req.userId,
                idTeman,

                idTeman,
                req.userId
            ];


            // -----------------------------
            // Pagination
            // -----------------------------

            if (before) {

                sql += `
                    AND p.id < ?
                `;

                args.push(before);
            }


            sql += `
                ORDER BY
                    p.id DESC

                LIMIT 20
            `;


            const hasil =
                await db.execute({
                    sql,
                    args
                });


            const pesan =
                hasil.rows.reverse();


            res.json({
                berhasil: true,

                pesan: pesan,

                adaLagi:
                    hasil.rows.length === 20
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal mengambil pesan"
            });
        }
    }
);


// ========================================
// EDIT PESAN
// ========================================

app.patch(
    "/pesan/:id",
    cekLogin,
    async (req, res) => {

        try {

            const idPesan =
                req.params.id;

            const {
                isi
            } = req.body;


            if (
                !isi ||
                !isi.trim()
            ) {
                return res.status(400).json({
                    berhasil: false,
                    pesan:
                        "Pesan tidak boleh kosong"
                });
            }


            // Pastikan pesan milik user

            const cekPesan =
                await db.execute({
                    sql: `
                        SELECT id
                        FROM pesan
                        WHERE
                            id = ?
                            AND
                            id_pengirim = ?
                    `,
                    args: [
                        idPesan,
                        req.userId
                    ]
                });


            if (
                cekPesan.rows.length === 0
            ) {
                return res.status(404).json({
                    berhasil: false,
                    pesan:
                        "Pesan tidak ditemukan"
                });
            }


            // Update

            await db.execute({
                sql: `
                    UPDATE pesan
                    SET isi = ?

                    WHERE
                        id = ?
                        AND
                        id_pengirim = ?
                `,
                args: [
                    isi.trim(),
                    idPesan,
                    req.userId
                ]
            });


            res.json({
                berhasil: true,
                pesan:
                    "Pesan berhasil diedit"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal mengedit pesan"
            });
        }
    }
);


// ========================================
// HAPUS PESAN
// ========================================

app.delete(
    "/pesan/:id",
    cekLogin,
    async (req, res) => {

        try {

            const idPesan =
                req.params.id;


            // Pastikan pesan milik user

            const cekPesan =
                await db.execute({
                    sql: `
                        SELECT id
                        FROM pesan
                        WHERE
                            id = ?
                            AND
                            id_pengirim = ?
                    `,
                    args: [
                        idPesan,
                        req.userId
                    ]
                });


            if (
                cekPesan.rows.length === 0
            ) {
                return res.status(404).json({
                    berhasil: false,
                    pesan:
                        "Pesan tidak ditemukan"
                });
            }


            // Delete

            await db.execute({
                sql: `
                    DELETE FROM pesan

                    WHERE
                        id = ?
                        AND
                        id_pengirim = ?
                `,
                args: [
                    idPesan,
                    req.userId
                ]
            });


            res.json({
                berhasil: true,
                pesan:
                    "Pesan berhasil dihapus"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal menghapus pesan"
            });
        }
    }
);


// ========================================
// KIRIM PESAN
// ========================================

app.post(
    "/pesan",
    cekLogin,
    async (req, res) => {

        try {

            const {
                id_penerima,
                isi,
                id_pesan_reply
            } = req.body;


            console.log(
                "BODY PESAN:",
                req.body
            );

            console.log(
                "ID REPLY:",
                id_pesan_reply
            );


            // -----------------------------
            // Validasi
            // -----------------------------

            if (
                !id_penerima ||
                !isi ||
                !isi.trim()
            ) {
                return res.status(400).json({
                    berhasil: false,
                    pesan:
                        "Pesan tidak boleh kosong"
                });
            }


            // Tidak boleh kirim ke diri sendiri

            if (
                Number(id_penerima) ===
                Number(req.userId)
            ) {
                return res.status(400).json({
                    berhasil: false,
                    pesan:
                        "Tidak bisa mengirim pesan ke diri sendiri"
                });
            }


            // -----------------------------
            // Validasi reply
            // -----------------------------

            if (id_pesan_reply) {

                const cekReply =
                    await db.execute({
                        sql: `
                            SELECT id
                            FROM pesan
                            WHERE id = ?
                        `,
                        args: [
                            id_pesan_reply
                        ]
                    });


                if (
                    cekReply.rows.length === 0
                ) {
                    return res.status(404).json({
                        berhasil: false,
                        pesan:
                            "Pesan yang direply tidak ditemukan"
                    });
                }
            }


            // -----------------------------
            // Insert pesan
            // -----------------------------

            await db.execute({
                sql: `
                    INSERT INTO pesan
                    (
                        id_pengirim,
                        isi,
                        tanggal_waktu,
                        id_penerima,
                        id_pesan_reply
                    )

                    VALUES
                    (?, ?, ?, ?, ?)
                `,
                args: [
                    req.userId,

                    isi.trim(),

                    new Date().toISOString(),

                    id_penerima,

                    id_pesan_reply || null
                ]
            });


            res.json({
                berhasil: true,
                pesan:
                    "Pesan berhasil dikirim"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                berhasil: false,
                pesan:
                    "Gagal mengirim pesan"
            });
        }
    }
);


// ========================================
// 404
// ========================================




// ========================================
// LOCAL SERVER / VERCEL
// ========================================

if (require.main === module) {

    app.listen(
        PORT,
        () => {

            console.log(
                `Server CHUT berjalan di http://localhost:${PORT}`
            );

        }
    );
}


// ========================================
// EXPORT UNTUK VERCEL
// ========================================

module.exports = app;

