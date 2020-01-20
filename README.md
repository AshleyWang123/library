# CMT112-CW2-Library Server

## Installation

Download and install all requirements for the server with:

```
npm install
```

## Initialising a Database

Before you run the server for the first time, you should ensure there is a database available for it to read and write to. You can initialise the database with:

```
node initialise_database.js
```

This will create a `library.sqlite` file inside the `data/` directory and pre-populate it with some sample data.

**CAUTION!** Running this command will remove any data already stored in the database `data/library.sqlite`. It should be used with caution, only when you want to reset the Database to its initial state.

## Running the Server

Start the server with:

```
node server.js
```

This will start the server running on `127.0.0.1` port `3000`.

## Check everything is working correctly

To check the database and server are operating correctly you can open `http://127.0.0.1:3000:3000/authors` in a Web Browser. This should return a JSON representation of all the Authors stored in the database.

## Making requests

Requests to the server can be made to the endpoints specified in `server.js`. For details on the Models and the Fields they contain, check `data.js`

### `authors/...`

**GET /**

Returns a list of all Authors in the database. If requested with the parameter `allEntities`, Author objects returned will include full details of all Books authored by each Author, otherwise only `bookID`s will be provided

Accepted query parameters: `allEntities`

```
GET http://127.0.0.1:3000/authors
GET http://127.0.0.1:3000/authors?allEntities=true
```

**GET /:authorID**

Returns the Author with the specified `authorID`. If requested with the parameter `allEntities`, Author object returned will include full details of all Books authored by this Author, otherwise only `bookID`s will be provided

Accepted query parameters: `allEntities`

```
GET http://127.0.0.1:3000/authors/1
GET http://127.0.0.1:3000/authors/1?allEntities=true
```

**PUT /:authorID**

Updates the Author with the specified `authorID`. Fields to be updated should be included as the body of the PUT request.

Accepted body fields: `name`

```
PUT http://127.0.0.1:3000/authors/1
{"name" : "Dave"}
```

**DELETE /:authorID**

Deletes the Author with the specified `authorID`

```
DELETE http://127.0.0.1:3000/authors/1
```

**POST /**

Creates a new Author. Fields for the Author should be included as the body of the POST request

Accepted body fields: `name`

```
POST http://127.0.0.1:3000/authors
{"name" : "Dave"}
```

**POST /:authorID/books**

Adds a Book to the list of books written by the Author with the specified `authorID`. Will create the Book if a Book with matching details is not found. Fields for the Book should be included in the body of the POST request

Accepted body fields: `bookTitle`, `bookISBN`

```
POST http://127.0.0.1:3000/authors/1/books
{
    "bookTitle": "Building Library Systems",
    "bookISBN": "3985789305"
}
```

**POST /:authorID/books/:bookID**

Adds the Book with the specified `bookID` to the list of books written by the Author with the specified `authorID`

```
POST http://127.0.0.1:3000/authors/1/books/1
```

### `books/...`

**GET /**

Returns a list of all Books in the database. If requested with the parameter `allEntities`, Book objects returned will include full details of all Authors of each Book, otherwise only `authorID`s will be provided

Accepted query parameters: `allEntities`

```
GET http://127.0.0.1:3000/books
GET http://127.0.0.1:3000/books?allEntities=true
```

**GET /:bookID**

Returns the Book with the specified `bookID`. If requested with the parameter `allEntities`, Book objects returned will include full details of all Authors of this Book, otherwise only `authorID`s will be provided

Accepted query parameters: `allEntities`

```
GET http://127.0.0.1:3000/books/1
GET http://127.0.0.1:3000/books/1?allEntities=true
```

**PUT /:bookID**

Updates the Book with the specified `bookID`. Fields to be updated should be included as the body of the PUT request.

Accepted fields: `title`, `isbn`

```
PUT http://127.0.0.1:3000/books/1
{
    "title": "Building Library Systems",
    "isbn": "3985789305"
}
```

**DELETE /:bookID**

Deletes the Book with the specified `bookID`

```
DELETE http://127.0.0.1:3000/books/1
```

**POST /**

Creates a new Book. Fields for the Book should be included as the body of the POST request

Accepted fields: `title`, `isbn`

```
POST http://127.0.0.1:3000/books
{
    "title": "Building Library Systems",
    "isbn": "3985789305"
}
```

**POST /:bookID/authors**

Adds an Author to the list of authors for the Book with the specified `bookID`. Will create the Author if an Author with matching details is not found. Fields for the Author should be included in the body of the POST request

Accepted fields: `name`

```
POST http://127.0.0.1:3000/books/1/authors
{"name": "David"}
```

**POST /:bookID/authors/:authorID**

Adds the Author with the specified `auhtorID` to the list of authors of the Book with the specified `bookID`

```
POST http://127.0.0.1:3000/books/1/authors/2
```

### `users/...`

**GET /**

Returns a list of all Users in the database

```
GET http://127.0.0.1:3000/users
```

**GET /:userID**

Returns the User with the specified `userID`

```
GET http://127.0.0.1:3000/users/1
```

**POST /**

Creates a new User. Fields for the new User should be included in the body of the POST request.

Accepted body fields: `name`, `barcode`, `memberType`

```
POST http://127.0.0.1:3000/users
{
    "name": "Sarah",
    "barcode": "39587985",
    "memberType": "Student"
}
```

**PUT /:userID**

Updates the details of the User with the specified `userID`. Fields to be updated should be included in the body of the PUT request

Accepted body fields: `name`, `barcode`, `memberType`

```
PUT http://127.0.0.1:3000/users/1
{
    "name": "Sarah",
    "barcode": "39587985",
    "memberType": "Student"
}
```

**DELETE /:userID**

Deletes the User with the specified `userID`.

```
DELETE http://127.0.0.1:3000/users/1
```

**GET /:userID/loans**

Returns the list of Loans for the User with the specified `userID`.

```
POST http://127.0.0.1:3000/users/1/loans
```

**POST /:userID/loans/:bookID**

Creates or Updates a Loan for the User with the specified `userID` and the Book with the specified `bookID`. Fields to be added to or updated in the Loan should be included in the body of the POST request

Accepted body fields: `dueDate`

```
POST http://127.0.0.1:3000/users/1/loans/2
{"dueDate": "2018-12-31"}
```

### `loans/...`

**GET /**

Returns a list of all Loans in the Database

```
GET http://127.0.0.1:3000/loans
```

**GET /:loanID**

Returns the details of the Loan with the specified `loanID`

```
GET http://127.0.0.1:3000/loans/1
```

**PUT /:loanID**

Updates the details of the Loan with the specified `loanID`. Fields to be updated should be included in the body of the PUT request

Accepted body fields: `dueDate`

```
GET http://127.0.0.1:3000/loans/1
{"dueDate": "2018-12-31"}
```

**DELETE /:loanID**

Deletes the Loan with the specified `loanID`

```
DELETE http://127.0.0.1:3000/loans/1
```

### `/search`

**GET /**

Searches for a particular item in the database. Parameters are used to control what type of item being searched for and to supply fields to match.

Parameters accepted: `type` + [`title`, `isbn`] + [`name`] + [`name`, `barcode`, `memberType`]

```
GET http://127.0.0.1:3000/search?type=book&title=javascript
GET http://127.0.0.1:3000/search?type=author&name=david
GET http://127.0.0.1:3000/search?type=user&barcode=3265897236
```

## Editing the server

The Node server uses the [Sequelize](http://docs.sequelizejs.com/) library for interacting with the SQLite database.

It uses the [Express](https://expressjs.com/) framework for running the web server and routing queries.

## Server Test Page

This repository also contains a server test page - `server_test.html`. This can be used both to check the server is operating correctly and to act as an example of how to make requests to the server.
