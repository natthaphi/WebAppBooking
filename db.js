// db.js
const DB = {
    // จัดการข้อมูลลูกค้า
    getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
    
    getCustomer: (username) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.username === username) || { fullname: "ลูกค้าทั่วไป", phone: "-" };
    },

    // จัดการข้อมูลการจอง
    getBookings: () => JSON.parse(localStorage.getItem('allBookings') || '[]'),
    
    saveBookings: (data) => {
        localStorage.setItem('allBookings', JSON.stringify(data));
    }
};

// จัดการระบบสมาชิกและสิทธิ์การเข้าถึง
const Auth = {
    checkAccess: (requiredRole) => {
        const user = sessionStorage.getItem('currentUser');
        const role = sessionStorage.getItem('role');
        if (!user) {
            window.location.href = 'login.html';
        } else if (requiredRole && role !== requiredRole) {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            window.location.href = (role === 'admin') ? 'admin.html' : 'dashboard.html';
        }
    },
    logout: () => {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
};
