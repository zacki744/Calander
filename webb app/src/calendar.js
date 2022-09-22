/**
* A module exporting functions to access the bank database.
*/
"use strict";
module.exports = {
    findAllInTable:         findAllInTable,
    showCategorys:          showCategorys,
    findAllInTableGant:     findAllInTableGant,
    showCategorysGant:      showCategorysGant,
    findAllInTableComplete: findAllInTableComplete,
    showCategorysComplete:  showCategorysComplete,
    insertItem:             insertItem,
    getOne:                 getOne,
    UpdateItem:             UpdateItem,
    deleteItem:             deleteItem,
    Complete:               Complete,
    Serch:                  Serch,
    serchQuery:             serchQuery,
    getDaysBetweenDates:    getDaysBetweenDates,
    SerchComplete:          SerchComplete,
    SerchCompleteQuery:     SerchCompleteQuery
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
    let sql = 'CALL `kalender`.`insertInto`(?, ?, ?, ?, ?, ?)';
    let res = await db.query(
        sql, [
            data.f_Description,
            data.f_Title,
            data.f_Category,
            data.f_StartingTime,
            data.f_Deadline,
            data.f_EstimatedDuration
        ]);

    return res;
}

async function getOne(id) {
    let sql = "CALL `kalender`.SELECT_ALL_WHERE(?);";
    let res = await db.query(sql, [parseInt(id)]);

    return res[0];
}

async function UpdateItem(data) {
    let sql = "CALL `kalender`.`uppdate_objekt`(?, ?, ?, ?, ?, ?, ?);";
    let res = await db.query(
        sql, [
            data.f_id,
            data.f_Description,
            data.f_Title,
            data.f_Category,
            data.f_StartingTime,
            data.f_Deadline,
            data.f_EstimatedDuration
        ]);

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

async function showCategorysComplete() {
    return findAllInTableComplete();
}
/**
* Show all entries in the selected table.
*
* @async
* @param {string} table A valid table name.
*
* @returns {RowDataPacket} Resultset from the query.
*/
async function findAllInTableComplete() {
    let sql = 'CALL `kalender`.SELECT_ALL_COMPLETE();';
    let res;

    res = await db.query(sql);
    return res[0];
}

async function Complete(_id) {
    let sql = "CALL `kalender`.COMPLETE_OBJ('?', ?);";
    let sql2 = `SELECT DATE_FORMAT(StartingTime, '%Y-%m-%d %H:%i:%s') AS start FROM  kalender.taskManager WHERE id = ?`;
    let res;
    var diff;

    let start = await db.query(sql2, [_id])
    diff = getDaysBetweenDates(Date.now(), start[0].start);
    res = await db.query(sql, [parseInt(_id), (diff * 5)]);
}

async function Serch(param) {
    return serchQuery(param)
}

async function serchQuery(param) {
    let sql = "CALL `kalender`.serch(?);";
    let res;

    console.log(param)
    res = await db.query(sql, [param]);
    return res[0];
}

function getDaysBetweenDates(d0, d1) {
    console.log(d0);
    console.log(d1);
    var msPerDay = 8.64e7;
  
    // Copy dates so don't mess them up
    var x0 = new Date(d0);
    var x1 = new Date(d1);
  
    // Set to noon - avoid DST errors
    x0.setHours(12,0,0);
    x1.setHours(12,0,0);
  
    // Round to remove daylight saving errors
    return Math.round( (x0 - x1) / msPerDay );
}

async function SerchComplete(param) {
    return SerchCompleteQuery(param)
}

async function SerchCompleteQuery(param) {
    let sql = "CALL `kalender`.serch_completed(?);";
    let res;

    console.log(param)
    res = await db.query(sql, [param]);
    return res[0];
}
