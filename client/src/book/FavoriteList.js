import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import "./BookList.css";
import SingleBook from "../core/SingleBook";
import { listBooks } from "../core/apiCore";

const FavoriteList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = isAuthenticated();
  // console.log(user);
  const loadBooks = () => {
    setLoading(true);
    listBooks(user.user_unique_id, token).then((data) => {
      setLoading(false);
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log(data.user);
        setBooks(data.user);
      }
    });
  };

  useEffect(() => {
    loadBooks();
    // console.log(books.added_books);
  }, []);

  return (
    <Layout fullname={user.fullname} type="favorite reading">
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
            {Array.isArray(books.added_books) ? (
              <>
                {books.added_books.map((singlebook, index) => {
                  if (singlebook.book_unique_id !== null) {
                    return <SingleBook key={index} book={singlebook} />;
                  }
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

export default FavoriteList;
