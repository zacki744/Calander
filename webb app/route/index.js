/**
 * General routes.
 */
"use strict";

const express = require("express");
const router  = express.Router();

// Add a route for the path /
router.get("/", async (req, res) => {
    res.redirect("calendar/Home");
});



module.exports = router;
