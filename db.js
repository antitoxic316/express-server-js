const mysql = require("mysql2");
const path = require("path");
const fs = require("fs")
require("dotenv").config({ path: path.join(__dirname, './.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

async function getDBJSON(pool){
    let sql = "SELECT * from images"

    return pool.query(sql)
        .then(([rows, fields]) => {
            return JSON.stringify(rows);
        })
        .catch((err) => {
            throw err; // Rethrow the error for handling in the calling function
        });
}

async function postIMG(pool, data){
    let sql = "INSERT INTO images SET?"

    pool.query(sql, data, (err, res, fields) => {
        
        if(err) throw err;
    })
}

module.exports = {
    "pool": pool.promise(),
    "getDBJSON": getDBJSON,
    "postIMG": postIMG
}