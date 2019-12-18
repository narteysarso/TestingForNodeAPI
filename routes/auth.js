const router = require('express').Router();
const authController = require("../controllers/auth");
const User = require("../models/user");
const {
    body
} = require("express-validator");
//PUT /auth/signup
router.put('/signup', [
    body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, {
        req
    }) => {
        return User.findOne({
                email: value
            })
            .then(user => {
                if (user) return Promise.reject("Email already choosen")
            })
    }).normalizeEmail(),

    body('name').trim().notEmpty(),
    body('password').trim().isLength({
        min: 5
    })
], authController.signup);

module.exports = router;