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

// TASK 10 - Get the book list available in the shop using Promises
public_users.get('/books',function (req, res) {

    const allBooks = new Promise(resolve => {
        resolve(res.send(books));
    });

    allBooks.then(() => console.log("Task 10: promise resolved"));

});

// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    const bookDetail = new Promise((resolve, reject) => {
        if (book) {
            resolve(res.send(book));
        } else {
            reject(res.status(404).json({message: `No book with ISBN ${isbn} found`}));
        }
    });

    bookDetail.then(() => console.log("Task 11: promise resolved")).catch(() => console.log("Task 11: promise rejected"));

});

// TASK 12 - Get book details based on author using Promises
public_users.get('/books/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(item => item.author === author)

    const bookDetail = new Promise((resolve, reject) => {
        if(filteredBooks.length) {
            resolve(res.send(filteredBooks));
        } else {
            reject(res.status(404).json({message: `No book for author ${author} found`}));
        }
    });

    bookDetail.then(() => console.log("Task 12: promise resolved")).catch(() => console.log("Task 12: promise rejected"));
});

// TASK 13 - Get all books based on title using Promises
public_users.get('/books/title/:title', function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(item => item.title === title);

    const bookDetail = new Promise((resolve, reject) => {
        if(filteredBooks.length) {
            resolve(res.send(filteredBooks));
        } else {
            reject(res.status(404).json({message: `No book for title ${title} found`}));
        }
    });

    bookDetail.then(() => console.log("Task 13: promise resolved")).catch(() => console.log("Task 13: promise rejected"));
});




module.exports.general = public_users;
