# Chat-API-2024
> The API of an instant messaging web app.
## About
This project uses [Express](https://expressjs.com/),  a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Getting started
1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) on your machine. 
2. Clone the project directory.
3. Navigate to the project directory.
4. Install the packages:
 ```
    npm install
 ```
5. Start the Mongo DB database using the `mongod` process.
6. Now, you need to generate a public/private keypair.  The `.gitignore` automatically ignores the private key:
```
tsc generateKeypair.ts
```
7. Run the project:
```
    npm start
 ```