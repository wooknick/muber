export const typeDefs = ["type Greeting {\n  error: Boolean!\n  text: String!\n}\n\ntype Query {\n  sayHello: Greeting!\n}\n"];
/* tslint:disable */

export interface Query {
  sayHello: Greeting;
}

export interface Greeting {
  error: boolean;
  text: string;
}
