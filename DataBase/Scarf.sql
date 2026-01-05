CREATE TABLE Scarf (
    product_id INT PRIMARY KEY REFERENCES product(product_id) ON DELETE CASCADE,
    size VARCHAR(20)
);

INSERT INTO Scarf (product_id, size)
VALUES (5, '90*90');

SELECT * FROM Scarf;