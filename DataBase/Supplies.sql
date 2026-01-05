CREATE TABLE supplies (
    supplier_id INT NOT NULL,
    product_id INT NOT NULL,
    amount INT DEFAULT 0 CHECK (amount >= 0),
    PRIMARY KEY (supplier_id, product_id),
    CONSTRAINT fk_supplies_supplier
        FOREIGN KEY (supplier_id)REFERENCES supplier(supplier_id)ON DELETE CASCADE,
    CONSTRAINT fk_supplies_product
        FOREIGN KEY (product_id)REFERENCES product(product_id) ON DELETE CASCADE
);

INSERT INTO Supplies (supplier_id, product_id, amount)
VALUES
(1, 4, 100),
(1, 5, 150),
(2, 6, 200);

--Parametreli INSERT
CREATE OR REPLACE PROCEDURE add_supply( p_supplier_id INT,p_product_id INT,p_amount INT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO supplies (supplier_id, product_id, amount)
    VALUES (p_supplier_id, p_product_id, p_amount)
    ON CONFLICT (supplier_id, product_id)
    DO UPDATE
    SET amount = supplies.amount + EXCLUDED.amount;
END;
$$;

CALL add_supply(1, 4, 50);



SELECT * FROM Supplies;