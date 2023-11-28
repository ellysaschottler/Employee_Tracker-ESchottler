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
            'View All Departments',
            'Add Department',
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
//populate department.name here
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
            'Sales Lead',
            'Salesperson',
            'Lead Engineer',
            'SoftwareEngineer',
            'Account Manager',
            'Accountant',
            'Legal Team Lead'
        ]
    },
    {
        type: 'list',
        name: 'emplManager',
        message: "Who is the employee's manager?",
        choices:
        [
        // populate from manager table
        ]
    }
]