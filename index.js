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
        switch (input.viewData) { // the chosen input will be used to to gain access to the viewData property from above
            case 'View Departments': // when the user selects 'vew departments' from the list prompt, this is executed ->
                db.query('SELECT name AS departments FROM departments', (err, data) => { // database that grabs the data from departments and calls it 'departments' instead of what it is actuallty called, 'name'
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
                    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
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
                    `SELECT roles.title, roles.salary, roles.id, departments.name AS department  
                    FROM roles JOIN departments ON roles.department_id = departments.id`, (err, data) => { 
                    //From the roles table, the title, salary data is collected. From departments table, name is collected. 
                    // department name is given the alias of 'department'
                    // from the roles table, departments table is joined on the roles table, column departments_id which will become the department id
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
                            // Using the map method in function to create a new array from the name and id in departments
                            // This will give the user the department choices. The 'name' is what the user will see in the list, 
                            // and the 'value' is what will be used once selected by the user. This data will = roleDept and then inserted below.
                            choices: departments.map(dept => ({ name: dept.name, value: dept.id }))
                        }
                    ]).then((input) => {
                        // inserting the new role with title, salary and department_id (user selects department id above) into the database 
                        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);', [input.roleTitle, input.roleSalary, input.roleDept], (err) => {
                            if (err) throw err;
                            console.log('New role has been added.');
                            tabby_teasers_llc();
                        });
                    });
                });
                break;

            // Adding employee to database
            case 'Add Employee':
                // Selecting id and title from the roles table
                db.query('SELECT id, title FROM roles;', (err, roles) => {
                    if (err) throw err;
                    // Selecting id, concatenating (so full names sow) the first and last name from the employees table, where the employees name will replace the manager_id, where the mananger_id column is null (the bosses) as an alias
                    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees WHERE manager_id IS NULL;', (err, managers) => {
                        if (err) throw err;

                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'empFirstName',
                                message: 'What is the employees first name?',
                                validate: empFirstName => {
                                    if (empFirstName === '') {
                                        return 'Cannot be left blank. A first name must be added.';
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            {
                                type: 'input',
                                name: 'empLastName',
                                message: 'What is the employees last name?',
                                validate: empLastName => {
                                    if (empLastName === '') {
                                        return 'Cannot be left blank. A last name must be added.';
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            {
                                type: 'list',
                                name: 'empRole',
                                message: 'What is the employees role?',
                                choices: roles.map(role => ({ name: role.title, value: role.id }))
                            },
                            {
                                type: 'list',
                                name: 'empManager',
                                message: 'Who is the employees manager?',
                                // Taking managers name where they are null (the employees in the data base who do not have managers are null, therefore null = manangers.) and the user a list of mannagers
                                // ..to pick from. Concatenating method to add literally template as as an option that the new employee IS a mananger, therefore doesnt need to have one assigned.
                                choices: managers.map(manager => ({ name: manager.name, value: manager.id })).concat([{ name: `This employee is a manager`, value: null }])
                            }
                        ]).then((empData) => {
                            // Inserting the new employee name, last name, role, and newly created manager name into employee table database
                            db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);',
                                [empData.empFirstName, empData.empLastName, empData.empRole, empData.empManager], (err) => {
                                    if (err) throw err;
                                    console.log('New employee has been added.');
                                    tabby_teasers_llc();
                                });
                        });
                    });
                });
                break;
            case 'Update Employee Role':
                // Selecting id and name from the employees table in the database
                db.query('SELECT id, CONCAT(first_name, " ", last_name) as name FROM employees;', (err, employees) => {
                    if (err) throw (err);
                    // Selecting the id and title from the roles database
                    db.query('SELECT id, title FROM roles;', (err, roles) => {
                        if (err) throw (err);
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'emp',
                                message: 'Select an employee you want to update.',
                                choices: employees.map(emp => ({ name: emp.name, value: emp.id }))
                            },
                            {
                                type: 'list',
                                name: 'empNewRole',
                                message: "Select a new role for this employee.",
                                choices: roles.map(role => ({ name: role.title, value: role.id }))
                            }
                        ]).then((answers) => {
                            // Updating the employee's new role into the database
                            db.query('UPDATE employees SET role_id = ? WHERE id = ?;', [answers.empNewRole, answers.emp], (err) => {
                                if (err) throw (err);
                                console.log(`Employee has been updated to their new role.`);
                                tabby_teasers_llc();
                            });
                        });
                    });
                });
                break;
        }
    });

};

tabby_teasers_llc();







