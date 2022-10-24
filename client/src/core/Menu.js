import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return {
      color: "#C92EFF",
      padding: "0.4rem",
      border: "1px solid #C92EFF",
      borderRadius: "10px",
      // textDecoration: "underline",
    };
  } else {
    return {};
  }
};

const MaterialAppBar = ({ history }) => {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <div className="container">
        <div className="d-flex flex-grow-1">
          <Link className="navbar-brand" aria-current="page" to="/books">
            <img
              src={process.env.PUBLIC_URL + "/images/logo.png"}
              alt=""
              width="130"
              height="35"
              style={{
                width: "135px",
                height: "32px",
                marginBottom: "0px !important",
              }}
            />
          </Link>
          <div className="w-100 text-right d-flex justify-content-end">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
        <div
          className="collapse navbar-collapse flex-grow-1 text-right"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto flex-nowrap">
            <li className="nav-item">
              <Link
                style={isActive(history, "/books")}
                className="nav-link active"
                aria-current="page"
                to="/books"
              >
                My Books
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={isActive(history, "/books/favorite")}
                className="nav-link"
                to="/books/favorite"
              >
                Favorites
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                onClick={() =>
                  signout(() => {
                    history.push("/signin");
                  })
                }
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(MaterialAppBar);
