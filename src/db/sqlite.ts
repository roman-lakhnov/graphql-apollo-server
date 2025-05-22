import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import demoPeople from './db.loader.js'

// Get the path to the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Path to the database file
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'database.sqlite')

// Make sure the directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true })
}

// Type definition for the SQL query result counting records
interface CountResult {
	count: number
}

// Database initialization
export function initializeDatabase() {
	console.log(`Initializing SQLite database at ${DB_PATH}`)

	const db = new Database(DB_PATH)

	// Enable foreign keys
	db.pragma('foreign_keys = ON')

	// Create tables if they don't exist
	db.exec(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

	// Check if there is data in the people table
	const result = db
		.prepare('SELECT COUNT(*) as count FROM people')
		.get() as CountResult

	const peopleCount = result.count

	// If the table is empty, add demo data
	if (peopleCount === 0) {
		console.log('Adding demo data to the database...')

		const insertPeople = db.prepare(
			'INSERT INTO people (first_name, last_name) VALUES (?, ?)'
		)

		demoPeople.forEach(person => {
			insertPeople.run(person.first_name, person.last_name)
		})

		console.log(`Added ${demoPeople.length} demo people.`)
	}

	return db
}

// Returns an instance of the database
let dbInstance: ReturnType<typeof Database> | null = null

export function getDb() {
	if (!dbInstance) {
		dbInstance = initializeDatabase()
	}
	return dbInstance
}

export default getDb
