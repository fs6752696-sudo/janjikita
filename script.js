/* =================================
   JANJIKITA - MENU DAN KERANJANG
/* KONEKSI DATABASE JANJIKITA */

const SUPABASE_URL = "https://xlshrugutariigcwzqkd.supabase.co";
const SUPABASE_KEY = "sb_publishable_Aw4XwcV4DcSlVY3Ji8EdvQ_ic7RKkpd";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
const menu = [
    {
        id: 1,
        nama: "Coffee Ambatukam",
        harga: 8000,
        deskripsi: "Kopi klasik untuk menemani harimu."
    },
    {
        id: 2,
        nama: "Coffee Butterscotch",
        harga: 12000,
        deskripsi: "Kopi dengan sentuhan manis butterscotch."
    },
    {
        id: 3,
        nama: "Kopi Hazelnut ",
        harga: 12000,
        deskripsi: "Kopi dengan sentuhan manis butterscotch."
    },
    {
        id: 4,
        nama: "Kopi Susu Gula Aren",
        harga: 13000,
        deskripsi: "Perpaduan kopi, susu, dan gula aren."
    },
    {
        id: 4,
        nama: "Coffee JanjiKita",
        harga: 10000,
        deskripsi: "Perpaduan kopi, susu, dan gula aren."
    },
    {
        id: 5,
        nama: "Risol Mayo",
        harga: 4000,
        deskripsi: "Risol gurih dengan isian mayo."
    },
    {
        id: 6,
        nama: "Risol Bolognese",
        harga: 4000,
        deskripsi: "Risol dengan isian saus bolognese."
    },
    {
        id: 7,
        nama: "Risol Cokelat",
        harga: 4000,
        deskripsi: "Risol dengan isian cokelat."
    },
    {
        id: 8,
        nama: "Risol Mentai",
        harga: 4000,
        deskripsi: "Risol dengan saus mentai."
    },
    {
        id: 9,
        nama: "Mix 3",
        harga: 10000,
        deskripsi: "Camilan gurih yang cocok untuk santai."
    }
];

let keranjang = [];

const daftarMenu = document.getElementById("daftar-menu");
const isiKeranjang = document.getElementById("isi-keranjang");
const totalHarga = document.getElementById("total-harga");
const formPesanan = document.getElementById("form-pesanan");
const pesanStatus = document.getElementById("pesan-status");

function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

/* MENAMPILKAN MENU */

function tampilkanMenu() {
    daftarMenu.innerHTML = menu.map(item => `
        <article class="menu-card">

            <div class="menu-photo">
                ${item.nama}
            </div>

            <div class="menu-info">
                <h3>${item.nama}</h3>

                <p>${item.deskripsi}</p>

                <div class="menu-bottom">
                    <span class="menu-price">
                        ${rupiah(item.harga)}
                    </span>

                    <button
                        type="button"
                        class="add-btn"
                        onclick="tambahKeranjang(${item.id})"
                    >
                        + Tambah
                    </button>
                </div>
            </div>

        </article>
    `).join("");
}

/* MENAMBAHKAN MENU KE KERANJANG */

function tambahKeranjang(id) {
    const produk = menu.find(item => item.id === id);

    if (!produk) return;

    const ada = keranjang.find(item => item.id === id);

    if (ada) {
        ada.jumlah++;
    } else {
        keranjang.push({
            id: produk.id,
            nama: produk.nama,
            harga: produk.harga,
            jumlah: 1
        });
    }

    pesanStatus.textContent = "";
    pesanStatus.classList.remove("error");

    tampilkanKeranjang();
}

/* MENGUBAH JUMLAH PRODUK */

function ubahJumlah(id, perubahan) {
    const produk = keranjang.find(item => item.id === id);

    if (!produk) return;

    produk.jumlah += perubahan;

    if (produk.jumlah <= 0) {
        keranjang = keranjang.filter(
            item => item.id !== id
        );
    }

    tampilkanKeranjang();
}

/* MENGHITUNG TOTAL */

function hitungTotal() {
    return keranjang.reduce(
        (total, item) => total + item.harga * item.jumlah,
        0
    );
}

/* MENAMPILKAN KERANJANG */

function tampilkanKeranjang() {
    if (keranjang.length === 0) {
        isiKeranjang.innerHTML = `
            <p class="empty-cart">
                Keranjang kamu masih kosong.
            </p>
        `;
    } else {
        isiKeranjang.innerHTML = keranjang.map(item => `
            <div class="cart-item">

                <div>
                    <div class="cart-item-name">
                        ${item.nama}
                    </div>

                    <div class="cart-item-price">
                        ${rupiah(item.harga * item.jumlah)}
                    </div>
                </div>

                <div class="quantity-control">
                    <button
                        type="button"
                        onclick="ubahJumlah(${item.id}, -1)"
                        aria-label="Kurangi jumlah"
                    >−</button>

                    <span>${item.jumlah}</span>

                    <button
                        type="button"
                        onclick="ubahJumlah(${item.id}, 1)"
                        aria-label="Tambah jumlah"
                    >+</button>
                </div>

            </div>
        `).join("");
    }

    totalHarga.textContent = rupiah(hitungTotal());
}

/* FORM PESANAN DAN PENYIMPANAN ONLINE */

formPesanan.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (keranjang.length === 0) {
        pesanStatus.textContent = "Keranjang masih kosong.";
        pesanStatus.classList.add("error");
        return;
    }

    const nama = document
        .getElementById("nama-pelanggan")
        .value.trim();

    const telepon = document
        .getElementById("telepon-pelanggan")
        .value.trim();

    if (!nama || !telepon) {
        pesanStatus.textContent = "Lengkapi data pelanggan.";
        pesanStatus.classList.add("error");
        return;
    }

    const pesanan = {
        customer_name: nama,
        customer_phone: telepon,
        items: keranjang.map(item => ({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: item.jumlah
        })),
        total_items: keranjang.reduce(
            (jumlah, item) => jumlah + item.jumlah, 0
        ),
        total_amount: hitungTotal(),
        status: "Baru"
    };

    pesanStatus.classList.remove("error");
    pesanStatus.textContent = "Menyimpan pesanan...";

    const { error } = await supabaseClient
        .from("orders")
        .insert([pesanan]);

   if (error) {
    console.error("ERROR SUPABASE:", error);

    pesanStatus.textContent =
        "Gagal menyimpan: " + error.message;

    pesanStatus.classList.add("error");
    return;
}

    pesanStatus.textContent =
        "Pesanan berhasil disimpan! Terima kasih sudah memesan.";

    keranjang = [];
    tampilkanKeranjang();
    formPesanan.reset();
});


tampilkanMenu();
tampilkanKeranjang();