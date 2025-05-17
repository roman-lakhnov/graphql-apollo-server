import { mergeTypeDefs } from '@graphql-tools/merge'
import bookTypeDefs from './book.typeDefs.js'
import personTypeDefs from './person.typeDefs.js'

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }
`

const typeDefs = mergeTypeDefs([baseTypeDefs, bookTypeDefs, personTypeDefs])

export default typeDefs
