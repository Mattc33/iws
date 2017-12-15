// Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");

const app = express(); 

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// CORS Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// DB connection
let conn = mysql.createConnection({
    server: 'localhost',
    port: '3306',
    user: 'root',
    password: '123',
    database: 'raw_rate_card_db'
});

//Begin Listening
app.listen('5000', () => {
    console.log('server live on http://localhost:5000');
});


/* 
ROUTING
*/

// const
const tableName = 'carrier';

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
    let sql = `INSERT INTO ${tableName} (carrier_name, email, address, phone_number, taxable, tier_number, two_digit_unique_code) VALUES 
    ('${req.body.name}', '${req.body.email}', '${req.body.address}', '${req.body.phone_number}', '${req.body.taxable}', '${req.body.tier_number}', '${req.body.two_digit_unique_code}')`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(req.body.name);
        console.log(results);
        res.send('row inserted');
    }); 
});

// DELETE Routing => delete row by ID
app.delete('/deleterow/', (req, res) => {
    let sql = `DELETE FROM ${tableName} WHERE id = '${req.body.id}'`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(req.body.id);
        console.log(results);
        res.send('row deleted');
    }); 
});

// PUT Routing => update specific item in table
app.put('/updateitem/', (req, res) => {
    let sql = `UPDATE ${tableName} SET ${req.body.column} = '${req.body.value}' WHERE id = '${req.body.id}'`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('item updated');
    }); 
});
