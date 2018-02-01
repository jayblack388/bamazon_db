require('dotenv').config();
const Product = require("./classes/products");
const inquirer = require("inquirer");
const mysql = require("mysql");
const keys = require("./keys");
const pw = keys.password.pw;
const fs = require("fs");

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

    const testConnect = (optCallback = 0) => {
        con.connect((err)=>{
            if (err) throw err;
            console.log("connected as id " + con.threadId);
            if (optCallback) {
                optCallback()
            } else {
                con.end();
            }
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

    const recreateProduct = (id, name, depName, price, cost, quantity) => {
        let newProd = new Product(name, depName, price, cost, quantity);
        newProd.id = id;
        return newProd;
    }

    const seedDB = () => {
        fs.readFile("seeds.csv", "utf8", (err, data)=>{
            if (err) throw err;
            let dataArr = data.split(",");
            console.log(dataArr);
            let l = dataArr.length
            console.log(l);
            let newArr = [];
            
            for (let i = 0; i < l; i += 5) {
                let newProd = new Product(dataArr[i+0], dataArr[i+1], dataArr[i+2], dataArr[i+3], dataArr[i+4])
                newProd.id = generateUUID();
                newArr.push(newProd);
            }
            createElementDB(newArr);
        })
    }
//========================CRUD==============================//

    const createElementDB = (valueArr,  optCallback = 0) => {
        con.connect((err)=>{
            if (err) throw err;
            let sql = "INSERT INTO products (item_id, product_name, department_name, price, cost, stock_quantity) VALUES ?";
            con.query(sql, [valueArr], (err, res)=>{
                if (err) throw err;
                console.log(`Inserting a new product...\n`);
                console.log(res.affectedRows + " products added!")
                if (optCallback) {
                    optCallback()
                } else {
                    con.end();
                }
            });
        }); 
    };
    //========================Read==============================//

        const readElementByName = (input, optCallback = 0) => {
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
                            } else {
                                con.end();
                            }
                        })
                    } else {
                        console.log(`Name: ${res[0].product_name} || Price: ${res[0].price} ||ID: ${res[0].item_id}`);
                        con.end();
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
                console.log(`Name: ${res[0].product_name} || Price: ${res[0].price} || ID: ${res[0].item_id}`);
                con.end();
            })
        };

        const readElementByStock = (input) => {
            console.log(`Selecting products with quantity less than ${input}...\n`);
            let where = input;
            let sql = "SELECT * FROM products WHERE stock_quantity < ? ORDER BY stock_quantity DESC";
            sql = mysql.format(sql, where);
            con.query({sql}, (err, res)=>{
                if (err) throw err;
                for (let i = 0; i < res.length; i ++) {
                    console.log(`ID: ${res[i].item_id}\nName: ${res[i].product_name} || Price: ${res[i].price} || Cost ${res[i].cost} || QTY: ${res[i].stock_quantity}\n`);
                }
                con.end()
            })
        };

        const readAllElementsDB = (optCallback = 0) => {
            console.log("Selecting all products...\n");
            con.query("SELECT item_id, product_name, price FROM products", (err, res)=>{
                if (err) throw err;
                for (let i = 0; i < res.length; i ++) {
                    console.log(`Name: ${res[i].product_name} || Price: ${res[i].price} || ID: ${res[i].item_id}`);
                }
                con.end();
            })
        };

        const readAllElementsDBMan = (optCallback = 0) => {
            console.log("Selecting all products...\n");
            con.query("SELECT * FROM products", (err, res)=>{
                if (err) throw err;
                for (let i = 0; i < res.length; i ++) {
                    console.log(`ID: ${res[i].item_id}\nName: ${res[i].product_name} || Price: ${res[i].price} || Cost ${res[i].cost} || QTY: ${res[i].stock_quantity}\n`);
                }
                con.end();
            })
        };
    //========================Update==============================//

        const updateElementByName = (newName, oldName, optCallback = 0) => {
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
                    if (optCallback) {
                        optCallback()
                    } else {
                        con.end();
                    }
                })
            });
        };

        const updateElementById = (newName, id, optCallback = 0) => {
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
                    if (optCallback) {
                        optCallback()
                    } else {
                        con.end();
                    }
                })
            });
        };

        const updateElementQty = (newQty, id) => {
            let set = {stock_quantity: newQty};
            let where = {item_id: id};
            let sql = "UPDATE products SET ? WHERE ?";
            let inserts = [set, where];
            sql = mysql.format(sql, inserts);
            con.query({sql}, (err, res)=>{
                if (err) throw err;
                console.log(`Updating ${id}...\n`);
                con.end();
            })
        };


    const deleteElementDB = (inputId, optCallback = 0) => {
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
                    if (optCallback) {
                        optCallback()
                    } else {
                        con.end();
                    }
                } else {
                    console.log("Item ID not found");
                    con.end();
                }
            })
        });
    };

//========================Inquirer Prompts for CRUDing Products==============================//

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

    const createMultipleProducts = () => {
        inquirer.prompt([{
            type: "list",
            message: "How Many products Do you want to create?",
            name: "n",
            choices: ["1","2","3","5","10"]
        }]).then((res)=>{
            count = 0;
            userIn = parseInt(res.n);
            createProduct();
        })  
    }

//========================Customer Functions==============================//
    //Without question the ugliest function I've had to write
    const makePurchase = () => {
        inquirer.prompt([{
            type: "input",
            name: "purchaseId",
            message: "What do you want to buy?"
        }]).then ((response) => {
            con.connect((err)=>{
                if (err) throw err;
                console.log(`Selecting ${response.purchaseId}...\n`);
                let re = /^[a-zA-Z\s]*$/;
                let value;
                if (re.test(response.purchaseId)) {
                    value = {product_name: response.purchaseId};
                } else {
                    console.log("Please just use alphabetical characters.")
                }
                let sql = "SELECT * FROM products WHERE ?";
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
                        }]).then((childRes) => {
                            askQueryList(resArr, (input) => {
                                console.log(`Selecting ${input}...\n`);
                                let where = {item_id: input};
                                let sql = "SELECT * FROM products WHERE ?";
                                sql = mysql.format(sql, where);
                                con.query({sql}, (err, gCRes)=>{
                                    if (err) throw err;
                                    console.log(`Name: ${gCRes[0].product_name} || Price: ${gCRes[0].price} ||ID: ${gCRes[0].item_id}`);
                                    let newProd = recreateProduct(gCRes[0].item_id, gCRes[0].product_name, gCRes[0].department_name, gCRes[0].price, gCRes[0].cost, gCRes[0].stock_quantity);
                                    inquirer.prompt([{
                                        type: "input",
                                        name: "saleQty",
                                        message: "How many do you want to buy?",
                                        validate: (value)=> {
                                            if (isNaN(value) === false) {
                                                return true;
                                            } else {
                                                return "Enter Valid Quantity";
                                            }
                                        }  
                                    }]).then((saleRes)=>{
                                        let qty = parseInt(saleRes.saleQty);
                                        if (newProd.quantity > qty) {
                                            newProd.makeSale(qty);
                                            updateElementQty(newProd.quantity, newProd.id)
                                            console.log(saleRes.saleQty + " products purchased!")
                                            console.log(`Your price is $` + (newProd.price * qty));
                                        } else {
                                            console.log("Insufficient Stock")
                                            con.end();
                                        }
                                    })
                                })
                            })
                        })
                    } else {
                        console.log(`Name: ${res[0].product_name} || Price: ${res[0].price} ||ID: ${res[0].item_id}`);
                        let newProd = recreateProduct(res[0].item_id, res[0].product_name, res[0].department_name, res[0].price, res[0].cost, res[0].stock_quantity);
                        inquirer.prompt([{
                            type: "input",
                            name: "saleQty",
                            message: "How many do you want to buy?",
                            validate: (value)=> {
                                if (isNaN(value) === false) {
                                    return true;
                                } else {
                                    return "Enter Valid Quantity";
                                }
                            }  
                        }]).then((saleRes)=>{
                            let qty = parseInt(saleRes.saleQty);
                            if (newProd.quantity > qty) {
                                newProd.makeSale(qty);
                                updateElementQty(newProd.quantity, newProd.id)
                                console.log(saleRes.saleQty + " products purchased!");
                                console.log(`Your price is $` + (newProd.price * qty))
                            } else {
                                console.log("Insufficient Stock")
                            }
                        })
                    }
                })
            });
        })
    }

//========================Manager Functions==============================//

    const refillInventory = () => {
        inquirer.prompt([{
            type: "input",
            name: "purchaseId",
            message: "What do you want to add to the inventory?"
        }]).then ((response) => {
            con.connect((err)=>{
                if (err) throw err;
                console.log(`Selecting ${response.purchaseId}...\n`);
                let re = /^[a-zA-Z\s]*$/;
                let value;
                if (re.test(response.purchaseId)) {
                    value = {product_name: response.purchaseId};
                } else {
                    console.log("Please just use alphabetical characters.")
                }
                let sql = "SELECT * FROM products WHERE ?";
                con.query(sql, value, (err, res)=>{
                    if (err) throw err;
                    if (res.length > 1) {
                        let resArr = [];
                        for (let i = 0; i < res.length; i ++) {
                            console.log(`Name: ${res[i].product_name} || Cost: ${res[i].cost} || ID: ${res[i].item_id} || QTY: ${res[i].stock_quantity}`);
                            resArr.push(res[i].item_id);
                        }
                        inquirer.prompt([{
                            type: "confirm",
                            message: "Would you like to narrow that down with an ID search?",
                            name: "idConfirm"
                        }]).then((childRes) => {
                            askQueryList(resArr, (input) => {
                                console.log(`Selecting ${input}...\n`);
                                let where = {item_id: input};
                                let sql = "SELECT * FROM products WHERE ?";
                                sql = mysql.format(sql, where);
                                con.query({sql}, (err, gCRes)=>{
                                    if (err) throw err;
                                    console.log(`Name: ${gCRes[0].product_name} || Price: ${gCRes[0].price} || ID: ${gCRes[0].item_id} || QTY: ${gCRes[0].stock_quantity}`);
                                    let newProd = recreateProduct(gCRes[0].item_id, gCRes[0].product_name, gCRes[0].department_name, gCRes[0].price, gCRes[0].cost, gCRes[0].stock_quantity);
                                    inquirer.prompt([{
                                        type: "input",
                                        name: "saleQty",
                                        message: "How many do you want to buy?",
                                        validate: (value)=> {
                                            if (isNaN(value) === false) {
                                                return true;
                                            } else {
                                                return "Enter Valid Quantity";
                                            }
                                        }  
                                    }]).then((saleRes)=>{
                                        let qty = parseInt(saleRes.saleQty);
                                        newProd.refillStock(qty);
                                        updateElementQty(newProd.quantity, newProd.id)
                                        console.log(saleRes.saleQty + " products purchased!")
                                        console.log(`Purchase cost is $` + (newProd.cost * qty));
                                    })
                                })
                            })
                        })
                    } else {
                        console.log(`Name: ${res[0].product_name} || Cost: ${res[0].cost} || ID: ${res[0].item_id} || QTY ${res[0].stock_quantity}`);
                        let newProd = recreateProduct(res[0].item_id, res[0].product_name, res[0].department_name, res[0].price, res[0].cost, res[0].stock_quantity);
                        inquirer.prompt([{
                            type: "input",
                            name: "saleQty",
                            message: "How many do you want to buy?",
                            validate: (value)=> {
                                if (isNaN(value) === false) {
                                    return true;
                                } else {
                                    return "Enter Valid Quantity";
                                }
                            }  
                        }]).then((saleRes)=>{
                            let qty = parseInt(saleRes.saleQty);
                            newProd.refillStock(qty);
                            updateElementQty(newProd.quantity, newProd.id)
                            console.log(saleRes.saleQty + " products purchased!")
                            console.log(`Purchase cost is $` + (newProd.cost * qty));
                        })
                    }
                })
            });
        })
    }
//========================Test==============================//
// makePurchase();
// testConnect();
// createElementDB();
// readElementByName("Soap");
// readAllElementsDB();
// readElementById("0afcee86-ab44-4843-b0d2-2eca9d6b6752");
// updateElementByName("Playstation 4", "Playstation");
// updateElementById("Kindle", "9e3135df-7463-44c1-a75c-296b6734a614");
// deleteElementDB("9e3135df-7463-44c1-a75c-296b6734a614");



// createProduct();
// createMultipleProducts();

module.exports = {
    con, createElementDB, readElementByName, readElementById, readAllElementsDB, readAllElementsDBMan, updateElementByName, updateElementById, deleteElementDB, generateUUID, createProduct, createMultipleProducts, askQuery, makePurchase, readElementByStock, refillInventory
}