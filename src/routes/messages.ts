import express from "express";
import {authMiddleware} from "../utils/utils";
import {createMessageInDiscussion, getMessagesOfDiscussion, reactToMessage} from "../controllers/message";
import upload from "../middlewares/uploadFiles";

const router = express.Router();

router.route('/api/v1/messages').get(authMiddleware, getMessagesOfDiscussion).post(authMiddleware, upload, createMessageInDiscussion)
router.route('/api/v1/messages/:messageId').patch(authMiddleware, reactToMessage)

export default router