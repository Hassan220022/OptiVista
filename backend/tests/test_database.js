import mysql from 'mysql2';

// Database connection details
const dbConfig = {
    // host: '192.168.1.84',
    // port: 3306,
    // user: 'dev',
    // password: 'DevBor3i238$$',
    // database: 'ecom_db'
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Successfully connected to the database');

    // Query to get all tables in the database
    connection.query('SHOW TABLES', (error, results) => {
        if (error) {
            console.error('Error fetching tables:', error);
        } else {
            console.log('Tables in the database:');
            results.forEach((row) => {
                console.log(`- ${Object.values(row)[0]}`);
            });
        }

        // Close the database connection
        connection.end((endErr) => {
            if (endErr) {
                console.error('Error closing the connection:', endErr);
            } else {
                console.log('Database connection closed');
            }
        });
    });
});
