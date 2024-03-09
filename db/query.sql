SELECT employees.*, roles.title, roles.salary
FROM employees
JOIN roles ON employees.role_id = roles.id;
