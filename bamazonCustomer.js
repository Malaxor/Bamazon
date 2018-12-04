
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const Table = require('cli-table');

const connection = mysql.createConnection({

	host: "localhost",
	port: 3306,
	user: "root",
	password: "M@laax0r",
	database: "bamazon_db"
});

(function startApp() {

	connection.query("SELECT * FROM products", (err, res) => {

		if(err) throw err;

		const table = new Table({

			head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
			style: {
				head: ['green'],
				compact: false,
				colAligns: ['center']
			}	
		});
		res.forEach(item => {

			table.push([item.id, item.product, item.department, `$${item.price.toFixed(2)}`, item.stock]);
		});
		console.log(table.toString());	
		console.log("");
			
			inquirer.prompt([
			{
				name: "id",
				type: "input",
				message: "Please type the chosen product's id:",
				validate(value) {
					if(!isNaN(value)) {
						return true;
					}
					return false;
				}	
			},{
				name: "amount",
				type: "input",
				message: "How many would you like to purchase?",
				validate(value) {
					if(!isNaN(value)) {
						return true;
					}
					return false;
				}
			}
		]).then(purchase => {

			const amount = parseInt(purchase.amount);
			// connect to database to verify if there's enough stock 
			connection.query("SELECT * FROM products WHERE?", {id: purchase.id}, (err, data) => {
				// display the error message
				if(err) throw err;
				// check the stock
				if(data[0].stock < purchase.amount) {

					console.log("=============================================".bold.green);
					console.log("Sorry, but we don't have that many in stock.".bold.white);
					console.log("=============================================".bold.green);
					console.log("The app has closed. Please restart it!".bold.red);
					console.log("=============================================".bold.green);
					connection.end();
				}
				else {
					// update the inventory
					const updateStock = data[0].stock - amount;
					// calculate total price
					const totalPrice = data[0].price * amount;
					// update the prodcuts table in mysql
					connection.query("UPDATE products SET? WHERE?", 
					[
						{
							stock: updateStock 
						},{
							id: purchase.id
						}
					],
					(err, response) => {
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
						]).then(answer => {

							if(answer.buy) {
								startApp();
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
}());