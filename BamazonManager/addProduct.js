const inquirer = require('inquirer');
const viewProducts = require('./viewProducts');

module.exports = async (connection, start) => {

	const { product, department, price, quantity } = await inquirer.prompt([
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
    ]);
   connection.query("INSERT INTO products (product, department, price, stock) VALUES(?,?,?,?)", [product, department, price, quantity], (err, data) => {
         
      if (err) throw err;
      console.log(`\n\nProduct: ${product} added successfully!\n\n`);
      viewProducts(connection, start);
   });
} 