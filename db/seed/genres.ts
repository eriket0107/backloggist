import { db } from ".."
import { genresTable } from "../schema"
import { LoggerService } from "@/utils/logger/logger.service"
import { Genre } from "@/types/entities"

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
    await db.insert(genresTable).values(genresList)

    const duration = Date.now() - startTime
    logger.info(`✅ Successfully created ${genresList.length} genres in ${duration}ms`)

    // Log first few genres as examples
    const sampleGenres = genresList.slice(0, 5)
    sampleGenres.forEach(genre => {
      logger.info(`   🏷️  Created genre: ${genre.name}`)
    })

    if (genresList.length > 5) {
      logger.info(`   🏷️  ... and ${genresList.length - 5} more genres`)
    }

  } catch (error) {
    logger.error(`❌ Failed to seed genres: ${error.message}`)
    throw error
  }
}
