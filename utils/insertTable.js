const Table = require('cli-table');

module.exports = (res, color) => {
	const table = new Table({
		head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
		style: {
			head: ['green'],
			compact: false,
			colAligns: ['center']
		}	
	});
	res.forEach(item => {
		table.push([item.id, item.product, item.department, `$${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`, color(item.stock)]);
	});
	console.log(`\n${table.toString()}`);
}