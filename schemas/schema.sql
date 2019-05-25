DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
	id PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
	product VARCHAR(100) NOT NULL,
	department VARCHAR(100) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock INTEGER(10) NOT NULL,
);
INSERT INTO products(product, department, price, stock)
VALUES("samsung galaxy S8", "electronics", 450, 800),("mattress", "home & kitchen", 900, 100),
("battlefield 1", "pc & video games", 75, 66),("socks", "clothing", 2.50, 1500),("rake", "garden & outdoors", 18, 150),
("electric toothbrush", "home & kitchen", 35, 700),("beetlejuice costume", "clothing", 50, 5),("crime and punishment", "books", 15, 125),
("go set", "toys & games", 20, 75),("spoons", "home & kitchen", 1.50, 5000);

SELECT * FROM products;