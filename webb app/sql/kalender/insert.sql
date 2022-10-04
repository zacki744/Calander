-- Active: 1660827563038@@127.0.0.1@3306@eshop
USE `kalender`;

INSERT INTO `kalender`.`taskManager` (Title, Category, Description, StartingTime, Deadline, EstimatedDuration, WTstart, WTend)
VALUES ("first", "skool", "ksudkfgb", now(), (now() + INTERVAL 10 DAY), 12,  now(), (now() + INTERVAL 10 DAY));

INSERT INTO `kalender`.`taskManager` (Title, Category, Description, StartingTime, Deadline, EstimatedDuration, WTstart, WTend)
VALUES ("second", "work", "ksudkfgb", (now() + INTERVAL 10 DAY), (now() + INTERVAL 20 DAY), 12,  (now() + INTERVAL 10 DAY), (now() + INTERVAL 20 DAY));

INSERT INTO `kalender`.`taskManager` (Title, Category, Description, StartingTime, Deadline, EstimatedDuration, WTstart, WTend)
VALUES ("therd", "skool", "ksudkfgb", (now() + INTERVAL 20 DAY), (now() + INTERVAL 30 DAY), 12,  (now() + INTERVAL 20 DAY), (now() + INTERVAL 30 DAY));



select * from `kalender`.`taskManager`;


