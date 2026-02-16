from fastapi import FastAPI, Response, Request, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Response, Request, HTTPException, Cookie
from typing import Optional

# ... (โค้ดเดิมจากส่วนที่แล้ว) ...

@app.get("/api/auth/check-session")
async def check_session(session_id: Optional[str] = Cookie(None)):
    """
    API สำหรับตรวจสอบว่า Session ยังใช้งานได้อยู่หรือไม่
    """
    if not session_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # ในระบบจริงต้องเช็ค session_id ใน Database หรือ Redis ด้วย
    return {"status": "authenticated"}




app = FastAPI()

# จำลองฐานข้อมูลผู้ใช้
users_db = {
    "admin": {"password": "123", "role": "admin"},
    "user1": {"password": "123", "role": "user"}
}

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/auth/login")
async def login(data: LoginRequest, response: Response):
    user = users_db.get(data.username)
    
    # ตรวจสอบ User และ Password
    if not user or user["password"] != data.password:
        return JSONResponse(
            status_code=401, 
            content={"msg": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}
        )

    # ในระบบจริงควรใช้ Secure Session หรือ JWT
    # ตัวอย่างนี้ใช้การตั้งค่า Cookie ง่ายๆ เพื่อใช้ยืนยันตัวตน
    response = JSONResponse(content={"msg": "Login สำเร็จ", "role": user["role"]})
    response.set_cookie(key="session_id", value=f"session_{data.username}", httponly=True)
    return response

@app.post("/api/auth/logout")
async def logout(response: Response):
    # ทำลาย Session โดยการลบ Cookie ออกจาก Browser
    response = JSONResponse(content={"msg": "ออกจากระบบเรียบร้อยแล้ว"})
    response.delete_cookie(key="session_id")
    return response
