const Product = require("../classes/products");
const inquirer = require("inquirer");
const mysql = require("mysql");
const dbInsert = require("./db-utils");

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

//========================Variables for DB==============================//
    let values = [];
    let count;
    let userIn;

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
            arr.push(newProduct.id, newProduct.name, newProduct.depName, newProduct.price, newProduct.cost, newProduct.quantity, newProduct.sale);
            values.push(arr);
            count++;
            console.log("======================");
            createProduct();
        });
    }
    else {
        console.log("Products added");
        dbInsert(values);
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

// createProduct();
//seedDB();



module.exports = {generateUUID, createProduct, seedDB}