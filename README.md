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
- เพิ่มสไตล์ CSS สำหรับลิงก์ที่เคยเข้าชมแล้ว (visited links) ให้แสดงสีเทา

#### การติดตั้ง
1. ติดตั้ง Tampermonkey หรือ Greasemonkey extension ในเบราว์เซอร์
2. คลิกที่ไอคอน extension แล้วเลือก "Create a new script..."
3. คัดลอกเนื้อหาจาก `nekopost-href-modifier.user.js` ไปวางใน editor
4. บันทึกสคริปต์

#### การใช้งาน
สคริปต์จะทำงานอัตโนมัติเมื่อเข้าชมเว็บไซต์ https://www.nekopost.net/
- ลิงก์ตอนจะถูกแปลงเป็น relative path โดยอัตโนมัติ
- ลิงก์ที่เคยเข้าชมแล้วจะแสดงสีเทาเพื่อให้เห็นความคืบหน้า
