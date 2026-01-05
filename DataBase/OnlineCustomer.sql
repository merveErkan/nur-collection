CREATE TABLE Online_Customer (
    online_customer_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    CONSTRAINT fk_online_to_customer
        FOREIGN KEY (online_customer_id)
        REFERENCES Customer(customer_id)
        ON DELETE CASCADE
);
INSERT INTO Online_Customer (online_customer_id, username, password) VALUES (1, 'merve', '12345');


SELECT * FROM Online_Customer;