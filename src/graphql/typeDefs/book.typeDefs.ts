const bookTypeDefs = `#graphql
  type Book {
    id: String!
    title: String
    author: String
  }

  extend type Query {
    books: [Book]
    bookById(id: String!): Book
    booksByAuthor(author: String!): [Book]
  }
`

export default bookTypeDefs
