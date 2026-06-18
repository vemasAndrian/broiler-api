import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then((connection) => {
        console.log('database terhubung');
        connection.release();
    })
    .catch((err) => {
        console.error('gagal koneksi database:', err.message);
    });

export default db;