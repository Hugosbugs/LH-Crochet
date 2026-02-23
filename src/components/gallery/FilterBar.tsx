'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronDown, X, Check, SlidersHorizontal } from 'lucide-react'
import {
  FILTER_CATEGORIES,
  DROPDOWN_CATEGORIES_MVP,
  PHASE2_CATEGORIES,
  getLabelForTag,
  type FilterOption,
  type FilterCategory,
} from '@/lib/filters'
import {
  buildEmptyFilterState,
  hasActiveFilters,
} from '@/lib/utils'
import Button from '@/components/ui/Button'
import type { FilterState } from '@/lib/types'
import type { ProjectWithUrls } from '@/lib/types'

// ── Helpers ────────────────────────────────────────────────────────────────

function toggleValue(filters: FilterState, key: string, value: string): FilterState {
  const next = { ...filters }
  const set = new Set(next[key])
  set.has(value) ? set.delete(value) : set.add(value)
  next[key] = set
  return next
}

// ── FilterDropdown ─────────────────────────────────────────────────────────

type FilterDropdownProps = {
  category: FilterCategory
  selected: Set<string>
  onToggle: (value: string) => void
  onClear: () => void
}

function FilterDropdown({ category, selected, onToggle, onClear }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const isActive = selected.size > 0

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter by ${category.label}`}
        onClick={() => setOpen(prev => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tracking-wide transition-colors cursor-pointer
          ${isActive
            ? 'bg-charcoal text-white'
            : 'bg-white text-charcoal border border-gray-200 hover:border-gray-400'
          }`}
      >
        {category.label}
        {isActive && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-clay text-white text-[10px] font-bold leading-none">
            {selected.size}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-label={category.label}
          className="absolute top-full mt-1.5 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[168px]"
        >
          {category.options.map(opt => (
            <li key={opt.value} role="option" aria-selected={selected.has(opt.value)}>
              <button
                type="button"
                onClick={() => onToggle(opt.value)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-charcoal hover:bg-surface transition-colors"
              >
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
                    ${selected.has(opt.value)
                      ? 'bg-charcoal border-charcoal'
                      : 'border-gray-300'
                    }`}
                >
                  {selected.has(opt.value) && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                {opt.label}
              </button>
            </li>
          ))}
          {isActive && (
            <li className="border-t border-gray-100 mt-1 pt-1">
              <button
                type="button"
                onClick={() => { onClear(); setOpen(false) }}
                className="w-full text-left px-3 py-1.5 text-xs text-charcoal/50 hover:text-clay transition-colors"
              >
                Clear
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

// ── FilterDrawer ───────────────────────────────────────────────────────────

type FilterDrawerProps = {
  open: boolean
  onClose: () => void
  categories: FilterCategory[]
  filters: FilterState
  onToggle: (categoryKey: string, value: string) => void
  onClearCategory: (categoryKey: string) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

function FilterDrawer({
  open,
  onClose,
  categories,
  filters,
  onToggle,
  onClearCategory,
  triggerRef,
}: FilterDrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus()
    } else {
      triggerRef.current?.focus()
    }
  }, [open, triggerRef])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-charcoal/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="More filters"
        className="fixed right-0 top-0 h-full w-80 z-40 bg-white shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-charcoal">More Filters</h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-1 rounded-lg text-charcoal/50 hover:text-charcoal hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {categories.map(cat => {
            if (cat.options.length === 0) return null
            const catSelected = filters[cat.key] ?? new Set<string>()
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                    {cat.label}
                  </p>
                  {catSelected.size > 0 && (
                    <button
                      type="button"
                      onClick={() => onClearCategory(cat.key)}
                      className="text-xs text-charcoal/40 hover:text-clay transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.options.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onToggle(cat.key, opt.value)}
                      aria-pressed={catSelected.has(opt.value)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer
                        ${catSelected.has(opt.value)
                          ? 'bg-charcoal text-white'
                          : 'border border-gray-200 text-charcoal hover:border-gray-400'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </>
  )
}

// ── ActiveFilterChip ───────────────────────────────────────────────────────

type ActiveFilterChipProps = {
  label: string
  onRemove: () => void
}

function ActiveFilterChip({ label, onRemove }: ActiveFilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-sage/15 text-charcoal border border-sage/30">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="ml-0.5 text-charcoal/50 hover:text-clay transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ── FilterBar (main export) ────────────────────────────────────────────────

type FilterBarProps = {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  projects: ProjectWithUrls[]
}

export default function FilterBar({ filters, onFiltersChange, projects }: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const moreFiltersBtnRef = useRef<HTMLButtonElement>(null)

  // Dynamic collection options derived from live project tags
  const collectionOptions = useMemo<FilterOption[]>(() => {
    const seen = new Set<string>()
    for (const p of projects) {
      for (const tag of p.tags) {
        if (tag.startsWith('collection:')) seen.add(tag)
      }
    }
    return Array.from(seen).sort().map(tag => ({
      value: tag,
      label: getLabelForTag(tag),
    }))
  }, [projects])

  // Inject dynamic collection options into Phase 2 categories
  const resolvedPhase2 = useMemo(() => {
    return PHASE2_CATEGORIES.map(cat =>
      cat.key === 'collection' ? { ...cat, options: collectionOptions } : cat
    )
  }, [collectionOptions])

  function handleToggle(key: string, value: string) {
    onFiltersChange(toggleValue(filters, key, value))
  }

  function handleClearCategory(key: string) {
    onFiltersChange({ ...filters, [key]: new Set<string>() })
  }

  function handleClearAll() {
    onFiltersChange(buildEmptyFilterState())
  }

  // Build active chips list (all selected values across all categories)
  const activeChips = useMemo(() => {
    const chips: { categoryKey: string; value: string; label: string }[] = []
    for (const cat of FILTER_CATEGORIES) {
      const selected = filters[cat.key]
      if (!selected) continue
      for (const value of selected) {
        chips.push({ categoryKey: cat.key, value, label: getLabelForTag(value) })
      }
    }
    return chips
  }, [filters])

  const phase2ActiveCount = useMemo(() => {
    return PHASE2_CATEGORIES.reduce((n, cat) => n + (filters[cat.key]?.size ?? 0), 0)
  }, [filters])

  return (
    <div role="search" aria-label="Filter gallery" className="space-y-3">
      {/* Row 1 — All dropdowns + More Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {DROPDOWN_CATEGORIES_MVP.map(cat => (
          <FilterDropdown
            key={cat.key}
            category={cat}
            selected={filters[cat.key] ?? new Set()}
            onToggle={value => handleToggle(cat.key, value)}
            onClear={() => handleClearCategory(cat.key)}
          />
        ))}
        <button
          ref={moreFiltersBtnRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tracking-wide transition-colors cursor-pointer
            ${phase2ActiveCount > 0
              ? 'bg-charcoal text-white'
              : 'bg-white text-charcoal border border-gray-200 hover:border-gray-400'
            }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          More Filters
          {phase2ActiveCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-clay text-white text-[10px] font-bold leading-none">
              {phase2ActiveCount}
            </span>
          )}
        </button>
      </div>

      {/* Row 3 — Active filter chips (only when filters are active) */}
      {hasActiveFilters(filters) && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map(chip => (
            <ActiveFilterChip
              key={chip.value}
              label={chip.label}
              onRemove={() => handleToggle(chip.categoryKey, chip.value)}
            />
          ))}
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-charcoal/40 hover:text-clay transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* More Filters slide-over drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={resolvedPhase2}
        filters={filters}
        onToggle={handleToggle}
        onClearCategory={handleClearCategory}
        triggerRef={moreFiltersBtnRef}
      />
    </div>
  )
}
