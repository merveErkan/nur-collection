CREATE TABLE Supplier (
    supplier_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    tax_number VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(10),
    phone_number VARCHAR(20)
);
INSERT INTO Supplier (first_name, last_name, email, tax_number, address, city, postal_code, phone_number)
VALUES
('Ahmet', 'Çelik', 'ahmet@supplier.com', 'T1234567', 'Sanayi Cd. 22', 'Bursa', '16000', '02245556677'),
('Zehra', 'Yılmaz', 'zehra@supplier.com', 'T9876543', 'Organize Sanayi', 'Gaziantep', '27000', '03425558899');


SELECT * FROM Supplier;