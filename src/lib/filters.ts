export interface FilterOption {
  value: string
  label: string
}

export interface FilterCategory {
  key: string
  label: string
  uiVariant: 'chips' | 'dropdown'
  phase: 1 | 2
  options: FilterOption[]
}

export const FILTER_CATEGORIES: FilterCategory[] = [
  // ── Phase 1 — MVP ──────────────────────────────────────────────────────
  {
    key: 'type',
    label: 'Project Type',
    uiVariant: 'dropdown',
    phase: 1,
    options: [
      { value: 'type:amigurumi',  label: 'Amigurumi' },
      { value: 'type:wearable',   label: 'Wearable' },
      { value: 'type:accessory',  label: 'Accessory' },
      { value: 'type:home-decor', label: 'Home Décor' },
      { value: 'type:baby',       label: 'Baby & Kids' },
      { value: 'type:bag',        label: 'Bags & Pouches' },
      { value: 'type:blanket',    label: 'Blanket & Throw' },
      { value: 'type:holiday',    label: 'Holiday & Seasonal' },
    ],
  },
  {
    key: 'skill',
    label: 'Skill Level',
    uiVariant: 'dropdown',
    phase: 1,
    options: [
      { value: 'skill:beginner',     label: 'Beginner' },
      { value: 'skill:easy',         label: 'Easy' },
      { value: 'skill:intermediate', label: 'Intermediate' },
      { value: 'skill:advanced',     label: 'Advanced' },
    ],
  },
  {
    key: 'weight',
    label: 'Yarn Weight',
    uiVariant: 'dropdown',
    phase: 1,
    options: [
      { value: 'weight:lace',        label: 'Lace (0)' },
      { value: 'weight:fingering',   label: 'Fingering (1)' },
      { value: 'weight:sport',       label: 'Sport (2)' },
      { value: 'weight:dk',          label: 'DK (3)' },
      { value: 'weight:worsted',     label: 'Worsted (4)' },
      { value: 'weight:bulky',       label: 'Bulky (5)' },
      { value: 'weight:super-bulky', label: 'Super Bulky (6)' },
    ],
  },
  {
    key: 'color',
    label: 'Color Palette',
    uiVariant: 'dropdown',
    phase: 1,
    options: [
      { value: 'color:pastel',     label: 'Pastel' },
      { value: 'color:neutral',    label: 'Neutral / Earth' },
      { value: 'color:bright',     label: 'Bright & Bold' },
      { value: 'color:monochrome', label: 'Monochrome' },
      { value: 'color:multicolor', label: 'Multicolor' },
      { value: 'color:dark',       label: 'Dark / Moody' },
    ],
  },
  {
    key: 'occasion',
    label: 'Occasion',
    uiVariant: 'dropdown',
    phase: 1,
    options: [
      { value: 'occasion:giftable',    label: 'Giftable' },
      { value: 'occasion:everyday',    label: 'Everyday' },
      { value: 'occasion:seasonal',    label: 'Seasonal' },
      { value: 'occasion:baby-shower', label: 'Baby Shower' },
      { value: 'occasion:wedding',     label: 'Wedding' },
      { value: 'occasion:party',       label: 'Party & Celebration' },
    ],
  },

  // ── Phase 2 — "More Filters" drawer ────────────────────────────────────
  {
    key: 'size',
    label: 'Size',
    uiVariant: 'dropdown',
    phase: 2,
    options: [
      { value: 'size:mini',      label: 'Mini / Keychain' },
      { value: 'size:small',     label: 'Small' },
      { value: 'size:medium',    label: 'Medium' },
      { value: 'size:large',     label: 'Large' },
      { value: 'size:oversized', label: 'Oversized' },
    ],
  },
  {
    key: 'construction',
    label: 'Construction Method',
    uiVariant: 'dropdown',
    phase: 2,
    options: [
      { value: 'construction:flat',          label: 'Worked Flat' },
      { value: 'construction:in-the-round',  label: 'In the Round' },
      { value: 'construction:granny-square', label: 'Granny Square' },
      { value: 'construction:motif',         label: 'Motif / Join-as-you-go' },
      { value: 'construction:tapestry',      label: 'Tapestry / Colorwork' },
    ],
  },
  {
    key: 'fiber',
    label: 'Fiber Type',
    uiVariant: 'dropdown',
    phase: 2,
    options: [
      { value: 'fiber:acrylic',  label: 'Acrylic' },
      { value: 'fiber:cotton',   label: 'Cotton' },
      { value: 'fiber:wool',     label: 'Wool' },
      { value: 'fiber:alpaca',   label: 'Alpaca' },
      { value: 'fiber:blend',    label: 'Blend' },
      { value: 'fiber:recycled', label: 'Recycled / Eco' },
    ],
  },
  {
    key: 'time',
    label: 'Time to Make',
    uiVariant: 'dropdown',
    phase: 2,
    options: [
      { value: 'time:under-1h',  label: 'Under 1 Hour' },
      { value: 'time:1-3h',      label: '1–3 Hours' },
      { value: 'time:half-day',  label: 'Half Day' },
      { value: 'time:full-day',  label: 'Full Day' },
      { value: 'time:weekend',   label: 'Weekend Project' },
      { value: 'time:multi-week', label: 'Multi-Week' },
    ],
  },
  {
    // options are populated dynamically in FilterBar from live project tags
    key: 'collection',
    label: 'Collection',
    uiVariant: 'dropdown',
    phase: 2,
    options: [],
  },
  {
    key: 'pattern',
    label: 'Pattern Type',
    uiVariant: 'dropdown',
    phase: 2,
    options: [
      { value: 'pattern:free',       label: 'Free Pattern' },
      { value: 'pattern:paid',       label: 'Paid Pattern' },
      { value: 'pattern:no-pattern', label: 'No Pattern' },
    ],
  },
]

export const MVP_CATEGORIES = FILTER_CATEGORIES.filter(c => c.phase === 1)
export const PHASE2_CATEGORIES = FILTER_CATEGORIES.filter(c => c.phase === 2)
export const DROPDOWN_CATEGORIES_MVP = FILTER_CATEGORIES.filter(c => c.phase === 1)

export function getLabelForTag(value: string): string {
  for (const cat of FILTER_CATEGORIES) {
    const opt = cat.options.find(o => o.value === value)
    if (opt) return opt.label
  }
  const [, rest] = value.split(':')
  return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : value
}
