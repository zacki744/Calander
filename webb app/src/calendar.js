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
    deleteItemComplete:     deleteItemComplete
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
                let newWTend = new Date(ed.setDate(ed.getDate() + (f_EstimatedDuration / 8)));
        
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
* @returns {int} 1 for true, -1 for fals
*/
async function determin(data, all) {
    let matching = [];
    var SD = new Date(data.f_StartingTime);
    var ED = new Date(data.f_Deadline);
    let WTstart = new Date(data.f_StartingTime);
    let WTend = new Date(SD.setDate(SD.getDate() + (data.f_EstimatedDuration / 8)))
    let con = true;

    // find opening


    while (WTend < ED && con) {
        for (let i = 0; i < all.length; i++) {
            var SD2 = new Date(all[i].WTstart);
            var ED2 = new Date(all[i].WTend);
    
            if (WTend <= ED2 || WTstart <= ED2) {
                if (WTend >= SD2 || WTstart >= SD2) {
                    con = false;
                }
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

        WTstart = new Date(WTstart.setDate(WTstart.getDate() + 1))
        WTend = new Date(WTend.setDate(WTend.getDate() + 1))
    }
    
    if (!con) {
        return 1
    }
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

    data.f_EstimatedDuration = data.f_EstimatedDuration * (1 + matching.length);

    if (data.f_EstimatedDuration >= (getDaysBetweenDates(data.f_Deadline, data.f_StartingTime) * 8)) {
        return -1;
    }

    //uppdate the paralel tasks
    if (matching.length > 0) {
        await uppdate_WT(matching, all, data.f_EstimatedDuration);
    }
    data.f_WTstart = data.f_StartingTime;
    data.f_WTend = new Date(ED.setDate(ED.getDate() + (data.f_EstimatedDuration / 8)))
    return 1;
}


async function insertItem(data) {
    let sql = 'CALL `kalender`.`insertInto`(?, ?, ?, ?, ?, ?, ?, ?)';
    let all = await findAllInTable();
    let returnValue = await determin(data, all);
    let res;

    if (returnValue > -1) {
        res = await db.query(
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
    return false;
}

async function getOne(id) {
    let sql = "CALL `kalender`.SELECT_ALL_WHERE(?);";
    let res = await db.query(sql, [parseInt(id)]);

    return res[0];
}

async function UpdateItem(data) {
    await deleteItem(data.f_id);
    await insertItem(data);
   /* let sql = "CALL `kalender`.`uppdate_objekt`(?, ?, ?, ?, ?, ?, ?);";
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

    return res;*/
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
        if (SD <= now) {
            if (ED <= now) {
                row.progressValue = "100%";
            }
            else {
                console.log(diff)
                console.log(getDaysBetweenDates(now, SD))
                let temp = Math.round((diff  - getDaysBetweenDates(now, SD)) / (((diff  + getDaysBetweenDates(now, SD))/ 2)) * 100);
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

async function Complete(_id) {
    let sql = "CALL `kalender`.COMPLETE_OBJ(?, ?);";
    await db.query(sql, [parseInt(_id[1]), parseInt(_id[0])]);
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
