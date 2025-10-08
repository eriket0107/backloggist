import { db } from ".."
import { userItemsTable, usersTable, itemsTable } from "../schema"
import { LoggerService } from "@/utils/logger/logger.service"
import { UserItem } from "@/types/entities"

const loggerService = new LoggerService()

const logger = loggerService.createEntityLogger('UserItemsSeed')

const statusOptions: UserItem['status'][] = ['completed', 'in_progress', 'pending']
const ratingOptions = [1, 2, 3, 4, 5]

export const userItemsSeed = async () => {
  const startTime = Date.now()

  logger.info(`🌱 Starting to seed user-items relationships...`)

  try {
    const existingUserItems = await db.select().from(userItemsTable)
    if (existingUserItems.length > 0) {
      logger.info(`⚠️  ${existingUserItems.length} user-item relationships already exist. Skipping user-items seeding.`)
      return
    }

    const users = await db.select().from(usersTable)
    const items = await db.select().from(itemsTable)

    if (users.length === 0) {
      logger.warn('⚠️  No users found in database. Skipping user-items seeding.')
      return
    }

    if (items.length === 0) {
      logger.warn('⚠️  No items found in database. Skipping user-items seeding.')
      return
    }

    const userItems: Omit<UserItem, 'id'>[] = []

    for (const user of users) {
      const numItems = Math.floor(Math.random() * 6) + 3
      const shuffledItems = [...items].sort(() => 0.5 - Math.random())
      const userItemsList = shuffledItems.slice(0, numItems)

      for (let i = 0; i < userItemsList.length; i++) {
        const item = userItemsList[i]
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]

        const rating = (status === 'completed' || status === 'in_progress')
          ? ratingOptions[Math.floor(Math.random() * ratingOptions.length)]
          : undefined

        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        const addedAt = new Date(
          sixMonthsAgo.getTime() + Math.random() * (Date.now() - sixMonthsAgo.getTime())
        )

        userItems.push({
          userId: user.id,
          itemId: item.id,
          order: i + 1,
          status,
          rating,
          addedAt
        })
      }
    }

    if (userItems.length === 0) {
      logger.warn('⚠️  No valid user-item relationships to create.')
      return
    }

    await db.insert(userItemsTable).values(userItems)

    const duration = Date.now() - startTime
    logger.info(`✅ Successfully created ${userItems.length} user-item relationships in ${duration}ms`)

    const statsByStatus = userItems.reduce((acc, userItem) => {
      acc[userItem.status || 'pending'] = (acc[userItem.status || 'pending'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(statsByStatus).forEach(([status, count]) => {
      logger.info(`   📊 Created ${count} items with status: ${status}`)
    })

    const statsByUser = users.map(user => {
      const userItemsForUser = userItems.filter(ui => ui.userId === user.id)
      const completedCount = userItemsForUser.filter(ui => ui.status === 'completed').length
      const inProgressCount = userItemsForUser.filter(ui => ui.status === 'in_progress').length
      const pendingCount = userItemsForUser.filter(ui => ui.status === 'pending').length

      return {
        name: user.name,
        total: userItemsForUser.length,
        completed: completedCount,
        inProgress: inProgressCount,
        pending: pendingCount
      }
    })

    statsByUser.forEach(stats => {
      logger.info(`   👤 ${stats.name}: ${stats.total} items (${stats.completed} completed, ${stats.inProgress} in progress, ${stats.pending} pending)`)
    })

    const sampleUsers = users.slice(0, 2)
    for (const user of sampleUsers) {
      const userItemsForUser = userItems.filter(ui => ui.userId === user.id).slice(0, 3)
      for (const userItem of userItemsForUser) {
        const item = items.find(i => i.id === userItem.itemId)
        const ratingText = userItem.rating ? ` (rated ${userItem.rating}/5)` : ''
        logger.info(`   📝 ${user.name}: ${item?.title} - ${userItem.status}${ratingText}`)
      }
    }

  } catch (error) {
    logger.error(`❌ Failed to seed user-items: ${error.message}`)
    throw error
  }
}
