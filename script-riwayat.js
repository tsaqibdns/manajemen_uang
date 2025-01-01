const API_KEY = 'https://script.google.com/macros/s/AKfycbx4h4xs_GqrOJ03b9wM5aNQTgrhCOS3pltU7Ru0u63zLe2do11wnEtrYYpxiis3e0lv/exec';
const API_URL = 'https://script.google.com/macros/s/AKfycbx4h4xs_GqrOJ03b9wM5aNQTgrhCOS3pltU7Ru0u63zLe2do11wnEtrYYpxiis3e0lv/exec';

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    displayTransactions(transactions);
}

function displayTransactions(transactions) {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';

    if (transactions.length === 0) {
        historyDiv.innerHTML = '<p>Tidak ada transaksi.</p>';
        return;
    }

    transactions.forEach(transaction => {
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
    });
}

function applyFilter() {
    const type = document.getElementById('filter-type').value;
    const date = document.getElementById('filter-date').value;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    if (type) {
        transactions = transactions.filter(t => t.type === type);
    }

    if (date) {
        transactions = transactions.filter(t => new Date(t.timestamp).toLocaleDateString('id-ID') === new Date(date).toLocaleDateString('id-ID'));
    }

    displayTransactions(transactions);
}

function deleteTransaction(timestamp) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t.timestamp !== timestamp);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions();
}

function editTransaction(timestamp) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = transactions.find(t => t.timestamp === timestamp);

    if (transaction) {
        alert('Edit fitur belum terintegrasi!'); // Tambahkan logika edit di sini
    }
}

window.addEventListener('load', loadTransactions);