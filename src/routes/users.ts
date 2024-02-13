import express from "express";
import {createUser, deleteUser, getAllUsers, getUser, login, updateUser} from "../controllers/user";
import {authMiddleware} from "../utils/utils";
import {check, ValidationChain} from "express-validator";
import {checkJwtHeader} from "../middlewares/checkJwtHeader";
import upload from "../middlewares/uploadFiles";

const router = express.Router();

const userValidationRules: ValidationChain[] = [
    check('firstname')
        .notEmpty().withMessage('Firstname is required.')
        .isLength({ max: 50 }).withMessage('Firstname too long.'),
    check('lastname')
        .notEmpty().withMessage('Lastname is required.')
        .isLength({ max: 50 }).withMessage('Lastname too long.'),
    check('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.'),
    check('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min:  5 }).withMessage('Password must be at least  5 characters long.')
]

router.route('/api/v1/users/authentication').post(authMiddleware,checkJwtHeader,login)
router.route('/api/v1/users').get(getAllUsers).post(userValidationRules, createUser).patch(authMiddleware,upload,updateUser)
// router.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)
//router.route("/test").post(authMiddleware, upload, updateUser)

export default router