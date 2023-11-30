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
            addEmployee()
        }
        if (answers = "Update Employee Role"){
           questionUpdateRole()
        }
        if (answers = "View All Roles"){
            printAllRoles()
        }
        if (answers = "Add a Role"){
            questionAddRole()
        }
        if (answers = "View All Departments"){
            printAllDepartments()
        }
        if (answers = "Add Department"){
            questionAddDept()
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
        name: 'roleChoice',
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
        choices: listAllDepartments()
    },
]

const questionUpdateRole = [
   { 
        type: 'list',
        name: 'employeeChoice',
        message: 'Which employee you like to update?',
        choices: listEmployeeFullName()
    },
    { 
        type: 'list',
        name: 'roleChoice',
        message: 'What is the new role?',
        choices: listAllRoles()
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
        choices: listAllRoles()
    },
    {
        type: 'list',
        name: 'emplManager',
        message: "Who is the employee's manager?",
        choices: listManagerFullName()
    }
]


//Sub Question prompts

function questionAddEmpl(){
    inquirer.prompt(questionAddEmpl).then((answers) => {
        addEmployee()
    })
}   


function questionUpdateRole() {
    inquirer.prompt(questionUpdateRole).then((answers) => {
        updateEmployeeRole()
    })
}
function questionAddRole(){
    inquirer.prompt(questionAddRole).then((answers) => {
        addRole()            
    })   
}
function questionAddDept() {
    inquirer.prompt(questionAddDept).then((answers) => {
        addDepartment()
    }) 
}

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

function listAllRoles() {
    db.query("SELECT title FROM role",
    function (err, results) {
        return
    })
}

function printAllDepartments() {
    db.query("SELECT name FROM department",
    function(err, results) {
        console.table(results)
    })
}
function listAllDepartments() {
    db.query("SELECT name FROM department",
    function(err, results) {
        return
    })
}
function listEmployeeFullName(){
    db.query("SELECT CONCAT(employee.first_name , ' ', employee.last_name) AS full_name FROM employee",
    function(err, results) {
        return
    })
}
function listManagerFullName(){
    db.query("SELECT CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id WHERE m.first_name IS NOT NULL",
    function (err, results) {
        return
    })
}

function getManagerIDfromName () {
    var splitManager = answers.manager.split(" ")
    var managerFirstName = splitManager[0]
    var managerLastName = splitManager [1]
    db.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
     [managerFirstName, managerLastName],
     function(err, results) {
        return
     })
}
function getRoleIDfromRoleTitle() {
    db.query("SELECT id FROM role WHERE name = ?",
    answers.roleChoice,
    function(err, results) {
        return
    })
}

function addEmployee() {
    managerID = getManagerIDfromName()
    roleID = getRoleIDfromRoleTitle()
    db.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ?, ?, ?, ?",
    [answers.emplFirstName, answers.emplLastName, managerID, roleID],
    function (err, results) {
        console.log("This employee has been added.")
    }) 
}

function getEmployeeIDfromName() {
    var splitEmployee = answers.employeeChoice.split(" ")
    var employeeFirstName = splitEmployee[0]
    var employeeLastName = splitEmployee[1]
    db.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
    [employeeFirstName, employeeLastName],
    function(err, results) {
        return
    })
}

function updateEmployeeRole() {
    var employeeID = getEmployeeIDfromName()
    var roleID = getRoleIDfromRoleTitle()
    db.query("UPDATE employee SET role_id = ? WHERE employee.id = ?",
    [roleID, employeeID],
    function (err, results) {
        (console.log("This employee has been updated"))
    })
}

function getDepartmentIDFromName() {
    db.query("SELECT id FROM department WHERE name = ?",
    answers.deptName,
    function(err, results) {
        return
    })
}

function addRole() {
    var deptID = getDepartmentIDFromName()
    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
    [answers.roleName, answers.roleSalary, deptID],
    function(err, results) {
        console.log("This role has been added.")
    })    
}

function addDepartment() {
    db.query("INSERT INTO department (name) VALUES (?)",
     answers.deptName,
     function(err, results) {
        console.log("The department has been added.")
     })
}