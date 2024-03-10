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
                db.query('SELECT * FROM employees;', (err, data) => {
                    if (err) throw (err);
                    console.log("Employees: ");
                    console.table(data);
                    tabby_teasers_llc();
                });
                break;
            case 'View Roles':
                db.query('SELECT * FROM roles;', (err, data) => {
                    if (err) throw (err);
                    console.log('Roles: ')
                    console.table(data);
                    tabby_teasers_llc();
                });
                break;


// For adding to database


        }
    });
};

tabby_teasers_llc();
