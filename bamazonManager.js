const {con, createElementDB, readElementByName, readElementById, readAllElementsDBMan, updateElementByName, updateElementById, deleteElementDB, generateUUID, createProduct, seedDB, askQuery, makePurchase, readElementByStock, refillInventory} = require("./utils");
const inquirer = require("inquirer");
let choiceArray = [
    "See All Products for Sale", 
    "View Low Inventory", 
    "Search by Name", 
    "Add to Inventory",
    "Add New Product(s)"
]
// testConnect();
const managerProg = () => {
    console.log("Welcome to Bamazon Manager's Suite");
    inquirer.prompt([{
            type: "list",
            name: "command",
            message: "What command do you want to use?",
            choices: choiceArray
    }]).then((input) => {
        switch (input.command) {
            case "See All Products for Sale":
                readAllElementsDBMan();
                break;
            case "View Low Inventory":
                inquirer.prompt([{
                    type: "input",
                    name: "limit",
                    message: "What stock minimum are you looking for?",
                    validate: (value)=> {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return "Enter Valid Quantity";
                        }
                    }
                }]).then((res)=>{
                    readElementByStock(res.limit);
                })
                break;
            case "Search by Name":
                askQuery(readElementByName);
                break;
            case "Add to Inventory":
                refillInventory();
                break;
            case "Add New Product(s)":
                seedDB();
                break;
            default:
                console.log("Invalid Request");
        };
    })
}
// managerProg();

module.exports = managerProg