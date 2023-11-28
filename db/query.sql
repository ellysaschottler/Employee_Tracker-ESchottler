
-- View All Employees
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name , ' ', m.last_name) AS manager
FROM employee AS e
INNER JOIN role AS r ON e.role_id = r.id
INNER JOIN department AS d ON d.id = r.department_id
LEFT JOIN employee AS m ON e.manager_id = m.id

-- View All Roles
SELECT role.id AS id, role.title AS title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;

--View All Departments
Select * FROM department


-- Bonus - total utilized budget query by department - instructions should say to enter department id
SELECT SUM(r.salary) AS total_utilized_budget  
FROM employee AS e
INNER JOIN role AS r ON e.role_id = r.id
INNER JOIN department AS d ON d.id = r.department_id
WHERE d.id = 1

-- Bonus - view employees by department - enter department id
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name , ' ', m.last_name) AS manager
FROM employee AS e
INNER JOIN role AS r ON e.role_id = r.id
INNER JOIN department AS d ON d.id = r.department_id
LEFT JOIN employee AS m ON e.manager_id = m.id
WHERE d.id = 1

-- Bonus - update manager by employee
UPDATE employee SET employee.manager_id=2 WHERE employee.id = 3

-- Bonus - view employees by manager
SELECT * FROM employee WHERE manager_id = 2

-- Bonus - delete records
DELETE FROM employee WHERE id = 1
DELETE FROM role WHERE id = 1
DELETE FROM department WHERE id = 1