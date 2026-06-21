import ProsesModel from "../models/proses.js";

export const getProsesSiapAndDalamPerjalanan = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.getSiapAndDalamPerjalananProses(id);

        return res.status(200).json({
            error: false,
            data: resultRows,
            test: "Tes CI/CD"
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

export const getDetailProses = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.getDetailProses(id);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

export const updateStatusProses = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.updateProsesStatus(req.body, id);

        return res.status(200).json({
            error: false,
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
};

export const getAllRiwayatDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.getAllRiwayatDriver(id);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}

export const getDetailRiwayat = async (req, res) => {
    try {
        const { id } = req.params;

        const resultRows = await ProsesModel.getDetailRiwayat(id);

        return res.status(200).json({
            error: false,
            data: resultRows
        });
    } catch (error) {
        return res.status(400).json({ error: true, message: error.message });
    }
}