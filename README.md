# bamazon_db
MYSQL database Homework

This program manipulates a database, letting you search by name or id, update elements within the database, or add items to the database.

Given additional time, I feel I could create the additional table and get the departments working with overhead cost and profits. I would really like to figure out how to make/maniputate some of these functions so that they could be alterred on the fly instead of having to be re-written with custom changes.

This program was useful for me because it helped show how much easier this whole process would be with a library to more easily manipulate the database.



//=============User Instructions===========//
  Install the package with `npm install`
  To get started run "bamazon schema.sql" in a sql editor like MySQL Workbench
  in order to create the database and table the app will use. Then use `node app.js`.
  You will be given 2 selections Manager and Customer:
 Manager Mode {
   "See All Products for Sale": Show's all products available for sale, showing their item id, name, price, cost, and quantity and breaks a line for easier reading.

   "View Low Inventory": Asks the user what the limit they want to set for their search of low inventory items, and then displays all items meeting the condition.

   "Search by Name": Takes a user input and finds and displays all records with the matching name. The user input is limited to letters and spaces using a test against a regular expression. If there are multiple records, it asks the user if they want to continue the search, listing the ids in the same order in an inquirer list that the user can then select from.

   "Add to Inventory": Basically uses a modified version of the above name search function. It isolates an item by id and then creates a `Product` object using the paramters from the id search. The user is then prompted to choose how much they want to add to the database (this number is validated in the inquirer prompt). This object then uses its refillStock method to add the user input to its quantity and then updates the database using it's unique id. It will also send the cost of this purchase to the user (planned to use for supervisor mode and manipulating the arbitrary overhead)

   "Add New Product(s)": Uses a function to ask the user how many products the user would like to add. It uses a list to limit the recursion to 10 or less, but could easily be a validated number input if the user wanted to add more products. The user is then asked to input product name, department name (list of 4), price, cost and quantity (the last 3 are validated number inputs). The response data is then used to create a new `Product` object, a unique id (explained more below) is created and attached to the object and then the object is pushed to an array. The recursion counter (set by the user's first input) increments and continues creating objects until it completes the recursion. The array is then passed to a function that creates each item into the database.
 }
 Customer Mode {
   "See All Products for Sale": Show's all products available for sale, showing their item name, price, and id.

   "Search by Id": Searches for exact matches of id's. (With the id's being as long as they are, this isn't super useful)

   "Search by Name": Takes a user input and finds and displays all records with the matching name. The user input is limited to letters and spaces using a test against a regular expression. If there are multiple records, it asks the user if they want to continue the search, listing the ids in the same order in an inquirer list that the user can then select from.
   
   "Make Purchase": Basically uses a modified version of the above name search function. It isolates an item by id and then creates a `Product` object using the paramters from the id search. The user is then prompted to choose how much they want to purchase (this number is validated in the inquirer prompt). This object then uses its makeSale method to subtract the user input to its quantity and then updates the database using it's unique id. It will also send the cost of this purchase to the user (planned to use for supervisor mode and manipulating the product's/department's sales)
 
 }

#Unique ID function--->
This is a function I found through a search of stack overflow. I wanted to give each item a unique id instead of an auto incrementing the id value. This seemed like a good solution (though I don't totally understand everything happening in the function). This did end up making the id's look a bit ugly, but they are generated in a way that they will always be unique. The first thing the function does is create a variable with the current time `d`. It then checks if performance and performance.now are available. Performance.now uses several API's to create a high resolution time object representing the time between the `time origin` and now. The `time origin` is determined a number of ways, but I don't believe it is available through node without additional packages. The function then returns a string of 36 characters (32 characters; 1 "y", 1 "4", and 30 "x"s; seperated by 4 "-"s). As this string is being returned, the replace method is called on all x's and y's in the string (using a regular expression to just select x and y). The replacement characters come from a function called back as part of the replace method. (This is where my understanding gets a little shaky) Variable `r` is then created by adding the date to a random number that is multiplied by 16 and then modulus(ed) by 16 (I believe this gives r a hexidecimal). Variable `d` is then divided by 16 and rounded down. The function then uses a ternary operator to replace any x's with `r` and replaces y with a hexidecimal, and then the whole string is set to a string of 16 hexidecimals, all unique and mostly random. I copied the function in it's entirety including the Public Domain/MIT statement (I hope this is the right way to cite it).


This program was written by John Blackwell, for an homework assignment for U of R Web Development Bootcamp.








======================HW Instructions======================
  ======================Directions======================
    # Node.js & MySQL

    ## Overview

    In this activity, you'll be creating an Amazon-like storefront with the MySQL skills you learned this week. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can program your app to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.

    Make sure you save and require the MySQL and Inquirer npm packages in your homework files--your app will need them for data input and storage.

    ## Submission Guide

    Make sure you use the normal GitHub. Because this is a CLI App, there will be no need to deploy it to Heroku. This time, though, you need to include screenshots, a gif, and/or a video showing us that you got the app working with no bugs. You can include these screenshots or a link to a video in a `README.md` file.

    * Include screenshots (or a video) of typical user flows through your application (for the customer and if relevant the manager/supervisor). This includes views of the prompts and the responses after their selection (for the different selection options).

    * Include any other screenshots you deem necessary to help someone who has never been introduced to your application understand the purpose and function of it. This is how you will communicate to potential employers/other developers in the future what you built and why, and to show how it works. 

    * Because screenshots (and well-written READMEs) are extremely important in the context of GitHub, this will be part of the grading.

    If you haven't written a markdown file yet, [click here for a rundown](https://guides.github.com/features/mastering-markdown/), or just take a look at the raw file of these instructions.

    ## Instructions
    ======================Complete======================

      ### Challenge #1: Customer View (Minimum Requirement)

      1. Create a MySQL Database called `bamazon`.

      2. Then create a Table inside of that database called `products`.

      3. The products table should have each of the following columns:

        * item_id (unique id for each product)

        * product_name (Name of product)

        * department_name

        * price (cost to customer)

        * stock_quantity (how much of the product is available in stores)

      4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

      5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

      6. The app should then prompt users with two messages.

        * The first should ask them the ID of the product they would like to buy.
        * The second message should ask how many units of the product they would like to buy.

      7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

        * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

      8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
        * This means updating the SQL database to reflect the remaining quantity.
        * Once the update goes through, show the customer the total cost of their purchase.

  ======================Bonus======================

    - - -

    * If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.

    - - -

    ### Challenge #2: Manager View (Next Level)

    * Create a new Node application called `bamazonManager.js`. Running this application will:

      * List a set of menu options:

        * View Products for Sale

        * View Low Inventory

        * Add to Inventory

        * Add New Product

      * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

      * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

      * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

      * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

    - - -

    * If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.

    - - -

    ### Challenge #3: Supervisor View (Final Level)

    1. Create a new MySQL table called `departments`. Your table should include the following columns:

      * department_id

      * department_name

      * over_head_costs (A dummy number you set for each department)

    2. Modify the products table so that there's a product_sales column and modify the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale.

    3. Modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

      * Make sure your app still updates the inventory listed in the `products` column.

    4. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

      * View Product Sales by Department

      * Create New Department

    5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

    | department_id | department_name | over_head_costs | product_sales | total_profit |
    | ------------- | --------------- | --------------- | ------------- | ------------ |
    | 01            | Electronics     | 10000           | 20000         | 10000        |
    | 02            | Clothing        | 60000           | 100000        | 40000        |

    6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

    7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

      * Hint: You may need to look into aliases in MySQL.

      * Hint: You may need to look into GROUP BYs.

      * Hint: You may need to look into JOINS.

      * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

    - - -
    
  ======================Minimum Requirements======================

    Attempt to complete homework assignment as described in instructions. If unable to complete certain portions, please pseudocode these portions to describe what remains to be completed.

    - - -

    ### Create a README.md

    Add a `README.md` to your repository describing the project. Here are some resources for creating your `README.md`. Here are some resources to help you along the way:

    * [About READMEs](https://help.github.com/articles/about-readmes/)

    * [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

    - - -

    ### Add To Your Portfolio

    After completing the homework please add the piece to your portfolio. Make sure to add a link to your updated portfolio in the comments section of your homework so the TAs can easily ensure you completed this step when they are grading the assignment. To receive an 'A' on any assignment, you must link to it from your portfolio.

    - - -

    ### One More Thing

    If you have any questions about this project or the material we have covered, please post them in the community channels in slack so that your fellow developers can help you! If you're still having trouble, you can come to office hours for assistance from your instructor and TAs.

    **Good Luck!**
