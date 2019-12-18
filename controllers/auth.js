const {
    validationResult
} = require("express-validator");
const checkErrors = require("../utils/checkErrors");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    checkErrors(req);
    const {
        email,
        name,
        password
    } = req.body;

    User.findOne({
            email
        })
        .then(user => {
            if (user) {
                const error = new Error("Email already taken");
                error.statusCode = 422;
                throw error;
            }
            bcrypt.hash(password, 7).then(hashedPassword => {
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                });
                return user.save();
            });
        })
        .then(user => {
            res.status(201).json({
                message: "User created",
                userId: user._id
            });
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;

            next(err);
        });
};

exports.login = (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    let foundUser;
    User.findOne({
            email
        })
        .then(user => {
            if (!user) {
                const error = new Error("This email is not registered on our server.");
                error.statusCode = 401; //Authorization error HTTP status code
                throw error;
            }

            foundUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(bcryptResult => {
            if (bcryptResult !== true) {
                const error = new Error("Invalid email and password combination.");
                error.statusCode = 401;
                throw error;
            }

            //Generate jwttoken
            const token = jwt.sign({
                    email: foundUser.email,
                    userId: foundUser._id
                },
                process.env.JWT_KEY, {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                token,
                userId: foundUser._id
            });
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;

            next(err);
        });
};