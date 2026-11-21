import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import User from './models/User.js'
import LoginHistory from './models/LoginHistory.js'
import Brand from './models/Brand.js'
import Product from './models/Product.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/klay_store'

const brandsData = [
  {
    name: 'Baltra',
    slug: 'baltra',
    logo: '/baltra/baltra.png',
    countryOfOrigin: 'Nepal',
    authorizedPartner: true,
    description: 'Trusted Nepali brand for durable cookware, pressure cookers, and everyday appliances.',
    categories: ['pressure-cooker', 'rice-cooker', 'electric-kettle', 'fan', 'mixer', 'lunch-box', 'bottles']
  },
  {
    name: 'Hawkins',
    slug: 'hawkins',
    logo: '/hawkins/hawkins.png',
    countryOfOrigin: 'India',
    authorizedPartner: true,
    description: 'World-renowned pressure cooker brand known for its inside-fitting safety lids.',
    categories: ['pressure-cooker']
  },
  {
    name: 'Diamond',
    slug: 'diamond',
    logo: '/diamond/diamond.png',
    countryOfOrigin: 'India',
    authorizedPartner: true,
    description: 'Manufacturer of induction-bottom stainless steel pressure cookers and cookware sets.',
    categories: ['pressure-cooker']
  },
  {
    name: 'Wega',
    slug: 'wega',
    logo: '/wega/wega.png',
    countryOfOrigin: 'Nepal',
    authorizedPartner: true,
    description: 'Modern kitchen appliances including cordless kettles, electric jugs, and drum rice cookers.',
    categories: ['rice-cooker', 'electric-kettle']
  },
  {
    name: 'Bagmati',
    slug: 'bagmati',
    logo: '/bagmati/bagmati.png',
    countryOfOrigin: 'Nepal',
    authorizedPartner: true,
    description: 'Nepal premier plastics manufacturer producing heavy-duty buckets, basins, and storage pails.',
    categories: ['bucket', 'bottles', 'kitchen-rack']
  },
  {
    name: 'GEM',
    slug: 'gem',
    logo: '/gem/gem.png',
    countryOfOrigin: 'Nepal',
    authorizedPartner: true,
    description: 'Durable Nepali plasticware, organizer racks, food containers, and unbreakable buckets.',
    categories: ['bucket', 'bottles', 'lunch-box', 'kitchen-rack']
  },
  {
    name: 'Thimi Ceramics',
    slug: 'thimi-ceramics',
    logo: '/ceramics/ceramics.png',
    countryOfOrigin: 'Nepal (Bhaktapur)',
    authorizedPartner: true,
    description: 'Traditional handcrafted earthenware and lead-free glazed ceramics from historic Thimi.',
    categories: ['ceramics']
  },
  {
    name: 'Famous Steel',
    slug: 'famous-steel',
    logo: '/famous/famous.png',
    countryOfOrigin: 'Nepal',
    authorizedPartner: true,
    description: 'High-grade stainless steel utensils, modular racks, bottles, and dining ware made in Nepal.',
    categories: ['bottles', 'kitchen-rack']
  }
]

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`)
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully.')

    const db = mongoose.connection.db

    // 1. CLEAR EXISTING COLLECTIONS
    console.log('\nCleaning existing data...')
    await User.deleteMany({})
    await LoginHistory.deleteMany({})
    await Brand.deleteMany({})
    await Product.deleteMany({})
    console.log('Cleared existing users, login_histories, brands, and products.')

    // 2. SEED USERS
    console.log('\nSeeding Users...')
    const adminUser = await User.create({
      name: 'KLAY Administrator',
      email: 'admin@klay.com.np',
      password: 'AdminPassword123',
      role: 'admin',
      phone: '+977-9801234567',
      address: { street: 'New Road', city: 'Kathmandu', country: 'Nepal' },
      lastLoginAt: new Date()
    })

    const customerUser1 = await User.create({
      name: 'Aarav Shrestha',
      email: 'aarav.shrestha@example.com',
      password: 'UserPassword123',
      role: 'customer',
      phone: '+977-9841987654',
      address: { street: 'Patan Dhoka', city: 'Lalitpur', country: 'Nepal' },
      lastLoginAt: new Date(Date.now() - 3600000 * 4)
    })

    const customerUser2 = await User.create({
      name: 'Pooja Karki',
      email: 'pooja.karki@example.com',
      password: 'UserPassword123',
      role: 'customer',
      phone: '+977-9812345678',
      address: { street: 'Suryabinayak', city: 'Bhaktapur', country: 'Nepal' },
      lastLoginAt: new Date(Date.now() - 3600000 * 24)
    })
    console.log(`Created ${await User.countDocuments()} users.`)

    // 3. SEED LOGIN HISTORIES
    console.log('\nSeeding User Login History...')
    const loginHistories = [
      {
        userId: adminUser._id,
        email: adminUser.email,
        status: 'SUCCESS',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0',
        deviceType: 'DESKTOP',
        location: { city: 'Kathmandu', country: 'Nepal' },
        loginTime: new Date()
      },
      {
        userId: customerUser1._id,
        email: customerUser1.email,
        status: 'SUCCESS',
        ipAddress: '192.168.1.15',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        deviceType: 'MOBILE',
        location: { city: 'Lalitpur', country: 'Nepal' },
        loginTime: new Date(Date.now() - 3600000 * 4)
      },
      {
        userId: customerUser2._id,
        email: customerUser2.email,
        status: 'SUCCESS',
        ipAddress: '192.168.1.42',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0',
        deviceType: 'DESKTOP',
        location: { city: 'Bhaktapur', country: 'Nepal' },
        loginTime: new Date(Date.now() - 3600000 * 24)
      },
      {
        userId: null,
        email: 'unknown.guest@example.com',
        status: 'FAILED',
        ipAddress: '103.10.22.4',
        userAgent: 'Mozilla/5.0 (Android 14; Mobile)',
        deviceType: 'MOBILE',
        location: { city: 'Kathmandu', country: 'Nepal' },
        loginTime: new Date(Date.now() - 3600000 * 48),
        failureReason: 'Invalid credentials'
      }
    ]
    await LoginHistory.insertMany(loginHistories)
    console.log(`Created ${await LoginHistory.countDocuments()} login history records.`)

    // 4. SEED BRANDS
    console.log('\nSeeding Brands...')
    await Brand.insertMany(brandsData)
    console.log(`Created ${await Brand.countDocuments()} brands.`)

    // 5. SEED PRODUCTS (60 items)
    console.log('\nSeeding Products (60 products across 10 categories)...')
    const rawProducts = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'productsData.json'), 'utf-8')
    )
    await Product.insertMany(rawProducts)
    console.log(`Inserted ${await Product.countDocuments()} products into 'products' collection.`)

    // 6. CREATE MONGODB BRAND VIEWS
    console.log('\nCreating Brand-specific MongoDB Views...')
    const brandViews = [
      { viewName: 'products_baltra', brandName: 'Baltra' },
      { viewName: 'products_bagmati', brandName: 'Bagmati' },
      { viewName: 'products_hawkins', brandName: 'Hawkins' },
      { viewName: 'products_wega', brandName: 'Wega' },
      { viewName: 'products_diamond', brandName: 'Diamond' },
      { viewName: 'products_gem', brandName: 'GEM' },
      { viewName: 'products_ceramics', brandName: 'Thimi Ceramics' },
      { viewName: 'products_famous', brandName: 'Famous Steel' }
    ]

    for (const bv of brandViews) {
      try {
        // Drop view if it already exists
        await db.dropCollection(bv.viewName).catch(() => {})
        // Create read-only view filtering products collection by brand
        await db.createCollection(bv.viewName, {
          viewOn: 'products',
          pipeline: [{ $match: { brand: bv.brandName } }]
        })
        const count = await db.collection(bv.viewName).countDocuments()
        console.log(` - View '${bv.viewName}' created (${count} ${bv.brandName} products)`)
      } catch (err) {
        console.warn(` - Could not create view ${bv.viewName}: ${err.message}`)
      }
    }

    console.log('\n=============================================')
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!')
    console.log('You can now refresh MongoDB Compass to see:')
    console.log('  1. users (collection)')
    console.log('  2. login_histories (collection)')
    console.log('  3. brands (collection)')
    console.log('  4. products (master store products collection)')
    console.log('  5. products_baltra (brand view)')
    console.log('  6. products_bagmati (brand view)')
    console.log('  7. products_hawkins (brand view)')
    console.log('  8. products_wega (brand view)')
    console.log('  9. products_diamond (brand view)')
    console.log(' 10. products_gem (brand view)')
    console.log(' 11. products_ceramics (brand view)')
    console.log(' 12. products_famous (brand view)')
    console.log('=============================================\n')

    await mongoose.disconnect()
  } catch (err) {
    console.error('Error during database seed:', err)
    process.exit(1)
  }
}

seedDatabase()
