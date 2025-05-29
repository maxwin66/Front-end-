document.querySelector('.cta').addEventListener('click', function() {
    alert('Fitur ini akan segera hadir! Stay tuned, bro! 😺');
});

document.querySelectorAll('.secondary').forEach(button => {
    button.addEventListener('click', function() {
        if (button.textContent === 'Coba Face Swap') {
            alert('Fitur Face Swap akan segera hadir! Unggah foto buat coba, bro! 😸');
        } else if (button.textContent === 'Buat Gambar') {
            alert('Fitur Buat Gambar akan segera hadir! Kasih prompt buat gambar, bro! 😎');
        }
    });
});