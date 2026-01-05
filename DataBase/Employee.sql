CREATE TABLE Employee (
    employee_id SERIAL PRIMARY KEY,
    person_id INT UNIQUE REFERENCES Person(person_id) ON DELETE CASCADE,
    hire_date DATE NOT NULL,
    salary NUMERIC(10,2),
    service_duration INTERVAL
);

INSERT INTO Employee (person_id, hire_date, salary, service_duration)
VALUES
(1, '2022-01-15', 15000.00, INTERVAL '2 years'),
(4, '2023-03-10', 12500.00, INTERVAL '1 years');




SELECT * FROM Employee;