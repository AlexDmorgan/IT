document.getElementById('bookingForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah reload halaman

    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Validasi apakah waktu mulai dan selesai sah
    if (startTime >= endTime) {
        alert('Waktu mulai harus lebih awal daripada waktu selesai!');
        return;
    }

    // Cek apakah ada konflik dengan jadwal yang sudah ada
    if (checkConflict(startTime, endTime)) {
        // Jika ada konflik, tampilkan alert ini
        alert('Waktu ini sudah terpakai, silakan pilih waktu atau ruangan lain.');
    } else {
        addBooking(startTime, endTime); // Lanjutkan jika tidak ada konflik
        alert('Peminjaman berhasil diajukan!');
    }
});
