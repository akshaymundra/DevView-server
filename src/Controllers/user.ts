import { hashPassword, issueJwt, validatePassword } from '../Lib/utils';
import User from '../Models/User';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

// @desc Login user
// @route POST /api/login
// @access Public
export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const isValid = await validatePassword(password, user.password);
        if (isValid) {

            const tokenObject = issueJwt(user);

            res.status(200).json({
                user,
                success: true,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        } else {
            res.status(400);
            throw new Error("Invalid password or email");
        }
    } else {
        res.status(401);
        throw new Error("User not found");
    }

})


/**
* @desc register new user
* @route POST /api/register
* @access public
*/
export const register = [

    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
        .withMessage("Password much contain 1 lowercase, 1 uppercase, 1 number, 1 special character"),
    body('fullName')
        .trim()
        .isLength({ min: 1 })
        .isString()
        .withMessage('Full Name must be a string')
        .escape(),
    body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
    body('experienceLevel')
        .isIn(['Entry-level', 'Mid-level', 'Senior', 'Not Specified'])
        .withMessage('Experience Level must be one of Entry-level, Mid-level, Senior, Not Specified'),


    asyncHandler(async (req, res) => {

        const errors = validationResult(req);

        const newUser = new User({
            email: req.body.email,
            password: "",
            fullName: req.body.fullName,
            skills: req.body.skills,
            experienceLevel: req.body.experienceLevel,
        });

        // check if user already exists with that email
        const isUserExist = await User.findOne({ email: req.body.email });
        if (isUserExist) {
            res.status(400);
            throw new Error("User already exists");
        }

        if (!errors.isEmpty()) {
            res.status(400).json({
                user: newUser,
                errors: errors.array(),
                success: false,
            });
            return;

        } else {
            newUser.password = await hashPassword(req.body.password);
            await newUser.save();

            res.status(200).json({
                user: {
                    email: newUser.email,
                    fullName: newUser.fullName
                },
                success: true,
            });
        }
    }),
]

/**
* @desc get current logged in user
* @route GET /api/me
* @access protected
*/
export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }
    res.status(200).json({
        user,
        success: true,
    });
});