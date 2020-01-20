// the URI for our local node Library Server
const base_url = "http://127.0.0.1:3000";
var users_url = base_url + "/users";
var users_list = document.getElementById('users_list');

// a function that gets the list of users and adds them to the list
function updateUserList() {
    var xhttp = new XMLHttpRequest();

    // set up and make a GET request to the Users endpoint
    xhttp.open('GET', users_url);
    xhttp.addEventListener('load', function(){

        //clear the list of existing data.
        users_list.innerHTML="";

        //get data from json
        var users = JSON.parse(this.response);

        // loop through all users
        for (var i = 0; i < users.length; i++) {
            var trow = getDataRow(users[i]);
            users_list.appendChild(trow);
        }
    });
    xhttp.send();
}

// a function that create the table
function getDataRow(items) {

    //create the row
    var row = document.createElement('tr');

    //create the name column
    var nameCell = document.createElement('td');
    nameCell.innerHTML = items.name;
    row.appendChild(nameCell);
    var btnEname = document.createElement('input');
    btnEname.setAttribute('type', 'button');
    btnEname.setAttribute('value', ' Edit ');

    // edit the name when click
    btnEname.onclick=function(){
        var newName=prompt("Please enter a new name:",items.name);

        //names validation allow only letters and spaces.
        judge();
        function judge(){
            if(newName.match(/^([A-Za-z]+\s?)*[A-Za-z]$/)){
                items.name=newName.toLowerCase()
            }else {
                newName=prompt(" Please enter a proper name:",items.name);
                judge();
            }
        }

        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT",users_url+"/" + items.id);
        xhttp.setRequestHeader('Content-Type','application/json');

        var params={
            //Initial capital
            name:items.name.replace(newName[0],newName[0].toUpperCase())
        };

        // when the PUT request is finished, clear and update the user list
        xhttp.addEventListener('load', function(){
            updateUserList();
        });
        xhttp.send(JSON.stringify(params));
    };

    //create the barcode column
    var barcodeCell = document.createElement('td');
    barcodeCell.innerHTML = items.barcode;
    row.appendChild(barcodeCell);

    //create the member column
    var memberCell = document.createElement('td');
    memberCell.innerHTML = items.memberType;
    row.appendChild(memberCell);
    var btnEtype = document.createElement('input');
    btnEtype.setAttribute('type', 'button');
    btnEtype.setAttribute('value', ' Edit ');

    btnEtype.onclick=function(){
        var newType=prompt("Please enter Staff or Student:",items.memberType);
        judge();
        function judge(){
            if(newType.toLowerCase()==="student"||newType.toLowerCase()==="staff"){
                items.memberType=newType.toLowerCase();
            }else {
                newType=prompt(" Only Staff or Student can be entered:",items.memberType);
                judge();
            }
        }

        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT",users_url+"/"+ items.id);
        xhttp.setRequestHeader('Content-Type','application/json');
        var params={

            //Initial capital
            memberType:items.memberType.replace(newType[0],newType[0].toUpperCase())
        };

        // when the PUT request is finished, clear and update the user list
        xhttp.addEventListener('load', function(){
            updateUserList();
        });
        xhttp.send(JSON.stringify(params));
    };

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
            xhttp.open("DELETE",users_url+ "/" + items.id);

            // delete the data from database
            xhttp.send();
        }
    };

    delCell.appendChild(btnDel);
    nameCell.appendChild(btnEname);
    memberCell.appendChild(btnEtype);

    //update the items
    return row;
}

// when the user click button, save new information
document.querySelector('#save_button').addEventListener('click',function () {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', users_url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    var newName = document.getElementById('name').value;
    var newBarcode = document.getElementById('barcode').value;
    var newType = document.getElementById('memberType').value;

    //names validation allow only letters and spaces.
    if (!newName.match(/^(?!_)([A-Za-z ]+)$/)) {

        alert(" please enter a proper name or barcode!");
        return newName
    }

    // barcodes validation allow only numbers.
    if (!newBarcode.match(/^[0-9]*$/)) {

        alert(" please enter a proper name or barcode!");
        return newBarcode
    }
    var params = {
        name: newName,
        barcode: newBarcode,

        //initial capital
        memberType: newType.replace(newType[0], newType[0].toUpperCase())
    };

    // when the POST request is finished, clear and update the user list
    xhttp.addEventListener('load', function () {
        updateUserList();
    });
    xhttp.send(JSON.stringify(params));
});

// when the user click button, search
document.querySelector('#search_button').addEventListener('click',function () {
    var search_term=document.getElementById('search_input').value;

    //if input letters, type=user.
    if(search_term.match(/^(?!_)([A-Za-z ]+)$/)){
        var users_url = base_url + "/search?type=user&name="+search_term;
    }
    //if input numbers, type=barcode.
    else if (search_term.match(/^[0-9]*$/)){
        var users_url = base_url + "/search?type=user&barcode="+search_term;
    }else {
        alert(" please enter a proper name or barcode!");
        return search_term
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET',users_url);
    xhttp.addEventListener('load',function () {
        var results=JSON.parse(this.response);

        //clear the list of existing data.
        users_list.innerHTML="";

        //loop through all users.
        for (var i = 0; i < results.length; i++) {
            var trow = getDataRow(results[i]);
            users_list.appendChild(trow);
        }
    });
    xhttp.send();
});

updateUserList();