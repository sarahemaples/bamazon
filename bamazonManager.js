var mysql = require("mysql");
var inquirer = require("inquirer");
inquirer.registerPrompt("list-input", require("inquirer-list-input"));

// creating our connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "m3owm3ow",
    database: "bamazon"
});

// function that lets us know if we connected or nah
connection.connect(function(err) {
    if (err) throw err;
    listManagerOptions();
})

var managerChoices = [
    "View Products for Sale",
    "View Low Inventory",
    "Add to Inventory",
    "Add New Product"
];

function listManagerOptions(){
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'Select an action',
        choices: managerChoices
    }], function(answers) {
        switch (answers.choice) {
            case "View Products for Sale":
                viewProductsForSale();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}

// View Products for Sale function displays available items' ids, names, price, and stock
// note this only shows products FOR SALE i.e. products that we have in stock
function viewProductsForSale(){
    connection.query("SELECT * FROM products WHERE stock_quantity>0", function(error, res){
        if (error) throw error;
        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | Price: $" + res[i].price + " | Units left: " + res[i].stock_quantity);
        }
        console.log("--------------------------------");
        listManagerOptions();
    });
}

// View Low Inventory function grabs and lists all items with an inventory count lower than 5
function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity<6", function(error, res){
        if (error) throw error;
        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | Price: $" + res[i].price + " | Units left: " + res[i].stock_quantity);
        }
        console.log("--------------------------------");
        listManagerOptions();
    });
}

// Add to Inventory
function addToInventory(){
    connection.query(
        "SELECT * FROM products", 
        function(error, res) {
            if (error) throw error;
            // prompt that lists all available items and allows user to pick
            inquirer.prompt([
            {
                type: 'list',
                name: 'itemToAddTo',
                message: 'Which item do you want to add more of?',
                choices: function(){
                    var itemsInDB = [];
                    for (var i=0; i<res.length; i++){
                        itemsInDB.push(res[i].product_name);
                    }
                    return itemsInDB;
                }   
            }
            ], function(answers){
        // after user has picked item, we ask how many units they would like to add
            var ourProduct = answers.itemToAddTo;
            inquirer.prompt([
            {
                name: "toAdd",
                message: "How many units of " + ourProduct + " would you like to add?"
            }
            // finally we need to update our db accordingly
            ], function(userNum){
                // we need to grab the old stock_quan and update it
                connection.query(
                    "SELECT * FROM products WHERE product_name=?", 
                    [ourProduct], 
                    function(err, res)
                    {
                        if (err) throw err;

                        var newStock = parseInt(res[0].stock_quantity) + parseInt(userNum.toAdd);

                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newStock
                                }, {
                                    product_name: ourProduct
                                }
                            ]
                        );

                        console.log("Updated stock for "+ourProduct + "\nNew stock is: "+newStock);

                        listManagerOptions();
                    }
                );
            })
    });
});

};

function addNewProduct(){
    // inquirer prompt to take in data from manager
    inquirer.prompt([
        {
            name: "product_name",
            message: "Name of product: "
        }, {
            name: "department_name",
            message: "Name of department: "
        }, {
            name: "price",
            message: "Price per unit: "
        }, {
            name: "stock_quantity",
            message: "Units stocked: "
        }
    ], function(answers){
        connection.query(
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
            [answers.product_name, answers.department_name, answers.price, answers.stock_quantity],
            function(err, res){
                if (err) throw err;

                console.log("Your item has been added")

                listManagerOptions();
            }
        )
    });
}