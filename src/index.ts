import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT
};

const handleAppStart = () => {
    console.log(`Listening on port ${PORT}`);
};

// DB를 먼저 세팅해주고 서버를 실행함.
// ex)Entity를 생성해준다던지 하는 작업들.
createConnection(connectionOptions)
    .then(() => {
        app.start(appOptions, handleAppStart);
    })
    .catch(error => console.log(error));
