const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const {pool, getDBJSON, postIMG} = require("./db.js")
const multer = require("multer")

const app = express();
const port = 3000;

const cors=require("cors");
const { request } = require('http');
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

let posted_imgs = []

app.use(cors(corsOptions)) // Use this after the variable declaration

// Parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("/"))
// Serve static files (including the model files)
app.use("/public", express.static(path.join(__dirname, 'public')))
app.use("/saved_model", express.static(path.join(__dirname, 'saved_model')));

const storage = multer.memoryStorage();
const upload = multer({ dest: __dirname + '/public/upload/', storage:storage }); 

app.get('/data/', function (req, res) {
  getDBJSON(pool)
        .then((data) => {
            res.header("Content-Type", 'application/json');
            res.send(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
})

app.post("/public/upload/", upload.single("img_data"), function(req, res) {
  const buf_blob = Buffer.from(req.file.buffer)
  let sql_data = {"label": req.body.label, "img_data": buf_blob}
  postIMG(pool, sql_data)
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
