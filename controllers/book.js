const { errorHandler } = require("../helpers/dbErrorHandler");
const uuid = require("uuid");
const pool = require("../config/db");

exports.bookById = async (req, res, next, id) => {
  // find the book based on user_unique_id and book_unique_id
  const getBook = await pool.query(
    "SELECT * from bookss WHERE book_unique_id=$1",
    [id]
  );
  if (getBook.rows.length > 0) {
    req.book = getBook.rows[0];
    next();
  } else {
    return res.status(400).json({
      error: "Book doesn't exist",
    });
  }
};

exports.create = async (req, res) => {
  const book_unique_id = uuid.v4();
  const createBook = await pool
    .query(
      "INSERT INTO bookss(book_unique_id, title, author, published_year, user_unique_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [
        book_unique_id,
        req.body.title,
        req.body.author,
        req.body.published_year,
        req.profile.user_unique_id,
      ]
    )
    .then((data) => {
      // console.log(data);
      return res.json({
        user: {
          fullname: req.profile.fullname,
          email: req.profile.email,
          added_book: data.rows[0],
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      if (errorHandler(err) === "bookss_pkey already exists") {
        return res.status(400).json({
          err: "You have already added a book with this name.",
        });
      }
    });
  //   console.log(createBook.rows[0]);
  //   const createBook = await pool.query(
  //     "INSERT INTO books(book_unique_id, title, author, published_year) VALUES($1, $2, $3, $4) RETURNING *",
  //     [book_unique_id, req.body.title, req.body.author, req.body.published_year]
  //   );
  //   if (createBook.rows.length > 0) {
  //     const createReader = await pool.query(
  //       "INSERT INTO readers(book_unique_id, user_unique_id) VALUES($1, $2) RETURNING *",
  //       [book_unique_id, req.profile.user_unique_id]
  //     );
  //     if (createReader.rows.length > 0) {
  //       return res.json({
  //         user: {
  //           fullname: req.profile.fullname,
  //           email: req.profile.email,
  //           created_book: createBook.rows[0],
  //         },
  //       });
  //   const createdBookByUser = await pool.query(
  //     "SELECT books.title ,books.author, books.published_year, users.fullname, users.email FROM books LEFT JOIN readers ON books.book_unique_id = readers.book_unique_id LEFT JOIN users ON readers.user_unique_id = users.user_unique_id  WHERE users.user_unique_id=$1",
  //     [req.profile.user_unique_id]
  //   );
  //     }
  //   }
};

exports.read = async (req, res) => {
  const createdBookBySpecificUser = await pool
    .query(
      "SELECT bookss.title,bookss.book_unique_id as book_id, bookss.author, bookss.published_year, bookss.user_unique_id, favorites.book_unique_id FROM bookss LEFT JOIN favorites on bookss.book_unique_id=favorites.book_unique_id WHERE bookss.user_unique_id=$1",
      [req.profile.user_unique_id]
    )
    .then((data) => {
      // console.log(data);

      return res.json({
        user: {
          fullname: req.profile.fullname,
          email: req.profile.email,
          added_books: data.rows,
        },
      });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.readSingleBook = async (req, res) => {
  if (req.profile.user_unique_id === req.book.user_unique_id) {
    const createdBookBySpecificUser = await pool
      .query(
        "SELECT bookss.title,bookss.book_unique_id as book_id,bookss.book_summary, bookss.author, bookss.published_year, bookss.user_unique_id, favorites.book_unique_id FROM bookss LEFT JOIN favorites on bookss.book_unique_id=favorites.book_unique_id WHERE bookss.book_unique_id=$1",
        [req.book.book_unique_id]
      )
      .then((data) => {
        // console.log(data);

        return res.json({
          user: {
            fullname: req.profile.fullname,
            email: req.profile.email,
            single_books: data.rows,
          },
        });
      })
      .catch((err) => {
        res.json({ error: err });
      });
  } else {
    return res.json({ error: "Access Denied" });
  }
};

exports.update = async (req, res) => {
  if (req.profile.user_unique_id === req.book.user_unique_id) {
    const updateBook = await pool
      .query(
        "UPDATE bookss SET title = $1, author=$2, published_year=$3 WHERE book_unique_id =$4 RETURNING *",
        [
          req.body.title,
          req.body.author,
          req.body.published_year,
          req.book.book_unique_id,
        ]
      )
      .then((data) => {
        return res.json({
          fullname: req.profile.fullname,
          email: req.profile.email,
          updated_book: data.rows[0],
        });
      });
  } else {
    return res.json({ error: "Access Denied" });
  }
};

exports.updateSummary = async (req, res) => {
  if (req.profile.user_unique_id === req.book.user_unique_id) {
    console.log(req.body);

    const updateBook = await pool
      .query(
        "UPDATE bookss SET book_summary= $1 WHERE book_unique_id =$2 RETURNING *",
        [req.body.book_summary, req.book.book_unique_id]
      )
      .then((data) => {
        return res.json({
          fullname: req.profile.fullname,
          email: req.profile.email,
          updated_book: data.rows[0],
        });
      });
  } else {
    return res.json({ error: "Access Denied" });
  }
};

exports.favorite = async (req, res) => {
  if (req.profile.user_unique_id === req.book.user_unique_id) {
    const createFavorite = await pool
      .query(
        "INSERT INTO favorites(book_unique_id, user_unique_id) VALUES($1, $2) RETURNING *",
        [req.book.book_unique_id, req.profile.user_unique_id]
      )
      .then((data) => {
        // console.log(data);
        return res.json({
          user: {
            fullname: req.profile.fullname,
            email: req.profile.email,
            added_favorite_book: req.book,
          },
        });
      })
      .catch((err) => {
        if (
          errorHandler(err) ===
          "favorites_book_unique_id_user_unique_id_key already exists"
        ) {
          return res.status(400).json({
            err: "You have already added this book to your favorites.",
          });
        }
      });
  } else {
    return res.json({ error: "Access Denied" });
  }
};

exports.remove = async (req, res) => {
  if (req.profile.user_unique_id === req.book.user_unique_id) {
    const deleteSpecificBook = await pool
      .query("DELETE from bookss where book_unique_id=$1 RETURNING *", [
        req.book.book_unique_id,
      ])
      .then((data) => {
        res.json({
          message: "Book deleted",
        });
      });
  } else {
    return res.json({ error: "Access Denied" });
  }
};
