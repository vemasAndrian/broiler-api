import db from "../config/db.js";

class LocationModel {
    static async insertLocation({alamat, latitude, longitude}) {
        const insQuery = `
            INSERT INTO locations (alamat, latitude, longitude) VALUES (?, ?, ?)
        `;
        const [result] = await db.execute(insQuery, [alamat, latitude, longitude]);

        return result;
    }

    static async updateLocation({alamat, latitude, longitude}, id) {
        const query = `
            UPDATE locations SET alamat = ?, latitude = ?, longitude = ? WHERE id = ?
        `;
        const [result] = await db.execute(query, [alamat, latitude, longitude, id]);

        return result;
    }
}

export default LocationModel;