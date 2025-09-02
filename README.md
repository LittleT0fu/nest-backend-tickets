## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project structure

Controller -> Handles request (Get,Post,Update,Delete)
Service -> Handles logic (talk to DB, APIs, etc.)
Module -> Group controllers & services together
DTO -> Validation
Schema -> Interface to mongoDB

## Project setup

```bash
$ npm install
```

create ENV file include :

```
PORT
MONGODB_URI
```

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

## Ref

nestJS mongoDB connection : https://docs.nestjs.com/techniques/mongodb
read mongoDB_URI from ENV file : https://stackoverflow.com/questions/72460269/how-to-read-a-env-file-on-mongoosemodule-in-nestjs
nested schema : https://stackoverflow.com/questions/62762492/nestjs-how-to-create-nested-schema-with-decorators
