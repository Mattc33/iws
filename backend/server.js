// Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");

const app = express(); 

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
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
    port: '8889',
    user: 'root',
    password: 'root',
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
app.get('/api/carrier/gettabledata/', (req, res) => {
    let sql = 'SELECT * FROM ' + tableName;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    }); 
});

// POST Routing => insert row
app.post('/api/carrier/insertrow/', (req, res) => {
    let sql = `INSERT INTO ${tableName} (carrier_name, email, address, phone_number, taxable, tier_number, two_digit_unique_code) VALUES 
    ('${req.body.name}', '${req.body.email}', '${req.body.address}', '${req.body.phone}', '${req.body.taxable}', '${req.body.tier}', '${req.body.code}')`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(req.body.name);
        console.log(results);
        res.send('row inserted');
    }); 
});

// DELETE Routing => delete row by ID
app.put('/api/carrier/deleterow/', (req, res) => {
    let sql = `DELETE FROM ${tableName} WHERE carrier_id = '${req.body.id}'`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(req.body.id);
        console.log(results);
        res.send('row deleted');
    }); 
});

// PUT Routing => update specific item in table
app.put('/api/carrier/updateitem/', (req, res) => {
    let sql = `UPDATE ${tableName} SET carrier_name = '${req.body.name}', email = '$(req.body.email)' WHERE carrier_id = $(req.body.carrier_id)`;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('item updated');
    }); 
});
