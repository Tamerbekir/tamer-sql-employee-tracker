
INSERT INTO departments(name) 
        VALUES('Naptime Negotiations'),
            ('Purrchasing'), 
            ('Feline Finance'),
            ('Meowketing and Communications'), 
            ('Treat Distribution'); 


INSERT INTO roles(title, salary, department_id) 
        VALUES('Snoozing Officer', 10000, 1),
            ('Seinor Snoozing Officer', 100000, 1), 
            ('Furball Funds', 65000, 2), 
            ('Whisker Wealth Advisor', 54000, 2),
            ('Kitty Content Creator', 59000, 3),
            ('Purrblic Relations', 54000, 3),
            ('Chief Treat Officer', 84000, 4),
            ('Senior Snack Supervisor', 105000, 4);


INSERT INTO employees(first_name, last_name, role_id, manager_id) 
    VALUES('Max', 'Rainbowfur', 7, NULL),
            ('Miley', 'Bekir', 8, NULL), 
            ('Fluffy', 'White-Tail', 2, NULL),
            ('Luna', 'Blackheart', 3, 3),  
            ('Pasa', 'Akbas', 2, 2),
            ('Torbie', 'Cole', 5, 3),
            ('Gigi', 'Akbas', 6, 1),
            ('Brownie', 'Akbas', 1, 2),
            ('Orero', 'Puff', 5, 1),
            ('Zoey', 'Solomon', 4, 1);