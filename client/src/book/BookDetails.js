import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { bookSummarySchema } from "../schemas";
import { withRouter, Link } from "react-router-dom";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Modal, Button } from "react-bootstrap";
import { DeleteBook, FavoriteBook } from "../core/apiCore";

import "./BookDetails.css";
import { SpecificBookDetails, UpdateBookSummary } from "../core/apiCore";
import UpdateBookModal from "../core/UpdateBookModal";

const BookDetails = ({ history, match }) => {
  //   console.log(match);
  const { user, token } = isAuthenticated();
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [click, setClick] = useState(false);
  const initModal = () => {
    setOpen(!open);
  };
  const initialValues = {
    book_summary: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: bookSummarySchema,
    onSubmit: (values, action) => {
      //   console.log(values);
      setLoading(true);
      UpdateBookSummary(
        values,
        user.user_unique_id,
        match.params.bookId,
        token
      ).then((data) => {
        console.log(data);
        setLoading(false);
        if (data.error) {
          action.setFieldError("error", data.error);
          action.setSubmitting(false);
        } else {
          console.log(data);
        }
      }); // sending js object
    },
  });

  function UpdateBook(updateBook) {
    setBook(updateBook);
    formik.setValues({
      book_summary:
        updateBook.book_summary === null ? "" : updateBook.book_summary,
    });
  }
  const loadSingleBook = () => {
    setLoading(true);
    SpecificBookDetails(user.user_unique_id, match.params.bookId, token).then(
      (data) => {
        setLoading(false);
        if (data.error) {
          console.log(data.error);
        } else {
          console.log("single");
          console.log(data.user.single_books[0]);
          setBook(data.user.single_books[0]);
          formik.setValues({
            book_summary:
              data.user.single_books[0].book_summary === null
                ? ""
                : data.user.single_books[0].book_summary,
          });
        }
      }
    );
  };

  const handleFavoriteClick = () => {
    FavoriteBook(book.book_id, user.user_unique_id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log(data.user);
        setClick(true);
      }
    });
  };
  const handleClick = () => {
    DeleteBook(user.user_unique_id, book.book_id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log(data.user);
        history.push("/books");
      }
    });
    initModal();
  };
  useEffect(() => {
    loadSingleBook();
    // console.log(books.added_books);
  }, []);

  return (
    <Layout fullname="asif" type="reading">
      <div className="row">
        <div className="col-md-12 posts-details">
          <div className="mt-5">
            <div className="card-body">
              <div className="card-body-total">
                <span className="card-body-top-text">
                  <h1 className="h3" style={{ marginRight: "0.5rem" }}>
                    {book.title}{" "}
                    <span
                      style={{
                        fontWeight: "300",
                        fontSize: "20px",
                        marginLeft: "20px",
                      }}
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </span>
                  </h1>
                </span>
                <div className="card-body-top-buttons">
                  {book && (
                    <UpdateBookModal
                      book_unique_id={match.params.bookId}
                      user={user}
                      token={token}
                      onUpdate={UpdateBook}
                    />
                  )}

                  {book.book_unique_id === null ? (
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={handleFavoriteClick}
                    >
                      <i
                        style={{ color: click ? "#C92EFF" : "" }}
                        className="bi bi-star-fill"
                      ></i>
                    </button>
                  ) : (
                    <button type="button" className="btn btn-dark">
                      <i
                        className="bi bi-star-fill"
                        style={{ color: "#C92EFF" }}
                      ></i>
                    </button>
                  )}
                  <>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={initModal}
                    >
                      <i
                        className="bi bi-trash"
                        style={{ color: "#d261fa" }}
                      ></i>
                    </button>
                    <Modal
                      aria-labelledby="contained-modal-title-vcenter close"
                      centered
                      show={open}
                    >
                      <Modal.Header
                        closeButton
                        onClick={initModal}
                      ></Modal.Header>
                      <Modal.Body>
                        <p>Are you sure you want to delete the book?</p>
                        <p style={{ fontWeight: "bolder" }}>{book.title}</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="danger"
                          onClick={() => {
                            handleClick();
                          }}
                        >
                          Delete
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                </div>
              </div>

              <div className="card-body-bottom-text">
                <p className="card-text">Author: {book.author}</p>
                <p className="card-text">|</p>
                <p className="card-text">Year: {book.published_year}</p>
              </div>
            </div>
            <form className="form" onSubmit={formik.handleSubmit}>
              <div className="mt-4 mb-2 form-group required">
                <label
                  htmlFor="summary"
                  className="form-label form-label-sm"
                  style={{ marginBottom: "10px", opacity: "0.8" }}
                >
                  Book Summary
                </label>
                <textarea
                  className="form-control"
                  name="book_summary"
                  id="summary"
                  rows="3"
                  value={formik.values.book_summary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></textarea>

                {formik.values.book_summary === "" &&
                formik.errors.book_summary &&
                formik.touched.book_summary ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {formik.errors.book_summary}
                  </p>
                ) : null}
              </div>
              <button className="w-20 btn btn-sm btn-primary" type="submit">
                Save Summary
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(BookDetails);
