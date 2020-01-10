import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodeJWT from "./utils/decodeJWT";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscriptions";

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT,
    subscriptions: {
        path: SUBSCRIPTION_ENDPOINT,
        onConnect: async connectionParams => {
            const token = connectionParams["X-JWT"];
            if (token) {
                const user = await decodeJWT(token);
                if (user) {
                    // onConnect 안에서 리턴되는 객체는 request.connection.context 안쪽에 저장된다.
                    // subscribe 하고 있는 현재 user가 누군지 알기 위한 작업.
                    // subscription은 http가 아닌 websocket을 사용하므로, websocket용 인증을 한 번 더 작업해주는 것.
                    return {
                        currentUser: user
                    };
                }
            }
            throw new Error("No JWT. Can't subscribe");
        }
    }
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
