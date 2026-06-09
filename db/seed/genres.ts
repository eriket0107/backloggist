import { db } from ".."
import { genresTable } from "../schema"
import { LoggerService } from "@/utils/logger/logger.service"
import { Genre } from "@/types/entities"
import { ErrorHandlerService } from "@/utils/error-handler/error-handler.service"

const errorHandler = new ErrorHandlerService()
const loggerService = new LoggerService()

const logger = loggerService.createEntityLogger('GenresSeed')

const genresList: Omit<Genre, 'id'>[] = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "RPG" },
  { name: "Strategy" },
  { name: "Simulation" },
  { name: "Sports" },
  { name: "Racing" },
  { name: "Puzzle" },
  { name: "Horror" },
  { name: "Thriller" },
  { name: "Mystery" },
  { name: "Romance" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Fantasy" },
  { name: "Sci-Fi" },
  { name: "Historical" },
  { name: "Biography" },
  { name: "Documentary" },
  { name: "Animation" },
  { name: "Family" },
  { name: "Crime" },
  { name: "War" },
  { name: "Western" },
  { name: "Musical" },
  { name: "Superhero" },
  { name: "Post-Apocalyptic" },
  { name: "Cyberpunk" },
  { name: "Steampunk" },
  { name: "Noir" },
  { name: "Psychological" },
  { name: "Supernatural" },
  { name: "Dystopian" },
  { name: "Utopian" },
  { name: "Educational" },
  { name: "Self-Help" },
  { name: "Philosophy" },
  { name: "Science" },
  { name: "Technology" },
  { name: "Business" }
]

export const genresSeed = async () => {
  const startTime = Date.now()

  logger.info(`🌱 Starting to seed ${genresList.length} genres...`)

  try {
    const existingGenres = await db.select().from(genresTable)
    if (existingGenres.length > 0) {
      logger.info(`⚠️  ${existingGenres.length} genres already exist. Skipping genre seeding.`)
      return
    }

    await db.insert(genresTable).values(genresList)

    const duration = Date.now() - startTime
    logger.info(`✅ Successfully created ${genresList.length} genres in ${duration}ms`)

    const sampleGenres = genresList.slice(0, 5)
    sampleGenres.forEach(genre => {
      logger.info(`   🏷️  Created genre: ${genre.name}`)
    })

    if (genresList.length > 5) {
      logger.info(`   🏷️  ... and ${genresList.length - 5} more genres`)
    }

  } catch (error) {
    const errorMessage = errorHandler.getMessage(error)
    logger.error(`❌ Failed to seed genres: ${errorMessage}`)
    throw error
  }
}
