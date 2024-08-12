import express from "express";
import {authMiddleware} from "../utils/utils";
import {check, ValidationChain} from "express-validator";
import {listContactRequest, removeContact, responseToRequest, sendContactRequest} from "../controllers/contact";

const router = express.Router();

const userValidationRules: ValidationChain[] = [
    check('user2Id')
        .notEmpty().withMessage('User2Id is required.')
]

router.route('/api/v1/contacts').get(authMiddleware,listContactRequest).post(authMiddleware,userValidationRules,sendContactRequest)
router.route('/api/v1/contacts/:contactId').patch(authMiddleware, responseToRequest).delete(authMiddleware, removeContact)

export default router