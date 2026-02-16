<script>
    // ตั้งค่าวันที่ปัจจุบันให้เป็น Default ใน Input Date
    document.getElementById('bookDate').valueAsDate = new Date();

    function saveBooking() {
        // ดึงค่าจาก Form
        const name = document.getElementById('custName').value;
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;

        if(!name || !date || !time) {
            alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
            return;
        }

        // ตัวอย่าง Logic เมื่อบันทึกสำเร็จ (ในที่นี้คือการปิด Modal และแสดง Alert)
        console.log("Saving booking for:", name);
        
        // ปิด Modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addBookingModal'));
        modal.hide();

        // แสดงผลความสำเร็จแบบสวยๆ
        alert("✅ บันทึกคิวของ " + name + " เรียบร้อยแล้ว!");
        
        // เคลียร์ฟอร์ม
        document.getElementById('bookingForm').reset();
        document.getElementById('bookDate').valueAsDate = new Date();
    }
</script>
