const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    console.log("register called");
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.send(book);
    } else {
        return res.status(404).json({message: `No book with ISBN ${isbn} found`});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(item => item.author === author)
    if(filteredBooks.length) {
      return res.send(filteredBooks);
    } else {
      return res.status(404).json({message: `No book for author ${author} found`});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(item => item.title === title);
    if(filteredBooks.length) {
        return res.send(filteredBooks);
    } else {
        return res.status(404).json({message: `No book for title ${title} found`});
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    if(reviews) {
        return res.send(reviews);
    } else {
        return res.status(404).json({message: `No book with ISBN ${isbn} found`});
    }
});

module.exports.general = public_users;
