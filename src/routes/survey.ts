import express from "express";
import {authMiddleware} from "../utils/utils";
import {addSurvey, responseToSurvey} from "../controllers/survey";


const router = express.Router();

router.route('/api/v1/surveys').post(authMiddleware, addSurvey)
router.route('/api/v1/surveys/:surveyId').patch(authMiddleware, responseToSurvey)


export default router