import { mergeTypeDefs } from '@graphql-tools/merge'
import personTypeDefs from './person.typeDefs.js'

const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }
`

const typeDefs = mergeTypeDefs([baseTypeDefs, personTypeDefs])

export default typeDefs
