type BadgeProps = {
  label: string
  onClick?: () => void
  active?: boolean
}

export default function Badge({ label, onClick, active }: BadgeProps) {
  const base =
    'inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors'
  const activeStyle = 'bg-charcoal text-white'
  const inactiveStyle = 'bg-white text-charcoal border border-gray-200 hover:border-gray-400'

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${active ? activeStyle : inactiveStyle} cursor-pointer`}
      >
        {label}
      </button>
    )
  }

  return (
    <span className={`${base} ${inactiveStyle}`}>
      {label}
    </span>
  )
}
