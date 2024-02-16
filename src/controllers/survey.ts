import {asyncWrapper} from "../utils/async-wrapper";
import {RequestWithJwt} from "../interfaces/RequestWithJwt";
import {Response, NextFunction} from "express";
import {Options, Survey} from "@prisma/client";
import {SurveyService} from "../services/survey";

export const addSurvey = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const userId = req.jwt.user.id
    const {discussionId, options, question} = req.body

    const surveyToCreate: Survey = {
        question: question,
        discussionId: discussionId,
        creatorId: userId,
        createdAt: Date.now(),
    }

    const optionsToCreate: Options = options.map(option => ({
        response: option,
        voters: []
    }))

    const addedSurvey = await SurveyService.addSurvey(surveyToCreate, optionsToCreate)
    return res.status(201).json(addedSurvey)
})


export const responseToSurvey = asyncWrapper(async(req: RequestWithJwt, res: Response, next: NextFunction): Promise<Response> => {
    const userId = req.jwt.user.id
    const {optionId, isSelected} = req.body

    if (isSelected == true){
        const surveyUpdated = await SurveyService.responseOkToSurvey(optionId, userId)
        return res.status(200).json(surveyUpdated)
    }else if(isSelected == false){
        const updatedSurvey = await SurveyService.responseNoToSurvey(optionId, userId)
        return res.status(200).json(updatedSurvey)
    }
})