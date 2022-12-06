import express from 'express';
import {
  getBroadcast, createBroadcast, deleteBroadcastById, deleteAllBroadcast,
} from '../controllers/Broadcast.js';
import { verifyUser, adminAndStafOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/broadcast', verifyUser, getBroadcast);
router.post('/broadcast', verifyUser, adminAndStafOnly, createBroadcast);
router.delete('/broadcast/:id', verifyUser, adminAndStafOnly, deleteBroadcastById);
router.delete('/broadcast', verifyUser, adminAndStafOnly, deleteAllBroadcast);

export default router;
