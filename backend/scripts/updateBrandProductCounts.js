import dotenv from 'dotenv'
import { connectDatabase } from '../config/db.js'
import Brand from '../models/Brand.js'
import Product from '../models/Product.js'

dotenv.config()

async function updateBrandProductCounts() {
  await connectDatabase()

  const counts = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$brand', productCount: { $sum: 1 } } }
  ])

  const countMap = new Map(counts.map(({ _id, productCount }) => [_id, productCount]))
  const brands = await Brand.find({})

  await Promise.all(
    brands.map((brand) =>
      Brand.updateOne(
        { _id: brand._id },
        { $set: { productCount: countMap.get(brand.name) || 0 } }
      )
    )
  )

  console.log(`Updated product counts for ${brands.length} brands`)
  process.exit(0)
}

updateBrandProductCounts().catch((error) => {
  console.error('Unable to update brand product counts:', error)
  process.exit(1)
})
