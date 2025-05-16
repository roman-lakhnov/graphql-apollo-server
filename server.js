var express = require('express')
var { createHandler } = require('graphql-http/lib/use/express')
var { buildSchema } = require('graphql')
var { ruruHTML } = require('ruru/server')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(/* GraphQL */ `
	type RandomDie {
		numSides: Int!
		rollOnce: Int!
		roll(numRolls: Int!): [Int]
	}

	type Query {
		getDie(numSides: Int): RandomDie
	}
`)

// This class implements the RandomDie GraphQL type
class RandomDie {
	constructor(numSides) {
		this.numSides = numSides
	}

	rollOnce() {
		return 1 + Math.floor(Math.random() * this.numSides)
	}

	roll({ numRolls }) {
		var output = []
		for (var i = 0; i < numRolls; i++) {
			output.push(this.rollOnce())
		}
		return output
	}
}

// The root provides the top-level API endpoints
var root = {
	getDie({ numSides }) {
		return new RandomDie(numSides || 6)
	}
}

var app = express()

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
	res.type('html')
	res.end(ruruHTML({ endpoint: '/graphql' }))
})

app.all(
	'/graphql',
	createHandler({
		schema: schema,
		rootValue: root
	})
)
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
