'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageUploadFieldProps = {
  onChange: (file: File | null) => void
  initialPreview?: string
}

export default function ImageUploadField({ onChange, initialPreview }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (preview && !initialPreview) URL.revokeObjectURL(preview)
    if (file) {
      setPreview(URL.createObjectURL(file))
      onChange(file)
    } else {
      setPreview(initialPreview ?? null)
      onChange(null)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        Image <span className="text-clay">*</span>
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-charcoal/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-sage/10 file:text-sage hover:file:bg-sage/20 cursor-pointer"
      />
      {preview && (
        <div className="relative w-full max-w-xs rounded-xl overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
            unoptimized={preview.startsWith('blob:')}
          />
        </div>
      )}
    </div>
  )
}
