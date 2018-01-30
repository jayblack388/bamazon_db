require('dotenv').config();
const keys = require("../keys");
const pw = keys.password.pw;
const mysql = require("mysql");
const Product = require("../classes/products");


const con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: pw,
	database: "bamazon"
});

const testConnect = () => {
	con.connect((err)=>{
		if (err) throw err;
		console.log("connected as id " + con.threadId);
		con.end();
	});
};

const dbInsert = (arr) => {
    con.connect((err)=> {
      if (err) throw err;
      console.log("Connected!");
      let sql = "INSERT INTO products (item_id, product_name, department_name, price, cost, stock_quantity, sale) VALUES ?";
      con.query(sql, [arr], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        con.end();
      });
    });
};

const dbDisplayAll = () => {
    con.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let newProd = new Product(res[i].product_name, res[i].department_name, res[i].price, res[i].cost, res[i].stock_quantity)
            newProd.id = res[i].item_id;
            console.log(`ID: ${res[i].item_id} \nProduct Name: ${res[i].product_name} \nDepartment Name: ${res[i].department_name} \nPrice: $${res[i].price}`);
            console.log("======================");
        }
        con.end();
    })
};

const dbReadAll = () => {
    con.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let newProd = new Product(res[i].product_name, res[i].department_name, res[i].price, res[i].cost, res[i].stock_quantity);
            newProd.id = res[i].item_id;
            console.log(newProd);
        }
        con.end();
    })
};

module.exports = {con, testConnect, dbInsert, dbReadAll, dbDisplayAll};