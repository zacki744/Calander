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
    SerchCompleteQuery:     SerchCompleteQuery,
    determin:               determin,
    findAllInTableHome:     findAllInTableHome,
    uppdate_WT:             uppdate_WT,
    deleteItemComplete:     deleteItemComplete,
    UpdateCapacity:         UpdateCapacity,
    GetCapacity:            GetCapacity,
    ParalelCount:           ParalelCount,
    ParalelInsert:          ParalelInsert
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
/**
* Show all entries in the selected table.
*
* @async
* @param {string} table A valid table name.
*
* @returns {RowDataPacket} Resultset from the query.
*/
async function findAllInTableHome() {
    let sql = 'CALL `kalender`.SELECT_ALL_HOME();';
    let res;

    res = await db.query(sql);
    return res[0];
}

/**
* Uppdates the other tabels when you add a new task and there are paralel tables
*
* @async
* @param {table}data the new task
* @param {table}allA all task in databas.
*
* @returns {null} 
*/
async function uppdate_WT(table, all, newLen) {
    let sql = `CALL Uppdate_WTwork(?, ?, ?)`;
    console.table(table);
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < all.length; j++) {
            if (all[j].id == table[i]) {
                let f_EstimatedDuration = all[j].EstimatedDuration + newLen;
                let ed = new Date(all[j].end)
                let newWTend = new Date(ed.setDate(ed.getDate() + (f_EstimatedDuration / all.cap[0].cap)));
        
                await db.query(sql, [all[j].id, newWTend, f_EstimatedDuration]);
            }
        }
    }
}

/**
* Finds an opening in the skedual. if no avalible spots exist it extends the work period by how many tasks there are in paralel
*
* @async
* @param {table}data the new task
* @param {table}allA all task in databas.
*
* @returns {list} paralel task list
*/
async function ParalelCount(data, all) {
    let matching = []
    // if no opening, how many tasks are in paralel
    for (let i = 0; i < all.length; i++) {
        var SD2 = new Date(all[i].WTstart);
        var SD1 = new Date(data.f_StartingTime);
        var ED1 = new Date(data.f_Deadline);
        var ED2 = new Date(all[i].WTend);

        if (ED1 <= ED2 || SD1 <= ED2) {
            if (ED1 >= SD2 || SD1 >= SD2) {
                matching.push(all[i].id); 
            }
        }
    }
    return matching
}

function lengthen_deadline(data, all) {
    var SD = new Date(data.f_StartingTime);
    var ED = new Date(data.f_Deadline);
    let WTstart = new Date(data.f_StartingTime);
    let WTend = new Date(SD.setDate(SD.getDate() + (data.f_EstimatedDuration / all.cap[0].cap)));
    let con = true;

    ED.setDate(ED.getDate() + 30);
    // find opening
    while (WTend < ED && con) {
        con = true;
        for (let i = 0; i < all.length; i++) {
            var SD2 = new Date(all[i].WTstart);
            var ED2 = new Date(all[i].WTend); 
            let overlap = WTstart < ED2 && SD2 < WTend;

            if (overlap) {
                con = false;
            }
        }
        if (con) {
            data.f_WTend = WTend;
            data.f_WTstart = WTstart;
            con = false;
        }
        else {
            con = true;
        }
        WTstart.setTime(WTstart.getTime() + 60 * 60 * 1000);
        WTend.setTime(WTend.getTime() + 60 * 60 * 1000);
    }
    if (!con) {
        data.newEnd = new Date(data.f_WTend);
        return -3;
    }
    else {
        return null;
    }
}

/**
* Finds an opening in the skedual. if no avalible spots exist it extends the work period by how many tasks there are in paralel
*
* @async
* @param {table}data the new task
* @param {table}allA all task in databas.
*
* @returns {int} 1 for true, the input and a amendment for false
*/
async function determin(data, all) {
    var SD = new Date(data.f_StartingTime);
    var ED = new Date(data.f_Deadline);
    let WTstart = new Date(data.f_StartingTime);
    let WTend = new Date(SD.setDate(SD.getDate() + (data.f_EstimatedDuration / all.cap[0].cap)));
    let con = true;
    let matching = [];
    let res = {};
    let checkForParalel;

    // find opening
    while (WTend < ED && con) {
        con = true;
        for (let i = 0; i < all.length; i++) {
            var SD2 = new Date(all[i].WTstart);
            var ED2 = new Date(all[i].WTend);           
            let overlap = WTstart < ED2 && SD2 < WTend;

            if (overlap) {
                con = false;
            }

        }
        if (con) {
            data.f_WTend = WTend;
            data.f_WTstart = WTstart;
            con = false;
        }
        else {
            con = true;
        }

        WTstart.setTime(WTstart.getTime() + 60 * 60 * 1000);
        WTend.setTime(WTend.getTime() + 60 * 60 * 1000);
    }
    console.table(all)

    if (!con) {
        return 1
    }
    else {
        if (lengthen_deadline(data, all) == -3) {
            return -3;
        }
    }
    
    if (WTend > ED) {
        checkForParalel = await ParalelCount(data, all)
        if (checkForParalel.length > 3) {
            return -4;
        }
        await ParalelInsert(data, all, checkForParalel);
        data.newEnd = new Date(data.f_WTend);
        return -1;
    }

    checkForParalel = await ParalelCount(data, all)
    await ParalelInsert(data, all, checkForParalel);
    data.matching = matching;
    console.log(checkForParalel)
    console.log(checkForParalel.length)
    if (checkForParalel.length > 3) {
        return -4;
    }
    return -2;
}

/**
* Finds an opening in the skedual. if no avalible spots exist it extends the work period by how many tasks there are in paralel
*
* @async
* @param {table}data the new task
* @param {table}allA all task in databas.
*
* @returns {int}
*/
async function ParalelInsert(data, all, matching) {
    var ED = new Date(data.f_Deadline);
    data.f_EstimatedDuration = data.f_EstimatedDuration * (1 + matching.length);
    data.f_WTstart = data.f_StartingTime;
    data.f_WTend = new Date(ED.setDate(ED.getDate() + (data.f_EstimatedDuration / all.cap[0].cap)))
}


async function insertItem(data) {
    let sql = 'CALL `kalender`.`insertInto`(?, ?, ?, ?, ?, ?, ?, ?)';

    await db.query(
        sql, [
            data.f_Description,
            data.f_Title,
            data.f_Category,
            data.f_StartingTime,
            data.f_Deadline,
            data.f_EstimatedDuration,
            data.f_WTstart,
            data.f_WTend
        ]);
    return true;
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
    let now = new Date();
    res = await db.query(sql);

    for (let row of res[0]) {
        let SD = new Date(row.actualStart);
        let ED = new Date(row.actualEnd);
        let diff = getDaysBetweenDates(ED, SD);

        if (SD < now && getDaysBetweenDates(now, SD) != 0) {
            if (ED <= now) {
                row.progressValue = "100%";
            }
            else {
                let temp = Math.round(((diff  - getDaysBetweenDates(now, SD)) / diff ) * 100);
                row.progressValue = (100 - temp) + '%';
            }
        }
        else {
            row.progressValue = "0%";
        }
    }
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

async function Complete(durr, _id) {
    let sql = "CALL `kalender`.COMPLETE_OBJ(?, ?);";
    console.log(durr, _id)
    await db.query(sql, [parseInt(_id), parseInt(durr)]);
}

async function Serch(param) {
    return serchQuery(param)
}

async function serchQuery(param) {
    let serchterm = '%' + param + '%';
    let sql = "CALL `kalender`.serch(?);";
    let res;

    console.log(serchterm)
    res = await db.query(sql, [serchterm]);
    return res[0];
}

function getDaysBetweenDates(d0, d1) {
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
    let serchterm = '%' + param + '%';
    let sql = "CALL `kalender`.serch_completed(?);";
    let res;

    res = await db.query(sql, [serchterm]);
    return res[0];
}

async function deleteItemComplete(_ID) {
    let sql = "CALL `kalender`.COMPLETE_DELETE( ?);";
    await db.query(sql, [_ID]);
}

async function UpdateCapacity(capacity) {
    let sql = "CALL UPDATE_CAPACITY(?);";
    await db.query(sql, [capacity]);
}

async function GetCapacity() {
    let sql = "CALL GET_CAPACITY();";
    let res = await db.query(sql);
    return res[0];
}