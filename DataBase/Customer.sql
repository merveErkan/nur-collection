CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    person_id INT UNIQUE REFERENCES Person(person_id) ON DELETE CASCADE,
    customer_type VARCHAR(20) DEFAULT 'Store' -- 'Online', 'Store' veya 'Both'
);

INSERT INTO Customer ( customer_id, person_id, customer_type)
VALUES
(7, 25,'Store'),
(6,26,'online');


DELETE FROM Customer
WHERE customer_id = 19;

SELECT * FROM Customer;
