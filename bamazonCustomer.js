const {con, createElementDB, readElementByName, readElementById, readAllElementsDB, updateElementByName, updateElementById, deleteElementDB, generateUUID, createProduct, createMultipleProducts, askQuery, makePurchase} = require("./utils");
const inquirer = require("inquirer");
let choiceArray = [
    "See All Products for Sale", 
    "Search by Id", 
    "Search by Name", 
    "Make Purchase"
]
// testConnect();
const customerProg = (userId) => {
    console.log(`Welcome to Bamazon ${userId}`);
    inquirer.prompt([{
            type: "list",
            name: "command",
            message: "What command do you want to use?",
            choices: choiceArray
    }]).then((input) => {
        switch (input.command) {
            case "See All Products for Sale":
                readAllElementsDB();
                break;
            case "Search by Id":
                askQuery(readElementById);
                break;
            case "Search by Name":
                askQuery(readElementByName);
                break;
            case "Make Purchase":
                makePurchase();
                break;
            default:
                console.log("Invalid Request");
        };
    })
}
// customerProg();

module.exports = customerProg