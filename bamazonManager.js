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
            case "View Low Inventory":
                viewLowInventory();
            case "Add to Inventory":
                addToInventory();
            // case "Add New Product":
            //     addNewProduct();
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
    });
}

// View Low Inventory function grabs and lists all items with an inventory count lower than 5
function viewLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity<7", function(error, res){
        if (error) throw error;
        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | Price: $" + res[i].price + " | Units left: " + res[i].stock_quantity);
        }
        console.log("--------------------------------");
    });
}

var itemsInDB = [];
// Add to Inventory
function addToInventory(){
    console.log(grabData());
    // console.log(choiceList);
    // inquirer.prompt([{
    //     type: 'list',
    //     name: 'itemToAddTo',
    //     message: 'Which item do you want to add more of?',
    //     choices: choiceList
    // }])
}

// grabs all items we have in our db
function grabData(){
    connection.query("SELECT * FROM products", function(error, res){
        itemsInDB = [];
        if (error) throw error;
        console.log(res);
        for (var i=0; i<res.length; i++){
            itemsInDB.push(res[i].product_name);
            console.log(res[i].product_name);
        }
    });
    return itemsInDB;
}

// Add New Product