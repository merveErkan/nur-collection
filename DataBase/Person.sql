CREATE TABLE Person (
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    email VARCHAR(100) UNIQUE,
    address TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(10),
    phone_number VARCHAR(20),
    age INT CHECK (age >= 0)
);

INSERT INTO Person (first_name, last_name, gender, email, address, city, postal_code, phone_number, age)
VALUES
('Merve', 'Erkan', 'F', 'merve@example.com', 'Atatürk Cad. No:10', 'Çorum', '19000', '05551112233', 25),
('Ayşe', 'Kaya', 'F', 'ayse@example.com', 'Bağcılar', 'İzmir', '34000', '05334445566', 28);


UPDATE Person
SET city = 'istanbul', postal_code = '34000'
WHERE person_id = 4;


SELECT * FROM Person;