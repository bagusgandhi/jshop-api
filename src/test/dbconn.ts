import { dbconn } from "../config/dbconn"

async function testDatabaseConnection() {
  try {
    const result = await dbconn.one('SELECT NOW() AS current_time');
    console.info('DB Conn successful!');
    console.info('date:', result.current_time);
  } catch (error) {
    console.error('Failed to connect :', error);
  } finally {
    dbconn.$pool.end();
  }
}

testDatabaseConnection();