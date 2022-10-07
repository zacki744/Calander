-- Active: 1660827563038@@127.0.0.1@3306@eshop
CREATE USER 'maria'@'%' IDENTIFIED VIA mysql_native_password USING '*23AE809DDACAF96AF0FD78ED04B6A265E05AA257';
GRANT ALL PRIVILEGES ON *.* to 'maria'@'%' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
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