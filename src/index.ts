import { ApolloServer } from '@apollo/server'
import typeDefs from './graphql/typeDefs/index.js'
import resolvers from './graphql/resolvers/index.js'
import { startStandaloneServer } from '@apollo/server/standalone'

const server = new ApolloServer({
	typeDefs,
	resolvers
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req }) => {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
		return { ip }
	}
})

console.log(`🚀  Server ready at: ${url}`)
