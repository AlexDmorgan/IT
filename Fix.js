let selectedRoom = null;
let selectedDate = new Date().toISOString().split('T')[0]; // Set tanggal saat ini (format YYYY-MM-DD)

const ekskulLogos = {
    'Six-IT': 'logo/sixit.png',
    'Tomodachi': 'logo/tomodachi.png',
    'E-com': 'logo/ecom.png',
    'Enviro': 'logo/enviro.png',
    'HG-Zes': 'logo/futsal.png',
    'basket': 'logo/basket.png',
    'Garnisun': 'logo/garnisun.png',
    'Gempa': 'logo/gempa.png',
    'Kistik': 'logo/kistik.png',
    'Kopsina': 'logo/kopsina.png',
    'Pasnamsi': 'logo/pasnamsi.png',
    'PB': 'logo/pb.png',
    'PMR': 'logo/pmr.png',
    'Polsis': 'logo/polsis.png',
    'LASER': 'logo/pramuka.png',
    'Risamsi': 'logo/risamsi.png',
    'Rokhris': 'logo/rokhris.png',
    'Science Club': 'logo/SC.png',
    'Taekwondo': 'logo/taekwondo.png',
    'MPK': 'logo/mpk.png',
    'Osis': 'logo/osis.PNG',
};

let bookings = [];

// Fungsi untuk menyimpan status ruangan dan logo ekskul ke localStorage berdasarkan tanggal
function saveRoomStatus() {
    const status = JSON.parse(localStorage.getItem(`status_${selectedDate}`)) || {};
    const roomElements = document.querySelectorAll('.ruang, .ruangs');

    roomElements.forEach((room, index) => {
        if (room.style.backgroundColor === "red") {
            status[`ruang_${index}`] = {
                booked: true,
                ekskul: room.getAttribute('data-ekskul'), // Simpan nama ekskul
                jamMulai: room.getAttribute('data-jamMulai'), // Simpan jam mulai
                jamSelesai: room.getAttribute('data-jamSelesai') // Simpan jam selesai
            };
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
            const ekskul = status[`ruang_${index}`].ekskul;
            if (ekskulLogos[ekskul]) {
                const imagePath = ekskulLogos[ekskul];
                room.innerHTML = `<img src="${imagePath}" alt="${ekskul}" style="width: 30px; height: auto;">`;
                room.setAttribute('data-ekskul', ekskul); // Simpan nama ekskul di atribut data
                room.setAttribute('data-jamMulai', status[`ruang_${index}`].jamMulai); // Simpan jam mulai
                room.setAttribute('data-jamSelesai', status[`ruang_${index}`].jamSelesai); // Simpan jam selesai
            }
            room.onclick = () => openForm(`Ruang ${index + 1}`, room); // Aktifkan klik untuk ruangan yang tidak tersedia
        } else {
            room.style.backgroundColor = "";
            room.onclick = () => openForm(`Ruang ${index + 1}`, room); // Aktifkan klik untuk ruangan yang tersedia
        }
    });
}

// Fungsi untuk mengecek apakah ada konflik waktu
function checkConflict(startTime, endTime, roomElement) {
    const roomIndex = Array.from(document.querySelectorAll('.ruang')).indexOf(roomElement);
    const status = JSON.parse(localStorage.getItem(`status_${selectedDate}`)) || {};

    for (let booking of Object.values(status)) {
        if (booking.ruang === `ruang_${roomIndex}`) {
            if (!(endTime <= booking.jamMulai || startTime >= booking.jamSelesai)) {
                return true; // Ada konflik
            }
        }
    }
    return false;
}

// Update jadwal yang ada di halaman
function updateScheduleList() {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = ''; // Kosongkan daftar
    bookings.forEach(booking => {
        const listItem = document.createElement('li');
        listItem.textContent = `Dari ${booking.startTime} sampai ${booking.endTime} di ${booking.roomElement.innerText}`;
        scheduleList.appendChild(listItem);
    });
}

// Menangani form submission
document.getElementById('bookingForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const startTime = document.getElementById('jamMulai').value;
    const endTime = document.getElementById('jamSelesai').value;

    if (startTime >= endTime) {
        alert('Waktu mulai harus lebih awal daripada waktu selesai!');
        return;
    }

    if (checkConflict(startTime, endTime, selectedRoom)) {
        alert('Waktu ini sudah terpakai, silakan pilih waktu lain.');
    } else {
        submitForm(); // Panggil fungsi submitForm untuk mengirim data
    }
});

// Fungsi untuk menambahkan jadwal baru
function addBooking(startTime, endTime, roomElement) {
    bookings.push({ startTime, endTime, roomElement });
    updateScheduleList();
}

// Fungsi untuk membuka form
function openForm(roomName, element) {
    selectedRoom = element;

    // Cek apakah ruangan sudah dipinjam
    const ekskul = selectedRoom.getAttribute('data-ekskul');
    const jamMulai = selectedRoom.getAttribute('data-jamMulai');
    const jamSelesai = selectedRoom.getAttribute('data-jamSelesai');

    document.getElementById("formTitle").textContent = `Peminjaman (${roomName})`; // Mengupdate judul form

    if (ekskul) {
        // Jika sudah dipinjam, tampilkan informasi peminjam
        document.getElementById("nama").value = 'Peminjam: ' + ekskul; // Menampilkan nama ekskul
        document.getElementById("jamMulai").value = jamMulai; // Menampilkan jam mulai
        document.getElementById("jamSelesai").value = jamSelesai; // Menampilkan jam selesai
        document.getElementById("alasan").value = 'Ruangan sudah dipinjam'; // Menambahkan informasi
        document.getElementById("ekskul").value = ekskul; // Menyimpan nama ekskul
    } else {
        // Kosongkan field jika belum dipinjam
        clearForm();
    }

    document.getElementById("formPopup").style.display = "block"; // Menampilkan form
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

// Fungsi untuk mengubah tanggal
function changeDate() {
    selectedDate = document.getElementById("tanggal").value;
    updateRoomStatus(); // Update tampilan ruangan sesuai status pada tanggal yang baru
}

// Fungsi untuk mengirim form
function submitForm() {
    const nama = document.getElementById("nama").value;
    const ekskul = document.getElementById("ekskul").value; // Mendapatkan nama ekskul
    const alasan = document.getElementById("alasan").value;
    const jamMulai = document.getElementById("jamMulai").value;
    const jamSelesai = document.getElementById("jamSelesai").value;

    if (nama && ekskul && alasan && jamMulai && jamSelesai) {
        console.log('Semua data sudah diisi, melanjutkan proses...');

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
            console.log('Data berhasil dikirim:', data);

            // Tampilkan logo ekskul di ruangan yang dipilih
            const imagePath = ekskulLogos[ekskul];
            selectedRoom.innerHTML = `<img src="${imagePath}" alt="${ekskul}" style="width: 30px; height: auto;">`;

            // Tandai ruangan sebagai dipesan
            selectedRoom.style.backgroundColor = "red";
            selectedRoom.setAttribute('data-ekskul', ekskul); // Simpan nama ekskul di atribut data
            selectedRoom.setAttribute('data-jamMulai', jamMulai); // Simpan jam mulai di atribut data
            selectedRoom.setAttribute('data-jamSelesai', jamSelesai); // Simpan jam selesai di atribut data

            // Simpan status ruangan ke localStorage
            saveRoomStatus();
            closeForm(); // Tutup form setelah berhasil kirim data
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
        });
    } else {
        console.log('Ada data yang belum diisi, silakan lengkapi semua data.');
    }
}

// Memanggil fungsi untuk memperbarui tampilan ruangan ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    updateRoomStatus(); // Memperbarui status ruangan saat halaman dimuat
});



function resetLocalStorage() {
    localStorage.clear(); // Hapus semua data di localStorage
    location.reload(); // Refresh halaman
    alert('Local Storage telah di hapus');
}
