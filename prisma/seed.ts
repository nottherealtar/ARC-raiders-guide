import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { seedItems } from '@/lib/seedItems'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Seed items
    await seedItems()

    // Add more seed functions here as needed
    // await seedWeapons()
    // await seedUsers()
    // etc...

    console.log('\n✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('\n❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
