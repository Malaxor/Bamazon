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
	res.forEach(({ id, product, department, price, stock }) => {
		table.push([id, product, department, `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color(stock.toLocaleString())]);
	});
	console.log(`${table.toString()}`);
}