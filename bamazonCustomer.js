var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Pokezhang101",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    displayAll();
});

function displayAll() {
    console.log("Current Inventory...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
    PromptChoice();
}

function PromptChoice() {
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "What is the ID of the item you would like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "buyQuantity",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (typeof value != 'number') {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var currentQuantity = "SELECT stock_quantity FROM products WHERE itemid = itemID";
            connection.query(
                "INSERT INTO products SET ?",
                {
                    item_id: itemID,
                    stock_quantity: currentQuantity - buyQuantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your Purchase is complete!");
                   displayAll();
                }
            );
        });
}