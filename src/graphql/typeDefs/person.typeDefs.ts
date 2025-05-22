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
    peopleByFirstName(firstName: String!): [Person]
    peopleByLastName(lastName: String!): [Person]
  }

  type Mutation {
    createPerson(input: PersonInput): Person
    updatePerson(id: String!, input: PersonInput): Person
    deletePerson(id: String!): Person
  }
`

export default personTypeDefs
