import {Options, Survey} from "@prisma/client";
import {SurveyPrismaService} from "../../prisma/survey";

export class SurveyService{
    static async addSurvey(survey: Survey, options: Options): Promise<Survey | null> {
        return await SurveyPrismaService.addSurvey(survey, options)
    }

    static async responseOkToSurvey(optionId: string, userId: string): Promise<Survey | null> {
        return await SurveyPrismaService.responseOkToSurvey(optionId, userId)
    }

    static async responseNoToSurvey(optionId: string, userId: string): Promise<Survey | null> {
        return await SurveyPrismaService.responseNoToSurvey(optionId, userId)
    }

}