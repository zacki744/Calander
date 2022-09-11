"use strict"

const express = require("express");
const calender    = require("../src/calendar.js")
const router  = express.Router();

// Add a route for the path /home
router.get("/Home", async (req, res) => {
    let data= {
        title: "index"
    };

    data.res = await calender.showCategorys()
    res.render("home", data);
});
router.get("/", async (req, res) => {
    let data= {
        title: "index"
    };

    data.res = await calender.showCategorys()
    res.render("home", data);});

router.post("/Home", async (req, res) => {
    let data= {
        title: "index"
    };

    await calender.insertItem(req.body);
    data.res = await calender.showCategorys()
    res.render("home", data);
});

router.get("/update/:id", async (req, res) => {
    let data = {
        title: "Update"
    };

    data.obj = await calender.getOne(req.params.id);
    res.render("update.ejs", data);
});

router.post("/update/:id", async (req, res) => {
    await calender.UpdateItem(req.body);
    res.redirect("../Home");
});

router.get("/delete/:id", async (req, res) => {
    await calender.deleteItem(req.params.id);
    res.redirect("../Home");
});

router.get("/pipeline", async (req, res) => {
    let data = {
        title: "pipeline"
    };
    
    data.obj = await calender.showCategorysGant();
    
    res.render("pipeline", data);
});

module.exports = router;
