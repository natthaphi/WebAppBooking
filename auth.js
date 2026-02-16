// static/js/auth.js
export const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // แสดง Loading state (ถ้ามีปุ่ม login)
    const loginBtn = e.target.querySelector('button');
    const originalText = loginBtn.innerText;
    loginBtn.disabled = true;
    loginBtn.innerText = 'กำลังเข้าสู่ระบบ...';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.msg || 'Login failed');

        if (result.login) {
            // ใช้ replace แทน href เพื่อไม่ให้กด back กลับมาหน้า login ได้
            window.location.replace('/admin');
        }
    } catch (error) {
        console.error('Auth Error:', error);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = originalText;
    }
};
