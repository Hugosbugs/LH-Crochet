// Seed script: inserts 8 test projects with crochet-themed images
// Run with: node --env-file=.env.local scripts/seed.mjs
//
// Images sourced from loremflickr.com (real Flickr photos by keyword, CC licensed)

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const projects = [
  { name: 'Granny Square Blanket',  tags: ['blanket', 'granny square', 'gift'],   keyword: 'crochet,blanket',   w: 600, h: 820 },
  { name: 'Ocean Wave Cardigan',    tags: ['cardigan', 'wearable', 'blue'],        keyword: 'crochet,cardigan',  w: 600, h: 700 },
  { name: 'Mini Cactus Amigurumi', tags: ['amigurumi', 'plant', 'gift'],          keyword: 'amigurumi',         w: 600, h: 600 },
  { name: 'Chunky Ribbed Beanie',  tags: ['hat', 'wearable', 'winter'],           keyword: 'crochet,hat',       w: 600, h: 750 },
  { name: 'Rainbow Market Bag',    tags: ['bag', 'accessory', 'rainbow'],         keyword: 'crochet,bag,yarn',  w: 600, h: 900 },
  { name: 'Sunflower Pillow Cover',tags: ['home', 'pillow', 'yellow'],            keyword: 'crochet,pillow',    w: 600, h: 660 },
  { name: 'Lace Baby Bootees',     tags: ['baby', 'wearable', 'gift'],            keyword: 'crochet,baby',      w: 600, h: 720 },
  { name: 'Hexagon Patchwork Throw',tags: ['blanket', 'hexagon', 'colorwork'],   keyword: 'crochet,colorful',  w: 600, h: 850 },
]

async function fetchImage(keyword, w, h) {
  // loremflickr serves real Flickr CC-licensed photos by keyword
  const url = `https://loremflickr.com/${w}/${h}/${keyword}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} from loremflickr`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function clearExistingProjects() {
  process.stdout.write('Clearing existing projects ... ')
  const { data: existing } = await supabase.from('projects').select('image_path')
  if (existing?.length) {
    const paths = existing.map((p) => p.image_path).filter(Boolean)
    if (paths.length) {
      await supabase.storage.from('project-images').remove(paths)
    }
    await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  }
  console.log('done')
}

async function seed() {
  console.log('Seeding crochet test projects...\n')

  await clearExistingProjects()
  console.log()

  for (const project of projects) {
    process.stdout.write(`  → ${project.name} ... `)

    const imageBuffer = await fetchImage(project.keyword, project.w, project.h)

    const imagePath = `images/${randomUUID()}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(imagePath, imageBuffer, { contentType: 'image/jpeg' })

    if (uploadError) {
      console.error(`FAILED (upload): ${uploadError.message}`)
      continue
    }

    const { error: dbError } = await supabase
      .from('projects')
      .insert({ name: project.name, tags: project.tags, image_path: imagePath })

    if (dbError) {
      console.error(`FAILED (db): ${dbError.message}`)
      continue
    }

    console.log('done')
  }

  console.log('\nDone. Open http://localhost:3000 to preview.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
