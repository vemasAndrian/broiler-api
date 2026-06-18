import LocationModel from "../models/location.js";
import ProsesModel from "../models/proses.js";
import UserModel from "../models/user.js";

export const getLaporanData = async (req, res) => {
    try {
        const { start, end } = req.params;

        const resultRows = await ProsesModel.getLaporanData(start, end);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const getAllProses = async (req, res) => {
    try {
        const resultRows = await ProsesModel.getAllProses();

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const getAllProfile = async (req, res) => {
    try {
        const { role } = req.query;

        const resultRows = await UserModel.getAllProfile(role);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const insertLocation = async (req, res) => {
    try {
        const resultRows = await LocationModel.insertLocation(req.body);
        
        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const insertProses = async (req, res) => {
    try {
        const resultRows = await ProsesModel.createProses(req.body);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const insertProsesItem = async (req, res) => {
    try {
        const insertData = req.body;

        const data = insertData.map(item => [
            item.proses_id,
            item.nama,
            item.qty,
            item.pack,
            item.harga
        ]);

        const resultRows = await ProsesModel.createItemProses(data);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const profileData = await UserModel.getProfileByUserId(id);
 
        if (profileData) {
            await UserModel.dropProfile(id);
        } 

        await UserModel.dropUser(id);

        return res.status(200).json({
            error: false,
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const updateLocations = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await LocationModel.updateLocation(req.body, id)

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const updateProses = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.updateProses(req.body, id)

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const deleteProsesItem = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.dropProsesItem(id);

        return res.status(200).json({
            error: false,
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}