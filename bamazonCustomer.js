var mysql = require("mysql");
var inquirer = require("inquirer");

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
    getUserInput();
})

// function that displays our data and ends the connection
function readData(){
    connection.query("SELECT * FROM products", function(error, res){
        for (var i = 0; i < res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | Price: $" + res[i].price + " | Units left: " + res[i].stock_quantity);
        }
        console.log("--------------------------------");
    });
    connection.end();
}

// function uses inquirer to get data from user
// want item id and quantity to be purchased
function getUserInput(){
    inquirer.prompt([
        {
            name: "item_id",
            message: "Please enter the id for the item you wish to purchase: "
        }, {
            name: "stock_quantity",
            message: "How many units would you like? "
        }
    ]).then(function(answers){
        // call function that checks databases availability
        checkAvailability(answers.item_id, parseInt(answers.stock_quantity));
    });
}

// then we need to check if that item is in stock
function checkAvailability(itemID, wantedQuan){
    // first lets search and grab the item with the corresponding id
    connection.query("SELECT * FROM products WHERE item_id=?", [itemID], function(err, res){
        if (err) throw err;
        // now we need to check if we have enough to sell
        // if the resQuan is more than the wantedQuan then we need to update our database
        if (res[0].stock_quantity >= wantedQuan){
            // call function to update item in our db
            updateItemStock(itemID, res[0].stock_quantity, wantedQuan);
        } else {
            console.log("we dont have enough teehee");
        }
        console.log("--------------------------------");
    });
}

function updateItemStock(itemID, ogStock, numBought){
    var newStock = ogStock - numBought;
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            }, {
                item_id: itemID
            }
        ], 
        function(error) {
            if (error) throw err;
            console.log("congrats!");
            readData();
        }  
    );
}


// -------------- END OF DAY GOAL ---------------- //
// probably having the whole project 'done' like the easy part and then you can polish it up by saturday

// ------------- STUFF TO WORK ON ------------------- //
// have an exit() function that ends the connection so the user can keep looping through and buying more stuff
