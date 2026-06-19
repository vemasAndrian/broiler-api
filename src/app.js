import express from 'express';
import 'dotenv/config';
import userRouter from './routers/userRoutes.js';
import driverRouter from './routers/driverRoutes.js';
import adminRouter from './routers/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware Global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Daftarkan Router Utama dengan Prefix URL
app.use('/api/users', userRouter);
app.use('/api/driver', driverRouter);
app.use('/api/admin', adminRouter);

// Base Route
app.get('/', (req, res) => {
    return res.status(200).json({ message: "API Gateway Kustom Aktif" });
});

// Middleware 404 Handler
app.use((req, res) => {
    return res.status(404).json({ code: "NOT_FOUND", message: "Endpoint tidak ditemukan" });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di ${PORT}`);
});