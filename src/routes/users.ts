import express from "express";
import {createUser, deleteUser, getAllUsers, getUser, login, updateUser} from "../controllers/user";
import {authMiddleware} from "../utils/utils";
const router = express.Router();

router.route('/api/v1/users/authentication').post(login)
router.route('/api/v1/users').get(getAllUsers).post(createUser)
router.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router