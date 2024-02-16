import express from "express";
import {authMiddleware} from "../utils/utils";
import {
    createGroupDiscussion,
    deleteDiscussionGroup, getDiscussionById,
    listDiscussion,
    superPatchDiscussion
} from "../controllers/discussion";

const router = express.Router();

router.route('/api/v1/discussions').get(authMiddleware, listDiscussion).post(authMiddleware ,createGroupDiscussion)
router.route('/api/v1/discussions/:groupId').get(authMiddleware, getDiscussionById).patch(authMiddleware, superPatchDiscussion).delete(deleteDiscussionGroup)
export default router