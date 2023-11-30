const inquirer =  require('inquirer');
const mysql = require('mysql2')
const cTable = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    console.log('Connected to employee_db')
);

function init() {
    inquirer.prompt(questionMainMenu).then((answers) => {
      
        if (answers = "View All Employees"){
            printAllEmployees()
        }
        if (answers = "Add Employee"){
            inquirer.prompt(questionAddEmpl).then((answers) => {
                var splitManager = answers.manager.split(" ")
                var managerFirstName = splitManager[0]
                var managerLastName = splitManager [1]
                var managerID = db.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [managerFirstName, managerLastName])

                db.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ?, ?, ?, ?" [answers.emplFirstName, answers.emplLastName, managerID, answers.emplRole])
            }
            console.log("This employee has been added")
         )}
        if (answers = "Update Employee Role"){
            inquirer.prompt(questionUpdateRole).then((answers) => {
            var splitEmployee = answers.employeeChoice.split(" ")
            var employeeFirstName = splitEmployee[0]
            var employeeLastName = splitEmployee[1]
            var employeeID = db.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [employeeFirstName, employeeLastName])
            var roleID = db.query("SELECT id FROM role WHERE title = ?", answers.roleChoice)
            db.query("UPDATE employee SET role_id = ? WHERE employee.id = ?", [roleID, employeeID])
            })
        }
        if (answers = "View All Roles"){
            printAllRoles()
        }
        if (answers = "Add a Role"){
            inquirer.prompt(questionAddRole).then((answers) => {
            var deptID =  db.query("SELECT id FROM department WHERE name = ?", answers.deptName)
            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answers.roleName, answers.roleSalary, deptID])    

            })
            
        }
        if (answers = "View All Departments"){
            printAllDepartments()
        }
        if (answers = "Add Department"){
            inquirer.prompt(questionAddDept).then((answers) => {
                db.query("INSERT INTO department (name) VALUES (?),", answers.deptName)   
                console.log("The department has been added.")
            })
            
        }
        if (answers = "Quit"){
           
        }        
    });
}

//Initialize the app
init()



const questionMainMenu =[
    {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices:
        [
            'View All Employees', // if chosen, run query to show all employee info
            'Add Employee', // if chosen run the prompts questionAddEmployee
            'Update Employee Role', // if chosen run the prompts questionUpdateRole
            'View All Roles', // if chosen run query to show all roles
            'Add a Role', // if chosen run prompts questionAddRole
            'View All Departments', // if chosen, run query to show all departments
            'Add Department', // if chosen run prompts questionAddDept
            'Quit',
        ]
    },
]

const questionAddDept = [
    {
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the department?',
        
    },
]

const questionAddRole = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?',
    },
    {
        type: 'list',
        name: 'roleDept',
        message: 'Which department does the role belong to?',
        choices:
        [
        db.query("SELECT name FROM department")
        ]
    },
]
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
const questionUpdateRole = [
   { 
        type: 'list',
        name: 'employeeChoice',
        message: 'Which employee you like to update?',
        choices: 
        [
        db.query("SELECT CONCAT(employee.first_name , ' ', employee.last_name) AS full_name FROM employee")
        ]
    },
    { 
        type: 'list',
        name: 'roleChoice',
        message: 'What is the new role?',
        choices:
        [
        db.query("SELECT title FROM role")
        ]
    },
    
]
const questionAddEmpl = [
    {
        type: 'input',
        name: 'emplFirstName',
        message: "What is the employee's first name?",
    },
    {
        type: 'input',
        name: 'emplLastName',
        message: "What is the employee's last name?",
    },
    {
        type: 'list',
        name: 'emplRole',
        message: "What is the employee's role?",
        choices:
        [
        db.query("SELECT title FROM role")
        ]
    },
    {
        type: 'list',
        name: 'emplManager',
        message: "Who is the employee's manager?",
        choices:
        [
        db.query("SELECT CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id WHERE m.first_name IS NOT NULL")
        ]
    }
]

//Query functions
function printAllEmployees(){
    db.query("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON e.manager_id = m.id", 
    function (err, results) {
        console.table(results)
    }) 
}

function printAllRoles() {
    db.query("SELECT title FROM role",
    function (err, results) {
        console.table(results)
    })
}

function printAllDepartments() {
    db.query("SELECT name FROM department",
    function(err, results) {
        console.table(results)
    })
}