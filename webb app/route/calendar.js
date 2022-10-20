"use strict"
const { jsPDF }         = require("jspdf");
const express           = require("express");
const calender          = require("../src/calendar.js")
const router            = express.Router();
const ejs               = require('ejs');
const path              = require('node:path');
const nodeHtmlToImage   = require('node-html-to-image');
const fs                  = require('fs');
var XLSX = require("xlsx");



// Add a route for the path /home
router.get("/Home", async (req, res) => {
    let data= {
        title: "Home"
    };
    data.confirm = 1;
    data.result = "A summary of all of your aktivites";
    data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    data.res = await calender.findAllInTableHome();
    data.cap = await calender.GetCapacity();

    for (let i = 0; i < data.res.length; i++) {
        if((data.res[i].Description).length > 22) {
            data.res[i].Description = data.res[i].Description.substring(0, 20) + "...";
        }
    }
    
    res.render("home", data);
});

router.get("/Home/serch", async (req, res) => {
    let data= {
        title: "Home"
    };
    data.confirm = 1;
    data.result = "A summary of all of your aktivites";
    data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    data.res = await calender.Serch(req.url.split('=')[1]);
    data.cap = await calender.GetCapacity();

    for (let i = 0; i < data.res.length; i++) {
        if((data.res[i].Description).length > 22) {
            data.res[i].Description = data.res[i].Description.substring(0, 20) + "...";
        }
    }

    res.render("home", data);
});

router.get("/complete", async (req, res) => {
    let data= {
        title: "complete"
    };

    data.res = await calender.showCategorysComplete()
    res.render("complete", data);
});

router.get("/complete/serch", async (req, res) => {
    let data= {
        title: "complete"
    };

    data.res = await calender.SerchComplete(req.url.split('=')[1])
    res.render("complete", data);
});

router.get("/", async (req, res) => {
    let data= {
        title: "Home"
    };
    data.confirm = 1;
    data.result = "A summary of all of your aktivites";
    data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    data.res = await calender.findAllInTableHome();
    data.cap = await calender.GetCapacity();

    for (let i = 0; i < data.res.length; i++) {
        if((data.res[i].Description).length > 22) {
            data.res[i].Description = data.res[i].Description.substring(0, 20) + "...";
        }
    }
    res.render("home", data);}
);

router.get("/Export", async (req, res) => {
    let data= {
        title: "Export"
    };
    res.render("Export", data);
});

router.get("/Export/PDF/Complete", async (req, res) => {
    let data= {
        title: "Export"
    };
    try {
        fs.unlinkSync(path.join(__dirname, '..', 'generated.pdf'));
        console.log("File removed:", path.join(__dirname, '..', 'generated.pdf'));
        fs.unlinkSync(path.join(__dirname, '..','image.png'));
        console.log("File removed:", path.join(__dirname, '..','image.png'));
    } catch (err) {
        console.error(err);
    }
    data.res = await calender.findAllInTableComplete();
    let pdf = new jsPDF('p', 'mm', 'a4');

    // render the ejs file
    ejs.renderFile(path.join(__dirname, '..', 'views', 'resultat', 'rescomplete.ejs'), data, {}, function(err, str) {
        if (err) return res.send(err);
        nodeHtmlToImage({
            output: './image.png',
            html: str
        }).then(() => {
            var imgData = 'data:image/png;base64,'+ fs.readFileSync(path.join(__dirname, '..','image.png'), 'base64');
            pdf.addImage(imgData, 'png', 15, 40, 180, 160);
            pdf.save();
            res.download(path.join(__dirname, '..', 'generated.pdf'), 'generated.pdf');
        });
    });
});

router.get("/Export/PDF/Ongoing", async (req, res) => {
    let data= {
        title: "Export"
    };
    try {
        fs.unlinkSync(path.join(__dirname, '..', 'generated.pdf'));
        console.log("File removed:", path.join(__dirname, '..', 'generated.pdf'));
        fs.unlinkSync(path.join(__dirname, '..','image.png'));
        console.log("File removed:", path.join(__dirname, '..','image.png'));
    } catch (err) {
        console.error(err);
    }

    data.res = await calender.findAllInTableHome();

    let pdf = new jsPDF('p', 'mm', 'a4'); 
    // render the ejs file
    ejs.renderFile(path.join(__dirname, '..', 'views', 'resultat', 'resultat.ejs'), data, {}, function(err, str) {
        if (err) return res.send(err);
        nodeHtmlToImage({
            output: './image.png',
            html: str
        }).then(() => {
            var imgData = 'data:image/png;base64,'+ fs.readFileSync(path.join(__dirname, '..','image.png'), 'base64');
            pdf.addImage(imgData, 'png', 15, 40, 180, 160);
            pdf.save();
            res.download(path.join(__dirname, '..', 'generated.pdf'), 'generated.pdf');
        });
    });
});

router.get("/Export/PDF/All", async (req, res) => {
    let data= {
        title: "Export"
    };
    try {
        fs.unlinkSync(path.join(__dirname, '..', 'generated.pdf'));
        console.log("File removed:", path.join(__dirname, '..', 'generated.pdf'));
        fs.unlinkSync(path.join(__dirname, '..','image.png'));
        console.log("File removed:", path.join(__dirname, '..','image.png'));
    } catch (err) {
        console.error(err);
    }
    data.res2 = await calender.findAllInTableComplete();
    data.res = await calender.findAllInTableHome();

    let pdf = new jsPDF('p', 'mm', 'a4');

    
    // render the ejs file
    ejs.renderFile(path.join(__dirname, '..', 'views', 'resultat', 'resAll.ejs'), data, {}, function(err, str) {
        if (err) return res.send(err);
        nodeHtmlToImage({
            output: './image.png',
            html: str
        }).then(() => {
            var imgData = 'data:image/png;base64,'+ fs.readFileSync(path.join(__dirname, '..','image.png'), 'base64');
            pdf.addImage(imgData, 'png', 15, 40, 200, 170);
            pdf.save();
            res.download(path.join(__dirname, '..', 'generated.pdf'), 'generated.pdf');
        });
    });
});

//export excel
router.get("/Export/EX/Complete", async (req, res) => {
    let data = {
        title: "Export"
    };
    try {
        fs.unlinkSync(path.join(__dirname, '..', 'excelFromComplete.xlsx'));
        console.log("File removed:", path.join(__dirname, '..', 'excelFromComplete.xlsx'));
    } catch (err) {
        console.error(err);
    }
    data.table = await calender.showCategorysComplete();
    let table = [];
    let row = [];
    console.log(data.table[0])
    console.log(data.table[1])
    table.push(['id', 'Title', 'Category', 'Description', 'start', 'end', 'EstimatedDuration', 'ActualDuration'])
    for (let index = 0; index < data.table.length; index++) {
        let row = [];
        row.push(data.table[index].id);
        row.push(data.table[index].Title);
        row.push(data.table[index].Category);
        row.push(data.table[index].Description);
        row.push(data.table[index].start);
        row.push(data.table[index].end);
        row.push(data.table[index].EstimatedDuration);
        row.push(data.table[index].ActualDuration);
        table.push(row);
        console.log(row);
    }
    // render the ejs file
    var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(table);
    workbook.SheetNames.push("excelFromComplete");
    workbook.Sheets
    workbook.Sheets["excelFromComplete"] = worksheet;
    XLSX.writeFile(workbook, "excelFromComplete.xlsx");
    res.download(path.join(__dirname, '..', 'excelFromComplete.xlsx'), 'excelFromComplete.xlsx');

});

router.get("/Export/EX/Ongoing", async (req, res) => {
    let data = {
        title: "Export"
    };
    try {
        fs.unlinkSync(path.join(__dirname, '..', 'excelOngiong.xlsx'));
        console.log("File removed:", path.join(__dirname, '..', 'excelOngiong.xlsx'));
    } catch (err) {
        console.error(err);
    }
    data.table = await calender.findAllInTableHome();
    let table = [];
    table.push(['id', 'Title', 'Category', 'Description', 'WTstart', 'WTend', 'Deadline', 'EstimatedDuration', ])
    for (let index = 0; index < data.table.length; index++) {
        let row = [];
        row.push(data.table[index].id);
        row.push(data.table[index].Title);
        row.push(data.table[index].Category);
        row.push(data.table[index].Description);
        row.push(data.table[index].WTstart);
        row.push(data.table[index].WTend);
        row.push(data.table[index].end);
        row.push(data.table[index].EstimatedDuration);
        table.push(row);
        console.log(row);
    }
    // render the ejs file
    var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(table);
    workbook.SheetNames.push("excelOngiong");
    workbook.Sheets
    workbook.Sheets["excelOngiong"] = worksheet;
    XLSX.writeFile(workbook, "excelOngiong.xlsx");
    res.download(path.join(__dirname, '..', 'excelOngiong.xlsx'), 'excelOngiong.xlsx');
});

router.get("/Export/EX/All", async (req, res) => {
    let data = {
        title: "Export"
    };
    try {
        fs.unlinkSync(path.join(__dirname, '..', 'excelFromComplete.xlsx'));
        console.log("File removed:", path.join(__dirname, '..', 'excelFromComplete.xlsx'));
    } catch (err) {
        console.error(err);
    }
    data.table = await calender.showCategorysComplete();
    let table = [];
    let row = [];
    table.push(['id', 'Title', 'Category', 'Description', 'start', 'end', 'EstimatedDuration', 'ActualDuration'])
    for (let index = 0; index < data.table.length; index++) {
        let row = [];
        row.push(data.table[index].id);
        row.push(data.table[index].Title);
        row.push(data.table[index].Category);
        row.push(data.table[index].Description);
        row.push(data.table[index].start);
        row.push(data.table[index].end);
        row.push(data.table[index].EstimatedDuration);
        row.push(data.table[index].ActualDuration);
        table.push(row);
        console.log(row);
    }
    table.push([])
    table.push([])
    table.push([])
    data.table2 = await calender.findAllInTableHome();

    table.push(['id', 'Title', 'Category', 'Description', 'WTstart', 'WTend', 'Deadline', 'EstimatedDuration', ])
    for (let index = 0; index < data.table2.length; index++) {
        let row = [];
        row.push(data.table2[index].id);
        row.push(data.table2[index].Title);
        row.push(data.table2[index].Category);
        row.push(data.table2[index].Description);
        row.push(data.table2[index].WTstart);
        row.push(data.table2[index].WTend);
        row.push(data.table2[index].end);
        row.push(data.table2[index].EstimatedDuration);
        table.push(row);
        console.log(row);
    }

    // render the ejs file
    var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(table);
    workbook.SheetNames.push("excelFromComplete");
    workbook.Sheets
    workbook.Sheets["excelFromComplete"] = worksheet;
    XLSX.writeFile(workbook, "excelFromComplete.xlsx");
    res.download(path.join(__dirname, '..', 'excelFromComplete.xlsx'), 'excelFromComplete.xlsx');
});


router.post("/Home", async (req, res) => {
    let data= {
        title: "Home"
    };
    data.confirm = 1;
    if ((typeof req.body.comp_EstimatedDuration) == 'string') {
        // move objekt to complete
        console.log(data.body)
        await calender.Complete(req.body.comp_EstimatedDuration, req.body.comp_id);
        // ridirect to completed
        res.redirect("/calendar/complete")
    }
    else if ((typeof req.body.f_capacity) == 'string') {
        // update capacity
        await calender.UpdateCapacity(req.body.f_capacity);
        // ridirect to home
        res.redirect("/calendar/Home")
    } else if ((typeof req.body.c_Deadline) == 'string') {
        let temp = {};
        temp.f_Title = req.body.c_title;
        temp.f_Category = req.body.c_Category;
        temp.f_Description = req.body.c_Description;
        temp.f_StartingTime = req.body.c_StartingTime;
        temp.f_WTstart = req.body.c_StartingTime;
        temp.f_WTend = req.body.c_Deadline;
        temp.f_Deadline = req.body.c_Deadline;

        temp.f_EstimatedDuration = req.body.c_EstimatedDuration;
        await calender.insertItem(temp);
        res.redirect("/calendar/Home"); 
    }
    else {
        let all = await calender.findAllInTable();
        all.cap = await calender.GetCapacity();
        const returnValue = await calender.determin(req.body, all);

        // the checks where returned that nothing needed to change
        data.result = req.body;
        if (returnValue == 1) {
            await calender.insertItem(data.result); 
        }
        //in the case that the deadline was to close and the expekted duration was to high
        else if (returnValue == -1) {
            data.confirm = -1;
        }
        //if task in pipeline extends the working period check with user if ok
        else if(returnValue == -2) {
            data.confirm = -2;
        }
        else if (returnValue == -3) {
            data.confirm = -3
        }
        //if the given task is simply unecceptable
        else if (returnValue == -4) {
            data.confirm = -4
        }
        data.res = await calender.findAllInTableHome();
        data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
        data.cap = await calender.GetCapacity();
        
        for (let i = 0; i < data.res.length; i++) {
            if((data.res[i].Description).length > 22) {
                data.res[i].Description = data.res[i].Description.substring(0, 20) + "...";
            }
        }
        res.render("home", data);
    }
});


router.get("/update/:id", async (req, res) => {
    let data = {
        title: "Update"
    };

    data.obj = await calender.getOne(req.params.id);
    res.render("update.ejs", data);
});

router.get("/complete/:id", async (req, res) => {
    let data = {
        title: "complete"
    };

    await calender.Complete(req.params.id);
    data.res = await calender.showCategorysComplete();
    res.render("complete", data);
});


router.post("/update/:id", async (req, res) => {
    await calender.UpdateItem(req.body);
    res.redirect("../Home");
});

router.get("/delete/:id", async (req, res) => {
    await calender.deleteItem(req.params.id);
    res.redirect("../Home");
});

router.get("/complete/delete/:id", async (req, res) => {
    await calender.deleteItemComplete(req.params.id);
    res.redirect("../../complete");
});


router.get("/pipeline", async (req, res) => {
    let data = {
        title: "pipeline"
    };
    
    data.obj = await calender.showCategorysGant();
    data.res = await calender.findAllInTableHome();
    res.render("pipeline", data);
});

module.exports = router;
