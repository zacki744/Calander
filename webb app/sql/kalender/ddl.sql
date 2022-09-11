-- MySQL Script generated by MySQL Workbench
-- Tue Aug 30 18:21:46 2022
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema kalender
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `kalender` ;

-- -----------------------------------------------------
-- Schema kalender
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kalender` DEFAULT CHARACTER SET utf8mb4 ;
USE `kalender` ;

-- -----------------------------------------------------
-- Table `kalender`.`taskManager`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kalender`.`taskManager` ;

CREATE TABLE IF NOT EXISTS `kalender`.`taskManager` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Description` VARCHAR(45) NULL,
  `StartingTime` DATETIME NULL,
  `Deadline` DATETIME NULL,
  `EstimatedDuration` INT NULL,
  `ActualDuration` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `kalender`.`completed` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Description` VARCHAR(45) NULL,
  `StartingTime` DATETIME NULL,
  `Deadline` DATETIME NULL,
  `EstimatedDuration` INT NULL,
  `ActualDuration` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

--
-- inserts a objekt in kalender
--
DROP PROCEDURE IF EXISTS `kalender`.`insertInto`;
DELIMITER ;;
CREATE PROCEDURE `kalender`.`insertInto`
(
	`f_Description`  VARCHAR(45),
    `f_StartingTime` DATETIME,
    `f_Deadline` DATETIME,
    `f_EstimatedDuration` INT,
    `f_ActualDuration` INT
)
BEGIN
	INSERT INTO `kalender`.`taskManager` (`Description`, `StartingTime`, `Deadline`, `EstimatedDuration`, `ActualDuration`)
	values(`f_Description`, `f_StartingTime` ,`f_Deadline`, `f_EstimatedDuration`, `f_ActualDuration`);
        
END
;;
DELIMITER ;

--
-- returns all where id = id
--
DROP PROCEDURE IF EXISTS SELECT_ALL_WHERE;
DELIMITER ;;

CREATE PROCEDURE SELECT_ALL_WHERE
(
_id INT
)
BEGIN
	SELECT DATE_FORMAT(StartingTime, '%Y-%m-%d %H:%i:%s') AS 
    start, DATE_FORMAT(Deadline, '%Y-%m-%d %H:%i:%s') AS end, 
    Description, id, EstimatedDuration, ActualDuration 
	FROM  `kalender`.`taskManager` WHERE `id` = _id;
END
;;
DELIMITER ;

--
-- returns all where 
--
DROP PROCEDURE IF EXISTS SELECT_ALL;
DELIMITER ;;

CREATE PROCEDURE SELECT_ALL()
BEGIN
	SELECT DATE_FORMAT(StartingTime, '%Y-%m-%d %H:%i:%s') AS 
    start, DATE_FORMAT(Deadline, '%Y-%m-%d %H:%i:%s') AS end, 
    Description, id, EstimatedDuration, ActualDuration 
	FROM  `kalender`.`taskManager`;
END
;;
DELIMITER ;

--
-- updates a objekt
--
DROP PROCEDURE IF EXISTS `kalender`.`uppdate_objekt`;
DELIMITER ;;
CREATE PROCEDURE `kalender`.`uppdate_objekt`
(
	`f_id` INT,
	`f_Description`  VARCHAR(45),
    `f_StartingTime` DATETIME,
    `f_Deadline` DATETIME,
    `f_EstimatedDuration` INT,
    `f_ActualDuration` INT
)
BEGIN
	UPDATE `kalender`.`taskManager` SET `Description` = `f_Description`,
    `StartingTime` = `f_StartingTime`,
    `Deadline` = `f_Deadline`,
    `EstimatedDuration` = `f_EstimatedDuration`,
    `ActualDuration` = `f_ActualDuration`
    WHERE
		`id` = `f_id`;
        
END
;;
DELIMITER ;

--
-- updates a objekt
--
DROP PROCEDURE IF EXISTS delete_object;
DELIMITER ;;
CREATE PROCEDURE delete_object
(
_id INT
)
BEGIN
		DELETE FROM  `kalender`.`taskManager` WHERE `id` = _id;
END
;;
DELIMITER ;

--
-- returns all for gant formated 
--
DROP PROCEDURE IF EXISTS SELECT_ALL_for_gant;
DELIMITER ;;

CREATE PROCEDURE SELECT_ALL_for_gant()
BEGIN
	SELECT 
    id,
    Description AS name, 
    DATE_FORMAT(StartingTime, '%Y-%m-%d %H:%i:%s') AS actualStart, 
    DATE_FORMAT(Deadline, '%Y-%m-%d %H:%i:%s') AS actualEnd
	FROM  `kalender`.`taskManager`;
END
;;
DELIMITER ; 
