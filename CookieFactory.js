var mysql = require('mysql');
var inquirer = require('inquirer');
// var Password = require("password.js");

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
        // connection.end();
    });
    PromptChoice();
}

function PromptChoice() {
    console.log("Starting Buying Process...\n");
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
            console.log("Confirming Item ID: " + answer.itemID);
            console.log("Confirming Buy Quantity: " + answer.buyQuantity);

            connection.query("SELECT * FROM products WHERE item_id=" + answer.itemID, function (err, res) {
                if (err) throw err;

                for (var i = 0; i < res.length; i++) {
                    console.log(`You're buying ${answer.buyQuantity} stocks of ${res[i].product_name} from ${res[i].department_name}`);

                    var currentQuantity = res[i].stock_quantity;

                    if (currentQuantity - answer.buyQuantity < 0) {
                        console.log("Sadly, CookieFactory does not have enough Stock")
                    } else {
                        console.log("Now Processing Purchase...\n");
                        connection.query(
                            "UPDATE products SET stock_quantity =" + (currentQuantity - answer.buyQuantity) + " WHERE item_id =" + answer.itemID, function (err, res) {
                                if (err) throw err;
                                console.log("Your Purchase is complete!");
                                displayAll();
                            }
                        );
                    }
                }
            });
        });
}   