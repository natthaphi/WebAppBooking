// admin.js
import { deleteBooking } from './booking.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Admin Dashboard Ready");

    // ผูก Event แทนการเขียน onclick ใน HTML (ดีต่อความปลอดภัย)
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteBooking(id);
        });
    });
});
