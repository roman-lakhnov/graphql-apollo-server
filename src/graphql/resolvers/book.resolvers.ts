import dbMockup from '../../loaders/db.loader.js'

const bookResolvers = {
	Query: {
		books: () => dbMockup.books,
		bookById: (parent, args) =>
			dbMockup.books.find(book => book.id === args.id),
		booksByAuthor: (parent, args) =>
			dbMockup.books.filter(book => book.author === args.author)
	}
}

export default bookResolvers
