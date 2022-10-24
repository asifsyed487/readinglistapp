import { API } from "../config";

export const listBooks = (userId, token) => {
  return fetch(`${API}/books/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const SpecificBookDetails = (userId, bookId, token) => {
  return fetch(`${API}/book/${bookId}/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const UpdateBookSummary = (book, userId, bookId, token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    book_summary: `${book.book_summary}`,
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return fetch(`${API}/book/summary/${bookId}/${userId}`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const DeleteBook = (userId, bookId, token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };
  return fetch(`${API}/book/${bookId}/${userId}`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const AddBook = (book, userId, token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(book);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return fetch(`${API}/book/create/${userId}`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const UpdateBook = (book, bookId, userId, token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(book);

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return fetch(`${API}/book/${bookId}/${userId}`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const FavoriteBook = (bookId, userId, token) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };
  return fetch(`${API}/book/favorite/${bookId}/${userId}`, requestOptions)
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
