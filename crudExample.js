const pool = require('./db');

async function basicCrud(studentID) {
  let conn;
  try {
    conn = await pool.getConnection();

    // 1. 檢查學號是否已存在
    let sql = 'SELECT COUNT(*) AS count FROM STUDENT WHERE Student_ID = ?';
    const result = await conn.query(sql, [studentID]);
    
    if (result[0].count > 0) {
      console.log('學號已存在，無法新增學生資料');
      return; // 終止程式，避免插入重複學號
    }

    // 2. INSERT 新增 (去掉 Gender 欄位)
    sql = 'INSERT INTO STUDENT (Student_ID, Name, Email, Department_ID) VALUES (?, ?, ?, ?)';
    await conn.query(sql, [studentID, '王曉明', 'wang@example.com', 'CS']);
    console.log(`學號 ${studentID} 的學生資料已新增`);
    
    // 3. SELECT 查詢
    sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
    const rows = await conn.query(sql, ['CS']);
    console.log('查詢結果：', rows);
    
    // 4. UPDATE 更新
    sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
    await conn.query(sql, ['王小明', studentID]);
    console.log(`學號 ${studentID} 的學生名稱已更新`);
    
    // 5. DELETE 刪除
    sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
    await conn.query(sql, [studentID]);
    console.log(`學號 ${studentID} 的學生資料已刪除`);
    
  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

// 假設動態傳入學號 S001
basicCrud('S031');

