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
    displayMenu();
});

function displayMenu() {
    console.log("Welcome to the Manager of CookieFactory Menu...\n");
    inquirer
        .prompt([
            {
                name: "CFMenu",
                type: "rawlist",
                message: "What Would You Like To Do: ",
                choices: ["VIEW ALL PRODUCTS", "VIEW LOW INVENTORY", "ADD TO EXISTING PRODUCTS", "ADD NEW PRODUCT"]
            },

        ])
        .then(function (answer) {
            switch (answer.CFMenu.toUpperCase()) {
                case ("VIEW ALL PRODUCTS"):
                    viewAllInventory();
                    break;

                case ("VIEW LOW INVENTORY"):
                    viewLowInventory();
                    break;

                case ("ADD TO EXISTING PRODUCTS"):
                    addInventory();
                    break;

                case ("ADD NEW PRODUCT"):
                    createNewInventory();
                    break;
            }
        });

    function viewAllInventory() {
        console.log("Current Inventory (Manager View)...\n");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            console.log(res);
            // connection.end();
        });
        displayMenu();
    }

    function viewLowInventory() {
        console.log("Current Low Inventory (Manager View)...\n");
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
            if (err) throw err;
            console.log(res);
        });
        displayMenu();
    }

    function addInventory() {
        console.log("Adding Inventory (Manager View...\n");
        inquirer
            .prompt([
                {
                    name: "AddInvID",
                    type: "input",
                    message: "What is the ID number of item you would like to add to? (Manager Only) : ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "QuantityAdded",
                    type: "input",
                    message: "How much would you like to add? (Manager Only) : ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                console.log("Confirming the item you would like to add to: " + answer.AddInvID);
                console.log("Confirming the quantity you would like to add: " + answer.QuantityAdded);

                connection.query("SELECT * FROM products WHERE item_id=" + answer.AddInvID, function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {

                        console.log(`Current Inventory of ${res[i].product_name} is ${res[i].stock_quantity}`);

                        var currentQuantity = res[i].stock_quantity;

                        connection.query(
                            "UPDATE products SET stock_quantity =" + (parseInt(currentQuantity) + parseInt(answer.QuantityAdded)) + " WHERE item_id =" + answer.AddInvID, function (err, response) {
                                if (err) throw err;
                            }
                        );
                    }
                });
                displayMenu();
            });
        //stock quantity updates properly but does not display properly until next query
    }

    function createNewInventory() {
        console.log("Adding New Product to CookieFactory...\n");
        inquirer
            .prompt([
                {
                    name: "ProductName",
                    type: "input",
                    message: "What is the Name of the New Product? (Manager Only) : "
                },
                {
                    name: "DepartmentName",
                    type: "input",
                    message: "What is the Deparment of the Product? (Manager Only) : "
                },
                {
                    name: "ProductPrice",
                    type: "input",
                    message: "What is the Price of the new Product? (Manager Only) : ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "ProductQuantity",
                    type: "input",
                    message: "What is the Quantity of the New Product? (Manager Only) : ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                console.log("Creating New Product...\n");
                connection.query(
                    "INSERT INTO products SET ?",
                    {
                        product_name: answer.ProductName,
                        department_name: answer.DepartmentName,
                        price: answer.ProductPrice,
                        stock_quantity: answer.ProductQuantity
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("The New Product did not Create");
                    }
                );
                displayMenu();
            });
    }

}