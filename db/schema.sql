DROP DATABASE IF EXISTS tabby_teasers_llc_db;

CREATE DATABASE tabby_teasers_llc_db;

USE tabby_teasers_llc_db;

CREATE TABLE departments( -- a table created for 'departments'
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, -- a uniuqe id will be given to the department table, which is auto generated
    name VARCHAR(50) -- the name of the department, 50 characters max
);

CREATE TABLE roles( -- a table created for 'roles'
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,  -- a uniuqe id will be given to the roles table, which is auto generated
    title VARCHAR(50) NOT NULL, -- the name of the role, 50 characters max
    salary DECIMAL NOT NULL, -- the salary of the role, which will be a number
    department_id INT, -- department_id shows the relationship betweeent the roles and departments. It will be given a number as an id
    FOREIGN KEY (department_id) -- the id/number given to the department_id will be used 
    REFERENCES departments(id) -- this indicates where it is referencing from, which is from the department table, using the id/number primary key
);

CREATE TABLE employees( -- a table created for 'employees'
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, -- a uniuqe id will be given to the employees table, which is auto generated
    first_name VARCHAR(50), -- the first name of the employee, 50 characters max
    last_name VARCHAR(50), -- the last name of the employee, 50 characters max
    role_id INT NOT NULL, -- role_id shows the relationship betweeen the employees and roles table. It will be given a number as an id
    manager_id INT, -- manager_id shows the relationship betweeen the employees and roles table. It will be given a number as an id. Did not add null as some employees may not have a manager so will be left blank
    FOREIGN KEY (role_id) -- the id/number given to the role_id will be used 
    REFERENCES roles(id),  -- references the 'id' in the 'roles' table
    FOREIGN KEY (manager_id) -- the id/number given to the manager_id will be used 
    REFERENCEs employees(id) -- references the 'id' in the 'employees' table 
);
