const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// GET /api/books - Get all books with optional search and pagination
router.get('/', async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const books = await Book.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Book.countDocuments(filter);

    res.status(200).json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/books/:id - Get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/books - Add a new book
router.post('/', async (req, res) => {
  const { title, author, genre, price, publishedDate, inStock } = req.body;
  if (!title || !author || price === undefined) {
    return res.status(400).json({ message: 'Title, author, and price are required' });
  }
  const book = new Book({
    title,
    author,
    genre,
    price,
    publishedDate,
    inStock
  });
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/books/:id - Update an existing book by ID
router.put('/:id', async (req, res) => {
  const { title, author, genre, price, publishedDate, inStock } = req.body;
  if (!title || !author || price === undefined) {
    return res.status(400).json({ message: 'Title, author, and price are required' });
  }
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, {
      title,
      author,
      genre,
      price,
      publishedDate,
      inStock
    }, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/books/:id - Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;