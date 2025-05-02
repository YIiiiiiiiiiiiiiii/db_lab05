const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 開始交易

    const studentID = 'S001'; // 假設要修改的學生學號

    // 1. 檢查學號是否存在
    const checkStudentExist = 'SELECT COUNT(*) AS count FROM STUDENT WHERE Student_ID = ?';
    const result = await conn.query(checkStudentExist, [studentID]);
    
    if (result[0].count === 0) {
      console.log('學號不存在，無法執行交易');
      return; // 學號不存在，終止交易
    }

    // 2. 假設要同時將學生的系所由 CS001 換成 EE001
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, ['EE001', studentID]);

    // 3. 更新學生選課表中的成績
    const updateCourses = 'UPDATE ENROLLMENT SET Grade = ? WHERE Student_ID = ?';  // 更新成績欄位
    await conn.query(updateCourses, ['A', studentID]);  // 假設成績為 'A'
    
    // 4. 提交交易
    await conn.commit();
    console.log('交易成功，已提交');
    
    // 5. 查詢學生修改後的系所
    const getUpdatedStudent = 'SELECT Department_ID FROM STUDENT WHERE Student_ID = ?';
    const updatedStudent = await conn.query(getUpdatedStudent, [studentID]);
    
    console.log(`學生 ${studentID} 目前的系所是：${updatedStudent[0].Department_ID}`);
    
  } catch (err) {
    // 若有任何錯誤，回滾所有操作
    if (conn) await conn.rollback();
    console.error('交易失敗，已回覆：', err);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
