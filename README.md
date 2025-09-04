## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project structure

Controller -> Handles request (Get,Post,Update,Delete)
Service -> Handles logic (talk to DB, APIs, etc.)
Module -> Group controllers & services together
DTO -> Validation
Schema -> Interface to mongoDB

## Project setup

before running the project, make sure you have a **MongoDB URI** configured.  
You can either use a local MongoDB instance or a cloud provider like [MongoDB Atlas](https://www.mongodb.com/atlas).

install project dependecies

```bash
$ npm install
```

create `.env` file in the root of the project and add the following :

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/my_database
```

The server will start on [http://localhost:3000](http://localhost:3000) by default.  
If you set a different `PORT` in your `.env` file, the server will run on that port instead.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Folder Structure
src/
├── app.module.ts
├── main.ts
├── concert/
│   ├── concert.controller.ts
│   ├── concert.service.ts
│   ├── concert.module.ts
│   ├── dto/
│   └── schemas/

## Ref

nestJS mongoDB connection : https://docs.nestjs.com/techniques/mongodb
read mongoDB_URI from ENV file : https://stackoverflow.com/questions/72460269/how-to-read-a-env-file-on-mongoosemodule-in-nestjs
nested schema : https://stackoverflow.com/questions/62762492/nestjs-how-to-create-nested-schema-with-decorators
