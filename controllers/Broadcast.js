/* eslint-disable consistent-return */

import dotenv from 'dotenv';
import Broadcast from '../models/BroadcastModel.js';

dotenv.config();

export const createBroadcast = async (req, res) => {
  const { title, content } = req.body;
  try {
    await Broadcast.create({
      title,
      content,
    });
    res.status(201).json({ message: 'Broadcast berhasil ditambahkan!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBroadcast = async (req, res) => {
  try {
    const response = await Broadcast.findAll({
      attributes: ['broadcast_id', 'title', 'content', 'createdAt'],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBroadcastById = async (req, res) => {
  try {
    const broadcast = await Broadcast.findOne({
      where: {
        broadcast_id: req.params.id,
      },
    });
    if (!broadcast) return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    if (req.role === process.env.LOW_ACCESS) {
      return res.status(403).json({
        message: 'User tidak di izinkan Delete notif dari database!',
      });
    }
    await Broadcast.destroy({
      where: {
        broadcast_id: req.params.id,
      },
    });
    return res.status(201).json({
      message: 'Notifikasi BErhasil dihapaus',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllBroadcast = async (req, res) => {
  try {
    await Broadcast.destroy({
      where: {},
    });
    res.status(201).json({ message: 'Semua broadcast berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
