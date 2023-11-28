
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


