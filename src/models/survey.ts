export type Options = {
    id?: string
    response: string
    voters?: String[]
    surveyId: string
}

export type SurveyType = {
    id?: string
    question: string
    discussionId: string
    creatorId: string
    createdAt: number
    endedAt?: number
    Options: Options[]
}

export class Survey implements SurveyType {
    id?: string
    question: string
    discussionId: string
    creatorId: string
    createdAt: number
    endedAt?: number
    Options: Options[]

    constructor(question: string, discussionId: string, creatorId: string, createdAt: number, endedAt: number, Options: Options[]) {
        this.question = question
        this.discussionId = discussionId
        this.creatorId = creatorId
        this.createdAt = createdAt
        this.endedAt = endedAt
        this.Options = Options
    }
}