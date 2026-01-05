CREATE TABLE Bonnet(
    product_id INT PRIMARY KEY REFERENCES product(product_id) ON DELETE CASCADE,
    body VARCHAR(20)
);

INSERT INTO Bonnet (product_id, body)
VALUES (3, 'M');

DELETE FROM Bonnet
WHERE product_id = 3;

SELECT * FROM Bonnet;