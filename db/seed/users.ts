import { db } from ".."
import { usersTable } from "../schema"
import { PasswordHandler } from "../../src/utils/password-handler/password-handler.service"
import { LoggerService } from "@/utils/logger/logger.service"
import { User } from "@/types/entities"

const passwordHandler = new PasswordHandler()
const loggerService = new LoggerService()

const logger = loggerService.createEntityLogger('UsersSeed')

export const usersSeed = async () => {
  const startTime = Date.now()

  const users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: await passwordHandler.hashPassword("password123")
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: await passwordHandler.hashPassword("password123")
    },
    {
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      password: await passwordHandler.hashPassword("password123")
    },
    {
      name: "Alice Brown",
      email: "alice.brown@example.com",
      password: await passwordHandler.hashPassword("password123")
    },
    {
      name: "Charlie Wilson",
      email: "charlie.wilson@example.com",
      password: await passwordHandler.hashPassword("password123")
    },
    {
      name: "Admin",
      email: 'admin@admin.com',
      password: await passwordHandler.hashPassword("admin@123"),
      roles: ['ADMIN', 'USER']
    }
  ]

  logger.info(`🌱 Starting to seed ${users.length} users...`)

  try {
    // Check if users already exist
    const existingUsers = await db.select().from(usersTable)
    if (existingUsers.length > 0) {
      logger.info(`⚠️  ${existingUsers.length} users already exist. Skipping user seeding.`)
      return
    }

    await db.insert(usersTable).values(users)

    const duration = Date.now() - startTime
    logger.info(`✅ Successfully created ${users.length} users in ${duration}ms`)

    users.forEach(user => {
      logger.info(`   📝 Created user: ${user.name} (${user.email})`)
    })

  } catch (error) {
    logger.error(`❌ Failed to seed users: ${error.message}`)
    throw error
  }
}

