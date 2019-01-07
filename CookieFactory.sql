DROP DATABASE IF EXISTS bamazon;
create database bamazon;
use bamazon;
create table products (
item_id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
product_name varchar(50) not null,
department_name varchar(50) not null,
price integer(10) not null,
stock_quantity integer(10) not null,
 PRIMARY KEY (item_id)
)

INSERT INTO products
(item_id, product_name, department_name,price,stock_quantity)
VALUES
(1,'Chocolate Chip Cookies', 'Chips Ahoy!', 5, 200),
(2,'Peanut Butter Cookies', 'Insomnia Cookies', 6 ,100),
(3, 'Raisin Cookies', 'The Cookie Factory', 4,125),
(4, 'Oreos', 'Oreo Company', 5, 300),
(5, 'Sugar Cookies', 'The Cookie Factory', 5,75),
(6, 'Red Velvet Cookies', 'Insomnia Cookies', 6, 150),
(7, 'Butter Cookies', 'Chips Ahoy!', 5, 175),
(8, 'Snickerdoodle', 'Insomnia Cookies', 6, 150),
(9, 'Almond Biscuits', 'Chips Ahoy!' , 4, 250),
(10, 'Macaroons', 'The Cookie Factory', 5,175);
