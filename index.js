const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'Tmysql98745',
        database: 'tabby_teasers_llc_db'
    },
    console.log(`Connected to the tabby_teasers_llc_db database.`)
);


let tabby_teasers_llc = function () {
    inquirer.prompt([
        {
            // User will be asked what they would like to do in the command terminal, and user can pick.
            type: 'list',
            name: 'viewData',
            message: 'Welcome to Tabby Teasers LLC! What would you like to do?',
            choices: ['View Departments', 'View Employees', 'View Roles', 'Add Department', 'Add Employee', 'Add Role', 'Update Employee Role']
        }
        // Used switch case for ease of use. Notes for one switch case can be applied to other similar ones.
    ]).then((input) => {
        switch (input.viewData) { // the choosen input will be used to to gain access to the viewData property from above
            case 'View Departments': // when the user selects 'vew departments' from the list prompt, this is executed ->
                db.query('SELECT * FROM departments;', (err, data) => { // database query selects all from departments
                    if (err) throw (err); // if there is an error, throw error
                    console.log("Departments: "); // logs lists of departments
                    console.table(data); // logs/shows departments in a table format
                    tabby_teasers_llc(); // function at the end so the function is called again and user can pick another option from the database
                });
                break;
            case 'View Employees':
                // TO SEE ALL DATA IN TABLE BY LINKING THE COLUMNS TOGETHER. First, selecting employee first/last name from employees table and role title/salary from roles table..
                db.query(
                // Selecting employee data and role data from the columns (for example, employees table, column first_name) from all tables with data. Added AS for an alias for when viewing in the table
                // For example, manger_id shows as manager
                // From the employees table, it will join with roles table with role.id column which will be the role id.
                // From the employees table, it will join the departments table on the column departments_id from the roles table. THis will be the department id.
                `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, roles.salary, manager_id AS manager
                FROM employees
                JOIN roles ON employees.role_id = roles.id
                JOIN departments ON roles.department_id = departments.id;`, (err, data) => {
                    if (err) throw (err);
                    console.log("Employees: ");
                    console.table(data);
                    tabby_teasers_llc();
                });
                break;
            case 'View Roles':
                db.query(`SELECT roles.title, roles.salary, departments.name AS department 
                FROM roles JOIN departments ON roles.department_id = departments.id`, (err, data) => {
                    if (err) throw (err);
                    console.log('Roles: ')
                    console.table(data);
                    tabby_teasers_llc();
                });
                break;



            // For adding department to database
            case 'Add Department':
            inquirer.prompt([ // When the user selects 'add department' they will get a new prompt
            {
                // the prompt will ask the user what name they would like for the new department they wish to add.
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the new department?',
                // the input is validated but if the user leaves the input blank the user will receive a console.log warning, otherwise the input is sent to the database and the user has a successful console.log message 
                validate: newDepartmentName => {
                    if (newDepartmentName === '') 
                        return ('Cannot leave blank. A new department must have a name.');
                    else
                        return true;
                }
            }]).then((addedDeptName) => { // once validated, the input data is sent and inserted into the database using the input the user typed in
                db.query('INSERT INTO departments (name) VALUES (?);', [addedDeptName.departmentName], (err, data) => {
                    if (err) throw (err)
                    console.log('A new department was added to the database.')
                    tabby_teasers_llc()
                });
            });
            break;




        }
    });

};

tabby_teasers_llc();
