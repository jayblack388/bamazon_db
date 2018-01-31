const {con, createElementDB, readElementByName, readElementById, readAllElementsDB, updateElementByName, updateElementById, deleteElementDB, generateUUID, createProduct, seedDB, askQuery, makePurchase} = require("./utils");
const inquirer = require("inquirer");
let choiceArray = [
    "Read Whole Database", 
    "Search by Id", 
    "Search by Name", 
    "Make Purchase"
]
// testConnect();
const customerProg = () => {
    console.log("Welcome to Bamazon");
    inquirer.prompt([{
            type: "list",
            name: "command",
            message: "What command do you want to use?",
            choices: choiceArray
    }]).then((input) => {
        switch (input.command) {
            case "Read Whole Database":
                readAllElementsDB(customerProg);
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
customerProg();


/*     {
        type: "input",
        name: "quantity",
        message: "How many would you like to buy?",
        validate: ""
    } 
    readAllElementsDB();
    inquirer.prompt([{
        type: "input",
        name: "prodSearch",
        message: "What products would you like to search?"
    }]).then((res)=>{
        readElementByName(res.prodSearch);
    })
}
*/