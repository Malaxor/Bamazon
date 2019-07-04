const colors = require("colors");
const inquirer = require('inquirer');
const insertTable = require('../utils/insertTable');

module.exports = (connection, start) => {

	connection.query("SELECT * FROM products WHERE stock < 100", async (err, res) => {
      
      if(err) throw err;
		insertTable(res, colors.red);

      const { confirm } = await inquirer.prompt({ 
         name: "confirm", 
         type: "confirm", 
         message: "\nWould you like to replenish inventory?" 
      });

      if(confirm) {
         const { id, addToInventory } = await inquirer.prompt([{
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
            name: "addToInventory",
            type: "prompt",
            message: "How much inventory do you want to add?",
            validate(value) {
               if(!isNaN(value)) {
                  return true;
                  }
               return false;
            }
         }]);
         connection.query("SELECT * FROM products WHERE?", { id }, (err, res) => { 

            if(err) throw err;
            console.log("\nPrior to replenishing!".bold.white);
            insertTable(res, colors.red);

            const newStock = parseInt(addToInventory) + res[0].stock;
            
            connection.query("UPDATE products SET? WHERE?", [{ stock: newStock }, { id }], (err, res) => {

               if(err) throw err;

               connection.query("SELECT * FROM products WHERE?", { id }, (err, res) => {

                  console.log("\nStock resplenished!".bold.white);
                  insertTable(res, colors.cyan);
                  start();
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
}