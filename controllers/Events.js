/* eslint-disable consistent-return */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Event from '../models/EventModel.js';
import User from '../models/UserModel.js';

dotenv.config();

export const getEvents = async (req, res) => {
  try {
    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Event.findAll({
        attributes: ['uuid', 'name', 'desc', 'date', 'poster', 'url', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['name', 'role'],
        }],
      });
    } else {
      response = await Event.findAll({
        attributes: ['uuid', 'name', 'desc', 'date', 'poster', 'url', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['name', 'role'],
        }],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!event) return res.status(404).json({ msg: 'Data event tidak ditemukan!' });

    let response;
    if (req.role === process.env.FULL_ACCESS || req.role === process.env.MID_ACCESS) {
      response = await Event.findOne({
        attributes: ['uuid', 'name', 'desc', 'date', 'poster', 'url', 'createdAt', 'updatedAt'],
        where: {
          id: event.id,
        },
        include: [{
          model: User,
          attributes: ['name', 'role'],
        }],
      });
    } else {
      response = await Event.findOne({
        attributes: ['uuid', 'name', 'desc', 'date', 'poster', 'url', 'createdAt', 'updatedAt'],
        include: [{
          model: User,
          attributes: ['name', 'role'],
        }],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createEvent = async (req, res) => {
  // Field Image & URL Image
  if (req.files === null) return res.status(400).json({ msg: 'Poster belum diunggah!' });

  const file = req.files.poster;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/events/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Tipe poster tidak sesuai!' });

  if (fileSize > 2000000) return res.status(422).json({ msg: 'Ukuran poster harus dibawah 2 MB!' });

  // Field others
  const {
    name, desc, date,
  } = req.body;

  // If validation all success
  file.mv(`./public/events/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    try {
      await Event.create({
        name,
        desc,
        date,
        poster: fileName,
        url,
        userId: req.userId,
      });
      res.status(201).json({ msg: 'Berhasil menambahkan event!' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  });
};

export const updateEvent = async (req, res) => {
  const event = await Event.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!event) return res.status(404).json({ msg: 'Event tidak ditemukan!' });

  if (req.files === null) return res.status(400).json({ msg: 'Poster tidak boleh kosong!' });

  let fileName = '';
  if (req.files === null) {
    fileName = Event.poster;
  } else {
    const file = req.files.poster;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Tipe poster tidak sesuai!' });

    if (fileSize > 2000000) return res.status(422).json({ msg: 'Ukuran poster harus dibawah 2 MB!' });

    const filePath = `./public/events/${event.poster}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/events/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const url = `${req.protocol}://${req.get('host')}/events/${fileName}`;
  const {
    name, desc, date,
  } = req.body;

  try {
    await Event.update({
      name,
      desc,
      date,
      poster: fileName,
      url,
    }, {
      where: {
        id: event.id,
      },
    });
    res.status(200).json({ msg: 'Event berhasil diperbarui!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!event) return res.status(404).json({ msg: 'Event tidak ditemukan!' });

  try {
    const filePath = `./public/events/${event.poster}`;
    fs.unlinkSync(filePath);

    await Event.destroy({
      where: {
        id: event.id,
      },
    });
    res.status(200).json({ msg: 'Event berhasil dihapus!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
