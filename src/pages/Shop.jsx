import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CategoryIcon } from '../components/CategoryIcons'
import { useCart } from '../context/CartContext'
import { apiRequest } from '../services/api'
import './Pages.css'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategorySlug = searchParams.get('category') || ''
  const activeBrand = searchParams.get('brand') || ''
  const { openQuantityModal } = useCart()

  // Filter states inside a category
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [brandSearch, setBrandSearch] = useState('')
  const [apiProducts, setApiProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')

  // Selected product for Details Modal
  const [activeProduct, setActiveProduct] = useState(null)

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveProduct(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    apiRequest('/products')
      .then(({ data }) => setApiProducts(data))
      .catch((error) => setProductsError(error.message))
      .finally(() => setProductsLoading(false))
  }, [])

  const categories = [
    {
      id: 'pressure-cooker',
      name: 'PRESSURE COOKER',
      shortName: 'Pressure Cooker',
      description: 'Stainless steel and aluminium pressure cookers for fast, energy-efficient cooking.'
    },
    {
      id: 'rice-cooker',
      name: 'RICE COOKER',
      shortName: 'Rice Cooker',
      description: 'Automatic rice and grain cookers with non-stick pots and keep-warm mode.'
    },
    {
      id: 'electric-kettle',
      name: 'ELECTRIC KETTLE',
      shortName: 'Electric Kettle',
      description: 'Fast-boil stainless steel and glass kettles with auto cut-off and 360 degree bases.'
    },
    {
      id: 'fan',
      name: 'FAN',
      shortName: 'Fan',
      description: 'High-velocity table fans, ceiling fans, and pedestal fans for kitchens and living spaces.'
    },
    {
      id: 'bucket',
      name: 'BUCKET',
      shortName: 'Bucket',
      description: 'Durable household buckets, storage pails and multipurpose containers in heavy-duty plastic.'
    },
    {
      id: 'ceramics',
      name: 'CERAMICS',
      shortName: 'Ceramics',
      description: 'Handcrafted ceramic bowls, jugs, cups and serveware from Thimi Ceramics, Nepal.'
    },
    {
      id: 'mixer',
      name: 'MIXER',
      shortName: 'Mixer Grinder',
      description: 'Copper-winding motor mixer grinders and hand blenders for wet, dry and chutney grinding.'
    },
    {
      id: 'bottles',
      name: 'BOTTLES',
      shortName: 'Bottles',
      description: 'Stainless steel, plastic and insulated water bottles and drinkware for every lifestyle.'
    },
    {
      id: 'lunch-box',
      name: 'LUNCH BOX',
      shortName: 'Lunch Box',
      description: 'Leak-proof steel and plastic lunch containers for school, office, and travel use.'
    },
    {
      id: 'kitchen-rack',
      name: 'KITCHEN RACK',
      shortName: 'Kitchen Rack',
      description: 'Multipurpose kitchen storage racks, shelf organisers, and countertop basket sets.'
    }
  ]

  // Products Dataset: Exactly 6 Products per Category (60 Products Total)
  const fallbackProducts = [
    // 1. Pressure Cooker
    {
      id: 'pc-1',
      name: 'Baltra Orion 5L Aluminium Pressure Cooker',
      category: 'pressure-cooker',
      brand: 'Baltra',
      price: 2850,
      badge: 'Best Seller',
      specs: 'ISI Marked | Induction Compatible | Safety Valve',
      description: 'Made from heavy-gauge virgin aluminium for rapid, uniform heat conduction. Fitted with a certified weight valve, gasket release safety system, and heat-resistant bakelite handles for daily cooking.',
      image: '/baltra/orion_pressurecooker_baltra.jpg'
    },
    {
      id: 'pc-2',
      name: 'Baltra Stella 5L Stainless Steel Pressure Cooker',
      category: 'pressure-cooker',
      brand: 'Baltra',
      price: 4200,
      badge: 'Premium',
      specs: 'Mirror Polish SS | Tri-Ply Base | Gasket Safety Lock',
      description: 'Constructed from food-grade surgical stainless steel with an impact-bonded sandwich base that prevents hotspot burning. Compatible with induction and gas stoves, resisting food acids and corrosion.',
      image: '/baltra/stella_pressurecooker_baltra.jpg'
    },
    {
      id: 'pc-3',
      name: 'Hawkins Classic 3L Aluminium Pressure Cooker',
      category: 'pressure-cooker',
      brand: 'Hawkins',
      price: 3650,
      badge: 'Trusted Brand',
      specs: 'Hard-Anodised Aluminium | Upgraded Safety Plug',
      description: 'Features Hawkins signature inside-fitting safety lid that remains locked until steam pressure drops safely. Delivers up to 53% faster cooking than open pots, perfect for smaller family meals.',
      image: '/hawkins/classic_pressure_cooker_hawkins.jpeg'
    },
    {
      id: 'pc-4',
      name: 'Baltra Spectra 5L Pressure Cooker',
      category: 'pressure-cooker',
      brand: 'Baltra',
      price: 3200,
      badge: 'Popular',
      specs: 'Heavy Gauge Aluminium | Locking Lid System',
      description: 'Built with an anti-bulge induction base and metallic safety release plug for consistent pressure containment. Ideal for preparing lentils, rice, and hearty stews with quick-cleaning ease.',
      image: '/baltra/spectra_pressurecooker_baltra.jpg'
    },
    {
      id: 'pc-5',
      name: 'Diamond Induction Base SS Pressure Cooker (5L)',
      category: 'pressure-cooker',
      brand: 'Diamond',
      price: 3850,
      badge: 'Cookware',
      specs: 'Heavy Bottom Steel | Flame-Resistant Handles',
      description: 'Engineered with a sandwich bottom steel core that absorbs and holds thermal energy efficiently. Safe for induction, ceramic, and gas stovetops with long-lasting pressure seals.',
      image: '/diamond/induction_pressure_cooker_diamond.jpg'
    },
    {
      id: 'pc-6',
      name: 'Baltra Triva Deluxe 5L Pressure Cooker',
      category: 'pressure-cooker',
      brand: 'Baltra',
      price: 3450,
      badge: 'Value Pick',
      specs: 'Hard Anodized Body | High Thermal Efficiency',
      description: 'Sturdy hard-anodised cooking surface that resists scratching, pitting, and tarnishing from acidic curries. Features a precision pressure weight valve and comfort-grip handles.',
      image: '/baltra/triva_pressurecooker_baltra.jpg'
    },

    // 2. Rice Cooker
    {
      id: 'rc-1',
      name: 'Baltra Dream Deluxe 3.6L Automatic Rice Cooker',
      category: 'rice-cooker',
      brand: 'Baltra',
      price: 4450,
      badge: 'Best Seller',
      specs: 'Heavy-Duty Anodised Pot | Auto Keep Warm',
      description: 'High-capacity electric drum rice cooker featuring a durable anodised aluminium cooking pot. Automatically shifts to warm mode once cooked, and includes a steam basket for vegetables.',
      image: '/baltra/dream_dlx_ricecooker_baltra.jpg'
    },
    {
      id: 'rc-2',
      name: 'Baltra Classic 2.8L Drum Rice Cooker',
      category: 'rice-cooker',
      brand: 'Baltra',
      price: 3450,
      badge: 'Family Size',
      specs: 'Stainless Steel Lid | Measuring Cup Included',
      description: 'Reliable drum-design rice cooker with thermal fuse protection against overheating. Provides one-touch switch cooking with consistent grain fluffiness for daily family dining.',
      image: '/baltra/classic_ricecooker_baltra.jpg'
    },
    {
      id: 'rc-3',
      name: 'Wega Deluxe 1.8L Electric Rice Cooker',
      category: 'rice-cooker',
      brand: 'Wega',
      price: 2950,
      badge: 'Compact',
      specs: 'Non-Stick Inner Pot | Cook and Warm Auto Switch',
      description: 'Space-saving 1.8L electric cooker equipped with a scratch-resistant non-stick cooking bowl and cool-touch body. Prepares rice and porridge efficiently with low countertop power usage.',
      image: '/wega/ricecooker_deluxe_wega.jpg'
    },
    {
      id: 'rc-4',
      name: 'Baltra Dream Regular 1.8L Compact Rice Cooker',
      category: 'rice-cooker',
      brand: 'Baltra',
      price: 2750,
      badge: 'Economy',
      specs: 'Anodized Inner Bowl | Dual LED Indicators',
      description: 'Compact 1.8-liter automatic grain cooker suitable for couples and small households. Efficient heating plate ensures uniform steam dispersion and prevents rice scorched bottoms.',
      image: '/baltra/dream_reg_ricecooker_baltra.jpg'
    },
    {
      id: 'rc-5',
      name: 'Wega Home Chef 2.2L Electric Rice Cooker',
      category: 'rice-cooker',
      brand: 'Wega',
      price: 3650,
      badge: 'Chef Pick',
      specs: 'Tough Non-Stick Pan | Steamer Basket Included',
      description: 'Equipped with a food-safe non-stick liner bowl and secondary steam tray for simultaneous momo or vegetable steaming. Auto switches to keep-warm once cooking concludes.',
      image: '/wega/homechef_ricecooker_wega.jpg'
    },
    {
      id: 'rc-6',
      name: 'Baltra Instacook Multi Travel Rice Cooker',
      category: 'rice-cooker',
      brand: 'Baltra',
      price: 3150,
      badge: 'Portable',
      specs: 'Multi-Voltage Capable | Locking Lid Clasp',
      description: 'Lightweight portable electric cooker designed for students, office lunches, and travel. Easily steams rice, soups, and noodles with low power consumption and quick-wash bowl.',
      image: '/baltra/instacook_ricecooker_baltra.jpg'
    },

    // 3. Electric Kettle
    {
      id: 'ek-1',
      name: 'Baltra Fast 1.8L Stainless Steel Electric Kettle',
      category: 'electric-kettle',
      brand: 'Baltra',
      price: 1650,
      badge: 'Fast Boil',
      specs: 'Food-Grade SS 304 | 1500W Rapid Heating',
      description: '1500W rapid boiling kettle built with food-grade SS 304 seamless interior. Equipped with a 360-degree cordless swivel base, automatic steam cut-off, and dry-boil safety protection.',
      image: '/baltra/fast_kettle_baltra.jpg'
    },
    {
      id: 'ek-2',
      name: 'Baltra Power 1.8L Cordless Kettle',
      category: 'electric-kettle',
      brand: 'Baltra',
      price: 1950,
      badge: 'Best Seller',
      specs: '360 Degree Swivel Base | Boil-Dry Auto Cut-off',
      description: 'Double-walled insulated kettle that keeps water warm longer while maintaining a cool-touch exterior. Wide mouth opening simplifies filling, pouring, and periodic descaling.',
      image: '/baltra/power_kettle_baltra.jpg'
    },
    {
      id: 'ek-3',
      name: 'Wega Classic 1.5L Electric Kettle',
      category: 'electric-kettle',
      brand: 'Wega',
      price: 1450,
      badge: 'Budget Pick',
      specs: 'Concealed Heating Element | Auto Shut-off',
      description: 'Sleek brushed stainless steel body with concealed heating element that resists mineral build-up. Boils water in under 4 minutes for tea, instant coffee, and quick snacks.',
      image: '/wega/kettle_classic_wega.jpg'
    },
    {
      id: 'ek-4',
      name: 'Wega Electric Jug Big White 1.8L',
      category: 'electric-kettle',
      brand: 'Wega',
      price: 1850,
      badge: 'White Series',
      specs: 'Cool Touch Outer Shell | 1800W Fast Element',
      description: 'High-speed cordless electric water jug with insulated cool-touch casing and stainless interior. Features ergonomic trigger-opening lid and red power indicator light.',
      image: '/wega/jug_white_kettle_wega.jpg'
    },
    {
      id: 'ek-5',
      name: 'Wega Rapid Boil Electric Jug Red 1.7L',
      category: 'electric-kettle',
      brand: 'Wega',
      price: 1750,
      badge: 'Vibrant Red',
      specs: 'Overheat Protection | 360 Rotating Dock',
      description: 'Gloss red thermal electric jug with rapid-immersion heating plate. Automatically shuts power off upon boiling and features boil-dry safety cutoff protection.',
      image: '/wega/jug_red_kettle_wega.jpg'
    },
    {
      id: 'ek-6',
      name: 'Wega Quick-Boil Cordless Electric Jug Orange',
      category: 'electric-kettle',
      brand: 'Wega',
      price: 1550,
      badge: 'Value',
      specs: 'Easy Pour Spout | Cord Wrap Base',
      description: 'Vibrant kitchen electric kettle with anti-scale filter mesh and drip-free pouring spout. Great for morning chai preparations and warming water for soups.',
      image: '/wega/jug_orange_kettle_wega.jpg'
    },

    // 4. Fan
    {
      id: 'fan-1',
      name: 'Baltra Nilofer High-Velocity Table Fan (BF-121)',
      category: 'fan',
      brand: 'Baltra',
      price: 2850,
      badge: 'Kitchen Pick',
      specs: 'High Air Delivery Aerofoil Blades | 3-Speed Control',
      description: 'High-speed 12-inch desk fan driven by a 100% copper-wound motor with thermal overload safety. Aerofoil blades deliver strong focused airflow across kitchen and counter workspaces.',
      image: '/baltra/tablefan_baltra.jpg'
    },
    {
      id: 'fan-2',
      name: 'Baltra Climate Aerodynamic Ceiling Fan (BF-170)',
      category: 'fan',
      brand: 'Baltra',
      price: 3850,
      badge: 'Energy Efficient',
      specs: '100% Copper Motor | Double Ball Bearing',
      description: '48-inch sweep ceiling fan featuring ribbed aluminium blades for maximum room air displacement. Built with double ball bearings for smooth, whisper-quiet rotation and extended motor lifespan.',
      image: '/baltra/ceilingfan_baltra.jpg'
    },
    {
      id: 'fan-3',
      name: 'Baltra Max 48" High-Speed Ceiling Fan (BF-192)',
      category: 'fan',
      brand: 'Baltra',
      price: 4150,
      badge: 'High Air Delivery',
      specs: 'Aerodynamic Blades | Low Voltage Startup',
      description: 'Equipped with wider aerofoil blades for high cubic-feet-per-minute air delivery throughout summer months. Powder-coated finish resists humidity corrosion and grease build-up.',
      image: '/baltra/max_ceilingfan_baltra.jpg'
    },
    {
      id: 'fan-4',
      name: 'Baltra Lucky Compact Table Air Circulator',
      category: 'fan',
      brand: 'Baltra',
      price: 2450,
      badge: 'Compact',
      specs: 'Whisper Quiet Motor | 90° Smooth Oscillation',
      description: 'Personal desk circulator providing smooth wide-angle oscillation and tilt adjustment. Low power consumption makes it an ideal cooling solution for study desks and food prep areas.',
      image: '/baltra/lucky_tablefan_baltra.jpg'
    },
    {
      id: 'fan-5',
      name: 'Baltra Toofan Heavy-Duty Oscillating Stand Fan',
      category: 'fan',
      brand: 'Baltra',
      price: 4950,
      badge: 'Heavy Duty',
      specs: 'Telescopic Height Adjust | Weighted Round Base',
      description: 'Powerful pedestal fan designed with a heavy-duty copper motor and telescopic height adjustment. Delivers long-distance throw to cool living dining areas effortlessly.',
      image: '/baltra/toofan_standfan_baltra.jpg'
    },
    {
      id: 'fan-6',
      name: 'Baltra Kraft Premium Decorative Ceiling Fan (BF-148)',
      category: 'fan',
      brand: 'Baltra',
      price: 4650,
      badge: 'Decorative',
      specs: 'Golden Trim Accents | High-Grade Silicon Steel Motor',
      description: 'Designer ceiling fan accented with decorative trim rings and high-pitch aluminium blades. Operates smoothly at high RPM with minimal energy drain on inverter backups.',
      image: '/baltra/kraft_ceilingfan_baltra.jpg'
    },

    // 5. Bucket
    {
      id: 'bkt-1',
      name: 'Bagmati Rhino 20L Heavy-Duty Bucket with Lid',
      category: 'bucket',
      brand: 'Bagmati',
      price: 650,
      badge: 'Heavy Duty',
      specs: 'Unbreakable Plastic | Airtight Lid | 20L Capacity',
      description: 'Moulded from high-density virgin polymer built to endure heavy bathroom and household utility chores. Includes a secure snap-fit lid and a galvanized metal handle with comfort plastic grip.',
      image: '/bagmati/rhino_bucket_bagmati.webp'
    },
    {
      id: 'bkt-2',
      name: 'Bagmati Classic Household Bucket 15L',
      category: 'bucket',
      brand: 'Bagmati',
      price: 450,
      badge: 'Value',
      specs: 'Food-Grade Plastic | Reinforced Handle',
      description: 'Lightweight, crack-resistant 15L utility bucket with moulded pouring lip and volume markers. Safe for domestic water storage, cleaning solutions, and general kitchen tasks.',
      image: '/bagmati/bucket_bagmati.webp'
    },
    {
      id: 'bkt-3',
      name: 'GEM Everest Unbreakable 20L Bucket',
      category: 'bucket',
      brand: 'GEM',
      price: 580,
      badge: 'Popular',
      specs: 'Premium Virgin Plastic | Wide Mouth Opening',
      description: 'Manufactured in Nepal using flexible crack-proof polypropylene engineered to withstand accidental drops. Features a reinforced base ring and broad mouth for easy bucket immersion.',
      image: '/gem/everest_bucket_gem.jpg'
    },
    {
      id: 'bkt-4',
      name: 'Bagmati Heavy Utility Basin Tub 25L',
      category: 'bucket',
      brand: 'Bagmati',
      price: 750,
      badge: 'Multi-Use',
      specs: 'Extra Thick Walls | Wide Grip Rim',
      description: 'Large-capacity multipurpose washing basin crafted from resilient virgin plastic. Perfect for washing vegetables, soaking utensils, and general laundry chores with crack-resistant durability.',
      image: '/bagmati/basin_tub_bagmati.webp'
    },
    {
      id: 'bkt-5',
      name: 'Bagmati Multipurpose Round Utility Pail 18L',
      category: 'bucket',
      brand: 'Bagmati',
      price: 520,
      badge: 'Everyday',
      specs: 'Graduated Measuring Scale | Ergonomic Handle',
      description: 'Smooth-finish round household pail equipped with a strong anti-rust metal bail handle. Sturdy base ring prevents tipping during heavy water storage.',
      image: '/bagmati/round_pail_bagmati.webp'
    },
    {
      id: 'bkt-6',
      name: 'Bagmati Deep Storage Tub 30L',
      category: 'bucket',
      brand: 'Bagmati',
      price: 850,
      badge: 'High Capacity',
      specs: 'Side Carry Handles | Heavy Gauge Polypropylene',
      description: 'Deep-capacity heavy-duty utility tub designed for bulk water storage and household soaking tasks. Features side molded comfort handles and reinforced base ribs.',
      image: '/bagmati/storage_tub_bagmati.webp'
    },

    // 6. Ceramics
    {
      id: 'cer-1',
      name: 'Thimi Ceramics Handcrafted Bowl Set (Set of 4)',
      category: 'ceramics',
      brand: 'Thimi Ceramics',
      price: 1850,
      badge: 'Handmade',
      specs: 'Lead-Free Glaze | Microwave Safe | Nepal Origin',
      description: 'Authentic wheel-thrown ceramic bowls created by skilled potters in Thimi, Bhaktapur. Glazed with non-toxic, food-safe minerals, each bowl is microwave and dishwasher safe for dining.',
      image: '/ceramics/ceramic_bowl_set_ceramics.png'
    },
    {
      id: 'cer-2',
      name: 'Thimi Ceramics Ceramic Jar and Jug Set',
      category: 'ceramics',
      brand: 'Thimi Ceramics',
      price: 1600,
      badge: 'Artisan',
      specs: 'Hand-Thrown on Wheel | Traditional Thimi Craft',
      description: 'Handcrafted earthenware storage jar and tabletop water jug that naturally chills drinking water. Finished in rustic earthy glaze tones that highlight Nepal traditional ceramic artistry.',
      image: '/ceramics/ceramic_jar_jug_ceramics.png'
    },
    {
      id: 'cer-3',
      name: 'Thimi Ceramics Ceramic Cup and Glass Set',
      category: 'ceramics',
      brand: 'Thimi Ceramics',
      price: 1250,
      badge: 'Gift Ready',
      specs: 'Dishwasher Safe | 250ml Capacity Each',
      description: 'Set of 4 handcrafted clay tumblers with heat-retentive ceramic walls. Keeps morning tea, coffee, or hot cider warm longer with a comfortable natural tactile feel.',
      image: '/ceramics/ceramic_cup_glass_ceramics.png'
    },
    {
      id: 'cer-4',
      name: 'Thimi Ceramics Handcrafted Teapot & Cup Set',
      category: 'ceramics',
      brand: 'Thimi Ceramics',
      price: 2450,
      badge: 'Artisan Tea',
      specs: 'Wheel-Thrown Clay | Hand-Poured Spout | Food Safe',
      description: 'Artisanal teapot with matching cups crafted in Bhaktapur with organic clay. Retains brewing temperature for fine loose-leaf tea with natural earth-tone satin glazes.',
      image: '/ceramics/teapot_cups_ceramics.png'
    },
    {
      id: 'cer-5',
      name: 'Thimi Ceramics Artisan Glazed Dinner Plates Set',
      category: 'ceramics',
      brand: 'Thimi Ceramics',
      price: 2850,
      badge: 'Tableware',
      specs: 'Set of 4 Dinner Plates | Scratch Resistant Glaze',
      description: 'Hand-moulded dinner plate set showcasing subtle kiln-fired variations. Safe for microwave heating and everyday dining with rim lip preventing gravy runoff.',
      image: '/ceramics/dinner_plates_ceramics.png'
    },
    {
      id: 'cer-6',
      name: 'Thimi Ceramics Traditional Clay Planter Vase',
      category: 'ceramics',
      brand: 'Thimi Ceramics',
      price: 1450,
      badge: 'Home Decor',
      specs: 'Porous Terracotta Clay | Drainage Hole Included',
      description: 'Wheel-turned ceramic planter and tabletop vase that celebrates classical Newari pottery forms. Porous clay allows natural root aeration for indoor herbs and succulents.',
      image: '/ceramics/planter_vase_ceramics.png'
    },

    // 7. Mixer
    {
      id: 'mx-1',
      name: 'Baltra Zen-3 3-Jar Mixer Grinder (550W)',
      category: 'mixer',
      brand: 'Baltra',
      price: 4250,
      badge: 'Best Seller',
      specs: '100% Copper Motor | Stainless Steel Jars | Overload Protection',
      description: '550W heavy-duty motor with 3 high-grade stainless steel jars for wet, dry, and chutney grinding. Hardened blades grind tough whole spices and dal batters into smooth consistencies.',
      image: '/baltra/zen_mixergrinder_baltra.jpg'
    },
    {
      id: 'mx-2',
      name: 'Baltra King-3 Heavy-Duty Mixer Grinder (750W)',
      category: 'mixer',
      brand: 'Baltra',
      price: 5100,
      badge: 'Heavy Duty',
      specs: 'High-Torque Motor | Chutney, Dry and Wet Jars',
      description: 'Commercial-grade 750W copper motor designed to pulverize dry turmeric, ginger paste, and dosa mix. Features overload breaker reset and airtight jar lids with silicone sealing rings.',
      image: '/baltra/king_mixergrinder_baltra.jpg'
    },
    {
      id: 'mx-3',
      name: 'Baltra Harmony Hand Blender (300W)',
      category: 'mixer',
      brand: 'Baltra',
      price: 1850,
      badge: 'Compact',
      specs: 'Detachable Stainless Steel Shaft | Variable Speed',
      description: 'Slim handheld immersion blender with a food-safe stainless steel blending wand. Safe for pureeing hot soups, blending smoothies, and emulsifying sauces directly in the cooking pot.',
      image: '/baltra/harmony_handblender_baltra.jpg'
    },
    {
      id: 'mx-4',
      name: 'Baltra Mars Blue-Grey 3-Jar Mixer Grinder (500W)',
      category: 'mixer',
      brand: 'Baltra',
      price: 3950,
      badge: 'Modern Style',
      specs: 'Flow-Breaker Jars | 3-Speed Rotary Knob with Pulse',
      description: 'Ergonomic 500W grinder dressed in contemporary two-tone blue-grey housing. Stainless jars feature embossed flow-breakers ensuring quick blending without residue pockets.',
      image: '/baltra/mars_mixergrinder_baltra.jpg'
    },
    {
      id: 'mx-5',
      name: 'Baltra Nutri King Bullet Blender & Grinder (400W)',
      category: 'mixer',
      brand: 'Baltra',
      price: 3450,
      badge: 'Nutri-Blend',
      specs: 'Extracting Cross Blades | BPA-Free Tritan Cups',
      description: 'Compact personal nutrient extractor designed to break down seeds, fruits, and nuts in seconds. Includes two on-the-go travel cups with sip-lids for daily smoothies.',
      image: '/baltra/nutriking_blender_baltra.jpg'
    },
    {
      id: 'mx-6',
      name: 'Baltra Cyclone-3 High-Torque Mixer Grinder (600W)',
      category: 'mixer',
      brand: 'Baltra',
      price: 4650,
      badge: 'High Torque',
      specs: 'Heavy SS 304 Blades | Anti-Skid Vacuum Feet',
      description: 'Reliable 600W motor with vacuum suction feet preventing countertop movement during heavy spice pulverizing. Comes complete with liquidizing, dry, and chutney processing jars.',
      image: '/baltra/cyclone_mixergrinder_baltra.jpg'
    },

    // 8. Bottles
    {
      id: 'bot-1',
      name: 'Famous Steel Stainless Steel Water Bottle Set',
      category: 'bottles',
      brand: 'Famous Steel',
      price: 1250,
      badge: 'Steel Grade',
      specs: 'Food-Grade SS | Leak-Proof Cap | Rust-Resistant',
      description: 'Sturdy food-grade stainless steel bottles crafted in Nepal by Famous Steel. Corrosion-proof mirror body with silicone-sealed leak-proof caps suitable for school, office, and travel.',
      image: '/famous/steel_bottles_famous.png'
    },
    {
      id: 'bot-2',
      name: 'GEM Kool Square 1050ml Plastic Water Bottle',
      category: 'bottles',
      brand: 'GEM',
      price: 320,
      badge: 'Budget',
      specs: 'BPA-Free Plastic | Flip Cap | Wide Mouth',
      description: 'Square-profile refrigerator bottle moulded from BPA-free virgin polymer to fit snug in fridge door shelves. Tight flip-top spout allows quick, spill-free drinking on the go.',
      image: '/gem/kool_square_bottle_gem.jpg'
    },
    {
      id: 'bot-3',
      name: 'GEM Fewa 1100ml Sports Bottle',
      category: 'bottles',
      brand: 'GEM',
      price: 360,
      badge: 'Sports',
      specs: 'Ergonomic Grip | Easy-Pour Spout | 1100ml',
      description: 'Lightweight active hydration bottle with textured finger grooves for a non-slip grip. Features a dust cap and wide-mouth neck for convenient ice-cube filling and sponge cleaning.',
      image: '/gem/fewa_bottle_gem.jpg'
    },
    {
      id: 'bot-4',
      name: 'Bagmati Classic Drinkware Set',
      category: 'bottles',
      brand: 'Bagmati',
      price: 750,
      badge: 'Set',
      specs: 'Food-Grade Plastic | Stackable Design',
      description: 'Break-resistant family drinkware pitcher and tumbler set from Bagmati Plastic. Built with food-grade polymer that withstands daily dishwashing and outdoor dining use.',
      image: '/bagmati/drinkware_bagmati.jpg'
    },
    {
      id: 'bot-5',
      name: 'GEM Hydro Grip 1100ml Reusable Bottle',
      category: 'bottles',
      brand: 'GEM',
      price: 380,
      badge: 'Eco Friendly',
      specs: 'Food Grade PET | Odour-Free | Sturdy Cap',
      description: 'Translucent high-clarity drinking bottle engineered from non-toxic PET resin. Wide mouth allows hassle-free cleaning and fits standard bike and backpack bottle pockets.',
      image: '/gem/hydro_grip_bottle_gem.png'
    },
    {
      id: 'bot-6',
      name: 'Baltra Vacuum Insulated Thermal Flask 1000ml',
      category: 'bottles',
      brand: 'Baltra',
      price: 1450,
      badge: 'Thermal Flask',
      specs: 'Double-Wall Vacuum | 12-Hour Hot / Cold',
      description: 'Heavy-duty insulated vacuum flask keeping water, tea, and beverages piping hot or icy cold for 12 hours. Features push-button pour stopper and dual-use insulated cup lid.',
      image: '/baltra/vacuum_flask_bottle_baltra.jpg'
    },

    // 9. Lunch Box
    {
      id: 'lb-1',
      name: 'Baltra Luna 3-Tier Stainless Steel Lunch Box',
      category: 'lunch-box',
      brand: 'Baltra',
      price: 1650,
      badge: 'Best Seller',
      specs: 'Food-Grade SS | Leak-Proof Clips | 3 Containers',
      description: 'Three-tiered stackable stainless steel tiffin containers locked by an external steel carrier clasp. Keeps roti, dal, and curry neatly separated without spills or aroma migration.',
      image: '/baltra/luna_lunchbox_baltra.jpg'
    },
    {
      id: 'lb-2',
      name: 'Baltra Spicy SS Insulated Lunch Container',
      category: 'lunch-box',
      brand: 'Baltra',
      price: 2150,
      badge: 'Insulated',
      specs: 'Double-Wall Insulation | 3-Hour Heat Retention',
      description: 'Double-wall PUF insulated meal carrier that preserves meal warmth for over 3 hours. Comes with leak-proof inner steel containers and a washable zippered carry pouch.',
      image: '/baltra/spicy_lunchbox_baltra.jpg'
    },
    {
      id: 'lb-3',
      name: 'GEM Container Set 10-20-30 (3 Piece)',
      category: 'lunch-box',
      brand: 'GEM',
      price: 950,
      badge: 'Multi-Use',
      specs: 'Airtight Lid | Microwave Safe | Stackable',
      description: 'Three graduated nestable food boxes with airtight silicone snap-locks. Safe for refrigerator food storage, packed lunches, and reheating meals in the microwave.',
      image: '/gem/masala_box_gem.jpg'
    },
    {
      id: 'lb-4',
      name: 'Baltra Luna Pro 3-Container Sealed Lunch Set',
      category: 'lunch-box',
      brand: 'Baltra',
      price: 1450,
      badge: 'Tiffin Pro',
      specs: 'Virgin Food Grade Plastic | Snap Seals',
      description: 'Microwave-reheat safe modular lunch box with separate vegetable and curry compartments. Includes an insulated fabric pouch with carry strap for school and daily commute.',
      image: '/baltra/lunapro_lunchbox_baltra.jpg'
    },
    {
      id: 'lb-5',
      name: 'Baltra Spicy Pro 2-Container Insulated Tiffin',
      category: 'lunch-box',
      brand: 'Baltra',
      price: 1850,
      badge: 'Thermal Box',
      specs: 'Stainless Inner Bowls | Polyurethane Thermal Layer',
      description: 'Compact 2-bowl insulated meal carrier engineered to preserve freshly cooked aroma and steam heat. Tight silicone gaskets prevent gravy leakage inside work bags.',
      image: '/baltra/spicypro_lunchbox_baltra.jpg'
    },
    {
      id: 'lb-6',
      name: 'GEM Food Saver 4-Piece Airtight Meal Box Set',
      category: 'lunch-box',
      brand: 'GEM',
      price: 1150,
      badge: 'Value Pack',
      specs: 'BPA-Free | 4-Side Locking Clasps | Freezer Safe',
      description: 'Set of 4 airtight meal storage containers with silicone seal gaskets and 4-sided snap clips. Keeps rotis soft and curries completely fresh throughout working hours.',
      image: '/gem/food_saver_lunchbox_gem.jpg'
    },

    // 10. Kitchen Rack
    {
      id: 'kr-1',
      name: 'GEM Multipurpose 3-Piece Round Rack Set',
      category: 'kitchen-rack',
      brand: 'GEM',
      price: 1250,
      badge: 'Best Seller',
      specs: 'Stackable | Anti-Slip Base | 3 Sizes Included',
      description: 'Three-tier circular storage basket set ideal for organising onions, potatoes, and kitchen produce. Ventilated grid design encourages air circulation to keep vegetables dry and fresh.',
      image: '/gem/rack_round_gem.png'
    },
    {
      id: 'kr-2',
      name: 'GEM Multipurpose 3-Piece Square Rack Set',
      category: 'kitchen-rack',
      brand: 'GEM',
      price: 1450,
      badge: 'Space Saver',
      specs: 'Modular Design | Corrosion-Resistant | Heavy Duty',
      description: 'Stackable square countertop organiser that doubles vertical storage space in pantries and corners. Rust-resistant plastic pillars assemble in seconds with no tools required.',
      image: '/gem/rack_square_gem.png'
    },
    {
      id: 'kr-3',
      name: 'GEM Pirka Multipurpose Kitchen Rack (Small)',
      category: 'kitchen-rack',
      brand: 'GEM',
      price: 850,
      badge: 'Compact',
      specs: 'Countertop Size | Ventilated Shelves | Easy Assembly',
      description: 'Elevated countertop shelf rack designed to keep cooking oil bottles, masala boxes, and wet jars off kitchen counters. Easy to wipe clean with non-slip base pads.',
      image: '/gem/pirka_rack_gem.jpg'
    },
    {
      id: 'kr-4',
      name: 'Famous Steel Multi-Tier Steel Kitchen Rack',
      category: 'kitchen-rack',
      brand: 'Famous Steel',
      price: 3250,
      badge: 'Premium',
      specs: 'SS 304 Grade | 4-Tier Design | Rust-Free Finish',
      description: 'Heavy-gauge stainless steel multi-level utensil rack manufactured in Nepal. High load-bearing capacity easily holds heavy pressure cookers, kadai, thalis, and daily kitchenware.',
      image: '/famous/steel_rack_famous.png'
    },
    {
      id: 'kr-5',
      name: 'GEM Stylex Multipurpose Cutlery Stand & Rack',
      category: 'kitchen-rack',
      brand: 'GEM',
      price: 480,
      badge: 'Organizer',
      specs: 'Multi-Compartment | Water Drainage Tray',
      description: 'Hygienic countertop cutlery holder with dedicated slots for spoons, forks, knives, and cooking spatulas. Detachable drainage base prevents water pooling on kitchen surfaces.',
      image: '/gem/cutlery_stand_gem.jpg'
    },
    {
      id: 'kr-6',
      name: 'Bagmati Heavy-Duty Corner Cutlery & Dish Rack',
      category: 'kitchen-rack',
      brand: 'Bagmati',
      price: 620,
      badge: 'Kitchen Essential',
      specs: 'High Grade Virgin Plastic | Corner Fit Design',
      description: 'Space-optimised corner drainer rack designed for small kitchen sinks. Made from durable food-grade plastic that resists detergent stains and grease deposits.',
      image: '/bagmati/cutlery_rack_bagmati.webp'
    }
  ]

  const allProducts = productsLoading || productsError
    ? []
    : apiProducts.length > 0
      ? apiProducts
      : fallbackProducts

  // Find active category info
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategorySlug) || null
  }, [activeCategorySlug, categories])

  // Filter products by category, brand, and price (Nepali Rupees)
  const filteredProducts = useMemo(() => {
    if (!activeCategory && !activeBrand) return []

    let list = activeCategory
      ? allProducts.filter((p) => p.category === activeCategory.id)
      : allProducts.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase())

    if (activeBrand && brandSearch.trim()) {
      const search = brandSearch.trim().toLowerCase()
      list = list.filter((p) =>
        [p.name, p.specs, p.description].some((value) => value?.toLowerCase().includes(search))
      )
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand === selectedBrand)
    }

    // Price Range filter in Nepali Rupees
    if (selectedPriceRange === 'under-1500') {
      list = list.filter((p) => p.price < 1500)
    } else if (selectedPriceRange === '1500-3500') {
      list = list.filter((p) => p.price >= 1500 && p.price <= 3500)
    } else if (selectedPriceRange === 'above-3500') {
      list = list.filter((p) => p.price > 3500)
    }

    // Sort order
    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [activeCategory, activeBrand, brandSearch, allProducts, selectedBrand, selectedPriceRange, sortBy])

  // Available brands within the active category for the filter pill bar
  const availableBrands = useMemo(() => {
    if (!activeCategory) return []
    const brandsSet = new Set(
      allProducts.filter((p) => p.category === activeCategory.id).map((p) => p.brand)
    )
    return ['All', ...Array.from(brandsSet)]
  }, [activeCategory, allProducts])

  // Helper to change category via query parameter
  const handleSelectCategory = (categoryId) => {
    setSearchParams({ category: categoryId })
    setBrandSearch('')
    setSelectedBrand('All')
    setSelectedPriceRange('All')
    setSortBy('featured')
    setActiveProduct(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearCategory = () => {
    setSearchParams({})
    setBrandSearch('')
    setSelectedBrand('All')
    setSelectedPriceRange('All')
    setSortBy('featured')
    setActiveProduct(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page-container shop-page">
      {productsLoading && (
        <div className="shop-data-status" role="status">
          Loading products...
        </div>
      )}
      {productsError && (
        <div className="shop-data-status error" role="alert">
          Unable to load products: {productsError}
        </div>
      )}
      {/* =========================================================================
          VIEW 1: CATEGORY GRID (When no specific category is selected)
         ========================================================================= */}
      {!activeCategory && !activeBrand ? (
        <section className="categories-view-section">
          <div className="page-header">
            <h1>Explore by Category</h1>
            <p>
              Select an appliance category below to discover models across multiple price ranges, sizes, and trusted brands.
            </p>
          </div>

          <div className="appliance-category-grid">
            {categories.map((cat) => {
              const productCount = allProducts.filter((p) => p.category === cat.id).length
              return (
                <div
                  key={cat.id}
                  className="appliance-cat-card"
                  onClick={() => handleSelectCategory(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectCategory(cat.id)
                  }}
                >
                  <div className="appliance-icon-wrapper">
                    <CategoryIcon name={cat.id} color="var(--accent-terracotta)" size={64} />
                  </div>
                  <h3 className="appliance-cat-title">{cat.name}</h3>
                  <span className="appliance-cat-count">
                    {productsLoading ? 'Loading products...' : `${productCount} ${productCount === 1 ? 'Product' : 'Products'} Available`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      ) : (
        /* =========================================================================
            VIEW 2: FILTERED PRODUCTS VIEW (When category is selected)
           ========================================================================= */
        <section className="category-products-section">
          {/* Top Breadcrumb & Back Bar */}
          <div className="shop-breadcrumb-bar">
            <button className="back-categories-btn" onClick={handleClearCategory}>
              ← Back to All {activeBrand ? 'Products' : 'Categories'}
            </button>
            <div className="breadcrumb-trail">
              <Link to="/">Home</Link>
              <span>/</span>
              <button className="breadcrumb-link-btn" onClick={handleClearCategory}>
                Shop
              </button>
              <span>/</span>
              <span className="breadcrumb-current">{activeBrand || activeCategory.shortName}</span>
            </div>
          </div>

          {/* Category Banner */}
          <div className="category-header-banner">
            <div className="category-banner-icon">
              {activeCategory ? (
                <CategoryIcon name={activeCategory.id} color="var(--accent-terracotta)" size={52} />
              ) : (
                <span className="brand-banner-mark">{activeBrand.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="category-banner-info">
              <h2>{activeBrand || activeCategory.shortName}</h2>
              <p>
                {activeBrand
                  ? `Explore all ${activeBrand} products available at KLAY.`
                  : activeCategory.description}
              </p>
            </div>
          </div>

          {activeBrand && (
            <div className="brand-search-panel">
              <label htmlFor="brand-product-search">Search {activeBrand} products</label>
              <input
                id="brand-product-search"
                type="search"
                value={brandSearch}
                onChange={(event) => setBrandSearch(event.target.value)}
                placeholder={`Search ${activeBrand} products...`}
              />
            </div>
          )}

          {/* Filter & Sorting Controls */}
          <div className="shop-controls-panel">
            {/* Brand Filter */}
            {!activeBrand && <div className="control-group">
              <span className="control-label">Brand:</span>
              <div className="pill-filters">
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    className={`filter-pill ${selectedBrand === b ? 'active' : ''}`}
                    onClick={() => setSelectedBrand(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>}

            {/* Price Filter (in Nepali Rupees) */}
            <div className="control-group">
              <span className="control-label">Price Range:</span>
              <div className="pill-filters">
                <button
                  className={`filter-pill ${selectedPriceRange === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedPriceRange('All')}
                >
                  All Prices
                </button>
                <button
                  className={`filter-pill ${selectedPriceRange === 'under-1500' ? 'active' : ''}`}
                  onClick={() => setSelectedPriceRange('under-1500')}
                >
                  Under Rs. 1,500
                </button>
                <button
                  className={`filter-pill ${selectedPriceRange === '1500-3500' ? 'active' : ''}`}
                  onClick={() => setSelectedPriceRange('1500-3500')}
                >
                  Rs. 1,500 - Rs. 3,500
                </button>
                <button
                  className={`filter-pill ${selectedPriceRange === 'above-3500' ? 'active' : ''}`}
                  onClick={() => setSelectedPriceRange('above-3500')}
                >
                  Above Rs. 3,500
                </button>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="control-group sort-group">
              <span className="control-label">Sort:</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="category-products-count">
            Showing <strong>{filteredProducts.length}</strong> products for{' '}
            <em>{activeBrand || activeCategory.shortName}</em>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-products-state">
              <h3>No products found for the selected filters.</h3>
              <p>Try resetting the brand or price filters above.</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedBrand('All')
                  setSelectedPriceRange('All')
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map((item) => (
                <div
                  key={item.productId || item.id || item._id}
                  className="shop-card clickable-card"
                  onClick={() => setActiveProduct(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setActiveProduct(item)
                  }}
                >
                  <div className="shop-icon-wrapper">
                    {item.badge && <span className="product-tag">{item.badge}</span>}
                    {item.image ? (
                      <img className="shop-image" src={item.image} alt={item.name} />
                    ) : (
                      <CategoryIcon name={item.category} color="var(--accent-terracotta)" size={64} />
                    )}

                  </div>
                  <div className="shop-content">
                    <div className="product-meta">
                      <span className="brand-badge-pill">{item.brand}</span>
                      <span className="product-cat-tag">
                        {categories.find((category) => category.id === item.category)?.shortName || item.category}
                      </span>
                    </div>
                    <h3>{item.name}</h3>
                    {item.specs && <p className="product-specs-line">{item.specs}</p>}
                    <div className="shop-price-row">
                      <span className="price">Rs. {item.price.toLocaleString('en-IN')}</span>
                      <button
                        type="button"
                        className="add-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          openQuantityModal(item)
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>

                    <div className="card-details-footer">
                      <button
                        type="button"
                        className="card-details-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveProduct(item)
                        }}
                      >
                        Click for Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Categories Switcher Bar */}
          {!activeBrand && <div className="browse-other-categories">
            <h4>Browse Other Categories</h4>
            <div className="category-quick-pills">
              {categories
                .filter((c) => c.id !== activeCategory.id)
                .map((cat) => (
                  <button
                    key={cat.id}
                    className="quick-cat-pill"
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    {cat.shortName}
                  </button>
                ))}
            </div>
          </div>
          }
        </section>
      )}

      {/* =========================================================================
          PRODUCT DETAIL MODAL (Opens when clicking any product card)
         ========================================================================= */}
      {activeProduct && (
        <div
          className="product-modal-backdrop"
          onClick={() => setActiveProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="product-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="product-modal-close"
              onClick={() => setActiveProduct(null)}
              aria-label="Close product details"
            >
              &times;
            </button>
            <div className="product-modal-body">
              <div className="product-modal-image-col">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="product-modal-img"
                />
                {activeProduct.badge && (
                  <span className="product-modal-badge">{activeProduct.badge}</span>
                )}
              </div>
              <div className="product-modal-details-col">
                <div className="product-modal-meta">
                  <span className="brand-badge-pill">{activeProduct.brand}</span>
                  <span className="product-cat-tag">
                    {categories.find((c) => c.id === activeProduct.category)?.shortName ||
                      activeProduct.category}
                  </span>
                </div>
                <h2 className="product-modal-title">{activeProduct.name}</h2>
                <div className="product-modal-price">
                  Rs. {activeProduct.price.toLocaleString('en-IN')}
                </div>

                <div className="product-modal-desc-section">
                  <h4>Product Description</h4>
                  <p className="product-modal-desc">{activeProduct.description}</p>
                </div>

                {activeProduct.specs && (
                  <div className="product-modal-specs-section">
                    <h4>Key Features &amp; Specifications</h4>
                    <div className="product-modal-specs-list">
                      {activeProduct.specs.split(' | ').map((spec, idx) => (
                        <span key={idx} className="spec-chip">
                          ✓ {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="product-modal-actions">
                  <button
                    className="btn btn-primary modal-cart-btn"
                    onClick={() => {
                      const prod = activeProduct
                      setActiveProduct(null)
                      openQuantityModal(prod)
                    }}
                  >
                    Add to Cart • Rs. {activeProduct.price.toLocaleString('en-IN')}
                  </button>
                  <button
                    className="btn btn-secondary modal-cancel-btn"
                    onClick={() => setActiveProduct(null)}
                  >
                    Back to Shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
