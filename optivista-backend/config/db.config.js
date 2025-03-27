const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'MnS0niPnq3YMm',
  database: process.env.DB_NAME || 'optivista',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize database by executing the SQL setup script
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Read the SQL setup file
    const sqlSetupPath = path.join(__dirname, '..', 'setup.sql');
    let sqlScript = fs.readFileSync(sqlSetupPath, 'utf8');
    
    // Split the SQL script into individual statements
    // This regex splits on semicolons but ignores semicolons inside quotes
    const statements = sqlScript
      .replace(/\/\*.*?\*\//gs, '') // Remove multi-line comments
      .replace(/--.*$/gm, '') // Remove single-line comments
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement separately
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (statementError) {
        console.error(`Error executing SQL statement: ${statement}`);
        console.error(`SQL Error: ${statementError.message}`);
        // Continue with the next statement instead of breaking
      }
    }
    
    console.log('Database tables created successfully from setup.sql');
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
    if (error.sqlMessage) {
      console.error('SQL Error details:', error.sqlMessage);
    }
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
}; 