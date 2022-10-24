exports.bookValidator = (req, res, next) => {
  req.check("title", "Bookname is required").notEmpty();
  req.check("published_year", "Year is required").notEmpty();
  req
    .check("published_year", "Year must be exact 4 digits")
    .matches(/^\d+$/)
    .withMessage("Year must contain numbers only")
    .isLength({
      min: 4,
      max: 4,
    });
  req.check("author", "Authorname is required").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
