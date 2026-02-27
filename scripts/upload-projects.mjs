// Upload local project images to Supabase and create project records.
// Run with: node --env-file=.env.local scripts/upload-projects.mjs

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = join(__dirname, '..', 'crochet project images')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const projects = [
  {
    file: 'IMG_2919.jpg',
    name: 'Mushroom Trinket Basket',
    description: 'A adorable lidded basket crocheted in the shape of a mushroom — beige granny-stitch body with a red spotted cap.',
    tags: ['home', 'gift', 'cottagecore', 'basket'],
  },
  {
    file: 'IMG_2920.jpg',
    name: 'Crochet Bookmarks',
    description: 'Slim crochet bookmarks with tassel ends, shown in dusty pink and olive green.',
    tags: ['accessories', 'gift', 'bookish'],
  },
  {
    file: 'IMG_2921.jpg',
    name: 'Lip Balm Keychain Holder',
    description: 'A petite crochet sleeve that holds a lip balm and clips onto your bag — functional and cute.',
    tags: ['accessories', 'gift', 'wearable'],
  },
  {
    file: 'IMG_2922.jpg',
    name: 'Baby Bonnet & Bloomer Set',
    description: 'A sweet newborn set featuring a striped bonnet in pink, sage, and brown paired with matching bloomers.',
    tags: ['baby', 'wearable', 'gift', 'set'],
  },
  {
    file: 'IMG_2923.jpg',
    name: 'Face Scrubbies Set',
    description: 'Reusable crochet face scrubbies in soft pink, grey, and cream — eco-friendly and gentle on skin.',
    tags: ['self-care', 'gift', 'home', 'eco'],
  },
  {
    file: 'IMG_2924.jpg',
    name: 'Mandala Drop Earrings',
    description: 'Delicate circular earrings crocheted in a mandala pattern using fine cream cotton thread.',
    tags: ['jewelry', 'wearable', 'accessories'],
  },
  {
    file: 'IMG_2925.jpg',
    name: 'Rainbow Cup Cozy',
    description: 'A pastel rainbow striped cup cozy with a crochet heart appliqué — perfect for your morning coffee.',
    tags: ['home', 'gift', 'accessories', 'colorwork'],
  },
  {
    file: 'IMG_2926.jpg',
    name: 'Crochet Scrunchie',
    description: 'A chunky, textured hair scrunchie crocheted in a warm peach cotton — shown mid-make with hook and yarn.',
    tags: ['accessories', 'wearable', 'hair'],
  },
  {
    file: 'IMG_2927.jpg',
    name: 'Granny Square Bonnet Set',
    description: 'Two matching bonnets in tan — a larger granny-stitch bonnet and a mini newborn version, with heart-shaped ties.',
    tags: ['baby', 'wearable', 'gift', 'granny square'],
  },
]

async function upload() {
  console.log(`Uploading ${projects.length} projects...\n`)

  for (const project of projects) {
    process.stdout.write(`  → ${project.name} ... `)

    const fileBuffer = await readFile(join(IMAGES_DIR, project.file))
    const imagePath = `images/${randomUUID()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(imagePath, fileBuffer, { contentType: 'image/jpeg' })

    if (uploadError) {
      console.error(`FAILED (upload): ${uploadError.message}`)
      continue
    }

    const { error: dbError } = await supabase
      .from('projects')
      .insert({
        name: project.name,
        description: project.description,
        tags: project.tags,
        image_path: imagePath,
      })

    if (dbError) {
      console.error(`FAILED (db): ${dbError.message}`)
      await supabase.storage.from('project-images').remove([imagePath])
      continue
    }

    console.log('done')
  }

  console.log('\nAll done. Open http://localhost:3000/explore to preview.')
}

upload().catch((err) => {
  console.error('Upload failed:', err)
  process.exit(1)
})
