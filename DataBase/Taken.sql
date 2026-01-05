CREATE TABLE Taken (
    store_customer_id INT NOT NULL,
    product_id INT NOT NULL,
    amount INT NOT NULL CHECK (amount > 0),

    -- Birleşik Anahtar: Bir müşteri bir ürünü bir kez eşleşme olarak tutar
    PRIMARY KEY (store_customer_id, product_id),

    CONSTRAINT fk_taken_customer FOREIGN KEY (store_customer_id) REFERENCES Store_Customer(store_customer_id),
    CONSTRAINT fk_taken_product FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

SELECT * FROM Taken;