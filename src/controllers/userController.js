import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Handler untuk mengambil profil
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                code: "NOT_FOUND",
                message: "User tidak ditemukan"
            });
        }

        const response = {
            test: "ok"
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ code: "SERVER_ERROR", message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await UserModel.getProfileByUserId(id);

        return res.status(200).json({
            error: false,
            data: result
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

// Handler untuk registrasi user baru
export const registerUser = async (req, res) => {
    const saltRound = 10;
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, saltRound);

        const result = await UserModel.createUser(username, hashedPassword);

        return res.status(201).json({
            message: "user berhasil disimpan"
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Cari user di database
        const user = await UserModel.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: true, message: "username atau password salah" });
        }

        // 2. Cek apakah password cocok
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: true, message: "username atau password salah" });
        }

        // 3. Buat JWT Token (Gunakan secret key dari .env Anda)
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } // Token aktif selama 30 hari
        );

        const responseData = {
            token,
            user: {
                id: user.id,
                profile_id: null,
                username: user.username,
                nama: user.nama,
                role: user.role,
                is_complete: false
            }
        };

        const userProfile = await UserModel.getProfileByUserId(user.id);
        
        if (userProfile) {
            responseData.user.profile_id = userProfile.id;
            responseData.user.is_complete = true;
        }

        return res.status(200).json({
            error: false,
            data: responseData
        });
    } catch (error) {
        return res.status(500).json({ code: "SERVER_ERROR", message: error.message });
    }
};

export const createUserProfile = async (req, res) => {
    try {
        const { user_id, nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar } = req.body;

        const dob = new Date(tgl_lahir);

        const result = await UserModel.createUserProfile(user_id, nama, dob, tempat_lahir, alamat, no_telp, no_kendaraan, avatar);

        return res.status(201).json({
            error: false,
            message: "profile berhasil disimpan"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
     try {
        const { id } = req.params;
        const { username, nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar } = req.body;

        const dob = new Date(tgl_lahir);

        const result = await UserModel.updateProfileData(username, nama, dob, tempat_lahir, alamat, no_telp, no_kendaraan, avatar, id);

        return res.status(200).json({
            error: false
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: true, message: error.message });
    }
}