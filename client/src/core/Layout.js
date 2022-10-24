import React from "react";
import Menu from "./Menu";
import { withRouter } from "react-router-dom";
import AddBookModal from "./AddBookModal";
const Layout = ({ fullname = "", type, children, history }) => {
  // console.log(history.location.pathname.indexOf("/book/"));
  return (
    <div>
      <Menu />
      <div className="container">
        {history.location.pathname.indexOf("/book/") !== -1 &&
        history.location.pathname.indexOf("/book/") === 0 ? (
          <></>
        ) : (
          <>
            {history.location.pathname === "/books" ? (
              <></>
            ) : (
              <div className="jumbotron mt-4">
                <div className="row">
                  <div className="col-md-10">
                    <p>
                      Hi {fullname}! Here's your {type} list.
                    </p>
                  </div>
                  <div className="col-md-2">
                    {history.location.pathname === "/books/favorite" ? (
                      <></>
                    ) : (
                      <AddBookModal />
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default withRouter(Layout);
