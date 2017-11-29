// Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express(); 

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
let conn = mysql.createConnection({
    server: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'carrier_info'
});

//Begin Listening
app.listen('5000', () => {
    console.log('server live on http://localhost:5000');
});

/* 
ROUTING
*/

// const
const tableName = 'carriers';

// GET Routing => select whole table
app.get('/gettabledata/', (req, res) => {
    let sql = 'SELECT * FROM ' + tableName;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    }); 
});

// POST Routing => insert row
app.post('/insertrow/', (req, res) => {
    let sql = `INSERT INTO ${tableName} (name, address, phone_number, taxable, tier_number, two_digit_unique_code) VALUES ('${req.body.name}', '${req.body.address}', '${req.body.phone_number}', '${req.body.taxable}', '${req.body.tier_number}', '${req.body.two_digit_unique_code}')`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('row inserted');
    }); 
});

// DELETE Routing => delete row by ID
app.delete('/deleterow/', (req, res) => {
    let sql = `DELETE FROM ${tableName} WHERE id = '${req.body.id}'`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('row deleted');
    }); 
});

// PUT Routing => update specific item in table
app.put('/updateitem/', (req, res) => {
    let sql = `UPDATE ${tableName} SET ${req.body.column} = '${req.body.value}' WHERE id = '${req.body.rowID}'`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('item updated');
    }); 
});