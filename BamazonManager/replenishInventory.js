const colors = require("colors");
const inquirer = require('inquirer');
const insertTable = require('../utils/insertTable');

module.exports = (connection, start) => {

	connection.query("SELECT * FROM products", async (err, res) => {

		if(err) throw err;
		insertTable(res, colors.white);

      const { id, stock } = await inquirer.prompt([
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
      }, {
         name: "stock",
         type: "prompt",
         message: "How much inventory do you want to add?",
         validate(value) {
            if(!isNaN(value)) {
               return true;
               }
            return false;
         }
      }]);
      connection.query("SELECT * FROM products WHERE?",  { id }, (err, res) => { 

         if(err) throw err;
         console.log("\nPrior to replenishing!".bold.white);
         insertTable(res, colors.yellow);

         const newStock = parseInt(stock) + res[0].stock;
         
         connection.query("UPDATE products SET? WHERE?", [{ stock: newStock }, { id }], (err, res) => {

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