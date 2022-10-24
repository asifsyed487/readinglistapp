import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { DeleteBook, FavoriteBook } from "./apiCore";
import { isAuthenticated } from "../auth";
const SingleBook = ({ book, onDelete, history }) => {
  // console.log("book");
  // console.log(book.book_unique_id);

  const [open, setOpen] = useState(false);
  const [click, setClick] = useState(false);
  const { user, token } = isAuthenticated();
  const initModal = () => {
    setOpen(!open);
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
    // onDelete(book.book_id);
    DeleteBook(user.user_unique_id, book.book_id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log(data.user);
        onDelete(book.book_id);
      }
    });
    initModal();
  };
  // console.log(history);
  return (
    <div className="col-md-12 posts">
      <div className="card">
        <div className="card-body">
          <div className="card-body-total">
            <span className="card-body-top-text">
              <Link
                style={{ textDecoration: "none", color: "#333333" }}
                to={`/book/${book.book_id}`}
                className="mr-2"
              >
                <h1 className="h2" style={{ marginRight: "0.5rem" }}>
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
              </Link>
            </span>
            <div className="card-body-top-buttons">
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
                <>
                  {history.location.pathname === "/books/favorite" ? (
                    <button
                      type="button"
                      className="btn btn-dark"
                      style={{ opacity: "0.1", cursor: "not-allowed" }}
                    >
                      <i
                        className="bi bi-star-fill"
                        style={{ color: "#C92EFF" }}
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
                </>
              )}
              {history.location.pathname === "/books/favorite" ? (
                <button
                  type="button"
                  className="btn btn-dark"
                  style={{ opacity: "0.1", cursor: "not-allowed" }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={initModal}
                  >
                    <i className="bi bi-trash"></i>
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
              )}
            </div>
          </div>
          <Link
            style={{ textDecoration: "none", color: "#333333" }}
            to={`/book/${book.book_id}`}
            className="mr-2"
          >
            <div className="card-body-bottom-text">
              <p className="card-text">Author: {book.author}</p>
              <p className="card-text">|</p>
              <p className="card-text">Year: {book.published_year}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SingleBook);
