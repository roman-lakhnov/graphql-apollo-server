import dbMockup from '../../loaders/db.loader.js'

const personResolvers = {
	Query: {
		people: () => dbMockup.people,
		personById: (parent, args) =>
			dbMockup.people.find(person => person.id === args.id),
		serverIp: (parent, args, context) => context.ip
	},
	Mutation: {
		createPerson: (parent, args) => {
			const { input } = args
			const id = String(dbMockup.people.length + 1)
			const person = {
				id,
				...input
			}
			dbMockup.people.push(person)
			return person
		},
		updatePerson: (parent, args) => {
			const { id, input } = args
			const personIndex = dbMockup.people.findIndex(person => person.id === id)
			if (personIndex === -1) {
				throw new Error(`Person with id ${id} not found`)
			}
			dbMockup.people[personIndex] = {
				...dbMockup.people[personIndex],
				...input
			}
			return dbMockup.people[personIndex]
		}
	}
}

export default personResolvers
