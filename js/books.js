// the URI for our local node Library Server
const base_url = "http://127.0.0.1:3000";
var books_url = base_url + "/books";
var books_list = document.getElementById('books_list');

// a function that gets the list of books and adds them to the list
function updateBookList() {
    var xhttp = new XMLHttpRequest();

    // set up and make a GET request to the books endpoint
    xhttp.open('GET', books_url+"?allEntities=true");
    xhttp.addEventListener('load', function(){
        books_list.innerHTML="";

        //get data from json
        var books = JSON.parse(this.response);

        // loop through all books
        for (var i = 0; i < books.length; i++) {
            var trow = getDataRow(books[i]);
            books_list.appendChild(trow);
        }
    });
    xhttp.send();
}

// a function that create the table
function getDataRow(items) {
    //create the row
    var row = document.createElement('tr');

    //create the title column
    var titleCell = document.createElement('td');
    titleCell.innerHTML = items.title;
    row.appendChild(titleCell);

    //create the isbn column
    var isbnCell = document.createElement('td');
    isbnCell.innerHTML = items.isbn;
    row.appendChild(isbnCell);

    //create the author column
    var authorCell = document.createElement('td');
    if(items.Authors!=null){
        for(i=0; i<items.Authors.length; i++) {
        authorCell.append( items.Authors[i].name);
        authorCell.append("\n");
        row.appendChild(authorCell);
    }
    }else {
        authorCell.innerHTML = items.name;
        row.appendChild(authorCell);
    }

    // delete button
    //create the operation column
    var delCell = document.createElement('td');
    row.appendChild(delCell);
    var btnDel=document.createElement('input');
    btnDel.setAttribute('type', 'button');
    btnDel.setAttribute('value', 'Delete');

    //delete function
    btnDel.onclick =function(){
        if(confirm("delete？")){

            //btnDel - td - tr - tbody - delete(tr)  
            this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

            // delete the data from database
            var xhttp = new XMLHttpRequest();
            xhttp.open("DELETE",books_url+ "/" + items.id);

            xhttp.addEventListener('load',function () {
                updateBookList()
            });

            // delete the data from database
            xhttp.send();
        }
    };
    delCell.appendChild(btnDel);

    //update the items
    return row;
}

// when the user click button, save new information
document.querySelector('#save_button').addEventListener('click',function(){
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', books_url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    var newTitle = document.getElementById('title').value;
    var newIsbn = document.getElementById('isbn').value;
    if (!newTitle.match(/^(?!_)([A-Za-z ]+)$/)) {
        alert(" please enter a correct title or isbn!");
        return newTitle
    }
    if (!newIsbn.match(/^[0-9]*$/)) {
        alert(" please enter a correct title or isbn!");
        return newIsbn
    }
    var params = {
        title: newTitle,
        isbn: newIsbn,
    };
    xhttp.addEventListener('load',function () {
        updateBookList()
    });
    xhttp.send(JSON.stringify(params));

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', books_url);
    xhttp.addEventListener('load',function () {
        var books=JSON.parse(this.response);

        //get the last bookId+1
        var newId=books[books.length-1].id+1;

        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', books_url + "/" + newId+ "/authors");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        var newAuthor = document.getElementById('author').value;
        if (!newAuthor.match(/^(?!_)([A-Za-z ]+)$/)) {
            alert(" please enter a proper title or isbn!");
            return newAuthor
        }
        var param = {
            name: newAuthor
        };
        xhttp.addEventListener('load',function () {
            updateBookList()
        });
        xhttp.send(JSON.stringify(param));
    });

// when the POST request is finished, clear and update the user list
    xhttp.addEventListener('load', function () {
        updateBookList();
    });
    xhttp.send();
});

// when the user click button, search
document.querySelector('#search_button').addEventListener('click',function () {
    var search_term = document.getElementById('search_input').value;

    //if input letters, type=author and books.
    if (search_term.match(/^(?!_)([A-Za-z ]+)$/)) {
        var search_books_url = base_url + "/search?type=book&title=" + search_term;
        var search_authors_url = base_url + "/search?type=author&name=" + search_term;
    } else {
        alert(" please enter a proper name or barcode!");
        return search_term
    }

    //search book'title
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', search_books_url);
    xhttp.addEventListener('load', function () {
        var book_results = JSON.parse(this.response);
        books_list.innerHTML = "";
        book_results.forEach(function (book) {

            // create a new list item for each one and add to the list
            var title = document.createTextNode(book.title);
            var isbn = document.createTextNode(book.isbn);
            var list_title = document.createElement('td');
            var list_isbn = document.createElement('td');
            var list_name = document.createElement('td');
            var delCell = document.createElement('td');
            var tr = document.createElement('tr');
            list_title.appendChild(title);
            list_isbn.appendChild(isbn);
            books_list.appendChild(list_title);
            books_list.appendChild(list_isbn);
            books_list.appendChild(list_name);
            books_list.appendChild(delCell);
            books_list.appendChild(tr);
            var btnDel=document.createElement('input');
            btnDel.setAttribute('type', 'button');
            btnDel.setAttribute('value', 'Delete');
            delCell.appendChild(btnDel);

            //delete function
            btnDel.onclick =function(){
                if(confirm("delete？")){

                    //btnDel - td - tr - tbody - delete(tr)  
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

                    // delete the data from database
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("DELETE",books_url+ "/" + book.id);

                    xhttp.addEventListener('load',function () {
                        updateBookList()
                    });

                    // delete the data from database
                    xhttp.send();
                }
            };

            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', base_url + "/books?allEntities=true");
            xhttp.addEventListener('load', function () {
                var author_results = JSON.parse(this.response);
                author_results.forEach(function (books) {
                    if(book.id===books.id){
                        for (var i = 0; i < books.Authors.length; i++) {

                            // create a new list item for each one and add to the list
                            var name = document.createTextNode(books.Authors[i].name);
                            list_name.appendChild(name);
                    }
                    }
                })
            });
            xhttp.send();
        });
    });
    xhttp.send();

    //search author's name
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', search_authors_url);
    xhttp.addEventListener('load', function () {
        var author_results = JSON.parse(this.response);
        author_results.forEach(function (author) {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', base_url + "/authors?allEntities=true");
            xhttp.addEventListener('load', function () {
                var authors_results = JSON.parse(this.response);
                authors_results.forEach(function (authors) {
                    if(author.id===authors.id){
                        for (var i = 0; i < authors.Books.length; i++) {

                            // create a new list item for each one and add to the list
                            var title = document.createTextNode(authors.Books[i].title);
                            var isbn = document.createTextNode(authors.Books[i].isbn);
                            var name = document.createTextNode(author.name);
                            var list_title = document.createElement('td');
                            var list_isbn = document.createElement('td');
                            var list_name = document.createElement('td');
                            var delCell = document.createElement('td');
                            var tr = document.createElement('tr');
                            list_title.appendChild(title);
                            list_isbn.appendChild(isbn);
                            list_name.appendChild(name);
                            books_list.appendChild(list_title);
                            books_list.appendChild(list_isbn);
                            books_list.appendChild(list_name);
                            books_list.appendChild(delCell);
                            books_list.appendChild(tr);
                            var btnDel=document.createElement('input');
                            btnDel.setAttribute('type', 'button');
                            btnDel.setAttribute('value', 'Delete');
                            delCell.appendChild(btnDel);

                            //delete function
                            btnDel.onclick =function(){
                                if(confirm("delete？")){

                                    //btnDel - td - tr - tbody - delete(tr)  
                                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);

                                    // delete the data from database
                                    var xhttp = new XMLHttpRequest();
                                    xhttp.open("DELETE",books_url+ "/" + book.id);

                                    xhttp.addEventListener('load',function () {
                                        updateBookList()
                                    });
                                    // delete the data from database
                                    xhttp.send();
                                }
                            };
                        }
                    }
                })
            });
            xhttp.send();
        });
    });
    xhttp.send();
});

updateBookList();