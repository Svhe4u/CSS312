/**
 * Finance Dashboard - Client Side Logic
 * File: index.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Элементүүдийг сонгож авах
    const notifyToggle = document.getElementById('notifyToggle');
    const offLabel = document.querySelector('.off-label');
    const balanceAmount = document.querySelector('.balance-amount');
    const catAmount = document.querySelector('.cat-amount');
    const catPercent = document.querySelector('.cat-percent');
    const catName = document.querySelector('.cat-name');
    const cardNumber = document.querySelector('.card-number');
    const cardBrand = document.querySelector('.card-brand');
    const cardExpiry = document.querySelector('.card-expiry');
    const donutLabel = document.querySelector('.donut-label');

    // 2. Notification Toggle - Төлөв өөрчлөх (ON/OFF)
    if (notifyToggle) {
        notifyToggle.addEventListener('change', () => {
            offLabel.textContent = notifyToggle.checked ? 'ON' : 'OFF';
            console.log(`Мэдэгдэл: ${notifyToggle.checked ? 'Идэвхжсэн' : 'Идэвхгүй'}`);
        });
    }

    // 3. Backend-ээс өгөгдөл татаж харуулах функц
    async function loadFinanceData() {
        try {
            // Node.js серверээс өгөгдөл дуудах (Таны CRUD service-ийн URL)
            const response = await fetch('http://localhost:3000/transactions');
            
            if (!response.ok) {
                throw new Error('Сервертэй холбогдоход алдаа гарлаа');
            }

            const data = await response.json();

            // Хэрэв өгөгдөл ирсэн бол HTML-ийг шинэчлэх
            if (data && data.length > 0) {
                // Хамгийн сүүлийн гүйлгээг жишээ болгон авлаа
                const lastEntry = data[data.length - 1];

                // Мөнгөн дүн форматлах ($ 1,593.58)
                const formattedAmount = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'MNT',
                }).format(lastEntry.amount);

                // UI шинэчлэх
                if (catName) catName.textContent = lastEntry.category;
                if (catAmount) catAmount.textContent = formattedAmount;
                if (catPercent) catPercent.textContent = lastEntry.percentage + '%';
                if (donutLabel) donutLabel.textContent = lastEntry.percentage + '%';

                console.log('Өгөгдөл амжилттай шинэчлэгдлээ:', lastEntry);
            }
        } catch (error) {
            console.warn('Сервертэй холбогдож чадсангүй. Демо өгөгдөл ашиглаж байна.');
        }
    }

    // Программ асах үед өгөгдлийг ачаалах
    loadFinanceData();
});