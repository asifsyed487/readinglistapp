const express = require("express");
const router = express.Router();

const {
  create,
  read,
  update,
  updateSummary,
  remove,
  bookById,
  readSingleBook,
  favorite,
} = require("../controllers/book");
const { userById, requireSignin, isAuth } = require("../controllers/auth");

const { bookValidator } = require("../validator/book");

router.post(
  "/book/create/:userId",
  requireSignin,
  isAuth,
  bookValidator,
  create
);

router.post("/book/favorite/:bookId/:userId", requireSignin, isAuth, favorite);

router.get("/books/:userId", requireSignin, isAuth, read);

router.get("/book/:bookId/:userId", requireSignin, isAuth, readSingleBook);

router.put(
  "/book/:bookId/:userId",
  requireSignin,
  isAuth,
  bookValidator,
  update
);

router.put(
  "/book/summary/:bookId/:userId",
  requireSignin,
  isAuth,
  updateSummary
);

router.delete("/book/:bookId/:userId", requireSignin, isAuth, remove);

router.param("userId", userById);
router.param("bookId", bookById);

module.exports = router;
