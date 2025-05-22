import { mergeResolvers } from '@graphql-tools/merge'
import { IResolvers } from '@graphql-tools/utils'
import personResolvers from './person.resolvers.js'

export interface MyContext {
	db: any
	ip?: string
}

const baseResolvers = {
	Query: {
		_empty: () => ''
	}
}

const resolvers: IResolvers<any, MyContext> = mergeResolvers([
	baseResolvers,
	personResolvers
])

export default resolvers
