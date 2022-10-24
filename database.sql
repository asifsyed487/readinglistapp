CREATE DATABASE readinglist;

CREATE TABLE users(
    u_id SERIAL PRIMARY KEY,
    user_unique_id VARCHAR(100),
    fullname VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255)
);

ALTER TABLE users
ADD CONSTRAINT email UNIQUE (email);


CREATE TABLE bookss(
    b_id SERIAL,
    book_unique_id VARCHAR(100) UNIQUE,
    title VARCHAR(200),
    author VARCHAR(100),
    published_year VARCHAR(50),
    book_summary TEXT DEFAULT NULL,
    user_unique_id VARCHAR(100),
    PRIMARY KEY (title, user_unique_id)
);

CREATE TABLE favorites(
    f_id SERIAL,
    book_unique_id VARCHAR(100),
    user_unique_id VARCHAR(100),
    UNIQUE (book_unique_id, user_unique_id)
);


