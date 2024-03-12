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
                    `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, roles.salary, departments.name AS department, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
                FROM employees
                LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                JOIN roles ON employees.role_id = roles.id
                JOIN departments ON roles.department_id = departments.id;`, (err, data) => {
                    if (err) throw err;
                    console.log("Employees: ");
                    console.table(data);
                    tabby_teasers_llc();
                });
                break;
            case 'View Roles':
                db.query(
                    `SELECT roles.title, roles.salary, departments.name AS department  
                    FROM roles JOIN departments ON roles.department_id = departments.id`, (err, data) => { //From the roles table, the title, salary data is collected. From departments table, name is collected. department name is given the alias of 'department'
                    // from the roles table, departments table is joined on id so that it pulls the department id
                    if (err) throw (err);
                    console.log('Roles: ')
                    console.table(data);
                    tabby_teasers_llc();
                });
                break;


            // For adding department to database
            case 'Add Department':
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'deptName',
                        message: 'What is the name of the new department?',
                        validate: deptName => { // the input is validated but if the user leaves the input blank the user will receive a console.log warning, 
                                                //otherwise the input is sent to the database and the user has a successful console.log message 
                            if (deptName === '') {
                                return 'Cannot leave blank. A new department must have a name.';
                            } else {
                                return true;
                            }
                        }
                    },
                ]).then((input) => {
                    db.query('INSERT INTO departments (name) VALUES (?);', [input.deptName], (err) => { 
                        // once validated, the input data is sent and inserted into the database for column name in 
                        // departments table using the input the user typed in
                        if (err) throw err;
                        console.log('New department and role have been added.');
                        tabby_teasers_llc();
                    });
                });
                break;

            // Adding role to database
            case 'Add Role':
                // Grabbing the list of existing departments from database
                db.query('SELECT id, name FROM departments;', (err, departments) => {
                    if (err) throw (err) 
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'roleTitle',
                            message: 'What is the title of this role?',
                            validate: roleTitle => {
                                if (roleTitle === '') {
                                    return 'Cannot leave blank. A title is needed in a department.';
                                } else {
                                    return true;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'roleSalary',
                            message: 'What is the salary for this role?',
                            validate: roleSalary => {
                                // Entered salary has to be a number, and if it is not a number they will get a message saying it is invalid.
                                if (isNaN(roleSalary)) {
                                    return 'Please enter a valid salary.';
                                } else {
                                    return true;
                                }
                            }
                        },
                        {
                            type: 'list',
                            name: 'roleDept',
                            message: 'In which department is this role?',
                            // taking the departments table and taking the name and id of table 
                            // Using the map method in function to create a new arrray from the name and id in departments
                            // This will give the user the department choices. The 'name' is what the user will see in the list, 
                            // and the 'value' is what will be used once selected by the user
                            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
                        }
                    ]).then((input) => {
                        // instering the new role with titel, salary and department_id (user selects department id above) into the database 
                        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);', [input.roleTitle, input.roleSalary, input.roleDept], (err) => {
                            if (err) throw err;
                            console.log('New role has been added.');
                            tabby_teasers_llc();
                        });
                    });
                });
                break;









            //adding employee to database



        }
    });

};

tabby_teasers_llc();











