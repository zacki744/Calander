/**
* A module exporting functions to access the bank database.
*/
"use strict";
module.exports = {
    findAllInTable: findAllInTable,
    showCategorys:  showCategorys,
    findAllInTableGant: findAllInTableGant,
    showCategorysGant:  showCategorysGant,
    insertItem:     insertItem,
    getOne:         getOne,
    UpdateItem:     UpdateItem,
    deleteItem:     deleteItem,
};

const mysql  = require("promise-mysql");
const config = require("../config/db/calendar.json");
let db;



/**
* Main function.
* @async
* @returns void
*/
(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();


async function showCategorys() {
    return findAllInTable();
}
/**
* Show all entries in the selected table.
*
* @async
* @param {string} table A valid table name.
*
* @returns {RowDataPacket} Resultset from the query.
*/
async function findAllInTable() {
    let sql = 'CALL `kalender`.SELECT_ALL();';
    let res;

    res = await db.query(sql);
    return res[0];
}

async function insertItem(data) {
    let sql = 'CALL `kalender`.`insertInto`(?, ?, ?, ?, ?)';
    let res = await db.query(
        sql, [data.f_Description,
            data.f_StartingTime,
            data.f_Deadline,
            data.f_EstimatedDuration,
            data.f_ActualDuration]);

    return res;
}

async function getOne(id) {
    let sql = "CALL `kalender`.SELECT_ALL_WHERE(?);";
    let res = await db.query(sql, [parseInt(id)]);

    return res[0];
}

async function UpdateItem(data) {
    let sql = "CALL `kalender`.`uppdate_objekt`(?, ?, ?, ?, ?, ?);";
    let res = await db.query(
        sql, [data.f_id,
            data.f_Description,
            data.f_StartingTime,
            data.f_Deadline,
            data.f_EstimatedDuration,
            data.f_ActualDuration]);

    return res;
}

async function deleteItem(id) {
    let sql = "CALL delete_object(?);";
    let res = await db.query(sql, [id]);

    return res;
}

async function showCategorysGant() {
    return findAllInTableGant();
}
/**
* Show all entries in the selected table.
*
* @async
* @param {string} table A valid table name.
*
* @returns {RowDataPacket} Resultset from the query.
*/
async function findAllInTableGant() {
    let sql = 'CALL `kalender`.SELECT_ALL_for_gant();';
    let res;

    res = await db.query(sql);
    return res[0];
}
