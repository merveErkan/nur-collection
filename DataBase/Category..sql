CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50)
);

INSERT INTO Category (category_name)
VALUES
('Swal'),
('Scarf'),
('Bonnet');

-- Eğer Product tablosunda category_id sütunu varsa bu komutu çalıştır
ALTER TABLE Product
ADD CONSTRAINT fk_product_category
FOREIGN KEY (category_id)
REFERENCES category(category_id)
ON DELETE SET NULL;

SELECT * FROM Category;
