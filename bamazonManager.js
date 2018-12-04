
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
// imported function
const insertTable = require('./insertTable');

const connection =mysql.createConnection({

	host: "localhost",
	port: 3306,
	user: "root",
	password: "M@laax0r",
	database: "bamazon_db"
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
			replenish();
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
				name: "replenish",
				type: "confirm",
				message: "\nWould you like to replenish inventory?"
			}
		]).then(query => {

			if(query.replenish) {

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

					connection.query("SELECT * FROM products WHERE?", {id: item.identifier}, (err, res) => { 

						if(err) throw err;
						
						console.log("\nPrior to replenishing!".bold.white);
						insertTable(res, colors.red);

						const updateInventory = addInventory + res[0].stock;
						
						connection.query("UPDATE products SET? WHERE?", [{stock: updateInventory}, {id: item.identifier}], (error, response) => {

							if(error) throw error;

							connection.query("SELECT * FROM products WHERE?", {id: item.identifier}, (err, res) => {

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

function replenish() {

	connection.query("SELECT * FROM products", function(err, res) {

		if(err) throw err;
		console.log("\n===================================================================================================".bold.green);

		for(var i = 0; i < res.length; i++) {

			console.log("ID: " + res[i].id + " || Product: " + res[i].product + " || Department: " + res[i].department + " || Price: $" + res[i].price + " ||" + " Quantity: "+ res[i].stock);
			console.log("===================================================================================================".bold.green);
				
		}
		inquirer.prompt([
			{
				name: "resuply",
				type: "confirm",
				message: "\nWould you like to replenish inventory?"
			}
		]).then(function(ask) {

			if(ask.resuply === true) {

				inquirer.prompt([
				{
					name: "identifier",
					type: "prompt",
					message: "Please type in the item's ID whose stock you want to replenish?",
					validate: function(value) {

						if(!isNaN(value)) {
							return true;
						}
							return false;
					}		
				},{
					name: "add",
					type: "prompt",
					message: "How much inventory do you want to add?",
					validate: function(value) {

			 			if(!isNaN(value)) {
			 				return true;
						 }
							return false;
					}
				}
				]).then(function(answer) {

					var addInventory = parseInt(answer.add);

					connection.query("SELECT * FROM products WHERE?", {id: answer.identifier}, function(err, data) { 

						if(err) throw err;
						console.log("\nPrior to replenishing!".bold.white);
		
						console.log("===================================================================================================".bold.green);
						for(var i = 0; i < data.length; i++) {

							console.log("ID: " + data[i].id + " || Product: " + data[i].product + " || Department: " + data[i].department + " || Price: $" + data[i].price + " || Quantity: " + colors.red(data[i].stock));
							console.log("===================================================================================================".bold.green);
						}
						var updateInventory = addInventory + data[0].stock;
						
						connection.query("UPDATE products SET? WHERE?", [{stock: updateInventory},{id: answer.identifier}], function (error, response) {

							if(error) throw error;

							connection.query("SELECT * FROM products WHERE?", {id: answer.identifier}, function(err, res) {

								console.log("\nStock resplenished!".bold.white);
								console.log("===================================================================================================".bold.green);
								for(var i = 0; i < res.length; i++) {

									console.log("ID: " + res[i].id + " || Product: " + res[i].product + " || Department: " + res[i].department + " || Price: $" + res[i].price + " || Quantity: " + colors.bold.cyan(res[i].stock));
									console.log("===================================================================================================".bold.green);
								}
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
            validate: function(value) {

            	if(!isNaN(value)) {
            		return true;
            	}
            		return false;
            }		
        }, {
            name: "quantity",
            type: "input",
            message: "Type the amount you want to add to the inventory"
        }
    ]).then(function(answers) {

        var productName = answers.product;
        var departmentName = answers.department;
        var Price = answers.price;
        var stockQuantity = answers.quantity;

        connection.query("INSERT INTO products (product, department, price, stock) VALUES(?,?,?,?)", [productName, departmentName, Price, stockQuantity], function(err, data) {
            
            if (err) throw err;

            console.log('\n\nProduct: ' + productName + ' added successfully!\n\n');
            viewProducts();
        });
    });    
} 