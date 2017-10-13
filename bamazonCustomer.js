// necessary node modules
var mysql = require("mysql");
var inquirer = require("inquirer");
// this modules allows you to change the font colors
var colors = require("colors");
// create a connection to the database
var connection = mysql.createConnection({

	host: "localhost",
	port: 3306,
	user: "root",
	password: "M@laax0r",
	database: "bamazon_db"
});
start()
//connect to the database; select everything from the products table
function start() {

	connection.query("SELECT * FROM products", function(err, res) {

		if(err) throw err;
		console.log("\n===================================================================================================".bold.green);
		for(var i = 0; i < res.length; i++) {

			console.log("ID: " + res[i].id + " || Product: " + res[i].product + " || Department: " + res[i].department + " || Price: $" + res[i].price + " || Quantity: " + res[i].stock);
			console.log("===================================================================================================".bold.green);
		}	
			console.log("");
			
			inquirer.prompt([
			{
				name: "identifier",
				type: "input",
				message: "Please type the chosen product's id:",
				validate: function(value) {
					// this funciton checks whether the user types in a number(s) or letter(s)
					// the if statement allows only numbers to be entered
					if(!isNaN(value)) {
						return true;
					}
						return false;
				}	
			},{
				name: "amount",
				type: "input",
				message: "How many would you like to purchase?",
				validate: function(value) {

					if(!isNaN(value)) {
						return true;
					}
						return false;
				}
			}
		]).then(function(answers) {

			var item = parseInt(answers.amount);
			// connect to database to verify if there's enough stock 
			connection.query("SELECT * FROM products WHERE?", {id: answers.identifier}, function (err, data) {
				// display the error message
				if(err) throw err;
				// check the stock
				if(data[0].stock < answers.amount) {
					// display the result
					console.log("=============================================".bold.green);
					console.log("Sorry, but we don't have that many in stock.".bold.white);
					console.log("=============================================".bold.green);
					console.log("The app has closed. Please restart it!".bold.red);
					console.log("=============================================".bold.green);
					// terminate the app
					connection.end();
				}
				else {
					// update the inventory
					var updateStock = data[0].stock - item;
					// calculate total price
					var totalPrice = data[0].price * item;
					// update the prodcuts table in mysql
					connection.query("UPDATE products SET? WHERE?", 
					[
						{
							stock: updateStock 
						},{
							id: answers.identifier
						}
					],
					function(err,response) {
						// display an error, if one
						if(err) throw err;
						// display the following...
						console.log("=============================================".bold.green);
						console.log("Purchase successfully made!");
						console.log("=============================================".bold.green);
						console.log("Your total cost is $" + totalPrice.toFixed(2).toLocaleString());
						console.log("=============================================".bold.green);
						// ask the user if he/she would like to make another purchase
						inquirer.prompt([
							{
								name: "buy",
								type: "confirm",
								message: "Would you like to make another purchase?"
							}
						]).then(function(answer) {

							if(answer.buy === true) {
								start();
							}
							else {
								console.log("\n====================================".rainbow);
								console.log("Thank you for shopping on Bamazon!".white);
								console.log("====================================".rainbow);
								connection.end();
							}
						});
					});			
				}		
			});
		});
	});	
}



