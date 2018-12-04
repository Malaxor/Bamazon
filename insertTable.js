
const Table = require('cli-table');

module.exports = function (res, changeColor) {
	
	const table = new Table({

		head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
		style: {
			head: ['green'],
			compact: false,
			colAligns: ['center']
		}	
	});
	res.forEach(item => {

		table.push([item.id, item.product, item.department, `$${item.price.toFixed(2)}`, changeColor(item.stock)]);
	});
	console.log(`\n${table.toString()}`);
}