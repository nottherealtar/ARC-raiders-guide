import { seedItems } from './seedItems'

async function main() {
  await seedItems()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
