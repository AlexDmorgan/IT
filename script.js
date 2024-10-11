let selectedRoom = null;
let selectedDate = new Date().toISOString().split('T')[0]; // Set tanggal saat ini

// Fungsi untuk membuka form
function openForm(roomName, element) {
    // Pastikan ruangan tidak unavailable
    if (element.style.backgroundColor !== "red") {
        selectedRoom = element; // Simpan elemen ruangan yang dipilih
        document.getElementById("formPopup").style.display = "block";
    }
}

// Fungsi untuk menutup form
function closeForm() {
    document.getElementById("formPopup").style.display = "none";
    clearForm(); // Clear form ketika ditutup
}

// Fungsi untuk membersihkan form
function clearForm() {
    document.getElementById("nama").value = '';
    document.getElementById("ekskul").value = 'Tomodachi'; // Set default value
    document.getElementById("alasan").value = '';
    document.getElementById("jamMulai").value = '';
    document.getElementById("jamSelesai").value = '';
}

// Fungsi untuk mengubah status ruangan
function updateRoomStatus() {
    const status = JSON.parse(localStorage.getItem(`status_${selectedDate}`)) || {};
    const roomElements = document.querySelectorAll('.ruang');

    roomElements.forEach((room, index) => {
        if (status[`ruang_${index}`]) {
            room.style.backgroundColor = "red"; // Ruangan tidak tersedia
            room.onclick = null; // Nonaktifkan klik pada ruangan yang dipinjam
        }
    });
}

// Fungsi untuk menyimpan status ruangan
function saveRoomStatus() {
    const status = {};
    const roomElements = document.querySelectorAll('.ruang');

    roomElements.forEach((room, index) => {
        status[`ruang_${index}`] = room.style.backgroundColor === "red";
    });

    localStorage.setItem(`status_${selectedDate}`, JSON.stringify(status));
}

// Fungsi untuk mengubah tanggal dan memperbarui tampilan
function changeDate() {
    selectedDate = document.getElementById("tanggal").value;
    updateRoomStatus(); // Update status saat tanggal berubah
}

// Fungsi untuk mengirim form
function submitForm() {
    // Ambil data dari form
    const nama = document.getElementById("nama").value;
    const ekskul = document.getElementById("ekskul").value;
    const alasan = document.getElementById("alasan").value;
    const jamMulai = document.getElementById("jamMulai").value;
    const jamSelesai = document.getElementById("jamSelesai").value;

    // Tampilkan daftar peminjaman
    const daftarPinjaman = document.getElementById("daftarPinjaman");
    daftarPinjaman.innerHTML += `<p>${nama} meminjam ${selectedRoom.innerText} untuk ${ekskul} pada ${jamMulai} hingga ${jamSelesai}.</p>`;

    // Ubah warna ruangan menjadi merah (tidak tersedia)
    selectedRoom.style.backgroundColor = "red";
    selectedRoom.onclick = null; // Nonaktifkan klik pada ruangan yang dipinjam

    saveRoomStatus(); // Simpan status ruangan ke localStorage
    closeForm(); // Tutup form setelah peminjaman
}

    // Load status saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("tanggal").value = selectedDate; // Set tanggal saat ini
    updateRoomStatus(); // Muat status awal berdasarkan tanggal
})

document.getElementById('clearStorageBtn').addEventListener('click', function() {
    localStorage.clear(); // Menghapus semua data di localStorage
    alert('Local storage telah dihapus!');
});


