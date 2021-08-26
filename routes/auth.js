const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const{signout , signup , signin , isSignedIn} = require("../controllers/auth");

router.post("/signup" ,[
    check("name", "name should be atleast of 3 charachter").isLength({min: 3}),
    check("email", "email is required").isEmail(),
    check("password", "password should be atleast of 3 charachter").isLength({min: 3}),
], signup);

router.post("/signin" ,[
    check("email", "email is required").isEmail(),
    check("password", "password is required").isLength({min: 1}),
], signin);



router.get("/signout" , signout);

router.get("/testRoute" , isSignedIn , (req , res) => {
    res.send("a protected route");
})

module.exports = router;