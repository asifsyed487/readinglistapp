import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import BookList from "./book/BookList";
import FavoriteList from "./book/FavoriteList";
import BookDetails from "./book/BookDetails";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={Signup} exact />
        <Route path="/signin" component={Signin} exact />
        <PrivateRoute path="/books" component={BookList} exact />
        <PrivateRoute path="/books/favorite" component={FavoriteList} exact />
        <PrivateRoute path="/book/:bookId" component={BookDetails} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
