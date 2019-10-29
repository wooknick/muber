import { Greeting } from "src/types/graph";

const resolvers = {
    Query: {
        sayHello: (): Greeting => {
            return {
                error: false,
                text: "hi how are you"
            };
        }
    }
};

export default resolvers;
