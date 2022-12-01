import express from 'express';
import {
  getArchives,
  getArchiveById,
  createArchive,
  updateArchive,
  deleteArchive,
} from '../controllers/Archives';
import { verifyUser, adminAndStafOnly } from '../middleware/AuthUser';

const router = express.Router();

router.get('/archives', verifyUser, adminAndStafOnly, getArchives);
router.get('/archives/:id', verifyUser, adminAndStafOnly, getArchiveById);
router.post('/archives', verifyUser, adminAndStafOnly, createArchive);
router.patch('/archives/:id', verifyUser, adminAndStafOnly, updateArchive);
router.delete('/archives/:id', verifyUser, adminAndStafOnly, deleteArchive);

export default router;
