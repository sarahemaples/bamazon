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
    listManagerOptions();
})

function listManagerOptions(){
    inquirer.registerPrompt("list-input", require("inquirer-list-input"));
    inquirer.prompt([{
        type: 'list-input',
        name: 'from',
        message: 'Select a state to travel from',
        choices: ['AL', 'AR']
    }], function(answers) {
        console.log(JSON.stringify(answers, null, 2));
    });
}

// View Products for Sale

// View Low Inventory

// Add to Inventory

// Add New Product