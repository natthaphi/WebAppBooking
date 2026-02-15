from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from fastapi.staticfiles import StaticFiles

# 1. ตั้งค่าการเรียกใช้ไฟล์ HTML ในโฟลเดอร์ templates
templates = Jinja2Templates(directory="templates")

# 2. ตั้งค่าการเรียกใช้ไฟล์ CSS/JS ในโฟลเดอร์ static
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- ตั้งค่าตำแหน่งไฟล์ ---
#--- BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#--- templates = Jinja2Templates(directory=BASE_DIR) # วางไฟล์ HTML ไว้ที่เดียวกับ main.py ใน Pydroid

# --- แก้ไขส่วนนี้ ---
# --- แก้ไขส่วนนี้ให้ชัวร์ ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(BASE_DIR, "templates")

# ตรวจสอบว่ามีโฟลเดอร์อยู่จริงไหม ถ้าไม่มีให้สร้าง (กัน Error)
if not os.path.exists(template_path):
    os.makedirs(template_path)

templates = Jinja2Templates(directory=template_path)

# เสริม: หากคุณสร้างโฟลเดอร์ชื่อ 'templates' แยกไว้ ให้แก้เป็น:
# templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))



app = FastAPI()

# เปิดทางให้ Frontend เชื่อมต่อ API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ฐานข้อมูลจำลอง (ในกรณีที่ไฟล์ data/users.py ยังไม่พร้อม) ---
db_users = {
    "admin": {"password": "123456", "role": "admin"}
}

class UserAuth(BaseModel):
    username: str
    password: str

# --- Routes สำหรับหน้าเว็บ ---
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

# --- Routes สำหรับ API ---
@app.post("/api/auth/login")
async def login_api(user: UserAuth):
    target = db_users.get(user.username)
    if target and target["password"] == user.password:
        return {"msg": "สำเร็จ", "role": target["role"]}
    raise HTTPException(status_code=401, detail={"msg": "รหัสผ่านผิด"})

@app.post("/api/auth/register")
async def register_api(user: UserAuth):
    if user.username in db_users:
        raise HTTPException(status_code=400, detail={"msg": "มีชื่อนี้แล้ว"})
    db_users[user.username] = {"password": user.password, "role": "user"}
    return {"msg": "สมัครสมาชิกสำเร็จ"}

if __name__ == "__main__":
    # รันเซิร์ฟเวอร์
    print("เซิร์ฟเวอร์กำลังทำงานที่: http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
