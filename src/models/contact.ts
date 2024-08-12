export type ContactType  = {
    id?: string;
    user1Id: string;
    addedAt: number;
    user1Blocked: boolean;
    user2Blocked: boolean;
    status: string;
    user2Id: string;
}

export class Contact implements ContactType{
    id?: string;
    user1Id: string;
    addedAt: number;
    user1Blocked: boolean;
    user2Blocked: boolean;
    status: string;
    user2Id: string;

    constructor(user1Id: string, addedAt: number, user1Blocked: boolean,user2Blocked: boolean, status: string, user2Id: string) {
        this.user1Id = user1Id;
        this.addedAt = addedAt;
        this.user1Blocked = user1Blocked;
        this.user2Blocked = user2Blocked;
        this.status = status;
        this.user2Id = user2Id
    }
}