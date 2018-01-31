const customerProg = require("./bamazonCustomer");
const managerProg = require("./bamazonManager");
const inquirer = require("inquirer")



const app = () => {
    console.log("Welcome to Bamazon");
    inquirer.prompt([{
            type: "list",
            name: "login",
            message: "How do you want to log in?",
            choices: ["User", "Admin"]
    }]).then((input) => {
        switch (input.login) {
            case "User":
                inquirer.prompt([{
                    type: "input",
                    name: "name",
                    message: "What is your username?"
                }]).then((res)=>{
                    customerProg(res.name)
                })
                break;
            case "Admin":
                managerProg();
                break;
            default:
                console.log("Invalid Request");
        };
    })
}
app();