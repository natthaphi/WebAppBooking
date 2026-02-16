// static/js/booking.js

// Helper สำหรับส่งข้อมูล (เพื่อลดโค้ดซ้ำซ้อน)
const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// ฟังก์ชันจอง (Modern Version)
export async function submitBooking() {
    const payload = {
        item: document.getElementById('itemName').value,
        date: document.getElementById('bookDate').value
    };

    try {
        await apiRequest('/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        // ใช้ Toast หรือ UI สวยๆ แทน Alert
        alert('✨ จองเรียบร้อยแล้ว!');
        location.reload();
    } catch (err) {
        alert('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่');
    }
}

// ฟังก์ชันลบ (Admin)
export async function deleteBooking(bookingId) {
    // ใช้ Confirm ที่ดูดีขึ้น
    if (!confirm('🗑️ คุณแน่ใจใช่ไหมที่จะลบรายการนี้?')) return;

    try {
        await apiRequest(`/api/booking/delete/${bookingId}`, { method: 'DELETE' });
        location.reload();
    } catch (err) {
        alert('การลบล้มเหลว');
    }
}
