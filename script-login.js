let failedAttempts = 0;
let lockTime = 0;

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const correctUsername = "sakip";
    const correctPassword = "sakipbanget";

    // Cek jika ada waktu penguncian
    if (lockTime > 0) {
        document.getElementById("error-message").textContent = `Akun terkunci. Coba lagi setelah ${lockTime} detik.`;
        return;
    }

    if (username === correctUsername && password === correctPassword) {
        window.location.href = "home.html";  // Redirect to home page
    } else {
        failedAttempts++;
        if (failedAttempts >= 3) {
            // Jika sudah 3 kali salah, kunci akun selama 30 detik
            lockTime = 30;
            document.getElementById("error-message").textContent = "Anda telah salah 3 kali. Coba lagi setelah 30 detik.";
            const lockInterval = setInterval(function () {
                if (lockTime > 0) {
                    lockTime--;
                    document.getElementById("error-message").textContent = `Akun terkunci. Coba lagi setelah ${lockTime} detik.`;
                } else {
                    clearInterval(lockInterval);
                    document.getElementById("error-message").textContent = "";
                }
            }, 1000); // Update setiap detik
        } else {
            document.getElementById("error-message").textContent = "Username atau Password salah, silakan coba lagi.";
        }
    }
});
