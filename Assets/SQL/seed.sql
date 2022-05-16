USE employee_db;

INSERT INTO department (name)
VALUES ('Manager'),('Sales'),('IT');

INSERT INTO role (title, salary, department_id)
VALUES ('General Manager', 100000, 1), ('Estimater', 85000, 2),('Support', 75000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Cody', 'Gallagher', 1, NULL), ('Amanda', 'Rose', 2, NULL), ('Mehdi', 'Sabzevari', 3, NULL);