import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

import SingleBook from "../core/SingleBook";
import { listBooks } from "../core/apiCore";
import AddBookModal from "../core/AddBookModal";
import "./BookList.css";
const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = isAuthenticated();

  // console.log(user);
  const loadBooks = () => {
    setLoading(true);
    listBooks(user.user_unique_id, token).then((data) => {
      // setLoading(false);
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("data.user");
        console.log(data.user.added_books);
        setBooks(data.user.added_books);
        setLoading(false);
      }
    });
  };

  function addBook(newBook) {
    setBooks((prevBooks) => {
      return [...prevBooks, newBook];
    });
  }

  function deleteBook(id) {
    // console.log(id);
    setBooks((prevBooks) => {
      // console.log("prevBooks");
      // console.log(prevBooks);
      return prevBooks.filter((bookItem, index) => {
        // console.log("bookItem");
        // console.log(bookItem);
        return bookItem.book_id !== id;
      });
    });
  }
  useEffect(() => {
    loadBooks();
    // console.log(books.added_books);
  }, []);

  return (
    <Layout fullname={user.fullname} type="reading">
      <div className="jumbotron mt-4">
        <div className="row">
          <div className="col-md-10">
            <p>Hi {user.fullname}! Here's your reading list.</p>
          </div>
          <div className="col-md-2">
            <AddBookModal onAdd={addBook} />
          </div>
        </div>
      </div>
      <div className="row">
        {loading ? (
          <div className="text-center">
            <div className="spinner-grow spinner-grow-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow spinner-grow-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {Array.isArray(books) ? (
              <>
                {books.map((singlebook, index) => {
                  {
                    /* console.log(singlebook); */
                  }
                  return (
                    <SingleBook
                      key={index}
                      book={singlebook}
                      onDelete={deleteBook}
                    />
                  );
                })}
              </>
            ) : (
              <p>You have no books added. Please add a book to get started. </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default BookList;
