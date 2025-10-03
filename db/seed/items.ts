import { db } from ".."
import { itemsTable } from "../schema"
import { LoggerService } from "@/utils/logger/logger.service"
import { Item } from "@/types/entities"

const loggerService = new LoggerService()

const logger = loggerService.createEntityLogger('ItemsSeed')

const items: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "The Witcher 3: Wild Hunt",
    type: "game",
    note: "Epic RPG adventure",
    imgUrl: "https://example.com/witcher3.jpg"
  },
  {
    title: "Dune",
    type: "book",
    note: "Classic sci-fi novel",
    imgUrl: "https://example.com/dune.jpg"
  },
  {
    title: "Breaking Bad",
    type: "serie",
    note: "Crime drama series"
  },
  {
    title: "The Matrix",
    type: "movie",
    note: "Sci-fi action movie"
  },
  {
    title: "JavaScript Course",
    type: "course",
    note: "Learn modern JavaScript"
  },
  {
    title: "Cyberpunk 2077",
    type: "game",
    note: "Futuristic RPG"
  },
  {
    title: "1984",
    type: "book",
    note: "Dystopian classic by George Orwell"
  },
  {
    title: "Stranger Things",
    type: "serie",
    note: "Supernatural horror series"
  },
  {
    title: "Inception",
    type: "movie",
    note: "Mind-bending thriller"
  },
  {
    title: "React Masterclass",
    type: "course",
    note: "Complete React development course"
  },
  {
    title: "God of War",
    type: "game",
    note: "Norse mythology action-adventure"
  },
  {
    title: "The Hobbit",
    type: "book",
    note: "Fantasy adventure by Tolkien"
  },
  {
    title: "Game of Thrones",
    type: "serie",
    note: "Epic fantasy drama"
  },
  {
    title: "Interstellar",
    type: "movie",
    note: "Space exploration epic"
  },
  {
    title: "Python for Data Science",
    type: "course",
    note: "Data analysis with Python"
  },
  {
    title: "Red Dead Redemption 2",
    type: "game",
    note: "Western action-adventure"
  },
  {
    title: "Sapiens",
    type: "book",
    note: "History of humankind"
  },
  {
    title: "The Office",
    type: "serie",
    note: "Comedy mockumentary"
  },
  {
    title: "Pulp Fiction",
    type: "movie",
    note: "Tarantino crime classic"
  },
  {
    title: "Machine Learning Basics",
    type: "course",
    note: "Introduction to ML concepts"
  },
  {
    title: "Elden Ring",
    type: "game",
    note: "Dark fantasy RPG"
  },
  {
    title: "Atomic Habits",
    type: "book",
    note: "Self-improvement guide"
  },
  {
    title: "Better Call Saul",
    type: "serie",
    note: "Breaking Bad spin-off"
  },
  {
    title: "The Dark Knight",
    type: "movie",
    note: "Batman superhero film"
  },
  {
    title: "Node.js Backend Development",
    type: "course",
    note: "Server-side JavaScript development"
  }
]

export const itemsSeed = async () => {
  const startTime = Date.now()

  logger.info(`🌱 Starting to seed ${items.length} items...`)

  try {
    await db.insert(itemsTable).values(items)

    const duration = Date.now() - startTime
    logger.info(`✅ Successfully created ${items.length} items in ${duration}ms`)

    const itemsByType = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(itemsByType).forEach(([type, count]) => {
      logger.info(`   📊 Created ${count} ${type}(s)`)
    })

  } catch (error) {
    logger.error(`❌ Failed to seed items: ${error.message}`)
    throw error
  }
}

