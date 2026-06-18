import express from 'express';
import { getAllRiwayatDriver, getDetailProses, getDetailRiwayat, getProsesSiapAndDalamPerjalanan, updateStatusProses } from '../controllers/driverController.js';


const driverRouter = express.Router();

driverRouter.get('/:id/proses', getProsesSiapAndDalamPerjalanan);
driverRouter.get('/proses/:id', getDetailProses);
driverRouter.put('/proses/:id', updateStatusProses);
driverRouter.get('/:id/riwayat', getAllRiwayatDriver);
driverRouter.get('/riwayat/:id', getDetailRiwayat);


export default driverRouter;