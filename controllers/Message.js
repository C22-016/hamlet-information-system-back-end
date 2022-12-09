/* eslint-disable consistent-return */

import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { nanoid } from 'nanoid';
import Message from '../models/MessageModel.js';
import Users from '../models/UserModel.js';

dotenv.config();

// [ kirim  pesan ] - user only
export const sendMessage = async (req, res) => {
  try {
    if (req.role !== process.env.LOW_ACCESS) return res.status(404).json({ message: 'Hanya Role User Yang dapat mengirim pesan' });
    const { messageType, messageContent } = req.body;

    const senderInfo = await Users.findOne({
      attributes: ['uuid', 'name'],
      where: { id: req.userId },
    });
    await Message.create({
      message_id: `message-${nanoid(12)}`,
      userId: req.userId,
      uuid: senderInfo.uuid,
      senderName: senderInfo.name,
      message_type: messageType,
      message_content: messageContent,
    });
    return res.status(201).json({ message: `Pesan ${messageType} berhasil di kirim...` });
  } catch (error) {
    console.log(`terjadi kesalahan : ${error.message}`);
  }
};

//  [ balas pesan ] - admin and staf only
export const replyMessageByMessageId = async (req, res) => {
  try {
    const { messageReply } = req.body;
    const pesan = await Message.findOne({
      where: {
        message_id: req.params.messageId,
      },
    });
    if (!pesan) return res.status(404).json({ message: 'Pesan tidak ditemukan' });
    if (pesan.status === 'ditangani') return res.status(404).json({ message: 'pesan ini sidah ditangani, tidak bisa mengirim ulang pesan' });
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      await Message.update({
        status: 'ditangani',
        reply: messageReply,
      }, {
        where: {
          message_id: req.params.messageId,
        },
      });
      res.status(200).json({ message: 'Pesan sudah di balas' });
    }
  } catch (error) {
    console.log(`Terjadi Kesalahan di server : ${error.message}`);
  }
};

// [ menampilkan semua pesan] - admin / staf / user
export const getAllMessage = async (req, res) => {
  try {
    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Message.findAll({
        attributes: ['message_id', 'uuid', 'senderName', 'createdAt', 'message_type', 'message_content', 'status', 'reply'],
      });
    }
    if (req.role === process.env.LOW_ACCESS) {
      response = await Message.findAll({
        attributes: ['senderName', 'createdAt', 'message_type', 'message_content', 'status', 'reply'],
        where: {
          userId: req.userId,
        },
      });
    }
    return res.status(200).json({
      message: 'Menampilkan semua pesan',
      data: response,
    });
  } catch (error) {
    console.log(`terjadi kesalahan : ${error.message}`);
  }
};

// [ pesan yang sudah ditangani ] - admin / staf / user
export const getMessageFinished = async (req, res) => {
  try {
    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Message.findAll({
        attributes: ['message_id', 'uuid', 'senderName', 'createdAt', 'message_type', 'message_content', 'status', 'reply'],
        where: {
          status: 'ditangani',
        },
      });
    }
    if (req.role === process.env.LOW_ACCESS) {
      response = await Message.findAll({
        attributes: ['message_id', 'senderName', 'createdAt', 'message_type', 'message_content', 'reply'],
        where: {
          [Op.and]: [{ status: 'ditangani' }, { userId: req.userId }],
        },
      });
    }
    return res.status(200).json({
      message: 'Pesan yang sudah ditangai',
      data: response,
    });
  } catch (error) {
    console.log(`terjadi kesalahan : ${error.message}`);
  }
};

// [ pesan yang sudah ditangani ] - admin / staf / user
export const getMessageUnfinished = async (req, res) => {
  try {
    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Message.findAll({
        attributes: ['message_id', 'uuid', 'senderName', 'createdAt', 'message_type', 'message_content', 'status', 'reply'],
        where: {
          status: 'belum ditangani',
        },
      });
    }
    if (req.role === process.env.LOW_ACCESS) {
      response = await Message.findAll({
        attributes: ['message_id', 'senderName', 'createdAt', 'message_type', 'message_content', 'reply'],
        where: {
          [Op.and]: [{ status: 'belum ditangani' }, { userId: req.userId }],
        },
      });
    }
    return res.status(200).json({
      message: 'Pesan yang belum ditangai',
      data: response,
    });
  } catch (error) {
    console.log(`terjadi kesalahan : ${error.message}`);
  }
};

//  pake param ( messageId)
export const getDetailMessagebyMessageId = async (req, res) => {
  try {
    const pesan = await Message.findOne({
      where: {
        message_id: req.params.messageId,
      },
    });
    if (!pesan) return res.status(404).json({ message: 'Pesan tidak ditemukan' });

    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Message.findOne({
        attributes: ['message_id', 'uuid', 'senderName', 'createdAt', 'message_type', 'message_content', 'status', 'reply'],
      });
    }

    if (req.role === process.env.LOW_ACCESS) {
      response = await Message.findOne({
        attributes: ['message_id', 'senderName', 'createdAt', 'message_type', 'message_content', 'status', 'reply'],
      });
    }
    return res.status(200).json({
      message: 'Menampilkan detail pesan',
      data: response,
    });
  } catch (error) {
    console.log(`Terjadi Kesalahan di server : ${error.message}`);
  }
};

// admin and staf only
export const deleteMessageByMessageId = async (req, res) => {
  try {
    await Message.destroy({
      where: {
        message_id: req.params.messageId,
      },
    });
    return res.status(201).json({ message: `Pesan dengan id "${req.params.messageId}" berhasil dihapus` });
  } catch (error) {
    console.log(`Terjadi Kesalahan di server : ${error.message}`);
  }
};

export const deleteAllMessage = async (req, res) => {
  try {
    await Message.destroy({
      where: {},
    });
    return res.status(201).json({ message: 'Semua pesan telah dihapus' });
  } catch (error) {
    console.log(`Terjadi Kesalahan di server : ${error.message}`);
  }
};

export const deleteAllReadedMessage = async (req, res) => {
  try {
    await Message.destroy({
      where: {
        status: 'belum ditangani',
      },
    });
    return res.status(201).json({ message: 'Semua pesan telah dihapus' });
  } catch (error) {
    console.log(`Terjadi Kesalahan di server : ${error.message}`);
  }
};

export const deleteAllUnReadedMessage = async (req, res) => {
  try {
    await Message.destroy({
      where: {
        status: 'belum ditangani',
      },
    });
    return res.status(201).json({ message: 'Semua pesan telah dihapus' });
  } catch (error) {
    console.log(`Terjadi Kesalahan di server : ${error.message}`);
  }
};
