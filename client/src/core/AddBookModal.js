import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { isAuthenticated } from "../auth";
import { useFormik } from "formik";
import { bookSchema } from "../schemas";
import "./AddBookModal.css";
import { AddBook } from "./apiCore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBookModal = (props) => {
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
    toast.success("Book Added", {
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
      AddBook(values, user.user_unique_id, token).then((data) => {
        console.log(data);
        setLoading(false);
        if (data.err) {
          action.setFieldError("error", data.err);
          action.setSubmitting(false);
        } else {
          // console.log(data);
          props.onAdd({
            author: data.user.added_book.author,
            b_id: data.user.added_book.b_id,
            book_id: data.user.added_book.book_unique_id,
            book_unique_id: null,
            published_year: data.user.added_book.published_year,
            title: data.user.added_book.title,
            user_unique_id: data.user.added_book.user_unique_id,
          });
          initModal();
          notify();
        }
      }); // sending js object
    },
  });

  // console.log("formik.values");
  // console.log(formik.values);
  // console.log("formik.errors");
  // console.log(formik.errors);

  const initModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-primarys"
        onClick={initModal}
        style={{ marginLeft: "5rem" }}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-plus-circle"></i>{" "}
          <span style={{ marginLeft: "5px" }}>Add Book</span>
        </div>
      </button>

      <Modal
        aria-labelledby="contained-modal-title-vcenter close"
        centered
        show={open}
      >
        <form className="form" onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton onClick={initModal}></Modal.Header>
          <Modal.Body>
            <h1 className="h4 mb-3 fw-normal">Add a book</h1>

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
              Add Book
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

export default AddBookModal;
