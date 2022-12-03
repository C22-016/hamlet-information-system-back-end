import express from 'express';

import {
  getBroadcast,
  createBroadcast,
  deleteAllBroadcast,
} from '../controllers/Broadcast';

import { verifyUser, adminAndStafOnly } from '../middleware/AuthUser';

const router = express.Router();

router.get('/broadcast', verifyUser, getBroadcast);
router.post('/broadcast', verifyUser, adminAndStafOnly, createBroadcast);
router.delete('/broadcast', verifyUser, adminAndStafOnly, deleteAllBroadcast);

export default router;
