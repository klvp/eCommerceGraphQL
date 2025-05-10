import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./src/graphql/typeDefs.js"
import { resolvers } from "./src/graphql/resolvers.js"
import { env } from "./env.js";
import "./src/db/index.js";

try {
    const server = new ApolloServer({ typeDefs, resolvers })

    const { url } = await startStandaloneServer(server, {
        listen: { port: env.PORT }
    })

    console.log(`server started at `, url)
} catch (error) {
    console.error("Error while starting server", error)
}
