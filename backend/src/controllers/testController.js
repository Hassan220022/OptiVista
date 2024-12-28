import db from '../config/database.js';
export const testDatabaseConnection = async (req, res) => {
    try {
        // Example query: Fetching all users from the database
        const [users] = await db.query('SELECT * FROM Users'); // Adjust to your database schema
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
        });
    }
};
