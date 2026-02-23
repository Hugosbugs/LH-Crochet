'use client'

import { useState } from 'react'

type PatternUploadFieldProps = {
  onChange: (file: File | null) => void
  initialFilename?: string
}

export default function PatternUploadField({ onChange, initialFilename }: PatternUploadFieldProps) {
  const [filename, setFilename] = useState<string | null>(initialFilename ?? null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFilename(file?.name ?? initialFilename ?? null)
    onChange(file)
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        Pattern File <span className="text-charcoal/40 font-normal">(optional, PDF)</span>
      </label>
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="block w-full text-sm text-charcoal/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-sage/10 file:text-sage hover:file:bg-sage/20 cursor-pointer"
      />
      {filename && (
        <p className="text-sm text-charcoal/60">Selected: {filename}</p>
      )}
    </div>
  )
}
