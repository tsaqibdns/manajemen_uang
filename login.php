<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Proses login, misalnya memeriksa database
    if ($username === 'admin' && $password === 'password123') {
        echo "Login berhasil!";
        // Alihkan ke halaman dashboard atau yang sesuai
    } else {
        echo "Username atau password salah!";
    }
}
?>
