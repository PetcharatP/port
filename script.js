// เริ่มต้นเมื่อหน้าเว็บโหลดเสร็จ
window.onload = function () {
    const progressElements = document.querySelectorAll('.progress');

    progressElements.forEach(progress => {
        const width = progress.getAttribute('data-width'); // ดึงค่าความกว้างจาก data-width
        progress.style.width = width; // กำหนดความกว้าง
    });
};
