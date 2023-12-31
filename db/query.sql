
-- View All Employees all info
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON e.manager_id = m.id

-- View All Roles
SELECT role.id AS id, role.title AS title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id;

--View All Departments
Select * FROM department


--------- TO Populate prompts

-- all department names query
SELECT name FROM department

-- all role titles query
SELECT title FROM role

-- all employee full names query
SELECT CONCAT(employee.first_name , ' ', employee.last_name) AS full_name FROM employee

-- all managers full name table query
SELECT CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id WHERE m.first_name IS NOT NULL

-- role name to id query
SELECT id FROM role WHERE name = ?

-- department name to id query
SELECT id FROM department WHERE name = ?

-- manager name to id query
SELECT id FROM employee WHERE first_name = managerFirstName AND last_name = managerLastName

--employee name to id query
SELECT id FROM employee WHERE first_name = employeeFirstName AND last_name = employeeLastName

-- update employee role query
UPDATE employee SET role_id = ? WHERE employee.id = ?

----------To Create records - add department, add role, add employee

-- Create employee
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (emplFirstName, emplLastName, emplManager, emplRole)

-- Create department
INSERT INTO department (name) VALUES (deptName)
 
-- Create role
INSERT INTO role (title, salary, department_id) VALUES (roleName, roleSalary, roleDept)



----Extra functionality

-- total utilized budget query by department - instructions should say to enter department id
SELECT SUM(r.salary) AS total_utilized_budget FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON d.id = r.department_id WHERE d.id = 1

-- view employees by department - enter department id
SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON e.manager_id = m.id WHERE d.id = 1

-- update manager by employee
UPDATE employee SET employee.manager_id=2 WHERE employee.id = 3

-- view employees by manager
SELECT * FROM employee WHERE manager_id = 2

-- delete records
DELETE FROM employee WHERE id = 1
DELETE FROM role WHERE id = 1
DELETE FROM department WHERE id = 1