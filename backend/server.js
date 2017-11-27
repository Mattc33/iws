// Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express(); 

// Body Parser Middleware
app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({
    extended: true
}));

// CORS Middleware
app.use(function (req, res, next) {
    // Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

// DB connection
var conn = mysql.createConnection({
    server: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'carrier_info'
});

//Begin Listening
app.listen(5000);
console.log('server live');

/* 
QUERIES & ROUTING
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

// const
const tableName = 'carriers';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Select table
getTable = function(callback) {
    conn.query('SELECT * FROM ' +tableName+ ' ', (err,rows) => {
        if (err) {
            callback(err, null);
        } else {
            var toJSON = JSON.stringify(rows);
            callback(null, toJSON);
        }
    });
}

/* Select Table Callback */
var getTableData;
getTable(function(err, content) {
    if (err) {
        console.log(err);
        return next("Mysql error, check your query");
    } else {
        getTableData = content;
    }
});

// GET Routing
app.get('/', function (req, res) {
    res.send(getTableData);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Insert Row into Table
insertRow = function(name, address, phone_number, taxable, tier_number, two_digit_unique_code) {

    conn.query("INSERT INTO " + tableName + " (name, address, phone_number, taxable, tier_number, two_digit_unique_code) VALUES ('" 
    + name + "', '"
    + address + "', '" 
    + phone_number + "', '" 
    + taxable + "', '" 
    + tier_number + "', '" 
    + two_digit_unique_code +   "');" , (err,rows) => {
        if (err) {
            throw err;
        } else {
            return;
        }
    });
};

// POST Routing
app.post('/', function(req , res){
    var name = req.body.name;
    var address = req.body.address;
    var phone_number = req.body.phone_number;
    var taxable = req.body.taxable;
    var tier_number = req.body.tier_number;
    var two_digit_unique_code = req.body.two_digit_unique_code;

    console.log(name + address + phone_number + taxable + tier_number + two_digit_unique_code);

    insertRow(name, address, phone_number, taxable, tier_number, two_digit_unique_code);

    res.send(getTableData);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Update specific field in Table example1
updateTable = function(column, value, rowID) {
    conn.query( "UPDATE " + tableName + " SET " + column + " = '" + value + "' WHERE ID = " + rowID, (err,rows) => {
        if (err){
            throw err;
        } else{
            return;
        }
    });
};

// PUT Routing
app.put('/', function(req, res){
    var column = req.body.column;
    var value = req.body.value;
    var rowID = req.body.rowID;

    console.log(column + value + rowID);

    updateTable(column, value, rowID);

    res.send(getTableData);
});
