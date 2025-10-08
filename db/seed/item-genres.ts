import { db } from ".."
import { itemGenresTable, itemsTable, genresTable } from "../schema"
import { LoggerService } from "@/utils/logger/logger.service"
import { ItemGenre } from "@/types/entities"

const loggerService = new LoggerService()

const logger = loggerService.createEntityLogger('ItemGenresSeed')

const genreMappings = {
  game: ['Action', 'Adventure', 'RPG', 'Strategy', 'Fantasy', 'Sci-Fi', 'Horror', 'Puzzle', 'Racing', 'Sports'],
  book: ['Fantasy', 'Sci-Fi', 'Drama', 'Mystery', 'Thriller', 'Romance', 'Biography', 'Philosophy', 'Self-Help', 'Educational'],
  serie: ['Drama', 'Comedy', 'Thriller', 'Mystery', 'Crime', 'Fantasy', 'Sci-Fi', 'Horror', 'Romance', 'Documentary'],
  movie: ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Fantasy', 'Romance', 'Crime', 'Documentary'],
  course: ['Educational', 'Technology', 'Science', 'Business', 'Philosophy', 'Self-Help']
}

export const itemGenresSeed = async () => {
  const startTime = Date.now()

  logger.info(`🌱 Starting to seed item-genres relationships...`)

  try {
    const existingItemGenres = await db.select().from(itemGenresTable)
    if (existingItemGenres.length > 0) {
      logger.info(`⚠️  ${existingItemGenres.length} item-genre relationships already exist. Skipping item-genres seeding.`)
      return
    }

    const items = await db.select().from(itemsTable)
    const genres = await db.select().from(genresTable)

    if (items.length === 0) {
      logger.warn('⚠️  No items found in database. Skipping item-genres seeding.')
      return
    }

    if (genres.length === 0) {
      logger.warn('⚠️  No genres found in database. Skipping item-genres seeding.')
      return
    }

    const genreMap = new Map(genres.map(genre => [genre.name, genre.id]))

    const itemGenres: Omit<ItemGenre, 'id' | 'createdAt' | 'updatedAt'>[] = []

    for (const item of items) {
      const availableGenres = genreMappings[item.type] || []

      const numGenres = Math.floor(Math.random() * 3) + 1
      const shuffledGenres = [...availableGenres].sort(() => 0.5 - Math.random())
      const selectedGenres = shuffledGenres.slice(0, numGenres)

      for (const genreName of selectedGenres) {
        const genreId = genreMap.get(genreName)
        if (genreId) {
          itemGenres.push({
            itemId: item.id,
            genreId: genreId
          })
        }
      }
    }

    if (itemGenres.length === 0) {
      logger.warn('⚠️  No valid item-genre relationships to create.')
      return
    }

    await db.insert(itemGenresTable).values(itemGenres)

    const duration = Date.now() - startTime
    logger.info(`✅ Successfully created ${itemGenres.length} item-genre relationships in ${duration}ms`)

    const statsByType = items.reduce((acc, item) => {
      const itemRelationships = itemGenres.filter(ig => ig.itemId === item.id)
      acc[item.type] = (acc[item.type] || 0) + itemRelationships.length
      return acc
    }, {} as Record<string, number>)

    Object.entries(statsByType).forEach(([type, count]) => {
      logger.info(`   📊 Created ${count} genre assignments for ${type}s`)
    })

    const sampleItems = items.slice(0, 3)
    for (const item of sampleItems) {
      const itemGenresForItem = itemGenres.filter(ig => ig.itemId === item.id)
      const genreNames = itemGenresForItem.map(ig => {
        const genre = genres.find(g => g.id === ig.genreId)
        return genre?.name
      }).filter(Boolean)

      logger.info(`   🏷️  ${item.title} (${item.type}): ${genreNames.join(', ')}`)
    }

  } catch (error) {
    logger.error(`❌ Failed to seed item-genres: ${error.message}`)
    throw error
  }
}