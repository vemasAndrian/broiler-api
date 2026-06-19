import db from '../config/db.js';
import bcrypt from 'bcrypt';

class ProsesModel {
    static async getSiapAndDalamPerjalananProses(profile_id) {
        const query = `
            SELECT
                p.id AS proses_id,
                p.status,
                p.tgl_penggiriman,
                p.customer,
                l.alamat
            FROM proses p
            LEFT JOIN locations l
            ON p.location_id = l.id
            WHERE p.status IN (?, ?) AND p.profile_id = ?
            ORDER BY p.created_at DESC;
        `;
        const [rows] = await db.execute(query, ["Siap", "Dalam Perjalanan", profile_id]);

        return rows;
    }

    static async getAllProses() {
        const query = `
            SELECT
                p.id AS proses_id,
                p.customer,
                p.status,
                p.tgl_penggiriman,
                pr.nama,
                pr.avatar,
                l.alamat
            FROM proses p
            LEFT JOIN profiles pr
                ON p.profile_id = pr.id
            LEFT JOIN locations l
                ON p.location_id = l.id
            ORDER BY p.created_at DESC;
        `;
        const [rows] = await db.execute(query,);

        return rows;
    }

    static async getSelesaiAndDibatalkanProses() {
        const query = `
            SELECT
                p.*,
                pr.nama,
                pr.no_kendaraan,
                pi.nama,
                pi.qty,
                pi.pack,
                pi.harga,
                l.alamat,
                l.latitude,
                l.longitude
            FROM proses p
            LEFT JOIN profiles pr
                ON p.profile_id = pr.id
            LEFT JOIN proses_item pi
                ON pi.proses_id = p.id
            LEFT JOIN locations l
                ON l.id = p.location_id
            WHERE p.id = ?
        `;

        const [rows] = await db.execute(query, ["Selesai", "Dibatalkan"]);
        return rows;
    }

    static async getDetailProses(proses_id) {
        const query = `
            SELECT
                p.*,

                JSON_OBJECT(
                    'nama', pr.nama,
                    'no_kendaraan', pr.no_kendaraan
                ) AS profile,

                JSON_OBJECT(
                    'id', l.id,
                    'alamat', l.alamat,
                    'latitude', l.latitude,
                    'longitude', l.longitude
                ) AS location,

                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'nama', pi.nama,
                        'qty', pi.qty,
                        'pack', pi.pack,
                        'harga', pi.harga
                    )
                ) AS proses_item

            FROM proses p
            LEFT JOIN profiles pr
                ON p.profile_id = pr.id
            LEFT JOIN proses_item pi
                ON pi.proses_id = p.id
            LEFT JOIN locations l
                ON l.id = p.location_id

            WHERE p.id = ?

            GROUP BY p.id;
        `;

        const [rows] = await db.execute(query, [proses_id]);

        return rows[0];
    }

    static async updateProsesStatus({ status, delivered_at = null, shipped_at = null, canceled_at = null, bukti_pengiriman = null }, id) {
        const query = `
            UPDATE proses SET status = ?, delivered_at = COALESCE(?, delivered_at), shipped_at = COALESCE(?, shipped_at), canceled_at = COALESCE(?, canceled_at), bukti_pengiriman = COALESCE(?, bukti_pengiriman) WHERE id = ?
        `;

        await db.execute(query, [status, delivered_at, shipped_at, canceled_at, bukti_pengiriman, id]);
    }

    static async getAllRiwayatDriver(id) {
        const query = `
            SELECT 
                JSON_OBJECT(
                    'id', p.id,
                    'customer', p.customer,
                    'delivered_at', p.delivered_at,
                    'canceled_at', p.canceled_at,
                    'status', p.status
                ) AS proses,

                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'nama', pi.nama
                    )
                ) AS proses_item,

                JSON_OBJECT(
                    'alamat', l.alamat
                ) AS locations
            FROM proses p 
            LEFT JOIN proses_item pi
                ON pi.proses_id = p.id
            LEFT JOIN locations l
                ON l.id = p.location_id
            WHERE p.status IN (?, ?) AND p.profile_id = ?
            GROUP BY p.id;
        `;

        const [rows] = await db.execute(query, ["Selesai", "Dibatalkan", id]);

        return rows;
    }

    static async getDetailRiwayat(id) {
        const query = `
            SELECT 
                p.*,

                JSON_OBJECT(
                    'nama', pr.nama,
                    'no_kendaraan', pr.no_kendaraan
                ) AS profile,

                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'nama', pi.nama,
                        'qty', pi.qty,
                        'pack', pi.pack,
                        'harga', pi.harga
                    )
                ) AS proses_item,

                JSON_OBJECT(
                    'id', l.id,
                    'alamat', l.alamat,
                    'latitude', l.latitude,
                    'longitude', l.longitude
                ) AS location,

                l.alamat
            
            FROM proses p
            LEFT JOIN profiles pr
                ON p.profile_id = pr.id
            LEFT JOIN proses_item pi
                ON pi.proses_id = p.id
            LEFT JOIN locations l
                ON p.location_id = l.id
            WHERE p.id = ?
            GROUP BY p.id
        `;

        const [rows] = await db.execute(query, [id]);

        return rows[0];
    }

    static async getLaporanData(startDate, endDate) {
        const query = `
            SELECT
                p.customer,
                p.tgl_penggiriman,
                p.status,

                JSON_OBJECT(
                    'nama', pr.nama
                ) AS profiles,

                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', pi.id,
                        'nama', pi.nama,
                        'qty', pi.qty,
                        'pack', pi.pack,
                        'harga', pi.harga
                    )
                ) AS proses_item,

                JSON_OBJECT(
                    'alamat', l.alamat
                ) AS locations

            FROM proses p

            LEFT JOIN profiles pr
                ON p.profile_id = pr.id

            LEFT JOIN proses_item pi
                ON pi.proses_id = p.id

            LEFT JOIN locations l
                ON p.location_id = l.id

            WHERE p.created_at >= ?
            AND p.created_at <= ?

            GROUP BY
                p.id,
                p.customer,
                p.tgl_penggiriman,
                p.status,
                pr.nama,
                l.alamat

            ORDER BY p.created_at ASC;
        `;

        const [rows] = await db.execute(query, [startDate, endDate]);

        return rows;
    }

    static async createProses({ profile_id, customer, tgl_penggiriman, status, location_id }) {
        const query = `
                INSERT INTO proses (profile_id, customer, tgl_penggiriman, status, location_id) VALUES (?, ?, ?, ?, ?)
            `;

        const [rows] = await db.execute(query, [profile_id, customer, tgl_penggiriman, status, location_id]);

        return rows;
    }

    static async createItemProses(data) {
        const query = `
                INSERT INTO proses_item (proses_id, nama, pack, qty, harga) VALUES ?
            `;

        const [rows] = await db.query(query, [data]);

        return rows;
    }

    static async updateProses({ profile_id, customer, tgl_penggiriman }, id) {
        const query = `
                UPDATE proses SET profile_id = ?, customer = ?, tgl_penggiriman = ? WHERE id = ?
            `;

        const [result] = await db.query(query, [profile_id, customer, tgl_penggiriman, id]);

        return result;
    }

    static async dropProsesItem(id) {
        const query = `
                DELETE FROM proses_item WHERE proses_id = ?
            `;

        const [result] = await db.query(query, [id]);

        return result;
    }
}

export default ProsesModel;