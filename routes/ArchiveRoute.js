import express from 'express';
import {
  getArchives,
  getArchiveById,
  createArchive,
  updateArchive,
  deleteArchive,
} from '../controllers/Archives.js';
import { verifyUser, adminAndStafOnly } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/archives', verifyUser, getArchives);
router.get('/archives/:id', verifyUser, getArchiveById);
router.post('/archives', verifyUser, adminAndStafOnly, createArchive);
router.patch('/archives/:id', verifyUser, adminAndStafOnly, updateArchive);
router.delete('/archives/:id', verifyUser, adminAndStafOnly, deleteArchive);

export default router;
