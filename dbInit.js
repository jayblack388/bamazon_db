var mysql = require('mysql');
require('dotenv').config();
const keys = require("./keys");
const pw = keys.password.pw;
const fs = require("fs");
const Product = require("./classes/products");
const {generateUUID, createElementDB} = require("./utils")

let con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: pw
});
const initDB = () => {
    con.connect((err)=> {
        if (err) throw err;
        console.log("Connected!");
        con.query("CREATE DATABASE bamazon", (err, result)=> {
            if (err) throw err;
            console.log("Database created");
        }); 
        pickDB(); 
    });
}
const pickDB = () => {
    con = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: pw,
        database: "bamazon"
    });
    initTable();
}
const initTable = () => {
    var sql = "CREATE TABLE products (item_id VARCHAR(36) NOT NULL, product_name VARCHAR(100) NOT NULL, department_name VARCHAR(50) NOT NULL, price DECIMAL(8,2) NOT NULL, cost DECIMAL(8,2) NOT NULL, stock_quantity INTEGER(10) NOT NULL, PRIMARY KEY (item_id))";
    con.query(sql, (err, result)=> {
        if (err) throw err;
        console.log("Table created");
        seedDB();
    });
}
const seedDB = () => {
    fs.readFile("seeds.csv", "utf8", (err, data)=>{
        if (err) throw err;
        let dataArr = data.split(",");
        // console.log(dataArr);
        let l = dataArr.length
        // console.log(l);
        let values = [];
        for (let i = 0; i < l; i += 5) {
            let newProd = new Product(dataArr[i+0], dataArr[i+1], parseInt(dataArr[i+2]), parseInt(dataArr[i+3]), parseInt(dataArr[i+4]))
            newProd.id = generateUUID();
            let newArr = []
            newArr.push(newProd.id, newProd.name, newProd.depName, newProd.price, newProd.cost, newProd.quantity);
            values.push(newArr)
        }
        let sql = "INSERT INTO products (item_id, product_name, department_name, price, cost, stock_quantity) VALUES ?";
        con.query(sql, [values], (err, res)=>{
            if (err) throw err;
            console.log(`Inserting a new product...\n`);
            console.log(res.affectedRows + " products added!")
            con.end();
        });
    })
}
initDB();