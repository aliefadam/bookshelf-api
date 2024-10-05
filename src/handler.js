import books from './books.js';
import { nanoid } from 'nanoid';

const addBook = (req, h) => {
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  books.push(newBook);
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    .code(201);
};

const getAllBooks = (req, h) => {
  let filteredBook = books;
  const { name, reading, finished } = req.query;

  if (reading) {
    filteredBook = getBooksByReading(reading);
  }

  if (finished) {
    filteredBook = getBooksByFinished(finished);
  }

  if (name) {
    filteredBook = getBooksByName(name);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBook.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
      }),
    },
  });

  return response;
};

const getBookById = (req, h) => {
  const { bookId } = req.params;
  const book = books.find((book) => book.id === bookId);

  if (book === undefined) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }
  return h
    .response({
      status: 'success',
      data: {
        book,
      },
    })
    .code(200);
};

const getBooksByName = (name) => {
  return books.filter((book) => {
    return book.name.toLowerCase().includes(name.toLowerCase());
  });
};

const getBooksByReading = (reading) => {
  if (reading == 0) {
    return books.filter((book) => !book.reading);
  } else if (reading == 1) {
    return books.filter((book) => book.reading);
  } else {
    return books;
  }
};

const getBooksByFinished = (finished) => {
  if (finished == 0) {
    return books.filter((book) => !book.finished);
  } else if (finished == 1) {
    return books.filter((book) => book.finished);
  } else {
    return books;
  }
};

const updateBookById = (req, h) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookById = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }

  books.splice(index, 1);
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};

export { getAllBooks, addBook, getBookById, updateBookById, deleteBookById };
