const express = require('express')
const { createHandler } = require('graphql-http/lib/use/express')
const { buildSchema } = require('graphql')

const fakeDatabase = {}

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
input MessageInput {
  content: String
  author: String
}
 
type Message {
  id: ID!
  content: String
  author: String
}
 
type Query {
  getMessage(id: ID!): Message
	getMessages: [Message]
}
 
type Mutation {
  createMessage(input: MessageInput): Message
  updateMessage(id: ID!, input: MessageInput): Message
}
`)

const root = {
	getMessage: ({ id }) => {
		return fakeDatabase[id]
	},
	getMessages: () => {
		return Object.values(fakeDatabase)
	},
	createMessage: ({ input }) => {
		const id = String(Object.keys(fakeDatabase).length + 1)
		const message = new Message(id, input)
		fakeDatabase[id] = message
		return message
	},
	updateMessage: ({ id, input }) => {
		const message = fakeDatabase[id]
		Object.assign(message, input)
		return message
	}
}

// If Message had any complex fields, we'd put them on this object.
class Message {
	constructor(id, { content, author }) {
		this.id = id
		this.content = content
		this.author = author
	}
}

const app = express()
app.all(
	'/graphql',
	createHandler({
		schema: schema,
		rootValue: root,
	})
)
app.listen(4000, () => {
	console.log('Running a GraphQL API server at localhost:4000/graphql')
})
