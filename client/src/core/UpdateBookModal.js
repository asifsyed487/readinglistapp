import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { isAuthenticated } from "../auth";
import { useFormik } from "formik";
import { bookSchema } from "../schemas";
import "./AddBookModal.css";
import { AddBook, SpecificBookDetails, UpdateBook } from "./apiCore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBookModal = (props) => {
  const [open, setOpen] = useState(false);
  const { user, token } = isAuthenticated();
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialValues = {
    title: "",
    published_year: "",
    author: "",
  };

  const notify = () =>
    toast.success("Book Updated", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const formik = useFormik({
    initialValues,
    validationSchema: bookSchema,
    onSubmit: (values, action) => {
      console.log(values);
      setLoading(true);
      UpdateBook(values, props.book_unique_id, user.user_unique_id, token).then(
        (data) => {
          console.log(data.updated_book);
          console.log("data");
          setLoading(false);
          if (data.err) {
            action.setFieldError("error", data.err);
            action.setSubmitting(false);
          } else {
            // console.log(data);
            props.onUpdate({
              author: data.updated_book.author,
              b_id: data.updated_book.b_id,
              book_unique_id: data.updated_book.book_unique_id,
              published_year: data.updated_book.published_year,
              title: data.updated_book.title,
              user_unique_id: data.updated_book.user_unique_id,
              book_summary: data.updated_book.book_summary,
            });
            initModal();
            notify();
          }
        }
      ); // sending js object
    },
  });

  const loadSingleBook = () => {
    setLoading(true);
    SpecificBookDetails(
      props.user.user_unique_id,
      props.book_unique_id,
      token
    ).then((data) => {
      // console.log(data);
      setLoading(false);
      if (data.error) {
        console.log(data.error);
      } else {
        //   console.log(data);
        setBook(data.user.single_books[0]);
        formik.setValues({
          title: data.user.single_books[0].title,
          author: data.user.single_books[0].author,
          published_year: data.user.single_books[0].published_year,
        });
        // console.log("data");
        // console.log(book);
      }
    });
  };
  useEffect(() => {
    loadSingleBook();
    // console.log(books.added_books);
  }, []);

  // console.log("formik.values");
  // console.log(formik.values);
  // console.log("formik.errors");
  // console.log(formik.errors);

  const initModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <button type="button" className="btn btn-dark" onClick={initModal}>
        <i class="bi bi-pencil-square" style={{ color: "#d261fa" }}></i>
      </button>
      {/* <button
        type="button"
        className="btn btn-sm btn-primarys"
        onClick={initModal}
        style={{ marginLeft: "5rem" }}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-plus-circle"></i>{" "}
          <span style={{ marginLeft: "5px" }}>Add Book</span>
        </div>
      </button> */}

      <Modal
        aria-labelledby="contained-modal-title-vcenter close"
        centered
        show={open}
      >
        <form className="form" onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton onClick={initModal}></Modal.Header>
          <Modal.Body>
            <h1 className="h4 mb-3 fw-normal">Edit this book</h1>
            <div className="mb-2 form-group required">
              <label htmlFor="title" className="form-label form-label-sm">
                Book Name
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="title"
                name="title"
                placeholder="Book Name"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.errors.error &&
              formik.errors.error ===
                "You have already added a book with this name." ? (
                <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                  {formik.errors.error}
                </p>
              ) : null}

              {formik.errors.title && formik.touched.title ? (
                <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                  {formik.errors.title}
                </p>
              ) : null}
            </div>
            <div className="mb-2 form-group required">
              <label
                htmlFor="published_year"
                className="form-label form-label-sm"
              >
                Year
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="published_year"
                name="published_year"
                placeholder="Published Year"
                value={formik.values.published_year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {/* {errors.error && errors.error === "password doesn't match" ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {errors.error}
                  </p>
                ) : null}
                 */}
              {formik.errors.published_year && formik.touched.published_year ? (
                <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                  {formik.errors.published_year}
                </p>
              ) : null}
            </div>
            <div className="mb-2 form-group required">
              <label htmlFor="author" className="form-label form-label-sm">
                Author
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="author"
                name="author"
                placeholder="Author"
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {/* {errors.error && errors.error === "password doesn't match" ? (
                  <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                    {errors.error}
                  </p>
                ) : null}
                 */}
              {formik.errors.author && formik.touched.author ? (
                <p className="semi-strong-text" style={{ color: "#A52A2A" }}>
                  {formik.errors.author}
                </p>
              ) : null}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="w-20 btn btn-sm btn-primary" type="submit">
              Update Book
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default UpdateBookModal;
