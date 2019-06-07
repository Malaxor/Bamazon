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
connection.connect(err => {
	if(err) throw err;
	start();
});
console.log("=============================================".green);

function start() {

	inquirer.prompt([
		{
			name: "options",
			type: "list",
			message: "What would you like to do?",
			choices: ["View products for sale", "View low inventory", "Replenish inventory", "Add a new product"]
		}
	]).then(app => {

		switch(app.options) {
			case "View products for sale":
				viewProducts();
			break;

			case "View low inventory":
				lowInventory();
			break;

			case "Replenish inventory":
				replenishInventory();
			break;

			case "Add a new product":
				addProduct();
			break;
		}
	});
};
function viewProducts() {

	connection.query("SELECT * FROM products", (err, res) => {

		if(err) throw err;
		insertTable(res, colors.white);
		start();
	});
}
function lowInventory() {

	connection.query("SELECT * FROM products WHERE stock < 100", (err, res) => {

		if(err) throw err;
		insertTable(res, colors.red);

		inquirer.prompt([
			{
				name: "confirm",
				type: "confirm",
				message: "\nWould you like to replenish inventory?"
			}
		]).then(({ confirm }) => {

			if(confirm) {

				inquirer.prompt([
				{
					name: "id",
					type: "prompt",
					message: "Please type in the item's ID whose stock you want to replenish?",
					validate(value) {
						if(!isNaN(value)) {
							return true;
						}
					   return false;
				   }
				},{
					name: "stock",
					type: "prompt",
					message: "How much inventory do you want to add?",
					validate(value) {
			 			if(!isNaN(value)) {
			 				return true;
						 }
						return false;
					}
				}
				]).then(({ id, stock }) => {

					connection.query("SELECT * FROM products WHERE?", { id }, (err, res) => { 

						if(err) throw err;
			
						console.log("\nPrior to replenishing!".bold.white);
						insertTable(res, colors.red);

						stock = parseInt(stock)+ res[0].stock;
						
						connection.query("UPDATE products SET? WHERE?", [{ stock }, { id }], (err, res) => {

							if(err) throw err;

							connection.query("SELECT * FROM products WHERE?", { id }, (err, res) => {

								console.log("\nStock resplenished!".bold.white);
								insertTable(res, colors.cyan);
								start();
							});
						});		
					});
				});							
			}
			else {
				console.log("========================================".bold.green);
				console.log("App will restart!".bold.red);
				console.log("========================================".bold.green);
				start();
			}	
		});							
    });
}
function replenishInventory() {

	connection.query("SELECT * FROM products", (err, res) => {

		if(err) throw err;
		insertTable(res, colors.white);

		inquirer.prompt([
			{
				name: "confirm",
				type: "confirm",
				message: "\nWould you like to replenish inventory?"
			}
		]).then(replenish => {

			if(replenish.confirm) {

				inquirer.prompt([
				{
					name: "identifier",
					type: "prompt",
					message: "Please type in the item's ID whose stock you want to replenish?",
					validate(value) {
						if(!isNaN(value)) {
							return true;
						}
					   return false;
				   }
				},{
					name: "stock",
					type: "prompt",
					message: "How much inventory do you want to add?",
					validate(value) {
			 			if(!isNaN(value)) {
			 				return true;
						 }
						return false;
					}
				}
				]).then(item => {

					const addInventory = parseInt(item.stock);

					connection.query("SELECT * FROM products WHERE?",  {id: item.identifier }, (err, res) => { 

						if(err) throw err;
						
						console.log("\nPrior to replenishing!".bold.white);
						insertTable(res, colors.yellow);

						const updateInventory = addInventory + res[0].stock;
						
						connection.query("UPDATE products SET? WHERE?", [{stock: updateInventory}, {id: item.identifier}], (error, response) => {

							if(error) throw error;

							connection.query("SELECT * FROM products WHERE?", {id: item.identifier}, (err, res) => {

								console.log("\nStock resplenished!".bold.white);
								insertTable(res, colors.yellow);
								start();
							});
						});		
					});
				});							
			}
			else {
				console.log("========================================".bold.green);
				console.log("App will restart!".bold.red);
				console.log("========================================".bold.green);
				start();
			}	
		});							
    });
}
function addProduct() {

	inquirer.prompt([
		{
         name: "product",
         type: "input",
         message: "Type the product's name"
      }, {
         name: "department",
         type: "input",
         message: "Type the product's department"
      }, {
         name: "price",
         type: "input",
         message: "Type the product's price (without currency symbols)",
         validate(value) {
            if(!isNaN(value)) {
            	return true;
            }
            return false;
         }		
      }, {
         name: "quantity",
         type: "input",
			message: "Type the amount you want to add to the inventory",
			validate(value) {
            if(!isNaN(value)) {
            	return true;
            }
            return false;
         }	
      }
    ]).then(newItem => {

      const { product, department, price, quantity } = newItem;
      connection.query("INSERT INTO products (product, department, price, stock) VALUES(?,?,?,?)", [product, department, price, quantity], (err, data) => {
            
         if (err) throw err;
         console.log(`\n\nProduct: ${product} added successfully!\n\n`);
         viewProducts();
      });
   });    
} 