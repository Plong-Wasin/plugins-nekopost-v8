ทำเองใช้เองบนมือถือ

## User Scripts

### nekopost-href-modifier.user.js
แก้ไขลิงก์ในโปรเจค Nekopost ให้ใช้ relative path แทน absolute path เพื่อรองรับการทำงานใน Single Page Application (SPA)

#### ฟีเจอร์
- แปลงลิงก์แบบเต็ม (https://www.nekopost.net/project/15672/87) เป็นลิงก์แบบสั้น (./87)
- รองรับลิงก์ที่มีเลขทศนิยม (เช่น 87.5)
- ทำงานกับลิงก์ที่มีอยู่แล้วในหน้าเว็บ
- ตรวจจับและแปลงลิงก์ใหม่ที่เพิ่มเข้ามาใน DOM แบบ real-time
- ใช้ debounce technique เพื่อประสิทธิภาพที่ดีขึ้น
