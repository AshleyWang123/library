// the URI for our local node Library Server
const base_url = "http://127.0.0.1:3000";
var loans_url = base_url + "/loans";
var books_url = base_url + "/books";
var users_url = base_url + "/users";
var loans_list = document.getElementById('loans_list');

// a function that gets the list of loans and adds them to the list
function updateLoansList(){
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', loans_url);
    xhttp.addEventListener('load', function () {

        //get data from JSON.
        var loans = JSON.parse(this.response);

        //loop through all loans, get userId,bookId
        loans.forEach(function (loan) {
            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', books_url);
            xhttp.addEventListener('load', function () {
                var books = JSON.parse(this.response);

                //look through all books, judge bookId
                books.forEach(function (book) {
                    if(loan.BookId===book.id){

                        // create a new list item for each one and add to the list
                        var title = document.createTextNode(book.title);
                        var list_book = document.createElement('td');
                        list_book.appendChild(title);
                        loans_list.appendChild(list_book);
                    }
                })
            });
            xhttp.send();

            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', users_url);
            xhttp.addEventListener('load', function () {
                var users = JSON.parse(this.response);

                //loop through all users, judge userId
                users.forEach(function (user) {
                    if(loan.UserId===user.id){

                        // create a new list item for each one and add to the list
                        var name = document.createTextNode(user.name);
                        var issueData = document.createTextNode(loan.createdAt.substring(0, 10));
                        var dueData = document.createTextNode(loan.dueDate.substring(0, 10));
                        var list_issueData = document.createElement('td');
                        var list_dueData = document.createElement('td');
                        var list_user = document.createElement('td');
                        var tr = document.createElement('tr');
                        list_user.appendChild(name);
                        list_issueData.appendChild(issueData);
                        list_dueData.appendChild(dueData);
                        loans_list.appendChild(list_user);
                        loans_list.appendChild(list_issueData);
                        loans_list.appendChild(list_dueData);
                        loans_list.appendChild(tr);
                    }
                });
            });
            xhttp.send();
        });
    });
    xhttp.send();
}

// when the user click button, loan the book
document.querySelector('#loan_button').addEventListener('click',function () {
    var user=document.getElementById('user_input').value;
    var book=document.getElementById('book_input').value;
    var dueDate=document.getElementById('date_input').value;

    //clear the list of existing data.
    loans_list.innerHTML="";

    //if input letters, type=name.
    if(user.match(/^(?!_)([A-Za-z ]+)$/)){
        var users_url = base_url + "/search?type=user&name="+user;
    }

    //if input numbers, type=barcode.
    else if (user.match(/^[0-9]*$/)){
        var users_url = base_url + "/search?type=user&barcode="+user;
    }else {
        alert(" please enter a correct name or barcode!");
        return user
    }

    //if input letters, type=title.
    if(book.match(/^(?!_)([A-Za-z ]+)$/)){
        var books_url = base_url + "/search?type=book&title="+book;
    }

    //if input numbers, type=isbn.
    else if (book.match(/^[0-9]*$/)){
        var books_url = base_url + "/search?type=book&isbn="+book;
    }else {
        alert(" please enter a correct title or isbn!");
        return book
    }

    // not empty
    if(dueDate===""){
        alert(" please enter a due date!");
        return dueDate
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET',users_url);
    xhttp.addEventListener('load',function () {
        var users=JSON.parse(this.response);

        //clear the list of existing data.
        loans_list.innerHTML="";
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET',books_url);

        users.forEach(function (user) {
            xhttp.addEventListener('load',function () {
                var books=JSON.parse(this.response);
                if(confirm("loan ?")) {
                    var xhttp = new XMLHttpRequest();

                    //get the last bookId+1
                    var newId=books[books.length-1].id;
                    xhttp.open('POST', base_url + "/users/" + user.id + "/loans/" + newId);
                    xhttp.setRequestHeader('Content-Type', 'application/json');
                    var param = {
                        UserId: user.id,
                        BookId: book.id,
                        dueDate: dueDate

                    };
                    xhttp.addEventListener('load',function () {
                        updateLoansList()
                    });
                    xhttp.send(JSON.stringify(param))
                }
            });
        });
        xhttp.send();
    });
    xhttp.send();

});

//view a user’s current Loans
document.querySelector('#view_button').addEventListener('click',function (){
    var view=document.getElementById('view_input').value;

    if(view.match(/^(?!_)([A-Za-z ]+)$/)){
        var view_url = base_url + "/search?type=user&name="+view;
    }
    else if (view.match(/^[0-9]*$/)){
        var view_url = base_url + "/search?type=user&barcode="+view;

    }else {
        alert(" please enter a proper name or barcode!");
        return view
    }

    var xhttp = new XMLHttpRequest();

    // set up and make a GET request to the Users endpoint
    xhttp.open('GET', view_url);
    xhttp.addEventListener('load', function(){

        loans_list.innerHTML="";
        //get data from json
        var users = JSON.parse(this.response);

        users.forEach(function (user) {

            var xhttp = new XMLHttpRequest();
            xhttp.open('GET', users_url+"/"+user.id +"/loans");
            xhttp.addEventListener('load', function() {
                var loans = JSON.parse(this.response);

                loans.forEach(function (loan) {

                    var xhttp = new XMLHttpRequest();
                    xhttp.open('GET', books_url);
                    xhttp.addEventListener('load', function () {
                        var books = JSON.parse(this.response);

                        books.forEach(function (book) {
                            if (loan.BookId === book.id) {

                                // create a new list item for each one and add to the list
                                var title = document.createTextNode(book.title);
                                var list_book = document.createElement('td');
                                list_book.appendChild(title);
                                loans_list.appendChild(list_book);

                            }
                        });

                        users.forEach(function (user) {
                            if (loan.UserId === user.id) {

                                // create a new list item for each one and add to the list
                                var name = document.createTextNode(user.name);
                                var issueData = document.createTextNode(loan.createdAt.substring(0, 10));
                                var dueData = document.createTextNode(loan.dueDate.substring(0, 10));
                                var list_issueData = document.createElement('td');
                                var list_dueData = document.createElement('td');
                                var list_user = document.createElement('td');
                                var tr = document.createElement('tr');

                                list_user.appendChild(name);
                                list_issueData.appendChild(issueData);
                                list_dueData.appendChild(dueData);

                                loans_list.appendChild(list_user);
                                loans_list.appendChild(list_issueData);
                                loans_list.appendChild(list_dueData);
                                loans_list.appendChild(tr);

                            }
                        });
                    });
                    xhttp.send();
                });
            });
            xhttp.send();
        });
    });
    xhttp.send();

});

updateLoansList();