# data/users.py

# จำลองฐานข้อมูลผู้ใช้งานในรูปแบบ Dictionary
# โครงสร้าง: { "username": { "password": "...", "role": "...", "name": "..." } }
USERS_STORAGE = {
    "admin": {
        "password": "123456", 
        "role": "admin",
        "name": "ผู้ดูแลระบบ"
    },
    "user1": {
        "password": "12345678",
        "role": "user",
        "name": "สมชาย ใจดี"
    }
}

def find_user_by_username(username: str):
    """ฟังก์ชันดึงข้อมูลผู้ใช้ตามชื่อ (ใช้ตอน Login)"""
    return USERS_STORAGE.get(username)

def create_new_user(username: str, password: str, role: str = "user"):
    """ฟังก์ชันเพิ่มผู้ใช้ใหม่ (ใช้ตอน Register)"""
    if username in USERS_STORAGE:
        return False, "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว"
    
    USERS_STORAGE[username] = {
        "password": password,
        "role": role,
        "name": username  # เบื้องต้นใช้ username เป็นชื่อแสดงผล
    }
    return True, "สมัครสมาชิกสำเร็จ"

def get_all_users():
    """ฟังก์ชันดึงรายชื่อผู้ใช้ทั้งหมด (สำหรับ Admin)"""
    return USERS_STORAGE
