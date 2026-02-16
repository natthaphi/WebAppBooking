const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // เก็บไฟล์ dashboard.html ไว้ในโฟลเดอร์ public

// --- จำลองฐานข้อมูล (Database) ---
// ในอนาคตคุณสามารถเปลี่ยนตรงนี้เป็น MongoDB หรือ MySQL ได้
let bookings = [
    {
        id: 1,
        name: "นายอานนท์ มั่งมี",
        date: "2026-02-15",
        time: "09:00",
        phone: "081-222-3344",
        email: "arnon.m@email.com",
        note: "ยันต์ห้าแถว (เมตตา)",
        status: "confirmed"
    }
];

// --- API Endpoints ---

// 1. ดึงข้อมูลการจองทั้งหมด (GET)
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// 2. เพิ่มการจองใหม่ (POST)
app.post('/api/bookings', (req, res) => {
    const newBooking = {
        id: Date.now(), // ใช้ Timestamp เป็น ID ชั่วคราว
        ...req.body,
        status: 'pending' // ค่าเริ่มต้นคือรอตรวจสอบ
    };
    bookings.push(newBooking);
    res.status(201).json({ msg: "บันทึกคิวสำเร็จ", data: newBooking });
});

// 3. อัปเดตข้อมูลหรือสถานะ (PUT)
app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const index = bookings.findIndex(b => b.id == id);
    
    if (index !== -1) {
        // อัปเดตข้อมูลเดิมด้วยข้อมูลใหม่ที่ส่งมา
        bookings[index] = { ...bookings[index], ...req.body };
        res.json({ msg: "อัปเดตสำเร็จ", data: bookings[index] });
    } else {
        res.status(404).json({ msg: "ไม่พบข้อมูล" });
    }
});

// 4. ลบการจอง (DELETE)
app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter(b => b.id != id);
    res.json({ msg: "ลบคิวเรียบร้อยแล้ว" });
});

// รัน Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📂 ใส่ไฟล์ HTML ไว้ในโฟลเดอร์ 'public' แล้วเปิดดูผ่าน Browser ได้เลย`);
});

<script>
    let editingRow = null;
    let editingRowId = null;

    // 1. ดึงข้อมูลจาก Server ทันทีที่โหลดหน้า
    document.addEventListener('DOMContentLoaded', loadBookings);
    document.getElementById('bookDate').valueAsDate = new Date();

    async function loadBookings() {
        try {
            const response = await fetch('/api/bookings');
            const data = await response.json();
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = ''; 

            data.forEach(booking => {
                const dateObj = new Date(booking.date);
                const thaiDate = dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                
                const row = document.createElement('tr');
                row.dataset.id = booking.id;
                row.innerHTML = generateRowHTML(thaiDate, booking.time, booking.name, booking.note, booking.phone, booking.email, booking.status);
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // 2. ฟังก์ชันบันทึกข้อมูล (ส่งไป Server)
    async function saveBooking() {
        const name = document.getElementById('custName').value;
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        const phone = document.getElementById('custPhone').value;
        const email = document.getElementById('custEmail').value || '-';
        const note = document.getElementById('bookNote').value || 'ทั่วไป';

        if (!name || !date || !time || !phone) {
            alert("⚠️ กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
            return;
        }

        const formData = { name, date, time, phone, email, note };
        const url = editingRow ? `/api/bookings/${editingRowId}` : '/api/bookings';
        const method = editingRow ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                bootstrap.Modal.getInstance(document.getElementById('addBookingModal')).hide();
                resetForm();
                loadBookings(); // รีโหลดข้อมูลใหม่จาก Server
            }
        } catch (error) {
            alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }
    }

    // 3. ฟังก์ชันสร้าง HTML สถานะ
    function getStatusBadge(status) {
        switch(status) {
            case 'updated': return `<span class="badge-modern bg-success-light"><span class="dot dot-success"></span> ● อัปเดตแล้ว</span>`;
            case 'confirmed': return `<span class="badge-modern bg-info-light"><span class="dot dot-info"></span> ● ยืนยันแล้ว</span>`;
            default: return `<span class="badge-modern bg-warning-light"><span class="dot dot-warning pulse"></span> ● รอตรวจสอบ</span>`;
        }
    }

    function generateRowHTML(date, time, name, note, phone, email, status) {
        return `
            <td>
                <div class="fw-bold text-dark">${date}</div>
                <div class="text-primary small fw-bold"><i class="far fa-clock me-1"></i> ${time} น.</div>
            </td>
            <td>
                <div class="customer-info">
                    <p class="customer-name">${name}</p>
                    <p class="customer-meta text-muted">${note}</p>
                </div>
            </td>
            <td>
                <div class="customer-meta"><i class="fas fa-phone-alt me-2 text-muted"></i>${phone}</div>
                <div class="customer-meta"><i class="fas fa-envelope me-2 text-muted"></i>${email}</div>
            </td>
            <td>${getStatusBadge(status)}</td>
            <td class="text-center">
                <div class="btn-group">
                    <button class="btn btn-light rounded-circle p-2 mx-1" onclick="updateStatus(this, 'confirmed')" title="ยืนยัน"><i class="fas fa-check text-success"></i></button>
                    <button class="btn btn-light rounded-circle p-2 mx-1" onclick="editBooking(this)" title="แก้ไข"><i class="fas fa-pen text-primary"></i></button>
                    <button class="btn btn-light rounded-circle p-2 mx-1" onclick="deleteBooking(this)" title="ลบ"><i class="fas fa-trash text-danger"></i></button>
                </div>
            </td>
        `;
    }

    async function updateStatus(btn, newStatus) {
        const id = btn.closest('tr').dataset.id;
        await fetch(`/api/bookings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        loadBookings();
    }

    async function deleteBooking(btn) {
        if(confirm('ยืนยันการลบคิวจองนี้?')) {
            const id = btn.closest('tr').dataset.id;
            await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            loadBookings();
        }
    }

    function editBooking(button) {
        editingRow = button.closest('tr');
        editingRowId = editingRow.dataset.id;
        
        document.getElementById('custName').value = editingRow.querySelector('.customer-name').innerText;
        document.getElementById('custPhone').value = editingRow.querySelector('.customer-meta i.fa-phone-alt').nextSibling.textContent.trim();
        document.getElementById('bookTime').value = editingRow.querySelector('.text-primary').innerText.trim().replace(' น.', '');
        
        document.getElementById('addBookingModalLabel').innerText = "แก้ไขข้อมูลคิวจอง";
        new bootstrap.Modal(document.getElementById('addBookingModal')).show();
    }

    function resetForm() {
        document.getElementById('bookingForm').reset();
        document.getElementById('bookDate').valueAsDate = new Date();
        editingRow = null;
        editingRowId = null;
    }
</script>
