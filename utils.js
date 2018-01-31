require('dotenv').config();
const Product = require("./classes/products");
const inquirer = require("inquirer");
const mysql = require("mysql");
const keys = require("./keys");
const pw = keys.password.pw;

//========================Server Variables==============================//
    let values = [];
    let count;
    let userIn;
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
//========================General Utils==============================//

    const generateUUID = () => { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };

    const askQuery = (callback) => {
        inquirer.prompt([
            {
                type: "input",
                name: "query",
                message: "What do you want to search?"
            }
        ]).then((input) => {
            callback(input.query);
        })
    }

    const askQueryList = (listChoices, callback) => {
        inquirer.prompt([
            {
                type: "list",
                name: "query",
                message: "Which do you want to search?",
                choices: listChoices
            }
        ]).then((input) => {
            callback(input.query);
        })
    }

//========================CRUD==============================//

    const createElementDB = (valueArr) => {
        con.connect((err)=>{
            if (err) throw err;
            let sql = "INSERT INTO products (item_id, product_name, department_name, price, cost, stock_quantity) VALUES ?";
            con.query(sql, [valueArr], (err, res)=>{
                if (err) throw err;
                console.log(`Inserting a new product...\n`);
                console.log(res.affectedRows + " products added!")
                con.end();
            });
        }); 
    };
    //========================Read==============================//

        const readElementByName = (input) => {
            con.connect((err)=>{
                if (err) throw err;
                console.log(`Selecting ${input}...\n`);
                let re = /^[a-zA-Z\s]*$/;
                let value;
                if (re.test(input)) {
                    value = {product_name: input};
                } else {
                    console.log("Please just use alphabetical characters.")
                }
                let sql = "SELECT item_id, product_name, price FROM products WHERE ?";
                con.query(sql, value, (err, res)=>{
                    if (err) throw err;
                    if (res.length > 1) {
                        let resArr = [];
                        for (let i = 0; i < res.length; i ++) {
                            console.log(`Name: ${res[i].product_name} || Price: ${res[i].price} ||ID: ${res[i].item_id}`);
                            resArr.push(res[i].item_id);
                        }
                        inquirer.prompt([{
                            type: "confirm",
                            message: "Would you like to narrow that down with an ID search?",
                            name: "idConfirm"
                        }]).then((input)=>{
                            if (input.idConfirm) {
                                askQueryList(resArr, readElementById);
                            }else {
                                con.end();
                            }
                        })
                    } else {
                        console.log(`Name: ${res[0].product_name} || Price: ${res[0].price} ||ID: ${res[0].item_id}`);

                    }
                })
            });
        };

        const readElementById = (input) => {
                console.log(`Selecting ${input}...\n`);
                let where = {item_id: input};
                let sql = "SELECT item_id, product_name, price FROM products WHERE ?";
                sql = mysql.format(sql, where);
                con.query({sql}, (err, res)=>{
                    if (err) throw err;
                    console.log(`Name: ${res[0].product_name} || Price: ${res[0].price} ||ID: ${res[0].item_id}`);
                    con.end();
                })
        };

        const readAllElementsDB = () => {
            con.connect((err)=>{
                if (err) throw err;
                console.log("Selecting all products...\n");
                con.query("SELECT item_id, product_name, price FROM products", (err, res)=>{
                    if (err) throw err;
                    for (let i = 0; i < res.length; i ++) {
                        console.log(`Name: ${res[i].product_name} || Price: ${res[i].price} ||ID: ${res[i].item_id}`);
                    }
                    con.end();
                })
            });
        };
    //========================Update==============================//

        const updateElementByName = (newName, oldName) => {
            con.connect((err)=>{
                if (err) throw err;
                let set = {product_name:newName};
                let where = {product_name: oldName};
                let sql = "UPDATE products SET ? WHERE ?";
                let inserts = [set, where];
                sql = mysql.format(sql, inserts);
                con.query({sql}, (err, res)=>{
                    if (err) throw err;
                    console.log(`Updating ${oldName}...\n`);
                    console.log(res.affectedRows + " products updated!")
                    con.end();
                })
            });
        };

        const updateElementById = (newName, id) => {
            con.connect((err)=>{
                if (err) throw err;
                let set = {product_name: newName};
                let where = {item_id: id};
                let sql = "UPDATE products SET ? WHERE ?";
                let inserts = [set, where];
                sql = mysql.format(sql, inserts);
                con.query({sql}, (err, res)=>{
                    if (err) throw err;
                    console.log(`Updating ${id}...\n`);
                    console.log(res.affectedRows + " products updated!")
                    con.end();
                })
            });
        };
        

    const deleteElementDB = (inputId) => {
        con.connect((err)=>{
            if (err) throw err;
            let sql = "DELETE FROM products WHERE ?";
            let where = {item_id: inputId};
            sql = mysql.format(sql, where);
            con.query({sql}, (err, res)=>{  
                if (err) throw err;
                if (res.affectedRows > 0) {
                    console.log(`Deleting ${inputId}\n`);
                    console.log(res.affectedRows + " products deleted!")
                    con.end();
                } else {
                    console.log("Item ID not found");
                    con.end();
                }
            })
        });
    };

//========================Inquirer Prompts for CRUDing Products==============================//
    const makePurchase = () => {

    }

    const createProduct = () => {
        if (count < userIn) {
            inquirer.prompt([{
                type: "input",
                name: "name",
                message: "Enter Product Name"
            },{
                type: "list",
                name: "depName",
                message: "Choose Department",
                choices: ["Home", "Bath", "Electronics", "Movies"]
            },{
                type: "input",
                name: "price",
                message: "Enter Price",
                validate: (value)=> {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return "Enter Valid Price";
                    }
                } 
            },{
                type: "input",
                name: "cost",
                message: "Enter Store Cost",
                validate: (value)=> {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return "Enter Valid Cost";
                    }
                } 
            },{
                type: "input",
                name: "quantity",
                message: "Enter Quantity",
                validate: (value)=> {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return "Enter Valid Quantity";
                    }
                } 
            }]).then((response)=>{
                let arr = [];
                let newProduct = new Product(response.name, response.depName, parseInt(response.price), parseInt(response.cost), parseInt(response.quantity))
                newProduct.id = generateUUID();
                arr.push(newProduct.id, newProduct.name, newProduct.depName, newProduct.price, newProduct.cost, newProduct.quantity);
                values.push(arr);
                count++;
                console.log("======================");
                createProduct();
            });
        }
        else {
            console.log("Products added");
            createElementDB(values);
        }
    };

    const seedDB = () => {
        inquirer.prompt([{
            type: "list",
            message: "How Many Seeds Do you want to create?",
            name: "n",
            choices: ["1","2","3","5","10"]
        }]).then((res)=>{
            count = 0;
            userIn = parseInt(res.n);
            createProduct();
        })  
    }

//========================Test==============================//


// createElementDB();
// readElementByName("Soap");
// readAllElementsDB();
// readElementById("0afcee86-ab44-4843-b0d2-2eca9d6b6752");
// updateElementByName("Playstation 4", "Playstation");
// updateElementById("Kindle", "9e3135df-7463-44c1-a75c-296b6734a614");
// deleteElementDB("9e3135df-7463-44c1-a75c-296b6734a614");



// createProduct();
// seedDB();

module.exports = {
    con, createElementDB, readElementByName, readElementById, readAllElementsDB, updateElementByName, updateElementById, deleteElementDB, generateUUID, createProduct, seedDB, askQuery, makePurchase
}