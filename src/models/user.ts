export type UserType  = {
    id: string;
    firstname: string;
    lastname: string;
    photoUrl: string;
    status: string;
    email: string;
    hash: string;
    salt: string;
}

export class User implements UserType {
    id: string;
    firstname: string;
    lastname: string;
    photoUrl: string;
    status: string;
    email: string;
    hash: string;
    salt: string;

    constructor(firstname: string, lastname: string, email: string, hash: string, salt: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.hash = hash;
        this.salt = salt;
    }
}
