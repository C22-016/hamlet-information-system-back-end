import express from 'express';
import {
  sendMessage,
  replyMessageByMessageId,
  getAllMessage,

  getMessageFinished,
  getMessageUnfinished,
  getDetailMessagebyMessageId,
  deleteMessageByMessageId,
  deleteAllMessage,
  deleteAllReadedMessage,
  deleteAllUnReadedMessage,
} from '../controllers/Message.js';

import { verifyUser, adminAndStafOnly } from '../middleware/AuthUser.js';

const router = express.Router();

/** kirim pesan [ user only ] */
router.post('/message', verifyUser, sendMessage);

/** balas pesan [ Admin dan Staff only ] */
router.post('/message/reply/:messageId', verifyUser, replyMessageByMessageId);

/**
 * Untuk me-nampilkan semua pesan
 * staf dan user beda format
 * */
router.get('/message/:messageId', verifyUser, getDetailMessagebyMessageId);
router.get('/message', verifyUser, getAllMessage);
router.get('/msg-finished', verifyUser, getMessageFinished);
router.get('/msg-unfinished', verifyUser, getMessageUnfinished);

/**
 * Hapus Pesan [ admin only ]
 * */
router.delete('/message', verifyUser, adminAndStafOnly, deleteAllMessage);
router.delete('/message/:messageId', verifyUser, adminAndStafOnly, deleteMessageByMessageId);
router.delete('/msg-finished', verifyUser, adminAndStafOnly, deleteAllReadedMessage);
router.delete('/msg-unfinished', verifyUser, adminAndStafOnly, deleteAllUnReadedMessage);

export default router;
