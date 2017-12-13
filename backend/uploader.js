const express = require('express'); 
const multer = require('multer');
const path = require('path');
const csv = require('csvtojson'); 
const mysql = require("mysql");

const app = express(); 
const port = 3000;

// CORS Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Storage Engine
// multer takes 2 args, destination and the file name fn
// multer tut -> https://www.youtube.com/watch?v=9Qzmri1WaaE
const storage = multer.diskStorage({
    destination: './public/uploads/',
    // Which takes args in the request, file, and callback
    // The file has the fieldname(name of input), timestamp, and the extention concatenated.
    filename: function(req, file, cb){ 
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload, call storage which is = storage
// .single => single file, then you pass it the input name
const upload = multer({
    storage: storage
}).single('csv');

// Public folder
app.use(express.static('./public'));

// Routes
app.post('/public/uploads', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.send('error: ' + err)
        } else {
            let fileName = req.file.filename;
            console.log(fileName);
            let processedJSON = processCSV(fileName);
            res.send('upload completed');
        }
    });
});

// Method takes in the fileName as a param, and converts the csv file to JSON format saved on disk
function processCSV(fileName, carrier, level) {
    const csvFilePath = '/Users/m.chan/workspace/iws/backend/public/uploads/' + fileName; /* log => */ console.log(csvFilePath);
    let innerArray = [];
    let nestedArray = [];

    // https://www.npmjs.com/package/csvtojson#parameters
    csv({
        noheader: true,
        trim: true,
        workerNum: 4,
    })
        .fromFile(csvFilePath)
        .on('json',( jsonObj ) => {

            let carrier = 'carrier';
            innerArray.push(carrier);

            let level = 'level';
            innerArray.push(level);

            let prefix = jsonObj.field2;
            innerArray.push(prefix);

            let buy_rate = jsonObj.field3;
            buy_rate = buy_rate.replace(/\$/g, '');
            innerArray.push(buy_rate);

            let sell_rate = jsonObj.field3;
            sell_rate = sell_rate.replace(/\$/g, '');
            innerArray.push(sell_rate);
        })
        .on('done',( err ) => {
            // turn array into a nested array in this loop
            for (var i = 0; i < innerArray.length; i+=5) {
                // Adds i and i+1-4 as a new array to the result array
                nestedArray.push([innerArray[i], innerArray[i+1], innerArray[i+2], innerArray[i+3], innerArray[i+4]]);
            }

            // splice first 3 arrays in nestedArray that contains header info
            nestedArray.splice(0,3);
            console.log(nestedArray);

            // trigger method to insert nestedArray into SQL
            insertNestedArray(nestedArray);
            // trigger method to upload sell_rate column by 5%
            updateSellRate(1.05);
        });
}

// DB Conn
let conn = mysql.createConnection({
    server: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'TEST_iws'
});

//SQL
const table = 'raw_rate_cards';

function insertNestedArray(nestedArray) {
    let sql = `INSERT INTO ${table} (carrier_name, level_name, prefix, buy_rate, sell_rate) VALUES ?`;
    let query = conn.query(sql, [nestedArray], function(err)  {
        if(err) throw err;
    });
}

function updateSellRate(percentInc) {
    let sql = `UPDATE ${table} SET sell_rate=sell_rate*${percentInc}`;
    let query = conn.query(sql, (err, result) => {
        if(err) throw err;
    });
}

// Start the node server
app.listen(port, () => 
    console.log(`Uploader Server started on port ${port}`)
);
