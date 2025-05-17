const personTypeDefs = `#graphql
  input PersonInput {
    firstName: String
    lastName: String
  }

  type Person {
    id: String!
    firstName: String
    lastName: String
  }

  extend type Query {
    people: [Person]
    personById(id: String!): Person
        serverIp: String
  }

  type Mutation {
    createPerson(input: PersonInput): Person
    updatePerson(id: String!, input: PersonInput): Person
  }
`

export default personTypeDefs
