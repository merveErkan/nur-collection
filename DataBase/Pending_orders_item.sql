CREATE TABLE pending_order_items (
    pending_item_id SERIAL PRIMARY KEY,
    pending_order_id INT REFERENCES pending_orders(pending_order_id) ON DELETE CASCADE,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);


SELECT * FROM pending_order_items;