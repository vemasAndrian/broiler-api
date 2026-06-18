import db from '../config/db.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class UserModel {
    static async getProfileById(id) {
        const query = `
            SELECT * FROM profiles
            WHERE id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getProfileByUserId(id) {
        const query = `
            SELECT
                u.username,
                p.*
            FROM users u
            JOIN profiles p
                ON p.user_id = u.id
            WHERE p.user_id = ?;
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async getAllProfile(role = null) {
        let query = `
            SELECT u.id AS user_id, u.username, p.id AS profile_id, p.nama, p.tgl_lahir, p.tempat_lahir, p.alamat, p.no_telp, p.no_kendaraan, p.avatar 
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
        `;
        const params = [];

        if (role) {
            query += ' WHERE role = ?';
            params.push(role);
        }

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findByUsername(username) {
        const query = `
            SELECT * 
            FROM users WHERE username = ?
        `;
        const [rows] = await db.execute(query, [username]);
        return rows[0];
    }

    static async getUserAvatarProfiles(id) {
        const query = `
            SELECT avatar 
            FROM profiles WHERE user_id = ?
        `;

        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async createUser(username, password) {
        const insQuery = `
            INSERT INTO users (username, password) VALUES (?, ?)
        `;
        const [result] = await db.execute(insQuery, [username, password]);

        return result;
    }

    static async createUserProfile(user_id, nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar) {
        const query = `
            INSERT INTO profiles (user_id, nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [user_id, nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar]);

        return result;
    }

    static async updateProfileData(username, nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar, user_id) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            await conn.query(
                `UPDATE users SET username = ? WHERE id = ?`, [username, user_id]
            );

            await conn.query(
                `UPDATE profiles SET nama = ?, tgl_lahir = ?, tempat_lahir = ?, alamat = ?, no_telp = ?, no_kendaraan = ?, avatar = ? WHERE user_id = ?`,
                [nama, tgl_lahir, tempat_lahir, alamat, no_telp, no_kendaraan, avatar, user_id]
            );

            await conn.commit()
        } catch (err) {
            await conn.rollback();

            return err;
        } finally {
            conn.release();
        }
    }

    static async dropUser(id) {
        const query = `
            DELETE FROM users WHERE id = ?
        `;
        const [result] = await db.execute(query, [id]);

        return result;
    }

    static async dropProfile(id) {
        const query = `
            DELETE FROM profiles WHERE user_id = ?
        `;
        const [result] = await db.execute(query, [id]);

        return result;
    }
}

export default UserModel;