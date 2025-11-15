import { db } from ".."
import { itemsTable, usersTable } from "../schema"
import { LoggerService } from "@/utils/logger/logger.service"
import { Item } from "@/types/entities"

const loggerService = new LoggerService()

const logger = loggerService.createEntityLogger('ItemsSeed')

const items: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] = [
  {
    title: "The Witcher 3: Wild Hunt",
    type: "game",
    description: "Epic RPG adventure",
    imgUrl: "https://example.com/witcher3.jpg",
  },
  {
    title: "Dune",
    type: "book",
    description: "Classic sci-fi novel",
    imgUrl: "https://example.com/dune.jpg"
  },
  {
    title: "Breaking Bad",
    type: "serie",
    description: "Crime drama series"
  },
  {
    title: "The Matrix",
    type: "movie",
    description: "Sci-fi action movie"
  },
  {
    title: "JavaScript Course",
    type: "course",
    description: "Learn modern JavaScript"
  },
  {
    title: "Cyberpunk 2077",
    type: "game",
    description: "Futuristic RPG"
  },
  {
    title: "1984",
    type: "book",
    description: "Dystopian classic by George Orwell"
  },
  {
    title: "Stranger Things",
    type: "serie",
    description: "Supernatural horror series"
  },
  {
    title: "Inception",
    type: "movie",
    description: "Mind-bending thriller"
  },
  {
    title: "React Masterclass",
    type: "course",
    description: "Complete React development course"
  },
  {
    title: "God of War",
    type: "game",
    description: "Norse mythology action-adventure"
  },
  {
    title: "The Hobbit",
    type: "book",
    description: "Fantasy adventure by Tolkien"
  },
  {
    title: "Game of Thrones",
    type: "serie",
    description: "Epic fantasy drama"
  },
  {
    title: "Interstellar",
    type: "movie",
    description: "Space exploration epic"
  },
  {
    title: "Python for Data Science",
    type: "course",
    description: "Data analysis with Python"
  },
  {
    title: "Red Dead Redemption 2",
    type: "game",
    description: "Western action-adventure"
  },
  {
    title: "Sapiens",
    type: "book",
    description: "History of humankind"
  },
  {
    title: "The Office",
    type: "serie",
    description: "Comedy mockumentary"
  },
  {
    title: "Pulp Fiction",
    type: "movie",
    description: "Tarantino crime classic"
  },
  {
    title: "Machine Learning Basics",
    type: "course",
    description: "Introduction to ML concepts"
  },
  {
    title: "Elden Ring",
    type: "game",
    description: "Dark fantasy RPG"
  },
  {
    title: "Atomic Habits",
    type: "book",
    description: "Self-improvement guide"
  },
  {
    title: "Better Call Saul",
    type: "serie",
    description: "Breaking Bad spin-off"
  },
  {
    title: "The Dark Knight",
    type: "movie",
    description: "Batman superhero film"
  },
  {
    title: "Node.js Backend Development",
    type: "course",
    description: "Server-side JavaScript development"
  }
]

export const itemsSeed = async () => {
  const startTime = Date.now()

  logger.info(`🌱 Starting to seed ${items.length} items...`)

  try {
    const existingItems = await db.select().from(itemsTable)
    if (existingItems.length > 0) {
      logger.info(`⚠️  ${existingItems.length} items already exist. Skipping item seeding.`)
      return
    }

    const users = await db.select().from(usersTable)
    if (users.length === 0) {
      logger.warn('⚠️  No users found in database. Items require a userId. Skipping item seeding.')
      return
    }



    const itemsWithUserId = items.map(item => {
      const randomIdFromIndex = Math.floor(Math.random() * users.length)

      return ({
        title: item.title,
        type: item.type,
        description: item.description,
        imgUrl: item.imgUrl,
        userId: users[randomIdFromIndex].id
      })
    })


    await db.insert(itemsTable).values(itemsWithUserId)

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

