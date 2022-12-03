/* eslint-disable import/prefer-default-export */

import dotenv from 'dotenv';
import Broadcast from '../models/BroadcastModel';

dotenv.config();

export const createBroadcast = async (req, res) => {
  const { title, content } = req.body;
  try {
    await Broadcast.create({
      title,
      content,
    });
    res.status(201).json({ msg: 'Broadcast berhasil ditambahkan!' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBroadcast = async (req, res) => {
  try {
    const response = await Broadcast.findAll({
      attributes: ['broadcast_id', 'title', 'content', 'createdAt'],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAllBroadcast = async (req, res) => {
  try {
    await Broadcast.destroy({
      where: {},
    });
    res.status(201).json({ message: 'Semua broadcast berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
