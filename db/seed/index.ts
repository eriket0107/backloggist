import { LoggerService } from '@/utils/logger/logger.service'
import { itemsSeed } from './items'
import { usersSeed } from './users'

const loggerService = new LoggerService();

const logger = loggerService.createEntityLogger('Seeds');

(async () => {
  const startTime = Date.now()

  try {
    logger.info('🚀 Starting database seeding process...')

    logger.info('👥 Seeding users...')
    await usersSeed()

    logger.info('📚 Seeding items...')
    await itemsSeed()

    const duration = Date.now() - startTime
    logger.info(`✅ Database seeding completed successfully in ${duration}ms`)

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    logger.error(`❌ Database seeding failed:  ${error.message}`)
    process.exit(1)
  }

  process.exit(0)
})()