const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Spacebar",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("========================")
});
connection.query("SELECT * FROM  products", function (err, res) {
    console.log(res);
    inquirer.prompt([
        {
            name: "Id",
            type: "input",
            message: "What ID are you looking for?"
        }, {
            name: "Unit",
            type: "input",
            message: "How many units?"
        }
    ]).then(function (answers) {
        console.log(answers.Id)
        for (var i = 0; i < res.length; i++) {
            if (res[i].ID == answers.Id) {
                console.log(res[i].stock_quantity)
                if (res[i].stock_quantity >= answers.Unit) {
                    var updatedInventory = res[i].stock_quantity - answers.Unit
                    console.log(updatedInventory)
                    updateDatabase(updatedInventory, answers);
                    console.log(answers.price)
                }
                else {
                    console.log("Insufficient quantity!");
                }
            }
        }
    })
    function updateDatabase(updatedInventory, answers) {
        connection.query("UPDATE products SET ? WHERE ?", [ {
            stock_quantity: parseFloat(updatedInventory)},
            {
            ID: answers.Id}],
            function (err, res, fields) {
            if (err) throw err;
            console.log(answers.price);
            console.log("Total Cost: " + (answers.price + answers.stock_quantity))
            connection.end();
        });
    };
});


/*

        console.log("ID  Product Name  Department Name  Price  Stock Quantity");
        console.log("========================================================")
        for (i = 0; i < res.length; i++) {
        console.log(res[i].ID + "  " + res[i].product_name + "  " + res[i].department_name + "  " + res[i].price + "  " + res[i].stock_quantity);
        }
        questions();
*/