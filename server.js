var express = require("express");
var jsonexport = require('jsonexport');
var fs = require("fs");
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');


var app = express();


var db = new sqlite3.Database('Database/data.db');


app.use(express.static(__dirname + '/Public'));
app.use(bodyParser.urlencoded({ extended: false }));


//routing
app.get('/', function(request, resposnse) {

    //resposnse.send("hello world");
});

app.get('/data', function(request, response) {
    console.log("GET request recived at /registration");

    db.all('select * from formdata', function(err, rows) {
        if (err) {
            console.log('error:' + err);
        } else {
            // console.log(rows);

        }
    });
});

app.post('/data', function(request, response) {
    console.log(" request recived at /registration");
    db.run('CREATE TABLE IF NOT EXISTS formdata(Button varchar, Employee_Name varchar, Employee_ID varchar, Overall_Experience number, Timely_Response number, Our_Support number, Overall_Satisfaction number, rating number )', function(err) {

        if (err) {
            console.log("Table creation error:");
        } else {
            db.run('insert into formdata values(?, ?, ?, ?, ?, ?, ?, ?)', ['', request.body.Name, request.body.EmployeeID, request.body.radio, request.body.radio1, request.body.radio2, request.body.radio3, request.body.rating], function(err) {
                if (err) {
                    // console.log("Error: sagar " + err);
                } else {
                    db.all('select * from formdata', function(err, rows) {
                        if (err) {
                            console.log('error:' + err);
                        } else {
                            const jsonCustomers = JSON.parse(JSON.stringify(rows));


                            jsonexport(jsonCustomers, function(err, csv) {
                                if (err) return //console.log(err);
                                    //console.log(csv)
                                fs.writeFileSync(__dirname + "\\Public\\file.csv", csv)

                            });


                        }
                    });
                    response.status(200).redirect('index.html');

                }
            });

        }

    });




});

app.post('/clicked', function(request, res) {
    // console.log("onclick");

    var file = 'file.csv';
    res.download(file);



});



app.listen(3000, function() {
    console.log("running server at PORT :- 3000 !");
});