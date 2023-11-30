const inquirer =  require('inquirer');
const mysql = require('mysql2/promise')
const cTable = require('console.table')

let db = null

async function init() {
    db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'employee_db'
        })

    const questionMainMenu =[
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices:
            [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add a Role',
                'View All Departments', 
                'Add Department',
                'Quit',
            ]
        },
    ]
    
    while (true) {
        const answers = await inquirer.prompt(questionMainMenu)
        const answer = answers.mainMenu

        if (answer == "View All Employees") {
            await printAllEmployees()
        } else if (answer == "Add Employee") {
            await promptAddEmpl(answers)
        } else if (answer == "Update Employee Role") {
            await promptUpdateRole(answers)
        } else if (answer == "View All Roles") {
            await printAllRoles()
        } else if (answer == "Add a Role") {
            await promptAddRole(answers)
        } else if (answer == "View All Departments") {
            await printAllDepartments()
        } else if (answer == "Add Department") {
            await promptAddDept(answers)
        } else if (answer == "Quit") {
            break;
        }
    }

    // close the connection pool
    db.end()
}



//Sub Question prompts

async function promptAddEmpl(){
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
            choices: await listAllRoleTitles()
        },
        {
            type: 'list',
            name: 'emplManager',
            message: "Who is the employee's manager?",
            choices: await listManagerFullName()
        }
    ]

    const subAnswers = await inquirer.prompt(questionAddEmpl)
    await addEmployee(subAnswers)
}   

async function promptUpdateRole() {
    const questionUpdateRole = [
        { 
             type: 'list',
             name: 'employeeChoice',
             message: 'Which employee you like to update?',
             choices: await listEmployeeFullName()
         },
         { 
             type: 'list',
             name: 'roleChoice',
             message: 'What is the new role?',
             choices: await listAllRoleTitles()
         },
         
    ]

    const subAnswers = inquirer.prompt(questionUpdateRole)
    await updateEmployeeRole(subAnswers)
}

async function promptAddRole(){
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
            choices: await listAllDepartments()
        },
    ]

    const subAnswers = inquirer.prompt(questionAddRole)
    await addRole(subAnswers)
}
async function promptAddDept() {
    const questionAddDept = [
        {
            type: 'input',
            name: 'deptName',
            message: 'What is the name of the department?',
        },
    ]

    const subAnswers = await inquirer.prompt(questionAddDept)
    await addDepartment(subAnswers)
}

//Query functions
async function printAllEmployees(){
    const [rows, fields] = await db.execute("SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON e.manager_id = m.id")
    console.table(rows)
}

async function printAllRoles() {
    const roles = await listAllRoles()
    console.table(roles)
}

async function listAllRoles() {
    const [rows, fields] = await db.execute("SELECT title FROM role")
    return rows
}

async function listAllRoleTitles() {
    return (await listAllRoles()).map(role => role.title)
}

async function printAllDepartments() {
    const departments = await listAllDepartments()
    console.table(departments)
}

async function listAllDepartments() {
    const [rows, fields] = await db.execute("SELECT name FROM department")
    return rows
}

async function listEmployeeFullName(){
    const [rows, fields] = await db.execute("SELECT CONCAT(employee.first_name , ' ', employee.last_name) AS full_name FROM employee")
    return rows.map(row => row.full_name)
}

async function listManagerFullName(){
    const [rows, fields] = await db.execute("SELECT DISTINCT CONCAT(m.first_name , ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee AS m ON e.manager_id = m.id WHERE m.first_name IS NOT NULL")
    return rows.map(row => row.manager)
}

async function getEmployeeIDFromName (managerName) {
    const [rows, fields] = await db.execute("SELECT id FROM employee WHERE CONCAT(first_name , ' ', last_name) = ?", [managerName])
    return rows[0].id
}

async function getRoleIDFromTitle(roleTitle) {
    const [rows, fields] = await db.execute("SELECT id FROM role WHERE title = ?", [roleTitle])
    return rows[0].id
}

async function addEmployee(subAnswers) {
    managerID = await getEmployeeIDFromName(subAnswers.emplManager)
    roleID = await getRoleIDFromTitle(subAnswers.emplRole)
    await db.execute(
        "INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)",
        [subAnswers.emplFirstName, subAnswers.emplLastName, managerID, roleID])

    console.log("This employee has been added.")
}

async function updateEmployeeRole(subAnswers) {
    var employeeID = await getEmployeeIDFromName(subAnswers.employeeChoice)
    var roleID = await getRoleIDFromTitle(subAnswers.roleChoice)
    await db.execute("UPDATE employee SET role_id = ? WHERE employee.id = ?", [roleID, employeeID])

    console.log("This employee has been updated")
}

function getDepartmentIDFromName(subAnswers) {
    return db.execute("SELECT id FROM department WHERE name = ?", [subAnswers.deptName])
}

async function addRole(subAnswers) {
    var deptID = getDepartmentIDFromName()
    await db.execute(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [subAnswers.roleName, subAnswers.roleSalary, deptID])
    
    console.log("This role has been added.")
}

async function addDepartment(subAnswers) {
    await db.execute("INSERT INTO department (name) VALUES (?)", [subAnswers.deptName])

    console.log("The department has been added.")
}

init()