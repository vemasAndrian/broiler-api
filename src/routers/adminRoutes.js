import express from 'express';
import { deleteProsesItem, deleteUser, getAllProfile, getAllProses, getLaporanData, insertLocation, insertProses, insertProsesItem, updateLocations, updateProses } from '../controllers/adminController.js';


const adminRouter = express.Router();

adminRouter.get('/laporan/:start/:end', getLaporanData);
adminRouter.get('/proses', getAllProses);
adminRouter.get('/profile', getAllProfile);
adminRouter.post('/proses/location', insertLocation);
adminRouter.post('/proses', insertProses);
adminRouter.post('/proses/item', insertProsesItem);
adminRouter.delete('/user/:id', deleteUser);
adminRouter.put('/proses/location/:id', updateLocations);
adminRouter.put('/proses/:id', updateProses);
adminRouter.delete('/proses/item/:id', deleteProsesItem);

export default adminRouter;