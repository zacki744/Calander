"use strict"

const express       = require("express");
const calender      = require("../src/calendar.js")
const router        = express.Router();

// Add a route for the path /home
router.get("/Home", async (req, res) => {
    let data= {
        title: "Home"
    };
    data.result = "A summary of all of your aktivites";
    data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    data.res = await calender.findAllInTableHome();

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
    data.result = "A summary of all of your aktivites";
    data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    data.res = await calender.Serch(req.url.split('=')[1]);

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
    data.result = "A summary of all of your aktivites";
    data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    data.res = await calender.findAllInTableHome()

    for (let i = 0; i < data.res.length; i++) {
        if((data.res[i].Description).length > 22) {
            data.res[i].Description = data.res[i].Description.substring(0, 20) + "...";
        }
    }
    res.render("home", data);}
);

router.post("/Home", async (req, res) => {
    let data= {
        title: "Home"
    };
    console.table(typeof req.body.f_capacity)
    if ((typeof req.body.f_EstimatedDuration) == 'object') {
        // move objekt to complete
        await calender.Complete(req.body.f_EstimatedDuration);
        // ridirect to completed
        res.redirect("/calendar/complete")
    }
    if ((typeof req.body.f_capacity) == 'string') {
        // update capacity
        await calender.UpdateCapacity(req.body.f_capacity);
        // ridirect to home
        res.redirect("/calendar/Home")
    }
    else {
        let result = await calender.insertItem(req.body);
        data.result = "A summary of all of your aktivites";
        if (result == false) {
            data.result = "Culd not add a new task"
        }
        
        data.res = await calender.findAllInTableHome();
        data.time = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));

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
