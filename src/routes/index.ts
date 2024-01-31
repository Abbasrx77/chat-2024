import express from "express";
import {authMiddleware} from "../utils/utils";
const router = express.Router();

/* GET home page. */
router.get('/protected', authMiddleware, (req, res, next) => {
  res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

export default router