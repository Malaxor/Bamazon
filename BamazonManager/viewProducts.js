const colors = require("colors");
const insertTable = require('../utils/insertTable');

module.exports = (connection, start) => {
   
	connection.query("SELECT * FROM products", (err, res) => {
		if(err) throw err;
      insertTable(res, colors.white);
      start();
	});
}