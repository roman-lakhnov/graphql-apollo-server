import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Ensure logs directory exists
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const logsDir = path.join(__dirname, '..', '..', 'logs')

if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true })
}

// Format current date/time
const formatDate = () => {
	const date = new Date()
	return date.toISOString()
}

// Format content for logging
const formatLogEntry = (entry: any) => {
	return JSON.stringify(entry, null, 2)
}

export const loggingPlugin = {
	async requestDidStart(requestContext: any) {
		const timestamp = formatDate()
		const clientInfo = {
			ip:
				requestContext.request.http.headers.get('x-forwarded-for') ||
				requestContext.request.http.headers.get('x-real-ip') ||
				'unknown',
			userAgent:
				requestContext.request.http.headers.get('user-agent') || 'unknown'
		}

		const requestInfo = {
			timestamp,
			clientInfo,
			operationName:
				requestContext.request.operationName || 'anonymous operation',
			query: requestContext.request.query?.trim() || 'no query',
			variables: requestContext.request.variables || {}
		}

		// Log request
		fs.appendFile(
			path.join(logsDir, 'graphql.log'),
			`\n${'='.repeat(80)}\n[REQUEST - ${timestamp}]\n${'='.repeat(80)}\n` +
				`Client: ${clientInfo.ip} (${clientInfo.userAgent})\n` +
				`Operation: ${requestInfo.operationName}\n` +
				`Query:\n${requestInfo.query}\n` +
				`Variables: ${formatLogEntry(requestInfo.variables)}\n`,
			err => {
				if (err) console.error('Error writing to log file', err)
			}
		)

		// Return object with callbacks
		return {
			async willSendResponse(responseContext: any) {
				const responseTimestamp = formatDate()
				const timeTaken =
					new Date(responseTimestamp).getTime() - new Date(timestamp).getTime()

				const responseData = {
					operationName:
						requestContext.request.operationName || 'anonymous operation',
					data: responseContext.response.body.singleResult?.data || null,
					errors: responseContext.response.body.singleResult?.errors || null
				}

				// Создаем строковое представление данных с ограничением для больших ответов
				let dataStr = 'null'
				if (responseData.data) {
					const jsonData = JSON.stringify(responseData.data, null, 2)
					// Если данные слишком большие, показываем только первую часть
					dataStr =
						jsonData.length > 500
							? jsonData.substring(0, 500) +
							  '\n... [truncated, full length: ' +
							  jsonData.length +
							  ' chars]'
							: jsonData
				}

				// Log response
				fs.appendFile(
					path.join(logsDir, 'graphql.log'),
					`\n${'*'.repeat(80)}\n[RESPONSE - ${responseTimestamp}]\n${'*'.repeat(
						80
					)}\n` +
						`Operation: ${responseData.operationName}\n` +
						`Time taken: ${timeTaken}ms\n` +
						`Status: ${responseData.errors ? 'ERROR' : 'SUCCESS'}\n` +
						(responseData.errors
							? `Errors:\n${formatLogEntry(responseData.errors)}\n`
							: `Data summary: ${
									typeof responseData.data === 'object'
										? Object.keys(responseData.data).join(', ')
										: 'null'
							  }\n`) +
						`Response data:\n${dataStr}\n` +
						`${'_'.repeat(80)}\n\n`,
					err => {
						if (err) console.error('Error writing to log file', err)
					}
				)
			}
		}
	}
}

export default loggingPlugin
