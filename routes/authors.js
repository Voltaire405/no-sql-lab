const express = require('express');
const Author = require('../models/author');

const router = express.Router();

/**
 * GET authors listing.
 */
router.get('/', async (req, res) => {
  try {
    let filters = {};
    if (req.query.pais) filters = { pais: req.query.pais };

    const authors = await Author.find(filters);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @description Ask for authors that publications is less or equal than 20 and his country is Colombia
 * @returns Name and surnames for this authors
 */
router.get('/query1', async (req, res) => {
  try {
    let filters = {};
    let projections = {};

    filters = { publicados: {$lte: 20}, pais: {$eq: 'Colombia'}};
    projections = {nombre: 1, apellido: 1, _id: 0};

    const authors = await Author.find(filters, projections);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @description Ask for authors that havent surname
 * @returns name of the authors who meet the condition 
 */
 router.get('/query2', async (req, res) => {
  try {
    let filters = {};
    let projections = {};

    filters = { apellido: {$exists:false}};
    projections = {nombre:1, _id:0};

    const authors = await Author.find(filters, projections);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @description Or conditional applied to clause publications great than 20 and country equal to Argentina
 * @returns surname of the authors who meet the condition 
 */
 router.get('/query3', async (req, res) => {
  try {
    let filters = {};
    let projections = {};

    filters = { $or:[{publicados: {$gt: 20}}, {pais: {$eq: 'Argentina'}}]};
    projections = {apellido:1, _id:0};

    const authors = await Author.find(filters, projections);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Create a new Author
 */
router.post('/', async (req, res) => {
  try {
    let author = new Author(req.body);
    author = await author.save({ new: true });
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
