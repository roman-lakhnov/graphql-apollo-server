import { mergeResolvers } from '@graphql-tools/merge'
import bookResolvers from './book.resolvers.js'
import personResolvers from './person.resolvers.js'

const resolvers = mergeResolvers([bookResolvers, personResolvers])

export default resolvers
