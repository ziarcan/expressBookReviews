const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("login called");
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("add review called")
  const isbn = req.params.isbn;
  const review = req.query.review;
  const user = req.session.authorization["username"];
  const reviewedBook = books[isbn];
  if(reviewedBook) {
    if(review) {
      reviewedBook['reviews'][user] = review;
      books[isbn] = reviewedBook;
    }
    res.status(200).send(`Added review for book ${isbn}`);
  }
  else{
    res.status(404).send(`Unable to find book for ISBN ${isbn}` );
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let user = req.session.authorization['username'];
  let reviews = books[isbn]['reviews'];
  if (reviews[user]){
    delete reviews[user];
    res.status(200).send(`Reviews for the book  ${isbn} posted by the user ${user} deleted.`);
  }
  else{
    res.status(400).send("Can't delete, as this review has been posted by a different user");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
