"use strict"

const express = require("express");
const calender    = require("../src/calendar.js")
const router  = express.Router();

// Add a route for the path /home
router.get("/Home", async (req, res) => {
    let data= {
        title: "Home"
    };

    data.res = await calender.showCategorys()
    res.render("home", data);
});

router.get("/Home/serch", async (req, res) => {
    let data= {
        title: "Home"
    };

    data.res = await calender.Serch(req.url.split('=')[1])
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

    data.res = await calender.showCategorys()
    res.render("home", data);}
);

router.post("/Home", async (req, res) => {
    let data= {
        title: "Home"
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

router.get("/pipeline", async (req, res) => {
    let data = {
        title: "pipeline"
    };
    
    data.obj = await calender.showCategorysGant();
    console.log(data.obj)
    res.render("pipeline", data);
});

module.exports = router;
