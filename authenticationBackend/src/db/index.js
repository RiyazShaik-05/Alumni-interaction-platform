import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

let pool;

const connectDB = async () => {
    try {
        pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
            queueLimit: 0
        });

        console.log("✅ MySQL Database Connected Successfully");
    } catch (error) {
        console.error("❌ MySQL connection failed:", error.message);
        process.exit(1);
    }
};

export { connectDB, pool }; 

