-- Active: 1660827563038@@127.0.0.1@3306@eshop
USE `kalender`;

INSERT INTO `kalender`.`taskManager` (Title, Category, Description, StartingTime, Deadline, EstimatedDuration, WTstart, WTend)
VALUES ("first", "skool", "ksudkfgb", (now() - INTERVAL 10 DAY), (now() + INTERVAL 1 DAY), 160,  (now() - INTERVAL 10 DAY), (now() + INTERVAL 1 DAY));

INSERT INTO `kalender`.`taskManager` (Title, Category, Description, StartingTime, Deadline, EstimatedDuration, WTstart, WTend)
VALUES ("second", "work", "ksudkfgb", (now() + INTERVAL 5 DAY), (now() + INTERVAL 10 DAY), 80,  (now() + INTERVAL 5 DAY), (now() + INTERVAL 10 DAY));

INSERT INTO `kalender`.`taskManager` (Title, Category, Description, StartingTime, Deadline, EstimatedDuration, WTstart, WTend)
VALUES ("therd", "skool", "ksudkfgb", (now() + INTERVAL 12 DAY), (now() + INTERVAL 20 DAY), 80,  (now() + INTERVAL 12 DAY), (now() + INTERVAL 20 DAY));

INSERT INTO capacity(cap) VALUES (8);


CALL GET_CAPACITY();