
SELECT employees.first_name, employees.last_name, roles.title, roles.salary -- TO SEE ALL DATA IN TABLE BY LINKING THE COLUMNS TOGETHER. First, selecting employee first/last name from employees table and role title/salary from roles table..
FROM employees -- ..then, on the employee table..
LEFT JOIN roles ON employees.role_id = roles.id -- ...the employees table will join (from left) the roles table with/ON the column role_id in the employees table which will then become the id column in the roles table....then..
LEFT JOIN departments ON roles.department_id = departments.id -- ...the employees table will join (from left) the departments table with/ON the column role_id in the roles table which will then become the id column in the departments table..then..
LEFT JOIN employees AS manager ON employees.manager_id = manager.id; -- the employees table will also be given the name manager with/ON the manager_id column in the employees table which will then become the id column for managers.
