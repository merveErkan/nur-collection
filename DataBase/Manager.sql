CREATE TABLE manager (
    person_id INTEGER PRIMARY KEY REFERENCES person(person_id) ON DELETE CASCADE,
    username  VARCHAR(50) NOT NULL UNIQUE,
    password  VARCHAR(100) NOT NULL
);
INSERT INTO manager (person_id, username, password)
VALUES (2, 'manager1', '12345');

UPDATE Person
SET username = 'manager'
WHERE person_id = 2;


SELECT * FROM manager;