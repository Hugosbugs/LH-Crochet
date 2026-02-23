import Badge from '@/components/ui/Badge'

type TagFilterProps = {
  tags: string[]
  selected: string | null
  onSelect: (tag: string | null) => void
}

export default function TagFilter({ tags, selected, onSelect }: TagFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <Badge
        label="All"
        onClick={() => onSelect(null)}
        active={selected === null}
      />
      {tags.map((tag) => (
        <Badge
          key={tag}
          label={tag}
          onClick={() => onSelect(tag)}
          active={selected === tag}
        />
      ))}
    </div>
  )
}
