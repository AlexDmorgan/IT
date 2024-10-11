let selectedRoom = null;
let selectedDate = new Date().toISOString().split('T')[0]; // Set tanggal saat ini (format YYYY-MM-DD)

// Fungsi untuk membuka form
function openForm(roomName, element) {
    if (element.style.backgroundColor !== "red") {
        selectedRoom = element;
        document.getElementById("formPopup").style.display = "block";
    }
}

// Fungsi untuk menutup form
function closeForm() {
    document.getElementById("formPopup").style.display = "none";
    clearForm();
}

// Fungsi untuk membersihkan form
function clearForm() {
    document.getElementById("nama").value = '';
    document.getElementById("ekskul").value = 'Tomodachi';
    document.getElementById("alasan").value = '';
    document.getElementById("jamMulai").value = '';
    document.getElementById("jamSelesai").value = '';
}

// Fungsi untuk menyimpan status ruangan ke localStorage berdasarkan tanggal
function saveRoomStatus() {
    const status = JSON.parse(localStorage.getItem(`status_${selectedDate}`)) || {};
    const roomElements = document.querySelectorAll('.ruang, .ruangs');

    roomElements.forEach((room, index) => {
        if (room.style.backgroundColor === "red") {
            status[`ruang_${index}`] = true;
        }
    });

    localStorage.setItem(`status_${selectedDate}`, JSON.stringify(status));
}

// Fungsi untuk memperbarui tampilan ruangan berdasarkan status yang tersimpan di localStorage
function updateRoomStatus() {
    const status = JSON.parse(localStorage.getItem(`status_${selectedDate}`)) || {};
    const roomElements = document.querySelectorAll('.ruang, .ruangs');

    roomElements.forEach((room, index) => {
        if (status[`ruang_${index}`]) {
            room.style.backgroundColor = "red";
            room.onclick = null; // Nonaktifkan klik untuk ruangan yang tidak tersedia
        } else {
            room.style.backgroundColor = "";
            room.onclick = () => openForm(`Ruang ${index + 1}`, room); // Aktifkan klik untuk ruangan yang tersedia
        }
    });
}

// Fungsi untuk mengubah tanggal
function changeDate() {
    selectedDate = document.getElementById("tanggal").value;
    updateRoomStatus(); // Update tampilan ruangan sesuai status pada tanggal yang baru
}

// Fungsi untuk mengirim form
function submitForm() {
    const nama = document.getElementById("nama").value;
    const ekskul = document.getElementById("ekskul").value;
    const alasan = document.getElementById("alasan").value;
    const jamMulai = document.getElementById("jamMulai").value;
    const jamSelesai = document.getElementById("jamSelesai").value;

    // Cek jika semua data telah diisi
    if (nama && ekskul && alasan && jamMulai && jamSelesai) {
        // Kirim data ke Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbyumNPqEtHa9dRJpgSEOCq515vo9GcUOaZ4rs7uKTfOtV-8tNmbxp0EH6PxGQ0ploQ77Q/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                nama,
                ekskul,
                alasan,
                jamMulai,
                jamSelesai
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Untuk debugging
            
            // Tampilkan daftar peminjaman
            const daftarPinjaman = document.getElementById("daftarPinjaman");
            daftarPinjaman.innerHTML += `<p>${nama} meminjam ${selectedRoom.innerText} untuk ${ekskul} pada ${jamMulai} hingga ${jamSelesai}.</p>`;
            
            // Ubah warna ruangan menjadi merah (tidak tersedia)
            selectedRoom.style.backgroundColor = "red";
            selectedRoom.onclick = null; // Nonaktifkan klik untuk ruangan yang dipinjam

            saveRoomStatus(); // Simpan status setelah form dikirim
            closeForm(); // Tutup form setelah peminjaman
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Mohon lengkapi semua data peminjaman.");
    }
}


// Load status ruangan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("tanggal").value = selectedDate;
    updateRoomStatus();
});


