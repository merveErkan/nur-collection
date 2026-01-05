CREATE TABLE Swal(
    product_id INT PRIMARY KEY REFERENCES product(product_id) ON DELETE CASCADE,
    lengt VARCHAR(20)
);

DROP TABLE IF EXISTS Swal CASCADE ;
INSERT INTO Swal (product_id, lengt)
VALUES (4, '190');

DELETE FROM Swal
WHERE product_id = 2;

SELECT * FROM Swal;