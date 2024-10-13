     let bookings = [];

        // Fungsi untuk mengecek konflik waktu
        function checkConflict(startTime, endTime) {
            for (let booking of bookings) {
                // Logika pengecekan konflik waktu
                if (!(endTime <= booking.startTime || startTime >= booking.endTime)) {
                    return true; // Ada konflik waktu
                }
            }
            return false;
        }

        // Fungsi untuk menambah pemesanan baru
        function addBooking(startTime, endTime) {
            const booking = { startTime, endTime };
            bookings.push(booking); // Tambah pemesanan baru
            localStorage.setItem('bookings', JSON.stringify(bookings)); // Simpan ke localStorage
            updateScheduleList(); // Update daftar jadwal di halaman
        }

        // Menangani form submit
        document.getElementById('bookingForm').addEventListener('submit', function (event) {
            event.preventDefault(); // Mencegah reload halaman

            const startTime = document.getElementById('startTime').value;
            const endTime = document.getElementById('endTime').value;

            // Validasi apakah waktu mulai dan selesai sah
            if (startTime >= endTime) {
                alert('Waktu mulai harus lebih awal daripada waktu selesai!');
                return;
            }

            // Cek konflik waktu
            if (checkConflict(startTime, endTime)) {
                // Jika ada konflik, tampilkan alert ini
                alert('Waktu ini sudah terpakai, silakan pilih waktu atau ruangan lain.');
            } else {
                addBooking(startTime, endTime); // Tambah booking jika tidak ada konflik
                alert('Peminjaman berhasil diajukan!');
                closePopup(); // Tutup popup setelah berhasil
            }
        });
