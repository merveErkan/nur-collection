CREATE TABLE Store_Customer (
    store_customer_id INT PRIMARY KEY,
    credit_amount NUMERIC(10,2) DEFAULT 0 CHECK (credit_amount >= 0),
    CONSTRAINT fk_store_to_customer
        FOREIGN KEY (store_customer_id)
        REFERENCES Customer(customer_id)
        ON DELETE CASCADE
);

INSERT INTO Store_Customer (store_customer_id, credit_amount) VALUES (2, 750.00);


SELECT * FROM Store_Customer;