import { useState, useEffect, useMemo } from 'react'
import './ShopFilterSidebar.css'

export default function ShopFilterSidebar({
  categories = [],
  brandsList = [],
  allProducts = [],
  selectedCategories = [],
  onToggleCategory,
  selectedBrands = [],
  onToggleBrand,
  priceRange = [300, 6000],
  onApplyPrice,
  stockFilter = 'all', // 'all', 'in-stock', 'out-of-stock'
  onToggleStock,
  selectedMaterials = [],
  onToggleMaterial,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
  minPossiblePrice = 300,
  maxPossiblePrice = 6000
}) {
  const activeFilterCount = [
    ...selectedCategories,
    ...selectedBrands,
    ...selectedMaterials
  ].length +
    (priceRange[0] > minPossiblePrice || priceRange[1] < maxPossiblePrice ? 1 : 0) +
    (stockFilter !== 'all' ? 1 : 0)
  // Collapsible section states (all default to open as in inspiration screenshot)
  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    stock: true,
    brand: true,
    material: true
  })

  // Local state for the dual price inputs
  const [minPriceInput, setMinPriceInput] = useState(priceRange[0])
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange[1])

  // Sync inputs if parent resets priceRange
  useEffect(() => {
    setMinPriceInput(priceRange[0])
    setMaxPriceInput(priceRange[1])
  }, [priceRange])

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Handle OK button click for price
  const handlePriceSubmit = (e) => {
    e?.preventDefault()
    let min = Number(minPriceInput) || minPossiblePrice
    let max = Number(maxPriceInput) || maxPossiblePrice
    if (min > max) {
      const temp = min
      min = max
      max = temp
    }
    min = Math.max(minPossiblePrice, min)
    max = Math.min(maxPossiblePrice, max)
    setMinPriceInput(min)
    setMaxPriceInput(max)
    onApplyPrice(min, max)
  }

  // Handle dual range slider drag
  const handleMinSlider = (e) => {
    const val = Math.min(Number(e.target.value), maxPriceInput - 100)
    setMinPriceInput(val)
    onApplyPrice(val, maxPriceInput)
  }

  const handleMaxSlider = (e) => {
    const val = Math.max(Number(e.target.value), minPriceInput + 100)
    setMaxPriceInput(val)
    onApplyPrice(minPriceInput, val)
  }

  // Calculate live count for categories
  const categoryCounts = useMemo(() => {
    const map = {}
    categories.forEach((c) => {
      map[c.id] = allProducts.filter((p) => p.category === c.id).length
    })
    return map
  }, [categories, allProducts])

  // Calculate live count for brands
  const brandCounts = useMemo(() => {
    const map = {}
    brandsList.forEach((b) => {
      const brandName = b.name || b.brand
      map[brandName] = allProducts.filter(
        (p) => p.brand?.toLowerCase() === brandName.toLowerCase()
      ).length
    })
    return map
  }, [brandsList, allProducts])

  // Calculate stock counts
  const stockCounts = useMemo(() => {
    let inStock = 0
    let outOfStock = 0
    allProducts.forEach((p) => {
      const stock = typeof p.stock === 'number' ? p.stock : 10
      if (stock > 0) inStock++
      else outOfStock++
    })
    return { inStock, outOfStock }
  }, [allProducts])

  // Common materials extracted from specs/descriptions
  const materialOptions = [
    { id: 'stainless-steel', label: 'Stainless Steel', match: ['stainless', 'steel'] },
    { id: 'aluminium', label: 'Aluminium Cookware', match: ['aluminium', 'aluminum', 'anodised', 'anodized'] },
    { id: 'terracotta-clay', label: 'Terracotta & Ceramic', match: ['ceramic', 'clay', 'earthen', 'terracotta'] },
    { id: 'induction-base', label: 'Induction Compatible', match: ['induction'] },
    { id: 'insulated-plastic', label: 'Insulated / BPA-Free', match: ['insulated', 'bpa', 'plastic', 'thermal'] }
  ]

  const materialCounts = useMemo(() => {
    const map = {}
    materialOptions.forEach((mat) => {
      map[mat.id] = allProducts.filter((p) => {
        const text = `${p.name} ${p.specs || ''} ${p.description || ''} ${p.material || ''}`.toLowerCase()
        return mat.match.some((keyword) => text.includes(keyword))
      }).length
    })
    return map
  }, [allProducts])

  // Slider background calculation
  const minPercent = ((minPriceInput - minPossiblePrice) / (maxPossiblePrice - minPossiblePrice)) * 100
  const maxPercent = ((maxPriceInput - minPossiblePrice) / (maxPossiblePrice - minPossiblePrice)) * 100

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="filter-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`filter-sidebar-card${isOpenMobile ? ' filter-sidebar-mobile-open' : ''}`}
        aria-label="Product Filters"
      >
      {/* Sidebar Header with Clear All */}
      <div className="filter-sidebar-header">
        <h3 className="filter-sidebar-title">
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="mobile-filter-badge">{activeFilterCount}</span>
          )}
        </h3>
        <div className="filter-header-right">
          {activeFilterCount > 0 && (
            <button type="button" className="filter-clear-all-btn" onClick={onResetFilters}>
              Clear All
            </button>
          )}
          <button
            type="button"
            className="filter-mobile-close-btn"
            onClick={onCloseMobile}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: PRICE ================= */}
      <div className="filter-section">
        <button
          type="button"
          className="filter-section-header"
          onClick={() => toggleSection('price')}
          aria-expanded={openSections.price}
        >
          <span>Price (Rs.)</span>
          <span className={`filter-chevron-icon ${openSections.price ? 'expanded' : ''}`}>▼</span>
        </button>

        {openSections.price && (
          <div className="filter-section-body">
            {/* Dual Slider Bar */}
            <div className="price-slider-wrapper">
              <div className="price-slider-track" />
              <div
                className="price-slider-range"
                style={{
                  left: `${Math.max(0, Math.min(100, minPercent))}%`,
                  width: `${Math.max(0, Math.min(100, maxPercent - minPercent))}%`
                }}
              />
              <input
                type="range"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                step={50}
                value={minPriceInput}
                onChange={handleMinSlider}
                className="price-range-input"
                aria-label="Minimum price slider"
              />
              <input
                type="range"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                step={50}
                value={maxPriceInput}
                onChange={handleMaxSlider}
                className="price-range-input"
                aria-label="Maximum price slider"
              />
            </div>

            {/* Price Number Inputs and OK button */}
            <form className="price-inputs-row" onSubmit={handlePriceSubmit}>
              <input
                type="number"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="price-number-input"
                aria-label="Minimum price in Rs"
              />
              <span className="price-separator">—</span>
              <input
                type="number"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="price-number-input"
                aria-label="Maximum price in Rs"
              />
              <button type="submit" className="price-ok-btn">
                OK
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ================= SECTION 2: KITCHEN CATEGORIES ================= */}
      <div className="filter-section">
        <button
          type="button"
          className="filter-section-header"
          onClick={() => toggleSection('category')}
          aria-expanded={openSections.category}
        >
          <span>Kitchen Category</span>
          <span className={`filter-chevron-icon ${openSections.category ? 'expanded' : ''}`}>▼</span>
        </button>

        {openSections.category && (
          <div className="filter-section-body">
            <div className="filter-options-list">
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0
                const isChecked = selectedCategories.includes(cat.id)
                return (
                  <label key={cat.id} className="filter-option-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCategory(cat.id)}
                    />
                    <span className="filter-option-name">{cat.shortName}</span>
                    <span className="filter-option-count">({count})</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION 4: BRANDS (With Logos) ================= */}
      <div className="filter-section">
        <button
          type="button"
          className="filter-section-header"
          onClick={() => toggleSection('brand')}
          aria-expanded={openSections.brand}
        >
          <span>Brands</span>
          <span className={`filter-chevron-icon ${openSections.brand ? 'expanded' : ''}`}>▼</span>
        </button>

        {openSections.brand && (
          <div className="filter-section-body">
            <div className="filter-options-list">
              {brandsList.map((b) => {
                const brandName = b.name || b.brand
                const count = brandCounts[brandName] || 0
                const isChecked = selectedBrands.includes(brandName)
                return (
                  <label key={brandName} className="filter-option-label brand-filter-item">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={isChecked}
                      onChange={() => onToggleBrand(brandName)}
                    />
                    {b.logo && (
                      <div className="brand-filter-logo-box">
                        <img
                          src={b.logo}
                          alt={brandName}
                          className="brand-filter-logo-img"
                          onError={(e) => {
                            e.currentTarget.parentElement.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <span className="filter-option-name">{brandName}</span>
                    <span className="filter-option-count">({count})</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= SECTION 5: UTENSIL MATERIAL / TYPE ================= */}
      <div className="filter-section">
        <button
          type="button"
          className="filter-section-header"
          onClick={() => toggleSection('material')}
          aria-expanded={openSections.material}
        >
          <span>Material &amp; Build</span>
          <span className={`filter-chevron-icon ${openSections.material ? 'expanded' : ''}`}>▼</span>
        </button>

        {openSections.material && (
          <div className="filter-section-body">
            <div className="filter-options-list">
              {materialOptions.map((mat) => {
                const count = materialCounts[mat.id] || 0
                const isChecked = selectedMaterials.includes(mat.id)
                return (
                  <label key={mat.id} className="filter-option-label">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={isChecked}
                      onChange={() => onToggleMaterial(mat.id)}
                    />
                    <span className="filter-option-name">{mat.label}</span>
                    <span className="filter-option-count">({count})</span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
