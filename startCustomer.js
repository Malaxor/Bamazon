const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const { host, port, user, password, database } = require('./config/keys');
const insertTable = require('./utils/insertTable');

const connection = mysql.createConnection({
	host,
	port,
	user,
	password,
	database
});
(function startApp() {

	connection.query("SELECT * FROM products", (err, res) => {
		if(err) throw err;
		insertTable(res, colors.white);
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
			connection.query("SELECT * FROM products WHERE?", { id: purchase.id }, (err, data) => {

				if(err) throw err;
				if(data[0].stock < purchase.amount) {
					console.log("=============================================".bold.green);
					console.log("Sorry, but we don't have that many in stock.".bold.white);
					console.log("=============================================".bold.green);
					console.log("App has restarted!".bold.red);
					console.log("=============================================".bold.green);
					startApp();
				}
				else {
					// update the inventory
					const amount = parseInt(purchase.amount);
					const updateStock = data[0].stock - amount;
					const totalPrice = data[0].price * amount;

					connection.query("UPDATE products SET? WHERE?", [{ stock: updateStock }, { id: purchase.id }], (err, response) => {
						if(err) throw err;
						console.log("=============================================".bold.green);
						console.log("Purchase successfully made!");
						console.log("=============================================".bold.green);
						console.log("Your total cost is $" + totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }));
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