CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    cost DECIMAL(8,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
		PRIMARY KEY (item_id)
);