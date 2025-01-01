        const API_KEY = 'https://script.google.com/macros/s/AKfycbx4h4xs_GqrOJ03b9wM5aNQTgrhCOS3pltU7Ru0u63zLe2do11wnEtrYYpxiis3e0lv/exec';
        const API_URL = 'https://script.google.com/macros/s/AKfycbx4h4xs_GqrOJ03b9wM5aNQTgrhCOS3pltU7Ru0u63zLe2do11wnEtrYYpxiis3e0lv/exec'; // Ganti dengan URL Google Apps Script Anda

        async function saveTransactionToDatabase(transaction) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        action: 'add', 
                        ...transaction 
                    }),
                });
                if (!response.ok) {
                    throw new Error('Gagal menyimpan transaksi');
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        async function deleteTransaction(timestamp) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        action: 'delete', 
                        timestamp 
                    }),
                });
                if (!response.ok) {
                    throw new Error('Gagal menghapus transaksi');
                }
                location.reload(); // Refresh halaman setelah penghapusan
            } catch (error) {
                console.error(error.message);
            }
        }

        async function loadTransactions() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Gagal memuat transaksi');
                }
                const transactions = await response.json();

                // Tampilkan data transaksi ke riwayat
                transactions.forEach(transaction => {
                    addTransactionToHistory({
                        timestamp: transaction[0],
                        type: transaction[1],
                        amount: parseInt(transaction[2]),
                        purpose: transaction[3],
                        notes: transaction[4]
                    });
                });
            } catch (error) {
                console.error(error.message);
            }
        }

        // Panggil loadTransactions saat halaman dimuat
        window.addEventListener('load', function() {
            loadTransactions();
            updateSaldo();
        });


        let saldo = 2000000;
        const saldoDiv = document.getElementById('saldo');
        const form = document.getElementById('transaction-form');
        const historyDiv = document.getElementById('history');

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const type = form.type.value;
            const amount = parseInt(form.amount.value);
            const purpose = form.purpose.value;
            const notes = form.notes.value;
            const timestamp = new Date().toLocaleString();

            const transaction = {
                type,
                amount,
                purpose,
                notes,
                timestamp
            };

            if (type === 'pengeluaran') {
                saldo -= amount;
            } else {
                saldo += amount;
            }

            updateSaldo();
            addTransactionToHistory(transaction);
            saveTransactionToDatabase(transaction);
            form.reset();
        });

        function updateSaldo() {
            saldoDiv.textContent = `Sisa Saldo: Rp ${saldo.toLocaleString('id-ID')}`;
        }

        function addTransactionToHistory(transaction) {
            const item = document.createElement('div');
            item.className = 'history-item';

            item.innerHTML = `
                <div>
                    <span><strong>Jenis:</strong> ${transaction.type}</span>
                    <span><strong>Jumlah:</strong> Rp ${transaction.amount.toLocaleString('id-ID')}</span>
                    <span><strong>Keperluan:</strong> ${transaction.purpose}</span>
                    <span><strong>Catatan:</strong> ${transaction.notes || 'Tidak ada'}</span>
                    <span><strong>Waktu:</strong> ${transaction.timestamp}</span>
                </div>
                <div class="history-actions">
                    <button class="edit" onclick="editTransaction('${transaction.timestamp}')">Edit</button>
                    <button class="delete" onclick="deleteTransaction('${transaction.timestamp}')">Hapus</button>
                </div>
            `;

            historyDiv.appendChild(item);
        }

        function saveTransactionToDatabase(transaction) {
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        function deleteTransaction(timestamp) {
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            transactions = transactions.filter(t => t.timestamp !== timestamp);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            location.reload();
        }

        function editTransaction(timestamp) {
            let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const transaction = transactions.find(t => t.timestamp === timestamp);

            if (transaction) {
                form.type.value = transaction.type;
                form.amount.value = transaction.amount;
                form.purpose.value = transaction.purpose;
                form.notes.value = transaction.notes;

                deleteTransaction(timestamp);
            }
        }

        function setAmount(value) {
            document.getElementById('amount').value = value;
        }

        window.addEventListener('load', function() {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const today = new Date().toLocaleDateString();

            transactions.forEach(transaction => {
                if (new Date(transaction.timestamp).toLocaleDateString() === today) {
                    addTransactionToHistory(transaction);
                }
            });

            updateSaldo();
        });