const express = require('express'); 
const multer = require('multer');
const path = require('path');
const csv = require('csvtojson'); 

const app = express(); 
const port = 3000;
let gjson = [];

// CORS Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Storage Engine
// multer takes 2 args, destination and the file name fn
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
function processCSV(fileName) {
    const csvFilePath='/Users/m.chan/workspace/iws/backend/public/uploads/' + fileName;   
    console.log(csvFilePath);

    csv()
        .fromFile(csvFilePath)
        .on('json',( json, rowIndex ) => {
            console.log( json );
            gjson = json;
            for( i=0; i<rowIndex.length; i++ ){
                sendAsRes( gjson );
            }
        })
        .on('done',( error ) => {
            console.log( error );
        })
}

function sendAsRes() {
    app.get('/json/', (req, res) => {
        res.send(gjson);
    });
}

sendAsRes();

// Start the node server
app.listen(port, () => 
    console.log(`Server started on port ${port}`)
);
