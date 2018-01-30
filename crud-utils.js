require('dotenv').config();
const keys = require("./keys");
const pw = keys.password.pw;
const mysql = require("mysql");
const Product = require("./classes/products");


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

const createElement = (values) => {
    console.log("Inserting a new product...\n");
	let sql = "INSERT INTO products ?? VALUES ??";
	let params = [item_id, product_name, department_name, price, cost, stock_quantity];
    let inserts = [[params], values];
	// sql = mysql.format(sql, inserts);
	con.query(sql, inserts, (err, res)=>{
        if (err) throw err;
        console.log(res.affectedRows + " products added!")
        con.end();
    })
}

const readElement = () => {
    console.log("Selecting all products...\n");
	con.query("SELECT * FROM products", (err, res)=>{
		if (err) throw err;
		console.log(res);
		con.end();
	})
}

const updateElement = () => {
    console.log("Updating all Rocky Road quantities...\n");
	let query = con.query(
		"UPDATE products SET ? WHERE ?",
		[{
			flavor: "Chocolate",
			price: 100,
			quantity: 25
		},{
			id: 1
		}], (err,res)=>{
			console.log(res.affectedRows + " products updated!")
			deleteProduct();
		}
	);
	console.log(query.sql);
}

const deleteElement = () => {
    console.log("Updating all strawberry icecream...\n");
	con.query(
		"DELETE FROM products WHERE ?",
		{
			flavor: "strawberry"
		},
		(err, res)=>{
			console.log(res.affectedRows + " products deleted!")
		}
	)
}

//========================Test==============================//
// let params = [item_id, product_name, department_name, price, cost, stock_quantity];
let vals = [[1, "Soap", "Bath", 4, 1, 1000],[2, "Toothpaste", "Bath", 6, 2, 10000],[3, "Shampoo", "Bath", 12, 3, 100]]
createElement(vals);