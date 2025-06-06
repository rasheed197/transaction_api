import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

async function connectDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        // DECIMAL(10,2) means 8 digits before the decimal, 2 digits after.

        console.log("Database initialized successfully");

    } catch (error) {
        console.log("Error initializing DB", error)
        process.exit(1) // status code 1 means failure, 0 means success
    }
}

export default connectDB;

