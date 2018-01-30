const {con, testConnect, dbReadAll, dbDisplayAll} = require("./utils/db-utils");
const inquirer = require("inquirer");

// testConnect();
const customerProg = () => {
    
    inquirer.prompt([{
        type: "input",
        name: "prodSearch",
        message: "What products would you like to search?"
    },{
        type: "input",
        name: "quantity",
        message: "How many would you like to buy?",
        validate: ""
    }]).then((res)=>{
        con.query("SELECT * FROM products WHERE product_name = ?", [res.prodSearch] , (err, res) => {
            if (err) throw err;
            let newProd = new Product(res[i].product_name, res[i].department_name, res[i].price, res[i].cost, res[i].stock_quantity);
            con.end();
            console.log(products)
        })
    })
}
const products = [];
dbDisplayAll();
// customerProg();