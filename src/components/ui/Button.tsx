type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variants = {
  primary: 'bg-clay text-white hover:bg-clay/90',
  secondary: 'bg-sage text-white hover:bg-sage/90',
  ghost: 'bg-transparent text-charcoal border border-sage/40 hover:border-sage',
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
