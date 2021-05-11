const mysql = require("mysql");
const inquirer = require("inquirer");
const { host, port, user, password, database } = require('./config/keys');
const { 
	addProduct, 
	endConnection, 
	lowInventory, 
	replenishInventory, 
	viewProducts 
} = require('./BamazonManager');
/* mySQL connection  */
const connection = mysql.createConnection({
	host,
	port,
	user,
	password,
	database
});
connection.connect(err => {
	if(err) throw err;
	start();
});
console.log("=============================================".green);

async function start() {
	const { options } = await inquirer.prompt([
		{
			name: "options",
			type: "list",
			message: "What would you like to do?",
			choices: ["View products for sale", "View low inventory", "Replenish inventory", "Add a new product", "Exit"]
		}
	]);
	switch(options) {
		case "View products for sale":
			viewProducts(connection, start);
		break;

		case "View low inventory":
			lowInventory(connection, start);
		break;

		case "Replenish inventory":
			replenishInventory(connection, start);
		break;

		case "Add a new product":
			addProduct(connection, start);
		break;
		
		case "Exit":
			endConnection(connection);
		break;
	}
}