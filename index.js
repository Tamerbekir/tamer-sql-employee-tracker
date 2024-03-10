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

let tabby_teasers_llc = function() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'viewData',
            message: 'Welcome to Tabby Teasers LLC! What would you like to do?',
            choices: ['View Departments', 'View Employees', 'View Roles', 'Add Department', 'Add Employee', 'Add Role', 'Update Employee Role']
        }]).then((input) => {
            if (input.viewData === 'View Departments') {
                db.query('SELECT * FROM departments;', (err, data) => {
                    if (err) throw err;
                    console.log("Departments:");
                    console.log(data);
                    tabby_teasers_llc();
                });
            }
            //adding mor eoptions here
        });
};

tabby_teasers_llc();
