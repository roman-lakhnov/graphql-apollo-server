const personResolvers = {
    Query: {
        people: (_, __, { db }) => {
            try {
                // Get all people from the database
                const peopleFromDb = db.prepare('SELECT * FROM people').all()
                // Transform field names to match GraphQL schema
                return peopleFromDb.map(person => ({
                    id: person.id,
                    firstName: person.first_name,
                    lastName: person.last_name,
                    createdAt: person.created_at
                }))
            } catch (error) {
                console.error('Error fetching people:', error)
                throw new Error('Failed to fetch people')
            }
        },

        personById: (_, { id }, { db }) => {
            try {
                // Get person by ID
                const person = db.prepare('SELECT * FROM people WHERE id = ?').get(id)
                if (!person) {
                    throw new Error(`Person with id ${id} not found`)
                }
                // Transform field names to match GraphQL schema
                return {
                    id: person.id,
                    firstName: person.first_name,
                    lastName: person.last_name,
                    createdAt: person.created_at
                }
            } catch (error) {
                console.error(`Error fetching person with id ${id}:`, error)
                throw error
            }
        }
    },

    Mutation: {
        createPerson: (_, { input }, { db }) => {
            const { firstName, lastName } = input

            try {
                // Start a transaction
                const insertPerson = db.prepare(
                    'INSERT INTO people (first_name, last_name) VALUES (?, ?)'
                )

                const info = insertPerson.run(firstName, lastName)

                // Get the created person and transform field names
                const person = db
                    .prepare('SELECT * FROM people WHERE id = ?')
                    .get(info.lastInsertRowid)

                return {
                    id: person.id,
                    firstName: person.first_name,
                    lastName: person.last_name,
                    createdAt: person.created_at
                }
            } catch (error) {
                console.error('Error creating person:', error)
                // Provide a more informative error message when unique fields are duplicated
                if (error.message.includes('UNIQUE constraint failed')) {
                    throw new Error(
                        'A person with this firstname or lastname already exists'
                    )
                }
                throw new Error('Failed to create person')
            }
        },

        updatePerson: (_, { id, input }, { db }) => {
            const { firstName, lastName } = input

            try {
                // Check if the person exists
                const existingPerson = db
                    .prepare('SELECT * FROM people WHERE id = ?')
                    .get(id)
                if (!existingPerson) {
                    throw new Error(`Person with id ${id} not found`)
                }

                // Update person information
                const updateFields = []
                const params = []

                if (firstName !== undefined) {
                    updateFields.push('first_name = ?')
                    params.push(firstName)
                }

                if (lastName !== undefined) {
                    updateFields.push('last_name = ?')
                    params.push(lastName)
                }

                if (updateFields.length > 0) {
                    params.push(id) // add id for the WHERE condition
                    const updatePerson = db.prepare(
                        `UPDATE people SET ${updateFields.join(', ')} WHERE id = ?`
                    )
                    updatePerson.run(...params)
                }

                // Return updated record with transformed field names
                const updatedPerson = db
                    .prepare('SELECT * FROM people WHERE id = ?')
                    .get(id)
                return {
                    id: updatedPerson.id,
                    firstName: updatedPerson.first_name,
                    lastName: updatedPerson.last_name,
                    createdAt: updatedPerson.created_at
                }
            } catch (error) {
                console.error(`Error updating person with id ${id}:`, error)
                // Provide a more informative error message when unique fields are duplicated
                if (error.message.includes('UNIQUE constraint failed')) {
                    throw new Error(
                        'A person with this firstname or lastname already exists'
                    )
                }
                throw error
            }
        },

        // Add a new method for deleting a person
        deletePerson: (_, { id }, { db }) => {
            try {
                // Check if the person exists
                const existingPerson = db
                    .prepare('SELECT * FROM people WHERE id = ?')
                    .get(id)
                if (!existingPerson) {
                    throw new Error(`Person with id ${id} not found`)
                }

                // Delete the person and return information about the deleted record
                db.prepare('DELETE FROM people WHERE id = ?').run(id)

                return {
                    id,
                    firstName: existingPerson.first_name,
                    lastName: existingPerson.last_name,
                    createdAt: existingPerson.created_at,
                    success: true,
                    message: `Person with id ${id} successfully deleted`
                }
            } catch (error) {
                console.error(`Error deleting person with id ${id}:`, error)
                throw error
            }
        }
    }
}

export default personResolvers