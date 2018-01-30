require('dotenv').config();
const keys = require("./keys");
const mysql = require("mysql");
const pw = keys.password.pw;
const inquirer = require("inquirer");



let con = mysql.createConnection({
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
testConnect();

module.exports = con