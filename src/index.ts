import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { initializeDatabase } from './db/sqlite.js'
import resolvers from './graphql/resolvers/index.js'
import typeDefs from './graphql/typeDefs/index.js'
import loggingPlugin from './utils/loggingPlugin.js'

// Define context type
interface MyContext {
	ip: string
	db: any
}

// Initialize database before starting the server
const db = initializeDatabase()

const server = new ApolloServer<MyContext>({
	typeDefs,
	resolvers,
	plugins: [loggingPlugin]
})

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req }) => {
		let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
		if (Array.isArray(ip)) {
			ip = ip[0]
		}
		return { ip, db }
	}
})

console.log(`🚀  Server ready at: ${url}`)
